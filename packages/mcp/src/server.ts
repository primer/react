import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
// eslint-disable-next-line import/no-namespace
import * as cheerio from 'cheerio'
// eslint-disable-next-line import/no-namespace
import * as z from 'zod'
import TurndownService from 'turndown'
import {
  getComponentComposition,
  getComponentCompositionSummary,
  getComponentDocsSource,
  getComponentDocument,
  getComponentSummary,
  listComponents,
  listPatterns,
  listIcons,
} from './primer'
import {formatCompactPatternDetails, getPatternUrl, parseCompactPatternDetails, toFullPatternDetails} from './patterns'
import {
  listTokenGroups,
  loadAllTokensWithGuidelines,
  loadDesignTokensGuide,
  getDesignTokenSpecsText,
  getTokenUsagePatternsText,
  searchTokens,
  formatBundle,
  GROUP_ALIASES,
  tokenMatchesGroup,
  type TokenWithGuidelines,
  getValidGroupsList,
  groupHints,
  runStylelint,
} from './primitives'
import packageJson from '../package.json' with {type: 'json'}

const server = new McpServer({
  name: 'Primer',
  version: packageJson.version,
})

const turndownService = new TurndownService()
const defaultComponentDocsSource = getComponentDocsSource()
const patternReferenceOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['scenario', 'ui']),
  sourceUrl: z.string().url(),
})
const patternComponentOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  source: z.enum(['primer-public', 'primer-internal']),
  sourceUrl: z.string().url(),
})
const patternOutputSchema = z.object({
  detail: z.enum(['compact', 'full']),
  pattern: patternReferenceOutputSchema,
  summary: z.string().optional(),
  components: z.array(patternComponentOutputSchema).optional(),
  relatedPatterns: z.array(patternReferenceOutputSchema).optional(),
  guidance: z
    .object({
      implementation: z.string(),
      accessibility: z.array(z.string()),
      states: z.array(z.string()),
    })
    .optional(),
})

// Load all tokens with guidelines from primitives
const allTokensWithGuidelines: TokenWithGuidelines[] = loadAllTokensWithGuidelines()

// -----------------------------------------------------------------------------
// Project setup
// -----------------------------------------------------------------------------
server.registerTool(
  'init',
  {
    description: 'Setup or create a project that includes Primer React',
    annotations: {readOnlyHint: true},
  },
  async () => {
    const url = new URL(`/product/getting-started/react`, 'https://primer.style')
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }

    const html = await response.text()
    if (!html) {
      return {
        content: [],
      }
    }

    const $ = cheerio.load(html)
    const source = $('main').html()
    if (!source) {
      return {
        content: [],
      }
    }

    const text = turndownService.turndown(source)

    return {
      content: [
        {
          type: 'text',
          text: `The getting started documentation for Primer React is included below. It's important that the project:

- Is using a tool like Vite, Next.js, etc that supports TypeScript and React. If the project does not have support for that, generate an appropriate project scaffold
- Installs the latest version of \`@primer/react\` from \`npm\`
- Correctly adds the \`ThemeProvider\` and \`BaseStyles\` components to the root of the application
- Includes an import to a theme from \`@primer/primitives\`
- If the project wants to use icons, also install the \`@primer/octicons-react\` from \`npm\`
- Add appropriate agent instructions (like for copilot) to the project to prefer using components, tokens, icons, and more from Primer packages

---

${text}
`,
        },
      ],
    }
  },
)

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------
server.registerTool(
  'list_components',
  {description: 'List all of the components available from Primer React', annotations: {readOnlyHint: true}},
  async () => {
    const components = listComponents().map(component => {
      return `- ${component.name}`
    })
    return {
      content: [
        {
          type: 'text',
          text: `The following components are available in the @primer/react in TypeScript projects:

${components.join('\n')}

You can use the \`get_component\` tool to get more information about a specific component and \`get_component_composition\` for source-derived composition metadata. You can use these components from the @primer/react package.`,
        },
      ],
    }
  },
)

server.registerTool(
  'get_component_composition',
  {
    description:
      'Retrieve source-derived composition metadata for a Primer React component, including documented compound APIs and observed static JSX relationships.',
    inputSchema: {
      name: z.string().describe('The name of the component to retrieve composition metadata for'),
    },
    annotations: {readOnlyHint: true},
  },
  async ({name}) => {
    const component = listComponents().find(candidate => {
      return candidate.name === name || candidate.name.toLowerCase() === name.toLowerCase()
    })
    if (!component) {
      return {
        isError: true,
        errorMessage: `There is no component named \`${name}\` in the @primer/react package. For a full list of components, use \`list_components\` for valid names.`,
        content: [],
      }
    }

    const composition = getComponentComposition(component.id)
    if (!composition) {
      return {
        isError: true,
        errorMessage:
          'The installed @primer/react package does not include composition metadata. Use a version that publishes generated/components.json with composition data.',
        content: [],
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              component: {
                id: component.id,
                name: component.name,
                importPath: component.importPath,
              },
              composition,
            },
            null,
            2,
          ),
        },
      ],
    }
  },
)

server.registerTool(
  'get_component',
  {
    description:
      'Retrieve documentation and usage details for a specific React component from the @primer/react package by its name. This tool provides the official Primer documentation for any listed component, making it easy to inspect, reuse, or integrate components in your project.',
    inputSchema: {
      name: z.string().describe('The name of the component to retrieve'),
      source: z
        .enum(['hosted', 'package'])
        .optional()
        .describe('Use hosted Primer Style documentation or metadata from the installed @primer/react package'),
    },
    annotations: {readOnlyHint: true},
  },
  async ({name, source}) => {
    const components = listComponents()
    const match = components.find(component => {
      return component.name === name || component.name.toLowerCase() === name.toLowerCase()
    })
    if (!match) {
      return {
        isError: true,
        errorMessage: `There is no component named \`${name}\` in the @primer/react package. For a full list of components, use the \`list_components\` tool.`,
        content: [],
      }
    }
    const docsSource = source ?? defaultComponentDocsSource
    if (docsSource === 'package') {
      const document = getComponentDocument(match.id)
      const composition = getComponentComposition(match.id)

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({source: 'package', component: document, composition}, null, 2),
          },
        ],
      }
    }

    try {
      const llmsUrl = new URL(`/product/components/${match.slug}/llms.txt`, 'https://primer.style')
      const llmsResponse = await fetch(llmsUrl)
      if (llmsResponse.ok) {
        const llmsText = await llmsResponse.text()
        return {
          content: [
            {
              type: 'text',
              text: llmsText,
            },
          ],
        }
      }
    } catch (_: unknown) {
      // If there's an error fetching or processing the llms.txt, we fall back to a generic error message.
    }

    return {
      isError: true,
      errorMessage: `There was an error fetching documentation for ${name}. Ensure the component exists.`,
      content: [],
    }
  },
)

server.registerTool(
  'get_component_batch',
  {
    description:
      'Retrieve documentation for multiple Primer React components in one call. ' +
      'Pass all component names you need at once. Docs are fetched in parallel to avoid repeated MCP round-trips when resolving several components. ' +
      'For a single component, prefer get_component instead.',
    inputSchema: {
      names: z
        .array(z.string())
        .min(2)
        .max(10)
        .describe('Component names to retrieve (e.g. ["ActionMenu", "Button", "Pagination"])'),
      source: z
        .enum(['hosted', 'package'])
        .optional()
        .describe('Use hosted Primer Style documentation or metadata from the installed @primer/react package'),
    },
    annotations: {readOnlyHint: true},
  },
  async ({names, source}) => {
    const seenNames = new Set<string>()
    const deduped = names.filter(name => {
      const normalizedName = name.toLowerCase()
      if (seenNames.has(normalizedName)) {
        return false
      }
      seenNames.add(normalizedName)
      return true
    })
    const components = listComponents()
    const docsSource = source ?? defaultComponentDocsSource

    const results = await Promise.all(
      deduped.map(async name => {
        const match = components.find(
          component => component.name === name || component.name.toLowerCase() === name.toLowerCase(),
        )
        if (!match) {
          return {
            type: 'text' as const,
            text: `## ${name}\n\nStatus: not-found. No component named \`${name}\` exists in @primer/react. Use \`list_components\` for valid names.`,
          }
        }

        if (docsSource === 'package') {
          const composition = getComponentCompositionSummary(match.id)
          return {
            type: 'text' as const,
            text: JSON.stringify({source: 'package', composition, component: getComponentSummary(match)}, null, 2),
          }
        }

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 10_000)

        try {
          const llmsUrl = new URL(`/product/components/${match.slug}/llms.txt`, 'https://primer.style')
          const llmsResponse = await fetch(llmsUrl, {signal: controller.signal})
          if (llmsResponse.ok) {
            const text = await llmsResponse.text()
            return {type: 'text' as const, text}
          }
        } catch (_: unknown) {
          // Fall through to the in-band error result so other component requests can succeed.
        } finally {
          clearTimeout(timeout)
        }

        return {
          type: 'text' as const,
          text: `## ${match.name}\n\nStatus: fetch-error. Failed to load documentation for ${match.name}.`,
        }
      }),
    )

    return {content: results}
  },
)

server.registerTool(
  'get_component_examples',
  {
    description: 'Get examples for how to use a component from Primer React',
    inputSchema: {
      name: z.string().describe('The name of the component to retrieve'),
    },
    annotations: {readOnlyHint: true},
  },
  async ({name}) => {
    const components = listComponents()
    const match = components.find(component => {
      return component.name === name
    })
    if (!match) {
      return {
        content: [
          {
            type: 'text',
            text: `There is no component named \`${name}\` in the @primer/react package. For a full list of components, use the \`get_components\` tool.`,
          },
        ],
      }
    }

    const url = new URL(`/product/components/${match.id}`, 'https://primer.style')
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }

    const html = await response.text()
    if (!html) {
      return {
        content: [],
      }
    }

    const $ = cheerio.load(html)
    const source = $('main').html()
    if (!source) {
      return {
        content: [],
      }
    }

    const text = turndownService.turndown(source)

    return {
      content: [
        {
          type: 'text',
          text: `Here are some examples of how to use the \`${name}\` component from the @primer/react package:

${text}`,
        },
      ],
    }
  },
)

server.registerTool(
  'get_component_usage_guidelines',
  {
    description: 'Get usage information for how to use a component from Primer',
    inputSchema: {
      name: z.string().describe('The name of the component to retrieve'),
    },
    annotations: {readOnlyHint: true},
  },
  async ({name}) => {
    const components = listComponents()
    const match = components.find(component => {
      return component.name === name
    })
    if (!match) {
      return {
        content: [
          {
            type: 'text',
            text: `There is no component named \`${name}\` in the @primer/react package. For a full list of components, use the \`get_components\` tool.`,
          },
        ],
      }
    }

    const url = new URL(`/product/components/${match.id}/guidelines`, 'https://primer.style')
    const response = await fetch(url)
    if (!response.ok) {
      if ((response.status >= 400 && response.status < 500) || (response.status >= 300 && response.status < 400)) {
        return {
          content: [
            {
              type: 'text',
              text: `There are no accessibility guidelines for the \`${name}\` component in the @primer/react package.`,
            },
          ],
        }
      }

      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }

    const html = await response.text()
    if (!html) {
      return {
        content: [],
      }
    }

    const $ = cheerio.load(html)
    const source = $('main').html()
    if (!source) {
      return {
        content: [],
      }
    }

    const text = turndownService.turndown(source)

    return {
      content: [
        {
          type: 'text',
          text: `Here are the usage guidelines for the \`${name}\` component from the @primer/react package:

${text}`,
        },
      ],
    }
  },
)

server.registerTool(
  'get_component_accessibility_guidelines',
  {
    description:
      'Retrieve accessibility guidelines and best practices for a specific component from the @primer/react package by its name. Use this tool to get official accessibility recommendations, usage tips, and requirements to ensure your UI components are inclusive and meet accessibility standards.',
    inputSchema: {
      name: z.string().describe('The name of the component to retrieve'),
    },
    annotations: {readOnlyHint: true},
  },
  async ({name}) => {
    const components = listComponents()
    const match = components.find(component => {
      return component.name === name
    })
    if (!match) {
      return {
        content: [
          {
            type: 'text',
            text: `There is no component named \`${name}\` in the @primer/react package. For a full list of components, use the \`list_components\` tool.`,
          },
        ],
      }
    }

    const url = new URL(`/product/components/${match.id}/accessibility`, 'https://primer.style')
    const response = await fetch(url)
    if (!response.ok) {
      if ((response.status >= 400 && response.status < 500) || (response.status >= 300 && response.status < 400)) {
        return {
          content: [
            {
              type: 'text',
              text: `There are no accessibility guidelines for the \`${name}\` component in the @primer/react package.`,
            },
          ],
        }
      }

      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }

    const html = await response.text()
    if (!html) {
      return {
        content: [],
      }
    }

    const $ = cheerio.load(html)
    const source = $('main').html()
    if (!source) {
      return {
        content: [],
      }
    }

    const text = turndownService.turndown(source)

    return {
      content: [
        {
          type: 'text',
          text: `Here are the accessibility guidelines for the \`${name}\` component from the @primer/react package:

${text}`,
        },
      ],
    }
  },
)

// -----------------------------------------------------------------------------
// Patterns
// -----------------------------------------------------------------------------
server.registerTool(
  'list_patterns',
  {
    description:
      'List all of the patterns available from Primer React. Scenario patterns describe specific user tasks (copy, delete, filter, search). Prefer a scenario pattern when one fits the task, and fall back to the more generic UI patterns otherwise.',
    annotations: {readOnlyHint: true},
  },
  async () => {
    const all = listPatterns()
    const scenario = all.filter(pattern => pattern.category === 'scenario').map(pattern => `- ${pattern.name}`)
    const ui = all.filter(pattern => pattern.category === 'ui').map(pattern => `- ${pattern.name}`)
    return {
      content: [
        {
          type: 'text',
          text: `The following patterns are available from \`@primer/react\` for use in TypeScript projects. Scenario patterns describe specific user tasks. Prefer a scenario pattern when one fits the task, and fall back to the UI patterns otherwise.

## Scenario patterns

${scenario.join('\n')}

## UI patterns

${ui.join('\n')}`,
        },
      ],
    }
  },
)

server.registerTool(
  'get_pattern',
  {
    description:
      'Get a specific pattern by name. Returns compact structured guidance by default, including authoritative component and related-pattern links. Pass detail: "full" for the complete Primer Style page. Scenario patterns describe specific user tasks (copy, delete, filter, search). Prefer a scenario pattern when one fits the task, and fall back to the more generic UI patterns otherwise.',
    inputSchema: {
      name: z.string().describe('The name of the pattern to retrieve'),
      detail: z
        .enum(['compact', 'full'])
        .optional()
        .default('compact')
        .describe('Response detail: compact structured guidance (default) or full Primer Style guidance'),
    },
    outputSchema: patternOutputSchema,
    annotations: {readOnlyHint: true},
  },
  async ({name, detail}) => {
    const patterns = listPatterns()
    // Resolve scenario patterns first so a name clash favours the scenario pattern.
    const match =
      patterns.find(pattern => pattern.category === 'scenario' && pattern.name === name) ??
      patterns.find(pattern => pattern.name === name)
    if (!match) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `There is no pattern named \`${name}\` in the @primer/react package. For a full list of patterns, use the \`list_patterns\` tool.`,
          },
        ],
      }
    }

    const url = getPatternUrl(match)

    if (detail === 'full') {
      const llmsUrl = new URL(`${url.pathname}/llms.txt`, url)
      const llmsResponse = await fetch(llmsUrl)

      if (llmsResponse.ok) {
        const text = await llmsResponse.text()
        if (!text) {
          return {
            isError: true,
            content: [{type: 'text', text: `Primer Style returned an empty page for the \`${name}\` pattern.`}],
          }
        }

        return {
          structuredContent: toFullPatternDetails(match, url),
          content: [{type: 'text', text}],
        }
      }

      if (llmsResponse.status !== 404) {
        throw new Error(`Failed to fetch ${llmsUrl} - ${llmsResponse.statusText}`)
      }
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url} - ${response.statusText}`)
    }

    const html = await response.text()
    if (!html) {
      return {
        isError: true,
        content: [{type: 'text', text: `Primer Style returned an empty page for the \`${name}\` pattern.`}],
      }
    }

    const $ = cheerio.load(html)
    const source = $('main').html()
    if (!source) {
      return {
        isError: true,
        content: [{type: 'text', text: `Primer Style did not return pattern guidance for \`${name}\`.`}],
      }
    }

    if (detail === 'full') {
      const details = toFullPatternDetails(match, url)
      const text = turndownService.turndown(source)

      return {
        structuredContent: details,
        content: [
          {
            type: 'text',
            text: `Here are the guidelines for the \`${name}\` pattern for Primer:

${text}`,
          },
        ],
      }
    }

    const details = parseCompactPatternDetails(html, match, url, patterns)
    return {
      structuredContent: details,
      content: [
        {
          type: 'text',
          text: formatCompactPatternDetails(details),
        },
      ],
    }
  },
)

// -----------------------------------------------------------------------------
// Design Tokens
// -----------------------------------------------------------------------------
server.registerTool(
  'find_tokens',
  {
    description:
      'Search for specific tokens. Tip: If you only provide a \'group\' and leave \'query\' empty, it returns all tokens in that category. Avoid property-by-property searching. COLOR RESOLUTION: If a user asks for "pink" or "blue", do not search for the color name. Use the semantic intent: blue->accent, red->danger, green->success. Always check both "emphasis" and "muted" variants for background colors. After identifying tokens and writing CSS, you MUST validate the result using lint_css.',
    inputSchema: {
      query: z
        .string()
        .optional()
        .default('')
        .describe('Search keywords (e.g., "danger border", "success background")'),
      group: z.string().optional().describe('Filter by group (e.g., "fgColor", "border")'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(15)
        .describe('Maximum results to return to stay within context limits'),
    },
    annotations: {readOnlyHint: true},
  },
  async ({query, group, limit}) => {
    // Resolve group via aliases
    const resolvedGroup = group ? GROUP_ALIASES[group.toLowerCase().replace(/\s+/g, '')] || group : undefined

    // Split query into keywords and extract any that match a known group
    const rawKeywords = query
      .toLowerCase()
      .split(/\s+/)
      .filter(k => k.length > 0)

    let effectiveGroup = resolvedGroup
    const filteredKeywords: string[] = []

    for (const kw of rawKeywords) {
      const normalized = kw.replace(/\s+/g, '')
      const aliasMatch = GROUP_ALIASES[normalized]
      if (aliasMatch && !effectiveGroup) {
        effectiveGroup = aliasMatch
      } else {
        filteredKeywords.push(kw)
      }
    }

    // Guard: no query and no group → ask user to provide at least one
    if (filteredKeywords.length === 0 && !effectiveGroup) {
      return {
        content: [
          {
            type: 'text',
            text: 'Please provide a query, a group, or both. Call `get_design_token_specs` to see available token groups.',
          },
        ],
      }
    }

    // Group-only search: return all tokens in the group
    const isGroupOnly = filteredKeywords.length === 0 && effectiveGroup
    let results: TokenWithGuidelines[]

    if (isGroupOnly) {
      results = allTokensWithGuidelines.filter(token => tokenMatchesGroup(token, effectiveGroup!))
    } else {
      results = searchTokens(allTokensWithGuidelines, filteredKeywords.join(' '), effectiveGroup)
    }

    if (results.length === 0) {
      const validGroups = getValidGroupsList(allTokensWithGuidelines)

      return {
        content: [
          {
            type: 'text',
            text: `No tokens found matching "${query}"${effectiveGroup ? ` in group "${effectiveGroup}"` : ''}. 

### 💡 Available Groups:
${validGroups}

### Troubleshooting for AI:
1. **Multi-word Queries**: Search keywords use 'AND' logic. If searching "text shorthand typography" fails, try a single keyword like "shorthand" within the "text" group.
2. **Property Mismatch**: Do not search for CSS properties like "offset", "padding", or "font-size". Use semantic intent keywords: "danger", "muted", "emphasis".
3. **Typography**: Remember that \`caption\`, \`display\`, and \`code\` groups do NOT support size suffixes. Use the base shorthand only.
4. **Group Intent**: Use the \`group\` parameter instead of putting group names in the \`query\` string (e.g., use group: "stack" instead of query: "stack padding").`,
          },
        ],
      }
    }

    const limitedResults = results.slice(0, limit)

    let output: string

    if (!query) {
      output = `Found ${results.length} token(s). Showing top ${limitedResults.length}:\n\n`
    } else {
      output = `Found ${results.length} token(s) matching "${query}". Showing top ${limitedResults.length}:\n\n`
    }
    output += formatBundle(limitedResults)

    if (results.length > limit) {
      output += `\n\n*...and ${results.length - limit} more matches. Use more specific keywords to narrow the search.*`
    }

    return {
      content: [{type: 'text', text: output}],
    }
  },
)

server.registerTool(
  'get_token_group_bundle',
  {
    description:
      "PREFERRED FOR COMPONENTS. Fetch all tokens for complex UI (e.g., Dialogs, Cards) in one call by providing an array of groups like ['overlay', 'shadow']. Use this instead of multiple find_tokens calls to save context.",
    inputSchema: {
      groups: z.array(z.string()).describe('Array of group names (e.g., ["overlay", "shadow", "focus"])'),
    },
    annotations: {readOnlyHint: true},
  },
  async ({groups}) => {
    // Normalize and resolve aliases
    const resolvedGroups = groups.map(g => {
      const normalized = g.toLowerCase().replace(/\s+/g, '')
      return GROUP_ALIASES[normalized] || g
    })

    // Filter tokens matching any of the resolved groups
    const matched = allTokensWithGuidelines.filter(token => resolvedGroups.some(rg => tokenMatchesGroup(token, rg)))

    if (matched.length === 0) {
      const validGroups = getValidGroupsList(allTokensWithGuidelines)
      return {
        content: [
          {
            type: 'text',
            text: `No tokens found for groups: ${groups.join(', ')}.\n\n### Valid Groups:\n${validGroups}`,
          },
        ],
      }
    }

    let text = `Found ${matched.length} token(s) across ${resolvedGroups.length} group(s):\n\n${formatBundle(matched)}`

    const activeHints = resolvedGroups.map(g => groupHints[g]).filter(Boolean)

    if (activeHints.length > 0) {
      text += `\n\n### ⚠️ Usage Guidance:\n${activeHints.map(h => `- ${h}`).join('\n')}`
    }

    return {
      content: [{type: 'text', text}],
    }
  },
)

server.registerTool(
  'get_design_token_specs',
  {
    description:
      'CRITICAL: CALL THIS FIRST. Provides the logic matrix and the list of valid group names. You cannot search accurately without this map.',
    annotations: {readOnlyHint: true},
  },
  async () => {
    const groups = listTokenGroups()
    const customRules = getDesignTokenSpecsText(groups)
    let text: string
    try {
      const upstreamGuide = loadDesignTokensGuide()
      text = `${customRules}\n\n---\n\n${upstreamGuide}`
    } catch {
      text = customRules
    }

    return {
      content: [{type: 'text', text}],
    }
  },
)

server.registerTool(
  'get_token_usage_patterns',
  {
    description:
      'Provides "Golden Example" CSS for core patterns: Button (Interactions) and Stack (Layout). Use this to understand how to apply the Logic Matrix, Motion, and Spacing scales.',
    annotations: {readOnlyHint: true},
  },
  async () => {
    const customPatterns = getTokenUsagePatternsText()
    let text: string
    try {
      const guide = loadDesignTokensGuide()
      const goldenExampleMatch = guide.match(/## Golden Example[\s\S]*?(?=\n## |$)/)
      if (goldenExampleMatch) {
        text = `${customPatterns}\n\n---\n\n${goldenExampleMatch[0].trim()}`
      } else {
        text = customPatterns
      }
    } catch {
      text = customPatterns
    }

    return {
      content: [{type: 'text', text}],
    }
  },
)

server.registerTool(
  'lint_css',
  {
    description:
      'REQUIRED FINAL STEP. Use this to validate your CSS. You cannot complete a task involving CSS without a successful run of this tool.',
    inputSchema: {css: z.string()},
    annotations: {readOnlyHint: true},
  },
  async ({css}) => {
    try {
      // --fix flag tells Stylelint to repair what it can
      const {stdout} = await runStylelint(css)

      return {
        content: [
          {
            type: 'text',
            text: stdout || '✅ Stylelint passed (or was successfully autofixed).',
          },
        ],
      }
    } catch (error: unknown) {
      // If Stylelint still has errors it CANNOT fix, it will land here
      const errorOutput =
        error instanceof Error && 'stdout' in error ? (error as Error & {stdout: string}).stdout : String(error)
      return {
        content: [
          {
            type: 'text',
            text: `❌ Errors without autofix remaining:\n${errorOutput}`,
          },
        ],
      }
    }
  },
)

// -----------------------------------------------------------------------------
// Foundations
// -----------------------------------------------------------------------------
server.registerTool(
  'get_color_usage',
  {description: 'Get the guidelines for how to apply color to a user interface', annotations: {readOnlyHint: true}},
  async () => {
    const url = new URL(`/product/getting-started/foundations/color-usage`, 'https://primer.style')
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url} - ${response.statusText}`)
    }

    const html = await response.text()
    if (!html) {
      return {
        content: [],
      }
    }

    const $ = cheerio.load(html)
    const source = $('main').html()
    if (!source) {
      return {
        content: [],
      }
    }

    const text = turndownService.turndown(source)

    return {
      content: [
        {
          type: 'text',
          text: `Here is the documentation for color usage in Primer:\n\n${text}`,
        },
      ],
    }
  },
)

server.registerTool(
  'get_typography_usage',
  {
    description: 'Get the guidelines for how to apply typography to a user interface',
    annotations: {readOnlyHint: true},
  },
  async () => {
    const url = new URL(`/product/getting-started/foundations/typography`, 'https://primer.style')
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url} - ${response.statusText}`)
    }

    const html = await response.text()
    if (!html) {
      return {
        content: [],
      }
    }

    const $ = cheerio.load(html)
    const source = $('main').html()
    if (!source) {
      return {
        content: [],
      }
    }

    const text = turndownService.turndown(source)

    return {
      content: [
        {
          type: 'text',
          text: `Here is the documentation for typography usage in Primer:\n\n${text}`,
        },
      ],
    }
  },
)

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------
server.registerTool(
  'list_icons',
  {
    description: 'List all of the icons (octicons) available from Primer Octicons React',
    annotations: {readOnlyHint: true},
  },
  async () => {
    const icons = listIcons().map(icon => {
      const keywords = icon.keywords.map(keyword => {
        return `<keyword>${keyword}</keyword>`
      })
      const sizes = icon.heights.map(height => {
        return `<size value="${height}"></size>`
      })
      return [`<icon name="${icon.name}">`, ...keywords, ...sizes, `</icon>`].join('\n')
    })

    return {
      content: [
        {
          type: 'text',
          text: `The following icons are available in the @primer/octicons-react package in TypeScript projects:

${icons.join('\n')}

You can use the \`get_icon\` tool to get more information about a specific icon. You can use these components from the @primer/octicons-react package.`,
        },
      ],
    }
  },
)

server.registerTool(
  'get_icon',
  {
    description: 'Get a specific icon (octicon) by name from Primer',
    inputSchema: {
      name: z.string().describe('The name of the icon to retrieve'),
      size: z.string().optional().describe('The size of the icon to retrieve, e.g. "16"').default('16'),
    },
    annotations: {readOnlyHint: true},
  },
  async ({name, size}) => {
    const icons = listIcons()
    const match = icons.find(icon => {
      return icon.name === name || icon.name.toLowerCase() === name.toLowerCase()
    })
    if (!match) {
      return {
        content: [
          {
            type: 'text',
            text: `There is no icon named \`${name}\` in the @primer/octicons-react package. For a full list of icons, use the \`get_icon\` tool.`,
          },
        ],
      }
    }

    const url = new URL(`/octicons/icon/${match.name}-${size}`, 'https://primer.style')
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }

    const html = await response.text()
    if (!html) {
      return {
        content: [],
      }
    }

    const $ = cheerio.load(html)
    const source = $('main').html()
    if (!source) {
      return {
        content: [],
      }
    }

    const text = turndownService.turndown(source)

    return {
      content: [
        {
          type: 'text',
          text: `Here is the documentation for the \`${name}\` icon at size: \`${size}\`:
${text}`,
        },
      ],
    }
  },
)

// -----------------------------------------------------------------------------
// Coding guidelines
// -----------------------------------------------------------------------------
server.registerTool(
  'primer_coding_guidelines',
  {
    description: 'Get the guidelines when writing code that uses Primer or for UI code that you are creating',
    annotations: {readOnlyHint: true},
  },
  async () => {
    return {
      content: [
        {
          type: 'text',
          text: `When writing code that uses Primer, follow these guidelines:

## Design Tokens

- Prefer design tokens over hard-coded values. For example, use \`var(--fgColor-default)\` instead of \`#24292f\`. Use the \`find_tokens\` tool to search for a design token by keyword or group. Use \`get_design_token_specs\` to browse available token groups, and \`get_token_group_bundle\` to retrieve all tokens within a specific group.
- Prefer recommending design tokens in the same group for related CSS properties. For example, when styling background and border color, use tokens from the same group/category

## Authoring & Using Components

- Prefer re-using a component from Primer when possible over writing a new component.
- Prefer using existing props for a component for styling instead of adding styling to a component
- Prefer using icons from Primer instead of creating new icons. Use the \`list_icons\` tool to find the icon you need.
- Follow patterns from Primer when creating new components. Use the \`list_patterns\` tool to find the pattern you need, if one exists
- When using a component from Primer, make sure to follow the component's usage and accessibility guidelines

## Coding guidelines

The following list of coding guidelines must be followed:

- Do not use the sx prop for styling components. Instead, use CSS Modules.
- Do not use the Box component for styling components. Instead, use CSS Modules.
`,
        },
      ],
    }
  },
)

// -----------------------------------------------------------------------------
// Accessibility
// -----------------------------------------------------------------------------

/**
 * The `review_alt_text` tool is experimental and may be removed in future versions.
 *
 * The intent of this tool is to assist products like Copilot Code Review and Copilot Coding Agent
 * in reviewing both user- and AI-generated alt text for images, ensuring compliance with accessibility guidelines.
 * This tool is not intended to replace human-generated alt text; rather, it supports the review process
 * by providing suggestions for improvement. It should be used alongside human review, not as a substitute.
 *
 *
 **/
server.registerTool(
  'review_alt_text',
  {
    description: 'Evaluates image alt text against accessibility best practices and context relevance.',
    inputSchema: {
      surroundingText: z.string().describe('Text surrounding the image, relevant to the image.'),
      alt: z.string().describe('The alt text of the image being evaluated'),
      image: z.string().describe('The image URL or file path being evaluated'),
    },
    annotations: {readOnlyHint: true},
  },
  async ({surroundingText, alt, image}) => {
    // Call the LLM through MCP sampling
    const response = await server.server.createMessage({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Does this alt text: '${alt}' meet accessibility guidelines and describe the image: ${image} accurately in context of this surrounding text: '${surroundingText}'?\n\n`,
          },
        },
      ],
      temperature: 0.4,
      maxTokens: 500,
    })

    return {
      content: [
        {
          type: 'text',
          text: response.content.type === 'text' ? response.content.text : 'Unable to generate summary',
        },
      ],
      altTextEvaluation: response.content.type === 'text' ? response.content.text : 'Unable to generate summary',
      nextSteps: `If the evaluation indicates issues with the alt text, provide more meaningful alt text based on the feedback. DO NOT run this tool repeatedly on the same image - evaluations may vary slightly with each run.`,
    }
  },
)

export {server}
