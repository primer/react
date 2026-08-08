import {useState, useRef, useCallback} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Dialog} from './ReadyMadeDialog'
import {Button} from '../../Button'
import Text from '../../Text'

/**
 * Layer 3 — Ready-made Dialog stories.
 *
 * The simplest API: a single `<Dialog>` component with props for
 * title, subtitle, footer buttons, and children as body content.
 */
const meta: Meta<typeof Dialog> = {
  title: 'Experimental/Dialog/ReadyMade',
  component: Dialog,
  parameters: {
    controls: {expanded: true},
  },
}

export default meta

// --- Default ---

export const Default: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <Button ref={buttonRef} onClick={() => setOpen(true)}>
          Open dialog
        </Button>

        <Dialog
          open={open}
          onClose={onClose}
          title="Ready-made Dialog"
          subtitle="The simplest API — just pass props."
          returnFocusRef={buttonRef}
          footerButtons={[
            {buttonType: 'default', content: 'Cancel', onClick: onClose},
            {buttonType: 'primary', content: 'Save', onClick: onClose},
          ]}
        >
          <Text as="p">
            This dialog is built with a single component. Title, subtitle, and footer buttons are all props.
          </Text>
        </Dialog>
      </>
    )
  },
}

// --- Alert Dialog ---

export const Alert: StoryObj = {
  name: 'Alert Dialog (destructive action)',
  render: () => {
    const [open, setOpen] = useState(false)
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete repository
        </Button>

        <Dialog
          open={open}
          onClose={onClose}
          title="Delete this repository?"
          subtitle="This action cannot be undone."
          role="alertdialog"
          width="small"
          footerButtons={[
            {buttonType: 'default', content: 'Cancel', onClick: onClose},
            {buttonType: 'danger', content: 'Delete', onClick: onClose, autoFocus: true},
          ]}
        >
          <Text as="p">
            Once deleted, all data including issues, pull requests, and actions will be permanently removed.
          </Text>
        </Dialog>
      </>
    )
  },
}

// --- No Footer ---

export const NoFooter: StoryObj = {
  name: 'Without footer buttons',
  render: () => {
    const [open, setOpen] = useState(false)
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open info dialog</Button>

        <Dialog open={open} onClose={onClose} title="Information">
          <Text as="p">This dialog has no footer buttons. Close it with the X button or press Escape.</Text>
        </Dialog>
      </>
    )
  },
}

// --- Side Sheet ---

export const SideSheet: StoryObj = {
  name: 'Position: Right (side sheet)',
  render: () => {
    const [open, setOpen] = useState(false)
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open side sheet</Button>

        <Dialog
          open={open}
          onClose={onClose}
          title="Settings"
          position="right"
          width="large"
          closeOnBackdropClick
          footerButtons={[{buttonType: 'primary', content: 'Done', onClick: onClose}]}
        >
          <Text as="p">A side sheet that slides in from the right. Click the backdrop to dismiss.</Text>
        </Dialog>
      </>
    )
  },
}

// --- Auto Focus Button ---

export const AutoFocusButton: StoryObj = {
  name: 'Auto-focus on footer button',
  render: () => {
    const [open, setOpen] = useState(false)
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <Button onClick={() => setOpen(true)}>Confirm action</Button>

        <Dialog
          open={open}
          onClose={onClose}
          title="Confirm"
          width="small"
          footerButtons={[
            {buttonType: 'default', content: 'Cancel', onClick: onClose},
            {buttonType: 'primary', content: 'Confirm', onClick: onClose, autoFocus: true},
          ]}
        >
          <Text as="p">The &ldquo;Confirm&rdquo; button receives focus automatically.</Text>
        </Dialog>
      </>
    )
  },
}
