import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Radio',
  displayName: 'Radio',
  status: 'stable',
  keywords: [],
  stories: [
    'components-radio--default',
    'components-radio-features--with-leading-visual',
    'components-radio-features--disabled',
    'components-radio-features--with-caption',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'Unique option value used to identify the selection and submit the form.',
      required: true,
    },
    {
      name: 'name',
      type: 'string',
      description: 'Name shared by related radios. Can come from the parent RadioGroup.',
      required: false,
    },
    {
      name: 'checked',
      type: 'boolean',
      description: 'Whether the option is selected in controlled mode.',
      required: false,
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      description: 'Whether the option starts selected in uncontrolled mode.',
      required: false,
    },
    {
      name: 'onChange',
      type: 'React.ChangeEventHandler<HTMLInputElement>',
      description: 'Called when the input selection changes.',
      required: false,
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Prevents interaction with this option.',
      required: false,
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLInputElement>',
      description: 'Ref to the underlying radio input.',
      required: false,
    },
    {
      name: 'required',
      type: 'boolean',
      description: 'Requires a selection in the radio group for form submission.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/radio/
    description: 'Let users select one option from a short list.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/radio/
        guidance: true,
        description: 'Place related radio options in a RadioGroup rather than using an individual radio on its own.',
      },
      {
        // Source: https://primer.style/product/components/radio/
        guidance: true,
        description: 'Show validation at the group level rather than on individual options.',
      },
    ],
    anatomy: [],
  },
})
