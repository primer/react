import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'radio_group',
  name: 'RadioGroup',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      description: 'Used when associating the input group with a label other than RadioGroup.Label',
      required: false,
    },
    {
      name: 'children',
      type: 'RadioGroup.Label | RadioGroup.Caption | RadioGroup.Validation | FormControl',
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
      defaultValue: 'A generated string',
      description:
        'The unique identifier for this input group. Used to associate the label, validation text, and caption text.\nYou may want a custom ID to make it easier to select elements in integration tests.',
      required: false,
    },
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'The name used to identify this group of radios',
    },
    {
      name: 'onChange',
      type: '(selected: string | null, e?: ChangeEvent<HTMLInputElement>) => void',
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
      name: 'RadioGroup.Label',
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
      name: 'RadioGroup.Caption',
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
      name: 'RadioGroup.Validation',
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
