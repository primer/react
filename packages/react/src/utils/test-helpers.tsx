// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {TextEncoder} from 'node:util'

// JSDOM doesn't mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => {
  return {
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  }
})

// @ts-expect-error only declare properties used internally
global.CSS = {
  escape: jest.fn(),
  supports: jest.fn().mockImplementation(() => {
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
  global.HTMLDialogElement.prototype.showModal = jest.fn(function mock(this: HTMLDialogElement) {
    this.open = true
  })

  global.HTMLDialogElement.prototype.close = jest.fn(function mock(this: HTMLDialogElement) {
    this.open = false
  })

  // Add a fallback for getContext if it does not exist in the test, used for axe
  global.HTMLCanvasElement.prototype.getContext = jest.fn()
}

// Add a fallback for scrollIntoView if it does not exist in the test
// environment.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (global.Element.prototype.scrollIntoView === undefined) {
  global.Element.prototype.scrollIntoView = jest.fn()
}

// setup match media for tests that use useResponsiveValue or use a compone that uses useResponsiveValue
// we don't set this up globally for all tests because some tests need to be able mock matchMedia with more granular control
export const setupMatchMedia = () => {
  // window.matchMedia() is not implemented by JSDOM so we have to create a mock:
  // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}
