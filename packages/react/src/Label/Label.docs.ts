import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'label',
  name: 'Label',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-label--default',
    'components-label-features--primary',
    'components-label-features--secondary',
    'components-label-features--accent',
    'components-label-features--success',
    'components-label-features--attention',
    'components-label-features--severe',
    'components-label-features--danger',
    'components-label-features--done',
    'components-label-features--sponsors',
    'components-label-features--size-large',
    'components-label-features--size-small',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'variant',
      type: "| 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'attention' | 'severe' | 'danger' | 'done' | 'sponsors'",
      defaultValue: "'default'",
      description: 'The color of the label',
      required: false,
    },
    {
      name: 'size',
      type: "'small' | 'large'",
      defaultValue: "'small'",
      description: 'How large the label is rendered',
      required: false,
    },
  ],
  subcomponents: [],
})
