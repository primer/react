import {ArrowRightIcon} from '@primer/octicons-react'
import React from 'react'
import {cleanup, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
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
    expect(screen.getByText('Unavailable due to an outage')).toHaveClass('text-attention-fg')
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
})
