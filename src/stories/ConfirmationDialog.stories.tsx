import React, {useState, useRef, useCallback} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Button, ButtonDanger, Flex, ThemeProvider, useTheme} from '..'
import {ConfirmationDialog, useConfirm} from '../Dialog/ConfirmationDialog'

export default {
  title: 'Internal components/ConfirmationDialog',
  component: ConfirmationDialog,
  decorators: [
    Story => {
      // Since portal roots are registered globally, we need this line so that each storybook
      // story works in isolation.
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

export const BasicConfirmationDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Show dialog
      </Button>
      {isOpen && (
        <ConfirmationDialog
          title="Delete universe?"
          onClose={onDialogClose}
          confirmButtonLabel="Delete it!"
          confirmButtonType={ButtonDanger}
        >
          Deleting the universe could have disastrous effects, including but not limited to destroying all life on
          Earth.
        </ConfirmationDialog>
      )}
    </>
  )
}

export const ShorthandConfirmation = () => {
  const confirm = useConfirm()
  const {theme} = useTheme()
  const onButtonClick = useCallback(
    async (event: React.MouseEvent) => {
      if (
        (await confirm({title: 'Are you sure?', description: 'Do you really want to turn this button green?'})) &&
        event.target instanceof HTMLElement
      ) {
        event.target.style.backgroundColor = theme?.colors.auto.green[3] ?? 'green'
        event.target.textContent = "I'm green!"
      }
    },
    [confirm, theme]
  )
  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <Button mb={2} onClick={onButtonClick}>
        Turn me green!
      </Button>
      <Button mb={2} onClick={onButtonClick}>
        Turn me green!
      </Button>
      <Button mb={2} onClick={onButtonClick}>
        Turn me green!
      </Button>
      <Button mb={2} onClick={onButtonClick}>
        Turn me green!
      </Button>
    </Flex>
  )
}
