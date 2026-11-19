import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'form_control',
  name: 'FormControl',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-formcontrol--default',
    'components-formcontrol-features--with-complex-inputs',
    'components-formcontrol-features--with-custom-input',
    'components-formcontrol-features--with-checkbox-and-radio-inputs',
    'components-formcontrol-features--single-input',
    'components-formcontrol-features--validation-example',
    'components-formcontrol-features--with-select-panel',
    'components-formcontrol-features--with-leading-visual',
    'components-formcontrol-features--disabled-inputs',
    'components-formcontrol-features--custom-required',
    'components-formcontrol-features--with-caption',
    'components-formcontrol-features--with-caption-and-disabled',
    'components-formcontrol-features--with-hidden-label',
    'components-formcontrol-features--with-required-indicator',
    'components-formcontrol-features--with-success-validation',
    'components-formcontrol-features--with-error-validation',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'children',
      type: 'FormControl.Label | FormControl.Caption | FormControl.Validation | Autocomplete | TextInput | TextInputWithTokens | Select',
      defaultValue: '',
      required: true,
      description: '',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Whether the control allows user input',
      required: false,
    },
    {
      name: 'id',
      type: 'string',
      defaultValue: 'a generated string',
      description:
        'The unique identifier for this control. Used to associate the label, validation text, and caption text',
      required: false,
    },
    {
      name: 'required',
      type: 'boolean',
      defaultValue: 'false',
      description: 'If true, the user must specify a value for the input before the owning form can be submitted',
      required: false,
    },
    {
      name: 'id',
      type: 'string',
      description:
        'The unique identifier for this control. Used to associate the label, validation text, and caption text',
      defaultValue: '',
      required: false,
    },
    {
      name: 'layout',
      type: "'vertical' | 'horizontal'",
      description:
        'The direction the content flows.\nVertical layout is used by default, and horizontal layout is used for checkbox and radio inputs.',
      defaultValue: 'vertical',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Class name(s) for custom styling.',
      defaultValue: '',
      required: false,
    },
    {
      name: 'ref',
      type: 'React.RefObject<HTMLDivElement>',
      required: false,
      description:
        'Allows getting a ref to the component instance.\nOnce the component unmounts, React will set `ref.current` to `null`\n(or call the ref with `null` if you passed a callback ref).',
    },
  ],
  subcomponents: [
    {
      name: 'FormControl.Label',
      props: [
        {
          name: 'visuallyHidden',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the label should be visually hidden',
          required: false,
        },
        {
          name: 'as',
          type: "'label' | 'legend' | 'span'",
          defaultValue: "'label'",
          description:
            "The label element can be changed to a 'legend' when it's being used to label a fieldset, or a 'span' when it's being used to label an element that is not a form input. For example: when using a FormControl to render a labeled SegementedControl, the label should be a 'span'",
          required: false,
        },
        {
          name: 'requiredText',
          type: 'string',
          defaultValue: "'*'",
          description: 'The text to display when the field is required',
          required: false,
        },
        {
          name: 'requiredIndicator',
          type: 'boolean',
          defaultValue: 'true',
          description:
            'Whether to show or hide the required text in the accessibility tree, the required text is still shown visually.',
          required: false,
        },
        {
          name: 'htmlFor',
          type: 'string',
          description:
            "This prop may be used to override the `htmlFor` set from FormControl's React Context.\nThe unique identifier for the associated input",
          defaultValue: '',
          required: false,
        },
        {
          name: 'id',
          type: 'string',
          description:
            "When `as` prop is 'label', it may be used to override the `htmlFor` given to the `<label>` element by FormControl's React Context.\nWhen 'as' prop is 'legend' or 'span', it is used as the `id` for the element.",
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Class name(s) for custom styling.',
          defaultValue: '',
          required: false,
        },
      ],
      displayName: 'Label',
    },
    {
      name: 'FormControl.Caption',
      props: [
        {
          name: 'id',
          type: 'string',
          description: "Custom ID to override the ID set by FormControl's React Context",
          defaultValue: '',
          required: false,
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          defaultValue: '',
          description: 'The content (usually just text) that is rendered to give contextual info about the field',
          required: false,
        },
      ],
      displayName: 'Caption',
    },
    {
      name: 'FormControl.Validation',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          defaultValue: '',
          description:
            'The content (usually just text) that is rendered to give contextual info about the validation result for the field',
          required: false,
        },
        {
          name: 'variant',
          type: "'error' | 'success'",
          defaultValue: '',
          required: true,
          description: 'Changes the visual style to match the validation status',
        },
        {
          name: 'id',
          type: 'string',
          description: "May be used to override the ID assigned by FormControl's React Context",
          defaultValue: '',
          required: false,
        },
      ],
      displayName: 'Validation',
    },
    {
      name: 'FormControl.LeadingVisual',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          defaultValue: '',
          description: "The visual to render before the choice input's label",
          required: false,
        },
      ],
      displayName: 'LeadingVisual',
    },
  ],
})
