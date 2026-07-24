import {Client} from '@modelcontextprotocol/sdk/client/index.js'
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js'
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest'
import {server} from './server'

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

  it('documents which component tool to use for each supported count', async () => {
    const {tools} = await client.listTools()
    const getComponent = tools.find(tool => tool.name === 'get_component')
    const getComponentBatch = tools.find(tool => tool.name === 'get_component_batch')
    const listResult = await client.callTool({name: 'list_components'})

    expect(getComponent?.description).toBe(
      'Retrieve official documentation and usage details for exactly one React component from the @primer/react package. Use get_component_batch for 2 to 10 components.',
    )
    expect(getComponentBatch?.description).toBe(
      'Retrieve official documentation and usage details for 2 to 10 React components from the @primer/react package in one call. Use get_component for exactly one component.',
    )
    expect(listResult.content).toContainEqual(
      expect.objectContaining({
        type: 'text',
        text: expect.stringContaining(
          'Use `get_component` for exactly one component and `get_component_batch` for 2 to 10 components.',
        ),
      }),
    )
  })

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
