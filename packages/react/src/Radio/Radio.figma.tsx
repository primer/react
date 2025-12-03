import {FormControl, Radio} from '../'
import figma from '@figma/code-connect'

figma.connect(Radio, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15341-46367&m=dev', {
  props: {
    caption: figma.boolean('caption?', {
      false: undefined,
      true: figma.children('Caption'),
    }),
    label: figma.children('Label'),
    labelProps: figma.nestedProps('FormControl.Label', {
      required: figma.boolean('required'),
    }),
    disabled: figma.enum('state', {
      disabled: true,
    }),
    checked: figma.boolean('checked?'),
  },
  example: ({disabled, label, caption, checked, labelProps}) => (
    <FormControl disabled={disabled} required={labelProps.required}>
      <Radio checked={checked} value="..." />
      {label}
      {caption}
    </FormControl>
  ),
})
