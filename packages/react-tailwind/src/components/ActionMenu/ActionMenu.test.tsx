import React from 'react'
import type {Menu} from '@base-ui/react/menu'
import {cleanup, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {Tooltip} from '../Tooltip'
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

  it('tracks its open state on a Button trigger with its own id', async () => {
    const user = userEvent.setup()
    render(
      <ActionMenu>
        <ActionMenu.Button id="actions-button">Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item>Archive</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    const trigger = screen.getByRole('button', {name: 'Actions'})
    expect(trigger).toHaveAttribute('id', 'actions-button')
    await user.click(trigger)
    const menu = await screen.findByRole('menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls', menu.id)
  })

  it('tracks its open state on a Button trigger wrapped in a tooltip', async () => {
    const user = userEvent.setup()
    render(
      <ActionMenu>
        <Tooltip>
          <Tooltip.Trigger render={<ActionMenu.Button>Branches</ActionMenu.Button>} />
          <Tooltip.Content>Switch branches</Tooltip.Content>
        </Tooltip>
        <ActionMenu.Content>
          <ActionMenu.Item>main</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    const trigger = screen.getByRole('button', {name: 'Branches'})
    expect(trigger).toHaveAccessibleDescription('Switch branches')
    await user.click(trigger)
    const menu = await screen.findByRole('menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls', menu.id)
  })

  it('focuses the menu when opened with a pointer and the first item when opened with the keyboard', async () => {
    const user = userEvent.setup()
    render(
      <ActionMenu>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item>Archive</ActionMenu.Item>
          <ActionMenu.Item>Delete</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    const trigger = screen.getByRole('button', {name: 'Actions'})
    await user.click(trigger)
    const menu = await screen.findByRole('menu')
    await waitFor(() => expect(menu).toHaveFocus())

    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    await user.keyboard('{Enter}')
    const archive = await screen.findByRole('menuitem', {name: 'Archive'})
    await waitFor(() => expect(archive).toHaveFocus())
  })

  it('renders in place when portal is false', () => {
    render(
      <div data-testid="container">
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Actions</ActionMenu.Button>
          <ActionMenu.Content portal={false}>
            <ActionMenu.Item>Archive</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      </div>,
    )
    expect(screen.getByTestId('container')).toContainElement(
      screen.getByRole('menuitem', {name: 'Archive', hidden: true}),
    )
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
    expect(ref.current?.querySelector('[data-component="trailingAction"] svg')).toBeInTheDocument()
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

  it('renders links as menu items that close the menu, and unavailable links as inactive items', async () => {
    const user = userEvent.setup()
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Links</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.LinkItem href="#docs">Docs</ActionMenu.LinkItem>
          <ActionMenu.LinkItem href="#billing" inactiveText="Requires billing access">
            Billing
          </ActionMenu.LinkItem>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    const link = screen.getByRole('menuitem', {name: 'Docs'})
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '#docs')
    expect(link).toHaveAttribute('data-component', 'ActionMenu.LinkItem')
    const inactiveLink = screen.getByRole('menuitem', {name: /Billing.*Requires billing access/})
    expect(inactiveLink.tagName).not.toBe('A')
    expect(inactiveLink).toHaveAttribute('aria-disabled', 'true')

    await user.click(link)
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('draws dividers between items only with showDividers', () => {
    const {rerender} = render(
      <ActionMenu open>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item>Copy</ActionMenu.Item>
          <ActionMenu.Item>Paste</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    const dividerContainer = () =>
      screen
        .getByRole('menuitem', {name: 'Paste'})
        .querySelector('[data-component="ActionList.Item--DividerContainer"]')

    expect(screen.getByRole('menu')).not.toHaveAttribute('data-dividers')
    expect(dividerContainer()).not.toHaveClass('before:-top-[7px]')

    rerender(
      <ActionMenu open>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content showDividers>
          <ActionMenu.Item>Copy</ActionMenu.Item>
          <ActionMenu.Item>Paste</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    expect(screen.getByRole('menu')).toHaveAttribute('data-dividers', 'true')
    expect(dividerContainer()).toHaveClass('before:-top-[7px]')
  })

  describe('narrow fullscreen variant', () => {
    it('closes from a close button rendered beside the menu', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(
        <ActionMenu defaultOpen onOpenChange={onOpenChange}>
          <ActionMenu.Button>Options</ActionMenu.Button>
          <ActionMenu.Content variant={{narrow: 'fullscreen', regular: 'anchored'}}>
            <ActionMenu.Item>Option 1</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>,
      )

      const closeButton = screen.getByRole('button', {name: 'Close'})
      expect(closeButton).toHaveAttribute('data-component', 'ActionMenu.CloseButton')
      // A menu may only own items, so the button must not sit inside it.
      expect(screen.getByRole('menu')).not.toContainElement(closeButton)
      expect(screen.getByRole('menu').parentElement).toHaveAttribute('data-responsive', 'fullscreen')

      await user.click(closeButton)
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
    })

    it('closes through a consumer actionsRef', async () => {
      const user = userEvent.setup()
      const actionsRef: React.RefObject<Menu.Root.Actions | null> = {current: null}
      render(
        <ActionMenu defaultOpen actionsRef={actionsRef}>
          <ActionMenu.Button>Options</ActionMenu.Button>
          <ActionMenu.Content variant={{narrow: 'fullscreen'}}>
            <ActionMenu.Item>Option 1</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>,
      )

      expect(actionsRef.current).toEqual({close: expect.any(Function), unmount: expect.any(Function)})
      await user.click(screen.getByRole('button', {name: 'Close'}))
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    })

    it('omits the close button when anchored', () => {
      render(
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Options</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Item>Option 1</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>,
      )

      expect(screen.queryByRole('button', {name: 'Close'})).not.toBeInTheDocument()
      expect(screen.getByRole('menu').parentElement).not.toHaveAttribute('data-responsive')
    })
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
      // Base UI moves focus into the menu after it mounts; Escape must start from there to test focus return.
      const menu = await screen.findByRole('menu')
      await waitFor(() => expect(menu).toContainElement(document.activeElement as HTMLElement))
      await user.keyboard('{Escape}')

      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
      expect(trigger).not.toHaveFocus()
    })
  })
})
