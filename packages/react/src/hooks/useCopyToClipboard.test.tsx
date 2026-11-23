import {act, renderHook} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {useCopyToClipboard} from './useCopyToClipboard'

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('waits for the write before confirming and resets after two seconds', async () => {
    const write = Promise.withResolvers<void>()
    vi.mocked(navigator.clipboard.writeText).mockReturnValue(write.promise)
    const {result} = renderHook(() => useCopyToClipboard())
    let copy: Promise<void>
    act(() => {
      copy = result.current.copy('hello')
    })
    expect(result.current.isCopying).toBe(true)
    expect(result.current.copied).toBe(false)
    await act(async () => {
      write.resolve()
      await copy
    })
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello')
    expect(result.current.copied).toBe(true)
    expect(result.current.isCopying).toBe(false)
    act(() => vi.advanceTimersByTime(1999))
    expect(result.current.copied).toBe(true)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.copied).toBe(false)
  })

  it('rejects failures and clears the error on retry', async () => {
    const error = new Error('Permission denied')
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(error)
    const {result} = renderHook(() => useCopyToClipboard({resetDelayMs: 100}))
    await act(async () => {
      await expect(result.current.copy('hello')).rejects.toBe(error)
    })
    expect(result.current.error).toBe(error)
    expect(result.current.copied).toBe(false)
    expect(result.current.isCopying).toBe(false)
    await act(async () => {
      await result.current.copy('')
    })
    expect(result.current.error).toBeNull()
    expect(result.current.copied).toBe(true)
    act(() => vi.advanceTimersByTime(100))
    expect(result.current.copied).toBe(false)
  })

  it('restarts the confirmation duration after another copy', async () => {
    const {result} = renderHook(() => useCopyToClipboard())
    await act(async () => {
      await result.current.copy('first')
    })
    act(() => vi.advanceTimersByTime(1500))
    await act(async () => {
      await result.current.copy('second')
    })
    act(() => vi.advanceTimersByTime(1999))
    expect(result.current.copied).toBe(true)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.copied).toBe(false)
  })

  it('keeps the latest result when concurrent requests finish out of order', async () => {
    const first = Promise.withResolvers<void>()
    const second = Promise.withResolvers<void>()
    vi.mocked(navigator.clipboard.writeText).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
    const {result} = renderHook(() => useCopyToClipboard())
    let firstCopy: Promise<void>
    let secondCopy: Promise<void>
    act(() => {
      firstCopy = result.current.copy('first')
      secondCopy = result.current.copy('second')
    })
    await act(async () => {
      second.resolve()
      await secondCopy
    })
    await act(async () => {
      first.reject(new Error('Older request failed'))
      await expect(firstCopy).rejects.toThrow('Older request failed')
    })
    expect(result.current.copied).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('does not schedule confirmation after unmount', async () => {
    const write = Promise.withResolvers<void>()
    vi.mocked(navigator.clipboard.writeText).mockReturnValue(write.promise)
    const {result, unmount} = renderHook(() => useCopyToClipboard())
    let copy: Promise<void>
    act(() => {
      copy = result.current.copy('hello')
    })
    unmount()
    const timersBefore = vi.getTimerCount()
    await act(async () => {
      write.resolve()
      await copy
    })
    expect(vi.getTimerCount()).toBe(timersBefore)
  })
})
