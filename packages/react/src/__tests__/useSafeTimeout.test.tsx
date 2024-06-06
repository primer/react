import {renderHook} from '@testing-library/react-hooks'
import useSafeTimeout from '../hooks/useSafeTimeout'

afterEach(() => {
  jest.useRealTimers()
})

test('should call callback after time', async () => {
  const {result, waitFor} = renderHook(() => useSafeTimeout())
  const mockFunction = jest.fn()
  result.current.safeSetTimeout(mockFunction, 300)
  await waitFor(() => expect(mockFunction).toHaveBeenCalled())
})

test('should clear timeouts when safeClearTimeout is called', () => {
  jest.useFakeTimers()
  jest.spyOn(global, 'clearTimeout')
  const {result} = renderHook(() => useSafeTimeout())
  const mockFunction = jest.fn()
  const timeoutId = result.current.safeSetTimeout(mockFunction, 300)
  result.current.safeClearTimeout(timeoutId)
  expect(clearTimeout).toHaveBeenCalledTimes(1)
  expect(clearTimeout).toHaveBeenLastCalledWith(timeoutId)
})

test('should clear timeouts when the component is unmounted', () => {
  jest.useFakeTimers()
  jest.spyOn(global, 'clearTimeout')
  const {result, unmount} = renderHook(() => useSafeTimeout())
  const mockFunction = jest.fn()
  const timeoutId = result.current.safeSetTimeout(mockFunction, 300)

  unmount()
  expect(clearTimeout).toHaveBeenCalledTimes(1)
  expect(clearTimeout).toHaveBeenLastCalledWith(timeoutId)
})
