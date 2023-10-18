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

// Dialog showModal isn't implemented in JSDOM https://github.com/jsdom/jsdom/issues/3294
global.HTMLDialogElement.prototype.showModal = jest.fn(function mock(this: HTMLDialogElement) {
  // eslint-disable-next-line no-invalid-this
  this.open = true
  // eslint-disable-next-line no-invalid-this
  const element: HTMLElement | null = this.querySelector('[autofocus]')
  element?.focus()
})
