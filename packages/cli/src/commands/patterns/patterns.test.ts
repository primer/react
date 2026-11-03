import {runCommand, type ArgsDef, type CommandDef} from 'citty'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {list as listPatterns} from './list'
import {get as getPattern} from './get'
import {list as listScenarios} from '../scenarios/list'
import {get as getScenario} from '../scenarios/get'
import {patterns, scenarios} from '../../pattern-metadata'
import {log} from '../../console'

vi.mock('../../console')

function commandRunner<T extends ArgsDef>(command: CommandDef<T>) {
  return (rawArgs: Array<string>) => {
    return runCommand(command, {rawArgs})
  }
}

describe.each([
  {
    runList: commandRunner(listPatterns),
    runGet: commandRunner(getPattern),
    kind: 'patterns',
    label: 'pattern',
    path: 'ui-patterns',
    entries: patterns,
    identifiers: ['data-visualization', 'Data Visualization', 'DATA VISUALIZATION'],
    name: 'Data Visualization',
    id: 'data-visualization',
    wrongCategory: 'create',
  },
  {
    runList: commandRunner(listScenarios),
    runGet: commandRunner(getScenario),
    kind: 'scenarios',
    label: 'scenario',
    path: 'scenario-patterns',
    entries: scenarios,
    identifiers: ['create', 'Create', 'CREATE'],
    name: 'Create',
    id: 'create',
    wrongCategory: 'data-visualization',
  },
])('$kind commands', ({runList, runGet, kind, label, path, entries, identifiers, name, id, wrongCategory}) => {
  const emit = vi.mocked(log)
  const fetchMock = vi.fn<typeof fetch>()
  const html = String.raw

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
    emit.mockClear()
  })

  it('lists only its own catalog in an aligned Markdown table without fetching', async () => {
    await runList([])

    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).toHaveBeenCalledTimes(1)
    const rows = emit.mock.calls[0][0].split('\n').map(line => {
      return line
        .split('|')
        .slice(1, -1)
        .map(cell => {
          return cell.trim()
        })
    })
    expect(rows[0]).toEqual(['ID', 'Name'])
    expect(rows.slice(2)).toEqual(
      entries.map(entry => {
        return [entry.id, entry.name]
      }),
    )
  })

  it('lists IDs and names as a JSON array without pagination', async () => {
    await runList(['--json'])

    expect(emit).toHaveBeenCalledExactlyOnceWith(JSON.stringify(entries, null, 2))
  })

  it.each([
    {flags: ['--paginate'], page: 1, limit: 10},
    {flags: ['--limit', '3'], page: 1, limit: 3},
    {flags: ['--page', '2'], page: 2, limit: 10},
    {flags: ['--limit', '3', '--page', '2'], page: 2, limit: 3},
    {
      flags: ['--limit', '4', '--page', String(Math.ceil(entries.length / 4))],
      page: Math.ceil(entries.length / 4),
      limit: 4,
    },
  ])('includes the correct JSON envelope and page info for $flags', async ({flags, page, limit}) => {
    await runList(['--json', ...flags])

    expect(emit).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify(
        {
          [kind]: entries.slice((page - 1) * limit, page * limit),
          pagination: {page, limit, total: entries.length, totalPages: Math.ceil(entries.length / limit)},
        },
        null,
        2,
      ),
    )
  })

  it('includes a page summary below paginated Markdown', async () => {
    await runList(['--limit', '1', '--page', '2'])

    expect(emit).toHaveBeenCalledTimes(1)
    const lines = emit.mock.calls[0][0].split('\n')
    expect(lines).toHaveLength(5)
    expect(lines[2]).toContain(entries[1].id)
    expect(lines.slice(-2)).toEqual(['', `Page 2 of ${entries.length} (${entries.length} ${kind})`])
  })

  it('retains Markdown headers and page info for an empty page', async () => {
    await runList(['--page', '2'])

    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `| ID | Name |\n| --- | --- |\n\nPage 2 of 1 (${entries.length} ${kind})`,
    )
  })

  it.each(['limit', 'page'])('rejects invalid --%s without emitting output', async flag => {
    await expect(runList([`--${flag}`, '0'])).rejects.toThrow(`--${flag} must be a positive safe integer`)
    expect(emit).not.toHaveBeenCalled()
  })

  it.each(identifiers)('gets "%s" from its own documentation route', async identifier => {
    fetchMock.mockResolvedValue(new Response('Guidelines\n----------\n\nUse **Primer**.\n'))

    await runGet([identifier])

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      new URL(`/product/${path}/${id}/llms.txt`, 'https://primer.style'),
      {signal: expect.any(AbortSignal)},
    )
    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `Here are the guidelines for the \`${name}\` ${label} for Primer:\n\nGuidelines\n----------\n\nUse **Primer**.`,
    )
  })

  it('falls back to HTML only when the llms.txt endpoint is missing', async () => {
    fetchMock.mockResolvedValueOnce(new Response('Not found', {status: 404})).mockResolvedValueOnce(
      new Response(
        html`<nav>Navigation</nav>
          <main>
            <h2>Guidelines</h2>
            <p>Use <strong>Primer</strong>.</p>
          </main>
          <footer>Footer</footer>`,
      ),
    )

    await runGet([id])

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenNthCalledWith(1, new URL(`/product/${path}/${id}/llms.txt`, 'https://primer.style'), {
      signal: expect.any(AbortSignal),
    })
    expect(fetchMock).toHaveBeenNthCalledWith(2, new URL(`/product/${path}/${id}`, 'https://primer.style'), {
      signal: expect.any(AbortSignal),
    })
    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `Here are the guidelines for the \`${name}\` ${label} for Primer:\n\nGuidelines\n----------\n\nUse **Primer**.`,
    )
  })

  it('requires an ID or name', async () => {
    await expect(runGet([])).rejects.toThrow('Missing required positional argument')

    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it.each(['unknown', wrongCategory])('rejects "%s" instead of searching the other category', async identifier => {
    await expect(runGet([identifier])).rejects.toThrow(
      `No ${label} found for "${identifier}". Use "primer ${kind} list" to see available ${kind}.`,
    )
    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it.each([401, 403, 500])('reports HTTP %s without falling back or emitting output', async status => {
    fetchMock.mockResolvedValue(new Response('Request failed', {status}))

    await expect(runGet([id])).rejects.toThrow(`Failed to fetch documentation for ${name}: HTTP ${status}`)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(emit).not.toHaveBeenCalled()
  })

  it('reports an unavailable HTML fallback rather than emitting output', async () => {
    fetchMock.mockResolvedValue(new Response('Not found', {status: 404}))

    await expect(runGet([id])).rejects.toThrow(`Failed to fetch documentation for ${name}: HTTP 404`)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(emit).not.toHaveBeenCalled()
  })

  it('propagates network errors without emitting output', async () => {
    const error = new TypeError('fetch failed')
    fetchMock.mockRejectedValue(error)

    await expect(runGet([id])).rejects.toBe(error)
    expect(emit).not.toHaveBeenCalled()
  })

  it('rejects empty llms.txt content without falling back or emitting output', async () => {
    fetchMock.mockResolvedValue(new Response(' \n'))

    await expect(runGet([id])).rejects.toThrow(`Documentation for ${name} is empty`)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(emit).not.toHaveBeenCalled()
  })
})
