import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Checkbox',
  displayName: 'Checkbox',
  status: 'stable',
  keywords: [],
  stories: [
    'components-checkbox--default',
    'components-checkbox-features--with-leading-visual',
    'components-checkbox-features--disabled',
    'components-checkbox-features--with-caption',
    'components-checkbox-features--indeterminate',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'checked',
      type: 'boolean',
      description: 'Controls whether the checkbox is checked.',
      required: false,
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      description: 'Initial checked state when uncontrolled.',
      required: false,
    },
    {name: 'disabled', type: 'boolean', description: 'Disables the checkbox.', required: false},
    {name: 'indeterminate', type: 'boolean', description: 'Displays the mixed state.', required: false},
    {
      name: 'onChange',
      type: 'React.ChangeEventHandler<HTMLInputElement>',
      description: 'Called when the input changes.',
      required: false,
    },
    {
      name: 'validationStatus',
      type: "'error' | 'success'",
      description: 'Sets the ARIA validation state without changing the checkbox style.',
      required: false,
    },
    {
      name: 'value',
      type: 'string',
      description: 'Value used to identify the checkbox in form submission.',
      required: false,
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLInputElement>',
      description: 'Ref to the native checkbox input.',
      required: false,
    },
    {
      name: 'required',
      type: 'boolean',
      description: 'Whether this checkbox must be checked.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/checkbox/
    description: 'Let users make a single selection or choose multiple items from a set.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/checkbox/
        guidance: true,
        description: 'Show validation on the checkbox group rather than on an individual checkbox.',
      },
      {
        // Source: https://primer.style/product/components/checkbox/
        guidance: true,
        description: 'Mark the group as required when users must choose an option from the group.',
      },
    ],
    anatomy: [],
  },
})
