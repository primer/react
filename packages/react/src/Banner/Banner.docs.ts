import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'banner',
  name: 'Banner',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  importPath: '@primer/react',
  stories: [
    'components-banner--default',
    'components-banner-features--critical',
    'components-banner-features--info',
    'components-banner-features--success',
    'components-banner-features--upsell',
    'components-banner-features--warning',
    'components-banner-features--dismiss',
    'components-banner-features--dismiss-with-actions',
    'components-banner-features--with-hidden-title',
    'components-banner-features--with-hidden-title-and-actions',
    'components-banner-features--dismissible-with-hidden-title-and-actions',
    'components-banner-features--dismissible-with-hidden-title-and-secondary-action',
    'components-banner-features--with-actions',
    'components-banner-features--custom-icon',
    'components-banner-examples--with-announcement',
  ],
  props: [
    {
      name: 'aria-label',
      type: 'string',
      description: 'Provide an optional label to override the default name for the Banner landmark region',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Provide an optional className to add to the outermost element rendered by the Banner',
      required: false,
    },
    {
      name: 'description',
      type: 'React.ReactNode',
      description:
        'Provide an optional description for the Banner. This should provide supplemental information about the Banner',
      required: false,
    },
    {name: 'hideTitle', type: 'boolean', description: 'Whether to hide the title visually.', required: false},
    {
      name: 'icon',
      type: 'React.ReactNode',
      description: 'Provide a custom icon for the Banner. This is only available when `variant` is `info` or `upsell`',
      deprecated: true,
      required: false,
    },
    {
      name: 'leadingVisual',
      type: 'React.ReactNode',
      description:
        'Provide a custom leading visual for the Banner. This is only available when `variant` is `info` or `upsell`',
      required: false,
    },
    {
      name: 'onDismiss',
      type: '() => void',
      description:
        'Optionally provide a handler to be called when the banner is dismissed. Providing this prop will show a dismiss button',
      required: false,
    },
    {name: 'primaryAction', type: 'React.ReactNode', description: '', required: false},
    {name: 'secondaryAction', type: 'React.ReactNode', description: '', required: false},
    {
      name: 'title',
      type: 'React.ReactNode',
      description:
        'The title for the Banner. This will be used as the accessible name and is required unless `Banner.Title` is used as a child',
      required: false,
    },
    {
      name: 'variant',
      type: "'critical' | 'info' | 'success' | 'upsell' | 'warning'",
      description: 'Specify the type of the Banner',
      required: false,
    },
    {
      name: 'layout',
      type: "'default' | 'compact'",
      description: 'Specify the layout of the Banner. Compact layout will reduce the padding.',
      required: false,
    },
    {
      name: 'actionsLayout',
      type: "'default' | 'inline' | 'stacked'",
      description:
        "Override the responsive layout of the action buttons. 'inline' layout will display the buttons inline with the title and description, while 'stacked' layout will always render the buttons in a new row.",
      required: false,
    },
    {
      name: 'flush',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Full width banner specifically for use within confined spaces, such as dialogs, tables, cards, or boxes where available space is limited.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Banner.Title',
      props: [
        {
          name: 'as',
          type: "'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
          description: 'HTML heading element used to render the banner title.',
          required: false,
        },
      ],
      displayName: 'Title',
    },
    {
      name: 'Banner.Description',
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Class name(s) for custom styling.',
          required: false,
        },
      ],
      displayName: 'Description',
    },
    {
      name: 'Banner.PrimaryAction',
      props: [],
      passthrough: {element: 'Button', url: '/react/Button'},
      displayName: 'PrimaryAction',
    },
    {
      name: 'Banner.SecondaryAction',
      props: [],
      passthrough: {element: 'Button', url: '/react/Button'},
      displayName: 'SecondaryAction',
    },
  ],
})
