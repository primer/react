import React, {useLayoutEffect} from 'react'
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
  useLayoutEffect(() => {
    for (const listItem of document.querySelectorAll('li[class^="Box"]'))
      Object.defineProperty(listItem, 'getBoundingClientRect', {
        value: {
          width: 100
        },
        writable: true
      })
  })

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
    <UnderlineNav label="Repository" loadingCounters={loadingCounters}>
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
      <UnderlineNav label="Test nav">
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

describe.skip('UnderlineNav when overflow occurs on fine pointer devices', () => {
  beforeAll(() => {
    jest.spyOn(window.screen, 'width', 'get').mockReturnValue(800)
  })

  it("does not render icons where nav width is less than the sum of items' width (without icons)", () => {
    const {getByText} = render(<ResponsiveUnderlineNav />)

    const el = getByText('Code').closest('a')
    const icon = el?.getElementsByTagName('span')[0]
    expect(icon).not.toBeVisible()
  })

  it("renders More menu where nav width is less than the sum of items' width (without icons)", () => {
    const {getByText} = render(<ResponsiveUnderlineNav />)

    const el = getByText('More')
    expect(el).toBeVisible()
  })

  it('moves the selected item out of the menu when it is selected and appends it to the list', () => {
    const {container, getByText} = render(<ResponsiveUnderlineNav />)

    const el = getByText('More')
    fireEvent.click(el)

    const menuItem = getByText('Settings')
    fireEvent.click(menuItem)

    const selectedEl = getByText('Settings').closest('a')
    const selectedListItem = getByText('Settings').closest('li')
    expect(selectedEl).toHaveAttribute('aria-current', 'page')
    const list = container.getElementsByTagName('ul')[0]
    // The last one is the More Btn
    const secondLastItemIndex = list.childNodes.length - 2
    expect(list.childNodes[secondLastItemIndex]).toBe(selectedListItem)
  })

  it('keeps the updated order when a naturally visible item is selected', () => {
    const {container, getByText} = render(<ResponsiveUnderlineNav />)

    const el = getByText('More')
    fireEvent.click(el)

    // select an item from the menu
    const menuItem = getByText('Settings')
    fireEvent.click(menuItem)
    // the order is now updated and is different than the original children order.
    // select an item that is naturally visible (meaning it does not fall under the menu when page first loaded or resized)
    const naturallyVisibleItem = getByText('Code')
    fireEvent.click(naturallyVisibleItem)
    const selectedListItem = getByText('Settings').closest('li')
    const list = container.getElementsByTagName('ul')[0]
    // The last one is the More Btn
    const secondLastItemIndex = list.childNodes.length - 2
    // Settings should still be on the last position
    expect(list.childNodes[secondLastItemIndex]).toBe(selectedListItem)
  })

  it('displays the selected item as the last child of the list if the selected item naturally falls under the menu when the page is loaded or resized', () => {
    const {container, getByText} = render(<ResponsiveUnderlineNav selectedItemText="Settings" />)

    const selectedEl = getByText('Settings').closest('a')
    expect(selectedEl).toHaveAttribute('aria-current', 'page')
    const selectedListItem = getByText('Settings').closest('li')
    const list = container.getElementsByTagName('ul')[0]
    const secondLastItemIndex = list.childNodes.length - 2
    expect(list.childNodes[secondLastItemIndex]).toBe(selectedListItem)
  })
})
