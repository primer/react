import {runCommand} from 'citty'
import componentsMetadata from '@primer/react/generated/components.json' with {type: 'json'}
import {afterEach, describe, expect, it, vi} from 'vitest'
import {component} from './component'
import {log} from './console'

vi.mock('./console')

const components = Object.values(componentsMetadata.components)
  .map(metadata => {
    return {id: metadata.id, name: metadata.name}
  })
  .toSorted((a, b) => {
    return a.name.localeCompare(b.name)
  })

describe('component list', () => {
  const emit = vi.mocked(log)

  afterEach(() => {
    emit.mockClear()
  })

  it('lists all components in a Markdown table by default', async () => {
    await runCommand(component, {rawArgs: ['list']})

    expect(emit).toHaveBeenCalledTimes(1)
    const output = emit.mock.calls[0][0]
    const lines = output.trimEnd().split('\n')
    const rows = lines.map(line => {
      return line
        .split('|')
        .slice(1, -1)
        .map(cell => {
          return cell.trim()
        })
    })

    expect(rows[0]).toEqual(['ID', 'Name'])
    expect(rows[1]).toEqual([expect.stringMatching(/^:-+$/), expect.stringMatching(/^:-+$/)])
    expect(rows.slice(2)).toEqual(
      components.map(metadata => {
        return [metadata.id, metadata.name]
      }),
    )
    expect(
      new Set(
        lines.map(line => {
          return line.length
        }),
      ).size,
    ).toBe(1)
  })

  it('outputs component IDs and names as a JSON array', async () => {
    await runCommand(component, {rawArgs: ['list', '--json']})

    expect(emit).toHaveBeenCalledExactlyOnceWith(JSON.stringify(components, null, 2))
  })

  it('uses the first page of 10 components and includes page info when pagination is enabled', async () => {
    await runCommand(component, {rawArgs: ['list', '--json', '--paginate']})

    expect(emit).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify(
        {
          components: components.slice(0, 10),
          pagination: {page: 1, limit: 10, total: components.length, totalPages: Math.ceil(components.length / 10)},
        },
        null,
        2,
      ),
    )
  })

  it.each([
    {flags: ['--limit', '2'], page: 1, limit: 2, start: 0, end: 2},
    {flags: ['--page', '2'], page: 2, limit: 10, start: 10, end: 20},
    {flags: ['--paginate', '--limit', '2', '--page', '2'], page: 2, limit: 2, start: 2, end: 4},
    {flags: ['--limit', '2', '--page', '2'], page: 2, limit: 2, start: 2, end: 4},
    {
      flags: ['--limit', '1', '--page', String(components.length)],
      page: components.length,
      limit: 1,
      start: components.length - 1,
      end: components.length,
    },
    {
      flags: ['--limit', '3', '--page', String(Math.ceil(components.length / 3))],
      page: Math.ceil(components.length / 3),
      limit: 3,
      start: (Math.ceil(components.length / 3) - 1) * 3,
      end: components.length,
    },
    {
      flags: ['--page', String(components.length + 1)],
      page: components.length + 1,
      limit: 10,
      start: components.length,
      end: components.length,
    },
  ])('paginates JSON with $flags', async ({flags, page, limit, start, end}) => {
    await runCommand(component, {rawArgs: ['list', '--json', ...flags]})

    expect(emit).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify(
        {
          components: components.slice(start, end),
          pagination: {page, limit, total: components.length, totalPages: Math.ceil(components.length / limit)},
        },
        null,
        2,
      ),
    )
  })

  it('paginates Markdown output', async () => {
    await runCommand(component, {rawArgs: ['list', '--limit', '1', '--page', '2']})

    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `| ID          | Name       |\n| :---------- | :--------- |\n| action_list | ActionList |\n\nPage 2 of ${components.length} (${components.length} components)`,
    )
  })

  it('includes page info for an empty Markdown page', async () => {
    const page = components.length + 1
    await runCommand(component, {rawArgs: ['list', '--page', String(page)]})

    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `| ID | Name |\n| --- | --- |\n\nPage ${page} of ${Math.ceil(components.length / 10)} (${components.length} components)`,
    )
  })

  it.each(['limit', 'page'])('rejects invalid --%s values without writing output', async flag => {
    for (const value of ['0', '-1', '1.5', 'abc', '1e2', 'Infinity', '9007199254740992', '']) {
      await expect(runCommand(component, {rawArgs: ['list', `--${flag}=${value}`]})).rejects.toThrow(
        `--${flag} must be a positive safe integer`,
      )
    }

    await expect(runCommand(component, {rawArgs: ['list', `--${flag}`]})).rejects.toThrow(
      `--${flag} must be a positive safe integer`,
    )
    expect(emit).not.toHaveBeenCalled()
  })
})
