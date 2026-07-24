import {Client} from '@modelcontextprotocol/sdk/client/index.js'
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js'
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest'
import {getComponentDocsSource} from './primer'
import {server} from './server'

const searchPatternPage = `
  <main>
    <div>
      <div><nav>Product UI / Scenario patterns</nav><h1>Search</h1></div>
      <div>
        <p>Search finds things that match specific criteria.</p>
        <h2>Implementation guidelines</h2>
        <p>Use <a href="/product/components/text-input/">TextInput</a> for a simple query.</p>
        <p>Use the <a href="/product/internal-components/filter/">Filter</a> component for tokenised qualifiers.</p>
        <p>Set aria-busy="true" while loading, and show an empty state when no results match.</p>
        <h2>Related scenario patterns</h2>
        <ul><li><a href="/product/scenario-patterns/filter/">Filter</a></li></ul>
      </div>
    </div>
  </main>
`

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

  const callBatch = (names: string[], source?: 'hosted' | 'package') => {
    return client.callTool({
      name: 'get_component_batch',
      arguments: {names, source},
    })
  }
  const callPattern = (name: string, detail?: 'compact' | 'full') => {
    return client.callTool({
      name: 'get_pattern',
      arguments: {name, detail},
    })
  }
  const callTool = (name: string, args: Record<string, unknown> = {}) => {
    return client.callTool({name, arguments: args})
  }

  it('requires between 2 and 10 names', async () => {
    const tooFew = await callBatch(['Button'])
    const tooMany = await callBatch(Array.from({length: 11}, (_, index) => `Component${index}`))

    expect(tooFew.isError).toBe(true)
    expect(tooMany.isError).toBe(true)
    expect(fetch).not.toHaveBeenCalled()
  })

  it.each([
    ['init', {}, '/product/getting-started/react/llms.txt'],
    ['get_component_examples', {name: 'Button'}, '/product/components/button/llms.txt'],
    ['get_component_usage_guidelines', {name: 'Button'}, '/product/components/button/guidelines/llms.txt'],
    ['get_component_accessibility_guidelines', {name: 'Button'}, '/product/components/button/accessibility/llms.txt'],
    ['get_color_usage', {}, '/product/getting-started/foundations/color-usage/llms.txt'],
    ['get_typography_usage', {}, '/product/getting-started/foundations/typography/llms.txt'],
    ['get_icon', {name: 'alert', size: '16'}, '/octicons/icon/alert-16/llms.txt'],
  ])('prefers the text-only endpoint for %s', async (name, args, path) => {
    vi.mocked(fetch).mockResolvedValue(new Response('Text-only documentation.'))

    const result = await callTool(name, args)

    expect(fetch).toHaveBeenCalledExactlyOnceWith(new URL(`https://primer.style${path}`))
    expect(getTextContent(result)).toContain('Text-only documentation.')
  })

  it('falls back to HTML conversion only when a text-only endpoint is missing', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(null, {status: 404}))
      .mockResolvedValueOnce(new Response('<main><p>HTML fallback documentation.</p></main>'))

    const result = await callTool('get_component_examples', {name: 'Button'})

    expect(fetch).toHaveBeenNthCalledWith(1, new URL('https://primer.style/product/components/button/llms.txt'))
    expect(fetch).toHaveBeenNthCalledWith(2, new URL('https://primer.style/product/components/button'))
    expect(getTextContent(result)).toContain('HTML fallback documentation.')
  })

  it('surfaces non-404 text-only endpoint failures without requesting HTML', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, {status: 503, statusText: 'Service Unavailable'}))

    const result = await callTool('get_color_usage')

    expect(result.isError).toBe(true)
    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      new URL('https://primer.style/product/getting-started/foundations/color-usage/llms.txt'),
    )
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

  it('returns compact, composition-first package metadata for every batched component', async () => {
    const result = await callBatch(['NavList', 'SegmentedControl', 'CounterLabel', 'Avatar'], 'package')
    const contents = getTextContents(result)
    const payloads = contents.map(content => JSON.parse(content))

    expect(contents.join('\n').length).toBeLessThan(20_000)
    expect(contents.every(content => content.indexOf('"composition"') < 100)).toBe(true)

    expect(fetch).not.toHaveBeenCalled()
    expect(payloads.map(payload => payload.component.name)).toEqual([
      'NavList',
      'SegmentedControl',
      'CounterLabel',
      'Avatar',
    ])
    expect(payloads.every(payload => payload.source === 'package' && payload.composition.schemaVersion === 1)).toBe(
      true,
    )
    expect(payloads.every(payload => !('props' in payload.component) && !('stories' in payload.component))).toBe(true)
    expect(
      payloads.every(payload => !('derivation' in payload.composition) && !('sourceSummary' in payload.composition)),
    ).toBe(true)
    expect(payloads[0].composition.apiSubcomponents).toEqual(
      expect.arrayContaining([expect.objectContaining({parent: 'NavList', subcomponent: 'NavList.Item'})]),
    )
  })

  it('bounds high-connectivity package batches below MCP truncation limits', async () => {
    const result = await callBatch(['ActionList', 'SegmentedControl'], 'package')
    const contents = getTextContents(result)
    const payloads = contents.map(content => JSON.parse(content))

    expect(contents.join('\n').length).toBeLessThan(15_000)
    expect(payloads.every(payload => payload.composition.observedRelationshipLimit === 3)).toBe(true)
    expect(
      payloads.every(payload =>
        Object.values(payload.composition.observed).every(
          relationships => Array.isArray(relationships) && relationships.length <= 3,
        ),
      ),
    ).toBe(true)
    expect(
      payloads.find(payload => payload.component.name === 'ActionList')?.composition.omittedObservedRelationshipCounts,
    ).toMatchObject({
      parentChild: expect.any(Number),
      adjacentSibling: expect.any(Number),
      relatedComponents: expect.any(Number),
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

  it('returns compact structured pattern guidance with explicit component sources', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(searchPatternPage))

    const result = await callPattern('Search')
    const text = getTextContent(result)

    expect(result.structuredContent).toMatchObject({
      detail: 'compact',
      pattern: {
        id: 'search',
        name: 'Search',
        category: 'scenario',
        sourceUrl: 'https://primer.style/product/scenario-patterns/search',
      },
      components: [
        {
          id: 'text-input',
          name: 'TextInput',
          source: 'primer-public',
          sourceUrl: 'https://primer.style/product/components/text-input/',
        },
        {
          id: 'filter',
          name: 'Filter',
          source: 'primer-internal',
          sourceUrl: 'https://primer.style/product/internal-components/filter/',
        },
      ],
      relatedPatterns: [{id: 'filter', name: 'Filter', category: 'scenario'}],
      guidance: {
        implementation: expect.stringContaining('Use TextInput'),
        accessibility: [expect.stringContaining('aria-busy')],
        states: [expect.stringContaining('loading')],
      },
    })
    expect(text).not.toContain('Product UI / Scenario patterns')
    expect(text).toContain('Pass `detail: "full"`')
    expect(text.length).toBeLessThan(4_000)
    expect(JSON.stringify(result.structuredContent).length).toBeLessThan(4_000)
  })

  it('preserves complete pattern guidance when full detail is requested', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('# Search\n\nText-only pattern guidance.'))

    const result = await callPattern('Search', 'full')

    expect(result.structuredContent).toEqual({
      detail: 'full',
      pattern: {
        id: 'search',
        name: 'Search',
        category: 'scenario',
        sourceUrl: 'https://primer.style/product/scenario-patterns/search',
      },
    })
    expect(fetch).toHaveBeenCalledWith(new URL('https://primer.style/product/scenario-patterns/search/llms.txt'))
    expect(getTextContent(result)).toBe('# Search\n\nText-only pattern guidance.')
  })

  it('reports missing, empty, and invalid pattern requests without fetching unrelated content', async () => {
    const missing = await callPattern('Missing')
    const invalidDetail = await client.callTool({
      name: 'get_pattern',
      arguments: {name: 'Search', detail: 'summary'},
    })

    expect(getTextContent(missing)).toContain('There is no pattern named `Missing`')
    expect(invalidDetail.isError).toBe(true)
    expect(fetch).not.toHaveBeenCalled()

    vi.mocked(fetch).mockResolvedValue(new Response(''))
    const empty = await callPattern('Search')

    expect(empty.isError).toBe(true)
    expect(getTextContent(empty)).toContain('Primer Style returned an empty page')
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
  const [content] = getTextContents(result)
  if (!content) throw new Error('Expected text tool content')

  return content
}

function getTextContents(result: unknown): Array<string> {
  if (typeof result !== 'object' || result === null || !('content' in result) || !Array.isArray(result.content)) {
    throw new Error('Expected tool content')
  }

  return result.content
    .filter(
      (item): item is {type: 'text'; text: string} =>
        typeof item === 'object' &&
        item !== null &&
        'type' in item &&
        item.type === 'text' &&
        'text' in item &&
        typeof item.text === 'string',
    )
    .map(content => content.text)
}
