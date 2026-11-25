import {renderHook} from '@testing-library/react'
import {afterEach, expect, it, vi} from 'vitest'
import {useResizeObserver} from '../useResizeObserver'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

it('only notifies about dimension changes in the window resize fallback', () => {
  vi.stubGlobal('ResizeObserver', undefined)
  const element = document.createElement('div')
  const rect = vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 50))
  const onResize = vi.fn()
  const {unmount} = renderHook(() => useResizeObserver(onResize, {current: element}))

  window.dispatchEvent(new Event('resize'))
  window.dispatchEvent(new Event('resize'))
  expect(onResize).toHaveBeenCalledTimes(1)

  const resized = new DOMRect(0, 0, 100, 75)
  rect.mockReturnValue(resized)
  window.dispatchEvent(new Event('resize'))
  expect(onResize).toHaveBeenCalledTimes(2)
  expect(onResize).toHaveBeenLastCalledWith([{contentRect: resized}])

  unmount()
  window.dispatchEvent(new Event('resize'))
  expect(onResize).toHaveBeenCalledTimes(2)
})
