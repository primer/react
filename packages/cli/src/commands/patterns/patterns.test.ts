import {runCommand} from 'citty'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {patterns as patternsCommand} from './index'
import {scenarios as scenariosCommand} from '../scenarios'
import {patterns, scenarios} from '../../pattern-metadata'
import {log} from '../../console'

vi.mock('../../console')

describe.each([
  {
    command: patternsCommand,
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
    command: scenariosCommand,
    kind: 'scenarios',
    label: 'scenario',
    path: 'scenario-patterns',
    entries: scenarios,
    identifiers: ['create', 'Create', 'CREATE'],
    name: 'Create',
    id: 'create',
    wrongCategory: 'data-visualization',
  },
])('$kind commands', ({command, kind, label, path, entries, identifiers, name, id, wrongCategory}) => {
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
    await runCommand(command, {rawArgs: ['list']})

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
    await runCommand(command, {rawArgs: ['list', '--json']})

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
    await runCommand(command, {rawArgs: ['list', '--json', ...flags]})

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
    await runCommand(command, {rawArgs: ['list', '--limit', '1', '--page', '2']})

    expect(emit).toHaveBeenCalledTimes(1)
    const lines = emit.mock.calls[0][0].split('\n')
    expect(lines).toHaveLength(5)
    expect(lines[2]).toContain(entries[1].id)
    expect(lines.slice(-2)).toEqual(['', `Page 2 of ${entries.length} (${entries.length} ${kind})`])
  })

  it('retains Markdown headers and page info for an empty page', async () => {
    await runCommand(command, {rawArgs: ['list', '--page', '2']})

    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `| ID | Name |\n| --- | --- |\n\nPage 2 of 1 (${entries.length} ${kind})`,
    )
  })

  it.each(['limit', 'page'])('rejects invalid --%s without emitting output', async flag => {
    await expect(runCommand(command, {rawArgs: ['list', `--${flag}`, '0']})).rejects.toThrow(
      `--${flag} must be a positive safe integer`,
    )
    expect(emit).not.toHaveBeenCalled()
  })

  it.each(identifiers)('gets "%s" from its own documentation route', async identifier => {
    fetchMock.mockResolvedValue(new Response('Guidelines\n----------\n\nUse **Primer**.\n'))

    await runCommand(command, {rawArgs: ['get', identifier]})

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

    await runCommand(command, {rawArgs: ['get', id]})

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
    await expect(runCommand(command, {rawArgs: ['get']})).rejects.toThrow('Missing required positional argument')

    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it.each(['unknown', wrongCategory])('rejects "%s" instead of searching the other category', async identifier => {
    await expect(runCommand(command, {rawArgs: ['get', identifier]})).rejects.toThrow(
      `No ${label} found for "${identifier}". Use "primer ${kind} list" to see available ${kind}.`,
    )
    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it.each([401, 403, 500])('reports HTTP %s without falling back or emitting output', async status => {
    fetchMock.mockResolvedValue(new Response('Request failed', {status}))

    await expect(runCommand(command, {rawArgs: ['get', id]})).rejects.toThrow(
      `Failed to fetch documentation for ${name}: HTTP ${status}`,
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(emit).not.toHaveBeenCalled()
  })

  it('reports an unavailable HTML fallback rather than emitting output', async () => {
    fetchMock.mockResolvedValue(new Response('Not found', {status: 404}))

    await expect(runCommand(command, {rawArgs: ['get', id]})).rejects.toThrow(
      `Failed to fetch documentation for ${name}: HTTP 404`,
    )
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(emit).not.toHaveBeenCalled()
  })

  it('propagates network errors without emitting output', async () => {
    const error = new TypeError('fetch failed')
    fetchMock.mockRejectedValue(error)

    await expect(runCommand(command, {rawArgs: ['get', id]})).rejects.toBe(error)
    expect(emit).not.toHaveBeenCalled()
  })

  it('rejects empty llms.txt content without falling back or emitting output', async () => {
    fetchMock.mockResolvedValue(new Response(' \n'))

    await expect(runCommand(command, {rawArgs: ['get', id]})).rejects.toThrow(`Documentation for ${name} is empty`)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(emit).not.toHaveBeenCalled()
  })
})
