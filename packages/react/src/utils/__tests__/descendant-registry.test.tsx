import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest'
import type React from 'react'
import {Fragment, useRef, useState} from 'react'
import {render, act} from '@testing-library/react'
import {createDescendantRegistry} from '../descendant-registry'
import {userEvent} from '@testing-library/user-event'

/**
 * Creates a fresh registry instance with isolated helper components for each test. This ensures
 * no state leaks between tests via a shared Context or Provider.
 */
function createTestRegistry() {
  const {Provider, useRegistryState, useRegisterDescendant} = createDescendantRegistry<string>()

  /**
   * Parent component that exposes the registry values in the DOM for assertions.
   * State is held here and passed down to the Provider.
   */
  function RegistryParent({children}: {children: React.ReactNode}) {
    const [registryState, setRegistry] = useRegistryState()

    return (
      <>
        <div data-testid="registry-values">{Array.from(registryState?.values() ?? []).join(',')}</div>
        <Provider setRegistry={setRegistry}>{children}</Provider>
      </>
    )
  }

  /** A leaf component that registers itself as a descendant. */
  function Item({value}: {value: string}) {
    useRegisterDescendant(value)
    return null
  }

  return {RegistryParent, Item}
}

describe('createDescendantRegistry', () => {
  it('registers descendant items inside of other components', () => {
    const {RegistryParent, Item} = createTestRegistry()

    function Wrapper({value}: {value: string}) {
      return <Item value={value} />
    }

    const {getByTestId} = render(
      <RegistryParent>
        <Wrapper value="a" />
        <Wrapper value="b" />
        <Wrapper value="c" />
      </RegistryParent>,
    )

    expect(getByTestId('registry-values').textContent).toBe('a,b,c')
  })

  it('registers descendant items inside of React fragments', () => {
    const {RegistryParent, Item} = createTestRegistry()

    const {getByTestId} = render(
      <RegistryParent>
        <Fragment>
          <Item value="a" />
          <Item value="b" />
        </Fragment>
        <Item value="c" />
      </RegistryParent>,
    )

    expect(getByTestId('registry-values').textContent).toBe('a,b,c')
  })

  it('updates item values on change', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    function Test() {
      const [middleValue, setMiddleValue] = useState('middle')
      return (
        <RegistryParent>
          <Item value="a" />
          <Item value={middleValue} />
          <Item value="b" />
          <button type="button" onClick={() => setMiddleValue('c')}>
            Update middle
          </button>
        </RegistryParent>
      )
    }

    const {getByTestId, getByRole} = render(<Test />)
    expect(getByTestId('registry-values').textContent).toBe('a,middle,b')

    await userEvent.click(getByRole('button'))

    expect(getByTestId('registry-values').textContent).toBe('a,c,b')
  })

  it('registers items added to the middle of children after initial render', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    function Test() {
      const [showMiddle, setShowMiddle] = useState(false)
      return (
        <RegistryParent>
          <Item value="a" />
          {showMiddle && <Item value="middle" />}
          <Item value="b" />
          <button type="button" onClick={() => setShowMiddle(true)}>
            Add middle
          </button>
        </RegistryParent>
      )
    }

    const {getByTestId, getByRole} = render(<Test />)
    expect(getByTestId('registry-values').textContent).toBe('a,b')

    await userEvent.click(getByRole('button'))

    expect(getByTestId('registry-values').textContent).toBe('a,middle,b')
  })

  it('drops items from the registry after they unmount', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    function Test() {
      const [showLast, setShowLast] = useState(true)
      return (
        <RegistryParent>
          <Item value="a" />
          <Item value="b" />
          {showLast && <Item value="c" />}
          <button type="button" onClick={() => setShowLast(false)}>
            Remove last
          </button>
        </RegistryParent>
      )
    }

    const {getByTestId, getByRole} = render(<Test />)
    expect(getByTestId('registry-values').textContent).toBe('a,b,c')

    await userEvent.click(getByRole('button'))

    expect(getByTestId('registry-values').textContent).toBe('a,b')
  })

  it('registers deep descendants added to the beginning of the tree after initial render', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    function DeepItem({value}: {value: string}) {
      return (
        <div>
          <div>
            <Item value={value} />
          </div>
        </div>
      )
    }

    function Test() {
      const [showFirst, setShowFirst] = useState(false)
      return (
        <RegistryParent>
          {showFirst && <DeepItem value="first" />}
          <Item value="second" />
          <Item value="third" />
          <button type="button" onClick={() => setShowFirst(true)}>
            Add first
          </button>
        </RegistryParent>
      )
    }

    const {getByTestId, getByRole} = render(<Test />)
    expect(getByTestId('registry-values').textContent).toBe('second,third')

    await userEvent.click(getByRole('button'))

    expect(getByTestId('registry-values').textContent).toBe('first,second,third')
  })
})

describe('createDescendantRegistry coalesced rebuilds', () => {
  /**
   * Builds a registry that counts how many times the Provider rebuilds (re-runs the rebuild reducer) by counting
   * renders of an instrumented child placed inside the Provider. Each rebuild bumps the registry `key`, which forces
   * descendants to re-render, so a render counter on a registry descendant is a reliable proxy for rebuild count.
   */
  function createCountingRegistry() {
    const {Provider, useRegistryState, useRegisterDescendant} = createDescendantRegistry<string>()

    const rebuildSpy = vi.fn()

    function RegistryParent({children}: {children: React.ReactNode}) {
      const [registryState, setRegistry] = useRegistryState()
      return (
        <>
          <div data-testid="registry-values">{Array.from(registryState?.values() ?? []).join(',')}</div>
          <Provider setRegistry={setRegistry}>{children}</Provider>
        </>
      )
    }

    /** Registers itself and pings `rebuildSpy` whenever the registry `key` changes (i.e. on each rebuild). */
    function RebuildProbe() {
      useRegisterDescendant('probe')
      rebuildSpy()
      return null
    }

    function Item({value}: {value: string}) {
      useRegisterDescendant(value)
      return null
    }

    return {RegistryParent, Item, RebuildProbe, rebuildSpy}
  }

  it('coalesces multiple same-tick registrations into a single rebuild', async () => {
    const {RegistryParent, Item, RebuildProbe, rebuildSpy} = createCountingRegistry()

    function Test() {
      const [extraItems, setExtraItems] = useState(0)
      return (
        <RegistryParent>
          <RebuildProbe />
          <Item value="a" />
          {Array.from({length: extraItems}, (_, i) => (
            <Item key={i} value={`extra-${i}`} />
          ))}
          <button type="button" onClick={() => setExtraItems(5)}>
            Add five
          </button>
        </RegistryParent>,
      )
    }

    const {getByRole, getByTestId} = render(<Test />)

    // Let the initial mount settle (initial registration + commit + the idle-state rebuild it schedules).
    await act(async () => {
      await Promise.resolve()
    })

    const rendersBeforeAdd = rebuildSpy.mock.calls.length

    // Add five items in a single state update. Each newly-registered item, while the registry is idle, would
    // historically trigger its own synchronous rebuild (up to 5). With coalescing they collapse into one.
    await act(async () => {
      await userEvent.click(getByRole('button'))
      // Flush the coalescing microtask.
      await Promise.resolve()
    })

    expect(getByTestId('registry-values').textContent).toContain('extra-4')

    const rebuildsForAdd = rebuildSpy.mock.calls.length - rendersBeforeAdd
    // The five registrations should coalesce: far fewer rebuild-driven renders than the number of items added.
    // We assert a tight upper bound (<= 2) to allow for React's own re-render of the changed subtree plus the
    // single coalesced rebuild, while still failing if each item triggered its own rebuild (which would be >= 5).
    expect(rebuildsForAdd).toBeLessThanOrEqual(2)
  })

  it('still registers every item correctly after a coalesced rebuild', async () => {
    const {RegistryParent, Item} = createCountingRegistry()

    function Test() {
      const [show, setShow] = useState(false)
      return (
        <RegistryParent>
          <Item value="a" />
          {show && (
            <>
              <Item value="b" />
              <Item value="c" />
              <Item value="d" />
            </>
          )}
          <Item value="e" />
          <button type="button" onClick={() => setShow(true)}>
            Show middle
          </button>
        </RegistryParent>,
      )
    }

    const {getByRole, getByTestId} = render(<Test />)
    expect(getByTestId('registry-values').textContent).toBe('a,e')

    await act(async () => {
      await userEvent.click(getByRole('button'))
      await Promise.resolve()
    })

    // Order must be preserved across the coalesced rebuild.
    expect(getByTestId('registry-values').textContent).toBe('a,b,c,d,e')
  })
})

describe('createDescendantRegistry shared IntersectionObserver', () => {
  // Capture every IntersectionObserver instance and its observed elements so we can assert a single shared observer
  // is used and drive its callback manually.
  type FakeObserver = {
    callback: IntersectionObserverCallback
    observed: Set<Element>
    observe: ReturnType<typeof vi.fn>
    unobserve: ReturnType<typeof vi.fn>
    disconnect: ReturnType<typeof vi.fn>
    trigger: () => void
  }
  let observers: FakeObserver[] = []

  beforeEach(() => {
    observers = []
    class MockIntersectionObserver {
      callback: IntersectionObserverCallback
      observed = new Set<Element>()
      observe = vi.fn((el: Element) => {
        this.observed.add(el)
      })
      unobserve = vi.fn((el: Element) => {
        this.observed.delete(el)
      })
      disconnect = vi.fn(() => {
        this.observed.clear()
      })
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
        observers.push(this as unknown as FakeObserver)
        ;(this as unknown as FakeObserver).trigger = () => {
          const entries = Array.from(this.observed).map(
            target => ({target}) as IntersectionObserverEntry,
          )
          this.callback(entries, this as unknown as IntersectionObserver)
        }
      }
      takeRecords() {
        return []
      }
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  /**
   * Registry with the shared overflow observer enabled. Items report their overflow state into the DOM so we can
   * assert how many were updated by a single observer callback (the fan-out).
   */
  function createOverflowRegistry() {
    const {Provider, useRegistryState, useRegisterDescendant, useRegisterOverflowObserver} =
      createDescendantRegistry<string | null>({overflow: {threshold: 1}})

    function RegistryParent({children}: {children: React.ReactNode}) {
      const [, setRegistry] = useRegistryState()
      return <Provider setRegistry={setRegistry}>{children}</Provider>
    }

    function Item({value}: {value: string}) {
      const ref = useRef<HTMLDivElement>(null)
      const isOverflowing = useRegisterOverflowObserver(ref)
      useRegisterDescendant(isOverflowing ? value : null)
      return <div ref={ref} data-testid={`item-${value}`} data-overflowing={isOverflowing ? 'true' : 'false'} />
    }

    return {RegistryParent, Item}
  }

  it('creates a single shared observer for all items rather than one per item', () => {
    const {RegistryParent, Item} = createOverflowRegistry()

    render(
      <RegistryParent>
        <Item value="a" />
        <Item value="b" />
        <Item value="c" />
      </RegistryParent>,
    )

    // Exactly one observer instance, observing all three elements.
    expect(observers).toHaveLength(1)
    expect(observers[0].observed.size).toBe(3)
  })

  it('fans out a single observer callback to every subscribed item', () => {
    const {RegistryParent, Item} = createOverflowRegistry()

    const {getByTestId} = render(
      <RegistryParent>
        <Item value="a" />
        <Item value="b" />
        <Item value="c" />
      </RegistryParent>,
    )

    // Simulate all items wrapping to a clipped row (offsetTop > 0). jsdom reports 0 for offsetTop, so stub it.
    const items = ['a', 'b', 'c'].map(v => getByTestId(`item-${v}`))
    for (const el of items) {
      Object.defineProperty(el, 'offsetTop', {configurable: true, value: 10})
    }

    // One observer notification should update all three items via fan-out.
    act(() => {
      observers[0].trigger()
    })

    for (const el of items) {
      expect(el).toHaveAttribute('data-overflowing', 'true')
    }
  })

  it('unobserves an element from the shared observer when its item unmounts', async () => {
    const {RegistryParent, Item} = createOverflowRegistry()

    function Test() {
      const [showC, setShowC] = useState(true)
      return (
        <div>
          <RegistryParent>
            <Item value="a" />
            <Item value="b" />
            {showC && <Item value="c" />}
          </RegistryParent>
          <button type="button" onClick={() => setShowC(false)}>
            Remove c
          </button>
        </div>
      )
    }

    const {getByRole} = render(<Test />)
    expect(observers).toHaveLength(1)
    expect(observers[0].observed.size).toBe(3)

    await userEvent.click(getByRole('button'))

    // Still the same single observer, now observing only the two remaining items.
    expect(observers).toHaveLength(1)
    expect(observers[0].observed.size).toBe(2)
  })

  it('disconnects the shared observer when the provider unmounts', async () => {
    const {RegistryParent, Item} = createOverflowRegistry()

    function Test() {
      const [mounted, setMounted] = useState(true)
      return (
        <div>
          {mounted && (
            <RegistryParent>
              <Item value="a" />
              <Item value="b" />
            </RegistryParent>
          )}
          <button type="button" onClick={() => setMounted(false)}>
            Unmount
          </button>
        </div>
      )
    }

    const {getByRole} = render(<Test />)
    expect(observers).toHaveLength(1)
    const observer = observers[0]

    await userEvent.click(getByRole('button'))

    expect(observer.disconnect).toHaveBeenCalled()
  })
})
