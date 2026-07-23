// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {TextEncoder} from 'node:util'

// Runtime-agnostic mock helper: works with Jest, Vitest, or any other test runtime.
// Falls back to a plain function when no runtime is detected, so polyfills still apply
// even outside a test runner (e.g. an SSR-only import).
const mockFn = (impl?: (...args: unknown[]) => unknown) => {
  const runtimeMockFactory =
    (globalThis as {jest?: {fn: typeof Function}}).jest?.fn ?? (globalThis as {vi?: {fn: typeof Function}}).vi?.fn
  if (runtimeMockFactory) {
    return impl ? runtimeMockFactory(impl) : runtimeMockFactory()
  }
  return impl ?? (() => {})
}

// JSDOM doesn't mock ResizeObserver
global.ResizeObserver = mockFn(() => {
  return {
    observe: mockFn(),
    disconnect: mockFn(),
    unobserve: mockFn(),
  }
})

// @ts-expect-error only declare properties used internally
global.CSS = {
  escape: mockFn(),
  supports: mockFn(() => {
    return false
  }),
}

global.TextEncoder = TextEncoder

/**
 * Required for internal usage of dialog in primer/react
 * this is not implemented in JSDOM, and until it is we'll need to polyfill
 * https://github.com/jsdom/jsdom/issues/3294
 * https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 * bonus: we only want to mock browser globals in DOM (or js-dom) environments – not in SSR / node
 */
if (typeof document !== 'undefined') {
  global.HTMLDialogElement.prototype.showModal = mockFn(function mock(this: HTMLDialogElement) {
    this.open = true
  })

  global.HTMLDialogElement.prototype.close = mockFn(function mock(this: HTMLDialogElement) {
    this.open = false
  })

  // Add a fallback for getContext if it does not exist in the test, used for axe
  global.HTMLCanvasElement.prototype.getContext = mockFn()
}

// Add a fallback for scrollIntoView if it does not exist in the test
// environment.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (global.Element.prototype.scrollIntoView === undefined) {
  global.Element.prototype.scrollIntoView = mockFn()
}

// setup match media for tests that use useResponsiveValue or use a compone that uses useResponsiveValue
// we don't set this up globally for all tests because some tests need to be able mock matchMedia with more granular control
export const setupMatchMedia = () => {
  // window.matchMedia() is not implemented by JSDOM so we have to create a mock:
  // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockFn(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: mockFn(), // deprecated
      removeListener: mockFn(), // deprecated
      addEventListener: mockFn(),
      removeEventListener: mockFn(),
      dispatchEvent: mockFn(),
    })),
  })
}
