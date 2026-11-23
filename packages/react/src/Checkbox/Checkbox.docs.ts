import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'checkbox',
  name: 'Checkbox',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      description: 'Modifies true/false value of the native checkbox',
      required: false,
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      description: 'Checks the input by default in uncontrolled mode',
      required: false,
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Modifies the native disabled state of the native checkbox',
      required: false,
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Applies an [indeterminate state](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#attr-indeterminate) to the checkbox',
      required: false,
    },
    {
      name: 'onChange',
      type: '(event: React.ChangeEvent) => void',
      description: 'A callback function that is triggered when the checked state has been changed',
      required: false,
    },
    {
      name: 'validationStatus',
      type: "'error' | 'success'",
      description: 'Only used to inform ARIA attributes.\nIndividual checkboxes do not have validation styles.',
      required: false,
    },
    {
      name: 'value',
      type: 'string',
      defaultValue: '',
      description:
        'A unique value that is never shown to the user.\nUsed during form submission and to identify which checkbox inputs are selected.',
      required: false,
    },
    {
      name: 'ref',
      type: 'React.RefObject<HTMLInputElement>',
      required: false,
      description: 'Forward a ref to the underlying input element',
    },
  ],
  subcomponents: [],
})
