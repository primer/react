import React from 'react'
import {Dialog as BaseDialog} from '@base-ui/react/dialog'
import {act, cleanup, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {ConfirmationDialog} from './ConfirmationDialog'
import {Dialog} from '../Dialog'
import {Popover} from '../Popover'

describe('ConfirmationDialog', () => {
  afterEach(cleanup)

  it('exposes its composable parts on the configuration component', () => {
    expect(ConfirmationDialog.Root).toBeDefined()
    expect(ConfirmationDialog.Content).toBeDefined()
    expect(ConfirmationDialog.Portal).toBeDefined()
    expect(ConfirmationDialog.Root).not.toBe(Dialog.Root)
    expect(ConfirmationDialog.Root).not.toHaveProperty('Header')
  })

  it('hydrates a closed dialog without changing its server markup', async () => {
    const example = <ConfirmationDialog title="Continue?" trigger={<button type="button">Open</button>} />
    const container = document.createElement('div')
    container.innerHTML = renderToString(example)
    document.body.append(container)
    const serverMarkup = container.innerHTML
    const errors: unknown[] = []
    let root: ReturnType<typeof hydrateRoot> | undefined

    try {
      await act(async () => {
        root = hydrateRoot(container, example, {onRecoverableError: error => errors.push(error)})
      })
      expect(errors).toEqual([])
      expect(container.innerHTML).toBe(serverMarkup)

      const user = userEvent.setup()
      await user.click(screen.getByRole('button', {name: 'Open'}))
      expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('aria-modal', 'true')
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
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
    expect(screen.getByRole('alertdialog', {name: 'Delete repository?'})).toHaveClass(
      'primer:bg-[var(--overlay-bgColor)]',
    )
    await waitFor(() => expect(screen.getByRole('button', {name: 'Cancel'})).toHaveFocus())
  })

  it.each([
    {modal: undefined, isModal: true, name: 'default'},
    {modal: true, isModal: true, name: 'modal'},
    {modal: false, isModal: false, name: 'non-modal'},
    {modal: 'trap-focus' as const, isModal: false, name: 'focus-trapping'},
  ])('exposes the $name configuration dialog modality', ({modal, isModal}) => {
    render(<ConfirmationDialog modal={modal} open title="Continue?" />)

    const dialog = screen.getByRole('alertdialog', {name: 'Continue?'})
    if (isModal) {
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    } else {
      expect(dialog).not.toHaveAttribute('aria-modal')
    }
  })

  it.each([
    {modal: undefined, pointerTransparent: false},
    {modal: true, pointerTransparent: false},
    {modal: false, pointerTransparent: true},
    {modal: 'trap-focus' as const, pointerTransparent: true},
  ])('renders the configuration backdrop for modal=$modal', ({modal, pointerTransparent}) => {
    render(<ConfirmationDialog modal={modal} open title="Continue?" />)
    const backdrop = document.querySelector('[data-component="ConfirmationDialog.Backdrop"]')
    expect(backdrop).toBeInTheDocument()
    if (pointerTransparent) expect(backdrop).toHaveClass('primer:pointer-events-none')
    else expect(backdrop).not.toHaveClass('primer:pointer-events-none')
  })

  it('updates the compound dialog modality when its root mode changes', () => {
    const example = (modal: boolean | 'trap-focus') => (
      <ConfirmationDialog.Root modal={modal} open>
        <ConfirmationDialog.Portal>
          <ConfirmationDialog.Viewport>
            <ConfirmationDialog.Content>
              <ConfirmationDialog.Title>Continue?</ConfirmationDialog.Title>
            </ConfirmationDialog.Content>
          </ConfirmationDialog.Viewport>
        </ConfirmationDialog.Portal>
      </ConfirmationDialog.Root>
    )
    const {rerender} = render(example(true))
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('aria-modal', 'true')

    rerender(example(false))
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).not.toHaveAttribute('aria-modal')

    rerender(example('trap-focus'))
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).not.toHaveAttribute('aria-modal')

    rerender(example(true))
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('aria-modal', 'true')
  })

  it('respects an explicit modality override on compound content', () => {
    render(
      <ConfirmationDialog.Root open>
        <ConfirmationDialog.Portal>
          <ConfirmationDialog.Viewport>
            <ConfirmationDialog.Content aria-modal={false}>
              <ConfirmationDialog.Title>Continue?</ConfirmationDialog.Title>
            </ConfirmationDialog.Content>
          </ConfirmationDialog.Viewport>
        </ConfirmationDialog.Portal>
      </ConfirmationDialog.Root>,
    )
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('aria-modal', 'false')
  })

  it('does not impose dialog-only modality semantics on a different explicit role', () => {
    render(
      <ConfirmationDialog.Root open>
        <ConfirmationDialog.Portal>
          <ConfirmationDialog.Viewport>
            <ConfirmationDialog.Content aria-label="Status" role="region">
              Details
            </ConfirmationDialog.Content>
          </ConfirmationDialog.Viewport>
        </ConfirmationDialog.Portal>
      </ConfirmationDialog.Root>,
    )
    expect(screen.getByRole('region', {name: 'Status'})).not.toHaveAttribute('aria-modal')
  })

  it('shares modality with the Dialog compound root', () => {
    const {rerender} = render(
      <Dialog.Root modal={false} open>
        <ConfirmationDialog.Portal>
          <ConfirmationDialog.Viewport>
            <ConfirmationDialog.Content>
              <ConfirmationDialog.Title>Continue?</ConfirmationDialog.Title>
            </ConfirmationDialog.Content>
          </ConfirmationDialog.Viewport>
        </ConfirmationDialog.Portal>
      </Dialog.Root>,
    )
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).not.toHaveAttribute('aria-modal')

    rerender(
      <ConfirmationDialog.Root modal={false} open>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </ConfirmationDialog.Root>,
    )
    expect(screen.getByRole('dialog', {name: 'Settings'})).not.toHaveAttribute('aria-modal')
  })

  it('preserves explicit modality with a raw Base UI root', () => {
    render(
      <BaseDialog.Root modal={false} open>
        <ConfirmationDialog.Portal>
          <ConfirmationDialog.Viewport>
            <ConfirmationDialog.Content aria-modal={false}>
              <ConfirmationDialog.Title>Continue?</ConfirmationDialog.Title>
            </ConfirmationDialog.Content>
          </ConfirmationDialog.Viewport>
        </ConfirmationDialog.Portal>
      </BaseDialog.Root>,
    )
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('aria-modal', 'false')
  })

  it('does not infer modality from an unwrapped Base UI root', () => {
    render(
      <BaseDialog.Root modal={false} open>
        <ConfirmationDialog.Portal>
          <ConfirmationDialog.Viewport>
            <ConfirmationDialog.Content>
              <ConfirmationDialog.Title>Continue?</ConfirmationDialog.Title>
            </ConfirmationDialog.Content>
          </ConfirmationDialog.Viewport>
        </ConfirmationDialog.Portal>
      </BaseDialog.Root>,
    )
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).not.toHaveAttribute('aria-modal')
  })

  it('preserves Base UI handle payloads in the compound root', async () => {
    const user = userEvent.setup()
    const handle = BaseDialog.createHandle<{title: string}>()
    render(
      <>
        <BaseDialog.Trigger handle={handle} payload={{title: 'Remove repository?'}}>
          Open confirmation
        </BaseDialog.Trigger>
        <ConfirmationDialog.Root handle={handle}>
          {({payload}) => (
            <ConfirmationDialog.Portal>
              <ConfirmationDialog.Viewport>
                <ConfirmationDialog.Content>
                  <ConfirmationDialog.Title>{payload?.title ?? 'Confirm'}</ConfirmationDialog.Title>
                </ConfirmationDialog.Content>
              </ConfirmationDialog.Viewport>
            </ConfirmationDialog.Portal>
          )}
        </ConfirmationDialog.Root>
      </>,
    )
    await user.click(screen.getByRole('button', {name: 'Open confirmation'}))
    expect(screen.getByRole('alertdialog', {name: 'Remove repository?'})).toHaveAttribute('aria-modal', 'true')
  })

  it('applies the nearest composed root modality', () => {
    render(
      <Dialog.Root modal={false} open>
        <Dialog.Content>
          <Dialog.Title>Outer settings</Dialog.Title>
          <ConfirmationDialog.Root open>
            <ConfirmationDialog.Portal>
              <ConfirmationDialog.Viewport>
                <ConfirmationDialog.Content>
                  <ConfirmationDialog.Title>Continue?</ConfirmationDialog.Title>
                </ConfirmationDialog.Content>
              </ConfirmationDialog.Viewport>
            </ConfirmationDialog.Portal>
          </ConfirmationDialog.Root>
        </Dialog.Content>
      </Dialog.Root>,
    )
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('aria-modal', 'true')
  })

  it('defaults to the medium Primer dialog width and accepts dialog sizes', () => {
    const {rerender} = render(<ConfirmationDialog open title="Continue?" />)
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('data-width', 'medium')
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveClass('primer:w-[320px]', 'primer:h-auto')

    rerender(<ConfirmationDialog height="small" open title="Continue?" width="large" />)
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('data-width', 'large')
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveAttribute('data-height', 'small')
    expect(screen.getByRole('alertdialog', {name: 'Continue?'})).toHaveClass('primer:w-[480px]', 'primer:h-[480px]')
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

  it('supports the controlled table error retry and dismissal migration', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const onDismiss = vi.fn()
    function ErrorDialogExample() {
      const [errorOpen, setErrorOpen] = React.useState(true)
      return (
        <>
          <button type="button" onClick={() => setErrorOpen(true)}>
            Show error
          </button>
          <ConfirmationDialog
            open={errorOpen}
            onOpenChange={setErrorOpen}
            title="Error"
            description="The table could not be loaded."
            confirmButtonContent="Retry"
            cancelButtonContent="Dismiss"
            onConfirm={onRetry}
            onCancel={onDismiss}
          />
        </>
      )
    }

    render(<ErrorDialogExample />)
    expect(screen.getByRole('alertdialog', {name: 'Error'})).toHaveAccessibleDescription(
      'The table could not be loaded.',
    )
    await user.click(screen.getByRole('button', {name: 'Retry'}))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(onRetry).toHaveBeenCalledOnce()
    expect(onDismiss).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', {name: 'Show error'}))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(onDismiss).toHaveBeenCalledOnce()

    await user.click(screen.getByRole('button', {name: 'Show error'}))
    await user.click(screen.getByRole('button', {name: 'Dismiss'}))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(onDismiss).toHaveBeenCalledTimes(2)
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('keeps loading and disabled confirmation actions unavailable', () => {
    render(<ConfirmationDialog defaultOpen confirmButtonDisabled confirmButtonLoading title="Continue?" />)
    expect(screen.getByRole('button', {name: /confirm/i})).toBeDisabled()
    expect(screen.getByRole('button', {name: /confirm/i})).not.toHaveAttribute('aria-busy')
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
      'primer:z-modal',
      'primer:bg-[var(--overlay-backdrop-bgColor)]',
      'primer:contrast-more:bg-neutral-emphasis',
      'primer:motion-reduce:transition-none',
    )
  })

  it('layers nested confirmation dialogs above their floating parent', () => {
    render(
      <Popover defaultOpen>
        <Popover.Content>
          <ConfirmationDialog open title="Continue?" />
        </Popover.Content>
      </Popover>,
    )

    expect(document.querySelector('[data-component="ConfirmationDialog.Backdrop"]')).toHaveClass('primer:z-popover')
    expect(document.querySelector('[data-component="ConfirmationDialog.Viewport"]')).toHaveClass('primer:z-popover')
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
