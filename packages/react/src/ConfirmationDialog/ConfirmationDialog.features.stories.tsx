import React, {useState, useCallback} from 'react'
import type {Meta} from '@storybook/react'
import {Box, useTheme} from '..'
import {Button} from '../Button'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {ConfirmationDialog, useConfirm} from './ConfirmationDialog'

export default {
  title: 'Components/ConfirmationDialog/Features',
  component: ConfirmationDialog,
} as Meta<typeof ConfirmationDialog>

export const ShorthandHook = () => {
  const confirm = useConfirm()
  const {theme} = useTheme()
  const onButtonClick = useCallback(
    async (event: React.MouseEvent) => {
      if (
        (await confirm({title: 'Are you sure?', content: 'Do you really want to turn this button green?'})) &&
        event.target instanceof HTMLElement
      ) {
        event.target.style.color = theme?.colors.success.fg ?? 'green'
        event.target.textContent = "I'm green!"
      }
    },
    [confirm, theme],
  )
  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <Button onClick={onButtonClick} sx={{mb: 2}}>
        Turn me green!
      </Button>
      <Button onClick={onButtonClick} sx={{mb: 2}}>
        Turn me green!
      </Button>
      <Button onClick={onButtonClick} sx={{mb: 2}}>
        Turn me green!
      </Button>
      <Button onClick={onButtonClick} sx={{mb: 2}}>
        Turn me green!
      </Button>
    </Box>
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
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <ActionMenu>
        <ActionMenu.Button>{text}</ActionMenu.Button>

        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Item onSelect={onButtonClick}>Do a trick!</ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </Box>
  )
}
