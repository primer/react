import {BookIcon} from '@primer/octicons-react'
import {act, cleanup, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it} from 'vitest'
import {FeatureFlags} from '../FeatureFlags'
import {NavList} from './NavList'

afterEach(cleanup)

describe('NavList', () => {
  it('preserves landmark, heading, list, and current-page semantics', () => {
    render(
      <NavList>
        <NavList.Heading>Repository</NavList.Heading>
        <NavList.List>
          <NavList.Item href="/" aria-current="page">
            Overview
          </NavList.Item>
        </NavList.List>
      </NavList>,
    )
    expect(screen.getByRole('navigation', {name: 'Repository'})).toBeInTheDocument()
    expect(screen.getByRole('heading', {name: 'Repository'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Overview'})).toHaveAttribute('aria-current', 'page')
  })

  it('keeps a trailing action outside the navigation link', () => {
    render(
      <NavList aria-label="Repository">
        <NavList.Item href="/issues">
          Issues
          <NavList.Description>Open issues</NavList.Description>
          <NavList.TrailingAction label="Issue actions" />
        </NavList.Item>
      </NavList>,
    )

    const link = screen.getByRole('link', {name: 'Issues,Open issues'})
    const action = screen.getByRole('button', {name: 'Issue actions'})
    expect(link).toContainElement(screen.getByText('Open issues'))
    expect(link).not.toContainElement(action)
  })

  it('composes a disclosure trigger with a list panel', async () => {
    const user = userEvent.setup()
    render(
      <NavList aria-label="Repository">
        <NavList.SubNav>
          <NavList.SubNav.Trigger>Files</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.Item href="/readme">README</NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
      </NavList>,
    )

    const trigger = screen.getByRole('button', {name: 'Files'})
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('list')).toContainElement(screen.getByRole('link', {name: 'README'}))
  })

  it('finds a heading that is grouped in a fragment', () => {
    render(
      <NavList>
        <>
          <NavList.Heading>Repository</NavList.Heading>
          <NavList.Item href="#code">Code</NavList.Item>
        </>
      </NavList>,
    )

    expect(screen.getByRole('navigation')).toHaveAccessibleName('Repository')
  })

  it('renders the group heading outside the list and names the list with it', () => {
    const {container} = render(
      <NavList aria-label="Repository">
        <NavList.Group title="Overview">
          <NavList.Item href="#code">Code</NavList.Item>
          <NavList.Item href="#issues">Issues</NavList.Item>
          <NavList.Item href="#pulls">Pull requests</NavList.Item>
        </NavList.Group>
      </NavList>,
    )

    const group = container.querySelector('[data-component="NavList.Group"]')!
    const heading = within(group as HTMLElement).getByRole('heading', {name: 'Overview'})
    const list = group.querySelector(':scope > ul')!
    expect(list).not.toContainElement(heading)
    expect(list.children).toHaveLength(3)
    expect(list).toHaveAttribute('aria-labelledby', heading.id)
    expect(screen.getByRole('list', {name: 'Overview'})).toBe(list)
  })

  it('prefers a group heading child, even inside a fragment, over the title', () => {
    render(
      <NavList aria-label="Repository">
        <NavList.Group title="Overview">
          <>
            <NavList.GroupHeading>Custom heading</NavList.GroupHeading>
          </>
          <NavList.Item href="#code">Code</NavList.Item>
        </NavList.Group>
      </NavList>,
    )

    expect(screen.getByRole('heading', {name: 'Custom heading'})).toBeInTheDocument()
    expect(screen.queryByText('Overview')).not.toBeInTheDocument()
    expect(screen.getByRole('list', {name: 'Custom heading'})).toContainElement(
      screen.getByRole('link', {name: 'Code'}),
    )
  })

  it('accepts the group heading as a region prop and keeps its id', () => {
    render(
      <NavList aria-label="Repository">
        <NavList.Group heading={<NavList.GroupHeading id="custom-heading">Custom heading</NavList.GroupHeading>}>
          <NavList.Item href="#code">Code</NavList.Item>
        </NavList.Group>
      </NavList>,
    )

    expect(screen.getByRole('heading', {name: 'Custom heading'})).toHaveAttribute('id', 'custom-heading')
    expect(screen.getByRole('list', {name: 'Custom heading'})).toHaveAttribute('aria-labelledby', 'custom-heading')
  })

  it('adds the item gap only when the feature flag is enabled', () => {
    const items = (
      <>
        <NavList.Item href="#home">Home</NavList.Item>
        <NavList.Item href="#about">About</NavList.Item>
      </>
    )
    const {container, rerender} = render(<NavList aria-label="Main">{items}</NavList>)
    const content = () => container.querySelector('[data-component="NavList.Content"]')!
    expect(content()).not.toHaveAttribute('data-item-gap')

    rerender(
      <FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
        <NavList aria-label="Main">{items}</NavList>
      </FeatureFlags>,
    )
    expect(content()).toHaveAttribute('data-item-gap')

    rerender(
      <FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
        <NavList aria-label="Main" disableItemGap>
          {items}
        </NavList>
      </FeatureFlags>,
    )
    expect(content()).not.toHaveAttribute('data-item-gap')
  })

  it('emphasizes item labels that have descriptions', () => {
    render(
      <NavList>
        <NavList.Item href="#docs">
          Documentation
          <NavList.Description>User guides</NavList.Description>
        </NavList.Item>
        <NavList.Item href="#issues">Issues</NavList.Item>
      </NavList>,
    )

    expect(screen.getByRole('link', {name: /Documentation/})).toHaveAttribute('data-has-description', 'true')
    expect(screen.getByText('Documentation')).toHaveClass('font-semibold')
    expect(screen.getByRole('link', {name: 'Issues'})).toHaveAttribute('data-has-description', 'false')
    expect(screen.getByText('Issues')).not.toHaveClass('font-semibold')
  })

  it('renders a router link supplied with as and to', () => {
    const RouterLink = React.forwardRef<HTMLAnchorElement, {to: string} & React.ComponentPropsWithoutRef<'a'>>(
      function RouterLink({to, children, ...props}, ref) {
        return (
          <a {...props} ref={ref} href={to} data-router-link="">
            {children}
          </a>
        )
      },
    )
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <NavList aria-label="Main">
        <NavList.Item as={RouterLink} to="/settings" ref={ref} aria-current="page">
          Settings
        </NavList.Item>
      </NavList>,
    )

    const link = screen.getByRole('link', {name: 'Settings'})
    expect(link).toHaveAttribute('href', '/settings')
    expect(link).toHaveAttribute('data-router-link')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(ref.current).toBe(link)
  })

  it('describes an item with tooltip text while keeping the link and ref', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <NavList aria-label="Main">
        <NavList.Item href="#code" ref={ref} tooltipText="Browse the source">
          Code
        </NavList.Item>
      </NavList>,
    )

    const link = screen.getByRole('link', {name: 'Code'})
    expect(ref.current).toBe(link)
    expect(link).toHaveAttribute('data-component', 'NavList.Item')
    await user.hover(link)
    const tooltip = await screen.findByText('Browse the source')
    expect(link).toHaveAttribute('aria-describedby', tooltip.closest('[id]')?.id)
  })

  it('reveals grouped items and moves focus to the first revealed item', async () => {
    const user = userEvent.setup()
    render(
      <NavList aria-label="Main">
        <NavList.Group title="Group">
          <NavList.Item href="#a">Item A</NavList.Item>
          <NavList.GroupExpand
            items={[
              {href: '#b', text: 'Item B', leadingVisual: BookIcon},
              {href: '#c', text: 'Item C', trailingVisual: '12'},
            ]}
          />
        </NavList.Group>
      </NavList>,
    )

    const button = screen.getByRole('button', {name: 'Show more'})
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', {name: 'Item B'})).not.toBeInTheDocument()
    await user.click(button)

    expect(screen.getByRole('link', {name: 'Item B'})).toHaveFocus()
    expect(screen.getByRole('link', {name: /^Item C/})).toBeInTheDocument()
    expect(screen.queryByRole('button', {name: 'Show more'})).not.toBeInTheDocument()
  })

  it('reveals grouped items one page at a time', async () => {
    const user = userEvent.setup()
    render(
      <NavList aria-label="Main">
        <NavList.Group title="Group">
          <NavList.GroupExpand
            label="Load more"
            pages={2}
            items={[
              {href: '#1', text: 'Item 1'},
              {href: '#2', text: 'Item 2'},
              {href: '#3', text: 'Item 3'},
              {href: '#4', text: 'Item 4'},
            ]}
          />
        </NavList.Group>
      </NavList>,
    )

    await user.click(screen.getByRole('button', {name: 'Load more'}))
    expect(screen.getByRole('link', {name: 'Item 1'})).toHaveFocus()
    expect(screen.queryByRole('link', {name: 'Item 3'})).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: 'Load more'}))
    expect(screen.getByRole('link', {name: 'Item 3'})).toHaveFocus()
    expect(screen.getByRole('link', {name: 'Item 4'})).toBeInTheDocument()
    expect(screen.queryByRole('button', {name: 'Load more'})).not.toBeInTheDocument()
  })

  it('renders revealed items with a custom renderer', async () => {
    const user = userEvent.setup()
    render(
      <NavList aria-label="Main">
        <NavList.Group title="Group">
          <NavList.GroupExpand
            items={[{href: '#commits', text: 'Commits', trailingVisual: '32k'}]}
            renderItem={({
              text,
              trailingVisual,
              leadingVisual: _leadingVisual,
              trailingAction: _trailingAction,
              ...itemProps
            }) => (
              <NavList.Item {...itemProps} key={text}>
                {text}
                <NavList.TrailingVisual>{String(trailingVisual)} results</NavList.TrailingVisual>
              </NavList.Item>
            )}
          />
        </NavList.Group>
      </NavList>,
    )

    await act(async () => {
      await user.click(screen.getByRole('button', {name: 'Show more'}))
    })
    expect(screen.getByText('32k results')).toBeInTheDocument()
    expect(screen.getByRole('link', {name: /^Commits/})).toHaveFocus()
  })
})
