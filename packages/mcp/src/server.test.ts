import {Client, InMemoryTransport} from '@modelcontextprotocol/client'
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest'
import {server} from './server'

interface UsageGuidelineRoute {
  name: string
  canonicalPath: string
  rawIdPath?: string
}

const usageGuidelineRoutes: ReadonlyArray<UsageGuidelineRoute> = [
  {
    name: 'ActionBar',
    canonicalPath: '/product/components/action-bar/guidelines',
    rawIdPath: '/product/components/actionbar/guidelines',
  },
  {
    name: 'ActionList',
    canonicalPath: '/product/components/action-list/guidelines',
    rawIdPath: '/product/components/action_list/guidelines',
  },
  {
    name: 'ActionMenu',
    canonicalPath: '/product/components/action-menu/guidelines',
    rawIdPath: '/product/components/action_menu/guidelines',
  },
  {
    name: 'AnchoredOverlay',
    canonicalPath: '/product/components/anchored-overlay/guidelines',
    rawIdPath: '/product/components/anchored_overlay/guidelines',
  },
  {name: 'Autocomplete', canonicalPath: '/product/components/autocomplete/guidelines'},
  {name: 'Avatar', canonicalPath: '/product/components/avatar/guidelines'},
  {
    name: 'AvatarStack',
    canonicalPath: '/product/components/avatar-stack/guidelines',
    rawIdPath: '/product/components/avatar_stack/guidelines',
  },
  {name: 'Banner', canonicalPath: '/product/components/banner/guidelines'},
  {name: 'Blankslate', canonicalPath: '/product/components/blankslate/guidelines'},
  {
    name: 'BranchName',
    canonicalPath: '/product/components/branch-name/guidelines',
    rawIdPath: '/product/components/branch_name/guidelines',
  },
  {name: 'Breadcrumbs', canonicalPath: '/product/components/breadcrumbs/guidelines'},
  {name: 'Button', canonicalPath: '/product/components/button/guidelines'},
  {
    name: 'IconButton',
    canonicalPath: '/product/components/icon-button/guidelines',
    rawIdPath: '/product/components/icon_button/guidelines',
  },
  {
    name: 'ButtonGroup',
    canonicalPath: '/product/components/button-group/guidelines',
    rawIdPath: '/product/components/button_group/guidelines',
  },
  {name: 'Card', canonicalPath: '/product/components/card/guidelines'},
  {name: 'Checkbox', canonicalPath: '/product/components/checkbox/guidelines'},
  {
    name: 'CheckboxGroup',
    canonicalPath: '/product/components/checkbox-group/guidelines',
    rawIdPath: '/product/components/checkbox_group/guidelines',
  },
  {
    name: 'CircleBadge',
    canonicalPath: '/product/components/circle-badge/guidelines',
    rawIdPath: '/product/components/circle_badge/guidelines',
  },
  {name: 'ConfirmationDialog', canonicalPath: '/product/components/confirmationdialog/guidelines'},
  {
    name: 'CounterLabel',
    canonicalPath: '/product/components/counter-label/guidelines',
    rawIdPath: '/product/components/counter_label/guidelines',
  },
  {
    name: 'DataTable',
    canonicalPath: '/product/components/data-table/guidelines',
    rawIdPath: '/product/components/data_table/guidelines',
  },
  {name: 'Details', canonicalPath: '/product/components/details/guidelines'},
  {
    name: 'Dialog',
    canonicalPath: '/product/components/dialog/guidelines',
    rawIdPath: '/product/components/dialog_v2/guidelines',
  },
  {
    name: 'FeatureFlags',
    canonicalPath: '/product/components/feature-flags/guidelines',
    rawIdPath: '/product/components/feature_flags/guidelines',
  },
  {name: 'Flash', canonicalPath: '/product/components/flash/guidelines'},
  {
    name: 'FormControl',
    canonicalPath: '/product/components/form-control/guidelines',
    rawIdPath: '/product/components/form_control/guidelines',
  },
  {name: 'Header', canonicalPath: '/product/components/header/guidelines'},
  {name: 'Heading', canonicalPath: '/product/components/heading/guidelines'},
  {name: 'Hidden', canonicalPath: '/product/components/hidden/guidelines'},
  {
    name: 'InlineMessage',
    canonicalPath: '/product/components/inline-message/guidelines',
    rawIdPath: '/product/components/inline_message/guidelines',
  },
  {name: 'KeybindingHint', canonicalPath: '/product/components/KeybindingHint/guidelines'},
  {name: 'Label', canonicalPath: '/product/components/label/guidelines'},
  {
    name: 'LabelGroup',
    canonicalPath: '/product/components/label-group/guidelines',
    rawIdPath: '/product/components/label_group/guidelines',
  },
  {name: 'Link', canonicalPath: '/product/components/link/guidelines'},
  {
    name: 'NavList',
    canonicalPath: '/product/components/nav-list/guidelines',
    rawIdPath: '/product/components/nav_list/guidelines',
  },
  {name: 'Octicon', canonicalPath: '/product/components/octicon/guidelines'},
  {name: 'Overlay', canonicalPath: '/product/components/overlay/guidelines'},
  {
    name: 'PageHeader',
    canonicalPath: '/product/components/page-header/guidelines',
    rawIdPath: '/product/components/page_header/guidelines',
  },
  {
    name: 'PageLayout',
    canonicalPath: '/product/components/page-layout/guidelines',
    rawIdPath: '/product/components/page_layout/guidelines',
  },
  {name: 'Pagehead', canonicalPath: '/product/components/pagehead/guidelines'},
  {name: 'Pagination', canonicalPath: '/product/components/pagination/guidelines'},
  {name: 'Popover', canonicalPath: '/product/components/popover/guidelines'},
  {name: 'Portal', canonicalPath: '/product/components/portal/guidelines'},
  {
    name: 'ProgressBar',
    canonicalPath: '/product/components/progress-bar/guidelines',
    rawIdPath: '/product/components/progress_bar/guidelines',
  },
  {name: 'Radio', canonicalPath: '/product/components/radio/guidelines'},
  {
    name: 'RadioGroup',
    canonicalPath: '/product/components/radio-group/guidelines',
    rawIdPath: '/product/components/radio_group/guidelines',
  },
  {
    name: 'RelativeTime',
    canonicalPath: '/product/components/relative-time/guidelines',
    rawIdPath: '/product/components/relative_time/guidelines',
  },
  {
    name: 'SegmentedControl',
    canonicalPath: '/product/components/segmented-control/guidelines',
    rawIdPath: '/product/components/segmented_control/guidelines',
  },
  {name: 'Select', canonicalPath: '/product/components/select/guidelines'},
  {
    name: 'SelectPanel',
    canonicalPath: '/product/components/select-panel/guidelines',
    rawIdPath: '/product/components/select_panel/guidelines',
  },
  {
    name: 'SkeletonBox',
    canonicalPath: '/product/components/skeleton-box/guidelines',
    rawIdPath: '/product/components/skeleton_box/guidelines',
  },
  {
    name: 'SkeletonAvatar',
    canonicalPath: '/product/components/skeleton-avatar/guidelines',
    rawIdPath: '/product/components/skeleton_avatar/guidelines',
  },
  {
    name: 'SkeletonText',
    canonicalPath: '/product/components/skeleton-text/guidelines',
    rawIdPath: '/product/components/skeleton_text/guidelines',
  },
  {name: 'Spinner', canonicalPath: '/product/components/spinner/guidelines'},
  {
    name: 'SplitPageLayout',
    canonicalPath: '/product/components/split-page-layout/guidelines',
    rawIdPath: '/product/components/split_page_layout/guidelines',
  },
  {name: 'Stack', canonicalPath: '/product/components/stack/guidelines'},
  {
    name: 'StateLabel',
    canonicalPath: '/product/components/state-label/guidelines',
    rawIdPath: '/product/components/state_label/guidelines',
  },
  {
    name: 'SubNav',
    canonicalPath: '/product/components/sub-nav/guidelines',
    rawIdPath: '/product/components/sub_nav/guidelines',
  },
  {
    name: 'TabNav',
    canonicalPath: '/product/components/tab-nav/guidelines',
    rawIdPath: '/product/components/tab_nav/guidelines',
  },
  {name: 'Text', canonicalPath: '/product/components/text/guidelines'},
  {
    name: 'TextInput',
    canonicalPath: '/product/components/text-input/guidelines',
    rawIdPath: '/product/components/text_input/guidelines',
  },
  {
    name: 'TextInputWithTokens',
    canonicalPath: '/product/components/text-input-with-tokens/guidelines',
    rawIdPath: '/product/components/text_input_with_tokens/guidelines',
  },
  {name: 'Textarea', canonicalPath: '/product/components/textarea/guidelines'},
  {name: 'Timeline', canonicalPath: '/product/components/timeline/guidelines'},
  {
    name: 'ToggleSwitch',
    canonicalPath: '/product/components/toggle-switch/guidelines',
    rawIdPath: '/product/components/toggle_switch/guidelines',
  },
  {name: 'Token', canonicalPath: '/product/components/token/guidelines'},
  {name: 'Tooltip', canonicalPath: '/product/components/tooltip/guidelines'},
  {
    name: 'TopicTag',
    canonicalPath: '/product/components/topic-tag/guidelines',
    rawIdPath: '/product/components/topic_tag/guidelines',
  },
  {
    name: 'TreeView',
    canonicalPath: '/product/components/tree-view/guidelines',
    rawIdPath: '/product/components/tree_view/guidelines',
  },
  {name: 'Truncate', canonicalPath: '/product/components/truncate/guidelines'},
  {
    name: 'UnderlineNav',
    canonicalPath: '/product/components/underline-nav/guidelines',
    rawIdPath: '/product/components/underline_nav/guidelines',
  },
  {name: 'AriaAlert', canonicalPath: '/product/components/aria-alert/guidelines'},
  {name: 'AriaStatus', canonicalPath: '/product/components/aria-status/guidelines'},
  {
    name: 'FilteredSearch',
    canonicalPath: '/product/components/filtered-search/guidelines',
    rawIdPath: '/product/components/filtered_search/guidelines',
  },
  {
    name: 'IssueLabel',
    canonicalPath: '/product/components/issue-label/guidelines',
    rawIdPath: '/product/components/issue_label/guidelines',
  },
  {
    name: 'UnderlinePanels',
    canonicalPath: '/product/components/underline-panels/guidelines',
    rawIdPath: '/product/components/underline_panels/guidelines',
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
    'retrieves $name usage guidelines from its canonical document',
    async ({name, canonicalPath, rawIdPath}) => {
      const canonicalUrl = `https://primer.style${canonicalPath}`
      const rawIdUrl = rawIdPath ? `https://primer.style${rawIdPath}` : undefined
      const guidanceBody = `approved-${name.toLowerCase()}-guidance-body`
      const homepageBody = `homepage-body-not-${name.toLowerCase()}-guidance`
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockImplementation(async input => {
        const url = input.toString()

        if (url === canonicalUrl) {
          return responseWithFinalUrl(`<main><p>${guidanceBody}</p></main>`, canonicalUrl)
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
          text: expect.stringContaining(guidanceBody),
        }),
      )
      expect(result.content).not.toContainEqual(
        expect.objectContaining({
          type: 'text',
          text: expect.stringContaining(homepageBody),
        }),
      )
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock.mock.calls[0]?.[0].toString()).toBe(canonicalUrl)
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
