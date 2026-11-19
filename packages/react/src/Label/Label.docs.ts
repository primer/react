import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Label',
  displayName: 'Label',
  status: 'stable',
  keywords: [],
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
      type: "'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'attention' | 'severe' | 'danger' | 'done' | 'sponsors'",
      description: 'Color of the label.',
      required: false,
      defaultValue: "'default'",
    },
    {
      name: 'size',
      type: "'small' | 'large'",
      description: 'Size of the label.',
      required: false,
      defaultValue: "'small'",
    },
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element or component to render.',
      required: false,
      defaultValue: "'span'",
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/label/
    description: 'Distinguish a status, category, or other contextual metadata from surrounding text.',
    bestPractices: [],
    anatomy: [],
  },
})
