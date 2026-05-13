import {useState, useRef, useCallback} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useDialog} from '../../foundations/experimental/Dialog'

/**
 * Layer 3 — Foundation stories.
 *
 * These demonstrate `useDialog`, the compound hook that returns
 * prop-getters. The consumer owns **all** markup and styling — the hook
 * provides only behavior and ARIA wiring.
 */
const meta: Meta = {
  title: 'Experimental/Dialog/Foundation',
  parameters: {
    controls: {expanded: true},
  },
}

export default meta

// Minimal inline styles so the stories are readable without Primer CSS
const overlayStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 12,
  padding: 0,
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  maxWidth: 480,
  width: '100%',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid #d1d9e0',
}

const bodyStyle: React.CSSProperties = {
  padding: 16,
}

// --- Default ---

export const Default: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const onClose = useCallback(() => setOpen(false), [])
    const foundation = useDialog({
      open,
      onClose,
      returnFocusRef: buttonRef,
    })

    const dialogProps = foundation.getDialogProps()
    const titleProps = foundation.getTitleProps()
    const descriptionProps = foundation.getDescriptionProps()
    const closeProps = foundation.getCloseProps()
    const bodyProps = foundation.getBodyProps()

    return (
      <>
        <button ref={buttonRef} onClick={() => setOpen(true)}>
          Open foundation dialog
        </button>

        <dialog {...dialogProps} style={overlayStyle}>
          <div style={headerStyle}>
            <h2 {...titleProps} style={{margin: 0, fontSize: 14, fontWeight: 600}}>
              Foundation Dialog
            </h2>
            <button {...closeProps}>✕</button>
          </div>
          <p {...descriptionProps} style={{padding: '0 16px', color: '#656d76', fontSize: 12}}>
            This dialog is built entirely with consumer-owned markup.
          </p>
          <div {...bodyProps} style={bodyStyle}>
            <p>
              The <code>useDialog</code> hook provides prop-getters that wire up ARIA attributes, focus
              management, scroll lock, and controlled close — but zero UI.
            </p>
          </div>
        </dialog>
      </>
    )
  },
}

// --- AlertDialog ---

export const AlertDialog: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const onClose = useCallback(() => setOpen(false), [])
    const foundation = useDialog({
      open,
      onClose,
      role: 'alertdialog',
      returnFocusRef: buttonRef,
    })

    const dialogProps = foundation.getDialogProps()
    const titleProps = foundation.getTitleProps()
    const descriptionProps = foundation.getDescriptionProps()

    return (
      <>
        <button ref={buttonRef} onClick={() => setOpen(true)}>
          Delete item
        </button>

        <dialog {...dialogProps} style={overlayStyle}>
          <div style={{padding: 16}}>
            <h2 {...titleProps} style={{margin: '0 0 8px', fontSize: 14, fontWeight: 600}}>
              Are you sure?
            </h2>
            <p {...descriptionProps} style={{margin: '0 0 16px', color: '#656d76'}}>
              This action cannot be undone. This will permanently delete this item.
            </p>
            <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end'}}>
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button
                onClick={() => setOpen(false)}
                style={{background: '#cf222e', color: 'white', border: 'none', borderRadius: 6, padding: '5px 16px'}}
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
      </>
    )
  },
}

// --- With Backdrop Click ---

export const WithBackdropClick: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [lastGesture, setLastGesture] = useState<string>('')
    const buttonRef = useRef<HTMLButtonElement>(null)

    const onClose = useCallback((gesture: string) => {
      setLastGesture(gesture)
      setOpen(false)
    }, [])

    const foundation = useDialog({
      open,
      onClose,
      closeOnBackdropClick: true,
      returnFocusRef: buttonRef,
    })

    const dialogProps = foundation.getDialogProps()
    const titleProps = foundation.getTitleProps()
    const bodyProps = foundation.getBodyProps()
    const closeProps = foundation.getCloseProps()

    return (
      <>
        <div>
          <button ref={buttonRef} onClick={() => setOpen(true)}>
            Open dialog (backdrop click enabled)
          </button>
          {lastGesture && (
            <p>
              Last close gesture: <code>{lastGesture}</code>
            </p>
          )}
        </div>

        <dialog {...dialogProps} style={overlayStyle}>
          <div style={headerStyle}>
            <h2 {...titleProps} style={{margin: 0, fontSize: 14, fontWeight: 600}}>
              Backdrop Click Demo
            </h2>
            <button {...closeProps}>✕</button>
          </div>
          <div {...bodyProps} style={bodyStyle}>
            <p>Click the backdrop (outside this dialog) to close. The gesture will be reported.</p>
          </div>
        </dialog>
      </>
    )
  },
}
