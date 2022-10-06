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

Object.defineProperty(window.Element.prototype, 'scrollTo', {
  value: jest.fn(),
  writable: true
})

const ResponsiveUnderlineNav = ({
  selectedItemText = 'Code',
  loadingCounters = false
}: {
  selectedItemText?: string
  loadingCounters?: boolean
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
  )
}

describe('UnderlineNav', () => {
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
    fireEvent.keyPress(item, {key: 'Enter', code: 13, charCode: 13})
    expect(onSelect).toHaveBeenCalledTimes(2)
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
})
