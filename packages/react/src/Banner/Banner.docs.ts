import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Banner',
  displayName: 'Banner',
  status: 'stable',
  keywords: [],
  stories: [
    'components-banner--default',
    'components-banner-features--critical',
    'components-banner-features--info',
    'components-banner-features--success',
    'components-banner-features--upsell',
    'components-banner-features--warning',
    'components-banner-features--dismiss',
    'components-banner-features--dismiss-with-actions',
    'components-banner-features--with-hidden-title',
    'components-banner-features--with-hidden-title-and-actions',
    'components-banner-features--dismissible-with-hidden-title-and-actions',
    'components-banner-features--dismissible-with-hidden-title-and-secondary-action',
    'components-banner-features--with-actions',
    'components-banner-features--custom-icon',
    'components-banner-examples--with-announcement',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'aria-label',
      type: 'string',
      description: 'Overrides the default name for the banner region.',
      required: false,
    },
    {name: 'className', type: 'string', description: 'Class name for the outermost element.', required: false},
    {name: 'description', type: 'React.ReactNode', description: 'Supplemental information.', required: false},
    {name: 'hideTitle', type: 'boolean', description: 'Visually hides the title.', required: false},
    {name: 'icon', type: 'React.ReactNode', description: 'Deprecated. Use `leadingVisual` instead.', required: false},
    {
      name: 'leadingVisual',
      type: 'React.ReactNode',
      description: 'Custom visual for the `info` and `upsell` variants.',
      required: false,
    },
    {
      name: 'onDismiss',
      type: '() => void',
      description: 'Adds a dismiss button and handles its activation.',
      required: false,
    },
    {name: 'primaryAction', type: 'React.ReactNode', description: 'Primary action for the banner.', required: false},
    {
      name: 'secondaryAction',
      type: 'React.ReactNode',
      description: 'Secondary action for the banner.',
      required: false,
    },
    {
      name: 'title',
      type: 'React.ReactNode',
      description: 'Names the banner. Provide a title unless using a Banner.Title child.',
      required: false,
    },
    {
      name: 'variant',
      type: "'critical' | 'info' | 'success' | 'upsell' | 'warning'",
      description: 'Sets the presentation of the banner.',
      required: false,
      defaultValue: "'info'",
    },
    {
      name: 'layout',
      type: "'default' | 'compact'",
      description: 'Controls banner padding. Use `compact` for less padding.',
      required: false,
      defaultValue: "'default'",
    },
    {
      name: 'actionsLayout',
      type: "'default' | 'inline' | 'stacked'",
      description: 'Overrides the actions layout.',
      required: false,
      defaultValue: "'default'",
    },
    {
      name: 'flush',
      type: 'boolean',
      description: 'Uses a full-width banner in a confined container.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'References an element that names the banner.',
      required: false,
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Banner content, including a Banner.Title when no title prop is provided.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Banner.Title',
      displayName: 'Banner.Title',
      props: [
        {
          name: 'as',
          type: "'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
          description: 'Heading level.',
          required: false,
          defaultValue: "'h2'",
        },
        {name: 'className', type: 'string', description: '', required: false},
        {name: 'id', type: 'string', description: 'Overrides the generated title ID.', required: false},
      ],
    },
    {
      name: 'Banner.Description',
      displayName: 'Banner.Description',
      props: [{name: 'className', type: 'string', description: '', required: false}],
    },
    {
      name: 'Banner.PrimaryAction',
      displayName: 'Banner.PrimaryAction',
      props: [
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element or component used for the action.',
          required: false,
          defaultValue: "'button'",
        },
        {name: 'children', type: 'React.ReactNode', description: 'Action label.', required: false},
      ],
    },
    {
      name: 'Banner.SecondaryAction',
      displayName: 'Banner.SecondaryAction',
      props: [
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element or component used for the action.',
          required: false,
          defaultValue: "'button'",
        },
        {name: 'children', type: 'React.ReactNode', description: 'Action label.', required: false},
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/banner/guidelines/
    description: 'Highlight important information or give feedback after an action.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/banner/guidelines/
        guidance: true,
        description: 'Use banners only when relevant and keep the message short and direct.',
      },
      {
        // Source: https://primer.style/product/components/banner/guidelines/
        guidance: false,
        description: 'Do not show more than one banner on the same page at the same time.',
      },
    ],
    anatomy: [],
  },
})
