import type {Plugin} from 'rolldown'
import ts from 'typescript'
import type {BuiltInBehavior, ComponentDocs, DefaultBehavior, UsageGuideline} from '../src/docs/component'

type Prop = ComponentDocs['props'][number]
type Table = Pick<ComponentDocs, 'name' | 'props' | 'passthrough'>
type PropsDocs = Pick<ComponentDocs, 'name' | 'importPath' | 'props' | 'passthrough'> & {
  subcomponents: Array<Table>
  relatedTypes: Array<Table>
  builtInBehaviors: Array<BuiltInBehavior>
  defaultBehaviors: Array<DefaultBehavior>
  usageGuidelines: Array<UsageGuideline>
}

type Literal = string | boolean | Array<Literal> | LiteralObject
interface LiteralObject {
  [key: string]: Literal | undefined
}

function literal(node: ts.Expression): Literal {
  if (ts.isStringLiteralLike(node)) {
    return node.text
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword) {
    return node.kind === ts.SyntaxKind.TrueKeyword
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(literal)
  }
  if (ts.isObjectLiteralExpression(node)) {
    const fields = new Map<string, Literal>()
    for (const prop of node.properties) {
      if (!ts.isPropertyAssignment(prop) || !(ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))) {
        throw new Error('Expected literal metadata fields.')
      }
      if (fields.has(prop.name.text)) {
        throw new Error(`Duplicate metadata field: ${prop.name.text}.`)
      }
      fields.set(prop.name.text, literal(prop.initializer))
    }
    return Object.fromEntries(fields)
  }
  throw new Error(`Unsupported metadata expression: ${ts.SyntaxKind[node.kind]}.`)
}

function object(value: Literal | undefined, field: string): LiteralObject {
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Expected an object for ${field}.`)
  }
  return value
}

function string(value: Literal | undefined, field: string) {
  if (typeof value !== 'string') {
    throw new Error(`Expected a string for ${field}.`)
  }
  return value
}

function array(value: Literal | undefined, field: string) {
  if (!Array.isArray(value)) {
    throw new Error(`Expected an array for ${field}.`)
  }
  return value
}

function readTable(value: Literal | undefined, field: string): Table {
  const data = object(value, field)
  const name = string(data.name, `${field}.name`)
  const props: Array<Prop> = array(data.props, `${name}.props`).map(value => {
    const prop = object(value, `${name}.props`)
    const propName = string(prop.name, `${name}.props.name`)
    const qualified = `${name}.${propName}`
    if (typeof prop.required !== 'boolean') {
      throw new Error(`Expected a boolean for ${qualified}.required.`)
    }
    return {
      name: propName,
      type: string(prop.type, `${qualified}.type`),
      description: string(prop.description, `${qualified}.description`),
      required: prop.required,
      defaultValue:
        prop.defaultValue === undefined ? undefined : string(prop.defaultValue, `${qualified}.defaultValue`),
    }
  })
  if (data.passthrough === undefined) {
    return {name, props}
  }
  const passthrough = object(data.passthrough, `${name}.passthrough`)
  return {
    name,
    props,
    passthrough: {
      element: string(passthrough.element, `${name}.passthrough.element`),
      url: string(passthrough.url, `${name}.passthrough.url`),
    },
  }
}

function readNonEmptyString(value: Literal | undefined, field: string) {
  const result = string(value, field)
  if (result.length === 0) {
    throw new Error(`Expected a nonempty string for ${field}.`)
  }
  return result
}

function readOptionalStringArray(value: Literal | undefined, field: string): Array<string> | undefined {
  if (value === undefined) {
    return undefined
  }
  return array(value, field).map((item, index) => readNonEmptyString(item, `${field}[${index}]`))
}

function readBuiltInBehaviors(value: Literal | undefined): Array<BuiltInBehavior> {
  if (value === undefined) {
    return []
  }
  return array(value, 'builtInBehaviors').map((entry, index) => {
    const data = object(entry, `builtInBehaviors[${index}]`)
    const id = readNonEmptyString(data.id, `builtInBehaviors[${index}].id`)
    const description = readNonEmptyString(data.description, `builtInBehaviors[${index}].description`)
    const related = readOptionalStringArray(data.related, `builtInBehaviors[${index}].related`)
    return related ? {id, description, related} : {id, description}
  })
}

function readDefaultBehaviors(value: Literal | undefined): Array<DefaultBehavior> {
  if (value === undefined) {
    return []
  }
  return array(value, 'defaultBehaviors').map((entry, index) => {
    const data = object(entry, `defaultBehaviors[${index}]`)
    const id = readNonEmptyString(data.id, `defaultBehaviors[${index}].id`)
    const description = readNonEmptyString(data.description, `defaultBehaviors[${index}].description`)
    const overriddenBy = array(data.overriddenBy, `defaultBehaviors[${index}].overriddenBy`).map((prop, propIndex) =>
      readNonEmptyString(prop, `defaultBehaviors[${index}].overriddenBy[${propIndex}]`),
    )
    if (overriddenBy.length === 0) {
      throw new Error(`Expected at least one entry in defaultBehaviors[${index}].overriddenBy.`)
    }
    const related = readOptionalStringArray(data.related, `defaultBehaviors[${index}].related`)
    return related ? {id, description, overriddenBy, related} : {id, description, overriddenBy}
  })
}

function readUsageGuidelines(value: Literal | undefined): Array<UsageGuideline> {
  if (value === undefined) {
    return []
  }
  return array(value, 'usageGuidelines').map((entry, index) => {
    const data = object(entry, `usageGuidelines[${index}]`)
    const id = readNonEmptyString(data.id, `usageGuidelines[${index}].id`)
    const guidance = string(data.guidance, `usageGuidelines[${index}].guidance`)
    if (guidance !== 'do' && guidance !== 'dont') {
      throw new Error(`Expected "do" or "dont" for usageGuidelines[${index}].guidance.`)
    }
    const check = string(data.check, `usageGuidelines[${index}].check`)
    if (check !== 'runtime' && check !== 'review') {
      throw new Error(`Expected "runtime" or "review" for usageGuidelines[${index}].check.`)
    }
    const description = readNonEmptyString(data.description, `usageGuidelines[${index}].description`)
    const related = readOptionalStringArray(data.related, `usageGuidelines[${index}].related`)
    return related ? {id, guidance, check, description, related} : {id, guidance, check, description}
  })
}

function readPropsDocs(code: string, id: string): PropsDocs {
  const source = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true)
  const assignment = source.statements.find(ts.isExportAssignment)
  if (
    !assignment ||
    assignment.isExportEquals ||
    !ts.isCallExpression(assignment.expression) ||
    !ts.isIdentifier(assignment.expression.expression) ||
    assignment.expression.expression.text !== 'defineComponent' ||
    assignment.expression.arguments.length !== 1
  ) {
    throw new Error('Expected a default export of defineComponent with one literal object argument.')
  }
  const data = object(literal(assignment.expression.arguments[0]), 'defineComponent')
  return {
    ...readTable(data, 'component'),
    importPath: string(data.importPath, 'importPath'),
    subcomponents: array(data.subcomponents, 'subcomponents').map(value => {
      return readTable(value, 'subcomponent')
    }),
    relatedTypes:
      data.relatedTypes === undefined
        ? []
        : array(data.relatedTypes, 'relatedTypes').map(value => {
            return readTable(value, 'related type')
          }),
    builtInBehaviors: readBuiltInBehaviors(data.builtInBehaviors),
    defaultBehaviors: readDefaultBehaviors(data.defaultBehaviors),
    usageGuidelines: readUsageGuidelines(data.usageGuidelines),
  }
}

function fileName({name, importPath}: PropsDocs, topic: 'props.md' | 'guidelines.md') {
  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    throw new Error(`Unsafe component name: ${JSON.stringify(name)}.`)
  }
  switch (importPath) {
    case '@primer/react':
      return `docs/components/${name}/${topic}`
    case '@primer/react/deprecated':
    case '@primer/react/experimental':
    case '@primer/react/next':
      return `docs/${importPath.slice('@primer/react/'.length)}/components/${name}/${topic}`
    default:
      throw new Error(`Unsupported component importPath: ${JSON.stringify(importPath)}.`)
  }
}

// eslint-disable-next-line github/unescaped-html-literal -- A fixed Markdown line break, not interpolated HTML.
const markdownLineBreak = '<br>'

function escapedCode(value: string) {
  // GFM needs an odd number of slashes before a pipe, but code spans preserve the remaining slashes.
  const escaped = value.replace(/[!-/:-@[-`{-~]/g, character => {
    return `&#${character.charCodeAt(0)};`
  })
  // eslint-disable-next-line github/unescaped-html-literal -- All Markdown and HTML punctuation is encoded above.
  return `<code>${escaped}</code>`
}

function inlineCode(value: string) {
  return value
    .split(/\r\n?|\n/)
    .map(line => {
      if (line.includes('\\|')) {
        return escapedCode(line)
      }
      const escaped = line.replaceAll('|', '\\|')
      const longest = Math.max(0, ...[...escaped.matchAll(/`+/g)].map(match => match[0].length))
      const fence = '`'.repeat(longest + 1)
      const pad = /^`|`$|^ | $/.test(escaped) ? ' ' : ''
      return `${fence}${pad}${escaped}${pad}${fence}`
    })
    .join(markdownLineBreak)
}

function proseText(value: string, escapePipes: boolean) {
  if (!escapePipes) {
    return value.replace(/[<>]|\r\n?|\n/g, match => {
      if (match === '<') {
        return '&lt;'
      }
      if (match === '>') {
        return '&gt;'
      }
      return markdownLineBreak
    })
  }
  return value.replace(/(\\*)\||[<>]|\r\n?|\n/g, (match, escapes: string | undefined) => {
    if (escapes !== undefined) {
      return escapes.length % 2 ? match : `${escapes}\\|`
    }
    if (match === '<') {
      return '&lt;'
    }
    if (match === '>') {
      return '&gt;'
    }
    return markdownLineBreak
  })
}

function prose(value: string, {escapePipes = true}: {escapePipes?: boolean} = {}) {
  const openers = /(\\*)(`+)/g
  const closers = /`+/g
  const parts: Array<string> = []
  let start = 0
  let opening: RegExpExecArray | null
  while ((opening = openers.exec(value))) {
    const [, escapes, ticks] = opening
    // Outside code an odd escape run consumes only the first backtick. Inside code it consumes none.
    const fence = escapes.length % 2 ? ticks.slice(1) : ticks
    if (!fence) {
      continue
    }
    closers.lastIndex = openers.lastIndex
    let closing: RegExpExecArray | null
    do {
      closing = closers.exec(value)
    } while (closing && closing[0].length !== fence.length)
    if (!closing) {
      continue
    }
    const line = value.slice(openers.lastIndex, closing.index).replace(/\r\n?|\n/g, ' ')
    parts.push(proseText(value.slice(start, openers.lastIndex - fence.length), escapePipes))
    if (escapePipes && line.includes('\\|')) {
      const normalized = /^ .* $/.test(line) && /[^ ]/.test(line) ? line.slice(1, -1) : line
      parts.push(escapedCode(normalized))
    } else if (escapePipes) {
      parts.push(`${fence}${line.replaceAll('|', '\\|')}${fence}`)
    } else {
      parts.push(`${fence}${line}${fence}`)
    }
    start = openers.lastIndex = closers.lastIndex
  }
  parts.push(proseText(value.slice(start), escapePipes))
  return parts.join('')
}

function renderTable({props, passthrough}: Table) {
  const lines: Array<string> = []
  if (passthrough) {
    const {element, url} = passthrough
    if (!/^(?:https?:\/\/|\/(?!\/))[^\s<>\\]+$/i.test(url)) {
      throw new Error(`Unsupported passthrough URL: ${JSON.stringify(url)}.`)
    }
    lines.push(`Accepts additional props for [${inlineCode(element)}](<${url}>).`, '')
  }
  if (!props.length) {
    return [...lines, 'No props are documented.', '']
  }
  lines.push('| Prop | Type | Required | Default | Description |', '| --- | --- | --- | --- | --- |')
  for (const prop of props) {
    const fields = [
      inlineCode(prop.name),
      inlineCode(prop.type),
      prop.required ? 'Yes' : 'No',
      prop.defaultValue === undefined ? '' : inlineCode(prop.defaultValue === '' ? "''" : prop.defaultValue),
      prose(prop.description),
    ]
    lines.push(`| ${fields.join(' | ')} |`)
  }
  return [...lines, '']
}

function render(docs: PropsDocs) {
  const lines = [`# ${docs.name} props`, '', ...renderTable(docs)]
  for (const [heading, tables] of [
    ['Subcomponents', docs.subcomponents],
    ['Related types', docs.relatedTypes],
  ] as const) {
    if (tables.length) {
      lines.push(`## ${heading}`, '')
      for (const table of tables) {
        lines.push(`### ${inlineCode(table.name)}`, '', ...renderTable(table))
      }
    }
  }
  return lines.join('\n')
}

function renderGuidelines(docs: PropsDocs): string | null {
  if (!docs.builtInBehaviors.length && !docs.defaultBehaviors.length && !docs.usageGuidelines.length) {
    return null
  }
  const lines = [`# ${docs.name} guidelines`, '']
  if (docs.builtInBehaviors.length) {
    lines.push('## Built-in behaviors', '')
    for (const behavior of docs.builtInBehaviors) {
      lines.push(`- **${inlineCode(behavior.id)}**: ${prose(behavior.description, {escapePipes: false})}`)
    }
    lines.push('')
  }
  if (docs.defaultBehaviors.length) {
    lines.push('## Default behaviors', '', '| ID | Behavior | Override |', '| --- | --- | --- |')
    for (const behavior of docs.defaultBehaviors) {
      const overrides = behavior.overriddenBy.map(inlineCode).join(', ')
      lines.push(`| ${inlineCode(behavior.id)} | ${prose(behavior.description)} | ${overrides} |`)
    }
    lines.push('')
  }
  if (docs.usageGuidelines.length) {
    const ordered = [
      ...docs.usageGuidelines.filter(item => item.guidance === 'do'),
      ...docs.usageGuidelines.filter(item => item.guidance === 'dont'),
    ]
    lines.push('## Usage guidelines', '', '| Rule | Guidance | Check | Description |', '| --- | --- | --- | --- |')
    for (const rule of ordered) {
      const guidance = rule.guidance === 'do' ? 'Do' : "Don't"
      const check = rule.check === 'runtime' ? 'Runtime' : 'Review'
      lines.push(`| ${inlineCode(rule.id)} | ${guidance} | ${check} | ${prose(rule.description)} |`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

export function docs(): Plugin {
  const assets = new Map<string, Array<{name: string; source: string}>>()
  return {
    name: 'primer-docs',
    transform: {
      filter: {id: /\.docs\.ts$/},
      handler(code, id) {
        try {
          const metadata = readPropsDocs(code, id)
          const emitted = [{name: fileName(metadata, 'props.md'), source: render(metadata)}]
          const guidelines = renderGuidelines(metadata)
          if (guidelines !== null) {
            emitted.push({name: fileName(metadata, 'guidelines.md'), source: guidelines})
          }
          assets.set(id, emitted)
        } catch (error) {
          this.error(`${id}: ${error instanceof Error ? error.message : String(error)}`)
        }
        return null
      },
    },
    generateBundle() {
      const names = new Map<string, string>()
      // The current graph excludes removed modules, while cached transforms can still supply assets.
      for (const id of [...this.getModuleIds()].sort()) {
        const moduleAssets = assets.get(id)
        if (!moduleAssets) {
          continue
        }
        for (const asset of moduleAssets) {
          const key = asset.name.toLowerCase()
          const previous = names.get(key)
          if (previous !== undefined) {
            this.error(`Conflicting props documentation path ${asset.name}: ${previous} and ${id}.`)
          }
          names.set(key, id)
          this.emitFile({type: 'asset', fileName: asset.name, source: asset.source})
        }
      }
    },
  }
}
