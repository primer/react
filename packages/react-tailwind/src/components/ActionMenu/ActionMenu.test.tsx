import React from 'react'
import {cleanup, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it} from 'vitest'
import {ActionMenu} from './ActionMenu'

afterEach(cleanup)

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
    expect(ref.current).toHaveClass('bg-[var(--button-danger-bgColor-rest)]')
    expect(ref.current).toHaveClass('pr-2')
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

  it('composes shared item content and exposes selection and unavailable states', () => {
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Group>
            <ActionMenu.GroupLabel>Repository</ActionMenu.GroupLabel>
            <ActionMenu.Item selected>
              <ActionMenu.LeadingVisual>◆</ActionMenu.LeadingVisual>
              Archive
              <ActionMenu.Description variant="block">Move this repository out of active lists</ActionMenu.Description>
              <ActionMenu.TrailingVisual>⌘A</ActionMenu.TrailingVisual>
            </ActionMenu.Item>
            <ActionMenu.Item inactiveText="Requires admin access">Transfer</ActionMenu.Item>
            <ActionMenu.Item loading loadingText="Archiving repository">
              Archive now
            </ActionMenu.Item>
          </ActionMenu.Group>
          <ActionMenu.CheckboxItem checked>Watch</ActionMenu.CheckboxItem>
          <ActionMenu.RadioGroup value="dark">
            <ActionMenu.RadioItem value="light">Light</ActionMenu.RadioItem>
            <ActionMenu.RadioItem value="dark">Dark</ActionMenu.RadioItem>
          </ActionMenu.RadioGroup>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    expect(screen.getByText('Repository')).toHaveAttribute('data-component', 'ActionMenu.GroupLabel')
    expect(screen.getByRole('menuitem', {name: /Archive.*Move this repository/})).toHaveAttribute(
      'data-selected',
      'true',
    )
    expect(screen.getByRole('menuitem', {name: /Transfer.*Requires admin access/})).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(screen.getByText('Archiving repository')).toHaveClass('sr-only')
    expect(screen.getByRole('menuitemcheckbox', {name: 'Watch'})).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('menuitemradio', {name: 'Dark'})).toHaveAttribute('aria-checked', 'true')
  })

  it('opens nested menus with menu keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Edit</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item>Copy</ActionMenu.Item>
          <ActionMenu.Submenu>
            <ActionMenu.SubmenuTrigger>Paste special</ActionMenu.SubmenuTrigger>
            <ActionMenu.Content side="right">
              <ActionMenu.Item>Plain text</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    const submenuTrigger = screen.getByRole('menuitem', {name: 'Paste special'})
    submenuTrigger.focus()
    await user.keyboard('{ArrowRight}')
    expect(await screen.findByRole('menuitem', {name: 'Plain text'})).toBeVisible()
  })

  describe('focus on close', () => {
    function FocusExample({preventFocusOnClose}: {preventFocusOnClose?: boolean}) {
      return (
        <>
          <input aria-label="Editor" />
          <ActionMenu>
            <ActionMenu.Button>Link actions</ActionMenu.Button>
            <ActionMenu.Content preventFocusOnClose={preventFocusOnClose}>
              <ActionMenu.Item>Convert to preview</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </>
      )
    }

    it('returns focus to the trigger after selection by default', async () => {
      const user = userEvent.setup()
      render(<FocusExample />)
      const trigger = screen.getByRole('button', {name: 'Link actions'})

      await user.click(trigger)
      await user.click(await screen.findByRole('menuitem', {name: 'Convert to preview'}))

      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
      expect(trigger).toHaveFocus()
    })

    it('does not return focus to the trigger with preventFocusOnClose', async () => {
      const user = userEvent.setup()
      render(<FocusExample preventFocusOnClose />)
      const trigger = screen.getByRole('button', {name: 'Link actions'})

      await user.click(trigger)
      await user.click(await screen.findByRole('menuitem', {name: 'Convert to preview'}))

      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
      expect(trigger).not.toHaveFocus()
    })

    it('does not return focus to the trigger after Escape with preventFocusOnClose', async () => {
      const user = userEvent.setup()
      render(<FocusExample preventFocusOnClose />)
      const trigger = screen.getByRole('button', {name: 'Link actions'})

      await user.click(trigger)
      await screen.findByRole('menuitem', {name: 'Convert to preview'})
      await user.keyboard('{Escape}')

      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
      expect(trigger).not.toHaveFocus()
    })
  })
})
