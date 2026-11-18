import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Text',
  displayName: 'Text',
  status: 'stable',
  keywords: [],
  stories: [
    'components-text--default',
    'components-text-features--polymorphism',
    'components-text-features--styled-text',
    'components-text-features--size-small',
    'components-text-features--size-medium',
    'components-text-features--size-large',
    'components-text-features--light-weight',
    'components-text-features--normal-weight',
    'components-text-features--medium-weight',
    'components-text-features--semibold-weight',
    'components-text-features--pre-white-space',
    'components-text-features--normal-white-space',
    'components-text-features--nowrap-white-space',
    'components-text-features--pre-wrap-white-space',
    'components-text-features--pre-line-white-space',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element or component to render.',
      required: false,
      defaultValue: "'span'",
    },
    {
      name: 'size',
      type: "'large' | 'medium' | 'small'",
      description: 'Typography size of the text.',
      required: false,
    },
    {
      name: 'weight',
      type: "'light' | 'normal' | 'medium' | 'semibold'",
      description: 'Font weight of the text.',
      required: false,
    },
    {
      name: 'whiteSpace',
      type: "'pre' | 'normal' | 'nowrap' | 'pre-wrap' | 'pre-line'",
      description: 'Controls how whitespace and line wrapping are handled.',
      required: false,
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/text/
    description: 'Apply Primer typography styles to text.',
    bestPractices: [],
    anatomy: [],
  },
})
