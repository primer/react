import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  IconProps,
  CodeIcon,
  IssueOpenedIcon,
  GitPullRequestIcon,
  CommentDiscussionIcon,
  ProjectIcon,
  ShieldLockIcon,
  GraphIcon
} from '@primer/octicons-react'

import {UnderlineNav} from '.'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'

// window.matchMedia() is not implemented by JSDOM so we have to create a mock:
// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

const ResponsiveUnderlineNav = ({
  selectedItemText = 'Code',
  loadingCounters = false,
  displayExtraEl = false
}: {
  selectedItemText?: string
  loadingCounters?: boolean
  displayExtraEl?: boolean
}) => {
  const items: {navigation: string; icon?: React.FC<IconProps>; counter?: number}[] = [
    {navigation: 'Code', icon: CodeIcon},
    {navigation: 'Issues', icon: IssueOpenedIcon, counter: 120},
    {navigation: 'Pull Requests', icon: GitPullRequestIcon, counter: 13},
    {navigation: 'Discussions', icon: CommentDiscussionIcon, counter: 5},
    {navigation: 'Actions', counter: 4},
    {navigation: 'Projects', icon: ProjectIcon, counter: 9},
    {navigation: 'Insights', icon: GraphIcon},
    {navigation: 'Settings', counter: 10},
    {navigation: 'Security', icon: ShieldLockIcon}
  ]

  return (
    <div>
      <UnderlineNav aria-label="Repository" loadingCounters={loadingCounters}>
        {items.map(item => (
          <UnderlineNav.Item
            key={item.navigation}
            icon={item.icon}
            selected={item.navigation === selectedItemText}
            counter={item.counter}
          >
            {item.navigation}
          </UnderlineNav.Item>
        ))}
      </UnderlineNav>
      {displayExtraEl && <button>Custom button</button>}
    </div>
  )
}

describe('UnderlineNav', () => {
  behavesAsComponent({
    Component: UnderlineNav,
    options: {skipAs: true, skipSx: true},
    toRender: () => <ResponsiveUnderlineNav />
  })

  checkExports('UnderlineNav2', {
    default: undefined,
    UnderlineNav
  })
  it('renders aria-current attribute to be pages when an item is selected', () => {
    const {getByRole} = render(<ResponsiveUnderlineNav />)
    const selectedNavLink = getByRole('link', {name: 'Code'})
    expect(selectedNavLink.getAttribute('aria-current')).toBe('page')
  })
  it('renders aria-label attribute correctly', () => {
    const {container, getByRole} = render(<ResponsiveUnderlineNav />)
    expect(container.getElementsByTagName('nav').length).toEqual(1)
    const nav = getByRole('navigation')
    expect(nav.getAttribute('aria-label')).toBe('Repository')
  })
  it('renders icons correctly', () => {
    const {getByRole} = render(<ResponsiveUnderlineNav />)
    const nav = getByRole('navigation')
    expect(nav.getElementsByTagName('svg').length).toEqual(7)
  })
  it('fires onSelect on click', async () => {
    const onSelect = jest.fn()
    const {getByRole} = render(
      <UnderlineNav aria-label="Test Navigation">
        <UnderlineNav.Item onSelect={onSelect}>Item 1</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 3</UnderlineNav.Item>
      </UnderlineNav>
    )
    const item = getByRole('link', {name: 'Item 1'})
    const user = userEvent.setup()
    await user.click(item)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
  it('fires onSelect on keypress', async () => {
    const onSelect = jest.fn()
    const {getByRole} = render(
      <UnderlineNav aria-label="Test Navigation">
        <UnderlineNav.Item onSelect={onSelect}>Item 1</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item selected onSelect={onSelect}>
          Item 3
        </UnderlineNav.Item>
      </UnderlineNav>
    )
    const item = getByRole('link', {name: 'Item 1'})
    const user = userEvent.setup()
    await user.tab() // tab into the story, this should focus on the first link
    expect(item).toEqual(document.activeElement)
    await user.keyboard('{Enter}')
    // Enter keypress fires both click and keypress events
    expect(onSelect).toHaveBeenCalledTimes(2)
    await user.keyboard(' ') // space
    expect(onSelect).toHaveBeenCalledTimes(3)
  })
  it('respects counter prop', () => {
    const {getByRole} = render(<ResponsiveUnderlineNav />)
    const item = getByRole('link', {name: 'Issues 120'})
    const counter = item.getElementsByTagName('span')[3]
    expect(counter.className).toContain('CounterLabel')
    expect(counter.textContent).toBe('120')
  })
  it('respects loadingCounters prop', () => {
    const {getByRole} = render(<ResponsiveUnderlineNav loadingCounters={true} />)
    const item = getByRole('link', {name: 'Actions'})
    const loadingCounter = item.getElementsByTagName('span')[2]
    expect(loadingCounter.className).toContain('LoadingCounter')
    expect(loadingCounter.textContent).toBe('')
  })
  it('renders a visually hidden h2 heading for screen readers when aria-label is present', () => {
    const {getByRole} = render(<ResponsiveUnderlineNav />)
    const heading = getByRole('heading', {name: 'Repository navigation'})
    // check if heading is h2 tag
    expect(heading.tagName).toBe('H2')
    expect(heading.className).toContain('VisuallyHidden')
    expect(heading.textContent).toBe('Repository navigation')
  })
})

describe('Keyboard Navigation', () => {
  it('should move focus to the next/previous item on the list with the tab key', async () => {
    const {getByRole} = render(<ResponsiveUnderlineNav />)
    const item = getByRole('link', {name: 'Code'})
    const nextItem = getByRole('link', {name: 'Issues 120'})
    const user = userEvent.setup()
    await user.tab() // tab into the story, this should focus on the first link
    expect(item).toEqual(document.activeElement) // check if the first item is focused
    await user.tab()
    // focus should be on the next item
    expect(nextItem).toHaveFocus()
  })
})

checkStoriesForAxeViolations('examples', '../UnderlineNav2/')
