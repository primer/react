import {afterEach, describe, expect, it, vi} from 'vitest'
import {useRef} from 'react'
import {act, render} from '@testing-library/react'
import {OverflowObserverProvider} from '../../components/OverflowObserverProvider'
import {useIsClipped} from '../useOverflowObserver'

type Entry = Pick<IntersectionObserverEntry, 'target' | 'isIntersecting' | 'intersectionRatio'>

/** Minimal `IntersectionObserver` stub that records instances and lets tests drive callbacks. */
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  readonly observed = new Set<Element>()
  callback: (entries: Entry[]) => void
  options?: IntersectionObserverInit
  constructor(callback: (entries: Entry[]) => void, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
    MockIntersectionObserver.instances.push(this)
  }
  observe(element: Element) {
    this.observed.add(element)
  }
  unobserve(element: Element) {
    this.observed.delete(element)
  }
  disconnect() {
    this.observed.clear()
  }
  trigger(entries: Entry[]) {
    act(() => this.callback(entries))
  }
}

/** Minimal `ResizeObserver` stub that records instances and lets tests drive callbacks. */
class MockResizeObserver {
  static instances: MockResizeObserver[] = []
  readonly observed = new Set<Element>()
  callback: ResizeObserverCallback
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    MockResizeObserver.instances.push(this)
  }
  observe(element: Element) {
    this.observed.add(element)
  }
  unobserve(element: Element) {
    this.observed.delete(element)
  }
  disconnect() {
    this.observed.clear()
  }
  trigger(element?: Element) {
    const entries = element
      ? ([{target: element, contentRect: element.getBoundingClientRect()}] as unknown as ResizeObserverEntry[])
      : []
    act(() => this.callback(entries, this as unknown as ResizeObserver))
  }
}

function Item({disabled}: {disabled?: boolean}) {
  const ref = useRef<HTMLLIElement>(null)
  const isClipped = useIsClipped(ref, {disabled})
  return <li ref={ref} data-testid="item" data-overflowing={isClipped} />
}

function Harness({disabled}: {disabled?: boolean}) {
  const rootRef = useRef<HTMLUListElement>(null)
  return (
    <ul ref={rootRef}>
      <OverflowObserverProvider rootRef={rootRef}>
        <Item disabled={disabled} />
      </OverflowObserverProvider>
    </ul>
  )
}

describe('useIsClipped', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    MockIntersectionObserver.instances = []
    MockResizeObserver.instances = []
  })

  it('reports false when there is no surrounding provider', () => {
    const {getByTestId} = render(<Item />)
    expect(getByTestId('item').getAttribute('data-overflowing')).toBe('false')
  })

  it('is inert and reports false when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const {getByTestId} = render(<Harness />)
    expect(getByTestId('item').getAttribute('data-overflowing')).toBe('false')
  })

  it('does not subscribe and reports false when disabled', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const {getByTestId} = render(<Harness disabled />)
    expect(getByTestId('item').getAttribute('data-overflowing')).toBe('false')
    // A disabled item should never be observed by the shared observer.
    const item = getByTestId('item')
    expect(MockIntersectionObserver.instances.every(o => !o.observed.has(item))).toBe(true)
  })

  it('reflects overflow state from the shared root-scoped observer', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const {getByTestId} = render(<Harness />)
    const item = getByTestId('item')

    const observer = MockIntersectionObserver.instances.at(-1)!
    // The observer is created against the provided clipping root, not the viewport.
    expect(observer.options?.root).not.toBeNull()
    expect(observer.observed.has(item)).toBe(true)

    // A clipped (wrapped) item is reported as overflowing.
    observer.trigger([{target: item, isIntersecting: false, intersectionRatio: 0}])
    expect(item.getAttribute('data-overflowing')).toBe('true')

    // A fully visible item is not overflowing.
    observer.trigger([{target: item, isIntersecting: true, intersectionRatio: 1}])
    expect(item.getAttribute('data-overflowing')).toBe('false')
  })

  it('does not report items as overflowing when the observer root has zero width', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    vi.stubGlobal('ResizeObserver', MockResizeObserver)

    const {getByTestId} = render(<Harness />)
    const item = getByTestId('item')
    const root = item.closest('ul')!

    // Simulate a zero-width root (as can happen on initial Safari render).
    Object.defineProperty(root, 'clientWidth', {configurable: true, get: () => 0})

    const observer = MockIntersectionObserver.instances.at(-1)!
    // Even though every item reports not intersecting, the zero-width root guard should suppress the update.
    observer.trigger([{target: item, isIntersecting: false, intersectionRatio: 0}])
    expect(item.getAttribute('data-overflowing')).toBe('false')
  })

  it('re-observes items when the root transitions from zero width to non-zero width', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    vi.stubGlobal('ResizeObserver', MockResizeObserver)

    const {getByTestId} = render(<Harness />)
    const item = getByTestId('item')
    const root = item.closest('ul')!

    // Start with zero-width root; IO callback fires but is suppressed.
    let clientWidth = 0
    Object.defineProperty(root, 'clientWidth', {configurable: true, get: () => clientWidth})

    const observer = MockIntersectionObserver.instances.at(-1)!
    observer.trigger([{target: item, isIntersecting: false, intersectionRatio: 0}])
    expect(item.getAttribute('data-overflowing')).toBe('false')

    // Root gains size — ResizeObserver fires the 0→non-zero transition, which clears
    // observedElementsRef and calls observeSubscribedElements() to re-attach the IO.
    clientWidth = 400
    const ro = MockResizeObserver.instances.at(-1)!
    ro.trigger(root)

    // Now that items are re-observed, a fresh IO batch with correct intersections is delivered.
    const freshObserver = MockIntersectionObserver.instances.at(-1)!
    freshObserver.trigger([{target: item, isIntersecting: true, intersectionRatio: 1}])
    expect(item.getAttribute('data-overflowing')).toBe('false')

    // And a genuinely clipped item should still be reported as overflowing.
    freshObserver.trigger([{target: item, isIntersecting: false, intersectionRatio: 0}])
    expect(item.getAttribute('data-overflowing')).toBe('true')
  })

  it('does not treat a sub-pixel intersectionRatio (e.g. 0.999) as overflow', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

    const {getByTestId} = render(<Harness />)
    const item = getByTestId('item')

    const observer = MockIntersectionObserver.instances.at(-1)!
    // Safari sometimes reports 0.999… for fully-visible elements due to sub-pixel rounding.
    observer.trigger([{target: item, isIntersecting: true, intersectionRatio: 0.999}])
    expect(item.getAttribute('data-overflowing')).toBe('false')
  })
})
