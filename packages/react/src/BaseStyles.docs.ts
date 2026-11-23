import {defineComponent} from './docs/component'

export default defineComponent({
  id: 'base_styles',
  name: 'BaseStyles',
  status: 'stable',
  a11yReviewed: false,
  importPath: '@primer/react',
  stories: ['behaviors-basestyles-dev--with-style-props'],
  props: [
    {
      name: 'as',
      type: 'React.ComponentType<any> | keyof React.JSX.IntrinsicElements',
      description: 'The element or component that applies the base typography and marks the portal root.',
      required: false,
      defaultValue: "'div'",
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Content that inherits the base font, line height, and foreground color.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'An additional class name for the wrapper.',
      required: false,
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      description: 'Inline styles for the wrapper.',
      required: false,
    },
    {
      name: 'color',
      type: 'string',
      description: 'A CSS color for the wrapper. When omitted, the base styles use the default foreground token.',
      required: false,
    },
  ],
  subcomponents: [],
})
