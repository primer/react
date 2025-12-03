import {Label} from '../../src'
import figma from '@figma/code-connect'

figma.connect(Label, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=18959-65008&m=dev', {
  props: {
    text: figma.textContent('Label'),
    size: figma.enum('size', {
      small: 'small',
      large: 'large',
    }),
    variant: figma.enum('variant', {
      default: 'default',
      primary: 'primary',
      secondary: 'secondary',
      accent: 'accent',
      success: 'success',
      attention: 'attention',
      severe: 'severe',
      danger: 'danger',
      done: 'done',
      sponsors: 'sponsors',
    }),
  },
  example: ({size, variant, text}) => (
    <Label size={size} variant={variant}>
      {text}
    </Label>
  ),
})
