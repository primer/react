import {runCommand} from 'citty'
import {afterEach, describe, expect, it, vi} from 'vitest'
import sizeCoarse from '@primer/primitives/dist/docs/functional/size/size-coarse.json' with {type: 'json'}
import light from '@primer/primitives/dist/docs/functional/themes/light.json' with {type: 'json'}
import {list} from './list'
import {get} from './get'
import {search} from './search'
import {list as listGroups} from './group/list'
import {specs} from './specs'
import {get as getUsage} from './usage/get'
import {log} from '../../console'
import {getGroupTokens, getToken, loadTokenGuide, tokens} from '../../token-metadata'

vi.mock('../../console')

const emit = vi.mocked(log)
const sorted = tokens.toSorted((a, b) => {
  return a.name.localeCompare(b.name)
})

afterEach(() => {
  emit.mockClear()
})

describe('tokens list', () => {
  it('lists the complete deduplicated catalog in a Markdown table', async () => {
    await runCommand(list, {rawArgs: []})

    const rows = emit.mock.calls[0][0].split('\n').map(line => {
      return line
        .split('|')
        .slice(1, -1)
        .map(cell => {
          return cell.trim()
        })
    })
    expect(rows[0]).toEqual(['Name', 'Value', 'Group'])
    expect(rows.slice(2)).toEqual(
      sorted.map(token => {
        return [token.name, token.value, token.group]
      }),
    )
    expect(
      new Set(
        rows.slice(2).map(row => {
          return row[0]
        }),
      ).size,
    ).toBe(tokens.length)
  })

  it('returns token values, types, and guidance as JSON', async () => {
    await runCommand(list, {rawArgs: ['--json']})

    expect(JSON.parse(emit.mock.calls[0][0])).toEqual(sorted)
    expect(JSON.parse(emit.mock.calls[0][0])).toContainEqual(
      expect.objectContaining({
        name: 'bgColor-default',
        value: light['bgColor-default'].value,
        type: 'color',
        useCase: expect.stringContaining('card-background'),
        rules: expect.stringContaining('primary background'),
      }),
    )
  })

  it.each([
    {flags: ['--paginate'], page: 1, limit: 10},
    {flags: ['--page', '2'], page: 2, limit: 10},
    {flags: ['--limit', '3', '--page', '2'], page: 2, limit: 3},
  ])('includes page information with $flags', async ({flags, page, limit}) => {
    await runCommand(list, {rawArgs: ['--json', ...flags]})

    expect(JSON.parse(emit.mock.calls[0][0])).toEqual({
      tokens: sorted.slice((page - 1) * limit, page * limit),
      pagination: {page, limit, total: tokens.length, totalPages: Math.ceil(tokens.length / limit)},
    })
  })

  it('retains table headers and page information beyond the last page', async () => {
    const page = tokens.length + 1
    await runCommand(list, {rawArgs: ['--page', String(page)]})

    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `| Name | Value | Group |\n| --- | --- | --- |\n\nPage ${page} of ${Math.ceil(tokens.length / 10)} (${tokens.length} tokens)`,
    )
  })
})

describe('tokens get', () => {
  it.each(['bgColor-default', 'BGCOLOR-DEFAULT', 'var( --bgColor-default )'])(
    'resolves %s to an exact token and includes upstream guidance',
    async name => {
      await runCommand(get, {rawArgs: [name, '--json']})

      expect(JSON.parse(emit.mock.calls[0][0])).toEqual(getToken('bgColor-default'))
      expect(getToken('bgColor-default').useCase).toContain('card-background')
      expect(getToken('bgColor-default').rules).toContain('primary background')
    },
  )

  it('accepts a CSS custom property following the end-of-options marker', async () => {
    await runCommand(get, {rawArgs: ['--json', '--', '--bgColor-default']})

    expect(JSON.parse(emit.mock.calls[0][0]).name).toBe('bgColor-default')
  })

  it('formats Markdown with value, type, group, usage, and rules', async () => {
    await runCommand(get, {rawArgs: ['bgColor-default']})

    const output = emit.mock.calls[0][0]
    expect(output).toContain('### bgColor-default')
    expect(output).toContain(`**Value:** \`${light['bgColor-default'].value}\``)
    expect(output).toContain('**Type:** color')
    expect(output).toContain('**Group:** Background Colors')
    expect(output).toContain('**Usage:** card-background')
    expect(output).toContain('**Rules:** Use as the primary background')
  })

  it.each([
    {name: 'base-duration-100', value: '100ms'},
    {name: 'base-easing-ease', value: 'cubic-bezier(0.25, 0.1, 0.25, 1)'},
    {name: 'base-text-weight-light', value: '300'},
    {name: 'base-text-lineHeight-loose', value: '1.75'},
  ])('serializes structured and numeric values for $name', async ({name, value}) => {
    await runCommand(get, {rawArgs: [name, '--json']})

    expect(JSON.parse(emit.mock.calls[0][0]).value).toBe(value)
  })

  it('uses JSON extension guidance where the Markdown spec has no entry', async () => {
    await runCommand(get, {rawArgs: ['base-easing-ease', '--json']})

    expect(JSON.parse(emit.mock.calls[0][0])).toMatchObject({
      useCase: expect.stringContaining('hover-state'),
      rules: 'Use for hover state changes.',
    })
  })

  it('preserves the MCP source precedence for duplicate coarse/fine tokens', async () => {
    await runCommand(get, {rawArgs: ['control-minTarget-auto', '--json']})

    expect(JSON.parse(emit.mock.calls[0][0]).value).toBe(sizeCoarse['control-minTarget-auto'].value)
  })

  it.each(['unknown-token', 'default'])('rejects unknown or partial names (%s)', async name => {
    await expect(runCommand(get, {rawArgs: [name]})).rejects.toThrow(`No token found for "${name}"`)
    expect(emit).not.toHaveBeenCalled()
  })

  it('requires a token name', async () => {
    await expect(runCommand(get, {rawArgs: []})).rejects.toThrow('Missing required positional argument')
    expect(emit).not.toHaveBeenCalled()
  })
})

describe('tokens search', () => {
  it('defaults to 15 results and includes page information', async () => {
    await runCommand(search, {rawArgs: ['--group', 'bgColor', '--json']})

    const matches = getGroupTokens(['bgColor'])
    expect(matches.length).toBeGreaterThan(15)
    expect(JSON.parse(emit.mock.calls[0][0])).toEqual({
      tokens: matches.slice(0, 15),
      pagination: {page: 1, limit: 15, total: matches.length, totalPages: Math.ceil(matches.length / 15)},
    })
  })

  it('supports quoted keyword AND searches and aliases in an explicit group', async () => {
    await runCommand(search, {rawArgs: ['body medium', '--group', 'typography', '--json']})

    const result = JSON.parse(emit.mock.calls[0][0])
    expect(result.tokens.length).toBeGreaterThan(0)
    for (const token of result.tokens) {
      expect(token.name).toMatch(/^text-/)
      const searchable = `${token.name} ${token.useCase} ${token.rules} ${token.group}`.toLowerCase()
      expect(searchable).toContain('body')
      expect(searchable).toContain('medium')
    }
  })

  it('extracts group aliases from unquoted words and resolves semantic color intent', async () => {
    await runCommand(search, {rawArgs: ['red', 'bordercolor', '--json']})

    const result = JSON.parse(emit.mock.calls[0][0])
    expect(result.tokens.length).toBeGreaterThan(0)
    for (const token of result.tokens) {
      expect(token.name).toMatch(/^borderColor-/)
      expect(`${token.name} ${token.useCase} ${token.rules}`).toMatch(/danger/i)
    }
  })

  it('accepts a group alias as the whole query', async () => {
    await runCommand(search, {rawArgs: ['spacing', '--json']})

    expect(JSON.parse(emit.mock.calls[0][0]).tokens).toEqual(getGroupTokens(['stack']).slice(0, 15))
  })

  it('searches guidance as well as names', async () => {
    await runCommand(search, {rawArgs: ['card-background', '--json']})

    expect(JSON.parse(emit.mock.calls[0][0]).tokens).toContainEqual(getToken('bgColor-default'))
  })

  it('allows another page and an explicit result limit', async () => {
    await runCommand(search, {
      rawArgs: ['--group', 'background color', '--limit', '2', '--page', '2', '--json'],
    })

    const matches = getGroupTokens(['bgColor'])
    expect(JSON.parse(emit.mock.calls[0][0])).toEqual({
      tokens: matches.slice(2, 4),
      pagination: {page: 2, limit: 2, total: matches.length, totalPages: Math.ceil(matches.length / 2)},
    })
  })

  it('returns an empty paginated JSON result for no matches', async () => {
    await runCommand(search, {rawArgs: ['danger nonexistent-keyword', '--json']})

    expect(JSON.parse(emit.mock.calls[0][0])).toEqual({
      tokens: [],
      pagination: {page: 1, limit: 15, total: 0, totalPages: 0},
    })
  })

  it('includes usage and rules in Markdown search results', async () => {
    await runCommand(search, {rawArgs: ['card-background']})

    const output = emit.mock.calls[0][0]
    expect(output).toContain('### bgColor-default')
    expect(output).toContain('**Usage:**')
    expect(output).toContain('**Rules:**')
    expect(output).toContain('Page 1 of')
  })

  it('reports no matches explicitly in Markdown', async () => {
    await runCommand(search, {rawArgs: ['nonexistent-keyword']})

    expect(emit.mock.calls[0][0]).toContain('No tokens found.')
  })

  it.each([{flags: []}, {flags: ['--group', 'nonexistent-group']}])(
    'rejects missing input or unknown groups ($flags)',
    async ({flags}) => {
      await expect(runCommand(search, {rawArgs: [...flags]})).rejects.toThrow()
      expect(emit).not.toHaveBeenCalled()
    },
  )

  it.each(['0', '-1', '1.5', '101', 'invalid', '9007199254740992'])(
    'rejects invalid search limits (%s)',
    async limit => {
      await expect(runCommand(search, {rawArgs: ['spacing', '--limit', limit]})).rejects.toThrow('--limit')
      expect(emit).not.toHaveBeenCalled()
    },
  )
})

describe('tokens group list', () => {
  it('bundles multiple groups without duplicates and includes group usage hints', async () => {
    await runCommand(listGroups, {rawArgs: ['typography', 'text', 'background', '--json']})

    expect(JSON.parse(emit.mock.calls[0][0])).toEqual({
      tokens: getGroupTokens(['text', 'bgColor']),
      groups: ['text', 'bgColor'],
      hints: [expect.stringContaining('line-height')],
    })
  })

  it('paginates JSON bundles with 10 items by default', async () => {
    await runCommand(listGroups, {rawArgs: ['control', 'button', '--paginate', '--json']})

    const matches = getGroupTokens(['control', 'button'])
    expect(JSON.parse(emit.mock.calls[0][0])).toMatchObject({
      tokens: matches.slice(0, 10),
      pagination: {page: 1, limit: 10, total: matches.length, totalPages: Math.ceil(matches.length / 10)},
    })
  })

  it('emits Markdown bundles with value, rules, and usage hints', async () => {
    await runCommand(listGroups, {rawArgs: ['control', 'focus', '--limit', '2']})

    const output = emit.mock.calls[0][0]
    expect(output).toContain('**Value:**')
    expect(output).toContain('**Rules:**')
    expect(output).toContain('## Usage Guidance')
    expect(output).toContain('For buttons, use the `button` group.')
    expect(output).toContain('Page 1 of')
  })

  it.each([{groups: []}, {groups: ['control', 'unknown-group']}])(
    'rejects missing or unknown groups ($groups)',
    async ({groups}) => {
      await expect(runCommand(listGroups, {rawArgs: [...groups]})).rejects.toThrow()
      expect(emit).not.toHaveBeenCalled()
    },
  )
})

describe('token specifications and usage', () => {
  it('includes current groups, semantic mapping, recipes, and the full upstream guide', async () => {
    await runCommand(specs, {rawArgs: []})

    const output = emit.mock.calls[0][0]
    expect(output).toContain('# Design Token Specifications')
    expect(output).toContain('## Available Groups')
    expect(output).toContain('## Group Recipes')
    expect(output).toContain('primer tokens group list')
    expect(output).toContain('bgColor')
    expect(output).toContain('borderRadius')
    expect(output).toContain(loadTokenGuide().trimEnd())
  })

  it('includes Button/Stack examples and the upstream Golden Example', async () => {
    await runCommand(getUsage, {rawArgs: []})

    const output = emit.mock.calls[0][0]
    expect(output).toContain('## Interaction Pattern: Button')
    expect(output).toContain('## Layout Pattern: Vertical Stack')
    expect(output).toContain('## Golden Example: Reference Component')
    expect(output).toContain('prefers-reduced-motion')
    expect(output).not.toContain('## Hallucination Guard')
    for (const match of output.matchAll(/var\((--[^),\s]+)/g)) {
      expect(() => {
        getToken(match[1])
      }).not.toThrow()
    }
  })
})
