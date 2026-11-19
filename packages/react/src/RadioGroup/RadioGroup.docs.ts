import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'RadioGroup',
  displayName: 'RadioGroup',
  status: 'stable',
  keywords: [],
  stories: [
    'components-radiogroup--default',
    'components-radiogroup-features--visually-hidden-label',
    'components-radiogroup-features--with-external-label',
    'components-radiogroup-features--error',
    'components-radiogroup-features--success',
    'components-radiogroup-features--caption',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'External label ID. Name the group with this prop or a RadioGroup.Label child.',
      required: false,
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Radio form controls and optional group label, caption, and validation.',
      required: false,
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disables input for the group.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'id',
      type: 'string',
      description: 'Identifies the group and its associated text. An ID is generated when omitted.',
      required: false,
    },
    {name: 'name', type: 'string', description: 'Name shared by the radio inputs in the group.', required: true},
    {
      name: 'onChange',
      type: '(selected: string | null, e?: ChangeEvent<HTMLInputElement>) => void',
      description: 'Receives the selected value when the selection changes.',
      required: false,
    },
    {
      name: 'required',
      type: 'boolean',
      description: 'Indicates that a selection is required.',
      required: false,
      defaultValue: 'false',
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
  ],
  subcomponents: [
    {
      name: 'RadioGroup.Label',
      displayName: 'RadioGroup.Label',
      props: [
        {
          name: 'visuallyHidden',
          type: 'boolean',
          description: 'Hides the legend visually but retains its accessible name.',
          required: false,
          defaultValue: 'false',
        },
        {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
        {name: 'children', type: 'React.ReactNode', description: '', required: false},
      ],
    },
    {
      name: 'RadioGroup.Caption',
      displayName: 'RadioGroup.Caption',
      props: [
        {name: 'children', type: 'React.ReactNode', description: '', required: false},
        {name: 'className', type: 'string', description: '', required: false},
      ],
    },
    {
      name: 'RadioGroup.Validation',
      displayName: 'RadioGroup.Validation',
      props: [
        {name: 'children', type: 'React.ReactNode', description: '', required: false},
        {
          name: 'variant',
          type: "'error' | 'success'",
          description: 'Styles the message for its validation status.',
          required: true,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/radio-group/
    description: 'Let users select one option from a short list of mutually exclusive choices.',
    bestPractices: [],
    anatomy: [
      {
        // Source: https://primer.style/product/components/radio-group/guidelines/
        name: 'Label',
        required: true,
        description: 'Names the group and explains how the options relate.',
      },
      {
        // Source: https://primer.style/product/components/radio-group/guidelines/
        name: 'Options',
        required: true,
        description: 'Radio buttons for the mutually exclusive choices.',
      },
      {
        // Source: https://primer.style/product/components/radio-group/guidelines/
        name: 'Caption',
        required: false,
        description: 'Adds context when the label is not enough.',
      },
      {
        // Source: https://primer.style/product/components/radio-group/guidelines/
        name: 'Validation message',
        required: false,
        description: 'Explains why the selection is not valid.',
      },
    ],
  },
})
