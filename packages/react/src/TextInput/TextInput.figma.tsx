import figma from '@figma/code-connect'
import TextInput from './TextInput'
import FormControl from '../FormControl'

figma.connect(
  TextInput,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15341-46504&t=39jWyeflbJqVh77d-4',
  {
    props: {
      textInput: figma.nestedProps('Text Input', {
        label: figma.textContent('Label'),
      }),
      TextType: figma.instance('inputTextType'),
      trailingAction: figma.boolean('trailingAction?', {
        true: figma.instance('trailingAction'),
        false: undefined,
      }),
      size: figma.enum('size', {
        small: 'small',
        medium: 'medium',
        large: 'large',
      }),
      leadingVisual: figma.boolean('leadingVisual?', {
        false: undefined,
        true: figma.instance('icon'),
      }),
      caption: figma.boolean('caption?', {
        false: undefined,
        true: figma.children('FormControl.Caption'),
      }),
      label: figma.boolean('label?', {
        false: undefined,
        true: figma.children('FormControl.Label'),
      }),
      labelProps: figma.nestedProps('FormControl.Label', {
        required: figma.boolean('required'),
      }),
      disabled: figma.enum('state', {disabled: true}),
      readonly: figma.enum('state', {'read-only': true}),
      inset: figma.boolean('inset?'),
      validation: figma.children('Form.Validation'),
    },
    variant: {'label?': true},
    example: ({
      textInput,
      label,
      size,
      validation,
      caption,
      leadingVisual,
      trailingAction,
      disabled,
      readonly,
      labelProps,
    }) => (
      <FormControl disabled={disabled} required={labelProps.required}>
        {label}
        <TextInput
          size={size}
          value={textInput.label}
          trailingAction={trailingAction}
          leadingVisual={leadingVisual}
          readOnly={readonly}
        />
        {validation}
        {caption}
      </FormControl>
    ),
  },
)

figma.connect(
  TextInput,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15341-46504&t=39jWyeflbJqVh77d-4',
  {
    props: {
      textInput: figma.nestedProps('Text Input', {
        label: figma.textContent('Label'),
      }),
      TextType: figma.instance('inputTextType'),
      trailingAction: figma.boolean('trailingAction?', {
        true: figma.instance('trailingAction'),
        false: undefined,
      }),
      size: figma.enum('size', {
        small: 'small',
        medium: 'medium',
        large: 'large',
      }),
      leadingVisual: figma.boolean('leadingVisual?', {
        false: undefined,
        true: figma.instance('icon'),
      }),
      caption: figma.boolean('caption?', {
        false: undefined,
        true: figma.children('FormControl.Caption'),
      }),
      disabled: figma.enum('state', {disabled: true}),
      readonly: figma.enum('state', {'read-only': true}),
      inset: figma.boolean('inset?'),
      validation: figma.children('Form.Validation'),
    },
    variant: {'label?': false},
    example: ({textInput, size, validation, caption, leadingVisual, trailingAction, disabled, readonly}) => (
      <FormControl disabled={disabled}>
        <TextInput
          size={size}
          value={textInput.label}
          trailingAction={trailingAction}
          leadingVisual={leadingVisual}
          readOnly={readonly}
        />
        {validation}
        {caption}
      </FormControl>
    ),
  },
)
