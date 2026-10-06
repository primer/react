import {runCommand} from 'citty'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {components as component} from './index'
import {log} from '../../console'

vi.mock('../../console')

describe.each([
  {kind: 'usage', path: 'guidelines'},
  {kind: 'accessibility', path: 'accessibility'},
])('components $kind get', ({kind, path}) => {
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

  it.each([
    {identifier: 'button', name: 'Button', slug: 'button'},
    {identifier: 'bUtToN', name: 'Button', slug: 'button'},
    {identifier: 'ActionList', name: 'ActionList', slug: 'action-list'},
    {identifier: 'select_panel_v2', name: 'SelectPanel', slug: 'select-panel'},
  ])('retrieves Markdown guidelines for $identifier', async ({identifier, name, slug}) => {
    fetchMock.mockResolvedValue(
      new Response(
        html`<nav>Navigation</nav>
          <main>
            <h2>Guidelines</h2>
            <p>Use <code>aria-label</code> appropriately.</p>
          </main>
          <footer>Footer</footer>`,
      ),
    )

    await runCommand(component, {rawArgs: [kind, 'get', identifier]})

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      new URL(`/product/components/${slug}/${path}`, 'https://primer.style'),
      {signal: expect.any(AbortSignal)},
    )
    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `Here are the ${kind} guidelines for the \`${name}\` component from the @primer/react package:\n\nGuidelines\n----------\n\nUse \`aria-label\` appropriately.`,
    )
  })

  it('requires a component ID or name', async () => {
    await expect(runCommand(component, {rawArgs: [kind, 'get']})).rejects.toThrow(
      'Missing required positional argument',
    )

    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it('rejects unknown components without fetching or emitting output', async () => {
    await expect(runCommand(component, {rawArgs: [kind, 'get', 'UnknownComponent']})).rejects.toThrow(
      'No component found for "UnknownComponent". Use "primer components list" to see available components.',
    )

    expect(fetchMock).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it('explicitly reports unavailable guidelines on HTTP 404', async () => {
    fetchMock.mockResolvedValue(new Response('Not found', {status: 404}))

    await runCommand(component, {rawArgs: [kind, 'get', 'Button']})

    expect(emit).toHaveBeenCalledExactlyOnceWith(
      `There are no ${kind} guidelines for the \`Button\` component in the @primer/react package.`,
    )
  })

  it.each([302, 401, 403, 500])('fails on HTTP %s instead of reporting missing guidelines', async status => {
    fetchMock.mockResolvedValue(new Response('Request failed', {status}))

    await expect(runCommand(component, {rawArgs: [kind, 'get', 'Button']})).rejects.toThrow(
      `Failed to fetch documentation for Button: HTTP ${status}`,
    )
    expect(emit).not.toHaveBeenCalled()
  })

  it('propagates network failures without emitting output', async () => {
    const error = new TypeError('fetch failed')
    fetchMock.mockRejectedValue(error)

    await expect(runCommand(component, {rawArgs: [kind, 'get', 'Button']})).rejects.toBe(error)
    expect(emit).not.toHaveBeenCalled()
  })

  it('fails if the guidelines page has no main content', async () => {
    fetchMock.mockResolvedValue(new Response(html`<h1>Missing documentation</h1>`))

    await expect(runCommand(component, {rawArgs: [kind, 'get', 'Button']})).rejects.toThrow(
      'Documentation for Button is missing its main content',
    )
    expect(emit).not.toHaveBeenCalled()
  })
})
