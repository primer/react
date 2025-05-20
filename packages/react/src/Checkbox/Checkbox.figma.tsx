import {FormControl, Checkbox} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  Checkbox,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15341-46321&t=9imbqLYmermiHP7U-4',
  {
    props: {
      caption: figma.boolean('caption?', {
        false: undefined,
        true: figma.children('Caption'),
      }),
      label: figma.children('Label'),
      labelProps: figma.nestedProps('Label', {
        required: figma.boolean('required'),
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      checked: figma.boolean('checked?'),
      indeterminate: figma.boolean('indeterminate?'),
    },
    example: ({disabled, label, caption, checked, indeterminate, labelProps}) => (
      <FormControl disabled={disabled} required={labelProps.required}>
        <Checkbox checked={checked} indeterminate={indeterminate} value="..." />
        {label}
        {caption}
      </FormControl>
    ),
  },
)
