import {runCommand} from 'citty'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {guidelines} from './index'
import {log} from '../../console'

vi.mock('../../console')

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

describe.each([
  {kind: 'color', path: 'color-usage'},
  {kind: 'typography', path: 'typography'},
])('guidelines $kind get', ({kind, path}) => {
  it('fetches the official foundation page and emits its main content as Markdown', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        html`<nav>Navigation</nav>
          <main>
            <h2>Usage</h2>
            <p>Use <code>design tokens</code>.</p>
          </main>
          <footer>Footer</footer>`,
      ),
    )

    await runCommand(guidelines, {rawArgs: [kind, 'get']})

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      new URL(`/product/getting-started/foundations/${path}`, 'https://primer.style'),
      {signal: expect.any(AbortSignal)},
    )
    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `Here is the documentation for ${kind} usage in Primer:\n\nUsage\n-----\n\nUse \`design tokens\`.`,
    )
  })

  it.each([404, 500])('reports HTTP %s without emitting output', async status => {
    fetchMock.mockResolvedValue(new Response('Failed to load documentation', {status}))

    await expect(runCommand(guidelines, {rawArgs: [kind, 'get']})).rejects.toThrow(
      `Failed to fetch documentation for ${kind} usage: HTTP ${status}`,
    )
    expect(emit).not.toHaveBeenCalled()
  })

  it('propagates network failures without emitting output', async () => {
    const error = new TypeError('fetch failed')
    fetchMock.mockRejectedValue(error)

    await expect(runCommand(guidelines, {rawArgs: [kind, 'get']})).rejects.toBe(error)
    expect(emit).not.toHaveBeenCalled()
  })

  it.each(['', html`<h1>No main content</h1>`, html`<main></main>`])(
    'rejects missing or empty content without emitting output',
    async source => {
      fetchMock.mockResolvedValue(new Response(source))

      await expect(runCommand(guidelines, {rawArgs: [kind, 'get']})).rejects.toThrow(
        `Documentation for ${kind} usage is`,
      )
      expect(emit).not.toHaveBeenCalled()
    },
  )
})

describe('guidelines coding get', () => {
  it('emits the Primer coding guidance locally with supported CLI references', async () => {
    await runCommand(guidelines, {rawArgs: ['coding', 'get']})

    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).toHaveBeenCalledTimes(1)
    const output = emit.mock.calls[0][0]
    expect(output).toContain('## Design Tokens')
    expect(output).toContain('## Authoring & Using Components')
    expect(output).toContain('Do not use the sx prop for styling components. Instead, use CSS Modules.')
    expect(output).toContain('Do not use the Box component for styling components. Instead, use CSS Modules.')
    expect(output).toContain('`primer icons list`')
    expect(output).toContain('`primer components usage get <id|name>`')
    expect(output).toContain('`primer components accessibility get <id|name>`')
  })
})
