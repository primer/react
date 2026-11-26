type ComponentDocs = {
  name: string
  displayName: string
  status: 'stable' | 'experimental' | 'deprecated'
  keywords: Array<string>
  props: Array<ComponentProp>
  subcomponents: Array<Subcomponent>
  stories: Array<string>
  importPath: string
  usage: ComponentUsage
  // Can build docs or examples off of this
  // playground: {}
  // Ways to theme, customize, or extend the component
  // theming: {}
  // Composition considerations
  // composition: {}
  // Dev notes
  // dev: {}
  // Accessibility considerations, could be contained in dev? or could be its
  // own public-facing section
  // accessibility: {}
}

type Subcomponent = {
  name: string
  displayName: string
  props: Array<ComponentProp>
}

type ComponentProp = {
  name: string
  type: string
  description: string
  required: boolean
  defaultValue?: string
}

type ComponentUsage = {
  description: string
  bestPractices: Array<BestPractice>
  anatomy: Array<ComponentAnatomy>
}

type BestPractice = {
  guidance: boolean
  description: string
}

type ComponentAnatomy = {
  name: string
  required: boolean
  description: string
}

function defineComponent<const T extends ComponentDocs>(component: T): T {
  return component
}

function inlineCode(value: string) {
  if (!value) {
    return ''
  }

  const text = value.replace(/\r\n?|\n/g, ' ')
  const delimiter = '`'.repeat(
    Math.max(
      0,
      ...Array.from(text.matchAll(/`+/g), match => {
        return match[0].length
      }),
    ) + 1,
  )
  const needsPadding =
    text.startsWith('`') || text.endsWith('`') || (text.startsWith(' ') && text.endsWith(' ') && text.trim() !== '')
  return needsPadding ? `${delimiter} ${text} ${delimiter}` : `${delimiter}${text}${delimiter}`
}

function tableCell(value: string) {
  // eslint-disable-next-line github/unescaped-html-literal -- A fixed line break keeps Markdown table rows on one source line.
  return value.replace(/(?<!\\)((?:\\\\)*)\|/g, '$1\\|').replace(/\r\n?|\n/g, '<br>')
}

function tableCode(value: string) {
  if (!/(?<!\\)(?:\\\\)*\\\|/.test(value)) {
    return inlineCode(value)
  }

  // GFM code spans drop a backslash here. Encode the literal so Markdown cannot reinterpret it.
  const encoded = Array.from(value.replace(/\r\n?|\n/g, ' '), character => {
    const reference = `&#${character.codePointAt(0)};`
    // Break autolinks in parsers that recognize them after decoding character references.
    return /[:@wW]/.test(character) ? `${reference}<!-- -->` : reference
  }).join('')
  // eslint-disable-next-line github/unescaped-html-literal -- All interpolated characters are numeric references.
  return `<code>${encoded}</code>`
}

function markdownTable(headings: Array<string>, rows: Array<Array<string>>) {
  const row = (cells: Array<string>) => {
    return `| ${cells.map(tableCell).join(' | ')} |`
  }

  return [row(headings), row(headings.map(() => '---')), ...rows.map(row)].join('\n')
}

function propsTable(props: Array<ComponentProp>) {
  return markdownTable(
    ['Name', 'Type', 'Default', 'Required', 'Description'],
    props.map(prop => {
      return [
        tableCode(prop.name),
        tableCode(prop.type),
        tableCode(prop.defaultValue ?? ''),
        prop.required ? 'Yes' : 'No',
        prop.description,
      ]
    }),
  )
}

function serializeComponentDocs(component: ComponentDocs): string {
  const sections = [`# ${component.displayName}`]

  if (component.usage.description.trim()) {
    sections.push(component.usage.description.trim())
  }
  if (component.usage.bestPractices.length > 0) {
    const practices = component.usage.bestPractices.map(({guidance, description}) => {
      const label = guidance ? 'Do' : "Don't"
      return `- **${label}:** ${description.replace(/\r\n?|\n/g, '\n  ')}`
    })
    sections.push(`## Best practices\n\n${practices.join('\n')}`)
  }
  if (component.usage.anatomy.length > 0) {
    const anatomy = markdownTable(
      ['Name', 'Description', 'Required'],
      component.usage.anatomy.map(part => {
        return [part.name, part.description, part.required ? 'Yes' : 'No']
      }),
    )
    sections.push(`## Anatomy\n\n${anatomy}`)
  }

  const props: Array<string> = []
  if (component.props.length > 0) {
    props.push(propsTable(component.props))
  }
  for (const subcomponent of component.subcomponents) {
    if (subcomponent.props.length > 0) {
      props.push(`### ${inlineCode(subcomponent.displayName)}\n\n${propsTable(subcomponent.props)}`)
    }
  }
  if (props.length > 0) {
    sections.push(`## Props\n\n${props.join('\n\n')}`)
  }

  return `${sections.join('\n\n')}\n`
}

export {defineComponent, serializeComponentDocs}
export type {ComponentDocs, Subcomponent, ComponentProp}
