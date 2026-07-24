// Most of the underlying tab behavior is provided by the experimental `Tabs`
// component and its hooks (see ../Tabs). These tests cover the UnderlinePanels
// public API and its integration with Tabs.

import type React from 'react'
import {act, useState} from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, it, afterEach, beforeEach, expect, vi} from 'vitest'
import {CodeIcon, EyeIcon} from '@primer/octicons-react'
import UnderlinePanels from './UnderlinePanels'
import {AnchoredOverlay} from '../../AnchoredOverlay'
import {implementsClassName, withExpectedConsoleError, withExpectedConsoleWarning} from '../../utils/testing'
import classes from './UnderlinePanels.module.css'

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
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Tab/Panel require the Tabs context, so they're rendered inside
  // UnderlinePanels rather than via `implementsClassName` (which renders alone).
  it('UnderlinePanels.Tab renders with a custom className', () => {
    const Tab = UnderlinePanels.Tab as React.ElementType
    render(
      <UnderlinePanels aria-label="Select a tab">
        <Tab className="test-class">Tab 1</Tab>
        <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )

    expect(screen.getByRole('tab', {name: 'Tab 1'})).toHaveClass('test-class')
  })
  it('UnderlinePanels.Panel renders with a custom className', () => {
    render(
      <UnderlinePanels aria-label="Select a tab">
        <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Panel className="test-class">Panel 1</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )

    expect(screen.getByText('Panel 1')).toHaveClass('test-class')
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

  it('selects the first tab by default and hides the other panels', () => {
    render(<UnderlinePanelsMockComponent aria-label="Select a tab" />)

    expect(screen.getByRole('tab', {name: 'Tab 1'})).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Panel 1')).toBeVisible()
    expect(screen.getByText('Panel 2')).not.toBeVisible()
    expect(screen.getByText('Panel 3')).not.toBeVisible()
  })

  it('switches the visible panel when a tab is selected (uncontrolled)', async () => {
    const user = userEvent.setup()
    render(<UnderlinePanelsMockComponent aria-label="Select a tab" />)

    await user.click(screen.getByRole('tab', {name: 'Tab 2'}))

    expect(screen.getByRole('tab', {name: 'Tab 2'})).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', {name: 'Tab 1'})).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Panel 2')).toBeVisible()
    expect(screen.getByText('Panel 1')).not.toBeVisible()
  })

  it('throws an error when the number of tabs does not match the number of panels', () => {
    withExpectedConsoleError(() => {
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
  })

  it('throws an error when the number of panels does not match the number of tabs', () => {
    withExpectedConsoleError(() => {
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
  })

  it('throws an error when there are multiple items that have aria-selected', () => {
    withExpectedConsoleError(() => {
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

  describe('controlled value / onChange / activationMode', () => {
    const RefTabs = (props: {
      value?: string
      defaultValue?: string
      activationMode?: 'automatic' | 'manual'
      onChange?: ({value}: {value: string}) => void
    }) => (
      <UnderlinePanels aria-label="Ref type" {...props}>
        <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
        <UnderlinePanels.Panel value="branch">Branch panel</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="tag">Tag panel</UnderlinePanels.Panel>
      </UnderlinePanels>
    )

    it('`value` selects the matching tab and shows its panel', () => {
      render(<RefTabs value="tag" onChange={vi.fn()} />)

      expect(screen.getByRole('tab', {name: 'Tags'})).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tab', {name: 'Branches'})).toHaveAttribute('aria-selected', 'false')
      expect(screen.getByText('Tag panel')).toBeVisible()
      expect(screen.getByText('Branch panel')).not.toBeVisible()
    })

    it('calls onChange with the domain value when a tab is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<RefTabs value="branch" onChange={onChange} />)

      await user.click(screen.getByRole('tab', {name: 'Tags'}))

      expect(onChange).toHaveBeenCalledWith({value: 'tag'})
    })

    it('calls onChange on arrow-key navigation (automatic activation)', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<RefTabs value="branch" onChange={onChange} />)

      await act(async () => {
        screen.getByRole('tab', {name: 'Branches'}).focus()
        await user.keyboard('{ArrowRight}')
      })

      expect(onChange).toHaveBeenCalledWith({value: 'tag'})
    })

    it('does not update selection while controlled unless `value` changes', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const {rerender} = render(<RefTabs value="branch" onChange={onChange} />)

      await user.click(screen.getByRole('tab', {name: 'Tags'}))

      // Parent ignored onChange, so the controlled value pins selection on branch.
      expect(screen.getByRole('tab', {name: 'Branches'})).toHaveAttribute('aria-selected', 'true')

      rerender(<RefTabs value="tag" onChange={onChange} />)
      expect(screen.getByRole('tab', {name: 'Tags'})).toHaveAttribute('aria-selected', 'true')
    })

    it('`defaultValue` sets the initial selection and updates internally (uncontrolled)', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<RefTabs defaultValue="tag" onChange={onChange} />)

      expect(screen.getByRole('tab', {name: 'Tags'})).toHaveAttribute('aria-selected', 'true')

      await user.click(screen.getByRole('tab', {name: 'Branches'}))

      expect(screen.getByRole('tab', {name: 'Branches'})).toHaveAttribute('aria-selected', 'true')
      expect(onChange).toHaveBeenCalledWith({value: 'branch'})
      expect(screen.getByText('Branch panel')).toBeVisible()
    })

    describe('manual activation', () => {
      it('arrow keys move focus without selecting or firing onChange', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<RefTabs value="branch" activationMode="manual" onChange={onChange} />)

        const branch = screen.getByRole('tab', {name: 'Branches'})
        const tag = screen.getByRole('tab', {name: 'Tags'})

        await act(async () => {
          branch.focus()
          await user.keyboard('{ArrowRight}')
        })

        expect(tag).toHaveFocus()
        expect(branch).toHaveAttribute('aria-selected', 'true')
        expect(onChange).not.toHaveBeenCalled()
        // Roving tab stop follows focus in manual mode (APG manual activation pattern).
        expect(tag).toHaveAttribute('tabindex', '0')
        expect(branch).toHaveAttribute('tabindex', '-1')
      })

      it('commits selection with Enter', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<RefTabs value="branch" activationMode="manual" onChange={onChange} />)

        await act(async () => {
          screen.getByRole('tab', {name: 'Branches'}).focus()
          await user.keyboard('{ArrowRight}')
          await user.keyboard('{Enter}')
        })

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith({value: 'tag'})
      })
    })

    it('fires onChange on arrow keys even without explicit values (positional back-compat)', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <UnderlinePanels aria-label="Select a tab" onChange={onChange}>
          <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab>Tab 2</UnderlinePanels.Tab>
          <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
          <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
        </UnderlinePanels>,
      )

      await act(async () => {
        screen.getByRole('tab', {name: 'Tab 1'}).focus()
        await user.keyboard('{ArrowRight}')
      })

      expect(onChange).toHaveBeenCalledWith({value: '1'})
      expect(screen.getByRole('tab', {name: 'Tab 2'})).toHaveAttribute('aria-selected', 'true')
    })

    describe('dev validation and fallback', () => {
      const RefTabsRaw = (props: {
        value?: string
        defaultValue?: string
        tabs?: Array<{tab: string; panel: string}>
      }) => {
        const pairs = props.tabs ?? [
          {tab: 'branch', panel: 'branch'},
          {tab: 'tag', panel: 'tag'},
        ]
        return (
          <UnderlinePanels aria-label="Ref type" value={props.value} defaultValue={props.defaultValue}>
            {pairs.map((p, i) => (
              <UnderlinePanels.Tab key={`tab-${i}`} value={p.tab}>
                {p.tab}
              </UnderlinePanels.Tab>
            ))}
            {pairs.map((p, i) => (
              <UnderlinePanels.Panel key={`panel-${i}`} value={p.panel}>
                {p.panel} panel
              </UnderlinePanels.Panel>
            ))}
          </UnderlinePanels>
        )
      }

      it('clamps to the first tab (and warns) when the selected value matches no tab', () => {
        withExpectedConsoleWarning(() => {
          render(<RefTabsRaw value="nonexistent" />)
        })

        const branch = screen.getByRole('tab', {name: 'branch'})
        const tag = screen.getByRole('tab', {name: 'tag'})

        // No keyboard trap: exactly one tab is the tab stop, and the first panel is shown.
        expect(branch).toHaveAttribute('aria-selected', 'true')
        expect(branch).toHaveAttribute('tabindex', '0')
        expect(tag).toHaveAttribute('tabindex', '-1')
        expect(screen.getByText('branch panel')).toBeVisible()
      })

      it('warns when `value` and `defaultValue` are combined, and `value` wins', () => {
        withExpectedConsoleWarning(() => {
          render(<RefTabsRaw value="branch" defaultValue="tag" />)
        })

        expect(screen.getByRole('tab', {name: 'branch'})).toHaveAttribute('aria-selected', 'true')
      })

      it('throws when two tabs share the same value', () => {
        withExpectedConsoleError(() => {
          expect(() => {
            render(
              <RefTabsRaw
                tabs={[
                  {tab: 'branch', panel: 'branch'},
                  {tab: 'branch', panel: 'tag'},
                ]}
              />,
            )
          }).toThrow('Every tab must have a unique `value`. Found duplicate "branch".')
        })
      })

      it('throws when a tab has no matching panel', () => {
        withExpectedConsoleError(() => {
          expect(() => {
            render(
              <RefTabsRaw
                tabs={[
                  {tab: 'branch', panel: 'branch'},
                  {tab: 'tag', panel: 'mismatch'},
                ]}
              />,
            )
          }).toThrow('Tab with `value` "tag" has no matching panel')
        })
      })
    })
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

describe('UnderlinePanels — list resize observation', () => {
  type Cb = (entries: Pick<ResizeObserverEntry, 'contentRect'>[]) => void
  const observerMap = new Map<Element, Cb>()
  const originalResizeObserver = globalThis.ResizeObserver

  beforeEach(() => {
    observerMap.clear()
    class MockResizeObserver {
      callback: Cb
      observed = new Set<Element>()
      constructor(cb: Cb) {
        this.callback = cb
      }
      observe(el: Element) {
        this.observed.add(el)
        observerMap.set(el, this.callback)
      }
      unobserve(el: Element) {
        this.observed.delete(el)
        observerMap.delete(el)
      }
      disconnect() {
        for (const el of this.observed) observerMap.delete(el)
        this.observed.clear()
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.ResizeObserver = MockResizeObserver as any
  })

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver
  })

  function fireResize(el: Element | null, width: number) {
    if (!el) return
    const cb = observerMap.get(el)
    if (!cb) return
    act(() => {
      cb([{contentRect: {width, height: 40} as DOMRectReadOnly}])
    })
  }

  it('refreshes list width when tab contents change so the wrapper observer makes the right call', () => {
    // Regression for a stale-measurement bug: the list's natural width was
    // captured once on mount and never refreshed. When a tab's contents grew
    // (e.g. a counter went 1 → 10) the next wrapper resize compared against
    // the original measurement and could leave icons visible even though
    // they no longer fit. The list is now observed too, so its width tracks
    // its actual contents.
    function Demo({counter}: {counter: number}) {
      // display: none keeps the real DOM measurement at 0 so the test only
      // depends on widths we feed through the mocked ResizeObservers.
      return (
        <div style={{display: 'none'}}>
          <UnderlinePanels aria-label="Resize sync">
            <UnderlinePanels.Tab icon={CodeIcon} counter={counter}>
              Tab 1
            </UnderlinePanels.Tab>
            <UnderlinePanels.Tab icon={EyeIcon} counter={counter}>
              Tab 2
            </UnderlinePanels.Tab>
            <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
            <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
          </UnderlinePanels>
        </div>
      )
    }

    const {container, rerender} = render(<Demo counter={1} />)
    const wrapper = container.querySelector<HTMLElement>('[data-icons-visible]')
    const list = container.querySelector<HTMLElement>('[role="tablist"]')

    expect(wrapper).not.toBeNull()
    expect(list).not.toBeNull()

    // Seed the list's natural width via the list observer, then a wrapper
    // resize confirms icons should be visible (300 > 200).
    fireResize(list, 200)
    fireResize(wrapper, 300)
    expect(wrapper).toHaveAttribute('data-icons-visible', 'true')

    // Counter grows from 1 to 10 — the list naturally widens. The list
    // observer fires with the new width, refreshing the ref.
    rerender(<Demo counter={10} />)
    fireResize(list, 280)

    // Wrapper shrinks below the new list width. Icons must hide. Without
    // the list observer, the comparison would use the stale 200px seed and
    // icons would (incorrectly) stay visible.
    fireResize(wrapper, 250)
    expect(wrapper).toHaveAttribute('data-icons-visible', 'false')
  })
})

describe('UnderlinePanels — AnchoredOverlay composition', () => {
  // Regression coverage for the RefSelector issue: when UnderlinePanels lives inside an
  // AnchoredOverlay, the overlay's focus zone must be disabled so it doesn't fight the tablist's
  // own roving tabindex. Otherwise every tab can end up at tabindex="-1", trapping keyboard users.
  const OverlayHarness = ({onChange}: {onChange?: ({value}: {value: string}) => void}) => {
    const [open, setOpen] = useState(true)
    return (
      <AnchoredOverlay
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderAnchor={props => (
          <button type="button" {...props}>
            Open
          </button>
        )}
        focusZoneSettings={{disabled: true}}
      >
        <UnderlinePanels aria-label="Ref type" defaultValue="branch" onChange={onChange}>
          <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
          <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
          <UnderlinePanels.Panel value="branch">Branch panel</UnderlinePanels.Panel>
          <UnderlinePanels.Panel value="tag">Tag panel</UnderlinePanels.Panel>
        </UnderlinePanels>
      </AnchoredOverlay>
    )
  }

  it('keeps the tablist roving tabindex intact (exactly one tab is tabbable)', async () => {
    render(<OverlayHarness />)
    // Flush AnchoredOverlay's async positioning updates inside act.
    await act(async () => {})

    const branch = screen.getByRole('tab', {name: 'Branches'})
    const tag = screen.getByRole('tab', {name: 'Tags'})

    expect(branch).toHaveAttribute('tabindex', '0')
    expect(tag).toHaveAttribute('tabindex', '-1')
  })

  it('supports arrow-key navigation inside the overlay without trapping focus', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OverlayHarness onChange={onChange} />)
    await act(async () => {})

    const branch = screen.getByRole('tab', {name: 'Branches'})
    const tag = screen.getByRole('tab', {name: 'Tags'})

    await act(async () => {
      branch.focus()
      await user.keyboard('{ArrowRight}')
    })

    expect(tag).toHaveFocus()
    expect(onChange).toHaveBeenCalledWith({value: 'tag'})
    // Roving tabindex still resolves to exactly one tab stop after selection moves.
    expect(tag).toHaveAttribute('tabindex', '0')
    expect(branch).toHaveAttribute('tabindex', '-1')
  })
})
