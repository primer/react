import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'checkbox_group',
  name: 'CheckboxGroup',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      description: 'Used when associating the input group with a label other than CheckboxGroup.Label',
      required: false,
    },
    {
      name: 'children',
      type: 'CheckboxGroup.Label | CheckboxGroup.Caption | CheckboxGroup.Validation | FormControl',
      required: true,
      description: '',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Whether the input group allows user input',
      required: false,
    },
    {
      name: 'id',
      type: 'string',
      defaultValue: 'a generated string',
      description:
        'The unique identifier for this input group. Used to associate the label, validation text, and caption text.\nYou may want a custom ID to make it easier to select elements in integration tests.',
      required: false,
    },
    {
      name: 'onChange',
      type: '(selected: Array<string>, e?: ChangeEvent<HTMLInputElement>) => void',
      description: 'An onChange handler that gets called when the selection changes',
      required: false,
    },
    {
      name: 'required',
      type: 'boolean',
      defaultValue: 'false',
      description: 'If true, the user must make a selection before the owning form can be submitted',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'CheckboxGroup.Label',
      props: [
        {
          name: 'visuallyHidden',
          type: 'boolean',
          defaultValue: 'false',
          description: 'If true, the fieldset legend will be visually hidden',
          required: false,
        },
      ],
      displayName: 'Label',
    },
    {
      name: 'CheckboxGroup.Caption',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'The caption content',
          required: false,
        },
      ],
      displayName: 'Caption',
    },
    {
      name: 'CheckboxGroup.Validation',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'The validation message',
          required: false,
        },
        {
          name: 'variant',
          type: "'error' | 'success'",
          required: true,
          description: 'Changes the visual style to match the validation status',
        },
      ],
      displayName: 'Validation',
    },
  ],
})
