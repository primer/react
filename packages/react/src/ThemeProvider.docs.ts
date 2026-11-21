import {defineComponent} from './docs/component'

export default defineComponent({
  id: 'theme_provider',
  name: 'ThemeProvider',
  status: 'deprecated',
  a11yReviewed: false,
  importPath: '@primer/react',
  stories: ['behaviors-themeprovider--default', 'behaviors-themeprovider--nested', 'behaviors-themeprovider--auto'],
  props: [
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Content that receives theme context, including JavaScript theme values. Use `ThemeProvider` from `@primer/react/next` to migrate away from JavaScript theme values.',
      required: false,
    },
    {
      name: 'colorMode',
      type: "'day' | 'night' | 'light' | 'dark' | 'auto'",
      description: "Choose the light or dark scheme, or use `'auto'` to follow the system preference.",
      required: false,
      defaultValue: "Parent provider's color mode, or 'day'",
    },
    {
      name: 'dayScheme',
      type: 'string',
      description: 'The color scheme to use in day or light mode.',
      required: false,
      defaultValue: "Parent provider's day scheme, or 'light'",
    },
    {
      name: 'nightScheme',
      type: 'string',
      description: 'The color scheme to use in night or dark mode.',
      required: false,
      defaultValue: "Parent provider's night scheme, or 'dark'",
    },
    {
      name: 'contextOnly',
      type: 'boolean',
      description: 'Provide theme context without rendering the wrapper with theme data attributes.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'preventSSRMismatch',
      type: 'boolean',
      description: 'Deprecated. This prop has no effect.',
      required: false,
    },
  ],
  subcomponents: [],
})
