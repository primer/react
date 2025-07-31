import {BookIcon} from '@primer/octicons-react'
import React from 'react'
import {Blankslate} from '../Blankslate'
import {ConfirmationDialog} from '../ConfirmationDialog/ConfirmationDialog'

export default {
  title: 'Experimental/Components/Blankslate/Features',
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

export const WithPrimaryActionAsLink = () => (
  <Blankslate>
    <Blankslate.Visual>
      <BookIcon size="medium" />
    </Blankslate.Visual>
    <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
    <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
    <Blankslate.PrimaryAction href="#">Primary action</Blankslate.PrimaryAction>
  </Blankslate>
)

export const WithPrimaryActionAsButton = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const onDialogClose = React.useCallback(() => setIsOpen(false), [])

  return (
    <>
      <Blankslate>
        <Blankslate.Visual>
          <BookIcon size="medium" />
        </Blankslate.Visual>
        <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
        <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
        <Blankslate.PrimaryAction onClick={() => setIsOpen(true)}>Primary action</Blankslate.PrimaryAction>
      </Blankslate>
      {isOpen ? (
        <ConfirmationDialog
          title="Delete universe?"
          onClose={onDialogClose}
          confirmButtonContent="Delete it!"
          confirmButtonType="danger"
        >
          Deleting the universe could have disastrous effects, including but not limited to destroying all life on
          Earth.
        </ConfirmationDialog>
      ) : null}
    </>
  )
}

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
  <Blankslate border narrow>
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

export const SizeSmall = () => (
  <Blankslate border size="small">
    <Blankslate.Visual>
      <BookIcon size="medium" />
    </Blankslate.Visual>
    <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
    <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
    <Blankslate.PrimaryAction href="#">Primary action</Blankslate.PrimaryAction>
    <Blankslate.SecondaryAction href="#">Secondary action</Blankslate.SecondaryAction>
  </Blankslate>
)

export const SizeLarge = () => (
  <Blankslate size="large">
    <Blankslate.Visual>
      <BookIcon size="medium" />
    </Blankslate.Visual>
    <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
    <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
    <Blankslate.PrimaryAction href="#">Primary action</Blankslate.PrimaryAction>
    <Blankslate.SecondaryAction href="#">Secondary action</Blankslate.SecondaryAction>
  </Blankslate>
)
