import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Breadcrumbs',
  displayName: 'Breadcrumbs',
  status: 'stable',
  keywords: [],
  stories: ['components-breadcrumbs--default'],
  importPath: '@primer/react',
  props: [
    {
      name: 'className',
      type: 'string',
      description: 'Class name for the breadcrumbs container.',
      required: false,
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Breadcrumbs.Item elements in navigation order.',
      required: false,
    },
    {
      name: 'overflow',
      type: "'wrap' | 'menu' | 'menu-with-root'",
      description: 'Wraps overflowing items or collapses them into a menu that can also include the root item.',
      required: false,
      defaultValue: "'wrap'",
    },
    {
      name: 'variant',
      type: "'normal' | 'spacious'",
      description: 'Controls whether the breadcrumbs use standard or increased padding.',
      required: false,
      defaultValue: "'normal'",
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      description: 'Styles and CSS custom properties on the breadcrumbs container.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Breadcrumbs.Item',
      displayName: 'Breadcrumbs.Item',
      props: [
        {
          name: 'selected',
          type: 'boolean',
          description: 'Marks the current page with `aria-current="page"`.',
          required: false,
        },
        {
          name: 'to',
          type: 'To',
          description: 'Destination for a routing component passed to `as`.',
          required: false,
        },
        {name: 'href', type: 'string', description: 'Destination URL for an anchor.', required: false},
        {name: 'children', type: 'React.ReactNode', description: 'Item content.', required: false},
        {
          name: 'ref',
          type: 'React.Ref<HTMLAnchorElement>',
          description: 'Ref to the item element. Its type follows the element provided to `as`.',
          required: false,
        },
        {name: 'as', type: 'React.ElementType', description: '', required: false, defaultValue: "'a'"},
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/breadcrumbs/
    description: 'Show the current page in the site hierarchy and give users a way to navigate to its parent pages.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/breadcrumbs/guidelines/
        guidance: true,
        description: 'Use breadcrumbs on deeply nested pages that need a quick route back to a parent page.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/breadcrumbs/guidelines/
        name: 'Parent links',
        required: true,
        description: 'Navigate to higher levels in the hierarchy.',
      },
      {
        // Source: https://primer.style/product/components/breadcrumbs/guidelines/
        name: 'Dividers',
        required: true,
        description: 'Separate adjacent items.',
      },
      {
        // Source: https://primer.style/product/components/breadcrumbs/guidelines/
        name: 'Current page',
        required: true,
        description: 'Shows the current context as the last item.',
      },
    ],
  },
})
