import {tablemark} from 'tablemark'
import {paginate} from '../../pagination'
import type {Token} from '../../token-metadata'

export const listArgs = {
  json: {
    type: 'boolean',
    description: 'Output JSON instead of Markdown',
  },
  paginate: {
    type: 'boolean',
    description: 'Paginate results (default: 10 tokens per page, starting at page 1)',
  },
  limit: {
    type: 'string',
    description: 'Tokens per page (enables pagination)',
    valueHint: 'number',
  },
  page: {
    type: 'string',
    description: 'Page number, starting at 1 (enables pagination)',
    valueHint: 'number',
  },
} as const

interface OutputArgs {
  json?: boolean
  paginate?: boolean
  limit?: string
  page?: string
}

export function formatToken(token: Token): string {
  return `### ${token.name}

- **Value:** \`${token.value}\`
- **Type:** ${token.type}
- **Group:** ${token.group}
- **Usage:** ${token.useCase || '(none)'}
- **Rules:** ${token.rules || '(none)'}`
}

export function formatTokenBundle(tokens: ReadonlyArray<Token>): string {
  const groups = new Map<string, Array<Token>>()
  for (const token of tokens) {
    const group = groups.get(token.group) ?? []
    group.push(token)
    groups.set(token.group, group)
  }
  return Array.from(groups, ([name, entries]) => {
    return `## ${name}\n\n${entries.map(formatToken).join('\n\n')}`
  }).join('\n\n')
}

export function formatTokens(tokens: ReadonlyArray<Token>, args: OutputArgs, detailed = false): string {
  const {results, pagination} = paginate(tokens, args)
  if (args.json) {
    return JSON.stringify(pagination ? {tokens: results, pagination} : results, null, 2)
  }
  const output = detailed
    ? formatTokenBundle(results) || 'No tokens found.'
    : results.length > 0
      ? tablemark(
          results.map(token => {
            return {name: token.name, value: token.value, group: token.group}
          }),
          {columns: ['Name', 'Value', 'Group']},
        ).trimEnd()
      : '| Name | Value | Group |\n| --- | --- | --- |'

  return [
    output,
    ...(pagination ? ['', `Page ${pagination.page} of ${pagination.totalPages} (${pagination.total} tokens)`] : []),
  ].join('\n')
}
