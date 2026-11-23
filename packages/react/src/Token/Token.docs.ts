import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'token',
  name: 'Token',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-token--default',
    'components-token-features--interactive-token',
    'components-token-features--token-with-leading-visual',
    'components-token-features--token-with-on-remove-fn',
    'components-token-features--default-issue-label-token',
    'components-token-features--interactive-issue-label-token',
    'components-token-features--issue-label-token-with-on-remove-fn',
    'components-token-features--small-token',
    'components-token-features--large-token',
    'components-token-features--x-large-token',
    'components-token-features--issue-label-token-custom-colors',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'leadingVisual',
      type: 'React.ComponentType<React.PropsWithChildren<any>>',
      description: 'A function that renders a component before the token text',
      required: false,
    },
    {name: 'text', required: true, type: 'string', description: 'The text label inside the token'},
    {
      name: 'as',
      type: "'button' | 'a' | 'span'",
      defaultValue: "'span'",
      description: 'The HTML element to render for the token.',
      required: false,
    },
    {
      name: 'onRemove',
      type: '() => void',
      description:
        'The function that gets called when a user clicks the remove button, or keys `Backspace` or `Delete` when focused on the token',
      required: false,
    },
    {
      name: 'hideRemoveButton',
      type: 'boolean',
      description: 'Whether the remove button should be rendered in the token',
      required: false,
    },
    {name: 'isSelected', type: 'boolean', description: 'Whether the token is selected', required: false},
    {
      name: 'id',
      type: 'number | string',
      description: 'A unique identifier that can be associated with the token',
      required: false,
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large' | 'xlarge'",
      description: 'Which size the token will be rendered at',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'IssueLabelToken',
      props: [
        {name: 'fillColor', type: 'string', description: 'The color that corresponds to the label', required: false},
        {name: 'text', required: true, type: 'string', description: 'The text label inside the token'},
        {
          name: 'as',
          type: "'button' | 'a' | 'span'",
          defaultValue: "'span'",
          description: 'The HTML element to render for the token.',
          required: false,
        },
        {
          name: 'onRemove',
          type: '() => void',
          description:
            'The function that gets called when a user clicks the remove button, or keys `Backspace` or `Delete` when focused on the token',
          required: false,
        },
        {
          name: 'hideRemoveButton',
          type: 'boolean',
          description: 'Whether the remove button should be rendered in the token',
          required: false,
        },
        {name: 'isSelected', type: 'boolean', description: 'Whether the token is selected', required: false},
        {
          name: 'id',
          type: 'number | string',
          description: 'A unique identifier that can be associated with the token',
          required: false,
        },
        {
          name: 'size',
          type: "'small' | 'medium' | 'large' | 'xlarge'",
          description: 'Which size the token will be rendered at',
          required: false,
        },
      ],
      displayName: 'IssueLabelToken',
    },
  ],
})
