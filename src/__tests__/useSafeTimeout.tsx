import { renderHook } from '@testing-library/react-hooks'
import useSafeTimeout from '../hooks/useSafeTimeout'

test('should call callback after time', async () => {
  const { result, waitFor } = renderHook(() => useSafeTimeout())
  const mockFunction = jest.fn()
  result.current.safeSetTimeout(mockFunction, 300)
  await waitFor(() => expect(mockFunction).toHaveBeenCalled())
})


test('should clear timeouts when safeClearTimeout is called', () => {
  jest.useFakeTimers();
  const { result } = renderHook(() => useSafeTimeout())
  const mockFunction = jest.fn()
  const timeoutId = result.current.safeSetTimeout(mockFunction, 300)
  result.current.safeClearTimeout(timeoutId)
  expect(clearTimeout).toHaveBeenCalledTimes(1);
  expect(clearTimeout).toHaveBeenLastCalledWith(timeoutId);
})

test('should clear timeouts when the hook is unmounted', () => {
  jest.useFakeTimers()
  const { result, unmount } = renderHook(() => useSafeTimeout())
  const mockFunction = jest.fn()
  const timeoutId = result.current.safeSetTimeout(mockFunction, 300)

  unmount()
  expect(clearTimeout).toHaveBeenCalledTimes(1);
  expect(clearTimeout).toHaveBeenLastCalledWith(timeoutId);
})
