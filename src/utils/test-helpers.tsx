// JSDOM doesn't mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
})

global.CSS = {
  escape: jest.fn(),
  supports: jest.fn().mockImplementation(() => {
    return false
  })
}
