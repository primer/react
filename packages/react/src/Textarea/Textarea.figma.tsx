import figma from '@figma/code-connect'
import Textarea from './Textarea'
import FormControl from '../FormControl'

figma.connect(
  Textarea,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30948-151237&t=piEMikE6LqVednrO-4',
  {
    props: {
      contrast: figma.boolean('contrast'),
      label: figma.children('FormControl.Label'),
      caption: figma.boolean('caption?', {
        false: undefined,
        true: figma.children('FormControl.Caption'),
      }),
      state: figma.enum('state', {
        default: 'default',
        focus: 'focus',
        disabled: 'disabled',
      }),
      disabled: figma.enum('state', {disabled: true}),
      validation: figma.children('Form.Validation'),
      labelProps: figma.nestedProps('FormControl.Label', {
        required: figma.boolean('required'),
      }),
      text: figma.string('text'),
      texttype: figma.enum('text type', {
        Value: 'value',
        Placeholder: 'placeholder',
      }),
    },
    variant: {'label?': true},
    example: ({text, label, validation, caption, disabled, labelProps, contrast}) => (
      <FormControl disabled={disabled} required={labelProps.required}>
        {label}
        <Textarea value={text} contrast={contrast} />
        {validation}
        {caption}
      </FormControl>
    ),
  },
)

figma.connect(
  Textarea,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30948-151237&t=piEMikE6LqVednrO-4',
  {
    props: {
      contrast: figma.boolean('contrast'),
      caption: figma.boolean('caption?', {
        false: undefined,
        true: figma.children('FormControl.Caption'),
      }),
      state: figma.enum('state', {
        default: 'default',
        focus: 'focus',
        disabled: 'disabled',
      }),
      disabled: figma.enum('state', {disabled: true}),
      validation: figma.children('Form.Validation'),
      text: figma.string('text'),
      texttype: figma.enum('text type', {
        Value: 'value',
        Placeholder: 'placeholder',
      }),
    },
    variant: {'label?': false},
    example: ({text, validation, caption, disabled, contrast}) => (
      <FormControl disabled={disabled}>
        <Textarea value={text} contrast={contrast} />
        {validation}
        {caption}
      </FormControl>
    ),
  },
)
