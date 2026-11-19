import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Spinner',
  displayName: 'Spinner',
  status: 'stable',
  keywords: [],
  stories: [
    'components-spinner--default',
    'components-spinner-features--small',
    'components-spinner-features--large',
    'components-spinner-features--suppress-screen-reader-text',
    'components-spinner-features--with-delay',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      description: 'Width and height of the spinner.',
      required: false,
      defaultValue: 'medium',
    },
    {
      name: 'srText',
      type: 'string | null',
      description:
        'Screen reader text. Pass `null` if text elsewhere on the page already identifies the loading state.',
      required: false,
      defaultValue: 'Loading',
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'Deprecated. Use `srText` instead.',
      required: false,
    },
    {name: 'className', type: 'string', description: '', required: false},
    {name: 'data-*', type: 'unknown', description: 'Custom data attributes.', required: false},
    {
      name: 'delay',
      type: "boolean | 'short' | 'long' | number",
      description:
        'Wait before showing the spinner. Pass `true` or `long` for 1000 ms, `short` for 300 ms, or a number of milliseconds.',
      required: false,
      defaultValue: 'false',
    },
    {name: 'style', type: 'React.CSSProperties', description: '', required: false},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/spinner/
    description: 'Indicate that work is in progress when its duration is unknown or varies.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/spinner/
        guidance: true,
        description: 'Use a spinner on its own or pair it with a loading message.',
      },
    ],
    anatomy: [],
  },
})
