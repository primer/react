import {runCommand} from 'citty'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {get as getColor} from './color/get'
import {get as getTypography} from './typography/get'
import {get as getCoding} from './coding/get'
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
  {kind: 'color', path: 'color-usage', command: getColor},
  {kind: 'typography', path: 'typography', command: getTypography},
])('guidelines $kind get', ({kind, path, command}) => {
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

    await runCommand(command, {rawArgs: []})

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

    await expect(runCommand(command, {rawArgs: []})).rejects.toThrow(
      `Failed to fetch documentation for ${kind} usage: HTTP ${status}`,
    )
    expect(emit).not.toHaveBeenCalled()
  })

  it('propagates network failures without emitting output', async () => {
    const error = new TypeError('fetch failed')
    fetchMock.mockRejectedValue(error)

    await expect(runCommand(command, {rawArgs: []})).rejects.toBe(error)
    expect(emit).not.toHaveBeenCalled()
  })

  it.each(['', html`<h1>No main content</h1>`, html`<main></main>`])(
    'rejects missing or empty content without emitting output',
    async source => {
      fetchMock.mockResolvedValue(new Response(source))

      await expect(runCommand(command, {rawArgs: []})).rejects.toThrow(`Documentation for ${kind} usage is`)
      expect(emit).not.toHaveBeenCalled()
    },
  )
})

describe('guidelines coding get', () => {
  it('emits the Primer coding guidance locally with supported CLI references', async () => {
    await runCommand(getCoding, {rawArgs: []})

    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).toHaveBeenCalledTimes(1)
    const output = emit.mock.calls[0][0]
    expect(output).toContain('## Design Tokens')
    expect(output).toContain('## Authoring & Using Components')
    expect(output).toContain('Do not use the sx prop for styling components. Instead, use CSS Modules.')
    expect(output).toContain('Do not use the Box component for styling components. Instead, use CSS Modules.')
    expect(output).toContain('`primer icons list`')
    expect(output).toContain('`primer scenarios list`')
    expect(output).toContain('`primer patterns list`')
    expect(output).toContain('`primer components usage get <id|name>`')
    expect(output).toContain('`primer components accessibility get <id|name>`')
    expect(output).toContain('`primer tokens search`')
    expect(output).toContain('`primer tokens specs`')
    expect(output).toContain('`primer tokens group list <groups...>`')
    expect(output).toContain('`primer tokens get <name>`')
    expect(output).toContain('`primer tokens usage get`')
    expect(output).not.toContain('find_tokens')
  })
})
