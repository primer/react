import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'radio',
  name: 'Radio',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      defaultValue: '',
      required: true,
      description: 'A unique value that is never shown to the user',
    },
    {
      name: 'name',
      type: 'string',
      defaultValue: '',
      description: 'Required for grouping multiple radios',
      required: false,
    },
    {
      name: 'checked',
      type: 'boolean',
      defaultValue: '',
      description: 'Modifies true/false value of the native radio',
      required: false,
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      defaultValue: '',
      description: 'Selects the radio by default in uncontrolled mode',
      required: false,
    },
    {
      name: 'onChange',
      type: '(event: React.ChangeEvent) => void',
      defaultValue: '',
      description: 'A callback function that is triggered when the input state has been changed',
      required: false,
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: '',
      description: 'Modifies the native disabled state of the native checkbox',
      required: false,
    },
    {
      name: 'ref',
      type: 'React.RefObject<HTMLInputElement>',
      required: false,
      description:
        'Allows getting a ref to the component instance.\nOnce the component unmounts, React will set `ref.current` to `null`\n(or call the ref with `null` if you passed a callback ref).',
    },
  ],
  subcomponents: [],
})
