import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Select',
  displayName: 'Select',
  status: 'stable',
  keywords: [],
  stories: [
    'components-select--default',
    'components-select-features--with-option-groups',
    'components-select-features--disabled',
    'components-select-features--with-caption',
    'components-select-features--visually-hidden-label',
    'components-select-features--error',
    'components-select-features--success',
    'components-select-features--block',
    'components-select-features--small',
    'components-select-features--large',
    'components-select-features--with-custom-styling',
    'components-select-features--with-placeholder-option',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'block',
      type: 'boolean',
      description: 'Makes the select fill the available width.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Adds a placeholder option before the supplied options.',
      required: false,
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      description: 'Visual size of the control.',
      required: false,
    },
    {
      name: 'validationStatus',
      type: "'error' | 'success'",
      description: 'Validation state of the control.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Select.Option',
      displayName: 'Select.Option',
      props: [
        {
          name: 'value',
          type: 'string',
          description: 'Value submitted when this option is selected.',
          required: true,
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Visible text for the option.',
          required: false,
        },
      ],
    },
    {
      name: 'Select.OptGroup',
      displayName: 'Select.OptGroup',
      props: [
        {name: 'label', type: 'string', description: 'Name of this group of options.', required: false},
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Options in this group.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/select/
    description: 'Let users pick one option from a predefined dropdown list.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/select/guidelines/
        guidance: true,
        description: 'Consider a radio group for six or fewer options when vertical space allows.',
      },
      {
        // Source: https://primer.style/product/components/select/guidelines/
        guidance: true,
        description: 'Choose a default option when possible and order options in a predictable way.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/select/guidelines/
        name: 'Label',
        required: true,
        description: 'Names the control and identifies what the options represent.',
      },
      {
        // Source: https://primer.style/product/components/select/guidelines/
        name: 'Input',
        required: true,
        description: 'Shows the selection and opens the option list.',
      },
      {
        // Source: https://primer.style/product/components/select/guidelines/
        name: 'Required indicator',
        required: false,
        description: 'Shows when a selection is mandatory.',
      },
      {
        // Source: https://primer.style/product/components/select/guidelines/
        name: 'Caption',
        required: false,
        description: 'Adds context not covered by the label.',
      },
      {
        // Source: https://primer.style/product/components/select/guidelines/
        name: 'Validation message',
        required: false,
        description: 'Explains how to correct an invalid selection.',
      },
    ],
  },
})
