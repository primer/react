import {ArrowRightIcon} from '@primer/octicons-react'
import React from 'react'
import {cleanup, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {ListContainerContext} from '../../internal/listContainer'
import {FeatureFlags} from '../FeatureFlags'
import {ActionList} from './ActionList'

afterEach(cleanup)

describe('ActionList', () => {
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
    expect(menuSelection.firstElementChild?.tagName.toLowerCase()).toBe('svg')
    expect(listboxSelection.firstElementChild?.tagName.toLowerCase()).toBe('span')
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
    expect(screen.queryByText('Open settings')).toBeNull()
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
})
