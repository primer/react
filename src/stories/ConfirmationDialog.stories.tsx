import React, {useState, useRef, useCallback} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Button, Flex, ThemeProvider, useTheme} from '..'
import {ConfirmationDialog, useConfirm} from '../Dialog/ConfirmationDialog'
import {ActionMenu} from '../ActionMenu'

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
          confirmButtonContent="Delete it!"
          confirmButtonType="danger"
        >
          Deleting the universe could have disastrous effects, including but not limited to destroying all life on
          Earth.
        </ConfirmationDialog>
      )}
    </>
  )
}

export const ShorthandHook = () => {
  const confirm = useConfirm()
  const {theme} = useTheme()
  const onButtonClick = useCallback(
    async (event: React.MouseEvent) => {
      if (
        (await confirm({title: 'Are you sure?', content: 'Do you really want to turn this button green?'})) &&
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

export const ShorthandHookFromActionMenu = () => {
  const confirm = useConfirm()
  const [text, setText] = useState('open me')
  const onButtonClick = useCallback(async () => {
    if (await confirm({title: 'Are you sure?', content: 'Do you really want to do a trick?'})) {
      setText('tada!')
    }
  }, [confirm])

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <ActionMenu
        renderAnchor={props => <Button {...props}>{text}</Button>}
        items={[
          {
            text: 'Do a trick!',
            onAction: onButtonClick
          }
        ]}
      />
    </Flex>
  )
}
