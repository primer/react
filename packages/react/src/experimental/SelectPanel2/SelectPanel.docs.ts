import {defineComponent} from '../../docs/component'

export default defineComponent({
  id: 'select_panel_v2',
  docsId: 'select_panel',
  name: 'SelectPanel',
  status: 'deprecated',
  a11yReviewed: false,
  stories: [
    'deprecated-components-selectpanel-examples--minimal',
    'deprecated-components-selectpanel-examples--short-select-panel',
    'deprecated-components-selectpanel-features--instant-selection-variant',
    'deprecated-components-selectpanel-features--with-warning',
    'deprecated-components-selectpanel-examples--open-from-menu',
    'deprecated-components-selectpanel-examples--with-groups',
    'deprecated-components-selectpanel-examples--async-search-with-use-transition',
    'deprecated-components-selectpanel-examples--async-with-suspended-list',
    'deprecated-components-selectpanel-examples--with-filter-buttons',
  ],
  importPath: '@primer/react/experimental',
  props: [
    {name: 'title', type: 'string', required: true, description: 'A descriptive title for the panel'},
    {name: 'defaultOpen', type: 'boolean', description: '', defaultValue: 'false', required: false},
    {
      name: 'description',
      type: 'string',
      description: 'When provided, a description is displayed below the title',
      required: false,
    },
    {
      name: 'variant',
      type: "'anchored' | 'modal'",
      defaultValue: 'anchored',
      description: 'Show the panel anchored to its trigger or as a modal.',
      required: false,
    },
    {
      name: 'selectionVariant',
      type: "'multiple' | 'single' | 'instant'",
      defaultValue: 'multiple',
      description: 'Allow a single selection, multiple selections, or submission as soon as an item is selected.',
      required: false,
    },
    {
      name: 'onSubmit',
      type: '(event: React.FormEvent) => void',
      description: 'Function that will be called when the panel is closed',
      required: false,
    },
    {
      name: 'onCancel',
      type: '() => void',
      description: 'Function that will be called when the selection is submitted',
      required: false,
    },
    {
      name: 'onClearSelection',
      type: '() => void',
      description: 'Function that will be called when the clear selection is selection',
      required: false,
    },
    {
      name: 'anchorRef',
      type: 'React.RefObject<HTMLButtonElement>',
      description: 'Useful for defining an external anchor',
      required: false,
    },
    {
      name: 'open',
      type: 'boolean',
      defaultValue: 'false',
      description: 'If defined, will control the open/closed state of the panel.',
      required: false,
    },
    {
      name: 'children',
      type: 'Array<React.ReactNode>',
      description:
        'Recommended: `SelectPanel.Button`, `SelectPanel.Header`, `ActionList`, `SelectPanel.Loading`, `SelectPanel.Message`, `SelectPanel.Footer`',
      required: true,
    },
    {
      name: 'width',
      type: "| 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'auto'",
      defaultValue: "'medium'",
      description:
        'Sets the width of the Dialog, pick from our set list of widths, or pass `auto` to automatically set the width based on the contents. `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `480px`, `xlarge` corresponds to `640px`, `xxlarge` corresponds to `960px`.',
      required: false,
    },
    {
      name: 'height',
      type: "| 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'fit-content'",
      defaultValue: "'large'",
      description:
        'Sets the height of the `Dialog`, pick from our set list of heights, or pass `fit-content` to set the height based on the contents. `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.',
      required: false,
    },
    {
      name: 'maxHeight',
      type: "'small' | 'large' | 'medium' | 'fit-content' | 'xlarge'",
      description: '',
      defaultValue: "'large'",
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'SelectPanel.Button',
      props: [
        {
          name: 'children',
          type: 'React.ReactElement',
          required: true,
          defaultValue: '',
          description: 'The content of the button that opens the panel.',
        },
      ],
      passthrough: {element: 'Button', url: '/react/Button'},
      displayName: 'Button',
    },
    {
      name: 'SelectPanel.Header',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Rendered before the list. Recommended: `SelectPanel.SearchInput`',
          required: false,
        },
        {name: 'onBack', type: '() => void', description: '', defaultValue: '', required: false},
      ],
      displayName: 'Header',
    },
    {
      name: 'SelectPanel.SearchInput',
      props: [
        {
          name: 'onChange',
          type: 'React.ChangeEventHandler<HTMLInputElement>',
          description: 'Callback when input text changes, use this for search/filter',
          required: false,
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Useful for subtle loading states while fetching items asynchronously',
          required: false,
        },
      ],
      passthrough: {element: 'TextInput', url: '/react/TextInput'},
      displayName: 'SearchInput',
    },
    {
      name: 'SelectPanel.Footer',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Optional: `<SelectPanel.SecondaryButton>`',
          required: false,
        },
      ],
      displayName: 'Footer',
    },
    {
      name: 'SelectPanel.SecondaryAction',
      props: [
        {
          name: 'variant',
          type: "'button' | 'link' | 'checkbox'",
          description: 'Render the secondary action as a button, link, or checkbox.',
          required: true,
        },
      ],
      displayName: 'SecondaryAction',
    },
    {
      name: 'SelectPanel.Loading',
      props: [
        {name: 'children', type: 'string', description: 'The text shown next to the loading spinner.', required: false},
      ],
      displayName: 'Loading',
    },
    {
      name: 'SelectPanel.Message',
      props: [
        {
          name: 'variant',
          type: "'warning' | 'error' | 'empty'",
          description: 'Show a warning, error, or empty state.',
          required: true,
        },
        {
          name: 'size',
          type: "'inline' | 'full'",
          description: 'Show the message inline or use the full message layout.',
          required: false,
        },
        {name: 'title', type: 'string', description: '`inline` variant does not accept `title`', required: false},
        {name: 'children', type: 'React.ReactNode', description: 'The body of the message.', required: true},
      ],
      displayName: 'Message',
    },
  ],
})
