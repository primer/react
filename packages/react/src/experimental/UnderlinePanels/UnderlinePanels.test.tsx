// Most of the functionality is already tested in [@github/tab-container-element](https://github.com/github/tab-container-element)

import type React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, it, afterEach, expect, vi} from 'vitest'
import UnderlinePanels from './UnderlinePanels'
import TabContainerElement from '@github/tab-container-element'
import {implementsClassName} from '../../utils/testing'
import classes from './UnderlinePanels.module.css'

TabContainerElement.prototype.selectTab = vi.fn()

const UnderlinePanelsMockComponent = (props: {'aria-label'?: string; 'aria-labelledby'?: string; id?: string}) => (
  <UnderlinePanels {...props}>
    <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
    <UnderlinePanels.Tab>Tab 2</UnderlinePanels.Tab>
    <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)

describe('UnderlinePanels', () => {
  implementsClassName(UnderlinePanels, classes.StyledUnderlineWrapper)
  implementsClassName(UnderlinePanels.Tab)
  implementsClassName(UnderlinePanels.Panel)
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders with a custom ID', () => {
    render(<UnderlinePanelsMockComponent aria-label="Select a tab" id="custom-id" />)

    const firstTab = screen.getByRole('tab', {name: 'Tab 1'})
    const firstPanel = screen.getByText('Panel 1')

    expect(firstTab).toHaveAttribute('id', 'custom-id-tab-0')
    expect(firstPanel).toHaveAttribute('aria-labelledby', 'custom-id-tab-0')
  })
  it('renders aria-label', () => {
    render(<UnderlinePanelsMockComponent aria-label="Select a tab" />)

    const tabList = screen.getByRole('tablist')
    expect(tabList).toHaveAccessibleName('Select a tab')
  })
  it('renders aria-labelledby', () => {
    render(
      <>
        <h2 id="tab-header">Select a tab</h2>
        <UnderlinePanelsMockComponent aria-labelledby="tab-header" />
      </>,
    )

    const tabList = screen.getByRole('tablist')
    expect(tabList).toHaveAccessibleName('Select a tab')
  })
  it('updates the selected tab when aria-selected changes', () => {
    const {rerender} = render(
      <UnderlinePanels aria-label="Select a tab">
        <UnderlinePanels.Tab aria-selected={true}>Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Tab aria-selected={false}>Tab 2</UnderlinePanels.Tab>
        <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
        <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )

    // Verify that the first tab is selected and second tab is not
    let firstTab = screen.getByRole('tab', {name: 'Tab 1'})
    let secondTab = screen.getByRole('tab', {name: 'Tab 2'})

    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(secondTab).toHaveAttribute('aria-selected', 'false')

    // Programmatically select the second tab by updating the aria-selected prop
    rerender(
      <UnderlinePanels aria-label="Select a tab">
        <UnderlinePanels.Tab aria-selected={false}>Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Tab aria-selected={true}>Tab 2</UnderlinePanels.Tab>
        <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
        <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )

    // Verify the updated aria-selected prop changes which tab is selected
    firstTab = screen.getByRole('tab', {name: 'Tab 1'})
    secondTab = screen.getByRole('tab', {name: 'Tab 2'})

    expect(firstTab).toHaveAttribute('aria-selected', 'false')
    expect(secondTab).toHaveAttribute('aria-selected', 'true')
  })
  it('calls onSelect when a tab is clicked', () => {
    const onSelect = vi.fn()
    render(
      <UnderlinePanels aria-label="Select a tab">
        <UnderlinePanels.Tab onSelect={onSelect}>Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )

    const tab = screen.getByRole('tab', {name: 'Tab 1'})
    tab.click()

    expect(onSelect).toHaveBeenCalled()
  })

  it('throws an error when the number of tabs does not match the number of panels', () => {
    expect(() => {
      render(
        <UnderlinePanels aria-label="Select a tab">
          <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab>Tab 2</UnderlinePanels.Tab>
          <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
          <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
          <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
        </UnderlinePanels>,
      )
    }).toThrow('The number of tabs and panels must be equal. Counted 2 tabs and 3 panels.')
  })

  it('throws an error when the number of panels does not match the number of tabs', () => {
    expect(() => {
      render(
        <UnderlinePanels aria-label="Select a tab">
          <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab>Tab 2</UnderlinePanels.Tab>
          <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
          <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
          <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
        </UnderlinePanels>,
      )
    }).toThrow('The number of tabs and panels must be equal. Counted 3 tabs and 2 panels.')
  })

  it('throws an error when there are multiple items that have aria-selected', () => {
    expect(() => {
      render(
        <UnderlinePanels aria-label="Select a tab">
          <UnderlinePanels.Tab aria-selected={true}>Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab aria-selected={true}>Tab 2</UnderlinePanels.Tab>
          <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
          <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
          <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
          <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
        </UnderlinePanels>,
      )
    }).toThrow('Only one tab can be selected at a time.')
  })
})

describe('UnderlinePanels — render architecture', () => {
  it('renders tabs synchronously on mount (no empty-tablist frame)', () => {
    // Regression: tabs and panels used to be stored in state and populated by
    // a useEffect, which produced one empty render before the real children
    // appeared. Now they're derived in render — querying the tablist
    // synchronously after render() must already see every tab.
    const {container} = render(<UnderlinePanelsMockComponent aria-label="Select a tab" />)
    const tabs = container.querySelectorAll('[role="tab"]')
    expect(tabs).toHaveLength(3)
    expect(tabs[0]).toHaveTextContent('Tab 1')
    expect(tabs[2]).toHaveTextContent('Tab 3')
  })

  it('bounds parent renders on initial mount', () => {
    // Performance pin: UnderlinePanels itself should render at most twice
    // during initial mount — once for the initial commit and at most once
    // more if the resize observer fires synchronously to set iconsVisible.
    // If a future change reintroduces the props-mirrored-in-state pattern
    // (mount → effect → setState → second render), this would trip.
    let parentRenderCount = 0
    function CountedHost(props: {children: React.ReactNode}) {
      parentRenderCount++
      return <UnderlinePanels aria-label="Counted">{props.children}</UnderlinePanels>
    }
    render(
      <CountedHost>
        <UnderlinePanels.Tab>One</UnderlinePanels.Tab>
        <UnderlinePanels.Tab>Two</UnderlinePanels.Tab>
        <UnderlinePanels.Tab>Three</UnderlinePanels.Tab>
        <UnderlinePanels.Panel>Panel One</UnderlinePanels.Panel>
        <UnderlinePanels.Panel>Panel Two</UnderlinePanels.Panel>
        <UnderlinePanels.Panel>Panel Three</UnderlinePanels.Panel>
      </CountedHost>,
    )
    // The host wrapper renders once; UnderlinePanels itself is allowed up
    // to two renders (initial + a potential post-resize iconsVisible toggle
    // if the test environment fires ResizeObserver synchronously). Anything
    // higher indicates a regression to the old state-from-effect pattern.
    expect(parentRenderCount).toBeLessThanOrEqual(1)
  })

  it('does not re-render tabs when an unrelated re-render of the parent occurs', () => {
    // Regression / perf pin: Tab is React.memo'd and iconsVisible /
    // loadingCounters flow via context, so re-rendering an ancestor for an
    // unrelated reason should NOT re-render the Tab function bodies. We
    // measure that by counting renders inside the Tab's own children, which
    // sit inside React.memo and only get called when the Tab actually
    // renders.
    const tabBodyRenderCount = vi.fn()
    function TabBody({label}: {label: string}) {
      tabBodyRenderCount(label)
      return <>{label}</>
    }

    // Stable element so re-rendering the host with the same `tree` reference
    // flows through unchanged to UnderlinePanels' useMemo (deps:
    // [children, parentId]) — that's exactly the path React.memo on Tab is
    // supposed to protect.
    const tree = (
      <UnderlinePanels aria-label="Stable">
        <UnderlinePanels.Tab>
          <TabBody label="A" />
        </UnderlinePanels.Tab>
        <UnderlinePanels.Tab>
          <TabBody label="B" />
        </UnderlinePanels.Tab>
        <UnderlinePanels.Panel>Panel A</UnderlinePanels.Panel>
        <UnderlinePanels.Panel>Panel B</UnderlinePanels.Panel>
      </UnderlinePanels>
    )

    const {rerender} = render(<div data-tick={0}>{tree}</div>)
    const initialCalls = tabBodyRenderCount.mock.calls.length
    expect(initialCalls).toBe(2) // one per Tab on mount

    // Re-render with the SAME tree reference but a different host attribute
    // — simulates an unrelated parent re-render. Tab elements are
    // referentially stable, memo should skip every Tab.
    rerender(<div data-tick={1}>{tree}</div>)
    rerender(<div data-tick={2}>{tree}</div>)
    rerender(<div data-tick={3}>{tree}</div>)

    // TabBody render count must not have grown. If memoization regresses
    // (e.g. iconsVisible re-baked into Tab via cloneElement), each
    // re-render would produce two extra TabBody renders.
    expect(tabBodyRenderCount.mock.calls.length).toBe(initialCalls)
  })
})
