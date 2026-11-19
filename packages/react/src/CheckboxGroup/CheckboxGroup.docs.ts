import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'CheckboxGroup',
  displayName: 'CheckboxGroup',
  status: 'stable',
  keywords: [],
  stories: [
    'components-checkboxgroup--default',
    'components-checkboxgroup-features--visually-hidden-label',
    'components-checkboxgroup-features--with-external-label',
    'components-checkboxgroup-features--error',
    'components-checkboxgroup-features--success',
    'components-checkboxgroup-features--caption',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'External label ID. Name the group with this prop or a CheckboxGroup.Label child.',
      required: false,
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Checkbox form controls and optional group label, caption, and validation.',
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
    {
      name: 'onChange',
      type: '(selected: Array<string>, e?: ChangeEvent<HTMLInputElement>) => void',
      description: 'Receives the selected checkbox values when the selection changes.',
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
      name: 'CheckboxGroup.Label',
      displayName: 'CheckboxGroup.Label',
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
      name: 'CheckboxGroup.Caption',
      displayName: 'CheckboxGroup.Caption',
      props: [
        {name: 'children', type: 'React.ReactNode', description: '', required: false},
        {name: 'className', type: 'string', description: '', required: false},
      ],
    },
    {
      name: 'CheckboxGroup.Validation',
      displayName: 'CheckboxGroup.Validation',
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
    // Source: https://primer.style/product/components/checkbox-group/guidelines/
    description: 'Let users mark one item or select several independent options.',
    bestPractices: [],
    anatomy: [
      {
        // Source: https://primer.style/product/components/checkbox-group/guidelines/
        name: 'Label',
        required: true,
        description: 'Names the group and explains how the options relate.',
      },
      {
        // Source: https://primer.style/product/components/checkbox-group/guidelines/
        name: 'Options',
        required: true,
        description: 'Checkboxes for the available choices.',
      },
      {
        // Source: https://primer.style/product/components/checkbox-group/guidelines/
        name: 'Caption',
        required: false,
        description: 'Adds context when the label is not enough.',
      },
      {
        // Source: https://primer.style/product/components/checkbox-group/guidelines/
        name: 'Validation message',
        required: false,
        description: 'Explains why the selection is not valid.',
      },
    ],
  },
})
