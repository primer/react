import {ArrowRightIcon} from '@primer/octicons-react'
import React from 'react'
import {cleanup, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {ListContainerContext} from '../../internal/listContainer'
import {FeatureFlags} from '../FeatureFlags'
import {ActionList} from './ActionList'

afterEach(cleanup)

describe('ActionList', () => {
  it('keeps tree items directly owned by their composite widget', () => {
    render(
      <ActionList role="tree" aria-label="Projects" selectionVariant="multiple">
        <ActionList.Item>First</ActionList.Item>
      </ActionList>,
    )
    const item = screen.getByRole('treeitem', {name: 'First'})
    expect(item).toHaveAttribute('aria-selected', 'false')
    expect(item.parentElement).toHaveAttribute('role', 'none')
    expect(item.parentElement?.parentElement).toBe(screen.getByRole('tree', {name: 'Projects'}))
  })

  it('keeps decorative dividers out of ordinary list semantics', () => {
    const {container} = render(
      <ActionList>
        <ActionList.Item>First</ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item>Second</ActionList.Item>
      </ActionList>,
    )
    const divider = container.querySelector('[data-component="ActionList.Divider"]')
    expect(divider).toHaveAttribute('aria-hidden', 'true')
    expect(divider).not.toHaveAttribute('role')
  })

  it('exposes false selection states and semantic separators in a menu', () => {
    render(
      <ActionList role="menu" selectionVariant="multiple">
        <ActionList.Item>First</ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item selected>Second</ActionList.Item>
      </ActionList>,
    )
    expect(screen.getByRole('menuitemcheckbox', {name: 'First'})).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('menuitemcheckbox', {name: 'Second'})).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('separator')).not.toHaveAttribute('aria-hidden')
  })

  it('uses listbox selection semantics and activates an item', async () => {
    const onSelect = vi.fn()
    render(
      <ActionList role="listbox" selectionVariant="single">
        <ActionList.Item selected onSelect={onSelect}>
          Main
        </ActionList.Item>
      </ActionList>,
    )
    const option = screen.getByRole('option', {name: 'Main'})
    expect(option).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(option)
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('renders a checkmark rather than a checkbox for multiple selection inside a menu', () => {
    const {container} = render(
      <>
        <ActionList role="menu" selectionVariant="multiple" aria-label="Menu">
          <ActionList.Item selected>Menu item</ActionList.Item>
        </ActionList>
        <ActionList role="listbox" selectionVariant="multiple" aria-label="Listbox">
          <ActionList.Item selected>Listbox item</ActionList.Item>
        </ActionList>
      </>,
    )

    const [menuSelection, listboxSelection] = container.querySelectorAll('[data-component="ActionList.Selection"]')
    expect(menuSelection.querySelector('svg')).toHaveAttribute('viewBox', '0 0 16 16')
    expect(listboxSelection.querySelector('svg')).toHaveAttribute('viewBox', '0 0 12 9')
  })

  it('draws a radio for each option of a radio list', () => {
    const {container} = render(
      <ActionList role="listbox" selectionVariant="radio" aria-label="Branches">
        <ActionList.Item selected>main</ActionList.Item>
        <ActionList.Item>develop</ActionList.Item>
      </ActionList>,
    )

    const [selected, unselected] = Array.from(
      container.querySelectorAll('[data-component="ActionList.Selection"] > span'),
    )
    expect(selected).toHaveClass('rounded-full')
    expect(selected).toHaveAttribute('data-checked')
    expect(unselected).toHaveClass('rounded-full')
    expect(unselected).not.toHaveAttribute('data-checked')
  })

  it('omits selection indicators from a group that opts out of selection', () => {
    render(
      <ActionList role="listbox" selectionVariant="multiple" aria-label="Labels">
        <ActionList.Group selectionVariant={false}>
          <ActionList.Item>Create label</ActionList.Item>
        </ActionList.Group>
        <ActionList.Group>
          <ActionList.Item>bug</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    const selectionOf = (name: string) =>
      screen.getByRole('option', {name}).querySelector('[data-component="ActionList.Selection"]')
    expect(selectionOf('Create label')).not.toBeInTheDocument()
    expect(selectionOf('bug')).toBeInTheDocument()
  })

  it('renders trailing actions beside the primary item action', () => {
    const {container} = render(
      <ActionList>
        <ActionList.Item>
          Repository settings
          <ActionList.TrailingAction label="Open settings" />
        </ActionList.Item>
      </ActionList>,
    )

    expect(screen.getByRole('button', {name: 'Open settings'})).toBeVisible()
    expect(container.querySelector('button button')).toBeNull()
  })

  it('renders icon-only link trailing actions without visible label text', () => {
    render(
      <ActionList>
        <ActionList.Item>
          Repository settings
          <ActionList.TrailingAction as="a" href="/settings" icon={ArrowRightIcon} label="Open settings" />
        </ActionList.Item>
      </ActionList>,
    )

    expect(screen.getByRole('link', {name: 'Open settings'})).toBeVisible()
    expect(screen.getByText('Open settings')).not.toBeVisible()
  })

  it('gives icon-only link trailing actions the muted icon button look and a label tooltip', async () => {
    const user = userEvent.setup()
    render(
      <ActionList>
        <ActionList.Item>
          Repository settings
          <ActionList.TrailingAction
            as="a"
            href="/settings"
            icon={ArrowRightIcon}
            label="Open settings"
            tooltipDirection="n"
          />
        </ActionList.Item>
      </ActionList>,
    )

    const link = screen.getByRole('link', {name: 'Open settings'})
    expect(link).toHaveClass('text-[var(--button-invisible-iconColor-rest)]')
    await user.tab()
    await user.tab()
    expect(link).toHaveFocus()
    const tooltip = await screen.findByText('Open settings')
    expect(tooltip.closest('[data-side]')).toHaveAttribute('data-side', 'top')
  })

  it('routes ids and ARIA references through icon-only link trailing action tooltips', async () => {
    const user = userEvent.setup()
    render(
      <>
        <p id="settings-note">Opens in the same tab</p>
        <ActionList>
          <ActionList.Item>
            Repository settings
            <ActionList.TrailingAction
              as="a"
              aria-describedby="settings-note"
              href="/settings"
              icon={ArrowRightIcon}
              id="settings-link"
              label="Open settings"
            />
          </ActionList.Item>
        </ActionList>
      </>,
    )

    const link = screen.getByRole('link', {name: 'Open settings'})
    expect(link).toHaveAttribute('id', 'settings-link')
    expect(link).toHaveAccessibleDescription('Opens in the same tab')
    await user.tab()
    await user.tab()
    expect(link).toHaveFocus()
    await waitFor(() => expect(link).toHaveAttribute('data-popup-open'))
  })

  it('keeps disabled items focusable in menus and listboxes but not in plain lists', async () => {
    const onSelect = vi.fn()
    render(
      <>
        <ActionList role="menu" aria-label="Menu">
          <ActionList.Item disabled onSelect={onSelect}>
            Disabled menu item
          </ActionList.Item>
        </ActionList>
        <ActionList role="listbox" aria-label="Listbox" selectionVariant="single">
          <ActionList.Item disabled onSelect={onSelect}>
            Disabled option
          </ActionList.Item>
        </ActionList>
        <ActionList>
          <ActionList.Item disabled onSelect={onSelect}>
            Disabled list item
          </ActionList.Item>
        </ActionList>
      </>,
    )

    const menuItem = screen.getByRole('menuitem', {name: 'Disabled menu item'})
    const option = screen.getByRole('option', {name: 'Disabled option'})
    for (const item of [menuItem, option]) {
      expect(item).toHaveAttribute('aria-disabled', 'true')
      expect(item).not.toBeDisabled()
      item.focus()
      expect(item).toHaveFocus()
      await userEvent.click(item)
    }
    expect(onSelect).not.toHaveBeenCalled()
    expect(screen.getByRole('button', {name: 'Disabled list item'})).toBeDisabled()
  })

  it('normalizes label weight when only some items have descriptions', () => {
    const {container} = render(
      <ActionList>
        <ActionList.Item>Without description</ActionList.Item>
        <ActionList.Item>
          With description<ActionList.Description>Description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    expect(container.querySelector('[data-component="ActionList"]')).toHaveAttribute('data-mixed-descriptions')
  })

  it('keeps selected menu items unfilled and renders inactive supporting text', () => {
    render(
      <ActionList role="menu" selectionVariant="single">
        <ActionList.Item role="menuitem" inactiveText="Unavailable due to an outage">
          Inactive item
        </ActionList.Item>
        <ActionList.Item role="menuitemradio" selected>
          Active item
        </ActionList.Item>
      </ActionList>,
    )

    expect(screen.getByRole('menuitemradio', {name: 'Active item'})).not.toHaveClass('bg-accent-muted')
    expect(screen.getByText('Unavailable due to an outage')).toHaveClass('text-attention')
  })

  it('preserves selection semantics for custom tree roles', () => {
    render(
      <ActionList aria-multiselectable="true" role="tree" selectionVariant="multiple">
        <ActionList.Item role="treeitem" selected>
          Primer React
        </ActionList.Item>
      </ActionList>,
    )

    expect(screen.getByRole('treeitem', {name: 'Primer React'})).toHaveAttribute('aria-selected', 'true')
  })

  it('composes inline and block descriptions without dropping either', () => {
    render(
      <ActionList>
        <ActionList.Item>
          Label
          <ActionList.Description variant="inline">Inline description</ActionList.Description>
          <ActionList.Description variant="block">Block description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    expect(screen.getByText('Inline description')).toBeVisible()
    expect(screen.getByText('Block description')).toBeVisible()
  })

  it('suppresses trailing actions while loading', () => {
    const {container, getByRole} = render(
      <ActionList>
        <ActionList.Item loading loadingText="Loading repository">
          Repository
          <ActionList.TrailingAction label="Open settings" />
        </ActionList.Item>
      </ActionList>,
    )

    expect(getByRole('button', {name: 'RepositoryLoading repository'})).toHaveAttribute('aria-disabled', 'true')
    expect(container.querySelector('[data-component="ActionList.TrailingAction.Button"]')).toBeNull()
  })

  it('marks items whose trailing action is loading', () => {
    const {container} = render(
      <ActionList>
        <ActionList.Item>
          Loading action
          <ActionList.Description>Saving</ActionList.Description>
          <ActionList.TrailingAction label="Save changes" loading />
        </ActionList.Item>
        <ActionList.Item>
          Idle action
          <ActionList.TrailingAction label="Apply settings" />
        </ActionList.Item>
      </ActionList>,
    )

    const [loadingItem, idleItem] = container.querySelectorAll('[data-component="ActionList.Item"]')
    expect(loadingItem).toHaveAttribute('data-trailing-action-loading', 'true')
    expect(idleItem).not.toHaveAttribute('data-trailing-action-loading')
  })

  it('places the loading indicator in the leading visual when present and the trailing visual otherwise', () => {
    render(
      <ActionList>
        <ActionList.Item loading>
          Without visual
          <ActionList.TrailingVisual>⌘K</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item loading>
          <ActionList.LeadingVisual>Icon</ActionList.LeadingVisual>
          With visual
        </ActionList.Item>
      </ActionList>,
    )

    const [withoutVisual, withVisual] = screen.getAllByRole('button')
    const trailingSpinner = withoutVisual.querySelector(
      '[data-component="ActionList.TrailingVisual"] [data-component="Spinner"]',
    )
    expect(trailingSpinner).not.toBeNull()
    expect(withoutVisual).not.toHaveTextContent('⌘K')
    expect(
      withVisual.querySelector('[data-component="ActionList.LeadingVisual"] [data-component="Spinner"]'),
    ).not.toBeNull()
    expect(withVisual).not.toHaveTextContent('Icon')
  })

  it('supports large items and filled group headings', () => {
    const {container} = render(
      <ActionList>
        <ActionList.Group>
          <ActionList.GroupHeading variant="filled">Repositories</ActionList.GroupHeading>
          <ActionList.Item size="large">Primer React</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    expect(container.querySelector('[data-component="ActionList.GroupHeading"]')).toHaveClass('bg-muted')
    expect(container.querySelector('[data-component="ActionList.Item.Action"]')).toHaveClass('py-2.5')
  })

  it('applies GroupHeading className to the heading instead of its layout wrapper', () => {
    const {container} = render(
      <ActionList>
        <ActionList.Group>
          <ActionList.GroupHeading className="custom-group-heading">Repositories</ActionList.GroupHeading>
        </ActionList.Group>
      </ActionList>,
    )

    const heading = within(container).getByRole('heading', {name: 'Repositories'})
    expect(heading).toHaveClass('custom-group-heading')
    expect(heading.parentElement).not.toHaveClass('custom-group-heading')
  })

  it('associates group headings with composite groups', () => {
    const {container} = render(
      <ActionList role="listbox">
        <ActionList.Group>
          <ActionList.GroupHeading>Repositories</ActionList.GroupHeading>
          <ActionList.Item>Primer React</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    const group = within(container).getByRole('group', {name: 'Repositories'})
    expect(group).toBeVisible()
    expect(Array.from(group.children).every(child => child.tagName === 'LI')).toBe(true)
  })

  it('preserves explicit group heading IDs for accessible names', () => {
    const {container} = render(
      <ActionList role="menu">
        <ActionList.Group>
          <ActionList.GroupHeading id="repository-heading">Repositories</ActionList.GroupHeading>
          <ActionList.Item>Primer React</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    expect(within(container).getByRole('group', {name: 'Repositories'})).toHaveAttribute(
      'aria-labelledby',
      'repository-heading',
    )
  })

  it('renders the list heading before the list and uses it as the list name', () => {
    const {container} = render(
      <ActionList>
        <ActionList.Heading as="h2">Details</ActionList.Heading>
        <ActionList.Item>Readme</ActionList.Item>
      </ActionList>,
    )

    const heading = screen.getByRole('heading', {name: 'Details'})
    const list = within(container).getByRole('list', {name: 'Details'})
    expect(heading.nextElementSibling).toBe(list)
    expect(list).not.toContainElement(heading)
  })

  it('preserves an explicit list heading ID', () => {
    const {container} = render(
      <ActionList heading={<ActionList.Heading id="details-heading">Details</ActionList.Heading>}>
        <ActionList.Item>Readme</ActionList.Item>
      </ActionList>,
    )

    expect(within(container).getByRole('list', {name: 'Details'})).toHaveAttribute('aria-labelledby', 'details-heading')
  })

  it('renders a small item with compact padding and a small label', () => {
    render(
      <ActionList>
        <ActionList.Item size="small">Small item</ActionList.Item>
      </ActionList>,
    )

    const item = screen.getByText('Small item')
    expect(item).toHaveClass('text-xs')
    expect(item.closest('[data-size]')).toHaveAttribute('data-size', 'small')
    expect(item.closest('[data-size]')).toHaveClass('py-1')
  })

  it('renders a small link item', () => {
    render(
      <ActionList>
        <ActionList.LinkItem href="#docs" size="small">
          Docs
        </ActionList.LinkItem>
      </ActionList>,
    )

    const link = screen.getByRole('link', {name: 'Docs'})
    expect(link).toHaveAttribute('data-size', 'small')
    expect(link).toHaveClass('py-1')
    expect(screen.getByText('Docs')).toHaveClass('text-xs')
  })

  it('marks an active link item', () => {
    render(
      <ActionList>
        <ActionList.LinkItem href="#docs" active>
          Docs
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(screen.getByRole('link', {name: 'Docs'})).toHaveAttribute('data-active', 'true')
  })

  it('renders an inactive link item as unavailable text', () => {
    render(
      <ActionList>
        <ActionList.LinkItem href="#docs" inactiveText="Unavailable due to an outage">
          Docs
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    const item = screen.getByText('Docs').closest('[data-inactive]')
    expect(item).toHaveAttribute('aria-disabled', 'true')
    expect(item).toHaveTextContent('Unavailable due to an outage')
  })

  describe('item state', () => {
    it('styles the list item that owns each state', () => {
      render(
        <ActionList>
          <ActionList.Item variant="danger">Delete state</ActionList.Item>
          <ActionList.Item active>Current state</ActionList.Item>
          <ActionList.Item active disabled>
            Disabled state
          </ActionList.Item>
          <ActionList.Item inactiveText="Unavailable">Inactive state</ActionList.Item>
          <ActionList.Item loading>Loading state</ActionList.Item>
        </ActionList>,
      )
      const itemFor = (label: string) => screen.getByText(label).closest('li')

      expect(itemFor('Delete state')).toHaveAttribute('data-variant', 'danger')
      expect(itemFor('Delete state')).toHaveClass('hover:bg-[var(--control-danger-bgColor-hover)]')
      expect(itemFor('Current state')).toHaveAttribute('data-active', 'true')
      expect(itemFor('Current state')).toHaveClass(
        'bg-[var(--control-transparent-bgColor-selected)]',
        'after:bg-[var(--borderColor-accent-emphasis)]',
      )
      expect(itemFor('Disabled state')).toHaveAttribute('data-is-disabled', 'true')
      expect(itemFor('Disabled state')).not.toHaveAttribute('data-active')
      expect(itemFor('Disabled state')).not.toHaveClass('bg-[var(--control-transparent-bgColor-selected)]')
      expect(itemFor('Inactive state')).toHaveAttribute('data-inactive', 'true')
      expect(itemFor('Inactive state')).toHaveClass('cursor-not-allowed', 'hover:bg-transparent')
      expect(itemFor('Loading state')).toHaveAttribute('data-loading', 'true')
      expect(itemFor('Loading state')).toHaveClass('[--action-list-item-label-fgColor:var(--fgColor-muted)]')
    })

    it('reads part colors from the item state', () => {
      render(
        <ActionList>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <ArrowRightIcon />
            </ActionList.LeadingVisual>
            Part colors
            <ActionList.Description>Part description</ActionList.Description>
          </ActionList.Item>
        </ActionList>,
      )

      expect(screen.getByText('Part colors')).toHaveClass(
        'text-[var(--action-list-item-label-fgColor,var(--fgColor-default))]',
      )
      expect(screen.getByText('Part description')).toHaveClass(
        'text-[var(--action-list-item-description-fgColor,var(--fgColor-muted))]',
      )
    })

    it('styles a current link item on its list item', () => {
      render(
        <ActionList>
          <ActionList.LinkItem href="#current" active>
            Current link
          </ActionList.LinkItem>
        </ActionList>,
      )

      const item = screen.getByRole('link', {name: 'Current link'}).closest('li')
      expect(item).toHaveAttribute('data-active', 'true')
      expect(item).toHaveClass('bg-[var(--control-transparent-bgColor-selected)]')
    })

    it('marks the checkbox of each option with its checked and disabled state', () => {
      const {container} = render(
        <ActionList role="listbox" selectionVariant="multiple" aria-label="Checkbox states">
          <ActionList.Item disabled selected>
            Disabled checked
          </ActionList.Item>
          <ActionList.Item disabled>Disabled unchecked</ActionList.Item>
          <ActionList.Item selected>Checked</ActionList.Item>
        </ActionList>,
      )
      const [disabledChecked, disabledUnchecked, checked] = Array.from(
        container.querySelectorAll('[data-component="ActionList.Selection"] > span'),
      )

      expect(disabledChecked).toHaveAttribute('data-checked')
      expect(disabledChecked).toHaveAttribute('data-disabled')
      expect(disabledUnchecked).not.toHaveAttribute('data-checked')
      expect(disabledUnchecked).toHaveAttribute('data-disabled')
      expect(checked).toHaveAttribute('data-checked')
      expect(checked).not.toHaveAttribute('data-disabled')
      expect(checked).toHaveClass(
        'data-[checked]:bg-[var(--control-checked-bgColor-rest)]',
        'data-[checked]:data-[disabled]:bg-[var(--control-checked-bgColor-disabled)]',
        'data-[disabled]:bg-[var(--control-bgColor-disabled)]',
      )
    })
  })

  describe('item gap', () => {
    const items = (
      <>
        <ActionList.Item>Copy link</ActionList.Item>
        <ActionList.Item>Quote reply</ActionList.Item>
      </>
    )

    it('does not add an item gap by default', () => {
      render(
        <ListContainerContext.Provider value="NavList">
          <ActionList>{items}</ActionList>
        </ListContainerContext.Provider>,
      )
      expect(screen.getByRole('list')).not.toHaveAttribute('data-item-gap')
    })

    it('does not add an item gap to a standalone list', () => {
      render(
        <FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
          <ActionList>{items}</ActionList>
        </FeatureFlags>,
      )
      expect(screen.getByRole('list')).not.toHaveAttribute('data-item-gap')
    })

    it('adds an item gap inside a NavList when the feature flag is enabled', () => {
      render(
        <FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
          <ListContainerContext.Provider value="NavList">
            <ActionList>{items}</ActionList>
          </ListContainerContext.Provider>
        </FeatureFlags>,
      )
      const list = screen.getByRole('list')
      expect(list).toHaveAttribute('data-item-gap', 'true')
      expect(screen.getByText('Quote reply').closest('li')).toHaveClass("[[data-component$='Item']+&]:mt-0.5")
    })

    it('does not add an item gap when disableItemGap is set', () => {
      render(
        <FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
          <ListContainerContext.Provider value="NavList">
            <ActionList disableItemGap>{items}</ActionList>
          </ListContainerContext.Provider>
        </FeatureFlags>,
      )
      expect(screen.getByRole('list')).not.toHaveAttribute('data-item-gap')
      expect(screen.getByText('Quote reply').closest('li')).not.toHaveClass("[[data-component$='Item']+&]:mt-0.5")
    })
  })

  describe('focus zone', () => {
    it('moves focus between menu items, including disabled ones, and wraps', async () => {
      const user = userEvent.setup()
      render(
        <ActionList role="menu" aria-label="File">
          <ActionList.Item>Copy</ActionList.Item>
          <ActionList.Item disabled>Move</ActionList.Item>
          <ActionList.Item>Delete</ActionList.Item>
        </ActionList>,
      )
      const [copy, move, remove] = screen.getAllByRole('menuitem')
      expect([copy, move, remove].map(item => item.getAttribute('tabindex'))).toEqual(['0', '-1', '-1'])

      await user.tab()
      expect(copy).toHaveFocus()
      await user.keyboard('{ArrowDown}')
      expect(move).toHaveFocus()
      await user.keyboard('{ArrowDown}{ArrowDown}')
      expect(copy).toHaveFocus()
      await user.keyboard('{ArrowUp}')
      expect(remove).toHaveFocus()
      await user.keyboard('{Home}')
      expect(copy).toHaveFocus()
      await user.keyboard('{PageDown}')
      expect(remove).toHaveFocus()
    })

    it('stops at the ends of a listbox', async () => {
      const user = userEvent.setup()
      render(
        <ActionList role="listbox" aria-label="Branches" selectionVariant="single">
          <ActionList.Item>main</ActionList.Item>
          <ActionList.Item>next</ActionList.Item>
        </ActionList>,
      )
      const [main, next] = screen.getAllByRole('option')
      await user.tab()
      await user.keyboard('{ArrowUp}')
      expect(main).toHaveFocus()
      await user.keyboard('{ArrowDown}{ArrowDown}')
      expect(next).toHaveFocus()
    })

    it('leaves plain lists and opted-out lists in the normal tab order', async () => {
      const user = userEvent.setup()
      const {rerender} = render(
        <ActionList>
          <ActionList.Item>Copy</ActionList.Item>
          <ActionList.Item>Move</ActionList.Item>
        </ActionList>,
      )
      for (const item of screen.getAllByRole('button')) expect(item).not.toHaveAttribute('tabindex', '-1')

      rerender(
        <ActionList role="menu" aria-label="File" disableFocusZone>
          <ActionList.Item>Copy</ActionList.Item>
          <ActionList.Item>Move</ActionList.Item>
        </ActionList>,
      )
      const [copy, move] = screen.getAllByRole('menuitem')
      expect(move).not.toHaveAttribute('tabindex', '-1')
      await user.tab()
      await user.keyboard('{ArrowDown}')
      expect(copy).toHaveFocus()
    })
  })
})
