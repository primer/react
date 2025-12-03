import {CheckboxGroup} from '../'
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
  labelProps: figma.nestedProps('FormControl.Label', {
    text: figma.textContent('Label'),
  }),
  children: figma.nestedProps('Items', {
    items: figma.children('*'),
  }),
}

figma.connect(CheckboxGroup, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38286%3A5208', {
  props,
  example: ({labelProps, children}) => (
    <CheckboxGroup>
      <CheckboxGroup.Label visuallyHidden>{labelProps.text}</CheckboxGroup.Label>
      {children.items}
    </CheckboxGroup>
  ),
})

figma.connect(CheckboxGroup, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38286%3A5208', {
  props,
  variant: {Label: true, Caption: false, Validation: false},
  example: ({labelProps, children}) => (
    <CheckboxGroup>
      <CheckboxGroup.Label>{labelProps.text}</CheckboxGroup.Label>
      {children.items}
    </CheckboxGroup>
  ),
})
figma.connect(CheckboxGroup, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38286%3A5208', {
  props,
  variant: {Label: true, Caption: true, Validation: false},
  example: ({labelProps, captionProps, children}) => (
    <CheckboxGroup>
      <CheckboxGroup.Label>{labelProps.text}</CheckboxGroup.Label>
      <CheckboxGroup.Caption>{captionProps.text}</CheckboxGroup.Caption>
      {children.items}
    </CheckboxGroup>
  ),
})

figma.connect(CheckboxGroup, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38286%3A5208', {
  props,
  variant: {Label: true, Caption: false, Validation: true},
  example: ({labelProps, validationProps, children}) => (
    <CheckboxGroup>
      <CheckboxGroup.Label>{labelProps.text}</CheckboxGroup.Label>
      {children.items}
      <CheckboxGroup.Validation variant={validationProps.variant}>{validationProps.text}</CheckboxGroup.Validation>
    </CheckboxGroup>
  ),
})
figma.connect(CheckboxGroup, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38286%3A5208', {
  props,
  variant: {Label: true, Caption: true, Validation: true},
  example: ({labelProps, captionProps, validationProps, children}) => (
    <CheckboxGroup>
      <CheckboxGroup.Label>{labelProps.text}</CheckboxGroup.Label>
      <CheckboxGroup.Caption>{captionProps.text}</CheckboxGroup.Caption>
      {children.items}
      <CheckboxGroup.Validation variant={validationProps.variant}>{validationProps.text}</CheckboxGroup.Validation>
    </CheckboxGroup>
  ),
})
