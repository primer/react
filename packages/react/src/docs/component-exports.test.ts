import {readFileSync, readdirSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import ts from 'typescript'
import {expect, it} from 'vitest'

const workspace = fileURLToPath(new URL('../../', import.meta.url))
const src = path.join(workspace, 'src')
const tiers = ['', '/experimental', '/deprecated', '/next']

interface PackageManifest {
  name: string
  exports: Record<string, {default?: string; types?: string} | undefined>
}

interface ComponentDocsEntry {
  name: string
  importPath: string
  companions: Array<string>
  file: string
}

function sourceEntrypoint(pkg: PackageManifest, key: string) {
  const entrypoint = pkg.exports[key]
  const runtime = entrypoint?.default
  if (!runtime?.startsWith('./dist/') || !runtime.endsWith('.js')) {
    throw new Error(`Expected a JavaScript package entrypoint for "${key}".`)
  }
  const modulePath = runtime.slice(0, -'.js'.length)
  if (entrypoint?.types !== `${modulePath}.d.ts`) {
    throw new Error(`Expected matching runtime and declaration entrypoints for "${key}".`)
  }
  return path.join(src, `${modulePath.slice('./dist/'.length)}.ts`)
}

function sourceFile(program: ts.Program, file: string) {
  const source = program.getSourceFile(file)
  if (!source) {
    throw new Error(`Cannot resolve ${path.relative(workspace, file)}.`)
  }
  return source
}

function valueSymbol(checker: ts.TypeChecker, symbol: ts.Symbol | undefined) {
  const seen = new Set<ts.Symbol>()
  while (symbol && symbol.flags & ts.SymbolFlags.Alias) {
    if (
      seen.has(symbol) ||
      symbol.declarations?.some(declaration => {
        if (ts.isExportSpecifier(declaration) || ts.isImportSpecifier(declaration)) {
          return declaration.isTypeOnly || declaration.parent.parent.isTypeOnly
        }
        return ts.isImportClause(declaration) && declaration.isTypeOnly
      })
    ) {
      return undefined
    }
    seen.add(symbol)
    symbol = checker.getImmediateAliasedSymbol(symbol)
  }
  return symbol?.valueDeclaration ? symbol : undefined
}

function valueExports(checker: ts.TypeChecker, source: ts.SourceFile, seen = new Set<ts.SourceFile>()) {
  const result = new Map<string, ts.Symbol>()
  const module = checker.getSymbolAtLocation(source)
  if (!module || seen.has(source)) {
    return result
  }
  const next = new Set([...seen, source])
  const starExports = new Map<string, Set<ts.Symbol>>()
  for (const statement of source.statements) {
    if (
      ts.isExportDeclaration(statement) &&
      !statement.isTypeOnly &&
      !statement.exportClause &&
      statement.moduleSpecifier
    ) {
      const target = checker.getSymbolAtLocation(statement.moduleSpecifier)?.declarations?.find(ts.isSourceFile)
      if (target) {
        for (const [name, symbol] of valueExports(checker, target, next)) {
          const candidates = starExports.get(name) ?? new Set<ts.Symbol>()
          candidates.add(symbol)
          starExports.set(name, candidates)
        }
      }
    }
  }
  // The checker includes `export type *` in getExportsOfModule, so require a value export route.
  for (const exported of checker.getExportsOfModule(module)) {
    const symbol = valueSymbol(checker, exported)
    if (
      symbol &&
      (exported.declarations?.some(declaration => {
        return declaration.getSourceFile() === source
      }) ||
        starExports.get(exported.name)?.has(symbol))
    ) {
      result.set(exported.name, symbol)
    }
  }
  return result
}

function isReactType(symbol: ts.Symbol | undefined, names: ReadonlyArray<string>) {
  return (
    symbol &&
    names.includes(symbol.name) &&
    symbol.declarations?.some(declaration => {
      return /[/\\]node_modules[/\\](?:@types[/\\])?react[/\\]/.test(declaration.getSourceFile().fileName)
    })
  )
}

function returnsReact(type: ts.Type): boolean {
  if (
    isReactType(type.aliasSymbol, ['ReactNode']) ||
    isReactType(type.getSymbol(), ['ReactElement', 'ReactPortal', 'Element'])
  ) {
    return true
  }
  if (type.isUnion()) {
    const nonNullable = type.types.filter(member => {
      return !(member.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined))
    })
    return nonNullable.length > 0 && nonNullable.every(returnsReact)
  }
  return false
}

function isComponent(checker: ts.TypeChecker, symbol: ts.Symbol) {
  const type = checker.getTypeOfSymbol(symbol)
  // React 19 contexts can be used as providers in JSX but are still context objects.
  if (isReactType(type.getSymbol(), ['Context'])) {
    return false
  }
  const calls = type.getCallSignatures()
  if (
    calls.length > 0 &&
    calls.every(signature => {
      return returnsReact(signature.getReturnType())
    })
  ) {
    return true
  }
  return type.getConstructSignatures().some(signature => {
    const instance = signature.getReturnType()
    const render = instance.getProperty('render')
    return (
      instance.getProperty('props') &&
      instance.getProperty('setState') &&
      render &&
      checker
        .getTypeOfSymbol(render)
        .getCallSignatures()
        .some(method => {
          return returnsReact(method.getReturnType())
        })
    )
  })
}

function assignedTarget(checker: ts.TypeChecker, symbol: ts.Symbol) {
  const declaration = symbol.valueDeclaration
  if (!declaration) {
    return undefined
  }
  const assignment = ts.isExportAssignment(declaration)
    ? declaration.expression
    : ts.isVariableDeclaration(declaration)
      ? declaration.initializer
      : undefined
  if (assignment && ts.isCallExpression(assignment) && assignment.expression.getText() === 'Object.assign') {
    const target = assignment.arguments.at(0)
    return target && ts.isIdentifier(target) ? checker.getSymbolAtLocation(target) : undefined
  }
}

function sameComponent(
  checker: ts.TypeChecker,
  name: string,
  actual: ts.Symbol | undefined,
  docs: ComponentDocsEntry,
  expected: ts.Symbol | undefined,
) {
  if (!actual || !expected) {
    return false
  }
  if (actual === expected) {
    return true
  }
  // Breadcrumbs.tsx exports its deprecated Breadcrumb alias via a second Object.assign on the same component.
  if (name === 'Breadcrumb' && docs.name === 'Breadcrumbs' && docs.importPath === '@primer/react') {
    const target = assignedTarget(checker, expected)
    return target !== undefined && target === assignedTarget(checker, actual)
  }
  return false
}

function property(expression: ts.Expression, name: string) {
  if (!ts.isObjectLiteralExpression(expression)) {
    return undefined
  }
  for (const field of expression.properties) {
    if (
      ts.isPropertyAssignment(field) &&
      (ts.isIdentifier(field.name) || ts.isStringLiteral(field.name)) &&
      field.name.text === name
    ) {
      return field.initializer
    }
  }
}

function text(expression: ts.Expression | undefined) {
  return expression && ts.isStringLiteralLike(expression) ? expression.text : undefined
}

function readDocs(checker: ts.TypeChecker, symbol: ts.Symbol, defineComponent: ts.Symbol | undefined) {
  const declaration = symbol.valueDeclaration
  if (!declaration || !ts.isExportAssignment(declaration) || declaration.isExportEquals) {
    return undefined
  }
  const call = declaration.expression
  if (
    !ts.isCallExpression(call) ||
    !defineComponent ||
    valueSymbol(checker, checker.getSymbolAtLocation(call.expression)) !== defineComponent ||
    call.arguments.length !== 1
  ) {
    return undefined
  }
  const metadata = call.arguments[0]
  const name = text(property(metadata, 'name'))
  const importPath = text(property(metadata, 'importPath'))
  const subcomponents = property(metadata, 'subcomponents')
  if (!name || !importPath || !subcomponents || !ts.isArrayLiteralExpression(subcomponents)) {
    return undefined
  }
  const companions: Array<string> = []
  for (const row of subcomponents.elements) {
    const member = text(property(row, 'name'))
    if (!member) {
      return undefined
    }
    if (!member.includes('.')) {
      companions.push(member)
    }
  }
  return {name, importPath, companions, file: path.relative(workspace, declaration.getSourceFile().fileName)}
}

it('exports the typed docs for every public React component', () => {
  const pkg: PackageManifest = JSON.parse(readFileSync(path.join(workspace, 'package.json'), 'utf8'))
  const pairs = tiers.map(suffix => {
    return {
      importPath: `${pkg.name}${suffix}`,
      docsPath: `${pkg.name}/docs${suffix}`,
      runtime: sourceEntrypoint(pkg, `.${suffix}`),
      docs: sourceEntrypoint(pkg, `./docs${suffix}`),
    }
  })
  const docsFiles = readdirSync(src, {recursive: true, withFileTypes: true})
    .filter(entry => {
      return entry.isFile() && entry.name.endsWith('.docs.ts')
    })
    .map(entry => {
      return path.join(entry.parentPath, entry.name)
    })
  const config = ts.getParsedCommandLineOfConfigFile(
    path.join(workspace, 'tsconfig.json'),
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic(diagnostic) {
        throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
      },
    },
  )
  if (!config || config.errors.length) {
    const errors = config?.errors.map(error => {
      return ts.flattenDiagnosticMessageText(error.messageText, '\n')
    })
    throw new Error(`Cannot load the React TypeScript config: ${errors?.join('\n') ?? 'missing config'}`)
  }
  const defineComponentFile = path.join(src, 'docs/component.ts')
  const rootNames = [
    ...pairs.flatMap(pair => {
      return [pair.runtime, pair.docs]
    }),
    ...docsFiles,
    defineComponentFile,
    ...config.fileNames.filter(file => {
      return file.endsWith('.d.ts')
    }),
  ]
  const program = ts.createProgram({rootNames, options: config.options})
  const checker = program.getTypeChecker()
  const defineComponent = valueExports(checker, sourceFile(program, defineComponentFile)).get('defineComponent')
  const components = new Map(
    pairs.map(pair => {
      const exports = valueExports(checker, sourceFile(program, pair.runtime))
      return [
        pair.importPath,
        new Map(
          [...exports].filter(([name, symbol]) => {
            // Capitalized JSX names reference component values instead of intrinsic elements.
            return /^[A-Z]/.test(name) && isComponent(checker, symbol)
          }),
        ),
      ]
    }),
  )
  const issues: Array<string> = []
  const definitions = new Map<ts.Symbol, ComponentDocsEntry>()
  for (const file of docsFiles) {
    const symbol = valueExports(checker, sourceFile(program, file)).get('default')
    const docs = symbol && readDocs(checker, symbol, defineComponent)
    if (!symbol || !docs || symbol.valueDeclaration?.getSourceFile().fileName !== file) {
      issues.push(
        `${path.relative(workspace, file)}: expected its own default defineComponent metadata with literal names and importPath.`,
      )
      continue
    }
    definitions.set(symbol, docs)
    const canonical = components.get(docs.importPath)
    if (!canonical?.has(docs.name)) {
      issues.push(
        `${docs.file}: ${docs.importPath} does not export React component "${docs.name}". Check name and importPath.`,
      )
    }
    for (const companion of docs.companions) {
      if (!canonical?.has(companion)) {
        issues.push(`${docs.file}: ${docs.importPath} does not export companion component "${companion}".`)
      }
    }
  }
  const exportedDefinitions = new Set<ComponentDocsEntry>()
  const canonicalDefinitions = new Set<ComponentDocsEntry>()
  for (const pair of pairs) {
    const publicComponents = components.get(pair.importPath) ?? new Map<string, ts.Symbol>()
    const covered = new Set<string>()
    const barrel = sourceFile(program, pair.docs)
    for (const diagnostic of program.getSemanticDiagnostics(barrel)) {
      issues.push(`${pair.docsPath}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)
    }
    for (const [name, symbol] of valueExports(checker, barrel)) {
      const subject = `${pair.docsPath} exports "${name}"`
      const docs = definitions.get(symbol)
      if (!docs) {
        const origin = symbol.valueDeclaration?.getSourceFile().fileName
        issues.push(
          `${subject}: expected the default of a .docs.ts definition${origin ? `, got ${path.relative(workspace, origin)}` : ''}.`,
        )
        continue
      }
      exportedDefinitions.add(docs)
      const canonical = components.get(docs.importPath)
      if (!sameComponent(checker, name, publicComponents.get(name), docs, canonical?.get(docs.name))) {
        issues.push(
          `${subject}: ${docs.file} documents ${docs.importPath} "${docs.name}", not the matching public component.`,
        )
        continue
      }
      covered.add(name)
      if (name === docs.name && pair.importPath === docs.importPath) {
        canonicalDefinitions.add(docs)
      }
      if (name === docs.name) {
        for (const companion of docs.companions) {
          const component = canonical?.get(companion)
          if (component && publicComponents.get(companion) === component) {
            covered.add(companion)
          }
        }
      }
    }
    for (const name of publicComponents.keys()) {
      if (!covered.has(name)) {
        issues.push(
          `${pair.importPath} "${name}": add or re-export matching .docs.ts metadata from ${path.relative(workspace, pair.docs)}.`,
        )
      }
    }
  }
  for (const docs of definitions.values()) {
    if (!exportedDefinitions.has(docs)) {
      issues.push(
        `${docs.file}: orphan .docs.ts module; re-export it as "${docs.name}" from the docs entrypoint for ${docs.importPath}.`,
      )
    } else if (!canonicalDefinitions.has(docs)) {
      issues.push(
        `${docs.file}: not re-exported as "${docs.name}" from the docs entrypoint for its declared importPath ${docs.importPath}.`,
      )
    }
  }
  expect(issues.sort()).toEqual([])
})
