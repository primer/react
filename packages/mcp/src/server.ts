import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import * as cheerio from 'cheerio'
import {z} from 'zod'
import TurndownService from 'turndown'
import {listComponents, listPatterns} from './primer'
import packageJson from '../package.json' with {type: 'json'}

const server = new McpServer({
  name: 'Primer',
  version: packageJson.version,
})

const turndownService = new TurndownService()

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------
server.tool('get_components', 'List all of the components available from Primer React', async () => {
  const components = listComponents().map(component => {
    return `- ${component.name}`
  })
  return {
    content: [
      {
        type: 'text',
        text: `The following components are available in the @primer/react in TypeScript projects:

${components.join('\n')}

You can use the \`get_component\` tool to get more information about a specific component. You can use these components from the @primer/react package.`,
      },
    ],
  }
})

server.tool(
  'get_component',
  'Get a specific component by name',
  {
    name: z.string().describe('The name of the component to retrieve'),
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
      console.error(`Failed to fetch ${url}: ${response.statusText}`)
      return {
        content: [],
      }
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
          text: `Here is the documentation for the \`${name}\` component from the @primer/react package:
${text}`,
        },
      ],
    }
  },
)

server.tool(
  'get_component_examples',
  'Get examples for how to use a component from Primer React',
  {
    name: z.string().describe('The name of the component to retrieve'),
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
      console.error(`Failed to fetch ${url}: ${response.statusText}`)
      return {
        content: [],
      }
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

// -----------------------------------------------------------------------------
// Patterns
// -----------------------------------------------------------------------------
server.tool('list_patterns', 'List all of the patterns available from Primer React', async () => {
  const patterns = listPatterns().map(pattern => {
    return `- ${pattern.name}`
  })
  return {
    content: [
      {
        type: 'text',
        text: `The following patterns are available in the @primer/react in TypeScript projects:

${patterns.join('\n')}`,
      },
    ],
  }
})

server.tool(
  'get_pattern',
  'Get a specific pattern by name',
  {
    name: z.string().describe('The name of the pattern to retrieve'),
  },
  async ({name}) => {
    const patterns = listComponents()
    const match = patterns.find(pattern => {
      return pattern.name === name
    })
    if (!match) {
      return {
        content: [
          {
            type: 'text',
            text: `There is no pattern named \`${name}\` in the @primer/react package. For a full list of patterns, use the \`list_patterns\` tool.`,
          },
        ],
      }
    }

    const url = new URL(`/product/ui-patterns/${match.id}`, 'https://primer.style')
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`)
      return {
        content: [],
      }
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
          text: `Here are the guidelines for the \`${name}\` pattern for Primer:

${text}`,
        },
      ],
    }
  },
)

export {server}
