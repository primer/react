import React from 'react'
import {cleanup, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {Dialog} from './Dialog'

describe('Dialog', () => {
  afterEach(cleanup)

  it('supports controlled state and exposes a title and description', () => {
    const onOpenChange = vi.fn()
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <Dialog.Content>
          <Dialog.Title>Delete repository?</Dialog.Title>
          <Dialog.Description>This cannot be undone.</Dialog.Description>
        </Dialog.Content>
      </Dialog>,
    )
    expect(screen.getByRole('dialog', {name: 'Delete repository?'})).toHaveAccessibleDescription(
      'This cannot be undone.',
    )
  })

  it('dismisses with escape and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )
    const trigger = screen.getByRole('button', {name: 'Open dialog'})
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it('closes on the first Escape while the focused close button shows its tooltip', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
        </Dialog.Content>
      </Dialog>,
    )
    const trigger = screen.getByRole('button', {name: 'Open dialog'})
    trigger.focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.getByRole('button', {name: 'Close'})).toHaveFocus())
    expect(await screen.findByText('Close')).toBeVisible()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('describes the dialog with its subtitle', () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Delete repository?</Dialog.Title>
            <Dialog.Subtitle>This cannot be undone.</Dialog.Subtitle>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog>,
    )
    expect(screen.getByText('This cannot be undone.')).toHaveAttribute('data-component', 'Dialog.Subtitle')
    expect(screen.getByRole('dialog', {name: 'Delete repository?'})).toHaveAccessibleDescription(
      'This cannot be undone.',
    )
  })

  it('forwards content refs and rest props', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Dialog>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Content ref={ref} data-testid="dialog">
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', {name: 'Open dialog'}))
    expect(ref.current).toBe(screen.getByTestId('dialog'))
    expect(ref.current).toHaveAttribute('data-component', 'Dialog.Content')
    expect(ref.current).toHaveClass('bg-[var(--overlay-bgColor)]')
  })

  it('suppresses its default backdrop for non-modal dialogs', () => {
    const {rerender} = render(
      <Dialog modal={false} open>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    expect(screen.queryByTestId('backdrop')).not.toBeInTheDocument()

    rerender(
      <Dialog modal={false} open>
        <Dialog.Content backdrop data-testid="dialog">
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    expect(document.querySelector('[data-component="Dialog.Backdrop"]')).toBeInTheDocument()
  })

  it('keeps Primer markers immutable and uses semantic backdrop motion styles', () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Backdrop data-component="consumer" data-testid="backdrop" />
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    const backdrop = screen.getByTestId('backdrop')
    expect(backdrop).toHaveAttribute('data-component', 'Dialog.Backdrop')
    expect(backdrop).toHaveClass(
      'z-modal',
      'bg-[var(--overlay-backdrop-bgColor)]',
      'contrast-more:bg-neutral-emphasis',
      'motion-reduce:transition-none',
    )
  })

  it('exposes Primer size and position markers with upstream defaults', () => {
    render(
      <Dialog open>
        <Dialog.Content data-testid="dialog">
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-width', 'xlarge')
    expect(dialog).toHaveAttribute('data-height', 'auto')
    expect(dialog).toHaveAttribute('data-position-narrow', 'center')
    expect(dialog).toHaveAttribute('data-position-regular', 'center')
    expect(dialog).not.toHaveAttribute('data-align')
    expect(dialog).toHaveClass('w-[640px]', 'h-auto', 'min-w-[296px]', 'max-w-[calc(100dvw-64px)]')
  })

  it('maps responsive positions and alignment onto the popup and viewport', () => {
    const {rerender} = render(
      <Dialog open>
        <Dialog.Content align="top" data-testid="dialog" position={{narrow: 'bottom', regular: 'center'}} width="small">
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    let dialog = screen.getByTestId('dialog')
    let viewport = document.querySelector('[data-component="Dialog.Viewport"]')
    expect(dialog).toHaveAttribute('data-position-narrow', 'bottom')
    expect(dialog).toHaveAttribute('data-align', 'top')
    expect(dialog).toHaveClass('w-[296px]', 'max-md:w-dvw', 'max-md:rounded-b-none')
    expect(viewport).toHaveClass('max-md:items-end', 'md:items-start', 'md:pt-16')
    expect(viewport).not.toHaveClass('max-md:pt-16')

    rerender(
      <Dialog open>
        <Dialog.Content data-testid="dialog" position="right">
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    dialog = screen.getByTestId('dialog')
    viewport = document.querySelector('[data-component="Dialog.Viewport"]')
    expect(dialog).toHaveAttribute('data-position-regular', 'right')
    expect(dialog).not.toHaveAttribute('data-position-narrow')
    expect(dialog).toHaveClass('h-dvh', 'rounded-r-none')
    expect(viewport).toHaveClass('justify-end', 'p-0')
    expect(viewport).not.toHaveClass('p-8')
  })

  it('sizes custom widths through a CSS variable and merges consumer styles', () => {
    render(
      <Dialog open>
        <Dialog.Content data-testid="dialog" height="small" style={{color: 'red'}} width={400}>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    const dialog = screen.getByTestId('dialog')
    expect(dialog).not.toHaveAttribute('data-width')
    expect(dialog).toHaveAttribute('data-height', 'small')
    expect(dialog).toHaveClass('w-[var(--dialog-width)]', 'h-[480px]')
    expect(dialog.style.getPropertyValue('--dialog-width')).toBe('400px')
    expect(dialog.style.color).toBe('red')
  })

  it('renders in place when portal is false', () => {
    render(
      <div data-testid="host">
        <Dialog open>
          <Dialog.Content data-testid="dialog" portal={false}>
            <Dialog.Title>Settings</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      </div>,
    )

    expect(screen.getByTestId('host')).toContainElement(screen.getByTestId('dialog'))
  })

  it('supports HTMLElement trigger refs when rendering a composed trigger', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Dialog>
        <Dialog.Trigger ref={ref} render={<a href="#settings">Open settings</a>} nativeButton={false} />
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    expect(ref.current).toBe(screen.getByRole('button', {name: 'Open settings'}))
  })
})
