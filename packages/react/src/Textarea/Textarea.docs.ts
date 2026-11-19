import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Textarea',
  displayName: 'Textarea',
  status: 'stable',
  keywords: [],
  stories: [
    'components-textarea--default',
    'components-textarea-features--disabled',
    'components-textarea-features--with-caption',
    'components-textarea-features--visually-hidden-label',
    'components-textarea-features--error',
    'components-textarea-features--success',
    'components-textarea-features--block',
    'components-textarea-features--custom-height',
    'components-textarea-features--custom-width',
    'components-textarea-features--custom-resize-behavior',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'required',
      type: 'boolean',
      description: 'Whether the user must enter a value.',
      required: false,
    },
    {name: 'cols', type: 'number', description: 'Visible width in characters.', required: false, defaultValue: '30'},
    {name: 'rows', type: 'number', description: 'Number of visible lines.', required: false, defaultValue: '7'},
    {
      name: 'block',
      type: 'boolean',
      description: 'Makes the textarea fill the available width.',
      required: false,
    },
    {
      name: 'resize',
      type: "'none' | 'both' | 'horizontal' | 'vertical'",
      description: 'Controls which directions the user can resize the textarea.',
      required: false,
      defaultValue: 'both',
    },
    {
      name: 'autoSize',
      type: 'boolean',
      description: 'Allows the textarea to grow to fit its content.',
      required: false,
    },
    {
      name: 'characterLimit',
      type: 'number',
      description: 'Shows a character counter and applies validation styling when the limit is exceeded.',
      required: false,
    },
    {
      name: 'contrast',
      type: 'boolean',
      description: 'Deprecated. Omit to use the default background.',
      required: false,
    },
    {
      name: 'validationStatus',
      type: "'error' | 'success'",
      description: 'Validation state of the textarea.',
      required: false,
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLTextAreaElement>',
      description: 'Ref to the native textarea.',
      required: false,
    },
    {name: 'className', type: 'string', description: 'CSS class for the wrapper.', required: false},
    {name: 'minHeight', type: 'number', description: 'Minimum height of the textarea.', required: false},
    {name: 'maxHeight', type: 'number', description: 'Maximum height of the textarea.', required: false},
    {name: 'disabled', type: 'boolean', description: 'Disables the textarea.', required: false},
    {
      name: 'style',
      type: 'React.CSSProperties',
      description: 'CSS styles for the textarea.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/textarea/
    description: 'Accept a value that can span multiple lines of text.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/textarea/guidelines/
        guidance: true,
        description:
          'Give the field a concise label that explains what to enter, even if the label is visually hidden.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/textarea/guidelines/
        name: 'Label',
        required: true,
        description: 'Identifies what the field is for.',
      },
      {
        // Source: https://primer.style/product/components/textarea/guidelines/
        name: 'Input',
        required: true,
        description: 'Accepts free-form text.',
      },
      {
        // Source: https://primer.style/product/components/textarea/guidelines/
        name: 'Caption',
        required: false,
        description: 'Adds short instructions or explains how the value will be used.',
      },
    ],
  },
})
