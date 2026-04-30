import React, {useRef} from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {useDialogFoundation, type UseDialogFoundationOptions} from '..'

// Test harness that renders a dialog using the foundation hook
function TestDialog(props: UseDialogFoundationOptions & {children?: React.ReactNode}) {
  const {children, ...options} = props
  const foundation = useDialogFoundation(options)
  const dialogProps = foundation.getDialogProps()
  const titleProps = foundation.getTitleProps()
  const descriptionProps = foundation.getDescriptionProps()
  const closeProps = foundation.getCloseProps()
  const bodyProps = foundation.getBodyProps()

  return (
    <dialog {...dialogProps}>
      <h2 {...titleProps}>Test Title</h2>
      <p {...descriptionProps}>Test Description</p>
      <div {...bodyProps}>{children ?? 'Body content'}</div>
      <button {...closeProps}>Close</button>
    </dialog>
  )
}

describe('useDialogFoundation', () => {
  it('renders a dialog with correct ARIA attributes', () => {
    render(<TestDialog open={true} onClose={() => {}} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby')
    expect(dialog).toHaveAttribute('aria-describedby')
    expect(dialog).toHaveAttribute('data-dialog-foundation', '')
  })

  it('calls showModal when open is true', () => {
    render(<TestDialog open={true} onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    // Dialog should be open (showModal was called by the hook)
    expect(dialog).toHaveAttribute('open')
  })

  it('wires title id to aria-labelledby', () => {
    render(<TestDialog open={true} onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    const title = screen.getByText('Test Title')

    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id)
  })

  it('wires description id to aria-describedby', () => {
    render(<TestDialog open={true} onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    const description = screen.getByText('Test Description')

    expect(dialog.getAttribute('aria-describedby')).toBe(description.id)
  })

  it('calls onClose with "close-button" when close button is clicked', () => {
    const onClose = vi.fn()
    render(<TestDialog open={true} onClose={onClose} />)

    fireEvent.click(screen.getByText('Close'))
    expect(onClose).toHaveBeenCalledWith('close-button')
  })

  it('calls onClose with "escape" when cancel event fires', () => {
    const onClose = vi.fn()
    render(<TestDialog open={true} onClose={onClose} />)

    const dialog = screen.getByRole('dialog')
    const cancelEvent = new Event('cancel', {cancelable: true})
    dialog.dispatchEvent(cancelEvent)

    expect(onClose).toHaveBeenCalledWith('escape')
    expect(cancelEvent.defaultPrevented).toBe(true)
  })

  it('supports role="alertdialog"', () => {
    render(<TestDialog open={true} onClose={() => {}} role="alertdialog" />)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('sets aria-label when provided (no visible title)', () => {
    function AriaLabelDialog() {
      const foundation = useDialogFoundation({
        open: true,
        onClose: () => {},
        'aria-label': 'Confirm deletion',
      })
      const dialogProps = foundation.getDialogProps()
      return <dialog {...dialogProps}>Are you sure?</dialog>
    }

    render(<AriaLabelDialog />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-label', 'Confirm deletion')
  })

  it('body region has role="region" and aria-labelledby', () => {
    render(<TestDialog open={true} onClose={() => {}} />)
    const body = screen.getByRole('region')
    expect(body).toHaveAttribute('aria-labelledby')
    expect(body).toHaveAttribute('tabindex', '0')
  })

  it('supports initialFocusRef', () => {
    function DialogWithInitialFocus() {
      const inputRef = useRef<HTMLInputElement>(null)
      const foundation = useDialogFoundation({
        open: true,
        onClose: () => {},
        initialFocusRef: inputRef,
      })
      const dialogProps = foundation.getDialogProps()
      const titleProps = foundation.getTitleProps()

      return (
        <dialog {...dialogProps}>
          <h2 {...titleProps}>Title</h2>
          <input ref={inputRef} data-testid="focus-target" />
        </dialog>
      )
    }

    render(<DialogWithInitialFocus />)
    expect(screen.getByTestId('focus-target')).toHaveFocus()
  })

  it('restores focus to returnFocusRef on close', () => {
    function DialogWithReturnFocus() {
      const [open, setOpen] = React.useState(false)
      const buttonRef = useRef<HTMLButtonElement>(null)

      return (
        <>
          <button ref={buttonRef} onClick={() => setOpen(true)} data-testid="trigger">
            Open
          </button>
          <TestDialog open={open} onClose={() => setOpen(false)} returnFocusRef={buttonRef} />
        </>
      )
    }

    render(<DialogWithReturnFocus />)
    fireEvent.click(screen.getByTestId('trigger'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Close'))
    expect(screen.getByTestId('trigger')).toHaveFocus()
  })

  it('restores focus to previously-focused element when no returnFocusRef', () => {
    function DialogWithAutoRestore() {
      const [open, setOpen] = React.useState(false)

      return (
        <>
          <button onClick={() => setOpen(true)} data-testid="trigger">
            Open
          </button>
          <TestDialog open={open} onClose={() => setOpen(false)} />
        </>
      )
    }

    render(<DialogWithAutoRestore />)
    const trigger = screen.getByTestId('trigger')
    trigger.focus()
    fireEvent.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Close'))
    expect(trigger).toHaveFocus()
  })

  it('applies scroll lock when open', () => {
    const {unmount} = render(<TestDialog open={true} onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('handles nested scroll locks correctly', () => {
    function NestedDialogs() {
      return (
        <>
          <TestDialog open={true} onClose={() => {}} />
          <TestDialog open={true} onClose={() => {}} />
        </>
      )
    }

    const {unmount} = render(<NestedDialogs />)
    expect(document.body.style.overflow).toBe('hidden')

    // Unmounting removes both — scroll lock should be released
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('closes and reopens correctly', () => {
    function ReopenDialog() {
      const [open, setOpen] = React.useState(true)
      const buttonRef = useRef<HTMLButtonElement>(null)

      return (
        <>
          <button ref={buttonRef} onClick={() => setOpen(true)} data-testid="trigger">
            Open
          </button>
          <TestDialog open={open} onClose={() => setOpen(false)} returnFocusRef={buttonRef} />
        </>
      )
    }

    const {rerender} = render(<ReopenDialog />)
    expect(screen.getByRole('dialog')).toHaveAttribute('open')

    // Close
    fireEvent.click(screen.getByText('Close'))

    // Reopen
    fireEvent.click(screen.getByTestId('trigger'))
    expect(screen.getByRole('dialog')).toHaveAttribute('open')
  })

  it('warns in dev mode when no accessible name is provided', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    function NoNameDialog() {
      const foundation = useDialogFoundation({
        open: true,
        onClose: () => {},
      })
      const dialogProps = foundation.getDialogProps()
      return <dialog {...dialogProps}>Content</dialog>
    }

    render(<NoNameDialog />)

    // Wait for the queueMicrotask to flush
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No accessible name provided'))

    warnSpy.mockRestore()
  })
})
