import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Token',
  displayName: 'Token',
  status: 'stable',
  keywords: [],
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
      type: 'React.ElementType',
      description: 'Visual before the label. Not shown at the small size.',
      required: false,
    },
    {name: 'text', type: 'React.ReactNode', description: 'Token label.', required: true},
    {
      name: 'as',
      type: "'button' | 'a' | 'span'",
      description: 'Element used for the token or its text control.',
      required: false,
      defaultValue: "'span'",
    },
    {
      name: 'onRemove',
      type: '() => void',
      description: 'Called when the user requests removal by keyboard or remove button.',
      required: false,
    },
    {
      name: 'hideRemoveButton',
      type: 'boolean',
      description: 'Hides the remove button without disabling keyboard removal.',
      required: false,
    },
    {name: 'isSelected', type: 'boolean', description: 'Applies selected styling.', required: false},
    {name: 'id', type: 'number | string', description: 'Unique token identifier.', required: false},
    {
      name: 'size',
      type: "'small' | 'medium' | 'large' | 'xlarge'",
      description: 'Token size.',
      required: false,
      defaultValue: "'medium'",
    },
    {name: 'disabled', type: 'boolean', description: 'Marks the token as noninteractive.', required: false},
  ],
  subcomponents: [
    {
      // The legacy grouping is preserved, but IssueLabelToken is a separate named export.
      name: 'IssueLabelToken',
      displayName: 'IssueLabelToken',
      props: [
        {
          name: 'fillColor',
          type: 'string',
          description: 'Color associated with the issue label.',
          required: false,
          defaultValue: "'#999'",
        },
        {name: 'text', type: 'React.ReactNode', description: 'Token label.', required: true},
        {
          name: 'as',
          type: "'button' | 'a' | 'span'",
          description: 'Element used for the token or its text control.',
          required: false,
          defaultValue: "'span'",
        },
        {
          name: 'onRemove',
          type: '() => void',
          description: 'Called when the user requests removal by keyboard or remove button.',
          required: false,
        },
        {
          name: 'hideRemoveButton',
          type: 'boolean',
          description: 'Hides the remove button without disabling keyboard removal.',
          required: false,
        },
        {name: 'isSelected', type: 'boolean', description: 'Applies selected styling.', required: false},
        {name: 'id', type: 'number | string', description: 'Unique token identifier.', required: false},
        {
          name: 'size',
          type: "'small' | 'medium' | 'large' | 'xlarge'",
          description: 'Token size.',
          required: false,
          defaultValue: "'medium'",
        },
        {name: 'disabled', type: 'boolean', description: 'Marks the token as noninteractive.', required: false},
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/token/
    description: 'Represent an object compactly, often in a group of related labels or editable values.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/token/guidelines/
        guidance: false,
        description: 'Do not substitute tokens for standard links or buttons.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/token/guidelines/
        name: 'Leading visual',
        required: false,
        description: 'Adds context, for example with an avatar.',
      },
      {
        // Source: https://primer.style/product/components/token/guidelines/
        name: 'Label',
        required: true,
        description: 'Identifies the object in a few words.',
      },
      {
        // Source: https://primer.style/product/components/token/guidelines/
        name: 'Remove button',
        required: false,
        description: 'Removes the token from an editable group.',
      },
    ],
  },
})
