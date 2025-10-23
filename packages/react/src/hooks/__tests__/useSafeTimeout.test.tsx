import {render} from '@testing-library/react'
import {afterEach, beforeEach, expect, test, vi} from 'vitest'
import useSafeTimeout from '../useSafeTimeout'

beforeEach(() => {
  vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval']})
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('should call callback after time', async () => {
  const calls: Array<ReturnType<typeof useSafeTimeout>> = []

  function TestComponent() {
    calls.push(useSafeTimeout())
    return null
  }

  render(<TestComponent />)

  const mockFunction = vi.fn()
  calls[0].safeSetTimeout(mockFunction, 300)
  vi.runAllTimers()
  expect(mockFunction).toHaveBeenCalled()
})

test('should clear timeouts when safeClearTimeout is called', () => {
  vi.spyOn(globalThis, 'clearTimeout')

  const calls: Array<ReturnType<typeof useSafeTimeout>> = []

  function TestComponent() {
    calls.push(useSafeTimeout())
    return null
  }

  render(<TestComponent />)

  const mockFunction = vi.fn()
  const timeoutId = calls[0].safeSetTimeout(mockFunction, 300)
  calls[0].safeClearTimeout(timeoutId)

  expect(clearTimeout).toHaveBeenCalledTimes(1)
  expect(clearTimeout).toHaveBeenLastCalledWith(timeoutId)
})

test('should clear timeouts when the component is unmounted', () => {
  vi.spyOn(globalThis, 'clearTimeout')

  const calls: Array<ReturnType<typeof useSafeTimeout>> = []

  function TestComponent() {
    calls.push(useSafeTimeout())
    return null
  }

  const {unmount} = render(<TestComponent />)

  const mockFunction = vi.fn()
  const timeoutId = calls[0].safeSetTimeout(mockFunction, 300)
  unmount()
  expect(clearTimeout).toHaveBeenCalledTimes(1)
  expect(clearTimeout).toHaveBeenLastCalledWith(timeoutId)
})
