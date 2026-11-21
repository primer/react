import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'select',
  name: 'Select',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      defaultValue: 'false',
      description: 'Creates a full width input element',
      required: false,
    },
    {
      name: 'placeholder',
      type: 'string',
      description:
        "Placeholder text to show when no option is selected.\nThis option is hidden from the dropdown menu when the 'required' prop is set",
      required: false,
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      defaultValue: '',
      description: 'Creates a smaller or larger input than the default.',
      required: false,
    },
    {
      name: 'validationStatus',
      type: "'error' | 'success'",
      description: 'Style the input to match the status',
      required: false,
    },
  ],
  subcomponents: [],
})
