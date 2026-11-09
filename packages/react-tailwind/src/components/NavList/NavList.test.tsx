import {BookIcon} from '@primer/octicons-react'
import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {FeatureFlags} from '../FeatureFlags'
import {NavList} from './NavList'

afterEach(cleanup)

describe('NavList', () => {
  it.each([
    {name: 'inactiveText', props: {inactiveText: 'Stack is full'}},
    {name: 'boolean aria-disabled', props: {'aria-disabled': true}},
    {name: 'string aria-disabled', props: {'aria-disabled': 'true'}},
  ] as const)('suppresses activation for $name and restores it when available', async ({props}) => {
    const user = userEvent.setup()
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
    const onAuxClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
    const list = (inactive: boolean) => (
      <NavList aria-label="Stacks">
        <NavList.Item href="#stack" onAuxClick={onAuxClick} onClick={onClick} {...(inactive ? props : {})}>
          Add to stack
        </NavList.Item>
      </NavList>
    )
    const {rerender} = render(list(true))
    const link = screen.getByRole('link', {name: 'Add to stack'})
    expect(link).toHaveAttribute('aria-disabled', 'true')

    const click = new MouseEvent('click', {bubbles: true, cancelable: true, metaKey: true})
    fireEvent(link, click)
    expect(click.defaultPrevented).toBe(true)
    const auxClick = new MouseEvent('auxclick', {bubbles: true, button: 1, cancelable: true})
    fireEvent(link, auxClick)
    expect(auxClick.defaultPrevented).toBe(true)
    link.focus()
    await user.keyboard('{Enter}')
    expect(onClick).not.toHaveBeenCalled()
    expect(onAuxClick).not.toHaveBeenCalled()

    rerender(list(false))
    const availableLink = screen.getByRole('link', {name: 'Add to stack'})
    expect(availableLink).not.toHaveAttribute('aria-disabled')
    fireEvent.click(availableLink)
    fireEvent(availableLink, new MouseEvent('auxclick', {bubbles: true, button: 1, cancelable: true}))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onAuxClick).toHaveBeenCalledOnce()
  })

  it('associates the unavailable reason without changing the link name or existing descriptions', () => {
    render(
      <>
        <span id="stack-description">Add this pull request</span>
        <NavList aria-label="Stacks">
          <NavList.Item
            aria-describedby="stack-description"
            href="#stack"
            inactiveText="Stack is full"
            tooltipText="Stack settings"
          >
            Add to stack
          </NavList.Item>
        </NavList>
      </>,
    )

    expect(screen.getByRole('link', {name: 'Add to stack'})).toHaveAccessibleDescription(
      'Add this pull request Stack is full Stack settings',
    )
  })

  it('groups direct items into lists without nesting explicit lists or groups in a list', () => {
    const {container} = render(
      <NavList aria-label="Repository">
        <NavList.Item href="/overview">Overview</NavList.Item>
        <NavList.Group title="Settings">
          <NavList.Item href="/settings">General</NavList.Item>
        </NavList.Group>
        <NavList.List>
          <NavList.Item href="/help">Help</NavList.Item>
        </NavList.List>
      </NavList>,
    )
    for (const item of container.querySelectorAll('li')) {
      expect(item.parentElement?.tagName).toBe('UL')
    }
    expect(container.querySelector('ul > section, ul > ul')).toBeNull()
  })

  it('keeps wrapped groups, dividers, and surrounding items in valid authored order', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const groupRef = React.createRef<HTMLElement>()
    const headingRef = React.createRef<HTMLHeadingElement>()
    const WrappedHeading = React.forwardRef<
      HTMLHeadingElement,
      React.ComponentPropsWithoutRef<typeof NavList.GroupHeading>
    >(function WrappedHeading(props, ref) {
      return <NavList.GroupHeading {...props} ref={ref} />
    })
    function WrappedGroup() {
      return (
        <>
          <NavList.Divider />
          <NavList.Group
            ref={groupRef}
            hideDivider
            heading={
              <WrappedHeading ref={headingRef} as="h2">
                Settings
                <NavList.GroupHeading.TrailingAction label="Manage settings" icon={BookIcon} onClick={onAction} />
              </WrappedHeading>
            }
          >
            <NavList.Item href="#general">General</NavList.Item>
          </NavList.Group>
        </>
      )
    }

    const {container} = render(
      <NavList aria-label="Repository">
        <NavList.Item href="#overview">Overview</NavList.Item>
        <WrappedGroup />
        <NavList.Item href="#help">Help</NavList.Item>
      </NavList>,
    )

    const nav = screen.getByRole('navigation', {name: 'Repository'})
    const heading = screen.getByRole('heading', {name: 'Settings', level: 2})
    const action = screen.getByRole('button', {name: 'Manage settings'})
    const list = screen.getByRole('list', {name: 'Settings'})
    expect(container.querySelector('ul > section, ul > ul, ul > h2, ul > h3')).toBeNull()
    for (const item of container.querySelectorAll('li')) {
      expect(item.parentElement?.tagName).toBe('UL')
    }
    expect(
      within(nav)
        .getAllByRole('link')
        .map(link => link.textContent),
    ).toEqual(['Overview', 'General', 'Help'])
    expect(list).toHaveAttribute('aria-labelledby', heading.id)
    expect(heading).not.toContainElement(action)
    expect(groupRef.current).toHaveAttribute('data-component', 'NavList.Group')
    expect(headingRef.current).toBe(heading)

    await user.tab()
    expect(screen.getByRole('link', {name: 'Overview'})).toHaveFocus()
    await user.tab()
    expect(action).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onAction).toHaveBeenCalledOnce()
    await user.tab()
    expect(screen.getByRole('link', {name: 'General'})).toHaveFocus()
  })

  it('keeps a divider between direct groups decorative and outside the accessible list order', () => {
    const {container} = render(
      <NavList aria-label="Repository">
        <NavList.Group title="First">
          <NavList.Item href="#first">First item</NavList.Item>
        </NavList.Group>
        <NavList.Divider data-testid="divider" />
        <NavList.Group title="Second" hideDivider>
          <NavList.Item href="#second">Second item</NavList.Item>
        </NavList.Group>
      </NavList>,
    )

    const dividerList = screen.getByTestId('divider').parentElement
    expect(dividerList).toHaveAttribute('role', 'presentation')
    expect(dividerList).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getAllByRole('list')).toHaveLength(2)
    expect(container.querySelector('ul > section, ul > ul')).toBeNull()
  })

  it('accepts a wrapped collapsed group that renders a list item', () => {
    function CollapsedGroup() {
      return (
        <>
          <NavList.Divider />
          <li>
            <button type="button">Open settings</button>
          </li>
        </>
      )
    }

    const {container} = render(
      <NavList aria-label="Repository">
        <NavList.Item href="#overview">Overview</NavList.Item>
        <CollapsedGroup />
        <NavList.Item href="#help">Help</NavList.Item>
      </NavList>,
    )

    const list = screen.getByRole('list')
    expect(Array.from(list.children).map(child => child.tagName)).toEqual(['LI', 'LI', 'LI', 'LI'])
    expect(container.querySelector('ul > section, ul > ul, li > li')).toBeNull()
    expect(screen.getByRole('button', {name: 'Open settings'})).toBeInTheDocument()
  })

  it('handles groups in a raw list and resets list context for a nested navigation', () => {
    const {container} = render(
      <NavList aria-label="Outer">
        <ul>
          <NavList.Group title="Projects">
            <NavList.Item href="#overview">Overview</NavList.Item>
          </NavList.Group>
          <li>
            <NavList aria-label="Inner">
              <NavList.Group title="Settings">
                <NavList.Item href="#general">General</NavList.Item>
              </NavList.Group>
            </NavList>
          </li>
        </ul>
      </NavList>,
    )

    expect(
      container.querySelector('ul > section, ul > ul, li > li, nav [data-component="NavList.Content"] > li'),
    ).toBeNull()
    expect(screen.getByRole('list', {name: 'Projects'})).toBeInTheDocument()
    expect(screen.getByRole('list', {name: 'Settings'})).toBeInTheDocument()
  })

  it('defaults group heading levels relative to the navigation heading and permits an explicit level', () => {
    const {rerender} = render(
      <NavList>
        <NavList.Heading as="h3">Repository</NavList.Heading>
        <NavList.Group title="Settings">
          <NavList.Item href="#general">General</NavList.Item>
        </NavList.Group>
        <NavList.Group>
          <NavList.GroupHeading as="h2">Actions</NavList.GroupHeading>
          <NavList.Item href="#issues">Issues</NavList.Item>
        </NavList.Group>
      </NavList>,
    )
    expect(screen.getByRole('heading', {name: 'Settings', level: 4})).toBeInTheDocument()
    expect(screen.getByRole('heading', {name: 'Actions', level: 2})).toBeInTheDocument()

    rerender(
      <NavList>
        <NavList.Heading as="h6">Repository</NavList.Heading>
        <NavList.Group title="Settings" />
      </NavList>,
    )
    expect(screen.getByRole('heading', {name: 'Settings', level: 6})).toBeInTheDocument()
  })

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

    const link = screen.getByRole('link', {name: 'Issues'})
    const action = screen.getByRole('button', {name: 'Issue actions'})
    expect(link).toContainElement(screen.getByText('Open issues'))
    expect(link).toHaveAccessibleDescription('Open issues')
    expect(link).not.toContainElement(action)
  })

  it('separates descriptions from the link name while preserving status, tooltip, and explicit references', () => {
    render(
      <>
        <span id="external-note">Updated today</span>
        <NavList aria-label="Repository">
          <NavList.Item aria-describedby="external-note branch-details" href="#issues" tooltipText="View issue">
            Improve navigation
            <NavList.Description id="branch-details">#42 · feature/navigation</NavList.Description>
            <NavList.Description hidden>Hidden detail</NavList.Description>
            <NavList.TrailingVisual>Ready</NavList.TrailingVisual>
          </NavList.Item>
          <NavList.Item aria-label="Project settings" href="#settings">
            Settings
            <NavList.Description>Manage this project</NavList.Description>
          </NavList.Item>
        </NavList>
      </>,
    )

    const issue = screen.getByRole('link', {name: 'Improve navigation Ready'})
    expect(issue).toHaveAccessibleDescription('Updated today #42 · feature/navigation View issue')
    expect(
      issue
        .getAttribute('aria-describedby')
        ?.split(' ')
        .filter(id => id === 'branch-details'),
    ).toHaveLength(1)
    expect(screen.getByRole('link', {name: 'Project settings'})).toHaveAccessibleDescription('Manage this project')
  })

  it('names items by label regardless of leading visual text or descriptions', () => {
    render(
      <>
        <span id="deployment-status" className="sr-only">
          Done
        </span>
        <NavList aria-label="Deployments">
          <NavList.Item href="#natural">
            <NavList.LeadingVisual>
              <span className="sr-only">Done</span>
            </NavList.LeadingVisual>
            Natural name
          </NavList.Item>
          <NavList.Item href="#with-description">
            <NavList.LeadingVisual>
              <span className="sr-only">Done</span>
            </NavList.LeadingVisual>
            Named by label
            <NavList.Description>Deployment details</NavList.Description>
          </NavList.Item>
          <NavList.Item href="#described" aria-describedby="deployment-status">
            <NavList.LeadingVisual aria-hidden="true">Icon</NavList.LeadingVisual>
            Described status
          </NavList.Item>
        </NavList>
      </>,
    )

    expect(screen.getByRole('link', {name: 'Natural name'})).not.toHaveAccessibleDescription()
    expect(screen.getByRole('link', {name: 'Named by label'})).toHaveAccessibleDescription('Deployment details')
    expect(screen.getByRole('link', {name: 'Described status'})).toHaveAccessibleDescription('Done')
  })

  it('associates wrapped descriptions without relying on prop forwarding', () => {
    function WrappedDescription(_props: {id?: string}) {
      return <NavList.Description>Repository details</NavList.Description>
    }
    render(
      <NavList aria-label="Repository">
        <NavList.Item
          aria-describedby="repository-detail"
          description={<WrappedDescription id="repository-detail" />}
          href="#repository"
        >
          Repository
        </NavList.Item>
      </NavList>,
    )
    const link = screen.getByRole('link', {name: 'Repository'})
    expect(link).toHaveAccessibleDescription('Repository details')
    for (const id of link.getAttribute('aria-describedby')?.split(' ') ?? []) {
      expect(document.getElementById(id)).not.toBeNull()
    }
  })

  it('hydrates item description and tooltip references without changing the link or ref', async () => {
    const ref = React.createRef<HTMLAnchorElement>()
    const app = (
      <NavList aria-label="Repository">
        <NavList.Item href="#issues" ref={ref} tooltipText="View issue">
          Improve navigation
          <NavList.Description>#42 · feature/navigation</NavList.Description>
          <NavList.TrailingVisual>Ready</NavList.TrailingVisual>
        </NavList.Item>
      </NavList>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(app)
    document.body.append(container)
    const serverLink = container.querySelector('a')
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      const link = screen.getByRole('link', {name: 'Improve navigation Ready'})
      expect(link).toBe(serverLink)
      expect(ref.current).toBe(link)
      expect(link).toHaveAccessibleDescription('#42 · feature/navigation View issue')
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('places a wrapped trailing action supplied through the item region outside the link', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    function WrappedAction() {
      return <NavList.TrailingAction label="Issue actions" onClick={onAction} />
    }
    render(
      <NavList aria-label="Repository">
        <NavList.Item href="#issues" trailingAction={<WrappedAction />}>
          Issues
        </NavList.Item>
      </NavList>,
    )

    const link = screen.getByRole('link', {name: 'Issues'})
    const action = screen.getByRole('button', {name: 'Issue actions'})
    expect(link.closest('li')).toContainElement(action)
    expect(link).not.toContainElement(action)
    await user.tab()
    expect(link).toHaveFocus()
    await user.tab()
    expect(action).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onAction).toHaveBeenCalledOnce()
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
    expect(screen.getByRole('list', {name: 'Files'})).toContainElement(screen.getByRole('link', {name: 'README'}))
    expect(screen.getByRole('list', {name: 'Files'})).toBeInTheDocument()
  })

  it('opens a section that contains the current item and marks it current while collapsed', async () => {
    const user = userEvent.setup()
    const subNav = (current: boolean) => (
      <NavList aria-label="Repository">
        <NavList.SubNav>
          <NavList.SubNav.Trigger id="files-trigger">Files</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.Item href="/readme" aria-current={current ? 'page' : undefined}>
              README
            </NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
      </NavList>
    )
    const {rerender} = render(subNav(false))
    const trigger = screen.getByRole('button', {name: 'Files'})
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    rerender(subNav(true))
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).not.toHaveAttribute('data-active')
    expect(screen.getByRole('list', {name: 'Files'})).toHaveAttribute('aria-labelledby', 'files-trigger')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('data-active', 'true')
    expect(trigger).toHaveClass('primer:bg-[var(--control-transparent-bgColor-selected)]')
  })

  it('leaves a controlled section closed when it contains the current item', () => {
    render(
      <NavList aria-label="Repository">
        <NavList.SubNav open={false}>
          <NavList.SubNav.Trigger>Files</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.Item href="/readme" aria-current="page">
              README
            </NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
      </NavList>,
    )

    const trigger = screen.getByRole('button', {name: 'Files'})
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('data-active', 'true')
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
    expect(screen.getByText('Documentation')).toHaveClass('primer:font-semibold')
    expect(screen.getByRole('link', {name: 'Issues'})).toHaveAttribute('data-has-description', 'false')
    expect(screen.getByText('Issues')).not.toHaveClass('primer:font-semibold')
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
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
    const nav = (inactive: boolean) => (
      <NavList aria-label="Main">
        <NavList.Item
          as={RouterLink}
          to="/settings"
          ref={ref}
          aria-current="page"
          inactiveText={inactive ? 'Unavailable' : undefined}
          onClick={onClick}
        >
          Settings
        </NavList.Item>
      </NavList>
    )
    const {rerender} = render(nav(false))

    const link = screen.getByRole('link', {name: 'Settings'})
    expect(link).toHaveAttribute('href', '/settings')
    expect(link).toHaveAttribute('data-router-link')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(ref.current).toBe(link)
    fireEvent.click(link)
    expect(onClick).toHaveBeenCalledOnce()

    rerender(nav(true))
    expect(ref.current).toBe(link)
    expect(link).toHaveAccessibleDescription('Unavailable')
    const inactiveClick = new MouseEvent('click', {bubbles: true, cancelable: true})
    fireEvent(link, inactiveClick)
    expect(inactiveClick.defaultPrevented).toBe(true)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('forwards router-specific destinations, options, events, and refs', () => {
    const RouterLink = React.forwardRef<
      HTMLAnchorElement,
      {to: {pathname: string}; replace: boolean} & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'>
    >(function RouterLink({children, to, replace, ...props}, ref) {
      return (
        <a {...props} ref={ref} href={to.pathname} data-replace={String(replace)}>
          {children}
        </a>
      )
    })
    const ref = React.createRef<HTMLAnchorElement>()
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())

    render(
      <NavList aria-label="Settings">
        <NavList.Item
          as={RouterLink}
          to={{pathname: '/rules'}}
          replace
          ref={ref}
          onClick={onClick}
          aria-current="page"
          description={<NavList.Description>Repository rules</NavList.Description>}
        >
          Rules
        </NavList.Item>
      </NavList>,
    )

    const link = screen.getByRole('link', {name: 'Rules'})
    expect(link).toHaveAttribute('href', '/rules')
    expect(link).toHaveAttribute('data-replace', 'true')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveAccessibleDescription('Repository rules')
    expect(ref.current).toBe(link)
    fireEvent.click(link)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('forwards button props, event targets, and refs without losing inactive behavior', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLButtonElement>()
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.currentTarget.focus())
    const item = (inactive: boolean) => (
      <NavList aria-label="Settings">
        <NavList.Item
          as="button"
          type="button"
          ref={ref}
          inactiveText={inactive ? 'Unavailable' : undefined}
          onClick={onClick}
        >
          Preferences
        </NavList.Item>
      </NavList>
    )
    const {rerender} = render(item(false))

    const button = screen.getByRole('button', {name: 'Preferences'})
    expect(ref.current).toBe(button)
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass(
      'primer:appearance-none',
      'primer:border-0',
      'primer:bg-transparent',
      'primer:font-[family-name:inherit]',
    )
    expect(button).toHaveClass('primer:grid', 'primer:px-2', 'primer:py-1.5')
    expect(button).not.toHaveClass('primer:p-0')
    await user.click(button)
    expect(onClick).toHaveBeenCalledOnce()
    expect(button).toHaveFocus()

    rerender(item(true))
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAccessibleDescription('Unavailable')
    await user.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('resets custom button roots and lets consumers override their styles', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLButtonElement>()
    const onClick = vi.fn()
    const CustomButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
      function CustomButton(props, ref) {
        return <button {...props} ref={ref} type="button" />
      },
    )
    render(
      <NavList aria-label="Settings">
        <NavList.Item
          as={CustomButton}
          type="button"
          className="border-2 bg-default font-mono"
          aria-current="page"
          onClick={onClick}
          ref={ref}
        >
          Preferences
        </NavList.Item>
      </NavList>,
    )

    const button = screen.getByRole('button', {name: 'Preferences'})
    expect(ref.current).toBe(button)
    expect(button).toHaveClass('primer:appearance-none', 'border-2', 'bg-default', 'font-mono', 'primer:font-semibold')
    expect(button).not.toHaveClass('primer:border-0', 'primer:bg-transparent', 'primer:font-[family-name:inherit]')
    await user.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('preserves native button type and form submission behavior', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <NavList aria-label="Form actions">
          <NavList.Item as="button" type="button">
            Action
          </NavList.Item>
          <NavList.Item as="button">Default submit</NavList.Item>
          <NavList.Item as="button" type="submit">
            Explicit submit
          </NavList.Item>
        </NavList>
      </form>,
    )

    await user.click(screen.getByRole('button', {name: 'Action'}))
    expect(onSubmit).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', {name: 'Default submit'}))
    await user.click(screen.getByRole('button', {name: 'Explicit submit'}))
    expect(onSubmit).toHaveBeenCalledTimes(2)
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

  it('merges a consumer description with the tooltip text', () => {
    render(
      <>
        <span id="code-note">Updated today</span>
        <NavList aria-label="Main">
          <NavList.Item aria-describedby="code-note" href="#code" tooltipText="Browse the source">
            Code
          </NavList.Item>
          <NavList.Item aria-describedby="code-note" href="#issues">
            Issues
          </NavList.Item>
        </NavList>
      </>,
    )

    expect(screen.getByRole('link', {name: 'Code'})).toHaveAccessibleDescription('Updated today Browse the source')
    expect(screen.getByRole('link', {name: 'Issues'})).toHaveAccessibleDescription('Updated today')
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

  it('keeps router composition and focus when revealing a grouped item', async () => {
    const user = userEvent.setup()
    const RouterLink = React.forwardRef<HTMLAnchorElement, {to: string} & React.ComponentPropsWithoutRef<'a'>>(
      function RouterLink({children, to, ...props}, ref) {
        return (
          <a {...props} href={to} ref={ref} data-router-link="">
            {children}
          </a>
        )
      },
    )

    render(
      <NavList aria-label="Main">
        <NavList.Group title="Group">
          <NavList.GroupExpand items={[{as: RouterLink, to: '/settings', text: 'Settings'}]} />
        </NavList.Group>
      </NavList>,
    )

    await user.click(screen.getByRole('button', {name: 'Show more'}))
    const link = screen.getByRole('link', {name: 'Settings'})
    expect(link).toHaveAttribute('href', '/settings')
    expect(link).toHaveAttribute('data-router-link')
    expect(link).toHaveFocus()
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
