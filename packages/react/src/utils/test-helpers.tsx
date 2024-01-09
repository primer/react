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
