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

  it('uses semantic modal backdrop styles with high-contrast and reduced-motion support', () => {
    render(<ConfirmationDialog defaultOpen title="Continue?" />)

    expect(document.querySelector('[data-component="ConfirmationDialog.Backdrop"]')).toHaveClass(
      'z-modal',
      'bg-[var(--overlay-backdrop-bgColor)]',
      'contrast-more:bg-neutral-emphasis',
      'motion-reduce:transition-none',
    )
  })
})
