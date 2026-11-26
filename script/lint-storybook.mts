import {readFileSync} from 'node:fs'
import path from 'node:path'
import {parseArgs} from 'node:util'
import glob from 'fast-glob'
import ts from 'typescript'

export function lintStory(filename: string, source: string): string[] {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const variables = new Map<string, ts.Expression>()
  const assignments = new Map<string, Map<string, ts.Expression>>()
  const exports = new Map<string, ts.Expression | undefined>()
  let meta: ts.Expression | undefined

  for (const statement of file.statements) {
    if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      meta = statement.expression
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) {
          if (declaration.initializer) variables.set(declaration.name.text, declaration.initializer)
          if (statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
            exports.set(declaration.name.text, declaration.name)
          }
        }
      }
    } else if (ts.isFunctionDeclaration(statement) && statement.name) {
      if (statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
        exports.set(statement.name.text, statement.name)
      }
    } else if (ts.isExportDeclaration(statement) && statement.exportClause && !statement.isTypeOnly) {
      if (ts.isNamedExports(statement.exportClause) && !statement.moduleSpecifier) {
        for (const element of statement.exportClause.elements) {
          if (!element.isTypeOnly) exports.set(element.name.text, element.propertyName ?? element.name)
        }
      }
    } else if (ts.isExpressionStatement(statement) && ts.isBinaryExpression(statement.expression)) {
      const {left, right, operatorToken} = statement.expression
      if (
        operatorToken.kind === ts.SyntaxKind.EqualsToken &&
        ts.isPropertyAccessExpression(left) &&
        ts.isIdentifier(left.expression)
      ) {
        const properties = assignments.get(left.expression.text) ?? new Map<string, ts.Expression>()
        properties.set(left.name.text, right)
        assignments.set(left.expression.text, properties)
      }
    }
  }

  function resolve(node: ts.Expression | undefined, seen = new Set<string>()): ts.Expression | undefined {
    if (!node) return undefined
    if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
      return resolve(node.expression, seen)
    }
    if (ts.isIdentifier(node) && variables.has(node.text)) {
      if (seen.has(node.text)) return undefined
      seen.add(node.text)
      return resolve(variables.get(node.text), seen)
    }
    return node
  }

  function property(node: ts.Expression | undefined, name: string): ts.Expression | undefined {
    if (node && ts.isIdentifier(node)) {
      const assigned = assignments.get(node.text)?.get(name)
      if (assigned) return assigned
    }
    const object = resolve(node)
    if (!object || !ts.isObjectLiteralExpression(object)) return undefined
    for (const member of [...object.properties].reverse()) {
      if (
        member.name &&
        (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)) &&
        member.name.text === name
      ) {
        if (ts.isPropertyAssignment(member)) return member.initializer
        if (ts.isShorthandPropertyAssignment(member)) return member.name
      }
    }
    return undefined
  }

  function entries(node: ts.Expression | undefined): Array<[string, ts.Expression]> {
    const object = resolve(node)
    if (!object || !ts.isObjectLiteralExpression(object)) return []
    return object.properties.flatMap<[string, ts.Expression]>(member => {
      if (ts.isPropertyAssignment(member) && (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))) {
        return [[member.name.text, member.initializer]]
      }
      if (ts.isShorthandPropertyAssignment(member)) return [[member.name.text, member.name]]
      return []
    })
  }

  function matchesFilter(node: ts.Expression | undefined, name: string): boolean | undefined {
    const filter = resolve(node)
    if (filter && ts.isArrayLiteralExpression(filter)) {
      return filter.elements.some(element => ts.isStringLiteral(element) && element.text === name)
    }
    if (filter && ts.isRegularExpressionLiteral(filter)) {
      const lastSlash = filter.text.lastIndexOf('/')
      return new RegExp(filter.text.slice(1, lastSlash), filter.text.slice(lastSlash + 1)).test(name)
    }
    return undefined
  }

  const errors: string[] = []
  const titleNode = resolve(property(meta, 'title'))
  const title =
    titleNode && (ts.isStringLiteral(titleNode) || ts.isNoSubstitutionTemplateLiteral(titleNode))
      ? titleNode.text
      : undefined
  if (title && /^(Behaviors|Hooks|Octicons)\//.test(title)) return errors

  const basename = path.basename(filename)
  const match = /^([^.]+)(?:\.[^.]+)*?(?:\.(features|examples|dev))?\.stories\.tsx$/.exec(basename)
  if (!match) {
    errors.push('Use <ComponentName>[.<topic>][.features|.examples|.dev].stories.tsx.')
    return errors
  }
  const [, component, category] = match
  if (!category && basename !== `${component}.stories.tsx`) {
    errors.push('Split stories must use a .features, .examples, or .dev suffix before .stories.tsx.')
  }
  const suffix = category ? `/${category[0].toUpperCase()}${category.slice(1)}` : ''
  const expected = `Components/${component}${suffix}`
  const titleWithoutPrefix = title?.replace(/^(Experimental|Deprecated|Private)\//, '')
  const titleParts = titleWithoutPrefix?.split('/') ?? []
  const componentIndex = titleParts.lastIndexOf(component)
  const validTitle =
    titleParts[0] === 'Components' &&
    componentIndex > 0 &&
    (category ? titleParts[componentIndex + 1] === suffix.slice(1) : componentIndex === titleParts.length - 1)
  const stressTest = basename === `${component}.stress.dev.stories.tsx`
  if (!(stressTest ? title === `StressTests/Components/${component}` : validTitle)) {
    errors.push(
      `Use title '${stressTest ? `StressTests/Components/${component}` : expected}' (preserve existing groups/prefixes).`,
    )
  }

  if (!category) {
    for (const name of ['Default', 'Playground']) {
      if (!exports.has(name)) errors.push(`Component stories must export ${name}.`)
    }
    if (exports.has('Playground')) {
      const playground = exports.get('Playground')
      const metaControls = property(property(meta, 'parameters'), 'controls')
      const storyControls = property(property(playground, 'parameters'), 'controls')
      const controlsDisabled =
        resolve(property(storyControls, 'disable') ?? property(metaControls, 'disable'))?.kind ===
        ts.SyntaxKind.TrueKeyword
      const include = property(storyControls, 'include') ?? property(metaControls, 'include')
      const exclude = property(storyControls, 'exclude') ?? property(metaControls, 'exclude')
      const argTypes = new Map([...entries(property(meta, 'argTypes')), ...entries(property(playground, 'argTypes'))])
      const args = new Map([...entries(property(meta, 'args')), ...entries(property(playground, 'args'))])
      const exposedControls = new Set([...argTypes.keys(), ...args.keys()])
      const hasControls = [...exposedControls].some(name => {
        if ((include && matchesFilter(include, name) !== true) || (exclude && matchesFilter(exclude, name) !== false)) {
          return false
        }
        const argType = argTypes.get(name)
        const control = resolve(property(argType, 'control'))
        if (
          control?.kind === ts.SyntaxKind.FalseKeyword ||
          control?.kind === ts.SyntaxKind.NullKeyword ||
          resolve(property(property(argType, 'table'), 'disable'))?.kind === ts.SyntaxKind.TrueKeyword
        ) {
          return false
        }
        if (control) {
          const type = ts.isObjectLiteralExpression(control) ? resolve(property(control, 'type')) : control
          return !!type && ts.isStringLiteral(type) && type.text.length > 0
        }
        const type = resolve(property(argType, 'type'))
        const typeName = type && ts.isObjectLiteralExpression(type) ? resolve(property(type, 'name')) : type
        if (
          typeName &&
          ts.isStringLiteral(typeName) &&
          ['string', 'number', 'boolean', 'enum'].includes(typeName.text)
        ) {
          return true
        }
        return !!property(meta, 'component') && args.has(name)
      })
      if (controlsDisabled || !hasControls) {
        errors.push(
          'Playground must expose controls: provide enabled argTypes, or component with nonempty args for inference.',
        )
      }
    }
  }

  return errors
}

if (import.meta.main) {
  const {positionals, values} = parseArgs({
    allowPositionals: true,
    options: {help: {type: 'boolean', short: 'h'}},
  })
  if (values.help) {
    process.stdout.write(
      'Usage: npm run lint:storybook -- [file-or-glob ...]\nDefaults to packages/react/src/**/*.stories.{js,jsx,ts,tsx}\n',
    )
  } else {
    const patterns = positionals.length ? positionals : ['packages/react/src/**/*.stories.{js,jsx,ts,tsx}']
    const files = new Set<string>()
    for (const pattern of patterns) {
      const matches = glob.sync(pattern, {onlyFiles: true})
      if (!matches.length) {
        process.stderr.write(`No story files matched: ${pattern}\n`)
        process.exitCode = 1
      }
      for (const filename of matches) files.add(filename)
    }
    let violations = 0
    for (const filename of [...files].sort()) {
      const errors = lintStory(filename, readFileSync(filename, 'utf8'))
      for (const error of errors) process.stderr.write(`${filename}: ${error}\n`)
      violations += errors.length
    }
    if (violations) process.exitCode = 1
    process.stdout.write(`Checked ${files.size} story files; ${violations} convention violations.\n`)
  }
}
