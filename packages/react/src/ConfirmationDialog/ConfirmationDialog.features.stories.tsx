import type React from 'react'
import {useState, useCallback} from 'react'
import type {Meta} from '@storybook/react-vite'
import {useTheme} from '..'
import {Button} from '../Button'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {ConfirmationDialog, useConfirm} from './ConfirmationDialog'
import classes from './ConfirmationDialog.features.stories.module.css'

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
    <div className={classes.ButtonContainer}>
      <Button onClick={onButtonClick} className={classes.TurnGreenButton}>
        Turn me green!
      </Button>
      <Button onClick={onButtonClick} className={classes.TurnGreenButton}>
        Turn me green!
      </Button>
      <Button onClick={onButtonClick} className={classes.TurnGreenButton}>
        Turn me green!
      </Button>
      <Button onClick={onButtonClick} className={classes.TurnGreenButton}>
        Turn me green!
      </Button>
    </div>
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
    <div className={classes.ButtonContainer}>
      <ActionMenu>
        <ActionMenu.Button>{text}</ActionMenu.Button>
        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Item onSelect={onButtonClick}>Do a trick!</ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </div>
  )
}

export const LoadingStates = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false)
  const [isCancelLoading, setIsCancelLoading] = useState(false)

  const handleConfirm = useCallback(() => {
    setIsConfirmLoading(true)
    // Simulate async operation
    setTimeout(() => {
      setIsConfirmLoading(false)
      setIsOpen(false)
    }, 2000)
  }, [])

  const handleCancel = useCallback(() => {
    setIsCancelLoading(true)
    // Simulate async operation
    setTimeout(() => {
      setIsCancelLoading(false)
      setIsOpen(false)
    }, 1500)
  }, [])

  const handleClose = useCallback(
    (gesture: 'confirm' | 'close-button' | 'cancel' | 'escape') => {
      if (gesture === 'confirm') {
        handleConfirm()
      } else if (gesture === 'cancel') {
        handleCancel()
      } else {
        setIsOpen(false)
      }
    },
    [handleConfirm, handleCancel],
  )

  return (
    <div className={classes.ButtonContainer}>
      <Button onClick={() => setIsOpen(true)}>Show Loading Dialog</Button>
      {isOpen && (
        <ConfirmationDialog
          title="Delete this file?"
          confirmButtonType="danger"
          confirmButtonContent="Delete"
          confirmButtonLoading={isConfirmLoading}
          cancelButtonLoading={isCancelLoading}
          onClose={handleClose}
        >
          This action cannot be undone. The file will be permanently deleted from your repository.
        </ConfirmationDialog>
      )}
    </div>
  )
}
