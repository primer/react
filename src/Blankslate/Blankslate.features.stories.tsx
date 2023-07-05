import {BookIcon} from '@primer/octicons-react'
import React from 'react'
import {Blankslate} from '../Blankslate'

export default {
  title: 'Drafts/Components/Blankslate/Features',
  component: Blankslate,
  subcomponents: {
    'Blankslate.Visual': Blankslate.Visual,
    'Blankslate.Heading': Blankslate.Heading,
    'Blankslate.Description': Blankslate.Description,
    'Blankslate.PrimaryAction': Blankslate.PrimaryAction,
    'Blankslate.SecondaryAction': Blankslate.SecondaryAction,
  },
}

export const WithVisual = () => (
  <Blankslate>
    <Blankslate.Visual>
      <BookIcon size="medium" />
    </Blankslate.Visual>
    <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
    <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
  </Blankslate>
)

export const WithPrimaryAction = () => (
  <Blankslate>
    <Blankslate.Visual>
      <BookIcon size="medium" />
    </Blankslate.Visual>
    <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
    <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
    <Blankslate.PrimaryAction href="#">Primary action</Blankslate.PrimaryAction>
  </Blankslate>
)

export const WithSecondaryAction = () => (
  <Blankslate>
    <Blankslate.Visual>
      <BookIcon size="medium" />
    </Blankslate.Visual>
    <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
    <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
    <Blankslate.SecondaryAction href="#">Secondary action</Blankslate.SecondaryAction>
  </Blankslate>
)

export const WithBorder = () => (
  <Blankslate border>
    <Blankslate.Visual>
      <BookIcon size="medium" />
    </Blankslate.Visual>
    <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
    <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
  </Blankslate>
)

export const Narrow = () => (
  <Blankslate narrow>
    <Blankslate.Visual>
      <BookIcon size="medium" />
    </Blankslate.Visual>
    <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
    <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
  </Blankslate>
)

export const Spacious = () => (
  <Blankslate spacious>
    <Blankslate.Visual>
      <BookIcon size="medium" />
    </Blankslate.Visual>
    <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
    <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
  </Blankslate>
)
