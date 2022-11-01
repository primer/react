import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {fireEvent, render} from '@testing-library/react'
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

const arrowLeft = {key: 'ArrowLeft', code: 37, charCode: 37}
const arrowRight = {key: 'ArrowRight', code: 39, charCode: 39}
const arrowUp = {key: 'ArrowUp', code: 38, charCode: 38}
const arrowDown = {key: 'ArrowDown', code: 40, charCode: 40}
const tab = {key: 'Tab', code: 9, charCode: 9}
const enter = {key: 'Enter', code: 13, charCode: 13}
const space = {key: ' ', code: 32, charCode: 32}

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
    const {getByText} = render(<ResponsiveUnderlineNav />)
    const selectedNavLink = getByText('Code').closest('a')

    expect(selectedNavLink?.getAttribute('aria-current')).toBe('page')
  })
  it('renders aria-label attribute correctly', () => {
    const {container} = render(<ResponsiveUnderlineNav />)
    expect(container.getElementsByTagName('nav').length).toEqual(1)
    const nav = container.getElementsByTagName('nav')[0]

    expect(nav.getAttribute('aria-label')).toBe('Repository')
  })
  it('renders icons correctly', () => {
    const {container} = render(<ResponsiveUnderlineNav />)
    const nav = container.getElementsByTagName('nav')[0]
    expect(nav.getElementsByTagName('svg').length).toEqual(7)
  })
  it('fires onSelect on click and keypress', async () => {
    const onSelect = jest.fn()
    const {getByText} = render(
      <UnderlineNav aria-label="Test Navigation">
        <UnderlineNav.Item onSelect={onSelect}>Item 1</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 3</UnderlineNav.Item>
      </UnderlineNav>
    )
    const item = getByText('Item 1')
    fireEvent.click(item)
    expect(onSelect).toHaveBeenCalledTimes(1)
    fireEvent.keyPress(item, enter)
    expect(onSelect).toHaveBeenCalledTimes(2)
    fireEvent.keyPress(item, space)
    expect(onSelect).toHaveBeenCalledTimes(3)
  })
  it('respects counter prop', () => {
    const {getByText} = render(<ResponsiveUnderlineNav />)
    const item = getByText('Issues').closest('a')
    const counter = item?.getElementsByTagName('span')[3]
    expect(counter?.className).toContain('CounterLabel')
    expect(counter?.textContent).toBe('120')
  })
  it('respects loadingCounters prop', () => {
    const {getByText} = render(<ResponsiveUnderlineNav loadingCounters={true} />)
    const item = getByText('Actions').closest('a')
    const loadingCounter = item?.getElementsByTagName('span')[2]
    expect(loadingCounter?.className).toContain('LoadingCounter')
    expect(loadingCounter?.textContent).toBe('')
  })
  it('renders a visually hidden h2 heading for screen readers when aria-label is present', () => {
    const {container} = render(<ResponsiveUnderlineNav />)
    const heading = container.getElementsByTagName('h2')[0]
    expect(heading.className).toContain('VisuallyHidden')
    expect(heading.textContent).toBe('Repository navigation')
  })
})

describe('Keyboard Navigation', () => {
  it('should move focus to the next/previous item on the list with horizontal arrow keys', () => {
    const {getByText} = render(<ResponsiveUnderlineNav />)
    const item = getByText('Code').closest('a') as HTMLAnchorElement
    const nextItem = getByText('Issues').closest('a') as HTMLAnchorElement
    // Focus first item
    item.focus()
    // Press right arrow
    fireEvent.keyDown(item, arrowRight)
    // focus should be on the next item
    expect(nextItem).toHaveFocus()
    expect(nextItem.getAttribute('tabindex')).toBe('0')
    fireEvent.keyDown(nextItem, arrowLeft)
    // focus should be on the previous item
    expect(item).toHaveFocus()
    expect(nextItem.getAttribute('tabindex')).toBe('-1')
    expect(item.getAttribute('tabindex')).toBe('0')
  })
  it('should move focus to the next/previous item on the list with vertical arrow keys', () => {
    const {getByText} = render(<ResponsiveUnderlineNav />)
    const item = getByText('Code').closest('a') as HTMLAnchorElement
    const nextItem = getByText('Issues').closest('a') as HTMLAnchorElement
    // Focus first item
    item.focus()
    // Press down arrow
    fireEvent.keyDown(item, arrowDown)
    // focus should be on the next item
    expect(nextItem).toHaveFocus()
    expect(nextItem.getAttribute('tabindex')).toBe('0')
    // Press up arrow
    fireEvent.keyDown(nextItem, arrowUp)
    // focus should be on the previous item
    expect(item).toHaveFocus()
    expect(nextItem.getAttribute('tabindex')).toBe('-1')
    expect(item.getAttribute('tabindex')).toBe('0')
  })
  it('should move focus to the next/previous item on the list with the tab key', () => {
    const {getByText} = render(<ResponsiveUnderlineNav />)
    const item = getByText('Code').closest('a') as HTMLAnchorElement
    const nextItem = getByText('Issues').closest('a') as HTMLAnchorElement
    // Focus first item
    item.focus()
    // Press down arrow
    fireEvent.keyDown(item, tab)
    // focus should be on the next item
    expect(nextItem).toHaveFocus()
    expect(nextItem.getAttribute('tabindex')).toBe('0')
  })
})

checkStoriesForAxeViolations('examples', '../UnderlineNav2/')
