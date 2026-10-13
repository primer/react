import {Client, InMemoryTransport} from '@modelcontextprotocol/client'
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest'
import {server} from './server'

interface UsageGuidelineRoute {
  name: string
  expectedPath: string
  rawIdPath?: string
  publication: 'published' | 'unpublished'
}

// Publication was checked against the sitemap and live pages on 2026-10-13.
// Unpublished cases protect routing under controlled responses, not the existence of guidance.
const usageGuidelineRoutes: ReadonlyArray<UsageGuidelineRoute> = [
  {
    name: 'ActionBar',
    expectedPath: '/product/components/action-bar/guidelines',
    rawIdPath: '/product/components/actionbar/guidelines',
    publication: 'published',
  },
  {
    name: 'ActionList',
    expectedPath: '/product/components/action-list/guidelines',
    rawIdPath: '/product/components/action_list/guidelines',
    publication: 'published',
  },
  {
    name: 'ActionMenu',
    expectedPath: '/product/components/action-menu/guidelines',
    rawIdPath: '/product/components/action_menu/guidelines',
    publication: 'published',
  },
  {
    name: 'AnchoredOverlay',
    expectedPath: '/product/components/anchored-overlay/guidelines',
    rawIdPath: '/product/components/anchored_overlay/guidelines',
    publication: 'unpublished',
  },
  {name: 'Autocomplete', expectedPath: '/product/components/autocomplete/guidelines', publication: 'published'},
  {name: 'Avatar', expectedPath: '/product/components/avatar/guidelines', publication: 'unpublished'},
  {
    name: 'AvatarStack',
    expectedPath: '/product/components/avatar-stack/guidelines',
    rawIdPath: '/product/components/avatar_stack/guidelines',
    publication: 'unpublished',
  },
  {name: 'Banner', expectedPath: '/product/components/banner/guidelines', publication: 'published'},
  {name: 'Blankslate', expectedPath: '/product/components/blankslate/guidelines', publication: 'published'},
  {
    name: 'BranchName',
    expectedPath: '/product/components/branch-name/guidelines',
    rawIdPath: '/product/components/branch_name/guidelines',
    publication: 'unpublished',
  },
  {name: 'Breadcrumbs', expectedPath: '/product/components/breadcrumbs/guidelines', publication: 'published'},
  {name: 'Button', expectedPath: '/product/components/button/guidelines', publication: 'published'},
  {
    name: 'IconButton',
    expectedPath: '/product/components/icon-button/guidelines',
    rawIdPath: '/product/components/icon_button/guidelines',
    publication: 'published',
  },
  {
    name: 'ButtonGroup',
    expectedPath: '/product/components/button-group/guidelines',
    rawIdPath: '/product/components/button_group/guidelines',
    publication: 'published',
  },
  {name: 'Card', expectedPath: '/product/components/card/guidelines', publication: 'unpublished'},
  {name: 'Checkbox', expectedPath: '/product/components/checkbox/guidelines', publication: 'unpublished'},
  {
    name: 'CheckboxGroup',
    expectedPath: '/product/components/checkbox-group/guidelines',
    rawIdPath: '/product/components/checkbox_group/guidelines',
    publication: 'published',
  },
  {
    name: 'CircleBadge',
    expectedPath: '/product/components/circle-badge/guidelines',
    rawIdPath: '/product/components/circle_badge/guidelines',
    publication: 'unpublished',
  },
  {
    name: 'ConfirmationDialog',
    expectedPath: '/product/components/confirmation-dialog/guidelines',
    rawIdPath: '/product/components/confirmationdialog/guidelines',
    publication: 'published',
  },
  {
    name: 'CounterLabel',
    expectedPath: '/product/components/counter-label/guidelines',
    rawIdPath: '/product/components/counter_label/guidelines',
    publication: 'unpublished',
  },
  {
    name: 'DataTable',
    expectedPath: '/product/components/data-table/guidelines',
    rawIdPath: '/product/components/data_table/guidelines',
    publication: 'published',
  },
  {name: 'Details', expectedPath: '/product/components/details/guidelines', publication: 'unpublished'},
  {
    name: 'Dialog',
    expectedPath: '/product/components/dialog/guidelines',
    rawIdPath: '/product/components/dialog_v2/guidelines',
    publication: 'published',
  },
  {
    name: 'FeatureFlags',
    expectedPath: '/product/components/feature-flags/guidelines',
    rawIdPath: '/product/components/feature_flags/guidelines',
    publication: 'unpublished',
  },
  {name: 'Flash', expectedPath: '/product/components/flash/guidelines', publication: 'unpublished'},
  {
    name: 'FormControl',
    expectedPath: '/product/components/form-control/guidelines',
    rawIdPath: '/product/components/form_control/guidelines',
    publication: 'unpublished',
  },
  {name: 'Header', expectedPath: '/product/components/header/guidelines', publication: 'unpublished'},
  {name: 'Heading', expectedPath: '/product/components/heading/guidelines', publication: 'unpublished'},
  {name: 'Hidden', expectedPath: '/product/components/hidden/guidelines', publication: 'unpublished'},
  {
    name: 'InlineMessage',
    expectedPath: '/product/components/inline-message/guidelines',
    rawIdPath: '/product/components/inline_message/guidelines',
    publication: 'unpublished',
  },
  {name: 'KeybindingHint', expectedPath: '/product/components/KeybindingHint/guidelines', publication: 'unpublished'},
  {name: 'Label', expectedPath: '/product/components/label/guidelines', publication: 'unpublished'},
  {
    name: 'LabelGroup',
    expectedPath: '/product/components/label-group/guidelines',
    rawIdPath: '/product/components/label_group/guidelines',
    publication: 'unpublished',
  },
  {name: 'Link', expectedPath: '/product/components/link/guidelines', publication: 'published'},
  {
    name: 'NavList',
    expectedPath: '/product/components/nav-list/guidelines',
    rawIdPath: '/product/components/nav_list/guidelines',
    publication: 'unpublished',
  },
  {name: 'Octicon', expectedPath: '/product/components/octicon/guidelines', publication: 'unpublished'},
  {name: 'Overlay', expectedPath: '/product/components/overlay/guidelines', publication: 'unpublished'},
  {
    name: 'PageHeader',
    expectedPath: '/product/components/page-header/guidelines',
    rawIdPath: '/product/components/page_header/guidelines',
    publication: 'published',
  },
  {
    name: 'PageLayout',
    expectedPath: '/product/components/page-layout/guidelines',
    rawIdPath: '/product/components/page_layout/guidelines',
    publication: 'unpublished',
  },
  {name: 'Pagehead', expectedPath: '/product/components/pagehead/guidelines', publication: 'unpublished'},
  {name: 'Pagination', expectedPath: '/product/components/pagination/guidelines', publication: 'published'},
  {name: 'Popover', expectedPath: '/product/components/popover/guidelines', publication: 'published'},
  {name: 'Portal', expectedPath: '/product/components/portal/guidelines', publication: 'unpublished'},
  {
    name: 'ProgressBar',
    expectedPath: '/product/components/progress-bar/guidelines',
    rawIdPath: '/product/components/progress_bar/guidelines',
    publication: 'unpublished',
  },
  {name: 'Radio', expectedPath: '/product/components/radio/guidelines', publication: 'unpublished'},
  {
    name: 'RadioGroup',
    expectedPath: '/product/components/radio-group/guidelines',
    rawIdPath: '/product/components/radio_group/guidelines',
    publication: 'published',
  },
  {
    name: 'RelativeTime',
    expectedPath: '/product/components/relative-time/guidelines',
    rawIdPath: '/product/components/relative_time/guidelines',
    publication: 'published',
  },
  {
    name: 'SegmentedControl',
    expectedPath: '/product/components/segmented-control/guidelines',
    rawIdPath: '/product/components/segmented_control/guidelines',
    publication: 'published',
  },
  {name: 'Select', expectedPath: '/product/components/select/guidelines', publication: 'published'},
  {
    name: 'SelectPanel',
    expectedPath: '/product/components/select-panel/guidelines',
    rawIdPath: '/product/components/select_panel/guidelines',
    publication: 'published',
  },
  {
    name: 'SkeletonBox',
    expectedPath: '/product/components/skeleton-box/guidelines',
    rawIdPath: '/product/components/skeleton_box/guidelines',
    publication: 'unpublished',
  },
  {
    name: 'SkeletonAvatar',
    expectedPath: '/product/components/skeleton-avatar/guidelines',
    rawIdPath: '/product/components/skeleton_avatar/guidelines',
    publication: 'unpublished',
  },
  {
    name: 'SkeletonText',
    expectedPath: '/product/components/skeleton-text/guidelines',
    rawIdPath: '/product/components/skeleton_text/guidelines',
    publication: 'unpublished',
  },
  {name: 'Spinner', expectedPath: '/product/components/spinner/guidelines', publication: 'unpublished'},
  {
    name: 'SplitPageLayout',
    expectedPath: '/product/components/split-page-layout/guidelines',
    rawIdPath: '/product/components/split_page_layout/guidelines',
    publication: 'unpublished',
  },
  {name: 'Stack', expectedPath: '/product/components/stack/guidelines', publication: 'unpublished'},
  {
    name: 'StateLabel',
    expectedPath: '/product/components/state-label/guidelines',
    rawIdPath: '/product/components/state_label/guidelines',
    publication: 'unpublished',
  },
  {
    name: 'SubNav',
    expectedPath: '/product/components/sub-nav/guidelines',
    rawIdPath: '/product/components/sub_nav/guidelines',
    publication: 'unpublished',
  },
  {
    name: 'TabNav',
    expectedPath: '/product/components/tab-nav/guidelines',
    rawIdPath: '/product/components/tab_nav/guidelines',
    publication: 'unpublished',
  },
  {name: 'Text', expectedPath: '/product/components/text/guidelines', publication: 'unpublished'},
  {
    name: 'TextInput',
    expectedPath: '/product/components/text-input/guidelines',
    rawIdPath: '/product/components/text_input/guidelines',
    publication: 'published',
  },
  {
    name: 'TextInputWithTokens',
    expectedPath: '/product/components/text-input-with-tokens/guidelines',
    rawIdPath: '/product/components/text_input_with_tokens/guidelines',
    publication: 'published',
  },
  {name: 'Textarea', expectedPath: '/product/components/textarea/guidelines', publication: 'published'},
  {name: 'Timeline', expectedPath: '/product/components/timeline/guidelines', publication: 'unpublished'},
  {
    name: 'ToggleSwitch',
    expectedPath: '/product/components/toggle-switch/guidelines',
    rawIdPath: '/product/components/toggle_switch/guidelines',
    publication: 'published',
  },
  {name: 'Token', expectedPath: '/product/components/token/guidelines', publication: 'published'},
  {name: 'Tooltip', expectedPath: '/product/components/tooltip/guidelines', publication: 'published'},
  {
    name: 'TopicTag',
    expectedPath: '/product/components/topic-tag/guidelines',
    rawIdPath: '/product/components/topic_tag/guidelines',
    publication: 'unpublished',
  },
  {
    name: 'TreeView',
    expectedPath: '/product/components/tree-view/guidelines',
    rawIdPath: '/product/components/tree_view/guidelines',
    publication: 'published',
  },
  {name: 'Truncate', expectedPath: '/product/components/truncate/guidelines', publication: 'unpublished'},
  {
    name: 'UnderlineNav',
    expectedPath: '/product/components/underline-nav/guidelines',
    rawIdPath: '/product/components/underline_nav/guidelines',
    publication: 'published',
  },
  {name: 'AriaAlert', expectedPath: '/product/components/aria-alert/guidelines', publication: 'unpublished'},
  {name: 'AriaStatus', expectedPath: '/product/components/aria-status/guidelines', publication: 'unpublished'},
  {
    name: 'FilteredSearch',
    expectedPath: '/product/components/filtered-search/guidelines',
    rawIdPath: '/product/components/filtered_search/guidelines',
    publication: 'unpublished',
  },
  {
    name: 'IssueLabel',
    expectedPath: '/product/components/issue-label/guidelines',
    rawIdPath: '/product/components/issue_label/guidelines',
    publication: 'unpublished',
  },
  {
    name: 'UnderlinePanels',
    expectedPath: '/product/components/underline-panels/guidelines',
    rawIdPath: '/product/components/underline_panels/guidelines',
    publication: 'published',
  },
]

describe('MCP server', () => {
  const client = new Client(
    {name: 'mcp-server-test', version: '1.0.0'},
    {
      capabilities: {
        sampling: {},
      },
    },
  )

  beforeAll(async () => {
    client.setRequestHandler('sampling/createMessage', async () => {
      return {
        model: 'test-model',
        role: 'assistant',
        content: {
          type: 'text',
          text: 'The alt text is descriptive and relevant.',
        },
      }
    })

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

  const responseWithFinalUrl = (body: string, url: string) => {
    const response = new Response(body)
    Object.defineProperty(response, 'url', {value: url})
    return response
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

  it('lists every published scenario pattern', async () => {
    const result = await client.callTool({name: 'list_patterns'})
    const scenarioPatterns = ['Copy', 'Create', 'Customize', 'Delegate', 'Delete', 'Edit', 'Filter', 'Search', 'View']

    expect(result.content).toContainEqual(
      expect.objectContaining({
        type: 'text',
        text: expect.stringContaining(
          `## Scenario patterns\n\n${scenarioPatterns.map(name => `- ${name}`).join('\n')}`,
        ),
      }),
    )
  })

  it.each([
    {name: 'Create', id: 'create'},
    {name: 'Customize', id: 'customize'},
    {name: 'Delegate', id: 'delegate'},
    {name: 'Edit', id: 'edit'},
    {name: 'View', id: 'view'},
  ])('retrieves the $name scenario pattern from its published URL', async ({name, id}) => {
    vi.mocked(fetch).mockResolvedValue(new Response(`<main><h1>${name}</h1></main>`))

    const result = await client.callTool({
      name: 'get_pattern',
      arguments: {name},
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(vi.mocked(fetch).mock.calls[0]?.[0].toString()).toBe(`https://primer.style/product/scenario-patterns/${id}`)
    expect(result.content).toContainEqual(
      expect.objectContaining({
        type: 'text',
        text: expect.stringContaining(`Here are the guidelines for the \`${name}\` pattern for Primer:`),
      }),
    )
  })

  it('covers every advertised component with a named usage-guidelines routing case', async () => {
    const result = await client.callTool({name: 'list_components'})
    expect(result.isError).not.toBe(true)
    expect(result.content).toHaveLength(1)

    const [content] = result.content
    if (content.type !== 'text') {
      throw new Error('Expected list_components to return a text component list')
    }

    const names = content.text
      .split('\n')
      .filter(line => line.startsWith('- '))
      .map(line => line.slice(2))

    expect([...new Set(names)].sort()).toEqual(usageGuidelineRoutes.map(route => route.name).sort())
    expect(names.filter((name, index) => names.indexOf(name) !== index).sort()).toEqual([
      'Dialog',
      'SelectPanel',
      'Tooltip',
      'UnderlineNav',
    ])
    expect(fetch).not.toHaveBeenCalled()
  })

  it.each(usageGuidelineRoutes)(
    '$name usage request follows its expected route (guidelines $publication)',
    async ({name, expectedPath, rawIdPath}) => {
      const expectedUrl = `https://primer.style${expectedPath}`
      const rawIdUrl = rawIdPath ? `https://primer.style${rawIdPath}` : undefined
      const responseBody = `synthetic-${name.toLowerCase()}-usage-body`
      const homepageBody = `homepage-body-not-${name.toLowerCase()}-guidance`
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockImplementation(async input => {
        const url = input.toString()

        if (url === expectedUrl) {
          return responseWithFinalUrl(`<main><p>${responseBody}</p></main>`, expectedUrl)
        }

        if (url === rawIdUrl) {
          return responseWithFinalUrl(`<main><nav>${name}</nav><p>${homepageBody}</p></main>`, 'https://primer.style/')
        }

        throw new Error(`Unexpected fetch request: ${url}`)
      })

      const result = await client.callTool({
        name: 'get_component_usage_guidelines',
        arguments: {name},
      })

      expect(result.isError).not.toBe(true)
      expect(result.content).toContainEqual(
        expect.objectContaining({
          type: 'text',
          text: expect.stringContaining(responseBody),
        }),
      )
      expect(result.content).not.toContainEqual(
        expect.objectContaining({
          type: 'text',
          text: expect.stringContaining(homepageBody),
        }),
      )
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock.mock.calls[0]?.[0].toString()).toBe(expectedUrl)
    },
  )

  it.each(['ConfirmationDialog', 'confirmationdialog'])(
    'retrieves ConfirmationDialog documentation for %s from its published URL',
    async name => {
      const url = 'https://primer.style/product/components/confirmation-dialog/llms.txt'
      const body = '# ConfirmationDialog\n\nSynthetic component documentation.'
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockImplementation(async input => {
        if (input.toString() === url) {
          return new Response(body)
        }

        if (input.toString() === 'https://primer.style/product/components/confirmationdialog/llms.txt') {
          return new Response(null, {status: 404})
        }

        throw new Error(`Unexpected fetch request: ${input}`)
      })

      const result = await client.callTool({name: 'get_component', arguments: {name}})

      expect(result.isError).not.toBe(true)
      expect(result.content).toEqual([{type: 'text', text: body}])
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock.mock.calls[0]?.[0].toString()).toBe(url)
    },
  )

  it.each(['ConfirmationDialog', 'confirmationdialog'])(
    'retrieves ConfirmationDialog documentation in a mixed batch for %s from its published URL',
    async name => {
      const confirmationUrl = 'https://primer.style/product/components/confirmation-dialog/llms.txt'
      const buttonUrl = 'https://primer.style/product/components/button/llms.txt'
      const confirmationBody = '# ConfirmationDialog\n\nSynthetic component documentation.'
      const buttonBody = '# Button\n\nSynthetic component documentation.'
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockImplementation(async input => {
        const url = input.toString()
        if (url === confirmationUrl) {
          return new Response(confirmationBody)
        }

        if (url === buttonUrl) {
          return new Response(buttonBody)
        }

        if (url === 'https://primer.style/product/components/confirmationdialog/llms.txt') {
          return new Response(null, {status: 404})
        }

        throw new Error(`Unexpected fetch request: ${url}`)
      })

      const result = await callBatch([name, 'Button'])

      expect(result.isError).not.toBe(true)
      expect(result.content).toEqual([
        {type: 'text', text: confirmationBody},
        {type: 'text', text: buttonBody},
      ])
      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(fetchMock.mock.calls.map(([input]) => input.toString()).sort()).toEqual(
        [confirmationUrl, buttonUrl].sort(),
      )
    },
  )

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

  it('reviews alt text through the multi-round-trip sampling flow', async () => {
    const result = await client.callTool({
      name: 'review_alt_text',
      arguments: {
        surroundingText: 'A pull request description',
        alt: 'Screenshot of a successful test run',
        image: 'test-results.png',
      },
    })

    expect(result.content).toContainEqual({
      type: 'text',
      text: 'The alt text is descriptive and relevant.',
    })
  })
})
