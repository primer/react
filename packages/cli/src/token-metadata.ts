import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import baseMotion from '@primer/primitives/dist/docs/base/motion/motion.json' with {type: 'json'}
import baseSize from '@primer/primitives/dist/docs/base/size/size.json' with {type: 'json'}
import baseTypography from '@primer/primitives/dist/docs/base/typography/typography.json' with {type: 'json'}
import border from '@primer/primitives/dist/docs/functional/size/border.json' with {type: 'json'}
import radius from '@primer/primitives/dist/docs/functional/size/radius.json' with {type: 'json'}
import sizeCoarse from '@primer/primitives/dist/docs/functional/size/size-coarse.json' with {type: 'json'}
import sizeFine from '@primer/primitives/dist/docs/functional/size/size-fine.json' with {type: 'json'}
import size from '@primer/primitives/dist/docs/functional/size/size.json' with {type: 'json'}
import light from '@primer/primitives/dist/docs/functional/themes/light.json' with {type: 'json'}
import typography from '@primer/primitives/dist/docs/functional/typography/typography.json' with {type: 'json'}

export interface Token {
  name: string
  value: string
  type: string
  group: string
  useCase: string
  rules: string
}

interface SourceToken {
  name: string
  type: string
  value: unknown
  $extensions?: Record<string, unknown>
}

interface Guidance {
  group?: string
  useCase: string
  rules: string
}

const require = createRequire(import.meta.url)

export function loadTokenGuide(): string {
  return readFileSync(require.resolve('@primer/primitives/DESIGN_TOKENS_GUIDE.md'), 'utf8')
}

function parseGuidance(): Map<string, Guidance> {
  const spec = readFileSync(require.resolve('@primer/primitives/DESIGN_TOKENS_SPEC.md'), 'utf8')
  const result = new Map<string, Guidance>()
  let name: string | undefined
  let group = ''
  let useCase = ''
  let rules = ''
  let description: Array<string> = []

  function save() {
    if (name) {
      result.set(name, {group, useCase: useCase || description.join(' '), rules})
    }
  }

  for (const line of spec.split('\n')) {
    const heading = line.match(/^(##|###) (.+)$/)
    if (heading) {
      save()
      if (heading[1] === '##') {
        group = heading[2].trim()
      }
      name = heading[1] === '###' ? heading[2].trim() : undefined
      useCase = ''
      rules = ''
      description = []
      continue
    }
    if (!name) {
      continue
    }
    const usage = line.match(/^\*\*U:\*\*\s*(.+)$/)
    const rule = line.match(/^\*\*R:\*\*\s*(.+)$/)
    if (usage) {
      useCase = usage[1].trim()
    } else if (rule) {
      rules = rule[1].trim()
    } else if (!useCase && line.trim() && !line.startsWith('**') && !line.startsWith('#')) {
      description.push(line.trim())
    }
  }
  save()
  return result
}

function formatValue(token: SourceToken): string {
  const value = token.value
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }
  if (
    token.type === 'duration' &&
    value !== null &&
    typeof value === 'object' &&
    'value' in value &&
    typeof value.value === 'number' &&
    'unit' in value &&
    typeof value.unit === 'string'
  ) {
    return `${value.value}${value.unit}`
  }
  if (token.type === 'cubicBezier' && Array.isArray(value)) {
    return `cubic-bezier(${value.join(', ')})`
  }

  throw new Error(`Unsupported value for token "${token.name}" (${token.type})`)
}

function extensionGuidance(token: SourceToken): Guidance {
  const metadata = token.$extensions?.['org.primer.llm']
  if (metadata === null || typeof metadata !== 'object') {
    return {useCase: '', rules: ''}
  }
  const usage = 'usage' in metadata && Array.isArray(metadata.usage) ? metadata.usage : []
  const rules = 'rules' in metadata && typeof metadata.rules === 'string' ? metadata.rules : ''
  return {
    useCase: usage
      .filter((value: unknown): value is string => {
        return typeof value === 'string'
      })
      .join(', '),
    rules: 'doNotUse' in metadata && metadata.doNotUse === true ? `${rules} MUST NOT be used.`.trim() : rules,
  }
}

const sources: ReadonlyArray<ReadonlyArray<SourceToken>> = [
  Object.values(baseMotion),
  Object.values(baseSize),
  Object.values(baseTypography),
  Object.values(light),
  Object.values(size),
  Object.values(sizeCoarse),
  Object.values(sizeFine),
  Object.values(border),
  Object.values(radius),
  Object.values(typography),
]
const guidance = parseGuidance()
const unique = new Map<string, Token>()

for (const source of sources.flat()) {
  if (unique.has(source.name)) {
    continue
  }
  const fromSpec = guidance.get(source.name)
  const fromExtension = extensionGuidance(source)
  unique.set(source.name, {
    name: source.name,
    value: formatValue(source),
    type: source.type,
    group: fromSpec?.group || source.name.split('-')[0],
    useCase: fromSpec?.useCase || fromExtension.useCase,
    rules: fromSpec?.rules || fromExtension.rules,
  })
}

export const tokens = Array.from(unique.values())

const groupAliases = new Map(
  Object.entries({
    bgcolor: 'bgColor',
    fgcolor: 'fgColor',
    bordercolor: 'borderColor',
    border: 'border',
    shadow: 'shadow',
    focus: 'focus',
    color: 'color',
    button: 'button',
    control: 'control',
    overlay: 'overlay',
    borderradius: 'borderRadius',
    boxshadow: 'boxShadow',
    fontstack: 'fontStack',
    spinner: 'spinner',
    background: 'bgColor',
    backgroundcolor: 'bgColor',
    bg: 'bgColor',
    foreground: 'fgColor',
    foregroundcolor: 'fgColor',
    textcolor: 'fgColor',
    fg: 'fgColor',
    radius: 'borderRadius',
    rounded: 'borderRadius',
    elevation: 'overlay',
    depth: 'overlay',
    btn: 'button',
    typography: 'text',
    font: 'text',
    text: 'text',
    'line-height': 'text',
    lineheight: 'text',
    leading: 'text',
    stack: 'stack',
    controlstack: 'controlStack',
    padding: 'stack',
    margin: 'stack',
    gap: 'stack',
    spacing: 'stack',
    layout: 'stack',
    offset: 'focus',
    outline: 'outline',
    ring: 'focus',
    borderwidth: 'borderWidth',
    line: 'borderColor',
    stroke: 'borderColor',
    separator: 'borderColor',
    red: 'danger',
    green: 'success',
    yellow: 'attention',
    orange: 'severe',
    blue: 'accent',
    purple: 'done',
    pink: 'sponsors',
    grey: 'neutral',
    gray: 'neutral',
    light: 'muted',
    subtle: 'muted',
    dark: 'emphasis',
    strong: 'emphasis',
    intense: 'emphasis',
    bold: 'emphasis',
    vivid: 'emphasis',
    highlight: 'emphasis',
  }),
)

export const groupHints = new Map(
  Object.entries({
    control: '`control` tokens are for form inputs and checkboxes. For buttons, use the `button` group.',
    button: '`button` tokens are for standard triggers. For form fields, use the `control` group.',
    text: 'Use shorthand tokens where possible. Caption, display, codeBlock, and codeInline do not support size suffixes. If splitting typography, fetch line-height tokens instead of using raw numbers.',
    fgColor: 'Use `fgColor` for text. For borders, use `borderColor`.',
    borderWidth: '`borderWidth` only has sizing values. For border colors, use `borderColor` or `border`.',
    animation: 'Apply duration and easing to the base class, not the hover state. Use duration and easing tokens.',
  }),
)

export function listTokenGroups() {
  const groups = new Map<string, number>()
  for (const token of tokens) {
    const group = token.name.split('-')[0]
    groups.set(group, (groups.get(group) ?? 0) + 1)
  }
  return Array.from(groups, ([name, count]) => {
    return {name, count}
  }).toSorted((a, b) => {
    return a.name.localeCompare(b.name)
  })
}

export function resolveGroup(group: string): string {
  const normalized = group.toLowerCase().replace(/\s+/g, '')
  return (
    groupAliases.get(normalized) ??
    listTokenGroups().find(entry => {
      return entry.name.toLowerCase() === normalized
    })?.name ??
    tokens.find(token => {
      return token.group.toLowerCase().replace(/\s+/g, '') === normalized
    })?.group ??
    group
  )
}

export function matchesGroup(token: Token, group: string): boolean {
  const normalized = group.toLowerCase()
  const parts = token.name.toLowerCase().split('-')
  const intents = [
    'danger',
    'success',
    'attention',
    'severe',
    'accent',
    'done',
    'sponsors',
    'neutral',
    'muted',
    'emphasis',
  ]
  return (
    parts[0] === normalized ||
    token.group.toLowerCase() === normalized ||
    (intents.includes(normalized) && parts.includes(normalized))
  )
}

export function getGroupTokens(groups: ReadonlyArray<string>): Array<Token> {
  const resolved = groups.map(resolveGroup)
  for (const group of resolved) {
    if (
      !tokens.some(token => {
        return matchesGroup(token, group)
      })
    ) {
      throw new Error(`Unknown token group "${group}". Use "primer tokens specs" to see available groups.`)
    }
  }
  return tokens.filter(token => {
    return resolved.some(group => {
      return matchesGroup(token, group)
    })
  })
}

export function searchTokens(query: string, group?: string): Array<Token> {
  let effectiveGroup = group ? resolveGroup(group) : undefined
  const keywords: Array<string> = []
  const canonicalGroups = new Set(
    listTokenGroups().map(entry => {
      return entry.name
    }),
  )

  for (const word of query.toLowerCase().split(/\s+/).filter(Boolean)) {
    const alias = groupAliases.get(word)
    if (alias && canonicalGroups.has(alias) && !effectiveGroup) {
      effectiveGroup = alias
    } else {
      keywords.push(alias && !canonicalGroups.has(alias) ? alias.toLowerCase() : word)
    }
  }
  if (keywords.length === 0 && !effectiveGroup) {
    throw new Error('Provide a query, --group, or both. Use "primer tokens specs" to see available groups.')
  }

  const candidates = effectiveGroup ? getGroupTokens([effectiveGroup]) : tokens
  return candidates.filter(token => {
    const text = `${token.name} ${token.useCase} ${token.rules} ${token.group}`.toLowerCase()
    return keywords.every(keyword => {
      return text.includes(keyword)
    })
  })
}

export function getToken(name: string): Token {
  const normalized = name
    .trim()
    .replace(/^var\(\s*(--[^\s)]+)\s*\)$/, '$1')
    .replace(/^--/, '')
    .toLowerCase()
  const match = tokens.find(token => {
    return token.name.toLowerCase() === normalized
  })
  if (!match) {
    throw new Error(`No token found for "${name}". Use "primer tokens list" or "primer tokens search" to find a token.`)
  }
  return match
}
