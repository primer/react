import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'counter_label',
  name: 'CounterLabel',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      defaultValue: '',
      description:
        "Pass in 'primary' for a darker background and inverse text, or 'secondary' for a lighter background and primary text. Omitting the variant prop renders the default counter scheme",
      required: false,
    },
    {
      name: 'scheme',
      type: "'primary' | 'secondary'",
      defaultValue: '',
      description: 'Use `variant` instead.',
      deprecated: true,
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Class name(s) for custom styling.',
      required: false,
    },
  ],
  subcomponents: [],
})
