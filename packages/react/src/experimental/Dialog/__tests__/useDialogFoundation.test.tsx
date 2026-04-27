import type React from 'react'
import {useRef} from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {useDialogFoundation, type UseDialogFoundationOptions} from '../../../foundations/experimental/Dialog'

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
})
