import type {Plugin} from 'rolldown'
import ts from 'typescript'
import type {ComponentDocs} from '../src/docs/component'

type Prop = ComponentDocs['props'][number]
type Table = Pick<ComponentDocs, 'name' | 'props' | 'passthrough'>
type PropsDocs = Pick<ComponentDocs, 'name' | 'importPath' | 'props' | 'passthrough'> & {
  subcomponents: Array<Table>
  relatedTypes: Array<Table>
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
  }
}

function fileName({name, importPath}: PropsDocs) {
  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    throw new Error(`Unsafe component name: ${JSON.stringify(name)}.`)
  }
  switch (importPath) {
    case '@primer/react':
      return `docs/components/${name}/props.md`
    case '@primer/react/deprecated':
    case '@primer/react/experimental':
    case '@primer/react/next':
      return `docs/${importPath.slice('@primer/react/'.length)}/components/${name}/props.md`
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

function proseText(value: string) {
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

function prose(value: string) {
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
    parts.push(proseText(value.slice(start, openers.lastIndex - fence.length)))
    if (line.includes('\\|')) {
      const normalized = /^ .* $/.test(line) && /[^ ]/.test(line) ? line.slice(1, -1) : line
      parts.push(escapedCode(normalized))
    } else {
      parts.push(`${fence}${line.replaceAll('|', '\\|')}${fence}`)
    }
    start = openers.lastIndex = closers.lastIndex
  }
  parts.push(proseText(value.slice(start)))
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

export function docs(): Plugin {
  const assets = new Map<string, {name: string; source: string}>()
  return {
    name: 'primer-docs',
    transform: {
      filter: {id: /\.docs\.ts$/},
      handler(code, id) {
        try {
          const metadata = readPropsDocs(code, id)
          assets.set(id, {name: fileName(metadata), source: render(metadata)})
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
        const asset = assets.get(id)
        if (!asset) {
          continue
        }
        const key = asset.name.toLowerCase()
        const previous = names.get(key)
        if (previous !== undefined) {
          this.error(`Conflicting props documentation path ${asset.name}: ${previous} and ${id}.`)
        }
        names.set(key, id)
        this.emitFile({type: 'asset', fileName: asset.name, source: asset.source})
      }
    },
  }
}
