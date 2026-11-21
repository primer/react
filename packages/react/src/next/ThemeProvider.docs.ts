import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'theme_provider_next',
  name: 'ThemeProvider',
  status: 'stable',
  a11yReviewed: false,
  importPath: '@primer/react/next',
  stories: [],
  props: [
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Content that receives the theme context.',
      required: false,
    },
    {
      name: 'colorMode',
      type: "'auto' | 'day' | 'night' | 'light' | 'dark'",
      description:
        'Color mode to apply. Use `auto` to follow the system preference. If omitted, inherit from the parent provider or use `day`.',
      required: false,
    },
    {
      name: 'dayScheme',
      type: 'string',
      description:
        'Color scheme for `day` and `light` modes. If omitted, inherit from the parent provider or use `light`.',
      required: false,
    },
    {
      name: 'nightScheme',
      type: 'string',
      description:
        'Color scheme for `night` and `dark` modes. If omitted, inherit from the parent provider or use `dark`.',
      required: false,
    },
    {name: 'preventSSRMismatch', type: 'boolean', description: 'Deprecated. This prop has no effect.', required: false},
    {
      name: 'contextOnly',
      type: 'boolean',
      description: 'Provide theme context without rendering a wrapping `div` with theme data attributes.',
      required: false,
      defaultValue: 'false',
    },
  ],
  subcomponents: [],
})
