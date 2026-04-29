import {existsSync, readdirSync, readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import path from 'node:path'

interface PrimitiveToken {
  readonly name: string
  readonly value: unknown
  readonly type?: string
  readonly description?: string
  readonly group: string
}

interface TokenGuidance {
  readonly name: string
  readonly group: string
  readonly description?: string
  readonly useCase?: string
  readonly rules?: string
}

interface TokenInfo {
  readonly token: PrimitiveToken
  readonly guidance?: TokenGuidance
}

interface TokenListOptions {
  readonly group?: string
}

const require = createRequire(import.meta.url)

function listTokens(options: TokenListOptions = {}): readonly PrimitiveToken[] {
  const group = options.group?.toLowerCase()
  const tokens = loadTokens()

  return tokens
    .filter(token => {
      return !group || token.group.toLowerCase() === group || token.name.toLowerCase().startsWith(`${group}-`)
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
}

function getTokenInfo(name: string): TokenInfo | null {
  const normalizedName = normalizeTokenName(name)
  const token = loadTokens().find(candidate => {
    return normalizeTokenName(candidate.name) === normalizedName
  })

  if (!token) {
    return null
  }

  return {
    token,
    guidance: loadTokenGuidance().get(token.name),
  }
}

function formatTokenList(tokens: readonly PrimitiveToken[]): string {
  return tokens
    .map(token => {
      return `${token.name} - ${formatValue(token.value)} (${token.type ?? 'unknown'})`
    })
    .join('\n')
}

function formatTokenInfo(info: TokenInfo): string {
  const {token, guidance} = info
  const whenToUse = guidance?.useCase ?? token.description ?? guidance?.description ?? 'No usage guidance is available.'
  const rules = guidance?.rules ?? 'No token-specific rules are available.'

  return `# ${token.name}

Value: \`${formatValue(token.value)}\`
Type: ${token.type ?? 'unknown'}
Group: ${token.group}

## When to use

${whenToUse}

## Rules

${rules}
`
}

function loadTokens(): readonly PrimitiveToken[] {
  const primitivesRoot = getPrimitivesRoot()
  const docsRoot = path.join(primitivesRoot, 'dist/docs')
  const tokenFiles = collectFiles(docsRoot, '.json')
  const tokens = new Map<string, PrimitiveToken>()

  for (const file of tokenFiles) {
    const data = JSON.parse(readFileSync(file, 'utf-8')) as Record<string, PrimitiveToken>
    for (const token of Object.values(data)) {
      if (!token.name || tokens.has(token.name)) {
        continue
      }

      tokens.set(token.name, {
        name: token.name,
        value: token.value,
        type: token.type,
        description: token.description,
        group: token.name.split('-')[0],
      })
    }
  }

  return Array.from(tokens.values())
}

function loadTokenGuidance(): ReadonlyMap<string, TokenGuidance> {
  const specPath = path.join(getPrimitivesRoot(), 'DESIGN_TOKENS_SPEC.md')
  if (!existsSync(specPath)) {
    return new Map()
  }

  const tokens = new Map<string, TokenGuidance>()
  const lines = readFileSync(specPath, 'utf-8').split('\n')
  let currentGroup = ''
  let currentToken: TokenGuidance | null = null
  let descriptionLines: string[] = []

  const saveCurrentToken = () => {
    if (!currentToken) {
      return
    }

    tokens.set(currentToken.name, {
      ...currentToken,
      description: currentToken.description ?? descriptionLines.join(' '),
    })
    descriptionLines = []
  }

  for (const line of lines) {
    const groupMatch = line.match(/^## (.+)$/)
    if (groupMatch) {
      saveCurrentToken()
      currentGroup = groupMatch[1].trim()
      currentToken = null
      continue
    }

    const tokenMatch = line.match(/^### (.+)$/)
    if (tokenMatch) {
      saveCurrentToken()
      currentToken = {
        name: tokenMatch[1].trim(),
        group: currentGroup,
      }
      continue
    }

    const useCaseMatch = line.match(/^\*\*U:\*\*\s*(.+)$/)
    if (useCaseMatch && currentToken) {
      currentToken = {
        ...currentToken,
        useCase: useCaseMatch[1].trim(),
      }
      continue
    }

    const rulesMatch = line.match(/^\*\*R:\*\*\s*(.+)$/)
    if (rulesMatch && currentToken) {
      currentToken = {
        ...currentToken,
        rules: rulesMatch[1].trim(),
      }
      continue
    }

    if (currentToken && !currentToken.useCase && line.trim() && !line.startsWith('#') && !line.startsWith('**')) {
      descriptionLines.push(line.trim())
    }
  }

  saveCurrentToken()
  return tokens
}

function collectFiles(directory: string, suffix: string): string[] {
  if (!existsSync(directory)) {
    return []
  }

  const files: string[] = []
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const filepath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectFiles(filepath, suffix))
    } else if (entry.isFile() && entry.name.endsWith(suffix)) {
      files.push(filepath)
    }
  }

  return files
}

function getPrimitivesRoot(): string {
  return path.dirname(require.resolve('@primer/primitives/package.json'))
}

function normalizeTokenName(name: string): string {
  return name
    .trim()
    .replace(/^var\((--)?/, '')
    .replace(/\)$/, '')
    .replace(/^--/, '')
    .toLowerCase()
}

function formatValue(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return JSON.stringify(value)
}

export {formatTokenInfo, formatTokenList, getTokenInfo, listTokens}
export type {PrimitiveToken}
