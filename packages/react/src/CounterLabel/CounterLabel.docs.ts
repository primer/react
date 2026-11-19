import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'CounterLabel',
  displayName: 'CounterLabel',
  status: 'stable',
  keywords: [],
  stories: [
    'components-counterlabel--default',
    'components-counterlabel-features--primary-theme',
    'components-counterlabel-features--secondary-theme',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'variant',
      type: "'primary' | 'secondary'",
      description: 'Controls visual emphasis. Falls back to `scheme` when provided.',
      required: false,
      defaultValue: "'secondary'",
    },
    {
      name: 'scheme',
      type: "'primary' | 'secondary'",
      description: 'Deprecated. Use `variant` instead.',
      required: false,
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
    {name: 'children', type: 'React.ReactNode', description: 'Count to display.', required: false},
    {
      name: 'data-component',
      type: 'string',
      description: 'Overrides the component identifier on the visible count.',
      required: false,
      defaultValue: "'CounterLabel'",
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/counter-label/
    description: 'Show a count next to a button or navigation item.',
    bestPractices: [],
    anatomy: [],
  },
})
