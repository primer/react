import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
// eslint-disable-next-line import/no-namespace
import * as cheerio from 'cheerio'
import {z} from 'zod'
import TurndownService from 'turndown'
import {listComponents, listPatterns, listIcons} from './primer'
import {tokens, serialize} from './primitives'
import packageJson from '../package.json' with {type: 'json'}

const server = new McpServer({
  name: 'Primer',
  version: packageJson.version,
})

const turndownService = new TurndownService()

// -----------------------------------------------------------------------------
// Project setup
// -----------------------------------------------------------------------------
server.tool('init', 'Setup or create a project that includes Primer React', async () => {
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
})

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------
server.tool('list_components', 'List all of the components available from Primer React', async () => {
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
  'Retrieve documentation and usage details for a specific React component from the @primer/react package by its name. This tool provides the official Primer documentation for any listed component, making it easy to inspect, reuse, or integrate components in your project.',
  {
    name: z.string().describe('The name of the component to retrieve'),
  },
  async ({name}) => {
    const components = listComponents()
    const match = components.find(component => {
      return component.name === name || component.name.toLowerCase() === name.toLowerCase()
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

    const url = new URL(`/product/components/${match.slug}`, 'https://primer.style')
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

server.tool(
  'get_component_usage_guidelines',
  'Get usage information for how to use a component from Primer',
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

server.tool(
  'get_component_accessibility_guidelines',
  'Retrieve accessibility guidelines and best practices for a specific component from the @primer/react package by its name. Use this tool to get official accessibility recommendations, usage tips, and requirements to ensure your UI components are inclusive and meet accessibility standards. ',
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
    const patterns = listPatterns()
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
          text: `Here are the guidelines for the \`${name}\` pattern for Primer:

${text}`,
        },
      ],
    }
  },
)

// -----------------------------------------------------------------------------
// Design Tokens
// -----------------------------------------------------------------------------
server.tool('list_tokens', 'List all of the design tokens available from Primer', async () => {
  let text =
    'Below is a list of all design tokens available from Primer. Tokens are used in CSS and CSS Modules. To refer to the CSS Custom Property for a design token, wrap it in var(--{name-of-token}). To learn how to use a specific token, use a corresponding usage tool for the category of the token. For example, if a token is a color token look for the get_color_usage tool. \n\n'

  text += serialize(tokens)

  return {
    content: [
      {
        type: 'text',
        text,
      },
    ],
  }
})

// -----------------------------------------------------------------------------
// Foundations
// -----------------------------------------------------------------------------
server.tool('get_color_usage', 'Get the guidelines for how to apply color to a user interface', async () => {
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
})

server.tool('get_typography_usage', 'Get the guidelines for how to apply typography to a user interface', async () => {
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
})

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------
server.tool('list_icons', 'List all of the icons (octicons) available from Primer Octicons React', async () => {
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
})

server.tool(
  'get_icon',
  'Get a specific icon (octicon) by name from Primer',
  {
    name: z.string().describe('The name of the icon to retrieve'),
    size: z.string().optional().describe('The size of the icon to retrieve, e.g. "16"').default('16'),
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
server.tool(
  'primer_coding_guidelines',
  'Get the guidelines when writing code that uses Primer or for UI code that you are creating',
  async () => {
    return {
      content: [
        {
          type: 'text',
          text: `When writing code that uses Primer, follow these guidelines:

## Design Tokens

- Prefer design tokens over hard-coded values. For example, use \`var(--fgColor-default)\` instead of \`#24292f\`. Use the \`list_tokens\` tool to find the design token you need.
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
server.tool(
  'review_alt_text',
  'Evaluates image alt text against accessibility best practices and context relevance.',
  {
    surroundingText: z.string().describe('Text surrounding the image, relevant to the image.'),
    alt: z.string().describe('The alt text of the image being evaluated'),
    image: z
      .union([
        z.instanceof(File).describe('The image src file being evaluated'),
        z.string().url().describe('The URL of the image src being evaluated'),
        z.string().describe('The file path of the image src being evaluated'),
      ])
      .describe('The image file, file path, or URL being evaluated'),
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
      sampling: {temperature: 0.4},
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
