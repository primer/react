import React, {useState, useCallback, useRef} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Button, Box, ThemeProvider, useTheme} from '..'
import {AlertDialog, useAlert} from '../Dialog/AlertDialog'
import {ActionMenu} from '../ActionMenu'

export default {
  title: 'Internal components/AlertDialog',
  component: AlertDialog,
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

export const BasicAlertDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Show dialog
      </Button>
      {isOpen && (
        <AlertDialog title="Delete universe?" onClose={onDialogClose} confirmButtonContent="OK">
          Deleting the universe could have disastrous effects, including but not limited to destroying all life on
          Earth.
        </AlertDialog>
      )}
    </>
  )
}

export const ShorthandHook = () => {
  const alert = useAlert()
  const {theme} = useTheme()
  const onButtonClick = useCallback(
    async (event: React.MouseEvent) => {
      if (
        (await alert({title: 'Are you sure?', content: 'Do you really want to turn this button green?'})) &&
        event.target instanceof HTMLElement
      ) {
        event.target.style.backgroundColor = theme?.colors.auto.green[3] ?? 'green'
        event.target.textContent = "I'm green!"
      }
    },
    [alert, theme]
  )
  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
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
    </Box>
  )
}

export const ShorthandHookFromActionMenu = () => {
  const alert = useAlert()
  const [text, setText] = useState('open me')
  const onButtonClick = useCallback(async () => {
    if (
      await alert({title: 'Are you sure?', content: 'Do you really want to do a trick?', confirmButtonContent: 'OK'})
    ) {
      setText('tada!')
    }
  }, [alert])

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <ActionMenu
        renderAnchor={props => <Button {...props}>{text}</Button>}
        items={[
          {
            text: 'Do a trick!',
            onAction: onButtonClick
          }
        ]}
      />
    </Box>
  )
}
