import {Blankslate} from '../Blankslate'
import figma from '@figma/code-connect'

const props = {
  leadingVisual: figma.nestedProps('_BlankslateVisual', {
    item: figma.children('leadingVisual'),
  }),
  size: figma.enum('size', {
    small: 'small',
    medium: 'medium',
    large: 'large',
  }),
  spacious: figma.boolean('spacious'),
  border: figma.boolean('border'),
  heading: figma.textContent('Text: Heading'),
  description: figma.textContent('Text: Description'),
  primaryAction: figma.nestedProps('Primary action', {
    text: figma.textContent('Button'),
  }),
  secondaryAction: figma.textContent('Secondary action link'),
  'primaryAction?': figma.boolean('primaryAction?'),
}

figma.connect(Blankslate, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=4398-2383&m=dev', {
  props,
  variant: {'primaryAction?': 'false', 'secondaryAction?': 'false'},
  example: ({leadingVisual, border, spacious, size, description, heading}) => (
    <Blankslate border={border} spacious={spacious} size={size}>
      <Blankslate.Visual>{leadingVisual.item}</Blankslate.Visual>
      <Blankslate.Heading>{heading}</Blankslate.Heading>
      <Blankslate.Description>{description}</Blankslate.Description>
    </Blankslate>
  ),
})
figma.connect(Blankslate, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=4398-2383&m=dev', {
  props,
  variant: {'primaryAction?': 'true', 'secondaryAction?': 'false'},
  example: ({leadingVisual, border, spacious, size, description, heading, primaryAction}) => (
    <Blankslate border={border} spacious={spacious} size={size}>
      <Blankslate.Visual>{leadingVisual.item}</Blankslate.Visual>
      <Blankslate.Heading>{heading}</Blankslate.Heading>
      <Blankslate.Description>{description}</Blankslate.Description>
      <Blankslate.PrimaryAction href="">{primaryAction.text}</Blankslate.PrimaryAction>
    </Blankslate>
  ),
})
figma.connect(Blankslate, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=4398-2383&m=dev', {
  props,
  variant: {'primaryAction?': 'true', 'secondaryAction?': 'true'},
  example: ({leadingVisual, border, spacious, size, description, heading, primaryAction, secondaryAction}) => (
    <Blankslate border={border} spacious={spacious} size={size}>
      <Blankslate.Visual>{leadingVisual.item}</Blankslate.Visual>
      <Blankslate.Heading>{heading}</Blankslate.Heading>
      <Blankslate.Description>{description}</Blankslate.Description>
      <Blankslate.PrimaryAction href="">{primaryAction.text}</Blankslate.PrimaryAction>
      <Blankslate.SecondaryAction href="">{secondaryAction}</Blankslate.SecondaryAction>
    </Blankslate>
  ),
})
figma.connect(Blankslate, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=4398-2383&m=dev', {
  props,
  variant: {'primaryAction?': 'false', 'secondaryAction?': 'true'},
  example: ({leadingVisual, border, spacious, size, description, heading, secondaryAction}) => (
    <Blankslate border={border} spacious={spacious} size={size}>
      <Blankslate.Visual>{leadingVisual.item}</Blankslate.Visual>
      <Blankslate.Heading>{heading}</Blankslate.Heading>
      <Blankslate.Description>{description}</Blankslate.Description>
      <Blankslate.SecondaryAction href="">{secondaryAction}</Blankslate.SecondaryAction>
    </Blankslate>
  ),
})
