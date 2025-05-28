import Select from '.'
import FormControl from '../FormControl'
import figma from '@figma/code-connect'

figma.connect(Select, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15341-46907&m=dev', {
  props: {
    caption: figma.boolean('caption?'),
    label: figma.children('FormControl.Label'),
    size: figma.enum('size', {
      medium: 'medium',
      small: 'small',
      large: 'large',
    }),
    disabled: figma.enum('state', {
      disabled: true,
    }),
    validation: figma.children('Form.Validation'),
    block: figma.boolean('fullWidth?'),
  },
  example: ({size, disabled, block, label, validation}) => (
    <FormControl disabled={disabled}>
      {label}
      <Select size={size} block={block} />,{validation}
    </FormControl>
  ),
})
