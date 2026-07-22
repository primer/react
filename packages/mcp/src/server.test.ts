import {Client} from '@modelcontextprotocol/sdk/client/index.js'
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js'
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest'
import {getComponentDocsSource} from './primer'
import {server} from './server'

describe('component documentation sources', () => {
  it('uses hosted documentation by default and supports package metadata', () => {
    expect(getComponentDocsSource(undefined)).toBe('hosted')
    expect(getComponentDocsSource('package')).toBe('package')
    expect(() => getComponentDocsSource('invalid')).toThrow(
      'PRIMER_COMPONENT_DOCS_SOURCE must be either "hosted" or "package".',
    )
  })
})

describe('get_component_batch', () => {
  const client = new Client({name: 'mcp-server-test', version: '1.0.0'})

  beforeAll(async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
    await server.connect(serverTransport)
    await client.connect(clientTransport)
  })

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>())
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  afterAll(async () => {
    await client.close()
    await server.close()
  })

  const callBatch = (names: string[]) => {
    return client.callTool({
      name: 'get_component_batch',
      arguments: {names},
    })
  }

  it('requires between 2 and 10 names', async () => {
    const tooFew = await callBatch(['Button'])
    const tooMany = await callBatch(Array.from({length: 11}, (_, index) => `Component${index}`))

    expect(tooFew.isError).toBe(true)
    expect(tooMany.isError).toBe(true)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('deduplicates names case-insensitively and preserves result order', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockImplementation(async input => {
      const url = new URL(input.toString())
      return new Response(`${url.pathname} docs`)
    })

    const result = await callBatch(['Button', 'button', 'Dialog'])

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(result.content).toEqual([
      {type: 'text', text: '/product/components/button/llms.txt docs'},
      {type: 'text', text: '/product/components/dialog/llms.txt docs'},
    ])
  })

  it('starts component fetches in parallel', async () => {
    const fetchMock = vi.mocked(fetch)
    const pendingResponses: Array<(response: Response) => void> = []
    fetchMock.mockImplementation(
      () =>
        new Promise(resolve => {
          pendingResponses.push(resolve)
        }),
    )

    const resultPromise = callBatch(['Button', 'Dialog'])
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))

    for (const resolve of pendingResponses) {
      resolve(new Response('docs'))
    }

    await expect(resultPromise).resolves.toMatchObject({
      content: [
        {type: 'text', text: 'docs'},
        {type: 'text', text: 'docs'},
      ],
    })
  })

  it('returns missing components and fetch failures in-band', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, {status: 500}))

    const result = await callBatch(['MissingComponent', 'button'])

    expect(result.isError).not.toBe(true)
    expect(result.content).toEqual([
      {
        type: 'text',
        text: '## MissingComponent\n\nStatus: not-found. No component named `MissingComponent` exists in @primer/react. Use `list_components` for valid names.',
      },
      {
        type: 'text',
        text: '## Button\n\nStatus: fetch-error. Failed to load documentation for Button.',
      },
    ])
  })

  it('returns package metadata and source-derived composition without fetching hosted documentation', async () => {
    const result = await client.callTool({
      name: 'get_component',
      arguments: {name: 'ActionMenu', source: 'package'},
    })

    expect(fetch).not.toHaveBeenCalled()
    expect(JSON.parse(getTextContent(result))).toMatchObject({
      source: 'package',
      component: {name: 'ActionMenu'},
      composition: {
        schemaVersion: 1,
        apiSubcomponents: expect.arrayContaining([
          expect.objectContaining({parent: 'ActionMenu', subcomponent: 'ActionMenu.Overlay'}),
        ]),
      },
    })
  })

  it('returns filtered package-backed composition metadata', async () => {
    const result = await client.callTool({
      name: 'get_component_composition',
      arguments: {name: 'ActionMenu'},
    })

    const payload = JSON.parse(getTextContent(result))
    expect(payload.component).toEqual({
      id: 'action_menu',
      name: 'ActionMenu',
      importPath: '@primer/react',
    })
    expect(payload.composition.observed.parentChild).toEqual(
      expect.arrayContaining([expect.objectContaining({parent: 'ActionMenu.Overlay', child: 'ActionList'})]),
    )
  })

  it('times out stalled requests without leaving timers active', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), {once: true})
        }),
    )

    const resultPromise = callBatch(['Button', 'Dialog'])
    await vi.advanceTimersByTimeAsync(10_000)

    await expect(resultPromise).resolves.toMatchObject({
      content: [
        {type: 'text', text: '## Button\n\nStatus: fetch-error. Failed to load documentation for Button.'},
        {type: 'text', text: '## Dialog\n\nStatus: fetch-error. Failed to load documentation for Dialog.'},
      ],
    })
    expect(vi.getTimerCount()).toBe(0)
  })
})

function getTextContent(result: unknown): string {
  if (typeof result !== 'object' || result === null || !('content' in result) || !Array.isArray(result.content)) {
    throw new Error('Expected tool content')
  }

  const content = result.content.find(
    (item): item is {type: 'text'; text: string} =>
      typeof item === 'object' &&
      item !== null &&
      'type' in item &&
      item.type === 'text' &&
      'text' in item &&
      typeof item.text === 'string',
  )
  if (!content) throw new Error('Expected text tool content')

  return content.text
}
