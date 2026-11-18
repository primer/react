import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'LabelGroup',
  displayName: 'LabelGroup',
  status: 'stable',
  keywords: [],
  stories: [
    'components-labelgroup--default',
    'components-labelgroup-features--truncate-auto',
    'components-labelgroup-features--truncate-auto-with-interactive-tokens',
    'components-labelgroup-features--truncate-after-five',
    'components-labelgroup-features--truncate-auto-expand-inline',
    'components-labelgroup-features--truncate-auto-expand-inline-with-interactive-tokens',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'overflowStyle',
      type: "'inline' | 'overlay'",
      description: 'Show hidden items after the visible items or in a floating overlay.',
      required: false,
      defaultValue: 'overlay',
    },
    {
      name: 'visibleChildCount',
      type: "'auto' | number",
      description: 'Number of items to show. Use `auto` to fit the container, or omit to show all items.',
      required: false,
    },
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element used to render the group.',
      required: false,
      defaultValue: 'ul',
    },
    {name: 'className', type: 'string', description: '', required: false},
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Labels or tokens to arrange in the group.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/label-group/
    description: 'Apply consistent spacing and layout to a set of labels or tokens.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/label-group/accessibility/
        guidance: true,
        description: 'Group related labels so users can understand why they appear together.',
      },
    ],
    anatomy: [],
  },
})
