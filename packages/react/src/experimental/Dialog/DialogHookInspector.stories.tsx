import {useState, useRef, useCallback, type PropsWithChildren} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useDialog, type UseDialogOptions, type UseDialogReturn} from '../../foundations/experimental/Dialog'

/**
 * Hook Inspector — useDialog
 *
 * These stories document the hook's contract: what goes in, what comes out,
 * and how the return values change as you interact. The dialog itself is
 * rendered with minimal inline styles — the point is the hook, not the UI.
 */
const meta: Meta = {
  title: 'Experimental/Dialog/Hook Inspector',
  parameters: {
    controls: {expanded: true},
  },
}

export default meta

// --- Rendering controls (remount/rerender) ---

function RenderingControls({children}: PropsWithChildren) {
  const [key, setKey] = useState(1)
  const [, setRerender] = useState(1)

  return (
    <div key={key}>
      {children}
      <hr style={{margin: '16px 0'}} />
      <div style={{display: 'flex', gap: 8}}>
        <button onClick={() => setRerender(x => x + 1)}>Rerender Hook</button>
        <button onClick={() => setKey(x => x + 1)}>Remount Hook</button>
      </div>
    </div>
  )
}

// --- Prop getter inspector ---

function PropGetterInspector({foundation}: {foundation: UseDialogReturn}) {
  const dialogProps = foundation.getDialogProps()
  const titleProps = foundation.getTitleProps()
  const descriptionProps = foundation.getDescriptionProps()
  const closeProps = foundation.getCloseProps()
  const bodyProps = foundation.getBodyProps()

  // Strip the ref and onClick (not serialisable) for display
  const {ref: _ref, onClick: _onClick, ...displayDialogProps} = dialogProps

  return (
    <div style={{fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6}}>
      <h3 style={{fontSize: 14, margin: '0 0 8px'}}>Hook return value</h3>
      <pre style={{background: '#f6f8fa', padding: 12, borderRadius: 6, overflow: 'auto'}}>
        <code>
          {JSON.stringify(
            {
              isOpen: foundation.isOpen,
              'getDialogProps()': {...displayDialogProps, ref: '[RefCallback]', onClick: '[Function]'},
              'getTitleProps()': titleProps,
              'getDescriptionProps()': descriptionProps,
              'getCloseProps()': {...closeProps, onClick: '[Function]'},
              'getBodyProps()': bodyProps,
            },
            null,
            2,
          )}
        </code>
      </pre>
    </div>
  )
}

// --- Minimal dialog rendering ---

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

// --- Story: Default (inspect all prop-getters) ---

export const Default: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [lastGesture, setLastGesture] = useState<string>('(none)')
    const buttonRef = useRef<HTMLButtonElement>(null)

    const onClose = useCallback((gesture: string) => {
      setLastGesture(gesture)
      setOpen(false)
    }, [])

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
      <RenderingControls>
        <div style={{display: 'flex', gap: 16, alignItems: 'flex-start'}}>
          <div style={{flex: '0 0 auto'}}>
            <button ref={buttonRef} onClick={() => setOpen(true)}>
              Open dialog
            </button>
            <p style={{fontSize: 12, color: '#656d76', marginTop: 8}}>
              Last close gesture: <code>{lastGesture}</code>
            </p>
          </div>

          <PropGetterInspector foundation={foundation} />
        </div>

        <dialog {...dialogProps} style={overlayStyle}>
          <div style={headerStyle}>
            <h2 {...titleProps} style={{margin: 0, fontSize: 14, fontWeight: 600}}>
              Dialog Title
            </h2>
            <button {...closeProps}>✕</button>
          </div>
          <p {...descriptionProps} style={{padding: '0 16px', color: '#656d76', fontSize: 12}}>
            This is the description, wired to aria-describedby.
          </p>
          <div {...bodyProps} style={{padding: 16}}>
            <p>Body content. Check the inspector panel to see what each prop-getter returns.</p>
          </div>
        </dialog>
      </RenderingControls>
    )
  },
}

// --- Story: ARIA wiring (with vs without title) ---

export const AriaLabelFallback: StoryObj = {
  name: 'aria-label fallback (no visible title)',
  render: () => {
    const [open, setOpen] = useState(false)

    const foundation = useDialog({
      open,
      onClose: () => setOpen(false),
      'aria-label': 'Confirm deletion',
    })

    const dialogProps = foundation.getDialogProps()
    const closeProps = foundation.getCloseProps()

    return (
      <RenderingControls>
        <button onClick={() => setOpen(true)}>Open (no visible title)</button>
        <PropGetterInspector foundation={foundation} />

        <dialog {...dialogProps} style={overlayStyle}>
          <div style={{padding: 16}}>
            <p>
              This dialog has no visible title — it uses <code>aria-label</code> instead.
            </p>
            <p style={{fontSize: 12, color: '#656d76'}}>
              Check the inspector: <code>aria-label</code> is set, <code>aria-labelledby</code> still points to a
              generated ID but no element uses it.
            </p>
            <button {...closeProps}>Close</button>
          </div>
        </dialog>
      </RenderingControls>
    )
  },
}

// --- Story: Backdrop click ---

export const BackdropClick: StoryObj = {
  name: 'closeOnBackdropClick behaviour',
  render: () => {
    const [open, setOpen] = useState(false)
    const [gestures, setGestures] = useState<string[]>([])

    const onClose = useCallback((gesture: string) => {
      setGestures(prev => [...prev, gesture])
      setOpen(false)
    }, [])

    const foundation = useDialog({
      open,
      onClose,
      closeOnBackdropClick: true,
    })

    const dialogProps = foundation.getDialogProps()
    const titleProps = foundation.getTitleProps()
    const closeProps = foundation.getCloseProps()

    return (
      <RenderingControls>
        <button onClick={() => setOpen(true)}>Open (backdrop click enabled)</button>

        <div style={{marginTop: 8}}>
          <p style={{fontSize: 12, fontFamily: 'monospace'}}>
            Close gesture log: [{gestures.map(g => `"${g}"`).join(', ')}]
          </p>
        </div>

        <PropGetterInspector foundation={foundation} />

        <dialog {...dialogProps} style={overlayStyle}>
          <div style={headerStyle}>
            <h2 {...titleProps} style={{margin: 0, fontSize: 14, fontWeight: 600}}>
              Backdrop Click Demo
            </h2>
            <button {...closeProps}>✕</button>
          </div>
          <div style={{padding: 16}}>
            <p>Try closing via: Escape, close button, or clicking the backdrop.</p>
            <p style={{fontSize: 12, color: '#656d76'}}>Each gesture is logged below the trigger button.</p>
          </div>
        </dialog>
      </RenderingControls>
    )
  },
}

// --- Story: alertdialog role ---

export const AlertDialogRole: StoryObj = {
  name: 'role="alertdialog"',
  render: () => {
    const [open, setOpen] = useState(false)

    const foundation = useDialog({
      open,
      onClose: () => setOpen(false),
      role: 'alertdialog',
    })

    const dialogProps = foundation.getDialogProps()
    const titleProps = foundation.getTitleProps()
    const descriptionProps = foundation.getDescriptionProps()

    return (
      <RenderingControls>
        <button onClick={() => setOpen(true)}>Open alert dialog</button>
        <PropGetterInspector foundation={foundation} />

        <dialog {...dialogProps} style={overlayStyle}>
          <div style={{padding: 16}}>
            <h2 {...titleProps} style={{margin: '0 0 8px', fontSize: 14, fontWeight: 600}}>
              Are you sure?
            </h2>
            <p {...descriptionProps} style={{margin: '0 0 16px', color: '#656d76'}}>
              This action cannot be undone.
            </p>
            <p style={{fontSize: 12, color: '#656d76'}}>
              Check the inspector: <code>role</code> is now <code>"alertdialog"</code>.
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
      </RenderingControls>
    )
  },
}

// --- Story: Initial focus ref ---

export const InitialFocusRef: StoryObj = {
  name: 'initialFocusRef',
  render: () => {
    const [open, setOpen] = useState(false)
    const cancelRef = useRef<HTMLButtonElement>(null)

    const foundation = useDialog({
      open,
      onClose: () => setOpen(false),
      initialFocusRef: cancelRef,
    })

    const dialogProps = foundation.getDialogProps()
    const titleProps = foundation.getTitleProps()

    return (
      <RenderingControls>
        <button onClick={() => setOpen(true)}>Open (focus on Cancel)</button>
        <PropGetterInspector foundation={foundation} />

        <dialog {...dialogProps} style={overlayStyle}>
          <div style={{padding: 16}}>
            <h2 {...titleProps} style={{margin: '0 0 16px', fontSize: 14, fontWeight: 600}}>
              Focus Test
            </h2>
            <p style={{marginBottom: 16}}>The Cancel button should receive focus on open.</p>
            <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end'}}>
              <button ref={cancelRef}>Cancel</button>
              <button
                style={{background: '#cf222e', color: 'white', border: 'none', borderRadius: 6, padding: '5px 16px'}}
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
      </RenderingControls>
    )
  },
}
