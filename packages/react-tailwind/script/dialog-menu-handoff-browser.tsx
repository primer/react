import React from 'react'
import {createPortal} from 'react-dom'
import {createRoot} from 'react-dom/client'
import {ActionMenu} from '../src/components/ActionMenu'
import {Dialog} from '../src/components/Dialog'

export function Fixture({externalPortal, portalRoot}: {externalPortal: boolean; portalRoot: HTMLElement}) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [handoff, setHandoff] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const child = (
    <Dialog
      open={dialogOpen}
      onOpenChange={open => {
        setDialogOpen(open)
        if (!open) setHandoff(false)
      }}
    >
      <Dialog.Content finalFocus={triggerRef} initialFocus={textareaRef}>
        <Dialog.Title>Start session</Dialog.Title>
        <Dialog.Description>Enter a prompt.</Dialog.Description>
        <label>
          Prompt
          <textarea ref={textareaRef} />
        </label>
        <Dialog.Close>Close child</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  )

  return (
    <Dialog defaultOpen>
      <Dialog.Content>
        <Dialog.Title>Navigation</Dialog.Title>
        <Dialog.Description>Choose an item.</Dialog.Description>
        <ActionMenu modal={false}>
          <ActionMenu.Button ref={triggerRef}>Open menu</ActionMenu.Button>
          <ActionMenu.Content preventFocusOnClose={handoff}>
            <ActionMenu.Item
              onClick={() => {
                setHandoff(true)
                setDialogOpen(true)
              }}
            >
              Start a session
            </ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        {externalPortal ? createPortal(child, portalRoot) : child}
      </Dialog.Content>
    </Dialog>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  const portalRoot = document.getElementById('external-root')
  if (!root || !portalRoot) throw new Error('Missing fixture root')
  const params = new URLSearchParams(document.location.search)
  createRoot(root).render(<Fixture externalPortal={params.get('child') === 'external'} portalRoot={portalRoot} />)
}

mountFixture()
