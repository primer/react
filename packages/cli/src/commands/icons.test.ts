import {runCommand} from 'citty'
import octicons from '@primer/octicons/build/data.json' with {type: 'json'}
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {icons as icon} from './icons'
import {log} from '../console'

vi.mock('../console')

const icons = Object.values(octicons)
  .map(metadata => {
    return {name: metadata.name, keywords: metadata.keywords, heights: Object.keys(metadata.heights)}
  })
  .toSorted((a, b) => {
    return a.name.localeCompare(b.name)
  })
const emit = vi.mocked(log)
const html = String.raw

afterEach(() => {
  emit.mockClear()
})

describe('icons list', () => {
  it('lists sorted icon names, keywords, and sizes as a Markdown table', async () => {
    await runCommand(icon, {rawArgs: ['list']})

    expect(emit).toHaveBeenCalledTimes(1)
    const lines = emit.mock.calls[0][0].split('\n')
    const rows = lines.map(line => {
      return line
        .split('|')
        .slice(1, -1)
        .map(cell => {
          return cell.trim()
        })
    })

    expect(rows[0]).toEqual(['Name', 'Keywords', 'Sizes'])
    expect(rows.slice(2)).toEqual(
      icons.map(metadata => {
        return [metadata.name, metadata.keywords.join(', ').trim(), metadata.heights.join(', ')]
      }),
    )
  })

  it('outputs icon metadata as a JSON array without pagination', async () => {
    await runCommand(icon, {rawArgs: ['list', '--json']})

    expect(emit).toHaveBeenCalledExactlyOnceWith(JSON.stringify(icons, null, 2))
  })

  it.each([
    {flags: ['--paginate'], page: 1, limit: 10},
    {flags: ['--limit', '3'], page: 1, limit: 3},
    {flags: ['--page', '2'], page: 2, limit: 10},
    {flags: ['--limit', '3', '--page', '2'], page: 2, limit: 3},
    {
      flags: ['--limit', '3', '--page', String(Math.ceil(icons.length / 3))],
      page: Math.ceil(icons.length / 3),
      limit: 3,
    },
    {flags: ['--page', String(icons.length + 1)], page: icons.length + 1, limit: 10},
  ])('includes pagination info with $flags', async ({flags, page, limit}) => {
    await runCommand(icon, {rawArgs: ['list', '--json', ...flags]})

    expect(emit).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify(
        {
          icons: icons.slice((page - 1) * limit, page * limit),
          pagination: {page, limit, total: icons.length, totalPages: Math.ceil(icons.length / limit)},
        },
        null,
        2,
      ),
    )
  })

  it('includes page info below a paginated Markdown table', async () => {
    await runCommand(icon, {rawArgs: ['list', '--limit', '1', '--page', '2']})

    expect(emit).toHaveBeenCalledTimes(1)
    const output = emit.mock.calls[0][0]
    expect(output).toContain(icons[1].name)
    expect(output.split('\n')).toHaveLength(5)
    expect(output.split('\n').slice(-2)).toEqual(['', `Page 2 of ${icons.length} (${icons.length} icons)`])
  })

  it('retains headers and page info for an empty Markdown page', async () => {
    const page = icons.length + 1
    await runCommand(icon, {rawArgs: ['list', '--page', String(page)]})

    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `| Name | Keywords | Sizes |\n| --- | --- | --- |\n\nPage ${page} of ${Math.ceil(icons.length / 10)} (${icons.length} icons)`,
    )
  })

  it.each(['limit', 'page'])('rejects invalid --%s without emitting output', async flag => {
    for (const value of ['0', '-1', '1.5', 'abc', '9007199254740992', '']) {
      await expect(runCommand(icon, {rawArgs: ['list', `--${flag}=${value}`]})).rejects.toThrow(
        `--${flag} must be a positive safe integer`,
      )
    }
    expect(emit).not.toHaveBeenCalled()
  })
})

describe('icons get', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it.each([
    {name: 'alert', flags: [], size: '16'},
    {name: 'ALERT', flags: ['--size', '24'], size: '24'},
  ])('fetches $name at size $size and converts main content to Markdown', async ({name, flags, size}) => {
    fetchMock.mockResolvedValue(
      new Response(
        html`<nav>Navigation</nav>
          <main>
            <h1>Alert</h1>
            <p>Use <code>AlertIcon</code>.</p>
          </main>
          <footer>Footer</footer>`,
      ),
    )

    await runCommand(icon, {rawArgs: ['get', name, ...flags]})

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(new URL(`/octicons/icon/alert-${size}`, 'https://primer.style'), {
      signal: expect.any(AbortSignal),
    })
    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `Here is the documentation for the \`alert\` icon at size: \`${size}\`:\nAlert\n=====\n\nUse \`AlertIcon\`.`,
    )
  })

  it('requires an icon name', async () => {
    await expect(runCommand(icon, {rawArgs: ['get']})).rejects.toThrow('Missing required positional argument')

    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it('rejects unknown icons before fetching', async () => {
    await expect(runCommand(icon, {rawArgs: ['get', 'unknown-icon']})).rejects.toThrow(
      'No icon found for "unknown-icon". Use "primer icons list" to see available icons.',
    )

    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it.each(['32', '-1', 'abc', ''])('rejects unsupported size "%s" before fetching', async size => {
    await expect(runCommand(icon, {rawArgs: ['get', 'alert', `--size=${size}`]})).rejects.toThrow(
      `Size "${size}" is not available for alert. Available sizes: 16, 24`,
    )

    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it('reports HTTP errors without emitting output', async () => {
    fetchMock.mockResolvedValue(new Response('Not found', {status: 404}))

    await expect(runCommand(icon, {rawArgs: ['get', 'alert']})).rejects.toThrow(
      'Failed to fetch documentation for alert: HTTP 404',
    )
    expect(emit).not.toHaveBeenCalled()
  })

  it('propagates network errors without emitting output', async () => {
    const error = new TypeError('fetch failed')
    fetchMock.mockRejectedValue(error)

    await expect(runCommand(icon, {rawArgs: ['get', 'alert']})).rejects.toBe(error)
    expect(emit).not.toHaveBeenCalled()
  })

  it.each(['', html`<h1>No main content</h1>`, html`<main></main>`, html`<main></main>`])(
    'rejects missing or empty documentation without emitting output',
    async source => {
      fetchMock.mockResolvedValue(new Response(source))

      await expect(runCommand(icon, {rawArgs: ['get', 'alert']})).rejects.toThrow(/Documentation for alert is/)
      expect(emit).not.toHaveBeenCalled()
    },
  )
})
