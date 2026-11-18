import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'InlineMessage',
  displayName: 'InlineMessage',
  status: 'experimental',
  keywords: [],
  stories: [
    'experimental-components-inlinemessage--default',
    'experimental-components-inlinemessage-features--critical',
    'experimental-components-inlinemessage-features--success',
    'experimental-components-inlinemessage-features--unavailable',
    'experimental-components-inlinemessage-features--warning',
    'experimental-components-inlinemessage-features--multiline',
  ],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'size',
      type: "'small' | 'medium'",
      description: 'Size of the message.',
      required: false,
      defaultValue: "'medium'",
    },
    {
      name: 'variant',
      type: "'critical' | 'success' | 'unavailable' | 'warning'",
      description: 'Tone of the message. Omit for an informational icon.',
      required: false,
    },
    {
      name: 'leadingVisual',
      type: 'React.ElementType | React.ReactNode',
      description: 'Visual to display instead of the default icon.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/inline-message/
    description: 'Communicate the result of an action within the surrounding content.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/inline-message/
        guidance: true,
        description: 'Place the message near the control or content affected by the action.',
      },
    ],
    anatomy: [],
  },
})
