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
})
