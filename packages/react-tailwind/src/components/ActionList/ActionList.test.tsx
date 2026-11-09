import {ArrowRightIcon, RepoIcon} from '@primer/octicons-react'
import React from 'react'
import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, expectTypeOf, it, vi} from 'vitest'
import {ListContainerContext} from '../../internal/listContainer'
import {FeatureFlags} from '../FeatureFlags'
import {ActionList, type ActionListItemProps, type ActionListStaticItemProps} from './ActionList'

afterEach(cleanup)

describe('ActionList', () => {
  it('preserves Base UI event details for action items', () => {
    const onKeyDown = vi.fn()
    const buttonKeyDown = (_event: React.KeyboardEvent<HTMLButtonElement>) => {}
    function ActionItemWrapper(props: ActionListItemProps) {
      return <ActionList.Item {...props} />
    }
    function StaticItemWrapper(props: ActionListStaticItemProps) {
      return <ActionList.Item {...props} />
    }
    // @ts-expect-error Static rows do not receive button keyboard events.
    const invalidStaticHandler = <ActionList.Item role="listitem" onKeyDown={buttonKeyDown} />
    expect(invalidStaticHandler).toBeDefined()
    render(
      <ActionList>
        <ActionItemWrapper
          onKeyDown={event => {
            expectTypeOf(event.currentTarget).toMatchTypeOf<HTMLButtonElement>()
            expectTypeOf(event.preventBaseUIHandler).toBeFunction()
            onKeyDown(event)
          }}
        >
          Repository
        </ActionItemWrapper>
        <StaticItemWrapper
          role="listitem"
          onKeyDown={event => expectTypeOf(event.currentTarget).toMatchTypeOf<HTMLLIElement>()}
        >
          Static content
        </StaticItemWrapper>
      </ActionList>,
    )

    fireEvent.keyDown(screen.getByRole('button', {name: 'Repository'}), {key: 'ArrowDown'})
    expect(onKeyDown).toHaveBeenCalledOnce()
  })

  it('separates item descriptions from names and preserves explicit accessibility references', () => {
    render(
      <>
        <span id="external-description">Available to administrators</span>
        <span id="publish-label">Publish repository</span>
        <ActionList>
          <ActionList.Item aria-labelledby="publish-label">
            Publish
            <ActionList.Description>Make this repository public</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item aria-label="Archive repository">
            Archive
            <ActionList.Description>Move this repository out of active lists</ActionList.Description>
          </ActionList.Item>
          <ActionList.LinkItem aria-describedby="external-description settings-description" href="/settings">
            Settings
            <ActionList.Description id="settings-description">Manage this repository</ActionList.Description>
            <ActionList.TrailingVisual>Ready</ActionList.TrailingVisual>
          </ActionList.LinkItem>
        </ActionList>
      </>,
    )

    expect(screen.getByRole('button', {name: 'Publish repository'})).toHaveAccessibleDescription(
      'Make this repository public',
    )
    expect(screen.getByRole('button', {name: 'Archive repository'})).toHaveAccessibleDescription(
      'Move this repository out of active lists',
    )
    const settings = screen.getByRole('link', {name: 'Settings Ready'})
    expect(settings).toHaveAccessibleDescription('Available to administrators Manage this repository')
    expect(
      settings
        .getAttribute('aria-describedby')
        ?.split(' ')
        .filter(id => id === 'settings-description'),
    ).toHaveLength(1)
  })

  it('associates wrapped description and trailing-visual regions without nesting controls', () => {
    function WrappedDescription() {
      // eslint-disable-next-line primer-react/direct-slot-children -- Explicit region props support wrapped parts.
      return <ActionList.Description>Repository details</ActionList.Description>
    }
    function WrappedStatus() {
      // eslint-disable-next-line primer-react/direct-slot-children -- Explicit region props support wrapped parts.
      return <ActionList.TrailingVisual>Ready</ActionList.TrailingVisual>
    }
    render(
      <ActionList>
        <ActionList.LinkItem description={<WrappedDescription />} href="/repository" trailingVisual={<WrappedStatus />}>
          Repository
        </ActionList.LinkItem>
      </ActionList>,
    )
    const link = screen.getByRole('link', {name: 'Repository Ready'})
    expect(link).toHaveAccessibleDescription('Repository details')
    expect(link).toHaveAttribute('href', '/repository')
  })

  it('associates wrapped descriptions even when their components do not forward an id', () => {
    function WrappedDescription(_props: {id?: string}) {
      // eslint-disable-next-line primer-react/direct-slot-children -- Explicit region props support wrapped parts.
      return <ActionList.Description>Repository details</ActionList.Description>
    }
    render(
      <ActionList>
        <ActionList.Item
          aria-describedby="repository-detail"
          description={<WrappedDescription id="repository-detail" />}
        >
          Repository
        </ActionList.Item>
      </ActionList>,
    )

    const item = screen.getByRole('button', {name: 'Repository'})
    expect(item).toHaveAccessibleDescription('Repository details')
    for (const id of item.getAttribute('aria-describedby')?.split(' ') ?? []) {
      expect(document.getElementById(id)).not.toBeNull()
    }
  })

  it('does not repeat a wrapped description when its component forwards the supplied id', () => {
    function WrappedDescription(props: React.ComponentPropsWithoutRef<typeof ActionList.Description>) {
      // eslint-disable-next-line primer-react/direct-slot-children -- Explicit region props support wrapped parts.
      return <ActionList.Description {...props} />
    }
    render(
      <>
        <span id="external-note">Available to administrators</span>
        <ActionList>
          <ActionList.Item
            aria-describedby="repository-detail external-note"
            description={<WrappedDescription id="repository-detail">Repository details</WrappedDescription>}
          >
            Repository
          </ActionList.Item>
        </ActionList>
      </>,
    )
    expect(screen.getByRole('button', {name: 'Repository'})).toHaveAccessibleDescription(
      'Repository details Available to administrators',
    )
  })

  it('names items by label and trailing visual whether or not they have a description', () => {
    render(
      <ActionList>
        <ActionList.Item leadingVisual={<span aria-label="Private" role="img" />} trailingVisual="⌘P">
          Plain
        </ActionList.Item>
        <ActionList.Item leadingVisual={<span aria-label="Private" role="img" />} description="Details">
          Described
        </ActionList.Item>
        <ActionList.Item leadingVisual={<span aria-label="Settings" role="img" />} />
      </ActionList>,
    )
    expect(screen.getByRole('button', {name: 'Plain ⌘P'})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Described'})).toHaveAccessibleDescription('Details')
    expect(screen.getByRole('button', {name: 'Settings'})).toBeInTheDocument()
  })

  it('renders a role="listitem" item as one static list item without an action', () => {
    const ref = React.createRef<HTMLLIElement>()
    const {container} = render(
      <ActionList aria-label="Results">
        <ActionList.Item
          ref={ref}
          role="listitem"
          className="consumer-static-row"
          style={{color: 'rgb(1, 2, 3)'}}
          leadingVisual={<span aria-label="Private" role="img" />}
          description="Owned by octocat"
          trailingVisual="3"
          trailingAction={<ActionList.TrailingAction label="Remove" icon={ArrowRightIcon} />}
        >
          Repository
        </ActionList.Item>
      </ActionList>,
    )
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0].tagName).toBe('LI')
    expect(items[0]).not.toHaveAttribute('role')
    expect(items[0]).not.toHaveAttribute('tabindex')
    expect(ref.current).toBe(items[0])
    expect(items[0]).toHaveClass('consumer-static-row')
    expect(items[0]).toHaveStyle({color: 'rgb(1, 2, 3)'})
    expect(items[0].querySelector('[data-component="ActionList.Item.Content"]')).not.toHaveClass('consumer-static-row')
    expect(items[0]).toHaveTextContent('Repository')
    expect(items[0]).toHaveTextContent('Owned by octocat')
    expect(within(items[0]).getAllByRole('button')).toHaveLength(1)
    expect(within(items[0]).getByRole('button', {name: 'Remove'})).toBeInTheDocument()
    expect(container.querySelector('[role="none"], [role="presentation"]')).toBeNull()
  })

  it('forwards an explicit tab stop to a static list item without adding activation', async () => {
    render(
      <ActionList aria-label="Results">
        <ActionList.Item role="listitem" tabIndex={0}>
          Repository
        </ActionList.Item>
      </ActionList>,
    )
    const item = screen.getByRole('listitem')
    expect(item).toHaveAttribute('tabindex', '0')
    await userEvent.tab()
    expect(item).toHaveFocus()
    expect(within(item).queryByRole('button')).toBeNull()
  })

  it('keeps a focusable static row and its trailing action in Tab order', async () => {
    render(
      <ActionList aria-label="Results">
        <ActionList.Item
          role="listitem"
          tabIndex={0}
          description="Owned by octocat"
          trailingAction={<ActionList.TrailingAction label="Open" icon={ArrowRightIcon} />}
        >
          Repository
        </ActionList.Item>
      </ActionList>,
    )
    const item = screen.getByRole('listitem')
    await userEvent.tab()
    expect(item).toHaveFocus()
    await userEvent.tab()
    expect(within(item).getByRole('button', {name: 'Open'})).toHaveFocus()
  })

  it('forwards static row keyboard and capture handlers with arbitrary trailing controls', async () => {
    const calls: Array<[string, EventTarget]> = []
    const action = vi.fn()
    const absentState = {'aria-disabled': undefined} satisfies React.AriaAttributes
    render(
      <ActionList aria-label="Results">
        <ActionList.Item
          {...absentState}
          role="listitem"
          tabIndex={0}
          description="Owned by octocat"
          onKeyDownCapture={event => calls.push(['keyDownCapture', event.currentTarget])}
          onKeyDown={event => {
            expectTypeOf(event.currentTarget).toMatchTypeOf<HTMLLIElement>()
            calls.push(['keyDown', event.currentTarget])
          }}
          onKeyUpCapture={event => calls.push(['keyUpCapture', event.currentTarget])}
          onClickCapture={event => calls.push(['clickCapture', event.currentTarget])}
          onAuxClickCapture={event => calls.push(['auxClickCapture', event.currentTarget])}
          trailingAction={
            <span>
              <button onClick={action} type="button">
                Open
              </button>
              <a href="#details">Details</a>
            </span>
          }
        >
          Repository
        </ActionList.Item>
      </ActionList>,
    )
    const item = screen.getByRole('listitem')
    await userEvent.tab()
    expect(item).toHaveFocus()
    calls.length = 0
    fireEvent.keyDown(item, {key: 'ArrowDown'})
    fireEvent.keyUp(item, {key: 'ArrowDown'})
    expect(calls).toEqual([
      ['keyDownCapture', item],
      ['keyDown', item],
      ['keyUpCapture', item],
    ])
    await userEvent.tab()
    const button = within(item).getByRole('button', {name: 'Open'})
    expect(button).toHaveFocus()
    await userEvent.click(button)
    expect(action).toHaveBeenCalledOnce()
    expect(calls).toContainEqual(['clickCapture', item])
    fireEvent(button, new MouseEvent('auxclick', {bubbles: true, button: 1}))
    expect(calls).toContainEqual(['auxClickCapture', item])
    await userEvent.tab()
    expect(within(item).getByRole('link', {name: 'Details'})).toHaveFocus()
    expect(item).not.toHaveAttribute('aria-disabled')
    expect(item).toHaveTextContent('Owned by octocat')
  })

  it('conveys an unavailable static row with visible text instead of aria-disabled', async () => {
    render(
      <ActionList aria-label="Results">
        <ActionList.Item
          role="listitem"
          tabIndex={0}
          leadingVisual={<RepoIcon />}
          description="Owned by octocat"
          inactiveText="Archived repositories cannot be added"
          trailingVisual="3"
          trailingAction={<ActionList.TrailingAction label="Open" icon={ArrowRightIcon} />}
        >
          Repository
        </ActionList.Item>
      </ActionList>,
    )
    const item = screen.getByRole('listitem')
    expect(item).not.toHaveAttribute('aria-disabled')
    expect(item).toHaveAttribute('data-inactive', 'true')
    expect(item).toHaveTextContent('Archived repositories cannot be added')
    expect(item).toHaveTextContent('Owned by octocat')
    expect(item).toHaveTextContent('3')
    expect(within(item).queryByRole('button')).toBeNull()
    await userEvent.tab()
    expect(item).toHaveFocus()
  })

  it('rejects interactive or misplaced static list items', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        <ActionList>
          {/* @ts-expect-error Static rows cannot be selected. */}
          <ActionList.Item role="listitem" onSelect={() => {}}>
            Repository
          </ActionList.Item>
        </ActionList>,
      ),
    ).toThrow(/static content/)
    expect(() =>
      render(
        <ActionList>
          {/* @ts-expect-error Static rows cannot be disabled. */}
          <ActionList.Item role="listitem" disabled>
            Repository
          </ActionList.Item>
        </ActionList>,
      ),
    ).toThrow(/inactiveText/)
    const invalidDisabledState: React.AriaAttributes = {'aria-disabled': true}
    expect(() =>
      render(
        <ActionList>
          {/* @ts-expect-error Static rows cannot use aria-disabled. */}
          <ActionList.Item {...invalidDisabledState} role="listitem">
            Repository
          </ActionList.Item>
        </ActionList>,
      ),
    ).toThrow(/aria-disabled/)
    for (const action of [{onClick: () => {}}, {render: <span />}, {loading: true}, {selected: true}] as const) {
      expect(() =>
        render(
          <ActionList>
            {/* @ts-expect-error Static rows cannot use action or selection props. */}
            <ActionList.Item {...action} role="listitem">
              Repository
            </ActionList.Item>
          </ActionList>,
        ),
      ).toThrow(/static content/)
    }
    for (const state of [{'aria-selected': true}, {'aria-checked': true}] as const) {
      expect(() =>
        render(
          <ActionList>
            {/* @ts-expect-error Static rows cannot expose selection state. */}
            <ActionList.Item {...state} role="listitem">
              Repository
            </ActionList.Item>
          </ActionList>,
        ),
      ).toThrow(/cannot be selected/)
    }
    expect(() =>
      render(
        <ActionList role="menu">
          <ActionList.Item role="listitem">Repository</ActionList.Item>
        </ActionList>,
      ),
    ).toThrow(/role="list"/)
    vi.restoreAllMocks()
  })

  it('updates and removes description references when descriptions change', () => {
    const item = (description: 'visible' | 'hidden' | null) => (
      <ActionList>
        <ActionList.Item>
          Repository
          {description === 'visible' ? <ActionList.Description>Recently updated</ActionList.Description> : null}
          {description === 'hidden' ? <ActionList.Description hidden>Hidden detail</ActionList.Description> : null}
        </ActionList.Item>
      </ActionList>
    )
    const {rerender} = render(item(null))
    const button = screen.getByRole('button', {name: 'Repository'})
    expect(button).not.toHaveAttribute('aria-describedby')
    rerender(item('visible'))
    expect(button).toHaveAccessibleName('Repository')
    expect(button).toHaveAccessibleDescription('Recently updated')
    const descriptionId = button.getAttribute('aria-describedby')
    rerender(item('hidden'))
    expect(button).toHaveAccessibleName('Repository')
    expect(button).not.toHaveAttribute('aria-describedby')
    expect(`${button.getAttribute('aria-labelledby')} ${button.getAttribute('aria-describedby')}`).not.toContain(
      descriptionId,
    )
  })

  it('keeps replaced render content free of references to absent item content', () => {
    render(
      <ActionList>
        <ActionList.Item render={<button type="button">Replacement</button>}>
          Original
          <ActionList.Description>Original details</ActionList.Description>
        </ActionList.Item>
        <ActionList.LinkItem
          render={props => (
            <a {...props} href="#replacement">
              Replacement link
            </a>
          )}
        >
          Original link
          <ActionList.Description>Original link details</ActionList.Description>
        </ActionList.LinkItem>
      </ActionList>,
    )
    const button = screen.getByRole('button', {name: 'Replacement'})
    const link = screen.getByRole('link', {name: 'Replacement link'})
    expect(button).not.toHaveAttribute('aria-describedby')
    expect(button).not.toHaveAttribute('aria-labelledby')
    expect(link).not.toHaveAttribute('aria-describedby')
    expect(link).not.toHaveAttribute('aria-labelledby')
  })

  it('keeps descriptions when a render callback wraps the supplied children', () => {
    render(
      <ActionList>
        <ActionList.Item
          render={props => (
            <button {...props} type="button">
              <span>{props.children}</span>
            </button>
          )}
        >
          Repository
          <ActionList.Description>Repository details</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )
    expect(screen.getByRole('button', {name: 'Repository'})).toHaveAccessibleDescription('Repository details')
  })

  it('keeps descriptions when a render callback clones the supplied children', () => {
    render(
      <ActionList>
        <ActionList.Item
          render={props => (
            <button {...props} type="button">
              {React.Children.map(props.children, child =>
                React.isValidElement(child) ? React.cloneElement(child) : child,
              )}
            </button>
          )}
        >
          Repository
          <ActionList.Description>Repository details</ActionList.Description>
        </ActionList.Item>
        <ActionList.LinkItem
          href="#settings"
          render={props => (
            <a {...props}>
              {React.Children.map(props.children, child =>
                React.isValidElement(child) ? React.cloneElement(child) : child,
              )}
            </a>
          )}
        >
          Settings
          <ActionList.Description>Repository settings</ActionList.Description>
        </ActionList.LinkItem>
      </ActionList>,
    )
    expect(screen.getByRole('button', {name: 'Repository'})).toHaveAccessibleDescription('Repository details')
    expect(screen.getByRole('link', {name: 'Settings'})).toHaveAccessibleDescription('Repository settings')
  })

  it('preserves inactive and loading information alongside item descriptions', () => {
    render(
      <ActionList>
        <ActionList.Item inactiveText="Requires access">
          Transfer
          <ActionList.Description>Change the owner</ActionList.Description>
        </ActionList.Item>
        <ActionList.Item loading loadingText="Saving changes">
          Save
          <ActionList.Description>Update the repository</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )
    expect(screen.getByRole('button', {name: 'Transfer'})).toHaveAccessibleDescription(
      'Change the owner Requires access',
    )
    expect(screen.getByRole('button', {name: 'Save Saving changes'})).toHaveAccessibleDescription(
      'Update the repository',
    )
  })

  it('preserves custom label and trailing content when an item becomes inactive and available again', () => {
    const list = (inactiveText?: string) => (
      <ActionList>
        <ActionList.Item inactiveText={inactiveText}>
          <ActionList.LeadingVisual>
            <span aria-hidden="true">Icon</span>
          </ActionList.LeadingVisual>
          <span>Repository</span>
          <ActionList.TrailingVisual>
            <span>Ready</span>
          </ActionList.TrailingVisual>
        </ActionList.Item>
      </ActionList>
    )
    const {rerender} = render(list())
    const label = screen.getByText('Repository')
    const trailing = screen.getByText('Ready')

    rerender(list('Requires access'))
    expect(screen.getByText('Repository')).toBe(label)
    expect(screen.getByText('Ready')).toBe(trailing)
    expect(screen.getByRole('button', {name: 'Repository Ready'})).toHaveAccessibleDescription('Requires access')

    rerender(list())
    expect(screen.getByText('Repository')).toBe(label)
    expect(screen.getByText('Ready')).toBe(trailing)
  })

  it('preserves explicit titles as item availability changes', () => {
    const list = (inactiveText?: React.ReactNode) => (
      <ActionList>
        <ActionList.Item inactiveText={inactiveText} title="Custom explanation">
          Transfer
        </ActionList.Item>
        <ActionList.Item inactiveText="Requires access">Archive</ActionList.Item>
        <ActionList.Item inactiveText="Requires approval" title="">
          Delete
        </ActionList.Item>
      </ActionList>
    )
    const {rerender} = render(list())
    const item = screen.getByRole('button', {name: 'Transfer'})
    expect(item).toHaveAttribute('title', 'Custom explanation')
    expect(screen.getByRole('button', {name: 'Archive'})).toHaveAttribute('title', 'Requires access')
    expect(screen.getByRole('button', {name: 'Delete'})).toHaveAttribute('title', '')

    rerender(list('Temporarily unavailable'))
    expect(screen.getByRole('button', {name: 'Transfer'})).toBe(item)
    expect(item).toHaveAttribute('title', 'Custom explanation')
    expect(item).toHaveAccessibleDescription('Temporarily unavailable')

    rerender(list(<span>Requires approval</span>))
    expect(item).toHaveAttribute('title', 'Custom explanation')
    expect(item).toHaveAccessibleDescription('Requires approval')
  })

  it('exposes inactive reasons separately with explicit names, external descriptions, and listbox options', () => {
    render(
      <>
        <span id="inactive-context">Contact an administrator</span>
        <span id="inactive-name">External action</span>
        <ActionList>
          <ActionList.Item aria-describedby="inactive-context" inactiveText="Requires access">
            <ActionList.LeadingVisual aria-hidden="true">Icon</ActionList.LeadingVisual>
            Transfer
            <ActionList.TrailingVisual>Ready</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item aria-label="Custom action" inactiveText="Temporarily unavailable">
            Archive
          </ActionList.Item>
          <ActionList.LinkItem aria-labelledby="inactive-name" href="#billing" inactiveText="Requires billing">
            Billing
          </ActionList.LinkItem>
        </ActionList>
        <ActionList.Listbox aria-label="Projects">
          <ActionList.Item inactiveText="Not available">Unavailable project</ActionList.Item>
          <ActionList.LinkItem href="#project" inactiveText="Requires access">
            Restricted project
          </ActionList.LinkItem>
        </ActionList.Listbox>
      </>,
    )
    expect(screen.getByRole('button', {name: 'Transfer Ready'})).toHaveAccessibleDescription(
      'Contact an administrator Requires access',
    )
    expect(screen.getByRole('button', {name: 'Custom action'})).toHaveAccessibleDescription('Temporarily unavailable')
    const inactiveLink = screen.getByText('Billing').closest('[aria-disabled="true"]')
    expect(inactiveLink).toHaveAccessibleName('External action')
    expect(inactiveLink).toHaveAccessibleDescription('Requires billing')
    expect(screen.getByRole('option', {name: 'Unavailable project'})).toHaveAccessibleDescription('Not available')
    expect(screen.getByRole('option', {name: 'Restricted project'})).toHaveAccessibleDescription('Requires access')
  })

  it('renders inactive reasons in ordinary lists, listboxes, and trees', () => {
    render(
      <>
        <ActionList aria-label="Actions">
          <ActionList.Item inactiveText="Requires access">Transfer</ActionList.Item>
          <ActionList.LinkItem href="#billing" inactiveText={<span>Requires billing access</span>}>
            Billing
          </ActionList.LinkItem>
        </ActionList>
        <ActionList.Listbox aria-label="Projects" selectionVariant="single">
          <ActionList.Item inactiveText="Requires approval">Restricted project</ActionList.Item>
          <ActionList.LinkItem href="#project" inactiveText="Temporarily unavailable">
            Project link
          </ActionList.LinkItem>
        </ActionList.Listbox>
        <ActionList aria-label="Project tree" role="tree">
          <ActionList.TreeItem
            aria-describedby="tree-reason"
            aria-label="Tree project"
            inactiveText={<span id="tree-reason">Requires membership</span>}
          >
            Tree project
          </ActionList.TreeItem>
        </ActionList>
      </>,
    )

    const item = screen.getByRole('button', {name: 'Transfer'})
    const link = screen.getByText('Billing').closest<HTMLElement>('[aria-disabled="true"]')!
    const option = screen.getByRole('option', {name: 'Restricted project'})
    const linkOption = screen.getByRole('option', {name: 'Project link'})
    const treeItem = screen.getByRole('treeitem', {name: 'Tree project'})
    for (const [element, reason] of [
      [item, 'Requires access'],
      [link, 'Requires billing access'],
      [option, 'Requires approval'],
      [linkOption, 'Temporarily unavailable'],
      [treeItem, 'Requires membership'],
    ] as const) {
      expect(element).toHaveAccessibleDescription(reason)
      expect(within(element).getByText(reason).closest('.sr-only')).toBeNull()
    }
    expect(link).not.toHaveAttribute('href')
    expect(linkOption).not.toHaveAttribute('href')
  })

  it('hydrates description associations without changing ids or refs', async () => {
    const ref = React.createRef<HTMLAnchorElement>()
    const inactiveRef = React.createRef<HTMLAnchorElement>()
    const routerRef = React.createRef<HTMLAnchorElement>()
    const app = (
      <ActionList>
        <ActionList.LinkItem href="#repository" ref={ref}>
          Repository
          <ActionList.Description>Recently updated</ActionList.Description>
          <ActionList.TrailingVisual>Ready</ActionList.TrailingVisual>
        </ActionList.LinkItem>
        <ActionList.Item inactiveText="Requires access">Transfer</ActionList.Item>
        <ActionList.LinkItem
          href="#billing"
          inactiveText={<span>Requires billing access</span>}
          ref={inactiveRef}
          // The render element receives its children from LinkItem when active.
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          render={<a href="#router-billing" ref={routerRef} />}
        >
          Billing
        </ActionList.LinkItem>
      </ActionList>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(app)
    document.body.append(container)
    const serverLink = container.querySelector('a')
    const serverDescription = serverLink?.getAttribute('aria-describedby')
    const serverInactive = container.querySelector('button')
    const serverInactiveDescription = serverInactive?.getAttribute('aria-describedby')
    const serverInactiveLink = container.querySelector('[aria-disabled="true"]:not(button)')
    const serverInactiveLinkDescription = serverInactiveLink?.getAttribute('aria-describedby')
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      const link = screen.getByRole('link', {name: 'Repository Ready'})
      expect(link).toBe(serverLink)
      expect(ref.current).toBe(link)
      expect(link).toHaveAttribute('aria-describedby', serverDescription)
      expect(link).toHaveAccessibleDescription('Recently updated')
      const inactive = screen.getByRole('button', {name: 'Transfer'})
      expect(inactive).toBe(serverInactive)
      expect(inactive).toHaveAttribute('aria-describedby', serverInactiveDescription)
      expect(inactive).toHaveAccessibleDescription('Requires access')
      const inactiveLink = screen.getByText('Billing').closest('[aria-disabled="true"]')
      expect(inactiveLink).toBe(serverInactiveLink)
      expect(inactiveLink).toHaveAttribute('aria-describedby', serverInactiveLinkDescription)
      expect(inactiveLink).toHaveAccessibleDescription('Requires billing access')
      expect(inactiveLink).not.toHaveAttribute('href')
      expect(inactiveRef.current).toBe(inactiveLink)
      expect(routerRef.current).toBeNull()
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('preserves custom-rendered item names, descriptions, refs, and click handlers', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLAnchorElement>()
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
    render(
      <>
        <span id="router-note">Opens settings</span>
        <ActionList>
          <ActionList.LinkItem
            onClick={onClick}
            ref={ref}
            render={<a aria-describedby="router-note" aria-label="Repository settings" href="/settings" />}
          >
            Settings
            <ActionList.Description>Manage settings</ActionList.Description>
          </ActionList.LinkItem>
        </ActionList>
      </>,
    )
    const link = screen.getByRole('link', {name: 'Repository settings'})
    expect(ref.current).toBe(link)
    expect(link).toHaveAccessibleDescription('Opens settings Manage settings')
    await user.click(link)
    expect(onClick).toHaveBeenCalledOnce()
  })

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

  it('composes directly owned listbox options and groups with roving focus', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onNavigate = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
    const listRef = React.createRef<HTMLDivElement>()
    const groupRef = React.createRef<HTMLDivElement>()
    const itemRef = React.createRef<HTMLButtonElement>()
    const linkRef = React.createRef<HTMLAnchorElement>()
    render(
      <ActionList.Listbox aria-label="Selection" ref={listRef} selectionVariant="single">
        <ActionList.Item
          aria-describedby="first-description"
          aria-label="First"
          onSelect={onSelect}
          ref={itemRef}
          selected
        >
          First
          <ActionList.Description id="first-description">A description</ActionList.Description>
        </ActionList.Item>
        <ActionList.Listbox.Divider />
        <ActionList.Listbox.Group aria-label="Repositories" ref={groupRef}>
          <ActionList.GroupHeading variant="filled">Repositories</ActionList.GroupHeading>
          <ActionList.Item disabled onSelect={onSelect}>
            Unavailable
          </ActionList.Item>
          <ActionList.LinkItem
            aria-selected="true"
            onClick={onNavigate}
            ref={linkRef}
            render={<a href="/files">Files</a>}
          >
            Files
          </ActionList.LinkItem>
        </ActionList.Listbox.Group>
      </ActionList.Listbox>,
    )

    const listbox = screen.getByRole('listbox', {name: 'Selection'})
    const group = screen.getByRole('group', {name: 'Repositories'})
    const first = screen.getByRole('option', {name: 'First'})
    const disabled = screen.getByRole('option', {name: 'Unavailable'})
    const link = screen.getByRole('option', {name: 'Files'})
    expect(listRef.current).toBe(listbox)
    expect(groupRef.current).toBe(group)
    expect(itemRef.current).toBe(first)
    expect(first.tagName).toBe('BUTTON')
    expect(linkRef.current).toBe(link)
    expect(first.parentElement).toBe(listbox)
    expect(group.parentElement).toBe(listbox)
    expect(disabled.parentElement).toBe(group)
    expect(link.parentElement).toBe(group)
    expect(first).toHaveAttribute('aria-selected', 'true')
    expect(first).toHaveAccessibleDescription('A description')
    expect(first.querySelector('[data-component="ActionList.Selection"]')).toBeInTheDocument()
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    expect(disabled).not.toHaveAttribute('disabled')
    expect(link).toHaveAttribute('href', '/files')
    expect(link).toHaveAttribute('aria-selected', 'true')
    expect(link).toHaveAttribute('data-selected', 'true')
    expect(listbox.querySelector('[role="none"], [role="presentation"]')).toBeNull()

    await user.tab()
    expect(first).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(disabled).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onSelect).not.toHaveBeenCalled()
    await user.keyboard('{ArrowDown}')
    expect(link).toHaveFocus()
    await user.keyboard(' ')
    expect(onNavigate).not.toHaveBeenCalled()
    await user.keyboard('{Enter}')
    expect(onNavigate).toHaveBeenCalledOnce()
  })

  it('announces a direct listbox with multiple selection', () => {
    render(
      <ActionList.Listbox aria-label="Projects" selectionVariant="multiple">
        <ActionList.Item selected>Primer React</ActionList.Item>
      </ActionList.Listbox>,
    )
    expect(screen.getByRole('listbox', {name: 'Projects'})).toHaveAttribute('aria-multiselectable', 'true')
  })

  it('renders focusable tree items as directly owned list items', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const treeRef = React.createRef<HTMLUListElement>()
    const itemRef = React.createRef<HTMLElement>()
    render(
      <ActionList
        aria-label="Projects"
        aria-multiselectable="true"
        disableFocusZone
        ref={treeRef}
        role="tree"
        selectionVariant="multiple"
      >
        {/* eslint-disable-next-line jsx-a11y/role-has-required-aria-props */}
        <li aria-checked="mixed" aria-expanded="true" aria-level={1} role="treeitem" tabIndex={0}>
          <ActionList.GroupHeading as="div">Group</ActionList.GroupHeading>
          <ul role="group">
            <ActionList.TreeItem aria-checked="mixed" aria-level={2} disabled onSelect={onSelect} ref={itemRef}>
              Unavailable
            </ActionList.TreeItem>
            <ActionList.TreeItem aria-checked="true" aria-level={2} onSelect={onSelect}>
              Project
            </ActionList.TreeItem>
          </ul>
        </li>
      </ActionList>,
    )

    const tree = screen.getByRole('tree', {name: 'Projects'})
    const group = screen.getByRole('group')
    const disabled = screen.getByRole('treeitem', {name: 'Unavailable'})
    const project = screen.getByRole('treeitem', {name: 'Project'})
    expect(treeRef.current).toBe(tree)
    expect(tree.tagName).toBe('UL')
    expect(disabled.tagName).toBe('LI')
    expect(disabled.parentElement).toBe(group)
    expect(itemRef.current).toBe(disabled)
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    expect(disabled).toHaveAttribute('aria-checked', 'mixed')
    expect(disabled).not.toHaveAttribute('aria-selected')
    expect(disabled.querySelector('[data-component="ActionList.Selection"]')).toBeInTheDocument()
    expect(tree.querySelector('[role="none"], [role="presentation"]')).toBeNull()
    disabled.focus()
    await user.keyboard('{Enter}')
    expect(onSelect).not.toHaveBeenCalled()
    project.focus()
    expect(project).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('respects cancelled tree item activation for pointer and keyboard events', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onClick = vi.fn((event: React.MouseEvent<HTMLElement>) => event.preventDefault())
    render(
      <ActionList aria-label="Projects" role="tree">
        <ActionList.TreeItem onClick={onClick} onSelect={onSelect}>
          Cancelled
        </ActionList.TreeItem>
        <ActionList.TreeItem onKeyDown={event => event.preventDefault()} onSelect={onSelect}>
          Key cancelled
        </ActionList.TreeItem>
      </ActionList>,
    )

    const cancelled = screen.getByRole('treeitem', {name: 'Cancelled'})
    await user.click(cancelled)
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(3)
    expect(onSelect).not.toHaveBeenCalled()

    screen.getByRole('treeitem', {name: 'Key cancelled'}).focus()
    await user.keyboard('{Enter}')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('hydrates directly owned listbox options and tree items without a mismatch', async () => {
    const app = (
      <>
        <ActionList.Listbox aria-label="Selection">
          <ActionList.Listbox.Group title="Projects">
            <ActionList.Item selected>Primer React</ActionList.Item>
          </ActionList.Listbox.Group>
        </ActionList.Listbox>
        <ActionList aria-label="Files" role="tree">
          <ActionList.TreeItem>README.md</ActionList.TreeItem>
        </ActionList>
      </>
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
      expect(screen.getByRole('option', {name: 'Primer React'})).toBeInTheDocument()
      expect(screen.getByRole('treeitem', {name: 'README.md'}).tagName).toBe('LI')
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
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
    expect(selected).toHaveClass('primer:rounded-full')
    expect(selected).toHaveAttribute('data-checked')
    expect(unselected).toHaveClass('primer:rounded-full')
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

  it('places wrapped trailing actions from explicit regions beside items and group headings', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    function WrappedItemAction() {
      return <ActionList.TrailingAction label="Item actions" onClick={onAction} />
    }
    function WrappedLinkAction() {
      return <ActionList.TrailingAction label="Link actions" onClick={onAction} />
    }
    function WrappedGroupAction() {
      return <ActionList.GroupHeading.TrailingAction icon={ArrowRightIcon} label="Group actions" onClick={onAction} />
    }
    render(
      <ActionList>
        <ActionList.Item trailingAction={<WrappedItemAction />}>Repository</ActionList.Item>
        <ActionList.LinkItem href="#settings" trailingAction={<WrappedLinkAction />}>
          Settings
        </ActionList.LinkItem>
        <ActionList.Group>
          <ActionList.GroupHeading trailingAction={<WrappedGroupAction />}>Projects</ActionList.GroupHeading>
          <ActionList.Item>Primer</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    const item = screen.getByRole('button', {name: 'Repository'})
    const itemAction = screen.getByRole('button', {name: 'Item actions'})
    const link = screen.getByRole('link', {name: 'Settings'})
    const linkAction = screen.getByRole('button', {name: 'Link actions'})
    const heading = screen.getByRole('heading', {name: 'Projects'})
    const groupAction = screen.getByRole('button', {name: 'Group actions'})
    expect(item.closest('li')).toContainElement(itemAction)
    expect(item).not.toContainElement(itemAction)
    expect(link.closest('li')).toContainElement(linkAction)
    expect(link).not.toContainElement(linkAction)
    expect(heading.parentElement).toContainElement(groupAction)
    expect(heading).not.toContainElement(groupAction)
    await user.click(itemAction)
    await user.click(linkAction)
    await user.click(groupAction)
    expect(onAction).toHaveBeenCalledTimes(3)
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
    expect(link).toHaveClass('primer:text-[var(--button-invisible-iconColor-rest)]')
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

  it('keeps disabled items focusable in composite widgets but not in plain lists', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
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
        <ActionList role="menubar" aria-label="Menubar">
          <ActionList.Item disabled onClick={onClick} onSelect={onSelect}>
            Disabled menubar item
          </ActionList.Item>
        </ActionList>
        <ActionList role="tree" aria-label="Tree">
          <ActionList.Item disabled onClick={onClick} onSelect={onSelect} role="treeitem">
            Disabled tree item
          </ActionList.Item>
          <ActionList.Item disabled focusableWhenDisabled={false}>
            Explicitly unfocusable tree item
          </ActionList.Item>
        </ActionList>
        <ActionList>
          <ActionList.Item disabled onSelect={onSelect}>
            Disabled list item
          </ActionList.Item>
          <ActionList.Item disabled focusableWhenDisabled onClick={onClick} onSelect={onSelect}>
            Explicitly focusable list item
          </ActionList.Item>
        </ActionList>
      </>,
    )

    const menuItem = screen.getByRole('menuitem', {name: 'Disabled menu item'})
    const option = screen.getByRole('option', {name: 'Disabled option'})
    const menubarItem = screen.getByRole('menuitem', {name: 'Disabled menubar item'})
    const treeItem = screen.getByRole('treeitem', {name: 'Disabled tree item'})
    const explicitlyFocusable = screen.getByRole('button', {name: 'Explicitly focusable list item'})
    for (const item of [menuItem, option, menubarItem, treeItem, explicitlyFocusable]) {
      expect(item).toHaveAttribute('aria-disabled', 'true')
      expect(item).not.toBeDisabled()
      item.focus()
      expect(item).toHaveFocus()
      await user.keyboard('{Enter}[Space]')
      await user.click(item)
    }
    expect(onClick).not.toHaveBeenCalled()
    expect(onSelect).not.toHaveBeenCalled()
    expect(screen.getByRole('button', {name: 'Disabled list item'})).toBeDisabled()
    expect(screen.getByRole('treeitem', {name: 'Explicitly unfocusable tree item'})).toBeDisabled()
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

    expect(screen.getByRole('menuitemradio', {name: 'Active item'})).not.toHaveClass('primer:bg-accent-muted')
    expect(screen.getByText('Unavailable due to an outage')).toHaveClass('primer:text-attention')
  })

  it('does not activate inactive or loading items and restores handlers when available', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onClickCapture = vi.fn()
    const onSelect = vi.fn()
    const onRenderedClick = vi.fn()
    const list = (inactive: boolean) => (
      <ActionList>
        <ActionList.Item inactiveText="Requires access" onClick={onClick} onSelect={onSelect}>
          Inactive
        </ActionList.Item>
        <ActionList.Item loading onClick={onClick} onSelect={onSelect}>
          Loading
        </ActionList.Item>
        <ActionList.Item
          inactiveText={inactive ? 'Requires access' : undefined}
          onClick={onClick}
          onClickCapture={onClickCapture}
          onSelect={onSelect}
          render={<button onClick={onRenderedClick} type="button" />}
        >
          Rendered inactive
        </ActionList.Item>
      </ActionList>
    )
    const {rerender} = render(list(true))
    fireEvent.click(screen.getByRole('button', {name: 'Inactive'}))
    fireEvent.click(screen.getByRole('button', {name: 'Loading'}))
    const renderedItem = screen.getByRole('button', {name: 'Rendered inactive'})
    expect(renderedItem).toHaveAttribute('aria-disabled', 'true')
    expect(renderedItem).not.toBeDisabled()
    renderedItem.focus()
    await user.keyboard('{Enter}[Space]')
    await user.click(renderedItem)
    expect(onClick).not.toHaveBeenCalled()
    expect(onClickCapture).not.toHaveBeenCalled()
    expect(onSelect).not.toHaveBeenCalled()
    expect(onRenderedClick).not.toHaveBeenCalled()

    rerender(list(false))
    await user.click(screen.getByRole('button', {name: 'Rendered inactive'}))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onClickCapture).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledOnce()
    expect(onRenderedClick).toHaveBeenCalledOnce()
  })

  it('prevents internal custom-render activation while an option is inactive', () => {
    const onInternalClick = vi.fn()
    const onInternalAuxClick = vi.fn()
    const onInternalKeyDown = vi.fn()
    const onInternalKeyUp = vi.fn()
    const onClickCapture = vi.fn()
    const onAuxClickCapture = vi.fn()
    const onKeyDownCapture = vi.fn()
    const onKeyUpCapture = vi.fn()
    const onSelect = vi.fn()
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
    const list = (inactive: boolean) => (
      <ActionList.Listbox aria-label="Projects" selectionVariant="single">
        <ActionList.Item
          inactiveText={inactive ? 'Requires access' : undefined}
          onAuxClickCapture={onAuxClickCapture}
          onClickCapture={onClickCapture}
          onKeyDownCapture={onKeyDownCapture}
          onKeyUpCapture={onKeyUpCapture}
          onSelect={onSelect}
          render={<InternalButton />}
        >
          Restricted project
        </ActionList.Item>
      </ActionList.Listbox>
    )
    const {rerender} = render(list(true))
    const item = screen.getByRole('option', {name: 'Restricted project'})
    expect(fireEvent.click(item)).toBe(false)
    expect(fireEvent(item, new MouseEvent('auxclick', {bubbles: true, button: 1, cancelable: true}))).toBe(false)
    expect(fireEvent.keyDown(item, {key: 'Enter'})).toBe(false)
    expect(fireEvent.keyDown(item, {key: ' '})).toBe(false)
    expect(fireEvent.keyUp(item, {key: 'Enter'})).toBe(false)
    expect(fireEvent.keyUp(item, {key: ' '})).toBe(false)
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
    expect(onSelect).not.toHaveBeenCalled()

    rerender(list(false))
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
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('guards capture handlers supplied by inactive render elements and callbacks', () => {
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
    const list = (inactive: boolean) => (
      <ActionList.Listbox aria-label="Projects" selectionVariant="single">
        <ActionList.Item
          inactiveText={inactive ? 'Requires access' : undefined}
          onKeyDownCapture={onItemKeyDownCapture}
          onKeyUpCapture={onItemKeyUpCapture}
          ref={ref}
          render={<button {...renderedHandlers} type="button" />}
        >
          Element
        </ActionList.Item>
        <ActionList.Item
          inactiveText={inactive ? 'Requires access' : undefined}
          render={props => <button {...props} {...renderedHandlers} type="button" />}
        >
          Callback
        </ActionList.Item>
      </ActionList.Listbox>
    )
    const {rerender} = render(list(true))
    const element = screen.getByRole('option', {name: 'Element'})
    const callback = screen.getByRole('option', {name: 'Callback'})
    expect(ref.current).toBe(element)
    for (const item of [element, callback]) {
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
    expect(onRenderedKeyDownCapture).toHaveBeenCalledTimes(2)
    expect(onRenderedKeyUpCapture).toHaveBeenCalledTimes(2)
    expect(onItemKeyDownCapture).toHaveBeenCalledOnce()
    expect(onItemKeyUpCapture).toHaveBeenCalledOnce()

    rerender(list(false))
    expect(ref.current).toBe(element)
    fireEvent.keyDown(element, {key: 'Enter'})
    fireEvent.keyUp(element, {key: 'Enter'})
    fireEvent(element, new MouseEvent('auxclick', {bubbles: true, button: 1, cancelable: true}))
    fireEvent.click(element)
    expect(onRenderedClickCapture).toHaveBeenCalledOnce()
    expect(onRenderedAuxClickCapture).toHaveBeenCalledOnce()
    expect(onRenderedKeyDownCapture).toHaveBeenCalledTimes(3)
    expect(onRenderedKeyUpCapture).toHaveBeenCalledTimes(3)
    expect(onItemKeyDownCapture).toHaveBeenCalledTimes(2)
    expect(onItemKeyUpCapture).toHaveBeenCalledTimes(2)
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

  it('honors explicit selection attributes and keeps checkbox visuals in sync', () => {
    render(
      <ActionList aria-label="Projects" aria-multiselectable="true" role="tree" selectionVariant="multiple">
        <ActionList.Item aria-checked={false} selected>
          Unchecked
        </ActionList.Item>
        <ActionList.Item aria-checked="true" selected={false}>
          Checked
        </ActionList.Item>
        <ActionList.Item aria-checked="mixed" disabled>
          Partially checked
        </ActionList.Item>
        <ActionList.Item aria-selected={false} selected>
          Explicitly unselected
        </ActionList.Item>
        <ActionList.Item aria-checked={false} aria-selected="true">
          Distinct states
        </ActionList.Item>
        <ActionList.Item selected>Default selection</ActionList.Item>
      </ActionList>,
    )

    const indicator = (name: string) =>
      screen.getByRole('treeitem', {name}).querySelector('[data-component="ActionList.Selection"] > span')
    const unchecked = screen.getByRole('treeitem', {name: 'Unchecked'})
    expect(unchecked).toHaveAttribute('aria-checked', 'false')
    expect(unchecked).not.toHaveAttribute('aria-selected')
    expect(unchecked).not.toHaveAttribute('data-selected')
    expect(indicator('Unchecked')).not.toHaveAttribute('data-checked')

    const checked = screen.getByRole('treeitem', {name: 'Checked'})
    expect(checked).toHaveAttribute('aria-checked', 'true')
    expect(checked).not.toHaveAttribute('aria-selected')
    expect(checked).toHaveAttribute('data-selected')
    expect(indicator('Checked')).toHaveAttribute('data-checked')

    const mixed = screen.getByRole('treeitem', {name: 'Partially checked'})
    expect(mixed).toHaveAttribute('aria-checked', 'mixed')
    expect(mixed).not.toHaveAttribute('aria-selected')
    expect(mixed).toHaveAttribute('data-indeterminate')
    expect(indicator('Partially checked')).toHaveAttribute('data-indeterminate')
    expect(indicator('Partially checked')).toHaveAttribute('data-disabled')
    expect(indicator('Partially checked')).not.toHaveAttribute('data-checked')
    expect(indicator('Partially checked')?.querySelector('svg')).toHaveAttribute('viewBox', '0 0 10 2')

    const unselected = screen.getByRole('treeitem', {name: 'Explicitly unselected'})
    expect(unselected).toHaveAttribute('aria-selected', 'false')
    expect(unselected).not.toHaveAttribute('aria-checked')
    expect(indicator('Explicitly unselected')).not.toHaveAttribute('data-checked')

    const distinct = screen.getByRole('treeitem', {name: 'Distinct states'})
    expect(distinct).toHaveAttribute('aria-checked', 'false')
    expect(distinct).toHaveAttribute('aria-selected', 'true')
    expect(indicator('Distinct states')).not.toHaveAttribute('data-checked')
    expect(screen.getByRole('treeitem', {name: 'Default selection'})).toHaveAttribute('aria-selected', 'true')
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

    expect(getByRole('button', {name: 'Repository Loading repository'})).toHaveAttribute('aria-disabled', 'true')
    expect(container.querySelector('[data-component="ActionList.TrailingAction.Button"]')).toBeNull()
  })

  it.each([
    {mode: 'direct', nameProps: {'aria-label': 'Repository status'}},
    {mode: 'element', nameProps: {'aria-label': 'Repository status'}},
    {mode: 'callback', nameProps: {'aria-label': 'Repository status'}},
    {mode: 'direct', nameProps: {'aria-labelledby': 'repository-label'}},
    {mode: 'element', nameProps: {'aria-labelledby': 'repository-label'}},
    {mode: 'callback', nameProps: {'aria-labelledby': 'repository-label'}},
  ])('preserves loading descriptions with explicit names: %j', ({mode, nameProps}) => {
    const fixture = (loading: boolean) => (
      <>
        <span id="repository-label">Repository status</span>
        <ActionList>
          <ActionList.Item
            {...(mode === 'direct' ? nameProps : {})}
            loading={loading}
            loadingText="Loading repository"
            render={
              mode === 'callback' ? (
                props => <button {...props} type="button" {...nameProps} />
              ) : mode === 'element' ? (
                <button type="button" {...nameProps} />
              ) : undefined
            }
          >
            Repository
          </ActionList.Item>
        </ActionList>
      </>
    )
    const {rerender} = render(fixture(true))
    const item = screen.getByRole('button', {name: 'Repository status'})
    expect(item).toHaveAccessibleDescription('Loading repository')
    const reference = item.getAttribute('aria-describedby')
    expect(reference).toBeTruthy()
    expect(document.getElementById(reference!)).toHaveTextContent('Loading repository')
    rerender(fixture(false))
    expect(item).not.toHaveAttribute('aria-describedby')
    expect(item).toHaveAccessibleName('Repository status')
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

    expect(container.querySelector('[data-component="ActionList.GroupHeading"]')).toHaveClass('primer:bg-muted')
    expect(container.querySelector('[data-component="ActionList.Item.Action"]')).toHaveClass('primer:py-2.5')
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

  it('renders auxiliary group text separately from the heading and trailing action', () => {
    render(
      <ActionList>
        <ActionList.Group>
          <ActionList.GroupHeading auxiliaryText="Choose one repository">
            Repositories
            <ActionList.GroupHeading.TrailingAction icon={ArrowRightIcon} label="Manage repositories" />
          </ActionList.GroupHeading>
          <ActionList.Item>Primer React</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    const heading = screen.getByRole('heading', {name: 'Repositories'})
    const auxiliary = screen.getByText('Choose one repository')
    const action = screen.getByRole('button', {name: 'Manage repositories'})
    expect(heading).not.toContainElement(auxiliary)
    expect(heading).not.toContainElement(action)
    expect(auxiliary).toHaveClass('primer:font-normal')
  })

  it.each(['menu', 'menubar', 'listbox', 'tree'] as const)('uses a neutral default group heading in a %s', role => {
    const {container} = render(
      <ActionList aria-label="Projects" role={role}>
        <ActionList.Group>
          <ActionList.GroupHeading>Repositories</ActionList.GroupHeading>
          <ActionList.Item>Primer React</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    const group = within(container).getByRole('group', {name: 'Repositories'})
    const heading = container.querySelector('[data-component="ActionList.GroupHeading"] > *')
    expect(heading?.tagName).toBe('SPAN')
    expect(heading).not.toHaveAttribute('role')
    expect(group).toHaveAttribute('aria-labelledby', heading?.id)
  })

  it('keeps explicit list heading levels and neutral composite heading elements', () => {
    const headingRef = React.createRef<HTMLElement>()
    render(
      <>
        <ActionList>
          <ActionList.Group>
            <ActionList.GroupHeading as="h2">Favorites</ActionList.GroupHeading>
          </ActionList.Group>
        </ActionList>
        <ActionList aria-label="Projects" role="menu">
          <ActionList.Group>
            <ActionList.GroupHeading as="div" data-testid="custom-heading" id="custom-heading" ref={headingRef}>
              Repositories
            </ActionList.GroupHeading>
            <ActionList.Item>Primer React</ActionList.Item>
          </ActionList.Group>
        </ActionList>
      </>,
    )

    expect(screen.getByRole('heading', {name: 'Favorites', level: 2})).toBeInTheDocument()
    const group = screen.getByRole('group', {name: 'Repositories'})
    expect(headingRef.current?.tagName).toBe('DIV')
    expect(headingRef.current).toHaveAttribute('id', 'custom-heading')
    expect(headingRef.current).toHaveAttribute('data-testid', 'custom-heading')
    expect(headingRef.current).not.toHaveAttribute('role')
    expect(group).toHaveAttribute('aria-labelledby', 'custom-heading')
  })

  it.each(['menu', 'menubar', 'listbox'] as const)('rejects semantic headings in a %s group', role => {
    expect(() =>
      render(
        <ActionList aria-label="Projects" role={role}>
          <ActionList.Group>
            <ActionList.GroupHeading as="h2">Repositories</ActionList.GroupHeading>
          </ActionList.Group>
        </ActionList>,
      ),
    ).toThrow(/menu or listbox group heading cannot use a semantic heading/)
  })

  it('renders auxiliary text for group headings without putting it in the group name', () => {
    const titleGroupProps = {auxiliaryText: 'Pinned by your team', title: 'Pinned'}
    render(
      <>
        <ActionList>
          <ActionList.Group auxiliaryText="Frequently visited">
            <ActionList.GroupHeading>Favorites</ActionList.GroupHeading>
            <ActionList.Item>Primer React</ActionList.Item>
          </ActionList.Group>
          <ActionList.Group {...titleGroupProps}>
            <ActionList.Item>Octicons</ActionList.Item>
          </ActionList.Group>
        </ActionList>
        <ActionList.Listbox aria-label="Projects">
          <ActionList.Listbox.Group auxiliaryText="Additional projects" title="Libraries">
            <ActionList.Item>Octicons</ActionList.Item>
          </ActionList.Listbox.Group>
        </ActionList.Listbox>
      </>,
    )

    expect(screen.getByRole('heading', {name: 'Favorites'})).toBeInTheDocument()
    expect(screen.getByText('Frequently visited')).toBeVisible()
    expect(screen.getByRole('heading', {name: 'Pinned'})).toBeInTheDocument()
    expect(screen.getByText('Pinned by your team')).toBeVisible()
    const group = screen.getByRole('group', {name: 'Libraries'})
    expect(group).toContainElement(screen.getByText('Additional projects'))
    expect(group).not.toHaveAccessibleDescription()
    expect(group).toContainElement(screen.getByRole('option', {name: 'Octicons'}))
  })

  it('forwards a generated group label to a wrapped direct-listbox heading', () => {
    function WrappedHeading({id}: {id?: string}) {
      return <ActionList.GroupHeading id={id}>Repositories</ActionList.GroupHeading>
    }

    render(
      <>
        <p id="group-help">Choose a project to continue.</p>
        <ActionList.Listbox aria-label="Projects">
          <ActionList.Listbox.Group
            aria-describedby="group-help"
            auxiliaryText="Choose one repository"
            heading={<WrappedHeading />}
          >
            <ActionList.Item>Primer React</ActionList.Item>
          </ActionList.Listbox.Group>
        </ActionList.Listbox>
      </>,
    )

    const group = screen.getByRole('group', {name: 'Repositories'})
    expect(group).toContainElement(screen.getByText('Choose one repository'))
    expect(group).toContainElement(screen.getByRole('option', {name: 'Primer React'}))
    expect(group).toHaveAccessibleDescription('Choose a project to continue.')
    expect(group.querySelector('[role="none"], [role="presentation"]')).toBeNull()
  })

  it('forwards a generated group label to a wrapped menu heading', () => {
    function WrappedHeading({id}: {id?: string}) {
      return (
        <ActionList.GroupHeading auxiliaryText="Frequently visited" id={id}>
          Repositories
        </ActionList.GroupHeading>
      )
    }

    render(
      <ActionList aria-label="Projects" role="menu">
        <ActionList.Group heading={<WrappedHeading />}>
          <ActionList.Item>Primer React</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    const group = screen.getByRole('group', {name: 'Repositories'})
    const headingId = group.getAttribute('aria-labelledby')
    expect(headingId ? document.getElementById(headingId) : null).toHaveTextContent('Repositories')
    expect(group).toContainElement(screen.getByRole('menuitem', {name: 'Primer React'}))
    expect(screen.getByText('Frequently visited')).toBeVisible()
  })

  it('lets a heading override group-level auxiliary text', () => {
    render(
      <ActionList>
        <ActionList.Group auxiliaryText="Group default">
          <ActionList.GroupHeading auxiliaryText="Heading override">Repositories</ActionList.GroupHeading>
          <ActionList.Item>Primer React</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    expect(screen.getByText('Heading override')).toBeVisible()
    expect(screen.queryByText('Group default')).not.toBeInTheDocument()
  })

  it('rejects group-level auxiliary text when no heading is supplied', () => {
    expect(() =>
      render(
        <ActionList>
          <ActionList.Group auxiliaryText="Additional information">
            <ActionList.Item>Primer React</ActionList.Item>
          </ActionList.Group>
        </ActionList>,
      ),
    ).toThrow(/auxiliaryText requires a group heading/)
  })

  it('keeps wrapped group heading references and auxiliary text through hydration', async () => {
    function WrappedHeading({id}: {id?: string}) {
      return (
        <ActionList.GroupHeading auxiliaryText="Additional projects" id={id}>
          Repositories
        </ActionList.GroupHeading>
      )
    }

    const app = (
      <ActionList.Listbox aria-label="Projects">
        <ActionList.Listbox.Group heading={<WrappedHeading />}>
          <ActionList.Item>Primer React</ActionList.Item>
        </ActionList.Listbox.Group>
      </ActionList.Listbox>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(app)
    document.body.append(container)
    const serverGroup = within(container).getByRole('group', {name: 'Repositories'})
    const headingId = serverGroup.getAttribute('aria-labelledby')
    expect(headingId).toBeTruthy()
    expect(headingId ? document.getElementById(headingId) : null).toHaveTextContent('Repositories')
    expect(serverGroup).toContainElement(within(container).getByText('Additional projects'))
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      const hydratedGroup = within(container).getByRole('group', {name: 'Repositories'})
      expect(hydratedGroup).toBe(serverGroup)
      expect(hydratedGroup).toHaveAttribute('aria-labelledby', headingId)
      expect(hydratedGroup).toContainElement(within(container).getByText('Additional projects'))
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
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
    expect(item).toHaveClass('primer:text-xs')
    expect(item.closest('[data-size]')).toHaveAttribute('data-size', 'small')
    expect(item.closest('[data-size]')).toHaveClass('primer:py-1')
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
    expect(link).toHaveClass('primer:py-1')
    expect(screen.getByText('Docs')).toHaveClass('primer:text-xs')
  })

  it('composes a router link with native keyboard behavior, refs, and event handlers', async () => {
    const navigate = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
    const onClick = vi.fn()
    const ref = React.createRef<HTMLAnchorElement>()
    const routerRef = React.createRef<HTMLAnchorElement>()
    const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'> & {to: string}>(
      function RouterLink({children, to, ...props}, linkRef) {
        return (
          <a {...props} href={to} ref={linkRef}>
            {children}
          </a>
        )
      },
    )
    render(
      <ActionList>
        <ActionList.LinkItem
          active
          className="consumer-class"
          data-testid="project-link"
          onClick={onClick}
          ref={ref}
          render={
            <RouterLink
              className="router-class"
              data-router-link="true"
              onClick={navigate}
              ref={routerRef}
              to="/projects"
            />
          }
        >
          Projects
        </ActionList.LinkItem>
      </ActionList>,
    )

    const link = screen.getByRole('link', {name: /^Projects$/})
    expect(link).toHaveAttribute('href', '/projects')
    expect(link).toHaveAttribute('data-testid', 'project-link')
    expect(link).toHaveAttribute('data-router-link', 'true')
    expect(link).toHaveClass('consumer-class', 'router-class')
    expect(link).toHaveAttribute('data-active', 'true')
    expect(ref.current).toBe(link)
    expect(routerRef.current).toBe(link)

    await userEvent.tab()
    expect(link).toHaveFocus()
    await userEvent.keyboard(' ')
    expect(navigate).not.toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}')
    expect(navigate).toHaveBeenCalledOnce()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('passes link state to a render callback', () => {
    render(
      <ActionList>
        <ActionList.LinkItem
          active
          render={(props, state) => (
            <a {...props} data-router-active={String(state.active)} href="/projects">
              {props.children}
            </a>
          )}
        >
          Projects
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(screen.getByRole('link', {name: 'Projects'})).toHaveAttribute('data-router-active', 'true')
  })

  it('forwards an explicit option role and state to a custom link', async () => {
    const navigate = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
    render(
      <ActionList aria-label="Files" role="listbox">
        <ActionList.LinkItem aria-selected="true" onClick={navigate} render={<a href="/files">Files</a>} role="option">
          Files
        </ActionList.LinkItem>
      </ActionList>,
    )

    const option = screen.getByRole('option', {name: 'Files'})
    expect(option).toHaveAttribute('href', '/files')
    expect(option).toHaveAttribute('aria-selected', 'true')
    expect(option.parentElement?.parentElement).toBe(screen.getByRole('listbox', {name: 'Files'}))
    await userEvent.click(option)
    expect(navigate).toHaveBeenCalledOnce()
  })

  it('keeps a custom link and its trailing action independently interactive', async () => {
    const navigate = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
    const pin = vi.fn()
    render(
      <ActionList>
        <ActionList.LinkItem
          render={
            <a href="/projects" onClick={navigate}>
              Projects
            </a>
          }
        >
          Projects
          <ActionList.TrailingAction label="Pin" onClick={pin} />
        </ActionList.LinkItem>
      </ActionList>,
    )

    const link = screen.getByRole('link', {name: 'Projects'})
    const action = screen.getByRole('button', {name: 'Pin'})
    expect(link.contains(action)).toBe(false)
    await userEvent.click(action)
    expect(pin).toHaveBeenCalledOnce()
    expect(navigate).not.toHaveBeenCalled()
    await userEvent.click(link)
    expect(navigate).toHaveBeenCalledOnce()
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

  it('only invokes a native link click handler while the item is available', () => {
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
    const list = (inactive: boolean) => (
      <ActionList>
        <ActionList.LinkItem href="#docs" inactiveText={inactive ? 'Unavailable' : undefined} onClick={onClick}>
          Docs
        </ActionList.LinkItem>
      </ActionList>
    )
    const {rerender} = render(list(true))
    fireEvent.click(screen.getByText('Docs').closest('[aria-disabled="true"]')!)
    expect(onClick).not.toHaveBeenCalled()

    rerender(list(false))
    fireEvent.click(screen.getByRole('link', {name: 'Docs'}))
    expect(onClick).toHaveBeenCalledOnce()

    rerender(list(true))
    fireEvent.click(screen.getByText('Docs').closest('[aria-disabled="true"]')!)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not render or activate a custom link while inactive', () => {
    const onClick = vi.fn()
    const routerClick = vi.fn()
    const onFocus = vi.fn()
    const onClickCapture = vi.fn()
    const onAuxClickCapture = vi.fn()
    const onKeyDownCapture = vi.fn()
    const onKeyUpCapture = vi.fn()
    const routerRef = React.createRef<HTMLAnchorElement>()
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <ActionList>
        <ActionList.LinkItem
          aria-disabled={false}
          data-testid="inactive-project"
          inactiveText="Unavailable due to an outage"
          onAuxClickCapture={onAuxClickCapture}
          onClick={onClick}
          onClickCapture={onClickCapture}
          onFocus={onFocus}
          onKeyDownCapture={onKeyDownCapture}
          onKeyUpCapture={onKeyUpCapture}
          ref={ref}
          // The render element receives its children from LinkItem when active.
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          render={<a href="/projects" onClick={routerClick} ref={routerRef} />}
        >
          Projects
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(routerRef.current).toBeNull()
    const item = screen.getByText('Projects').closest('[data-inactive]')!
    expect(ref.current).toBe(item)
    expect(item).toBe(screen.getByTestId('inactive-project'))
    expect(item.tagName).toBe('A')
    expect(item).not.toHaveAttribute('href')
    expect(item).toHaveAttribute('aria-disabled', 'true')
    fireEvent.focus(item)
    fireEvent.keyDown(item, {key: 'Shift'})
    fireEvent.keyUp(item, {key: 'Shift'})
    fireEvent.keyDown(item, {key: 'Enter'})
    fireEvent.keyUp(item, {key: ' '})
    fireEvent.click(item)
    fireEvent(item, new MouseEvent('auxclick', {bubbles: true, cancelable: true, button: 1}))
    expect(onFocus).toHaveBeenCalledOnce()
    expect(onKeyDownCapture).toHaveBeenCalledOnce()
    expect(onKeyUpCapture).toHaveBeenCalledOnce()
    expect(onClickCapture).not.toHaveBeenCalled()
    expect(onAuxClickCapture).not.toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
    expect(routerClick).not.toHaveBeenCalled()
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
      expect(itemFor('Delete state')).toHaveClass('primer:hover:bg-[var(--control-danger-bgColor-hover)]')
      expect(itemFor('Current state')).toHaveAttribute('data-active', 'true')
      expect(itemFor('Current state')).toHaveClass(
        'primer:bg-[var(--control-transparent-bgColor-selected)]',
        'primer:after:bg-[var(--borderColor-accent-emphasis)]',
      )
      expect(itemFor('Disabled state')).toHaveAttribute('data-is-disabled', 'true')
      expect(itemFor('Disabled state')).not.toHaveAttribute('data-active')
      expect(itemFor('Disabled state')).not.toHaveClass('primer:bg-[var(--control-transparent-bgColor-selected)]')
      expect(itemFor('Inactive state')).toHaveAttribute('data-inactive', 'true')
      expect(itemFor('Inactive state')).toHaveClass('primer:cursor-not-allowed', 'primer:hover:bg-transparent')
      expect(itemFor('Loading state')).toHaveAttribute('data-loading', 'true')
      expect(itemFor('Loading state')).toHaveClass('primer:[--action-list-item-label-fgColor:var(--fgColor-muted)]')
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
        'primer:text-[var(--action-list-item-label-fgColor,var(--fgColor-default))]',
      )
      expect(screen.getByText('Part description')).toHaveClass(
        'primer:text-[var(--action-list-item-description-fgColor,var(--fgColor-muted))]',
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
      expect(item).toHaveClass('primer:bg-[var(--control-transparent-bgColor-selected)]')
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
        'primer:data-[checked]:bg-[var(--control-checked-bgColor-rest)]',
        'primer:data-[checked]:data-[disabled]:bg-[var(--control-checked-bgColor-disabled)]',
        'primer:data-[disabled]:bg-[var(--control-bgColor-disabled)]',
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
      expect(screen.getByText('Quote reply').closest('li')).toHaveClass("primer:[[data-component$='Item']+&]:mt-0.5")
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
      expect(screen.getByText('Quote reply').closest('li')).not.toHaveClass(
        "primer:[[data-component$='Item']+&]:mt-0.5",
      )
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
