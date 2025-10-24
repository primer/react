import {useCallback, useRef, useState} from 'react'
import type {Meta} from '@storybook/react-vite'
import {Button} from '..'
import {ConfirmationDialog} from './ConfirmationDialog'

export default {
  title: 'Components/ConfirmationDialog',
  component: ConfirmationDialog,
} as Meta

export const Default = () => {
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

interface PlaygroundProps {
  open: boolean
}

export const Playground = ({open, ...args}: PlaygroundProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Show dialog
      </Button>
      {(isOpen || open) && (
        <ConfirmationDialog
          {...args}
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

Playground.args = {
  open: false,
}

Playground.argTypes = {
  open: {
    control: {
      type: 'boolean',
    },
  },
  title: {
    control: {
      type: 'text',
    },
  },
  cancelButtonContent: {
    control: {
      type: 'text',
    },
  },
  confirmButtonContent: {
    control: {
      type: 'text',
    },
  },
}
