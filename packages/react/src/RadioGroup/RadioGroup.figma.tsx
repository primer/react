import {RadioGroup} from '../'
import figma from '@figma/code-connect'

const props = {
  Validation: figma.boolean('Validation'),
  validationProps: figma.nestedProps('Validation', {
    text: figma.string('Validation message'),
    variant: figma.enum('variant', {
      error: 'error',
      success: 'success',
    }),
  }),
  Caption: figma.boolean('Caption'),
  captionProps: figma.nestedProps('Caption', {
    text: figma.textContent('Caption'),
  }),
  Label: figma.boolean('Label'),
  labelProps: figma.nestedProps('Label', {
    text: figma.string('text'),
  }),
  children: figma.nestedProps('Items', {
    items: figma.children('*'),
  }),
}

figma.connect(RadioGroup, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38325-1047&m=dev', {
  props,
  example: ({labelProps, children}) => (
    <RadioGroup name="...">
      <RadioGroup.Label visuallyHidden>{labelProps.text}</RadioGroup.Label>
      {children.items}
    </RadioGroup>
  ),
})

figma.connect(RadioGroup, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38325-1047&m=dev', {
  props,
  variant: {Label: true, Caption: false, Validation: false},
  example: ({labelProps, children}) => (
    <RadioGroup name="...">
      <RadioGroup.Label>{labelProps.text}</RadioGroup.Label>
      {children.items}
    </RadioGroup>
  ),
})
figma.connect(RadioGroup, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38325-1047&m=dev', {
  props,
  variant: {Label: true, Caption: true, Validation: false},
  example: ({labelProps, captionProps, children}) => (
    <RadioGroup name="...">
      <RadioGroup.Label>{labelProps.text}</RadioGroup.Label>
      <RadioGroup.Caption>{captionProps.text}</RadioGroup.Caption>
      {children.items}
    </RadioGroup>
  ),
})

figma.connect(RadioGroup, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38325-1047&m=dev', {
  props,
  variant: {Label: true, Caption: false, Validation: true},
  example: ({labelProps, validationProps, children}) => (
    <RadioGroup name="...">
      <RadioGroup.Label>{labelProps.text}</RadioGroup.Label>
      {children.items}
      <RadioGroup.Validation variant={validationProps.variant}>{validationProps.text}</RadioGroup.Validation>
    </RadioGroup>
  ),
})
figma.connect(RadioGroup, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38325-1047&m=dev', {
  props,
  variant: {Label: true, Caption: true, Validation: true},
  example: ({labelProps, captionProps, validationProps, children}) => (
    <RadioGroup name="...">
      <RadioGroup.Label>{labelProps.text}</RadioGroup.Label>
      <RadioGroup.Caption>{captionProps.text}</RadioGroup.Caption>
      {children.items}
      <RadioGroup.Validation variant={validationProps.variant}>{validationProps.text}</RadioGroup.Validation>
    </RadioGroup>
  ),
})
