import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'inline_message',
  name: 'InlineMessage',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  importPath: '@primer/react/experimental',
  stories: [
    'experimental-components-inlinemessage--default',
    'experimental-components-inlinemessage-features--critical',
    'experimental-components-inlinemessage-features--success',
    'experimental-components-inlinemessage-features--unavailable',
    'experimental-components-inlinemessage-features--warning',
    'experimental-components-inlinemessage-features--multiline',
  ],
  props: [
    {
      name: 'size',
      description: 'Specify the size of the inline message',
      type: "'small' | 'medium'",
      defaultValue: "'medium'",
      required: false,
    },
    {
      name: 'variant',
      description: 'Specify the type of the inline message',
      type: "'critical' | 'success' | 'unvailable' | 'warning'",
      required: true,
    },
    {
      name: 'leadingVisual',
      description: 'A custom leading visual to display instead of the default variant icon.',
      type: 'React.ElementType | React.ReactNode',
      required: false,
    },
  ],
  subcomponents: [],
})
