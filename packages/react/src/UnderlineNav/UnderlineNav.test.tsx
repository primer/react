import {describe, expect, it, vi} from 'vitest'
import type React from 'react'
import {render} from '@testing-library/react'
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
import {implementsClassName, withExpectedConsoleError} from '../utils/testing'
import classes from '../internal/components/UnderlineTabbedInterface.module.css'
import {clsx} from 'clsx'
import {page, userEvent} from 'vitest/browser'
import {ReactRouterLikeLink} from '../Pagination/mocks/ReactRouterLink'

const ResponsiveUnderlineNav = ({
  selectedItemText = 'Code',
  loadingCounters = false,
  displayExtraEl = false,
  className,
}: {
  selectedItemText?: string
  loadingCounters?: boolean
  displayExtraEl?: boolean
  className?: string
}) => {
  const items: {navigation: string; icon?: React.ReactElement; counter?: number}[] = [
    {navigation: 'Code', icon: <CodeIcon />},
    {navigation: 'Issues', icon: <IssueOpenedIcon />, counter: 120},
    {navigation: 'Pull Requests', icon: <GitPullRequestIcon />, counter: 13},
    {navigation: 'Discussions', icon: <CommentDiscussionIcon />, counter: 5},
    {navigation: 'Actions', counter: 4},
    {navigation: 'Projects', icon: <ProjectIcon />, counter: 9},
    {navigation: 'Insights', icon: <GraphIcon />},
    {navigation: 'Settings', counter: 10},
    {navigation: 'Security', icon: <ShieldLockIcon />},
  ]

  return (
    <div>
      <UnderlineNav aria-label="Repository" className={clsx('foo', className)} loadingCounters={loadingCounters}>
        {items.map(item => (
          <UnderlineNav.Item
            key={item.navigation}
            leadingVisual={item.icon}
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
  implementsClassName(ResponsiveUnderlineNav, classes.UnderlineWrapper)
  implementsClassName(props => <UnderlineNav.Item {...props}>Hi</UnderlineNav.Item>)

  it('defaults href for native anchor items', async () => {
    render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item>Code</UnderlineNav.Item>
      </UnderlineNav>,
    )

    await expect.element(page.getByRole('link', {name: /\bCode$/})).toHaveAttribute('href', '#')
  })

  it('does not default href for custom link components', async () => {
    render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item as={ReactRouterLikeLink} to="/issues">
          Issues
        </UnderlineNav.Item>
      </UnderlineNav>,
    )

    await expect.element(page.getByRole('link', {name: /\bIssues$/})).toHaveAttribute('href', '/issues')
  })

  it('renders aria-current attribute to be pages when an item is selected', async () => {
    render(<ResponsiveUnderlineNav />)
    const selectedNavLink = page.getByRole('link', {name: /\bCode$/})
    await expect.element(selectedNavLink).toHaveAttribute('aria-current', 'page')
  })

  it('renders aria-label attribute correctly', async () => {
    render(<ResponsiveUnderlineNav />)
    const nav = page.getByRole('navigation')
    expect(nav.elements()).toHaveLength(1)
    const element = nav.element()
    expect(element.tagName).toBe('NAV')
    await expect.element(nav).toHaveAttribute('aria-label', 'Repository')
  })

  it('renders icons correctly', () => {
    render(<ResponsiveUnderlineNav />)
    const nav = page.getByRole('navigation')
    const list = nav.getByRole('list')
    expect(list.element().getElementsByTagName('svg').length).toEqual(7)
  })

  it('hides icons below the medium breakpoint by default', async () => {
    render(<ResponsiveUnderlineNav />)
    await expect.element(page.getByRole('navigation')).toHaveAttribute('data-hide-icons-breakpoint', 'medium')
  })

  it('supports customizing when icons are hidden', async () => {
    render(
      <UnderlineNav aria-label="Repository" hideIconsBreakpoint="medium">
        <UnderlineNav.Item>Code</UnderlineNav.Item>
      </UnderlineNav>,
    )
    await expect.element(page.getByRole('navigation')).toHaveAttribute('data-hide-icons-breakpoint', 'medium')
  })

  it('supports always showing icons', async () => {
    render(
      <UnderlineNav aria-label="Repository" hideIconsBreakpoint={null}>
        <UnderlineNav.Item>Code</UnderlineNav.Item>
      </UnderlineNav>,
    )
    await expect.element(page.getByRole('navigation')).not.toHaveAttribute('data-hide-icons-breakpoint')
  })

  it('fires onSelect on click', async () => {
    const onSelect = vi.fn()
    render(
      <UnderlineNav aria-label="Test Navigation">
        <UnderlineNav.Item onSelect={onSelect}>Item 1</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 3</UnderlineNav.Item>
      </UnderlineNav>,
    )
    const item = page.getByRole('link', {name: /\bItem 1$/})
    await userEvent.click(item)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('fires onSelect on keypress', async () => {
    const onSelect = vi.fn()
    render(
      <UnderlineNav aria-label="Test Navigation">
        <UnderlineNav.Item onSelect={onSelect}>Item 1</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item aria-current="page" onSelect={onSelect}>
          Item 3
        </UnderlineNav.Item>
      </UnderlineNav>,
    )
    const item = page.getByRole('link', {name: /\bItem 1$/})
    await userEvent.tab() // tab into the story, this should focus on the first link
    await expect.element(item).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    // Enter keypress fires both click and keypress events
    expect(onSelect).toHaveBeenCalledTimes(2)
    await userEvent.keyboard(' ') // space
    expect(onSelect).toHaveBeenCalledTimes(3)
  })

  it('respects counter prop', async () => {
    render(<ResponsiveUnderlineNav />)
    // Browser accessible names include the CSS-generated copy of the tab label.
    const item = page.getByRole('link', {name: /\bIssues \(120\)$/})
    const counter = item.element().getElementsByTagName('span')[3]
    expect(counter.textContent).toBe('120')
    await expect.element(counter).toHaveAttribute('aria-hidden', 'true')
  })

  it('adds className prop to base wrapper classes', () => {
    render(<ResponsiveUnderlineNav />)
    const nav = page.getByRole('navigation')
    expect(nav.element().className).toContain('foo')
    expect(nav.element().className).toContain('UnderlineWrapper')
  })

  it('renders the content of visually hidden span properly for screen readers', () => {
    render(<ResponsiveUnderlineNav />)
    const item = page.getByRole('link', {name: /\bIssues \(120\)$/})
    const counter = item.element().getElementsByTagName('span')[4]
    // non breaking space unified code
    expect(counter.textContent).toBe('\u00A0(120)')
  })

  it('respects loadingCounters prop', async () => {
    await page.viewport(1000, 500)
    render(<ResponsiveUnderlineNav loadingCounters={true} />)
    const item = page.getByRole('link', {name: /\bActions$/, includeHidden: true})
    const loadingCounter = item.element().getElementsByTagName('span')[2]
    expect(loadingCounter.className).toContain('LoadingCounter')
    expect(loadingCounter.textContent).toBe('')
  })

  it('renders a visually hidden h2 heading for screen readers when aria-label is present', () => {
    render(<ResponsiveUnderlineNav />)
    const heading = page.getByRole('heading', {name: 'Repository navigation', exact: true})
    // check if heading is h2 tag
    expect(heading.element().tagName).toBe('H2')
    expect(heading.element().textContent).toBe('Repository navigation')
  })

  it('throws an error when there are multiple items that have aria-current', () => {
    withExpectedConsoleError(() => {
      expect(() => {
        render(
          <UnderlineNav aria-label="Test Navigation">
            <UnderlineNav.Item aria-current="page">Item 1</UnderlineNav.Item>
            <UnderlineNav.Item aria-current="page">Item 2</UnderlineNav.Item>
          </UnderlineNav>,
        )
      }).toThrow('Only one current element is allowed')
    })
  })

  it('should support icons passed in as an element', async () => {
    render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item aria-current="page" leadingVisual={<CodeIcon aria-label="Page one icon" />}>
          Page one
        </UnderlineNav.Item>
        <UnderlineNav.Item leadingVisual={<IssueOpenedIcon aria-label="Page two icon" />}>Page two</UnderlineNav.Item>
        <UnderlineNav.Item leadingVisual={<GitPullRequestIcon aria-label="Page three icon" />}>
          Page three
        </UnderlineNav.Item>
      </UnderlineNav>,
    )

    await expect.element(page.getByLabelText('Page one icon', {exact: true})).toBeInTheDocument()
    await expect.element(page.getByLabelText('Page two icon', {exact: true})).toBeInTheDocument()
    await expect.element(page.getByLabelText('Page three icon', {exact: true})).toBeInTheDocument()
  })

  it('adds className prop to item classes', async () => {
    render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item className="custom-class">Item 1</UnderlineNav.Item>
      </UnderlineNav>,
    )
    const item = page.getByRole('link', {name: /\bItem 1$/})
    await expect.element(item).toHaveClass('custom-class')
    expect(item.element().className).toContain('UnderlineItem')
  })

  it('supports the deprecated `icon` prop', async () => {
    render(
      <UnderlineNav aria-label="Test">
        <UnderlineNav.Item icon={<CodeIcon data-testid="jsx-element" />}>as jsx element</UnderlineNav.Item>
        <UnderlineNav.Item icon={props => <CodeIcon {...props} data-testid="functional-component" />}>
          as functional component
        </UnderlineNav.Item>
      </UnderlineNav>,
    )

    await expect.element(page.getByTestId('jsx-element')).toBeInTheDocument()
    await expect.element(page.getByTestId('functional-component')).toBeInTheDocument()
  })

  it('extracts only direct text content for data-content attribute, ignoring nested elements', async () => {
    render(
      <UnderlineNav aria-label="Test">
        <UnderlineNav.Item>
          Tab Label
          <span style={{position: 'absolute'}}>Hidden element</span>
        </UnderlineNav.Item>
      </UnderlineNav>,
    )

    const item = page.getByRole('link', {name: /Tab Label/})
    const textSpan = item.element().querySelector<HTMLElement>('[data-component="text"]')
    // data-content should only have the content of the Text and not the nested span
    await expect.element(textSpan).toHaveAttribute('data-content', 'Tab Label')
  })

  it('handles string children correctly for data-content attribute', async () => {
    render(
      <UnderlineNav aria-label="Test">
        <UnderlineNav.Item>Simple Text</UnderlineNav.Item>
      </UnderlineNav>,
    )

    const item = page.getByRole('link', {name: /\bSimple Text$/})
    const textSpan = item.element().querySelector<HTMLElement>('[data-component="text"]')
    await expect.element(textSpan).toHaveAttribute('data-content', 'Simple Text')
  })
})

describe('Keyboard Navigation', () => {
  it('should move focus to the next/previous item on the list with the tab key', async () => {
    render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item aria-current="page">Code</UnderlineNav.Item>
        <UnderlineNav.Item counter={120}>Issues</UnderlineNav.Item>
      </UnderlineNav>,
    )
    const item = page.getByRole('link', {name: /\bCode$/})
    const nextItem = page.getByRole('link', {name: /\bIssues \(120\)$/})
    await userEvent.tab() // tab into the story, this should focus on the first link
    await expect.element(item).toHaveFocus() // check if the first item is focused
    await userEvent.tab()
    // focus should be on the next item
    await expect.element(nextItem).toHaveFocus()
  })
})
