import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'
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
      'bg-neutral-emphasis/40',
      'contrast-more:bg-neutral-emphasis',
      'motion-reduce:transition-none',
    )
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
