import {act} from '@testing-library/react'
import {vi} from 'vitest'

/** jsdom has no IntersectionObserver; this records observed elements so tests can report clipping by hand. */
export class MockIntersectionObserver {
  static current: MockIntersectionObserver | null = null
  readonly elements = new Set<Element>()
  readonly callback: IntersectionObserverCallback
  readonly options?: IntersectionObserverInit
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
    MockIntersectionObserver.current = this
  }
  observe(element: Element) {
    this.elements.add(element)
  }
  unobserve(element: Element) {
    this.elements.delete(element)
  }
  disconnect() {
    this.elements.clear()
  }
  takeRecords() {
    return []
  }
}

/** Installs the mock for one test; pair with `vi.unstubAllGlobals()` in `afterEach`. */
export function stubIntersectionObserver() {
  MockIntersectionObserver.current = null
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
}

/** Reports every observed element as fully visible except `clipped`. */
export function clip(...clipped: Element[]) {
  const observer = MockIntersectionObserver.current
  if (!observer) throw new Error('No IntersectionObserver was created')
  const entries = Array.from(observer.elements, target => ({
    target,
    isIntersecting: !clipped.includes(target),
    intersectionRatio: clipped.includes(target) ? 0 : 1,
  }))
  act(() => observer.callback(entries as IntersectionObserverEntry[], observer as unknown as IntersectionObserver))
}
