import {Client, InMemoryTransport} from '@modelcontextprotocol/client'
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest'
import {feedbackDraftSchema} from './feedback'
import {server} from './server'

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

  describe('feedback drafts', () => {
    const feedback = {
      feedbackType: 'Discovery gap',
      title: 'Make the existing component easier to discover',
      resource: 'ActionMenu',
      observed: 'The user had to point out the existing component.',
      expected: 'The agent discovers the component before building a custom menu.',
      reproduction: {
        status: 'reproduced',
        steps: ['Search the component documentation using the original task terms.'],
        result: 'The lookup does not identify ActionMenu until its name is supplied.',
      },
      outcome: {
        status: 'worked-around',
        details: 'Used the component after the user supplied its name.',
      },
    }

    it('keeps feedback guidance in the tool description rather than server initialization', async () => {
      const {tools} = await client.listTools()
      const description = tools.find(tool => tool.name === 'prepare_feedback')?.description

      expect(client.getInstructions()).toBeUndefined()
      expect(description).toContain('offer once at a natural stopping point')
      expect(description).toContain('Do not repeat an offer the user has declined')
      expect(description).toContain('Never submit feedback without explicit user approval')
      expect(description).toContain('Default all feedback to github/primer')
      expect(description).toContain('Skip reproduction only when the user says they do not want to wait')
      expect(description).toContain(
        'Only include an agent-session link if the user explicitly shares it or approves including it',
      )
    })

    it.each(['github/primer', 'primer/react'])(
      'prepares a reviewable draft for %s without network access',
      async repository => {
        const result = await client.callTool({
          name: 'prepare_feedback',
          arguments: {
            ...feedback,
            repository,
            githubPrimerAccess: repository === 'primer/react' ? 'unavailable' : 'available',
            title: '  Discovery: ActionMenu & menus?  ',
            context: 'A task involving menus.',
            evidence: 'https://primer.style/product/components/action-menu',
          },
        })

        expect(result.isError).not.toBe(true)
        expect(result.structuredContent).toMatchObject({
          status: 'draft',
          repository,
          title: 'Discovery: ActionMenu & menus?',
          body: expect.stringContaining(
            '### Outcome\n\nStatus: worked-around\n\nUsed the component after the user supplied its name.',
          ),
        })
        const draft = feedbackDraftSchema.parse(result.structuredContent)
        expect(draft.body).toContain('### Context\n\nA task involving menus.')
        expect(draft.body).toContain('### Evidence\n\nhttps://primer.style/product/components/action-menu')
        const url = new URL(draft.issueUrl)
        expect(url.origin).toBe('https://github.com')
        expect(url.pathname).toBe(`/${repository}/issues/new`)
        expect(url.searchParams.get('template')).toBe('agent-feedback.md')
        expect(url.searchParams.get('title')).toBe(draft.title)
        expect(url.searchParams.get('body')).toBe(draft.body)
        expect(result.content).toContainEqual(
          expect.objectContaining({
            type: 'text',
            text: expect.stringContaining('Draft only; no issue has been filed.'),
          }),
        )
        expect(fetch).not.toHaveBeenCalled()
      },
    )

    it.each([
      'Bug',
      'Documentation gap',
      'Documentation mismatch',
      'Feature gap',
      'Discovery gap',
      'Performance gap',
      'Accessibility gap',
      'Migration gap',
    ])('captures %s without requiring optional evidence', async feedbackType => {
      const result = await client.callTool({
        name: 'prepare_feedback',
        arguments: {
          ...feedback,
          feedbackType,
        },
      })

      expect(result.isError).not.toBe(true)
      const draft = feedbackDraftSchema.parse(result.structuredContent)
      expect(draft.body).toBe(
        `### Feedback type\n\n${feedbackType}\n\n### Resource\n\n${feedback.resource}\n\n### Observed\n\n${feedback.observed}\n\n### Expected\n\n${feedback.expected}\n\n### Reproduction\n\nStatus: reproduced\n\n1. ${feedback.reproduction.steps[0]}\n\nResult: ${feedback.reproduction.result}\n\n### Outcome\n\nStatus: worked-around\n\n${feedback.outcome.details}`,
      )
    })

    it('defaults to github/primer without requiring an access check', async () => {
      const result = await client.callTool({
        name: 'prepare_feedback',
        arguments: feedback,
      })

      expect(result.isError).not.toBe(true)
      const draft = feedbackDraftSchema.parse(result.structuredContent)
      expect(draft.repository).toBe('github/primer')
      expect(new URL(draft.issueUrl).pathname).toBe('/github/primer/issues/new')
      expect(draft.reproduction).toEqual(feedback.reproduction)
      expect(draft.links).toEqual([])
      expect(draft.body).not.toContain('### Links')
    })

    it('includes labeled references in the draft and prefilled issue body', async () => {
      const links = [
        {
          label: 'Pull request',
          url: 'https://github.com/primer/react/pull/123',
        },
        {
          label: 'Copilot review [comment]',
          url: 'https://github.com/primer/react/pull/123#discussion_r456',
        },
        {
          label: 'User-shared agent session',
          url: 'https://example.com/shared-agent-session',
        },
      ]
      const result = await client.callTool({
        name: 'prepare_feedback',
        arguments: {
          ...feedback,
          links,
        },
      })

      expect(result.isError).not.toBe(true)
      const draft = feedbackDraftSchema.parse(result.structuredContent)
      expect(draft.links).toEqual(links)
      expect(draft.body).toContain(
        `### Links\n\n- [Pull request](<${links[0].url}>)\n- [Copilot review \\[comment\\]](<${links[1].url}>)\n- [User-shared agent session](<${links[2].url}>)`,
      )
      expect(draft.body.endsWith(`### Outcome\n\nStatus: worked-around\n\n${feedback.outcome.details}`)).toBe(true)
      expect(new URL(draft.issueUrl).searchParams.get('body')).toBe(draft.body)
      expect(fetch).not.toHaveBeenCalled()
    })

    it.each([
      {
        status: 'blocked',
        details: 'The task cannot proceed without the missing functionality.',
      },
      {
        status: 'worked-around',
        details: 'Replaced the missing feature with a separate control.',
      },
      {
        status: 'resolved',
        details: 'Corrected the conflicting guidance and completed the task without a workaround.',
      },
    ])('records task outcome $status independently of reproduction', async outcome => {
      const result = await client.callTool({
        name: 'prepare_feedback',
        arguments: {
          ...feedback,
          outcome,
        },
      })

      expect(result.isError).not.toBe(true)
      const draft = feedbackDraftSchema.parse(result.structuredContent)
      expect(draft.outcome).toEqual(outcome)
      expect(draft.reproduction).toEqual(feedback.reproduction)
      expect(draft.body.endsWith(`### Outcome\n\nStatus: ${outcome.status}\n\n${outcome.details}`)).toBe(true)
    })

    it.each(['unknown', 'available'])(
      'rejects the public fallback when github/primer access is %s',
      async githubPrimerAccess => {
        const result = await client.callTool({
          name: 'prepare_feedback',
          arguments: {
            ...feedback,
            repository: 'primer/react',
            githubPrimerAccess,
          },
        })

        expect(result.isError).toBe(true)
        expect(result.structuredContent).toBeUndefined()
      },
    )

    it.each([
      {
        status: 'not-reproduced',
        steps: ['Repeat the original component lookup.'],
        result: 'The component was found this time.',
      },
      {
        status: 'skipped-user-request',
      },
    ])('records reproduction status $status without claiming verification', async reproduction => {
      const result = await client.callTool({
        name: 'prepare_feedback',
        arguments: {
          ...feedback,
          reproduction,
        },
      })

      expect(result.isError).not.toBe(true)
      const draft = feedbackDraftSchema.parse(result.structuredContent)
      expect(draft.reproduction).toEqual(reproduction)
      if (reproduction.status === 'not-reproduced') {
        expect(draft.body).toContain('Status: not-reproduced')
        expect(draft.body).toContain('1. Repeat the original component lookup.')
        expect(draft.body).toContain('Result: The component was found this time.')
      } else {
        expect(draft.body).toContain("Skipped at the user's request because they do not want to wait.")
      }
    })

    it.each([
      {repository: 'other/repository'},
      {feedbackType: 'Unknown'},
      {title: ' '},
      {title: 'Title\nAnother line'},
      {resource: ' '},
      {observed: ' '},
      {expected: ' '},
      {evidence: ' '},
      {repository: 'primer/react'},
      {reproduction: undefined},
      {reproduction: {status: 'reproduced', steps: [], result: 'Observed the problem.'}},
      {reproduction: {status: 'reproduced', steps: [' '], result: 'Observed the problem.'}},
      {reproduction: {status: 'not-reproduced', steps: ['Repeat the lookup.'], result: ' '}},
      {reproduction: {status: 'skipped'}},
      {links: [{label: ' ', url: 'https://example.com/report'}]},
      {links: [{label: 'Review\ncomment', url: 'https://example.com/report'}]},
      {links: [{label: 'Review comment', url: 'not-a-url'}]},
      {links: [{label: 'Review comment', url: 'javascript:alert(1)'}]},
      {links: [{label: 'Review comment', url: 'file:///private/session.log'}]},
      {outcome: undefined},
      {outcome: {status: 'unknown', details: 'No task outcome was recorded.'}},
      {outcome: {status: 'worked-around', details: ' '}},
      {outcome: {status: 'blocked'}},
    ])('rejects invalid feedback fields: %j', async overrides => {
      const result = await client.callTool({
        name: 'prepare_feedback',
        arguments: {
          ...feedback,
          ...overrides,
        },
      })

      expect(result.isError).toBe(true)
      expect(fetch).not.toHaveBeenCalled()
    })
  })

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
