import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'UnderlineNav',
  displayName: 'UnderlineNav',
  status: 'stable',
  keywords: [],
  stories: [
    'components-underlinenav--default',
    'components-underlinenav-features--default',
    'components-underlinenav-features--with-icons',
    'components-underlinenav-features--with-counter-labels',
    'components-underlinenav-features--overflow-template',
    'components-underlinenav-features--overflow-on-narrow-screen',
    'components-underlinenav-features--counters-loading-state',
    'components-underlinenav-features--variant-flush',
  ],
  importPath: '@primer/react',
  props: [
    {name: 'aria-label', type: 'string', description: 'Accessible name for the navigation.', required: false},
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'UnderlineNav.Item elements in navigation order.',
      required: true,
    },
    {
      name: 'loadingCounters',
      type: 'boolean',
      description: 'Shows loading placeholders for the item counters.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'hideIconsBreakpoint',
      type: "'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | null",
      description: 'Hides icons below this container width. Pass `null` to always show them.',
      required: false,
      defaultValue: "'medium'",
    },
    {
      name: 'variant',
      type: "'inset' | 'flush'",
      description: 'Use `flush` to remove horizontal item padding.',
      required: false,
      defaultValue: "'inset'",
    },
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Root element or component.',
      required: false,
      defaultValue: "'nav'",
    },
    {name: 'className', type: 'string', description: '', required: false},
  ],
  subcomponents: [
    {
      name: 'UnderlineNav.Item',
      displayName: 'UnderlineNav.Item',
      props: [
        {
          name: 'aria-current',
          type: "'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean",
          description: 'Identifies the current item.',
          required: false,
        },
        {name: 'counter', type: 'number | string', description: 'Counter shown after the label.', required: false},
        {
          name: 'href',
          type: 'string',
          description: 'Destination URL. Defaults to `#` for an anchor only.',
          required: false,
        },
        {
          name: 'icon',
          type: 'React.FunctionComponent<IconProps> | React.ReactElement',
          description: 'Deprecated. Use `leadingVisual` instead.',
          required: false,
        },
        {name: 'leadingVisual', type: 'React.ReactElement', description: 'Visual before the label.', required: false},
        {
          name: 'onSelect',
          type: '(event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void',
          description: 'Called on click, Enter, or Space.',
          required: false,
        },
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element or component used for the link.',
          required: false,
          defaultValue: "'a'",
        },
        {name: 'children', type: 'React.ReactNode', description: 'Navigation item content.', required: false},
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/underline-nav/
    description: 'Use horizontal, tab-shaped links to navigate between pages.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/underline-nav/guidelines/
        guidance: true,
        description: 'Give each item its own URL and mark the active page on load.',
      },
      {
        // Source: https://primer.style/product/components/underline-nav/guidelines/
        guidance: true,
        description: 'Keep the number of items low to avoid crowding.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/underline-nav/guidelines/
        name: 'Label',
        required: true,
        description: 'Describes the destination.',
      },
      {
        // Source: https://primer.style/product/components/underline-nav/guidelines/
        name: 'Leading icon',
        required: false,
        description: 'Helps identify the destination.',
      },
      {
        // Source: https://primer.style/product/components/underline-nav/guidelines/
        name: 'Counter',
        required: false,
        description: 'Shows a count beside the label.',
      },
      {
        // Source: https://primer.style/product/components/underline-nav/guidelines/
        name: 'Overflow menu',
        required: false,
        description: 'Holds items that do not fit in the row.',
      },
    ],
  },
})
