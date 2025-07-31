import {describe, expect, it, vi} from 'vitest'
import type React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {IconProps} from '@primer/octicons-react'
import {
  CodeIcon,
  IssueOpenedIcon,
  GitPullRequestIcon,
  CommentDiscussionIcon,
  ProjectIcon,
  ShieldLockIcon,
  GraphIcon,
} from '@primer/octicons-react'

import {UnderlineNav} from '.'
import {baseMenuMinWidth, menuStyles} from './styles'

const ResponsiveUnderlineNav = ({
  selectedItemText = 'Code',
  loadingCounters = false,
  displayExtraEl = false,
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
    {navigation: 'Security', icon: ShieldLockIcon},
  ]

  return (
    <div>
      <UnderlineNav aria-label="Repository" className="foo" loadingCounters={loadingCounters}>
        {items.map(item => (
          <UnderlineNav.Item
            key={item.navigation}
            icon={item.icon}
            aria-current={item.navigation === selectedItemText ? 'page' : undefined}
            counter={item.counter}
          >
            {item.navigation}
          </UnderlineNav.Item>
        ))}
      </UnderlineNav>
      {displayExtraEl && <button type="button">Custom button</button>}
    </div>
  )
}

describe('UnderlineNav', () => {
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
    const onSelect = vi.fn()
    const {getByRole} = render(
      <UnderlineNav aria-label="Test Navigation">
        <UnderlineNav.Item onSelect={onSelect}>Item 1</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 3</UnderlineNav.Item>
      </UnderlineNav>,
    )
    const item = getByRole('link', {name: 'Item 1'})
    const user = userEvent.setup()
    await user.click(item)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('fires onSelect on keypress', async () => {
    const onSelect = vi.fn()
    const {getByRole} = render(
      <UnderlineNav aria-label="Test Navigation">
        <UnderlineNav.Item onSelect={onSelect}>Item 1</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item aria-current="page" onSelect={onSelect}>
          Item 3
        </UnderlineNav.Item>
      </UnderlineNav>,
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
    const item = getByRole('link', {name: 'Issues (120)'})
    const counter = item.getElementsByTagName('span')[3]
    expect(counter.textContent).toBe('120')
    expect(counter).toHaveAttribute('aria-hidden', 'true')
  })

  it('adds className prop to base wrapper classes', () => {
    const {getByRole} = render(<ResponsiveUnderlineNav />)
    const nav = getByRole('navigation')
    expect(nav.className).toContain('foo')
    expect(nav.className).toContain('UnderlineWrapper')
  })

  it('renders the content of visually hidden span properly for screen readers', () => {
    const {getByRole} = render(<ResponsiveUnderlineNav />)
    const item = getByRole('link', {name: 'Issues (120)'})
    const counter = item.getElementsByTagName('span')[4]
    // non breaking space unified code
    expect(counter.textContent).toBe('\u00A0(120)')
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
    expect(heading.textContent).toBe('Repository navigation')
  })

  it('throws an error when there are multiple items that have aria-current', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      render(
        <UnderlineNav aria-label="Test Navigation">
          <UnderlineNav.Item aria-current="page">Item 1</UnderlineNav.Item>
          <UnderlineNav.Item aria-current="page">Item 2</UnderlineNav.Item>
        </UnderlineNav>,
      )
    }).toThrow('Only one current element is allowed')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it(`menuStyles should set the menu position, if the container size is below ${baseMenuMinWidth} px`, () => {
    // GIVEN
    // Mock the refs.
    const containerRef = document.createElement('div')
    const listRef = document.createElement('div')
    // Set the clientWidth on the mock element
    Object.defineProperty(listRef, 'clientWidth', {value: baseMenuMinWidth - 1})

    // WHEN
    const results = menuStyles(containerRef, listRef)

    // THEN
    // We are expecting a left value back, that way we know the `getAnchoredPosition` ran.
    expect(results).toEqual(expect.objectContaining({left: 0}))
  })

  it('should support icons passed in as an element', () => {
    render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item aria-current="page" icon={<CodeIcon aria-label="Page one icon" />}>
          Page one
        </UnderlineNav.Item>
        <UnderlineNav.Item icon={<IssueOpenedIcon aria-label="Page two icon" />}>Page two</UnderlineNav.Item>
        <UnderlineNav.Item icon={<GitPullRequestIcon aria-label="Page three icon" />}>Page three</UnderlineNav.Item>
      </UnderlineNav>,
    )

    expect(screen.getByLabelText('Page one icon')).toBeInTheDocument()
    expect(screen.getByLabelText('Page two icon')).toBeInTheDocument()
    expect(screen.getByLabelText('Page three icon')).toBeInTheDocument()
  })

  it('adds className prop to item classes', () => {
    render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item className="custom-class">Item 1</UnderlineNav.Item>
      </UnderlineNav>,
    )
    const item = screen.getByRole('link', {name: 'Item 1'})
    expect(item).toHaveClass('custom-class')
    expect(item.className).toContain('UnderlineItem')
  })
})

describe('Keyboard Navigation', () => {
  it('should move focus to the next/previous item on the list with the tab key', async () => {
    const {getByRole} = render(<ResponsiveUnderlineNav />)
    const item = getByRole('link', {name: 'Code'})
    const nextItem = getByRole('link', {name: 'Issues (120)'})
    const user = userEvent.setup()
    await user.tab() // tab into the story, this should focus on the first link
    expect(item).toEqual(document.activeElement) // check if the first item is focused
    await user.tab()
    // focus should be on the next item
    expect(nextItem).toHaveFocus()
  })
})
