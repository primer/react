import React from 'react'
import type {Menu} from '@base-ui/react/menu'
import {GearIcon} from '@primer/octicons-react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {Button} from '../Button'
import {IconButton} from '../IconButton'
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

  it('composes a tooltip and menu trigger on the same button', async () => {
    const user = userEvent.setup()
    const menuRef = React.createRef<HTMLButtonElement>()
    const tooltipRef = React.createRef<HTMLElement>()
    const onClick = vi.fn()
    render(
      <ActionMenu>
        <Tooltip>
          <Tooltip.Trigger
            ref={tooltipRef}
            render={
              <ActionMenu.Trigger ref={menuRef} render={<Button onClick={onClick} />}>
                Branches
              </ActionMenu.Trigger>
            }
          />
          <Tooltip.Content>Switch branches</Tooltip.Content>
        </Tooltip>
        <ActionMenu.Content>
          <ActionMenu.Item>main</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    const trigger = screen.getByRole('button', {name: 'Branches'})
    expect(menuRef.current).toBe(trigger)
    expect(tooltipRef.current).toBe(trigger)
    expect(trigger).toHaveAccessibleDescription('Switch branches')
    await user.tab()
    expect(trigger).toHaveFocus()
    await user.keyboard('{Enter}')
    const menu = await screen.findByRole('menu')
    const item = screen.getByRole('menuitem', {name: 'main'})
    await waitFor(() => expect(item).toHaveFocus())
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls', menu.id)
    expect(onClick).toHaveBeenCalledTimes(1)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard(' ')
    await waitFor(() => expect(screen.getByRole('menuitem', {name: 'main'})).toHaveFocus())
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    await user.click(trigger)
    expect(await screen.findByRole('menu')).toBeVisible()
    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it('composes a tooltip with the styled menu button', async () => {
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

  it('composes an icon trigger named by an enclosing tooltip', async () => {
    const user = userEvent.setup()
    const menuRef = React.createRef<HTMLButtonElement>()
    const iconRef = React.createRef<HTMLElement>()
    const tooltipRef = React.createRef<HTMLElement>()
    const onClick = vi.fn()
    render(
      <ActionMenu>
        <Tooltip id="menu-trigger-label" type="label">
          <Tooltip.Trigger
            ref={tooltipRef}
            aria-labelledby="menu-trigger-label"
            render={
              <ActionMenu.Trigger
                ref={menuRef}
                render={
                  <IconButton
                    ref={iconRef}
                    aria-labelledby="menu-trigger-label"
                    icon={<GearIcon data-testid="menu-icon" />}
                    onClick={onClick}
                  />
                }
              />
            }
          />
          <Tooltip.Content>Repository actions</Tooltip.Content>
        </Tooltip>
        <ActionMenu.Content aria-labelledby="menu-trigger-label">
          <ActionMenu.Item>Copy</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    const trigger = screen.getByRole('button', {name: 'Repository actions'})
    expect(trigger).not.toHaveAttribute('aria-label')
    expect(trigger).toHaveAttribute('aria-labelledby', 'menu-trigger-label')
    expect(trigger).toContainElement(screen.getByTestId('menu-icon'))
    expect(menuRef.current).toBe(trigger)
    expect(iconRef.current).toBe(trigger)
    expect(tooltipRef.current).toBe(trigger)
    await user.tab()
    expect(trigger).toHaveFocus()
    await user.keyboard('{Enter}')
    const menu = await screen.findByRole('menu', {name: 'Repository actions'})
    const item = screen.getByRole('menuitem', {name: 'Copy'})
    expect(menu).toHaveAttribute('aria-labelledby', 'menu-trigger-label')
    await waitFor(() => expect(item).toHaveFocus())
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    await user.keyboard(' ')
    await waitFor(() => expect(screen.getByRole('menuitem', {name: 'Copy'})).toHaveFocus())
    await user.keyboard('{Enter}')
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it.each([
    ['a shared label', true],
    ['the tooltip reference', false],
  ])('keeps an icon trigger named by %s through server rendering and hydration', async (_, hasSharedLabel) => {
    const labelId = hasSharedLabel ? 'hydrated-menu-label' : 'hydrated-menu-tooltip'
    const app = (
      <>
        {hasSharedLabel ? (
          <span hidden id={labelId}>
            Repository actions
          </span>
        ) : null}
        <ActionMenu>
          <Tooltip id={hasSharedLabel ? undefined : labelId} type="label">
            <Tooltip.Trigger
              aria-labelledby={labelId}
              render={<ActionMenu.Trigger render={<IconButton aria-labelledby={labelId} icon={<GearIcon />} />} />}
            />
            <Tooltip.Content>Repository actions</Tooltip.Content>
          </Tooltip>
          <ActionMenu.Content aria-labelledby={labelId}>
            <ActionMenu.Item>Copy</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(app)
    document.body.append(container)
    const trigger = container.querySelector('button')
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      expect(container.querySelectorAll(`[id="${labelId}"]`)).toHaveLength(1)
      expect(trigger).toHaveAttribute('aria-labelledby', labelId)
      expect(trigger).toHaveAccessibleName('Repository actions')
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      expect(screen.getByRole('button', {name: 'Repository actions'})).toHaveAttribute('aria-labelledby', labelId)
      expect(document.querySelectorAll(`[id="${labelId}"]`)).toHaveLength(1)
      await userEvent.setup().click(screen.getByRole('button', {name: 'Repository actions'}))
      expect(await screen.findByRole('menu', {name: 'Repository actions'})).toBeInTheDocument()
      expect(document.querySelectorAll(`[id="${labelId}"]`)).toHaveLength(1)
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
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
    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(screen.getByRole('menuitem', {name: 'Archive'})).toHaveFocus())

    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    await user.click(trigger)
    await waitFor(() => expect(screen.getByRole('menu')).toHaveFocus())
    await user.keyboard('{ArrowUp}')
    await waitFor(() => expect(screen.getByRole('menuitem', {name: 'Delete'})).toHaveFocus())

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

  it('waits for an explicit portal container and ignores it when rendering in place', async () => {
    const portalContainer = document.createElement('div')
    document.body.append(portalContainer)
    const menu = (container: HTMLDivElement | null, portal = true) => (
      <div data-testid="menu-parent">
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Actions</ActionMenu.Button>
          <ActionMenu.Content container={container} portal={portal}>
            <ActionMenu.Item>Archive</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      </div>
    )

    try {
      const {rerender} = render(menu(null))
      expect(screen.queryByRole('menuitem', {name: 'Archive', hidden: true})).not.toBeInTheDocument()

      rerender(menu(portalContainer))
      const item = await screen.findByRole('menuitem', {name: 'Archive', hidden: true})
      expect(portalContainer).toContainElement(item)

      rerender(menu(portalContainer, false))
      await waitFor(() => {
        const inlineItem = screen.getByRole('menuitem', {name: 'Archive', hidden: true})
        expect(screen.getByTestId('menu-parent')).toContainElement(inlineItem)
        expect(portalContainer).not.toContainElement(inlineItem)
      })
    } finally {
      portalContainer.remove()
    }
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
    expect(ref.current).toHaveClass('primer:bg-[var(--button-danger-bgColor-rest)]')
    expect(ref.current?.querySelector('[data-component="trailingAction"] svg')).toBeInTheDocument()
    await user.click(ref.current!)
    expect(await screen.findByRole('menuitem', {name: 'Archive'})).toBeVisible()
  })

  it('defaults the trailing action and accepts component, element, and null overrides', () => {
    render(
      <>
        <ActionMenu>
          <ActionMenu.Button>Default</ActionMenu.Button>
        </ActionMenu>
        <ActionMenu>
          <ActionMenu.Button trailingAction={GearIcon}>Component</ActionMenu.Button>
        </ActionMenu>
        <ActionMenu>
          <ActionMenu.Button trailingAction={<GearIcon data-testid="custom-trailing-action" />}>
            Element
          </ActionMenu.Button>
        </ActionMenu>
        <ActionMenu>
          <ActionMenu.Button trailingAction={null}>No action</ActionMenu.Button>
        </ActionMenu>
      </>,
    )

    expect(screen.getByRole('button', {name: 'Default'}).querySelector('.octicon-triangle-down')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Component'}).querySelector('.octicon-gear')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Element'})).toContainElement(screen.getByTestId('custom-trailing-action'))
    expect(
      screen.getByRole('button', {name: 'No action'}).querySelector('[data-component="trailingAction"]'),
    ).toBeNull()
  })

  it('forwards the content ref to the menu and clears it on unmount', async () => {
    const ref = React.createRef<HTMLDivElement>()
    const {unmount} = render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content ref={ref} variant={{narrow: 'fullscreen'}}>
          <ActionMenu.Item>Archive</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    expect(await screen.findByRole('menu')).toBe(ref.current)
    unmount()
    expect(ref.current).toBeNull()
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

  it('composes shared item content and exposes selection and unavailable states', async () => {
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
    expect(screen.getByRole('menuitem', {name: 'Archive ⌘A'})).toHaveAttribute('data-selected', 'true')
    const inactive = screen.getByRole('menuitem', {name: 'Transfer'})
    expect(inactive).toHaveAttribute('aria-disabled', 'true')
    expect(inactive).toHaveAccessibleDescription('Requires admin access')
    expect(inactive).toHaveAttribute('title', 'Requires admin access')
    await waitFor(() => expect(screen.getByText('Requires admin access')).toBeVisible())
    expect(screen.getByText('Archiving repository')).toHaveClass('primer:sr-only')
    expect(screen.getByRole('menuitemcheckbox', {name: 'Watch'})).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('menuitemradio', {name: 'Dark'})).toHaveAttribute('aria-checked', 'true')
  })

  it('separates item descriptions from names and preserves explicit accessibility attributes', () => {
    render(
      <>
        <span id="external-description">Available to administrators</span>
        <span id="private-label">Private visibility</span>
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Actions</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Item>
              Publish
              <ActionMenu.Description>Make this repository public</ActionMenu.Description>
            </ActionMenu.Item>
            <ActionMenu.Item aria-describedby="external-description archive-details" aria-label="Archive repository">
              Archive
              <ActionMenu.Description id="archive-details">
                Move this repository out of active lists
              </ActionMenu.Description>
              <ActionMenu.Description variant="block">You can restore it later</ActionMenu.Description>
            </ActionMenu.Item>
            <ActionMenu.CheckboxItem>
              Watch
              <ActionMenu.Description>Receive notifications</ActionMenu.Description>
            </ActionMenu.CheckboxItem>
            <ActionMenu.RadioGroup>
              <ActionMenu.RadioItem aria-labelledby="private-label" value="private">
                Private
                <ActionMenu.Description>Only members can view</ActionMenu.Description>
              </ActionMenu.RadioItem>
            </ActionMenu.RadioGroup>
            <ActionMenu.LinkItem href="#settings">
              Settings
              <ActionMenu.Description>Manage repository settings</ActionMenu.Description>
            </ActionMenu.LinkItem>
          </ActionMenu.Content>
        </ActionMenu>
      </>,
    )

    expect(screen.getByRole('menuitem', {name: 'Publish'})).toHaveAccessibleDescription('Make this repository public')
    const archive = screen.getByRole('menuitem', {name: 'Archive repository'})
    expect(archive).toHaveAccessibleDescription(
      'Available to administrators Move this repository out of active lists You can restore it later',
    )
    expect(
      archive
        .getAttribute('aria-describedby')
        ?.split(' ')
        .filter(id => id === 'archive-details'),
    ).toHaveLength(1)
    expect(screen.getByRole('menuitemcheckbox', {name: 'Watch'})).toHaveAccessibleDescription('Receive notifications')
    expect(screen.getByRole('menuitemradio', {name: 'Private visibility'})).toHaveAccessibleDescription(
      'Only members can view',
    )
    expect(screen.getByRole('menuitem', {name: 'Settings'})).toHaveAccessibleDescription('Manage repository settings')
  })

  it('preserves names and descriptions supplied through render elements and callbacks', () => {
    render(
      <>
        <span id="element-note">Element note</span>
        <span id="function-note">Function note</span>
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Actions</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Item
              nativeButton
              render={<button type="button" aria-label="Rendered action" aria-describedby="element-note" />}
            >
              Visible action
              <ActionMenu.Description>Element detail</ActionMenu.Description>
            </ActionMenu.Item>
            <ActionMenu.Item
              nativeButton
              render={props => (
                <button {...props} type="button" aria-label="Callback action" aria-describedby="function-note" />
              )}
            >
              Visible callback
              <ActionMenu.Description>Callback detail</ActionMenu.Description>
            </ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      </>,
    )

    expect(screen.getByRole('menuitem', {name: 'Rendered action'})).toHaveAccessibleDescription(
      'Element note Element detail',
    )
    expect(screen.getByRole('menuitem', {name: 'Callback action'})).toHaveAccessibleDescription(
      'Function note Callback detail',
    )
  })

  it('does not reference item content replaced by render elements or callbacks', () => {
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item nativeButton render={<button type="button">Replacement</button>}>
            Original
            <ActionMenu.Description>Original details</ActionMenu.Description>
          </ActionMenu.Item>
          <ActionMenu.Item
            nativeButton
            render={props => (
              <button {...props} type="button">
                Callback replacement
              </button>
            )}
          >
            Original callback
            <ActionMenu.Description>Original callback details</ActionMenu.Description>
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    for (const name of ['Replacement', 'Callback replacement']) {
      const item = screen.getByRole('menuitem', {name})
      expect(item).not.toHaveAttribute('aria-describedby')
      expect(item).not.toHaveAttribute('aria-labelledby')
    }
  })

  it('keeps descriptions when render callbacks clone item content', () => {
    const cloneChildren = (children: React.ReactNode) =>
      React.Children.map(children, child => (React.isValidElement(child) ? React.cloneElement(child) : child))
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item render={props => <div {...props}>{cloneChildren(props.children)}</div>}>
            Archive
            <ActionMenu.Description>Archive details</ActionMenu.Description>
          </ActionMenu.Item>
          <ActionMenu.CheckboxItem render={props => <div {...props}>{cloneChildren(props.children)}</div>}>
            Watch
            <ActionMenu.Description>Watch details</ActionMenu.Description>
          </ActionMenu.CheckboxItem>
          <ActionMenu.RadioGroup>
            <ActionMenu.RadioItem
              value="private"
              render={props => <div {...props}>{cloneChildren(props.children)}</div>}
            >
              Private
              <ActionMenu.Description>Private details</ActionMenu.Description>
            </ActionMenu.RadioItem>
          </ActionMenu.RadioGroup>
          <ActionMenu.LinkItem href="#settings" render={props => <a {...props}>{cloneChildren(props.children)}</a>}>
            Settings
            <ActionMenu.Description>Settings details</ActionMenu.Description>
          </ActionMenu.LinkItem>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    expect(screen.getByRole('menuitem', {name: 'Archive'})).toHaveAccessibleDescription('Archive details')
    expect(screen.getByRole('menuitemcheckbox', {name: 'Watch'})).toHaveAccessibleDescription('Watch details')
    expect(screen.getByRole('menuitemradio', {name: 'Private'})).toHaveAccessibleDescription('Private details')
    expect(screen.getByRole('menuitem', {name: 'Settings'})).toHaveAccessibleDescription('Settings details')
  })

  it('associates fragment descriptions and preserves unavailable and loading information', () => {
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item inactiveText="Requires admin access">
            Transfer
            <>
              <ActionMenu.Description>Change the owner</ActionMenu.Description>
              <ActionMenu.Description aria-hidden="true">Decorative detail</ActionMenu.Description>
              <ActionMenu.Description hidden>Hidden detail</ActionMenu.Description>
            </>
          </ActionMenu.Item>
          <ActionMenu.Item loading loadingText="Saving changes">
            Save
            <ActionMenu.Description>Update the repository</ActionMenu.Description>
          </ActionMenu.Item>
          <ActionMenu.LinkItem
            aria-describedby="link-note"
            aria-label="Billing settings"
            href="#billing"
            inactiveText="Requires billing access"
          >
            Billing
            <ActionMenu.Description id="link-note">Manage billing</ActionMenu.Description>
          </ActionMenu.LinkItem>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    expect(screen.getByRole('menuitem', {name: 'Transfer'})).toHaveAccessibleDescription(
      'Change the owner Requires admin access',
    )
    expect(screen.getByRole('menuitem', {name: 'Save Saving changes'})).toHaveAccessibleDescription(
      'Update the repository',
    )
    expect(screen.getByRole('menuitem', {name: 'Billing settings'})).toHaveAccessibleDescription(
      'Manage billing Requires billing access',
    )
  })

  it('associates inactive reasons without descriptions and preserves explicit names and references', () => {
    render(
      <>
        <span id="inactive-context">Contact an administrator</span>
        <span id="inactive-name">External action</span>
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Actions</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Item aria-describedby="inactive-context" inactiveText="Requires access">
              Transfer
              <ActionMenu.TrailingVisual>Ready</ActionMenu.TrailingVisual>
            </ActionMenu.Item>
            <ActionMenu.Item aria-label="Custom action" inactiveText="Temporarily unavailable">
              Archive
            </ActionMenu.Item>
            <ActionMenu.LinkItem aria-labelledby="inactive-name" href="#settings" inactiveText="Requires billing">
              Billing
            </ActionMenu.LinkItem>
            <ActionMenu.Item inactiveText="Permission required" loading loadingText="Saving changes">
              Save
            </ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      </>,
    )

    expect(screen.getByRole('menuitem', {name: 'Transfer Ready'})).toHaveAccessibleDescription(
      'Contact an administrator Requires access',
    )
    expect(screen.getByRole('menuitem', {name: 'Custom action'})).toHaveAccessibleDescription('Temporarily unavailable')
    expect(screen.getByRole('menuitem', {name: 'External action'})).toHaveAccessibleDescription('Requires billing')
    expect(screen.getByRole('menuitem', {name: 'Save Saving changes'})).toHaveAccessibleDescription(
      'Permission required',
    )
  })

  it('preserves explicit titles and string inactive-reason fallbacks', () => {
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item inactiveText="Requires access" title="Custom text title">
            Transfer
          </ActionMenu.Item>
          <ActionMenu.Item inactiveText={<span>Requires approval</span>} title="Custom node title">
            Archive
          </ActionMenu.Item>
          <ActionMenu.Item inactiveText="Requires ownership">Delete</ActionMenu.Item>
          <ActionMenu.Item inactiveText="Requires access" title="">
            Update
          </ActionMenu.Item>
          <ActionMenu.Item inactiveText={<span>Contact an owner</span>}>Rename</ActionMenu.Item>
          <ActionMenu.LinkItem href="#billing" inactiveText="Requires billing" title="Custom link title">
            Billing
          </ActionMenu.LinkItem>
          <ActionMenu.LinkItem href="#projects" inactiveText="Requires project access">
            Projects
          </ActionMenu.LinkItem>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    const transfer = screen.getByRole('menuitem', {name: 'Transfer'})
    expect(transfer).toHaveAttribute('title', 'Custom text title')
    expect(transfer).toHaveAccessibleDescription('Requires access')
    const archive = screen.getByRole('menuitem', {name: 'Archive'})
    expect(archive).toHaveAttribute('title', 'Custom node title')
    expect(archive).toHaveAccessibleDescription('Requires approval')
    expect(screen.getByRole('menuitem', {name: 'Delete'})).toHaveAttribute('title', 'Requires ownership')
    expect(screen.getByRole('menuitem', {name: 'Update'})).toHaveAttribute('title', '')
    expect(screen.getByRole('menuitem', {name: 'Rename'})).not.toHaveAttribute('title')
    expect(screen.getByRole('menuitem', {name: 'Billing'})).toHaveAttribute('title', 'Custom link title')
    expect(screen.getByRole('menuitem', {name: 'Projects'})).toHaveAttribute('title', 'Requires project access')
  })

  it('updates inactive reason references when availability changes', () => {
    const menu = (inactive: boolean) => (
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item inactiveText={inactive ? 'Requires access' : undefined}>Transfer</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
    )
    const {rerender} = render(menu(false))
    const item = screen.getByRole('menuitem', {name: 'Transfer'})
    expect(item).not.toHaveAttribute('aria-describedby')
    expect(item).not.toHaveAttribute('title')
    rerender(menu(true))
    expect(item).toHaveAccessibleName('Transfer')
    expect(item).toHaveAccessibleDescription('Requires access')
    expect(item).toHaveAttribute('title', 'Requires access')
    const reasonId = item.getAttribute('aria-describedby')
    rerender(menu(false))
    expect(item).toHaveAccessibleName('Transfer')
    expect(item).not.toHaveAttribute('aria-describedby')
    expect(item).not.toHaveAttribute('title')
    expect(reasonId && document.getElementById(reasonId)).toBeNull()
  })

  it('keeps inactive reason references aligned with custom-rendered item content', () => {
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item
            inactiveText="Requires access"
            nativeButton
            render={props => <button {...props} aria-label="Custom action" type="button" />}
          >
            Transfer
          </ActionMenu.Item>
          <ActionMenu.Item
            inactiveText="Other reason"
            nativeButton
            render={props => (
              <button {...props} type="button">
                Replacement
              </button>
            )}
          >
            Original
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    expect(screen.getByRole('menuitem', {name: 'Custom action'})).toHaveAccessibleDescription('Requires access')
    const replacement = screen.getByRole('menuitem', {name: 'Replacement'})
    expect(replacement).not.toHaveAttribute('aria-describedby')
    expect(replacement).not.toHaveAttribute('aria-labelledby')
  })

  it('does not activate rendered inactive or disabled items', () => {
    const onClick = vi.fn()
    const onRenderedClick = vi.fn()
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item
            inactiveText="Requires access"
            nativeButton
            onClick={onClick}
            render={<button onClick={onRenderedClick} type="button" />}
          >
            Transfer
          </ActionMenu.Item>
          <ActionMenu.CheckboxItem
            disabled
            nativeButton
            onClick={onClick}
            render={<button onClick={onRenderedClick} type="button" />}
          >
            Watch
          </ActionMenu.CheckboxItem>
          <ActionMenu.RadioGroup value="light">
            <ActionMenu.RadioItem
              disabled
              nativeButton
              onClick={onClick}
              render={<button onClick={onRenderedClick} type="button" />}
              value="dark"
            >
              Dark
            </ActionMenu.RadioItem>
          </ActionMenu.RadioGroup>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    fireEvent.click(screen.getByRole('menuitem', {name: 'Transfer'}))
    fireEvent.click(screen.getByRole('menuitemcheckbox', {name: 'Watch'}))
    fireEvent.click(screen.getByRole('menuitemradio', {name: 'Dark'}))
    expect(onClick).not.toHaveBeenCalled()
    expect(onRenderedClick).not.toHaveBeenCalled()
  })

  it('prevents internal custom-render activation for inactive and disabled menu items', () => {
    const onInternalClick = vi.fn()
    const onInternalAuxClick = vi.fn()
    const onInternalKeyDown = vi.fn()
    const onInternalKeyUp = vi.fn()
    const onClickCapture = vi.fn()
    const onAuxClickCapture = vi.fn()
    const onKeyDownCapture = vi.fn()
    const onKeyUpCapture = vi.fn()
    const InternalButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
      function InternalButton({onAuxClick, onClick, onKeyDown, onKeyUp, ...props}, ref) {
        return (
          <button
            {...props}
            ref={ref}
            type="button"
            onAuxClick={event => {
              onAuxClick?.(event)
              onInternalAuxClick()
            }}
            onClick={event => {
              onClick?.(event)
              onInternalClick()
            }}
            onKeyDown={event => {
              onKeyDown?.(event)
              if (event.key === 'Enter' || event.key === ' ') onInternalKeyDown()
            }}
            onKeyUp={event => {
              onKeyUp?.(event)
              if (event.key === 'Enter' || event.key === ' ') onInternalKeyUp()
            }}
          />
        )
      },
    )
    const menu = (inactive: boolean) => (
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item
            closeOnClick={false}
            inactiveText={inactive ? 'Requires access' : undefined}
            nativeButton
            onAuxClickCapture={onAuxClickCapture}
            onClickCapture={onClickCapture}
            onKeyDownCapture={onKeyDownCapture}
            onKeyUpCapture={onKeyUpCapture}
            render={<InternalButton />}
          >
            Transfer
          </ActionMenu.Item>
          <ActionMenu.CheckboxItem disabled nativeButton render={<InternalButton />}>
            Watch
          </ActionMenu.CheckboxItem>
          <ActionMenu.RadioGroup value="light">
            <ActionMenu.RadioItem disabled nativeButton render={<InternalButton />} value="dark">
              Dark
            </ActionMenu.RadioItem>
          </ActionMenu.RadioGroup>
          <ActionMenu.Submenu>
            <ActionMenu.SubmenuTrigger disabled nativeButton render={<InternalButton />}>
              More
            </ActionMenu.SubmenuTrigger>
            <ActionMenu.Content>
              <ActionMenu.Item>Nested</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>
    )
    const {rerender} = render(menu(true))
    const item = screen.getByRole('menuitem', {name: 'Transfer'})
    const disabledItems = [
      item,
      screen.getByRole('menuitemcheckbox', {name: 'Watch'}),
      screen.getByRole('menuitemradio', {name: 'Dark'}),
      screen.getByRole('menuitem', {name: 'More'}),
    ]
    for (const disabledItem of disabledItems) {
      expect(fireEvent.click(disabledItem)).toBe(false)
      expect(fireEvent(disabledItem, new MouseEvent('auxclick', {bubbles: true, button: 1, cancelable: true}))).toBe(
        false,
      )
      expect(fireEvent.keyDown(disabledItem, {key: 'Enter'})).toBe(false)
      expect(fireEvent.keyDown(disabledItem, {key: ' '})).toBe(false)
      expect(fireEvent.keyUp(disabledItem, {key: 'Enter'})).toBe(false)
      expect(fireEvent.keyUp(disabledItem, {key: ' '})).toBe(false)
    }
    fireEvent.keyDown(item, {key: 'ArrowDown'})
    fireEvent.keyUp(item, {key: 'Shift'})
    expect(onKeyDownCapture).toHaveBeenCalledOnce()
    expect(onKeyUpCapture).toHaveBeenCalledOnce()
    expect(onClickCapture).not.toHaveBeenCalled()
    expect(onAuxClickCapture).not.toHaveBeenCalled()
    expect(onInternalClick).not.toHaveBeenCalled()
    expect(onInternalAuxClick).not.toHaveBeenCalled()
    expect(onInternalKeyDown).not.toHaveBeenCalled()
    expect(onInternalKeyUp).not.toHaveBeenCalled()

    rerender(menu(false))
    fireEvent.keyDown(item, {key: 'Enter'})
    fireEvent.keyUp(item, {key: 'Enter'})
    fireEvent(item, new MouseEvent('auxclick', {bubbles: true, button: 1, cancelable: true}))
    fireEvent.click(item)
    expect(onKeyDownCapture).toHaveBeenCalledTimes(2)
    expect(onKeyUpCapture).toHaveBeenCalledTimes(2)
    expect(onAuxClickCapture).toHaveBeenCalledOnce()
    expect(onClickCapture).toHaveBeenCalledOnce()
    expect(onInternalKeyDown).toHaveBeenCalledOnce()
    expect(onInternalKeyUp).toHaveBeenCalledOnce()
    expect(onInternalAuxClick).toHaveBeenCalledOnce()
    expect(onInternalClick).toHaveBeenCalledOnce()
  })

  it('guards capture handlers supplied by disabled render elements and callbacks', () => {
    const onItemKeyDownCapture = vi.fn()
    const onItemKeyUpCapture = vi.fn()
    const onRenderedClickCapture = vi.fn()
    const onRenderedAuxClickCapture = vi.fn()
    const onRenderedKeyDownCapture = vi.fn()
    const onRenderedKeyUpCapture = vi.fn()
    const renderedHandlers = {
      onAuxClickCapture: onRenderedAuxClickCapture,
      onClickCapture: onRenderedClickCapture,
      onKeyDownCapture: onRenderedKeyDownCapture,
      onKeyUpCapture: onRenderedKeyUpCapture,
    }
    const ref = React.createRef<HTMLElement>()
    const menu = (inactive: boolean) => (
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item
            closeOnClick={false}
            inactiveText={inactive ? 'Requires access' : undefined}
            nativeButton
            onKeyDownCapture={onItemKeyDownCapture}
            onKeyUpCapture={onItemKeyUpCapture}
            ref={ref}
            render={<button {...renderedHandlers} type="button" />}
          >
            Element
          </ActionMenu.Item>
          <ActionMenu.Item
            inactiveText={inactive ? 'Requires access' : undefined}
            nativeButton
            render={props => <button {...props} {...renderedHandlers} type="button" />}
          >
            Callback
          </ActionMenu.Item>
          <ActionMenu.CheckboxItem disabled nativeButton render={<button {...renderedHandlers} type="button" />}>
            Watch
          </ActionMenu.CheckboxItem>
          <ActionMenu.RadioGroup value="light">
            <ActionMenu.RadioItem
              disabled
              nativeButton
              render={<button {...renderedHandlers} type="button" />}
              value="dark"
            >
              Dark
            </ActionMenu.RadioItem>
          </ActionMenu.RadioGroup>
          <ActionMenu.Submenu>
            <ActionMenu.SubmenuTrigger disabled nativeButton render={<button {...renderedHandlers} type="button" />}>
              More
            </ActionMenu.SubmenuTrigger>
            <ActionMenu.Content>
              <ActionMenu.Item>Nested</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>
    )
    const {rerender} = render(menu(true))
    const element = screen.getByRole('menuitem', {name: 'Element'})
    const items = [
      element,
      screen.getByRole('menuitem', {name: 'Callback'}),
      screen.getByRole('menuitemcheckbox', {name: 'Watch'}),
      screen.getByRole('menuitemradio', {name: 'Dark'}),
      screen.getByRole('menuitem', {name: 'More'}),
    ]
    expect(ref.current).toBe(element)
    for (const item of items) {
      expect(fireEvent.click(item)).toBe(false)
      expect(fireEvent(item, new MouseEvent('auxclick', {bubbles: true, button: 1, cancelable: true}))).toBe(false)
      expect(fireEvent.keyDown(item, {key: 'Enter'})).toBe(false)
      expect(fireEvent.keyDown(item, {key: ' '})).toBe(false)
      expect(fireEvent.keyUp(item, {key: 'Enter'})).toBe(false)
      expect(fireEvent.keyUp(item, {key: ' '})).toBe(false)
      fireEvent.keyDown(item, {key: 'ArrowDown'})
      fireEvent.keyUp(item, {key: 'Shift'})
    }
    expect(onRenderedClickCapture).not.toHaveBeenCalled()
    expect(onRenderedAuxClickCapture).not.toHaveBeenCalled()
    expect(onRenderedKeyDownCapture).toHaveBeenCalledTimes(items.length)
    expect(onRenderedKeyUpCapture).toHaveBeenCalledTimes(items.length)
    expect(onItemKeyDownCapture).toHaveBeenCalledOnce()
    expect(onItemKeyUpCapture).toHaveBeenCalledOnce()

    rerender(menu(false))
    expect(ref.current).toBe(element)
    fireEvent.keyDown(element, {key: 'Enter'})
    fireEvent.keyUp(element, {key: 'Enter'})
    fireEvent(element, new MouseEvent('auxclick', {bubbles: true, button: 1, cancelable: true}))
    fireEvent.click(element)
    expect(onRenderedClickCapture).toHaveBeenCalledOnce()
    expect(onRenderedAuxClickCapture).toHaveBeenCalledOnce()
    expect(onRenderedKeyDownCapture).toHaveBeenCalledTimes(items.length + 1)
    expect(onRenderedKeyUpCapture).toHaveBeenCalledTimes(items.length + 1)
    expect(onItemKeyDownCapture).toHaveBeenCalledTimes(2)
    expect(onItemKeyUpCapture).toHaveBeenCalledTimes(2)
  })

  it('updates item associations when descriptions appear and disappear', () => {
    const ref = React.createRef<HTMLElement>()
    const menu = (showDescription: boolean) => (
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item ref={ref}>
            Archive
            {showDescription ? <ActionMenu.Description>Move out of active lists</ActionMenu.Description> : null}
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
    )
    const {rerender} = render(menu(false))
    const item = screen.getByRole('menuitem', {name: 'Archive'})
    expect(ref.current).toBe(item)
    expect(item).not.toHaveAttribute('aria-describedby')

    rerender(menu(true))
    expect(ref.current).toBe(item)
    expect(item).toHaveAccessibleName('Archive')
    expect(item).toHaveAccessibleDescription('Move out of active lists')
    const describedBy = item.getAttribute('aria-describedby')

    rerender(menu(false))
    expect(item).toHaveAccessibleName('Archive')
    expect(item).not.toHaveAttribute('aria-describedby')
    expect(describedBy && document.getElementById(describedBy)).toBeNull()
  })

  it('preserves refs, composed click handlers, and keyboard activation for rendered items with descriptions', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLElement>()
    const onClick = vi.fn()
    const onRenderedClick = vi.fn()
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item
            ref={ref}
            closeOnClick={false}
            nativeButton
            onClick={onClick}
            render={<button type="button" onClick={onRenderedClick} />}
          >
            Archive
            <ActionMenu.Description>Move out of active lists</ActionMenu.Description>
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    const item = screen.getByRole('menuitem', {name: 'Archive'})
    expect(ref.current).toBe(item)
    expect(item).toHaveAccessibleDescription('Move out of active lists')
    item.focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledOnce()
    expect(onRenderedClick).toHaveBeenCalledOnce()
    expect(screen.getByRole('menu')).toBeVisible()
  })

  it('hydrates an initially open horizontal menu and associates item descriptions', async () => {
    const app = (
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content portal={false} side="left">
          <ActionMenu.Item>
            Archive
            <ActionMenu.Description>Move out of active lists</ActionMenu.Description>
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(app)
    document.body.append(container)
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      const serverTrigger = container.querySelector('[data-component="ActionMenu.Button"]')
      expect(serverTrigger).toHaveAccessibleName('Actions')
      const serverTriggerId = serverTrigger?.id
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      const item = await screen.findByRole('menuitem', {name: 'Archive'})
      expect(item).toHaveAccessibleDescription('Move out of active lists')
      expect(screen.getByRole('button', {name: 'Actions'})).toHaveAttribute('id', serverTriggerId)
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('exposes disabled items and prevents pointer and keyboard activation', async () => {
    const user = userEvent.setup()
    const onDisabledClick = vi.fn()
    const onExplicitAriaDisabledClick = vi.fn()
    const onInactiveClick = vi.fn()
    const onLoadingClick = vi.fn()
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item>First</ActionMenu.Item>
          <ActionMenu.Item disabled onClick={onDisabledClick}>
            Disabled
          </ActionMenu.Item>
          <ActionMenu.Item disabled aria-disabled={true} onClick={onExplicitAriaDisabledClick}>
            Disabled with explicit ARIA
          </ActionMenu.Item>
          <ActionMenu.Item inactiveText="Not available" onClick={onInactiveClick}>
            Inactive
          </ActionMenu.Item>
          <ActionMenu.Item loading onClick={onLoadingClick}>
            Loading
          </ActionMenu.Item>
          <ActionMenu.Item>Last</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    const first = screen.getByRole('menuitem', {name: 'First'})
    const disabled = screen.getByRole('menuitem', {name: 'Disabled'})
    const explicitlyDisabled = screen.getByRole('menuitem', {name: 'Disabled with explicit ARIA'})
    const inactive = screen.getByRole('menuitem', {name: /Inactive/})
    const loading = screen.getByRole('menuitem', {name: 'Loading'})

    expect(first).not.toHaveAttribute('aria-disabled', 'true')
    for (const item of [disabled, explicitlyDisabled, inactive, loading]) {
      expect(item).toHaveAttribute('aria-disabled', 'true')
      expect(item).toHaveAttribute('data-disabled')
      fireEvent.click(item)
    }

    first.focus()
    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(disabled).toHaveFocus())
    await user.keyboard('{Enter}{Space}')
    expect(onDisabledClick).not.toHaveBeenCalled()
    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(explicitlyDisabled).toHaveFocus())
    await user.keyboard('{Enter}{Space}')
    expect(onExplicitAriaDisabledClick).not.toHaveBeenCalled()
    expect(onInactiveClick).not.toHaveBeenCalled()
    expect(onLoadingClick).not.toHaveBeenCalled()
    expect(screen.getByRole('menu')).toBeVisible()
  })

  it('exposes disabled checkbox, radio, and submenu items', () => {
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.CheckboxItem disabled>Watch</ActionMenu.CheckboxItem>
          <ActionMenu.RadioGroup value="dark">
            <ActionMenu.RadioItem disabled value="light">
              Light
            </ActionMenu.RadioItem>
          </ActionMenu.RadioGroup>
          <ActionMenu.Submenu>
            <ActionMenu.SubmenuTrigger disabled>More</ActionMenu.SubmenuTrigger>
            <ActionMenu.Content>
              <ActionMenu.Item>Nested</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    expect(screen.getByRole('menuitemcheckbox', {name: 'Watch'})).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('menuitemradio', {name: 'Light'})).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('menuitem', {name: 'More'})).toHaveAttribute('aria-disabled', 'true')
  })

  it('preserves disabled semantics when an item renders as a native button', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item disabled nativeButton onClick={onClick} render={<button type="button" />}>
            Unavailable
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    const item = screen.getByRole('menuitem', {name: 'Unavailable'})
    expect(item.tagName).toBe('BUTTON')
    expect(item).toHaveAttribute('aria-disabled', 'true')
    await user.click(item)
    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('menu')).toBeVisible()
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

  it('preserves controlled current-model selection when a submenu opens and closes', async () => {
    const user = userEvent.setup()
    const onTierSelected = vi.fn()
    const triggerRef = React.createRef<HTMLElement>()
    const fixture = (selected: boolean) => (
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Models</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Submenu>
            <ActionMenu.SubmenuTrigger
              ref={triggerRef}
              role="menuitemradio"
              aria-checked={selected}
              selected={selected}
            >
              <ActionMenu.LeadingVisual>
                <GearIcon />
              </ActionMenu.LeadingVisual>
              Auto
              <ActionMenu.Description variant="block">Optimized for your task</ActionMenu.Description>
              <ActionMenu.TrailingVisual>Current model</ActionMenu.TrailingVisual>
            </ActionMenu.SubmenuTrigger>
            <ActionMenu.Content>
              <ActionMenu.Item onClick={() => onTierSelected('fast')}>Fast tier</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>
    )
    const {rerender} = render(fixture(false))
    const trigger = screen.getByRole('menuitemradio', {name: 'Auto Current model'})
    expect(trigger).toHaveAccessibleDescription('Optimized for your task')
    expect(triggerRef.current).toBe(trigger)
    expect(trigger).toHaveAttribute('aria-checked', 'false')
    const selection = trigger.querySelector('[data-component="ActionList.Selection"]')
    expect(selection).toBeInTheDocument()
    expect(selection?.querySelector('svg')).not.toBeVisible()
    act(() => trigger.focus())
    await user.keyboard('{ArrowRight}')
    expect(await screen.findByRole('menuitem', {name: 'Fast tier'})).toBeVisible()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-checked', 'false')
    expect(onTierSelected).not.toHaveBeenCalled()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(trigger).toHaveAttribute('aria-checked', 'false')
    rerender(fixture(true))
    expect(trigger).toHaveAttribute('aria-checked', 'true')
    expect(trigger).toHaveAttribute('data-selected', 'true')
    expect(selection?.querySelector('svg')).toBeVisible()
    await user.keyboard('{ArrowRight}')
    await user.click(await screen.findByRole('menuitem', {name: 'Fast tier'}))
    expect(onTierSelected).toHaveBeenCalledExactlyOnceWith('fast')
  })

  it('keeps visual selection separate from submenu semantics', () => {
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Models</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Submenu>
            <ActionMenu.SubmenuTrigger selected>Auto</ActionMenu.SubmenuTrigger>
            <ActionMenu.Content>
              <ActionMenu.Item>Fast tier</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>,
    )
    const trigger = screen.getByRole('menuitem', {name: 'Auto'})
    expect(trigger).toHaveAttribute('data-selected', 'true')
    expect(trigger).not.toHaveAttribute('aria-checked')
    expect(trigger).not.toHaveAttribute('selected')
  })

  it.each(['root', 'submenu'])('honors explicit popup names in a %s menu', async kind => {
    const fixture = (nameProps: React.AriaAttributes) => (
      <>
        <span id="explicit-menu-name">Referenced name</span>
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Models</ActionMenu.Button>
          {kind === 'root' ? (
            <ActionMenu.Content {...nameProps}>
              <ActionMenu.Item>Fast tier</ActionMenu.Item>
            </ActionMenu.Content>
          ) : (
            <ActionMenu.Content aria-label="Parent menu">
              <ActionMenu.Submenu defaultOpen>
                <ActionMenu.SubmenuTrigger>Auto</ActionMenu.SubmenuTrigger>
                <ActionMenu.Content {...nameProps}>
                  <ActionMenu.Item>Fast tier</ActionMenu.Item>
                </ActionMenu.Content>
              </ActionMenu.Submenu>
            </ActionMenu.Content>
          )}
        </ActionMenu>
      </>
    )
    const {rerender} = render(fixture({'aria-label': 'Optimization'}))
    expect(await screen.findByRole('menu', {name: 'Optimization'})).not.toHaveAttribute('aria-labelledby')
    rerender(fixture({'aria-label': 'Optimization', 'aria-labelledby': 'explicit-menu-name'}))
    expect(await screen.findByRole('menu', {name: 'Referenced name'})).toHaveAttribute(
      'aria-labelledby',
      'explicit-menu-name',
    )
    rerender(fixture({}))
    expect(await screen.findByRole('menu', {name: kind === 'root' ? 'Models' : 'Auto'})).toHaveAttribute(
      'aria-labelledby',
    )
  })

  it('announces submenu loading text without descriptions and preserves explicit names', () => {
    const fixture = (nameProps: React.AriaAttributes) => (
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Models</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Submenu>
            <ActionMenu.SubmenuTrigger {...nameProps} loading loadingText="Loading tiers">
              Auto
            </ActionMenu.SubmenuTrigger>
            <ActionMenu.Content>
              <ActionMenu.Item>Fast tier</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>
    )
    const {rerender} = render(fixture({}))
    expect(screen.getByRole('menuitem', {name: 'Auto Loading tiers'})).toHaveAttribute('aria-disabled', 'true')
    rerender(fixture({'aria-label': 'Automatic model'}))
    const trigger = screen.getByRole('menuitem', {name: 'Automatic model'})
    expect(trigger).toHaveAccessibleDescription('Loading tiers')
    const loadingTextId = trigger.getAttribute('aria-describedby')
    expect(loadingTextId).toBeTruthy()
    expect(document.getElementById(loadingTextId!)).toHaveTextContent('Loading tiers')
  })

  it.each([
    {inactiveText: 'Requires access'},
    {loading: true, loadingText: 'Loading tiers'},
    {inactiveText: 'Requires access', loading: true, loadingText: 'Loading tiers'},
  ])('describes an unavailable submenu and suppresses custom activation: %j', async unavailableProps => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const onClick = vi.fn()
    const onCapture = vi.fn()
    const triggerRef = React.createRef<HTMLElement>()
    const fixture = (unavailable: boolean) => (
      <>
        <span id="auto-context">Additional context</span>
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Models</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Submenu onOpenChange={onOpenChange}>
              <ActionMenu.SubmenuTrigger
                {...(unavailable ? unavailableProps : {})}
                ref={triggerRef}
                aria-describedby="auto-context"
                data-testid="unavailable-submenu"
                nativeButton
                onClickCapture={onCapture}
                render={<button type="button" onClick={onClick} />}
              >
                Auto
                <ActionMenu.Description variant="block">Optimized for your task</ActionMenu.Description>
              </ActionMenu.SubmenuTrigger>
              <ActionMenu.Content>
                <ActionMenu.Item>Fast tier</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu.Submenu>
          </ActionMenu.Content>
        </ActionMenu>
      </>
    )
    const {rerender} = render(fixture(true))
    const trigger = screen.getByTestId('unavailable-submenu')
    expect(triggerRef.current).toBe(trigger)
    expect(trigger).toHaveAttribute('aria-disabled', 'true')
    expect(trigger).toHaveAccessibleDescription(
      ['Additional context', 'Optimized for your task', unavailableProps.inactiveText].filter(Boolean).join(' '),
    )
    expect(trigger).toHaveAccessibleName(unavailableProps.loadingText ? `Auto ${unavailableProps.loadingText}` : 'Auto')
    for (const id of trigger.getAttribute('aria-describedby')?.split(' ') ?? []) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
    expect(trigger).not.toHaveAttribute('inactiveText')
    expect(trigger).not.toHaveAttribute('loading')
    expect(trigger).not.toHaveAttribute('loadingText')
    for (const event of [
      new MouseEvent('click', {bubbles: true, cancelable: true}),
      new KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true}),
    ]) {
      expect(trigger.dispatchEvent(event)).toBe(false)
    }
    await user.hover(trigger)
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
    expect(onCapture).not.toHaveBeenCalled()
    rerender(fixture(false))
    expect(trigger).not.toHaveAttribute('aria-disabled', 'true')
    expect(trigger).toHaveAccessibleDescription('Additional context Optimized for your task')
    act(() => trigger.focus())
    await user.keyboard('{ArrowRight}')
    expect(await screen.findByRole('menuitem', {name: 'Fast tier'})).toBeVisible()
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('supports an initially open, controlled submenu and restores focus on close', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    function ControlledSubmenu() {
      const [open, setOpen] = React.useState(true)
      return (
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Edit</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Submenu
              open={open}
              onOpenChange={(nextOpen, details) => {
                onOpenChange(nextOpen, details)
                setOpen(nextOpen)
              }}
            >
              <ActionMenu.SubmenuTrigger>More</ActionMenu.SubmenuTrigger>
              <ActionMenu.Content portal={false}>
                <ActionMenu.Item>Plain text</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu.Submenu>
          </ActionMenu.Content>
        </ActionMenu>
      )
    }

    render(<ControlledSubmenu />)
    expect(await screen.findByRole('menuitem', {name: 'Plain text'})).toBeVisible()
    await user.keyboard('{Escape}')
    const trigger = screen.getByRole('menuitem', {name: 'More'})
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
    await user.keyboard('{ArrowRight}')
    expect(await screen.findByRole('menuitem', {name: 'Plain text'})).toBeVisible()
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('hydrates an initially open inline submenu without a mismatch', async () => {
    const app = (
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Edit</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Submenu defaultOpen>
            <ActionMenu.SubmenuTrigger>More</ActionMenu.SubmenuTrigger>
            <ActionMenu.Content portal={false}>
              <ActionMenu.Item>Plain text</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(app)
    document.body.append(container)
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      expect(await screen.findByRole('menuitem', {name: 'Plain text'})).toBeVisible()
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('lets an asynchronous nested action close its owning menu through actionsRef', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const actionsRef: React.RefObject<Menu.Root.Actions | null> = {current: null}
    let finishSelection: () => void = () => {}
    const selection = new Promise<void>(resolve => {
      finishSelection = resolve
    })

    render(
      <ActionMenu defaultOpen actionsRef={actionsRef} onOpenChange={onOpenChange}>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item
            closeOnClick={false}
            onClick={async () => {
              await selection
              actionsRef.current?.close()
            }}
          >
            Choose asynchronously
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    await user.click(screen.getByRole('menuitem', {name: 'Choose asynchronously'}))
    expect(screen.getByRole('menu')).toBeVisible()
    await act(async () => {
      finishSelection()
      await selection
    })
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.objectContaining({reason: 'imperative-action'}))
    expect(screen.getByRole('button', {name: 'Actions'})).toHaveFocus()
  })

  it('preserves submenu trigger refs, custom rendering, and explicit names', async () => {
    const user = userEvent.setup()
    const triggerRef = React.createRef<HTMLElement>()
    render(
      <React.StrictMode>
        <span id="more-actions">More actions</span>
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Edit</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Submenu>
              <ActionMenu.SubmenuTrigger
                ref={triggerRef}
                aria-labelledby="more-actions"
                data-testid="submenu-trigger"
                nativeButton
                render={<button type="button" />}
              >
                More
              </ActionMenu.SubmenuTrigger>
              <ActionMenu.Content>
                <ActionMenu.Item>Plain text</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu.Submenu>
          </ActionMenu.Content>
        </ActionMenu>
      </React.StrictMode>,
    )

    const trigger = screen.getByRole('menuitem', {name: 'More actions'})
    expect(triggerRef.current).toBe(trigger)
    expect(trigger).toHaveAttribute('data-testid', 'submenu-trigger')
    expect(trigger.tagName).toBe('BUTTON')
    trigger.focus()
    await user.keyboard('{ArrowRight}')
    expect(await screen.findByRole('menuitem', {name: 'Plain text'})).toBeVisible()
    expect(trigger).toHaveAccessibleName('More actions')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('preserves ARIA attributes supplied on a rendered submenu trigger', async () => {
    const user = userEvent.setup()
    render(
      <>
        <span id="consumer-owned">Additional content</span>
        <span id="consumer-label">More actions</span>
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Edit</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Submenu>
              <ActionMenu.SubmenuTrigger
                nativeButton
                render={<button type="button" aria-labelledby="consumer-label" aria-owns="consumer-owned" />}
              >
                More
              </ActionMenu.SubmenuTrigger>
              <ActionMenu.Content aria-labelledby="consumer-label">
                <ActionMenu.Item>Plain text</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu.Submenu>
          </ActionMenu.Content>
        </ActionMenu>
      </>,
    )

    const trigger = screen.getByRole('menuitem', {name: 'More actions'})
    expect(trigger).toHaveAttribute('aria-labelledby', 'consumer-label')
    expect(trigger).toHaveAttribute('aria-owns', 'consumer-owned')
    trigger.focus()
    await user.keyboard('{ArrowRight}')
    const item = await screen.findByRole('menuitem', {name: 'Plain text'})
    expect(item.closest('[role="menu"]')).toHaveAccessibleName('More actions')
    expect(trigger).toHaveAccessibleName('More actions')
  })

  it('uses an aria-label supplied on the rendered trigger to name the submenu', async () => {
    const user = userEvent.setup()
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Edit</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Submenu>
            <ActionMenu.SubmenuTrigger nativeButton render={<button type="button" aria-label="More actions" />}>
              More
            </ActionMenu.SubmenuTrigger>
            <ActionMenu.Content>
              <ActionMenu.Item>Plain text</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    const trigger = screen.getByRole('menuitem', {name: 'More actions'})
    trigger.focus()
    await user.keyboard('{ArrowRight}')
    expect(await screen.findByRole('menu', {name: 'More actions'})).toBeVisible()
    expect(trigger).toHaveAccessibleName('More actions')
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
    const inactiveLink = screen.getByRole('menuitem', {name: 'Billing'})
    expect(inactiveLink.tagName).toBe('A')
    expect(inactiveLink).not.toHaveAttribute('href')
    expect(inactiveLink).toHaveAttribute('data-component', 'ActionMenu.LinkItem')
    expect(inactiveLink).toHaveAttribute('aria-disabled', 'true')
    expect(inactiveLink).toHaveAccessibleDescription('Requires billing access')

    await user.click(link)
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('preserves inactive link DOM props and its anchor ref without allowing activation', () => {
    const ref = React.createRef<HTMLAnchorElement>()
    const routerRef = React.createRef<HTMLAnchorElement>()
    const onClick = vi.fn()
    const onClickCapture = vi.fn()
    const onAuxClickCapture = vi.fn()
    const onFocus = vi.fn()
    const onKeyDownCapture = vi.fn()
    const onKeyUpCapture = vi.fn()
    render(
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Links</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.LinkItem
            aria-disabled={false}
            data-testid="billing-link"
            href="#billing"
            inactiveText="Requires billing access"
            onAuxClickCapture={onAuxClickCapture}
            onClick={onClick}
            onClickCapture={onClickCapture}
            onFocus={onFocus}
            onKeyDownCapture={onKeyDownCapture}
            onKeyUpCapture={onKeyUpCapture}
            ref={ref}
            // The render element receives its children from LinkItem when active.
            // eslint-disable-next-line jsx-a11y/anchor-has-content
            render={<a href="#router-billing" ref={routerRef} />}
          >
            Billing
          </ActionMenu.LinkItem>
        </ActionMenu.Content>
      </ActionMenu>,
    )

    const item = screen.getByRole('menuitem', {name: 'Billing'})
    expect(item).toBe(screen.getByTestId('billing-link'))
    expect(ref.current).toBe(item)
    expect(routerRef.current).toBeNull()
    expect(item.tagName).toBe('A')
    expect(item).not.toHaveAttribute('href')
    expect(item).toHaveAttribute('aria-disabled', 'true')
    expect(item).toHaveAccessibleDescription('Requires billing access')
    act(() => screen.getByRole('menu').focus())
    onFocus.mockClear()
    act(() => item.focus())
    expect(onFocus).toHaveBeenCalledOnce()
    fireEvent.keyDown(item, {key: 'Shift'})
    fireEvent.keyUp(item, {key: 'Shift'})
    fireEvent.keyDown(item, {key: 'Enter'})
    fireEvent.keyUp(item, {key: ' '})
    fireEvent.click(item)
    fireEvent(item, new MouseEvent('auxclick', {bubbles: true, cancelable: true, button: 1}))
    expect(onKeyDownCapture).toHaveBeenCalledOnce()
    expect(onKeyUpCapture).toHaveBeenCalledOnce()
    expect(onClickCapture).not.toHaveBeenCalled()
    expect(onAuxClickCapture).not.toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('menu')).toBeInTheDocument()
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
    expect(dividerContainer()).not.toHaveClass('primer:before:-top-[7px]')

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
    expect(dividerContainer()).toHaveClass('primer:before:-top-[7px]')
  })

  describe('narrow fullscreen variant', () => {
    it('preserves submenu Escape dismissal after a consumer cancels Shift+Tab navigation', async () => {
      const user = userEvent.setup()
      const parentChange = vi.fn()
      const submenuChange = vi.fn()
      const lastItem = React.createRef<HTMLElement>()
      render(
        <ActionMenu defaultOpen onOpenChange={parentChange}>
          <ActionMenu.Button>Models</ActionMenu.Button>
          <ActionMenu.Content variant={{narrow: 'fullscreen'}}>
            <ActionMenu.Submenu onOpenChange={submenuChange}>
              <ActionMenu.SubmenuTrigger>Auto</ActionMenu.SubmenuTrigger>
              <ActionMenu.Content
                aria-label="Optimization"
                onKeyDown={event => {
                  if (event.key !== 'Tab' || !event.shiftKey) return
                  event.preventDefault()
                  event.preventBaseUIHandler()
                  lastItem.current?.focus()
                }}
                variant={{narrow: 'fullscreen'}}
              >
                <ActionMenu.Item ref={lastItem}>Intelligence</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu.Submenu>
          </ActionMenu.Content>
        </ActionMenu>,
      )
      const trigger = screen.getByRole('menuitem', {name: 'Auto'})
      await user.click(trigger)
      const submenu = await screen.findByRole('menu', {name: 'Optimization'})
      act(() => submenu.focus())
      await user.keyboard('{Shift>}{Tab}{/Shift}')
      expect(lastItem.current).toHaveFocus()
      expect(submenuChange).not.toHaveBeenCalledWith(false, expect.anything())
      await user.keyboard('{Escape}')
      await waitFor(() => expect(screen.queryByRole('menu', {name: 'Optimization'})).not.toBeInTheDocument())
      expect(trigger).toHaveFocus()

      await user.keyboard('{ArrowRight}')
      const reopened = await screen.findByRole('menu', {name: 'Optimization'})
      const close = within(reopened).getByRole('menuitem', {name: 'Close'})
      await waitFor(() => expect(close).toHaveFocus())
      parentChange.mockClear()
      submenuChange.mockClear()
      await user.keyboard('{Escape}')
      await waitFor(() => expect(screen.queryByRole('menu', {name: 'Optimization'})).not.toBeInTheDocument())
      expect(parentChange).not.toHaveBeenCalled()
      expect(submenuChange).toHaveBeenCalledWith(false, expect.objectContaining({reason: 'escape-key'}))
      expect(screen.getByRole('menu', {name: 'Models'})).toBeVisible()
      expect(trigger).toHaveFocus()
    })

    it('orders the close action before content for Home and End navigation', async () => {
      const user = userEvent.setup()
      render(
        <ActionMenu defaultOpen>
          <ActionMenu.Button>Models</ActionMenu.Button>
          <ActionMenu.Content variant={{narrow: 'fullscreen'}}>
            <ActionMenu.Item>Speed</ActionMenu.Item>
            <ActionMenu.Item>Intelligence</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>,
      )
      const items = screen.getAllByRole('menuitem')
      expect(items.map(item => item.textContent)).toEqual(['', 'Speed', 'Intelligence'])
      expect(items[0]).toHaveAccessibleName('Close')
      act(() => items[1].focus())
      await user.keyboard('{Home}')
      expect(items[0]).toHaveFocus()
      await user.keyboard('{End}')
      expect(items[2]).toHaveFocus()
    })

    it('closes from a close action in the menu', async () => {
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

      const closeButton = screen.getByRole('menuitem', {name: 'Close'})
      expect(closeButton).toHaveAttribute('data-component', 'ActionMenu.CloseButton')
      expect(screen.getByRole('menu')).toContainElement(closeButton)
      expect(screen.getByRole('menu').parentElement).toHaveAttribute('data-responsive', 'fullscreen')

      await user.click(closeButton)
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.objectContaining({reason: 'imperative-action'}))
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
      await user.click(screen.getByRole('menuitem', {name: 'Close'}))
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

      expect(screen.queryByRole('menuitem', {name: 'Close'})).not.toBeInTheDocument()
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
