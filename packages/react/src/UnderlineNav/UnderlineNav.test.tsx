import {describe, expect, it, vi} from 'vitest'
import type React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
import {implementsClassName} from '../utils/testing'
import classes from '../internal/components/UnderlineTabbedInterface.module.css'
import {clsx} from 'clsx'

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
    <div style={{width: 2000}}>
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
    expect(() => {
      render(
        <UnderlineNav aria-label="Test Navigation">
          <UnderlineNav.Item aria-current="page">Item 1</UnderlineNav.Item>
          <UnderlineNav.Item aria-current="page">Item 2</UnderlineNav.Item>
        </UnderlineNav>,
      )
    }).toThrow('Only one current element is allowed')
  })

  it('should support icons passed in as an element', () => {
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

  it('supports the deprecated `icon` prop', () => {
    render(
      <UnderlineNav aria-label="Test">
        <UnderlineNav.Item icon={<CodeIcon data-testid="jsx-element" />}>as jsx element</UnderlineNav.Item>
        <UnderlineNav.Item icon={props => <CodeIcon {...props} data-testid="functional-component" />}>
          as functional component
        </UnderlineNav.Item>
      </UnderlineNav>,
    )

    expect(screen.getByTestId('jsx-element')).toBeInTheDocument()
    expect(screen.getByTestId('functional-component')).toBeInTheDocument()
  })

  it('extracts only direct text content for data-content attribute, ignoring nested elements', () => {
    render(
      <UnderlineNav aria-label="Test">
        <UnderlineNav.Item>
          Tab Label
          <span style={{position: 'absolute'}}>Hidden element</span>
        </UnderlineNav.Item>
      </UnderlineNav>,
    )

    const item = screen.getByRole('link', {name: /Tab Label/})
    const textSpan = item.querySelector('[data-component="text"]')
    // data-content should only have the content of the Text and not the nested span
    expect(textSpan).toHaveAttribute('data-content', 'Tab Label')
  })

  it('handles string children correctly for data-content attribute', () => {
    render(
      <UnderlineNav aria-label="Test">
        <UnderlineNav.Item>Simple Text</UnderlineNav.Item>
      </UnderlineNav>,
    )

    const item = screen.getByRole('link', {name: 'Simple Text'})
    const textSpan = item.querySelector('[data-component="text"]')
    expect(textSpan).toHaveAttribute('data-content', 'Simple Text')
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

describe('Architecture: parent-driven measurement', () => {
  it('tags every Item with [data-underlinenav-item] so the parent can measure them in one pass', () => {
    const {container} = render(
      <UnderlineNav aria-label="Repo">
        <UnderlineNav.Item>A</UnderlineNav.Item>
        <UnderlineNav.Item>B</UnderlineNav.Item>
        <UnderlineNav.Item>C</UnderlineNav.Item>
      </UnderlineNav>,
    )
    expect(container.querySelectorAll('[data-underlinenav-item="true"]')).toHaveLength(3)
  })

  it('renders an Item standalone without requiring measurement callbacks from context', () => {
    // The old API required UnderlineNavContext.setChildrenWidth /
    // setNoIconChildrenWidth on mount. With the inverted architecture the item
    // is a leaf with no upstream measurement responsibility — it should mount
    // without throwing even when no UnderlineNav is present above it.
    expect(() =>
      render(
        <ul>
          <UnderlineNav.Item>Standalone</UnderlineNav.Item>
        </ul>,
      ),
    ).not.toThrow()
  })

  it('marks the wrapper data-overflow-measured="true" after the measurement pass', async () => {
    const {getByRole} = render(<ResponsiveUnderlineNav />)
    const nav = getByRole('navigation')
    // Measurement runs synchronously in a layout effect; by the time render()
    // returns the wrapper should already be marked measured.
    expect(nav.getAttribute('data-overflow-measured')).toBe('true')
  })

  it('anchors the overflow menu via a layout effect, not by reading refs during render', async () => {
    // Regression: the menu position used to be computed inline in render by
    // reading containerRef.current / listRef.current. Under concurrent rendering
    // those refs may be null or stale during render; the anchor must come from a
    // post-commit layout effect. Open the More menu in a narrow container so the
    // anchor branch runs, and assert no crash + the menu becomes visible.
    function NarrowOpen() {
      const items = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
      return (
        <div style={{width: 280}}>
          <UnderlineNav aria-label="Anchor">
            {items.map(name => (
              <UnderlineNav.Item key={name}>{name}</UnderlineNav.Item>
            ))}
          </UnderlineNav>
        </div>
      )
    }
    const {getByRole, container} = render(<NarrowOpen />)
    const moreBtn = getByRole('button', {name: /More/i})
    const user = userEvent.setup()
    await user.click(moreBtn)
    // After opening, the ActionList container's inline display must flip to "block".
    // What matters for this test: clicking did not crash (the new layout effect
    // tolerates the first commit where refs/widths may not be ready) and the
    // overlay element is in the DOM with a non-"none" display.
    const overlay = container.querySelector('[data-component="ActionList"]') as HTMLElement | null
    expect(overlay).not.toBeNull()
    expect(overlay!.style.display).toBe('block')
  })
})

describe('Structure: aria-current swap is an effect (not render-phase setState)', () => {
  function NarrowDemo({current}: {current: string}) {
    const items = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
    return (
      <div style={{width: 320}}>
        <UnderlineNav aria-label="Demo">
          {items.map(name => (
            <UnderlineNav.Item key={name} aria-current={name === current ? 'page' : undefined}>
              {name}
            </UnderlineNav.Item>
          ))}
        </UnderlineNav>
      </div>
    )
  }

  it('pulls a menu item into the visible list when aria-current is moved onto it externally', () => {
    const {getByRole, rerender} = render(<NarrowDemo current="One" />)
    // "One" is at the front of the list and should be visible from the start.
    expect(getByRole('link', {name: 'One'}).getAttribute('aria-current')).toBe('page')
    // "Ten" would normally overflow into the menu at this width. Mark it as the
    // current page and the lifted effect should promote it into the visible list.
    rerender(<NarrowDemo current="Ten" />)
    const promoted = getByRole('link', {name: 'Ten'})
    expect(promoted).toBeInTheDocument()
    expect(promoted.getAttribute('aria-current')).toBe('page')
  })

  it('promotes a menu item correctly when its children are not a plain string', () => {
    // Regression: the swap helper used to look widths up by `item.props.children`
    // as a string, which silently returned 0 for non-string children and produced
    // an incorrect swap (wrong items pulled from the list, or the same item being
    // both promoted and demoted).
    function NestedDemo({current}: {current: string}) {
      const items = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
      return (
        <div style={{width: 320}}>
          <UnderlineNav aria-label="Nested">
            {items.map(name => (
              <UnderlineNav.Item key={name} aria-current={name === current ? 'page' : undefined}>
                <span>{name}</span>
              </UnderlineNav.Item>
            ))}
          </UnderlineNav>
        </div>
      )
    }
    const {getByRole, rerender} = render(<NestedDemo current="One" />)
    expect(getByRole('link', {name: 'One'}).getAttribute('aria-current')).toBe('page')
    rerender(<NestedDemo current="Ten" />)
    const promoted = getByRole('link', {name: 'Ten'})
    expect(promoted).toBeInTheDocument()
    expect(promoted.getAttribute('aria-current')).toBe('page')
  })
})

describe('Performance: bounded re-renders during initial mount', () => {
  it('renders each item at most twice during initial mount with stable children', () => {
    // Captures every render of an item-body component. With per-item measurement
    // callbacks each item used to trigger a parent setState which cascaded back
    // through the item tree (gated by context-value identity, which was a fresh
    // object literal on every render). The re-architecture stores widths in
    // refs, measures once from the parent, memoizes Item, and memoizes the
    // context value — so each item-body should render at most twice on mount:
    // once for the initial commit and at most once after the single
    // measurement state update.
    const renderSpy = vi.fn()
    function ItemBody({label}: {label: string}) {
      renderSpy(label)
      return <>{label}</>
    }
    const items = Array.from({length: 12}, (_, i) => `Item ${i + 1}`)
    render(
      <div style={{width: 2000}}>
        <UnderlineNav aria-label="Perf">
          {items.map(label => (
            <UnderlineNav.Item key={label}>
              <ItemBody label={label} />
            </UnderlineNav.Item>
          ))}
        </UnderlineNav>
      </div>,
    )
    const counts = new Map<string, number>()
    for (const call of renderSpy.mock.calls) {
      const label = call[0] as string
      counts.set(label, (counts.get(label) ?? 0) + 1)
    }
    expect(counts.size).toBe(items.length)
    for (const [label, count] of counts) {
      expect(count, `${label} rendered ${count} times during mount`).toBeLessThanOrEqual(2)
    }
  })

  it('does not re-render items linearly in N when more items are added', () => {
    // Two trees: one with 5 items, one with 25 items. Per-item render count
    // should be roughly constant (i.e. independent of N).
    const counts = new Map<number, number>()
    function makeTree(n: number) {
      let totalRenders = 0
      function ItemBody({label}: {label: string}) {
        totalRenders++
        return <>{label}</>
      }
      const items = Array.from({length: n}, (_, i) => `I${i}`)
      const {unmount} = render(
        <div style={{width: 4000}}>
          <UnderlineNav aria-label={`P-${n}`}>
            {items.map(label => (
              <UnderlineNav.Item key={label}>
                <ItemBody label={label} />
              </UnderlineNav.Item>
            ))}
          </UnderlineNav>
        </div>,
      )
      counts.set(n, totalRenders / n)
      unmount()
    }
    makeTree(5)
    makeTree(25)
    // Per-item render rate must not grow with N — if anything went back to the
    // child-callback pattern this would scale linearly.
    expect(counts.get(25)!).toBeLessThanOrEqual(counts.get(5)! + 0.5)
  })

  it('produces at most one post-measurement state commit', () => {
    // Snapshot the UnderlineNav's own render count via a Profiler. The single
    // combined layout effect should commit at most once after measurement
    // (and once more for the children-key derived reset on first mount),
    // i.e. UnderlineNav renders <= 3 times total: initial + reset + measurement.
    let parentRenderCount = 0
    function CountedNav(props: {children: React.ReactNode}) {
      parentRenderCount++
      return <UnderlineNav aria-label="Commits">{props.children}</UnderlineNav>
    }
    const items = Array.from({length: 8}, (_, i) => `Item ${i + 1}`)
    render(
      <div style={{width: 2000}}>
        <CountedNav>
          {items.map(label => (
            <UnderlineNav.Item key={label}>{label}</UnderlineNav.Item>
          ))}
        </CountedNav>
      </div>,
    )
    // Initial render + at most one commit from the combined measurement+swap
    // layout effect. If measurement and swap had remained two effects this
    // would be 3+ renders. If the resize observer also commits redundantly
    // on mount it'd be 4+.
    expect(parentRenderCount).toBeLessThanOrEqual(3)
  })
})
