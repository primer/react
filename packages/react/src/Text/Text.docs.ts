import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'text',
  name: 'Text',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      defaultValue: "'span'",
      type: 'React.ElementType',
      description: 'The element or component to render for the text.',
      required: false,
    },
    {name: 'size', type: "'large' | 'medium' | 'small'", description: 'Sets the font size.', required: false},
    {
      name: 'weight',
      type: "'light' | 'normal' | 'medium' | 'semibold'",
      description: 'Sets the font weight.',
      required: false,
    },
    {
      name: 'whiteSpace',
      type: "'pre' | 'normal' | 'nowrap' | 'pre-wrap' | 'pre-line'",
      description: 'Controls how whitespace and line wrapping are handled.',
      required: false,
    },
  ],
  subcomponents: [],
})
