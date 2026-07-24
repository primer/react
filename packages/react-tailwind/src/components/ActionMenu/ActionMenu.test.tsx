import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {ActionMenu} from './ActionMenu'

describe('ActionMenu', () => {
  it('opens with the trigger and returns focus when dismissed', async () => {
    const user = userEvent.setup()
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item>Archive</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    const trigger = screen.getByRole('button', {name: 'Actions'})
    expect(screen.getByRole('menuitem', {name: 'Archive', hidden: true})).toHaveAttribute(
      'data-component',
      'ActionMenu.Item',
    )
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it('composes Button props, refs, and rest props into its trigger', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <ActionMenu>
        <ActionMenu.Button
          ref={ref}
          data-testid="actions"
          leadingVisual={<span aria-hidden="true">+</span>}
          variant="danger"
        >
          Actions
        </ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item>Archive</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    expect(ref.current).toBe(screen.getByTestId('actions'))
    expect(ref.current).toHaveTextContent('+Actions')
    expect(ref.current).toHaveClass('bg-danger-emphasis')
    await user.click(ref.current!)
    expect(await screen.findByRole('menuitem', {name: 'Archive'})).toBeVisible()
  })

  it('preserves state-aware trigger class names', async () => {
    const user = userEvent.setup()
    render(
      <ActionMenu>
        <ActionMenu.Trigger data-testid="stateful-trigger" className={({open}) => (open ? 'is-open' : 'is-closed')}>
          Actions
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Item>Archive</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    const trigger = screen.getByTestId('stateful-trigger')
    expect(trigger).toHaveClass('is-closed')
    await user.click(trigger)
    await waitFor(() => expect(trigger).toHaveClass('is-open'))
  })
})
