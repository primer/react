import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Card',
  displayName: 'Card',
  status: 'experimental',
  keywords: [],
  stories: [
    'experimental-components-card--default',
    'experimental-components-card-features--with-image',
    'experimental-components-card-features--compact',
    'experimental-components-card-features--with-link',
    'experimental-components-card-features--with-button',
    'experimental-components-card-features--custom-content',
    'experimental-components-card-features--with-metadata',
    'experimental-components-card-features--with-menu',
    'experimental-components-card-features--standalone-section',
    'experimental-components-card-features--in-list',
    'experimental-components-card-features--interactive-content',
  ],
  importPath: '@primer/react/experimental',
  props: [
    {name: 'children', type: 'React.ReactNode', description: 'Card subcomponents or custom content.', required: true},
    {name: 'className', type: 'string', description: 'Class name for the root element.', required: false},
    {
      name: 'padding',
      type: "'none' | 'condensed' | 'regular' | 'spacious' | 'normal'",
      description: 'Internal spacing.',
      required: false,
      defaultValue: "'normal'",
    },
    {
      name: 'shadow',
      type: 'boolean',
      description: 'Shows a shadow around the card.',
      required: false,
      defaultValue: 'true',
    },
    {
      name: 'layout',
      type: "'default' | 'compact'",
      description: 'Compact layout uses tighter spacing, a smaller title, and no icon background.',
      required: false,
      defaultValue: "'default'",
    },
    {
      name: 'borderRadius',
      type: "'medium' | 'large'",
      description: 'Corner radius.',
      required: false,
      defaultValue: "'large'",
    },
    {
      name: 'as',
      type: "'div' | 'section'",
      description: 'HTML element that wraps the card.',
      required: false,
      defaultValue: "'div'",
    },
  ],
  subcomponents: [
    {
      name: 'Card.Icon',
      displayName: 'Card.Icon',
      props: [
        {name: 'icon', type: 'React.ElementType', description: 'Octicon or custom SVG component.', required: true},
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible name, when the icon is not decorative.',
          required: false,
        },
        {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
      ],
    },
    {
      name: 'Card.Image',
      displayName: 'Card.Image',
      props: [
        {name: 'src', type: 'string', description: 'Image URL.', required: true},
        {
          name: 'alt',
          type: 'string',
          description: 'Alternative text for the image.',
          required: false,
          defaultValue: '""',
        },
      ],
    },
    {
      name: 'Card.Heading',
      displayName: 'Card.Heading',
      props: [
        {
          name: 'as',
          type: "'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
          description: 'Semantic heading level.',
          required: false,
          defaultValue: "'h3'",
        },
        {name: 'children', type: 'React.ReactNode', description: 'Content of the heading.', required: true},
      ],
    },
    {
      name: 'Card.Link',
      displayName: 'Card.Link',
      props: [
        {
          name: 'fullCardHitArea',
          type: 'boolean',
          description: 'Makes the whole card activate the link.',
          required: false,
          defaultValue: 'false',
        },
        {name: 'href', type: 'string', description: 'Link destination.', required: true},
        {name: 'children', type: 'React.ReactNode', description: 'Link contents.', required: true},
      ],
    },
    {
      name: 'Card.Button',
      displayName: 'Card.Button',
      props: [
        {
          name: 'fullCardHitArea',
          type: 'boolean',
          description: 'Makes the whole card activate the button.',
          required: false,
          defaultValue: 'false',
        },
        {name: 'children', type: 'React.ReactNode', description: 'Button contents.', required: true},
        {
          name: 'type',
          type: "'button' | 'submit' | 'reset'",
          description: 'Behavior of the button in a form.',
          required: false,
          defaultValue: "'button'",
        },
        {name: 'disabled', type: 'boolean', description: 'Disables the button.', required: false},
      ],
    },
    {
      name: 'Card.Description',
      displayName: 'Card.Description',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Descriptive content rendered in a paragraph.',
          required: true,
        },
      ],
    },
    {
      name: 'Card.Action',
      displayName: 'Card.Action',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Interactive control in the top-right corner.',
          required: true,
        },
      ],
    },
    {
      name: 'Card.Metadata',
      displayName: 'Card.Metadata',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Metadata displayed at the bottom of the card.',
          required: true,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/card/
    description: 'Group related content in a styled container that can stand alone or sit among other items in a list.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/card/
        guidance: true,
        description: 'Wrap each card in a list item when presenting a collection.',
      },
      {
        // Source: https://primer.style/product/components/card/
        guidance: true,
        description: 'Include the card’s context in the accessible label for its top-right action.',
      },
    ],
    anatomy: [],
  },
})
