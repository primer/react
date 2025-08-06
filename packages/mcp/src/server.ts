import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
// eslint-disable-next-line import/no-namespace
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
      throw new Error(`Failed to fetch ${url}: ${url} - ${response.statusText}`)
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

type Token = TokenCategory | string
type TokenCategory = {
  category: string
  tokens: Array<Token>
}

const tokens: Array<Token> = [
  {
    category: 'color',
    tokens: [
      {
        category: 'foreground',
        tokens: [
          '--fgColor-accent',
          '--fgColor-attention',
          '--fgColor-black',
          '--fgColor-closed',
          '--fgColor-danger',
          '--fgColor-default',
          '--fgColor-disabled',
          '--fgColor-done',
          '--fgColor-link',
          '--fgColor-muted',
          '--fgColor-neutral',
          '--fgColor-onEmphasis',
          '--fgColor-onInverse',
          '--fgColor-open',
          '--fgColor-severe',
          '--fgColor-sponsors',
          '--fgColor-success',
          '--fgColor-upsell',
          '--fgColor-white',
        ],
      },
      {
        category: 'background',
        tokens: [
          '--bgColor-accent-emphasis',
          '--bgColor-accent-muted',
          '--bgColor-attention-emphasis',
          '--bgColor-attention-muted',
          '--bgColor-black',
          '--bgColor-closed-emphasis',
          '--bgColor-closed-muted',
          '--bgColor-danger-emphasis',
          '--bgColor-danger-muted',
          '--bgColor-default',
          '--bgColor-disabled',
          '--bgColor-done-emphasis',
          '--bgColor-done-muted',
          '--bgColor-emphasis',
          '--bgColor-inset',
          '--bgColor-inverse',
          '--bgColor-muted',
          '--bgColor-neutral-emphasis',
          '--bgColor-neutral-muted',
          '--bgColor-open-emphasis',
          '--bgColor-open-muted',
          '--bgColor-severe-emphasis',
          '--bgColor-severe-muted',
          '--bgColor-sponsors-emphasis',
          '--bgColor-sponsors-muted',
          '--bgColor-success-emphasis',
          '--bgColor-success-muted',
          '--bgColor-transparent',
          '--bgColor-upsell-emphasis',
          '--bgColor-upsell-muted',
          '--bgColor-white',
        ],
      },
      {
        category: 'border',
        tokens: [
          '--borderColor-accent-emphasis',
          '--borderColor-accent-muted',
          '--borderColor-attention-emphasis',
          '--borderColor-attention-muted',
          '--borderColor-closed-emphasis',
          '--borderColor-closed-muted',
          '--borderColor-danger-emphasis',
          '--borderColor-danger-muted',
          '--borderColor-default',
          '--borderColor-disabled',
          '--borderColor-done-emphasis',
          '--borderColor-done-muted',
          '--borderColor-emphasis',
          '--borderColor-muted',
          '--borderColor-neutral-emphasis',
          '--borderColor-neutral-muted',
          '--borderColor-open-emphasis',
          '--borderColor-open-muted',
          '--borderColor-severe-emphasis',
          '--borderColor-severe-muted',
          '--borderColor-sponsors-emphasis',
          '--borderColor-sponsors-muted',
          '--borderColor-success-emphasis',
          '--borderColor-success-muted',
          '--borderColor-translucent',
          '--borderColor-transparent',
          '--borderColor-upsell-emphasis',
          '--borderColor-upsell-muted',
        ],
      },
      {
        category: 'shadow',
        tokens: [
          '--shadow-floating-large',
          '--shadow-floating-legacy',
          '--shadow-floating-medium',
          '--shadow-floating-small',
          '--shadow-floating-xlarge',
          '--shadow-inset',
          '--shadow-resting-medium',
          '--shadow-resting-small',
          '--shadow-resting-xsmall',
        ],
      },
      {
        category: 'control',
        tokens: [
          '--control-bgColor-active',
          '--control-bgColor-disabled',
          '--control-bgColor-hover',
          '--control-bgColor-rest',
          '--control-bgColor-selected',
          '--control-borderColor-danger',
          '--control-borderColor-disabled',
          '--control-borderColor-emphasis',
          '--control-borderColor-rest',
          '--control-borderColor-selected',
          '--control-borderColor-success',
          '--control-borderColor-warning',
          '--control-checked-bgColor-active',
          '--control-checked-bgColor-disabled',
          '--control-checked-bgColor-hover',
          '--control-checked-bgColor-rest',
          '--control-checked-borderColor-active',
          '--control-checked-borderColor-disabled',
          '--control-checked-borderColor-hover',
          '--control-checked-borderColor-rest',
          '--control-checked-fgColor-disabled',
          '--control-checked-fgColor-rest',
          '--control-danger-bgColor-active',
          '--control-danger-bgColor-hover',
          '--control-danger-fgColor-hover',
          '--control-danger-fgColor-rest',
          '--control-fgColor-disabled',
          '--control-fgColor-placeholder',
          '--control-fgColor-rest',
          '--control-iconColor-rest',
          '--control-transparent-bgColor-active',
          '--control-transparent-bgColor-disabled',
          '--control-transparent-bgColor-hover',
          '--control-transparent-bgColor-rest',
          '--control-transparent-bgColor-selected',
          '--control-transparent-borderColor-active',
          '--control-transparent-borderColor-hover',
          '--control-transparent-borderColor-rest',
        ],
      },
      {
        category: 'focus',
        tokens: ['--focus-outlineColor'],
      },
      {
        category: 'overlay',
        tokens: ['--overlay-background-bgColor', '--overlay-bgColor', '--overlay-borderColor'],
      },
    ],
  },
  {
    category: 'size',
    tokens: [
      {
        category: 'base',
        tokens: [
          '--base-size-2',
          '--base-size-4',
          '--base-size-6',
          '--base-size-8',
          '--base-size-12',
          '--base-size-16',
          '--base-size-20',
          '--base-size-24',
          '--base-size-28',
          '--base-size-32',
          '--base-size-36',
          '--base-size-40',
          '--base-size-44',
          '--base-size-48',
          '--base-size-64',
          '--base-size-80',
          '--base-size-96',
          '--base-size-112',
          '--base-size-128',
        ],
      },
      {
        category: 'border',
        tokens: [
          {
            category: 'border-size',
            tokens: [
              '--boxShadow-thick',
              '--boxShadow-thicker',
              '--boxShadow-thin',
              '--borderWidth-default',
              '--borderWidth-thick',
              '--borderWidth-thicker',
              '--borderWidth-thin',
            ],
          },
          {
            category: 'border-radius',
            tokens: [
              '--borderRadius-default',
              '--borderRadius-full',
              '--borderRadius-large',
              '--borderRadius-medium',
              '--borderRadius-small',
            ],
          },
          {
            category: 'outline',
            tokens: ['--outline-focus-offset', '--outline-focus-width'],
          },
        ],
      },
      {
        category: 'layout',
        tokens: [
          {
            category: 'stack',
            tokens: [
              '--stack-gap-condensed',
              '--stack-gap-normal',
              '--stack-gap-spacious',
              '--stack-padding-condensed',
              '--stack-padding-normal',
              '--stack-padding-spacious',
            ],
          },
          {
            category: 'controls',
            tokens: [
              '--controlStack-large-gap-auto',
              '--controlStack-large-gap-condensed',
              '--controlStack-large-gap-spacious',
              '--controlStack-medium-gap-condensed',
              '--controlStack-medium-gap-spacious',
              '--controlStack-small-gap-condensed',
              '--controlStack-small-gap-spacious',
              '--controlStack-medium-gap-auto',
              '--controlStack-small-gap-auto',

              '--control-xsmall-gap',
              '--control-small-gap',
              '--control-medium-gap',
              '--control-large-gap',
              '--control-xlarge-gap',
              '--control-xsmall-lineBoxHeight',
              '--control-small-lineBoxHeight',
              '--control-medium-lineBoxHeight',
              '--control-large-lineBoxHeight',
              '--control-xlarge-lineBoxHeight',
              '--control-xsmall-paddingBlock',
              '--control-small-paddingBlock',
              '--control-medium-paddingBlock',
              '--control-large-paddingBlock',
              '--control-xlarge-paddingBlock',
              '--control-xsmall-paddingInline-condensed',
              '--control-small-paddingInline-condensed',
              '--control-medium-paddingInline-condensed',
              '--control-large-paddingInline-condensed',
              '--control-xlarge-paddingInline-condensed',
              '--control-xsmall-paddingInline-normal',
              '--control-small-paddingInline-normal',
              '--control-medium-paddingInline-normal',
              '--control-large-paddingInline-normal',
              '--control-xlarge-paddingInline-normal',
              '--control-xsmall-paddingInline-spacious',
              '--control-small-paddingInline-spacious',
              '--control-medium-paddingInline-spacious',
              '--control-large-paddingInline-spacious',
              '--control-xlarge-paddingInline-spacious',
              '--control-xsmall-size',
              '--control-small-size',
              '--control-medium-size',
              '--control-large-size',
              '--control-xlarge-size',
            ],
          },
          {
            category: 'overlay',
            tokens: [
              '--overlay-borderRadius',
              '--overlay-height-large',
              '--overlay-height-medium',
              '--overlay-height-small',
              '--overlay-height-xlarge',
              '--overlay-offset',
              '--overlay-padding-condensed',
              '--overlay-padding-normal',
              '--overlay-paddingBlock-condensed',
              '--overlay-paddingBlock-normal',
              '--overlay-width-large',
              '--overlay-width-medium',
              '--overlay-width-small',
              '--overlay-width-xlarge',
              '--overlay-width-xsmall',
            ],
          },
        ],
      },
    ],
  },
  {
    category: 'typography',
    tokens: [
      {
        category: 'weight',
        tokens: [
          '--base-text-weight-light',
          '--base-text-weight-normal',
          '--base-text-weight-medium',
          '--base-text-weight-semibold',
        ],
      },
      {
        category: 'font-family',
        tokens: [
          '--fontStack-monospace',
          '--fontStack-sansSerif',
          '--fontStack-sansSerifDisplay',
          '--fontStack-system',
        ],
      },
      {
        category: 'font-shorthand',
        tokens: [
          '--text-body-shorthand-large',
          '--text-body-shorthand-medium',
          '--text-body-shorthand-small',
          '--text-caption-shorthand',
          '--text-codeBlock-shorthand',
          '--text-codeInline-shorthand',
          '--text-display-shorthand',
          '--text-subtitle-shorthand',
          '--text-title-shorthand-large',
          '--text-title-shorthand-medium',
          '--text-title-shorthand-small',
        ],
      },
      {
        category: 'display',
        tokens: [
          '--text-display-lineBoxHeight',
          '--text-display-lineHeight',
          '--text-display-size',
          '--text-display-weight',
        ],
      },
      {
        category: 'title-large',
        tokens: ['--text-title-lineHeight-large', '--text-title-size-large', '--text-title-weight-large'],
      },
      {
        category: 'title-medium',
        tokens: ['--text-title-lineHeight-medium', '--text-title-size-medium', '--text-title-weight-medium'],
      },
      {
        category: 'title-small',
        tokens: ['--text-title-lineHeight-small', '--text-title-size-small', '--text-title-weight-small'],
      },
      {
        category: 'subtitle',
        tokens: ['--text-subtitle-lineHeight', '--text-subtitle-size', '--text-subtitle-weight'],
      },
      {
        category: 'body-large',
        tokens: ['--text-body-lineHeight-large', '--text-body-size-large'],
      },
      {
        category: 'body-medium',
        tokens: ['--text-body-lineHeight-medium', '--text-body-size-medium'],
      },
      {
        category: 'body-small',
        tokens: ['--text-body-lineHeight-small', '--text-body-size-small'],
      },
      {
        category: 'caption',
        tokens: ['--text-caption-lineHeight', '--text-caption-size', '--text-caption-weight'],
      },
      {
        category: 'code-block',
        tokens: ['--text-codeBlock-lineHeight', '--text-codeBlock-size', '--text-codeBlock-weight'],
      },
      {
        category: 'inline-code-block',
        tokens: ['--text-codeInline-size', '--text-codeInline-weight'],
      },
    ],
  },
] as const

function serialize(token: Token): string {
  if (typeof token === 'string') {
    // eslint-disable-next-line github/unescaped-html-literal
    return `<token name="${token}"></token>`
  }
  // eslint-disable-next-line github/unescaped-html-literal
  return `<token-category name="${token.category}">\n${token.tokens.map(serialize).join('\n')}\n</token-category>`
}

// -----------------------------------------------------------------------------
// Design Tokens
// -----------------------------------------------------------------------------
server.tool('list_tokens', 'List all of the design tokens available from Primer', async () => {
  let text =
    'Below is a list of all designs tokens available from Primer. They are organized by category. Tokens are used in CSS and CSS Modules. They can also be referred to in JavaScript files using the style attribute or prop in React components. To refer to the CSS Custom Property for a design token, wrap it in var(name-of-token). To learn how to use a specific token, use a corresponding usage tool for the category of the token. For example, if a token is a color token look for the get_color_usage tool. \n\n'

  for (const token of tokens) {
    text += serialize(token)
    text += '\n'
  }

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

export {server}
