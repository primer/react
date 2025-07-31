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
  PrimaryAction: figma.children('_BlankSlate.PrimaryAction'),
  SecondaryActionText: figma.boolean('SecondaryAction?', {
    true: figma.textContent('Secondary action link'),
    false: undefined,
  }),
}

figma.connect(Blankslate, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=4398-2383&m=dev', {
  props,
  variant: {'SecondaryAction?': 'true'},
  example: ({leadingVisual, border, spacious, size, description, heading, SecondaryActionText, PrimaryAction}) => (
    <Blankslate border={border} spacious={spacious} size={size}>
      <Blankslate.Visual>{leadingVisual.item}</Blankslate.Visual>
      <Blankslate.Heading>{heading}</Blankslate.Heading>
      <Blankslate.Description>{description}</Blankslate.Description>
      <Blankslate.SecondaryAction href="">{SecondaryActionText}</Blankslate.SecondaryAction>
      {PrimaryAction}
    </Blankslate>
  ),
})
figma.connect(Blankslate, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=4398-2383&m=dev', {
  props,
  variant: {'SecondaryAction?': 'false'},
  example: ({leadingVisual, border, spacious, size, description, heading, PrimaryAction}) => (
    <Blankslate border={border} spacious={spacious} size={size}>
      <Blankslate.Visual>{leadingVisual.item}</Blankslate.Visual>
      <Blankslate.Heading>{heading}</Blankslate.Heading>
      <Blankslate.Description>{description}</Blankslate.Description>
      {PrimaryAction}
    </Blankslate>
  ),
})

figma.connect(
  Blankslate,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=40491-3841&t=5mMfBZbhHgyouYtk-4',
  {
    props: {
      PrimaryAction: figma.nestedProps('Primary action', {
        text: figma.textContent('Button'),
        icon: figma.children('icon'),
        variant: figma.enum('variant', {
          primary: 'primary',
          secondary: 'secondary',
          danger: 'danger',
          invisible: 'invisible',
        }),
      }),
    },
    example: ({PrimaryAction}) => (
      <Blankslate.PrimaryAction href="">
        {PrimaryAction.icon}
        {PrimaryAction.text}
      </Blankslate.PrimaryAction>
    ),
  },
)
