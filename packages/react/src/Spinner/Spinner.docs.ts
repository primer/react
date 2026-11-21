import {defineComponent} from '../docs/component'

export default defineComponent({
  a11yReviewed: '2025-01-08',
  id: 'spinner',
  importPath: '@primer/react',
  name: 'Spinner',
  props: [
    {
      description: 'Sets the width and height of the spinner.',
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      required: false,
    },
    {
      defaultValue: 'Loading',
      description:
        'Sets the text conveyed by assistive technologies such as screen readers. Set to `null` if the loading state is displayed in a text node somewhere else on the page.',
      name: 'srText',
      type: 'string | null',
      required: false,
    },
    {
      deprecated: true,
      description: 'Sets the text conveyed by assistive technologies such as screen readers.',
      name: 'aria-label',
      type: 'string',
      required: false,
    },
    {description: '', name: 'className', type: 'string', required: false},
    {
      name: 'data-*',
      type: 'string',
      description: 'Custom data attributes forwarded to the spinner SVG.',
      required: false,
    },
    {
      defaultValue: 'false',
      description:
        "Controls whether and how long to delay rendering the spinner. Set to `true` to delay by 1000ms, `'short'` to delay by 300ms, `'long'` to delay by 1000ms, or provide a custom number of milliseconds.",
      name: 'delay',
      type: "boolean | 'short' | 'long' | number",
      required: false,
    },
  ],
  status: 'alpha',
  stories: [
    'components-spinner--default',
    'components-spinner-features--small',
    'components-spinner-features--large',
    'components-spinner-features--suppress-screen-reader-text',
    'components-spinner-features--with-delay',
  ],
  subcomponents: [],
})
