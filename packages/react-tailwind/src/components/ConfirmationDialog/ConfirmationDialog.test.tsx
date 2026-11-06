import React from 'react'
import {cleanup, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {ConfirmationDialog} from './ConfirmationDialog'

describe('ConfirmationDialog', () => {
  afterEach(cleanup)

  it('exposes its composable parts on the configuration component', () => {
    expect(ConfirmationDialog.Root).toBeDefined()
    expect(ConfirmationDialog.Content).toBeDefined()
    expect(ConfirmationDialog.Portal).toBeDefined()
  })

  it('uses alert dialog semantics and focuses cancel for dangerous actions', async () => {
    const user = userEvent.setup()
    render(
      <ConfirmationDialog
        dangerous
        title="Delete repository?"
        description="This cannot be undone."
        trigger={<button type="button">Delete</button>}
      />,
    )
    await user.click(screen.getByRole('button', {name: 'Delete'}))
    expect(screen.getByRole('alertdialog', {name: 'Delete repository?'})).toHaveAccessibleDescription(
      'This cannot be undone.',
    )
    expect(screen.getByRole('alertdialog', {name: 'Delete repository?'})).toHaveClass('bg-[var(--overlay-bgColor)]')
    await waitFor(() => expect(screen.getByRole('button', {name: 'Cancel'})).toHaveFocus())
  })

  it('defaults to the medium Primer dialog width and accepts dialog sizes', () => {
    const {rerender} = render(<ConfirmationDialog open title="Continue?" />)
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('data-width', 'medium')
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveClass('w-[320px]', 'h-auto')

    rerender(<ConfirmationDialog height="small" open title="Continue?" width="large" />)
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('data-width', 'large')
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('data-height', 'small')
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveClass('w-[480px]', 'h-[480px]')
  })

  it('supports controlled state and confirms through its action', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const onConfirm = vi.fn()
    render(<ConfirmationDialog open onOpenChange={onOpenChange} onConfirm={onConfirm} title="Continue?" />)
    await user.click(screen.getByRole('button', {name: 'Confirm'}))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.objectContaining({reason: 'close-press'}))
  })

  it('keeps loading and disabled confirmation actions unavailable', () => {
    render(<ConfirmationDialog defaultOpen confirmButtonDisabled confirmButtonLoading title="Continue?" />)
    expect(screen.getByRole('button', {name: /confirm/i})).toBeDisabled()
    expect(screen.getByRole('button', {name: /confirm/i})).toHaveAttribute('aria-busy', 'true')
  })

  it('forwards popup refs and restores focus after escape', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    render(<ConfirmationDialog ref={ref} title="Continue?" trigger={<button type="button">Open</button>} />)
    const trigger = screen.getByRole('button', {name: 'Open'})
    await user.click(trigger)
    expect(ref.current).toHaveAttribute('data-component', 'ConfirmationDialog.Content')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('dismisses when pressing outside, like Primer Dialog', async () => {
    const user = userEvent.setup()
    render(
      <>
        <ConfirmationDialog title="Continue?" trigger={<button type="button">Open</button>} />
      </>,
    )

    await user.click(screen.getByRole('button', {name: 'Open'}))
    await user.click(document.querySelector('[data-component="ConfirmationDialog.Backdrop"]')!)

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('calls onCancel once for each dismissal path and never for confirmation', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <ConfirmationDialog
        title="Continue?"
        onCancel={onCancel}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        trigger={<button type="button">Open</button>}
      />,
    )
    const open = async () => {
      await user.click(screen.getByRole('button', {name: 'Open'}))
      await screen.findByRole('alertdialog')
    }

    await open()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({reason: 'escape-key'}))

    await open()
    await user.click(document.querySelector('[data-component="ConfirmationDialog.Backdrop"]')!)
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(onCancel).toHaveBeenCalledTimes(2)

    await open()
    await user.click(screen.getByRole('button', {name: 'Cancel'}))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(onCancel).toHaveBeenCalledTimes(3)

    await open()
    await user.click(screen.getByRole('button', {name: 'Confirm'}))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(onCancel).toHaveBeenCalledTimes(3)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('does not call onCancel when the consumer cancels the close', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <ConfirmationDialog
        defaultOpen
        title="Continue?"
        onCancel={onCancel}
        onOpenChange={(_open, details) => details.cancel()}
      />,
    )

    await screen.findByRole('alertdialog')
    await user.keyboard('{Escape}')
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('uses semantic modal backdrop styles with high-contrast and reduced-motion support', () => {
    render(<ConfirmationDialog defaultOpen title="Continue?" />)

    expect(document.querySelector('[data-component="ConfirmationDialog.Backdrop"]')).toHaveClass(
      'z-modal',
      'bg-[var(--overlay-backdrop-bgColor)]',
      'contrast-more:bg-neutral-emphasis',
      'motion-reduce:transition-none',
    )
  })

  it('moves focus between the footer buttons with the arrow keys and Tab', async () => {
    const user = userEvent.setup()
    render(<ConfirmationDialog title="Continue?" trigger={<button type="button">Open</button>} />)
    await user.click(screen.getByRole('button', {name: 'Open'}))
    const cancel = screen.getByRole('button', {name: 'Cancel'})
    const confirm = screen.getByRole('button', {name: 'Confirm'})
    await waitFor(() => expect(confirm).toHaveFocus())
    expect(cancel).toHaveAttribute('tabindex', '-1')

    await user.keyboard('{ArrowLeft}')
    expect(cancel).toHaveFocus()
    expect(confirm).toHaveAttribute('tabindex', '-1')
    await user.keyboard('{ArrowLeft}')
    expect(cancel).toHaveFocus()
    await user.tab()
    expect(confirm).toHaveFocus()
    await user.tab({shift: true})
    expect(cancel).toHaveFocus()
  })
})
