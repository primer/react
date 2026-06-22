import {renderHook, act} from '@testing-library/react'
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest'
import {useCharacterCountAnnouncement} from '../useCharacterCountAnnouncement'
import {SCREEN_READER_DELAY} from '../character-counter'

describe('useCharacterCountAnnouncement', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with an empty message', () => {
    const {result} = renderHook(() => useCharacterCountAnnouncement(100))
    expect(result.current.screenReaderMessage).toBe('')
  })

  it('announces the remaining count after the debounce delay', async () => {
    const {result} = renderHook(() => useCharacterCountAnnouncement(100))

    act(() => {
      result.current.announce(5)
    })

    // Debounced: nothing is announced until the delay elapses.
    expect(result.current.screenReaderMessage).toBe('')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SCREEN_READER_DELAY)
    })

    expect(result.current.screenReaderMessage).toBe('95 characters remaining')
  })

  it('debounces rapid updates and only announces the latest', async () => {
    const {result} = renderHook(() => useCharacterCountAnnouncement(100))

    act(() => {
      result.current.announce(1)
      result.current.announce(2)
      result.current.announce(3)
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SCREEN_READER_DELAY)
    })

    expect(result.current.screenReaderMessage).toBe('97 characters remaining')
  })

  it('announces again on a subsequent change', async () => {
    const {result} = renderHook(() => useCharacterCountAnnouncement(100))

    act(() => {
      result.current.announce(5)
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SCREEN_READER_DELAY)
    })
    expect(result.current.screenReaderMessage).toBe('95 characters remaining')

    act(() => {
      result.current.announce(10)
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SCREEN_READER_DELAY)
    })
    expect(result.current.screenReaderMessage).toBe('90 characters remaining')
  })

  it('announces when over the limit', async () => {
    const {result} = renderHook(() => useCharacterCountAnnouncement(10))

    act(() => {
      result.current.announce(13)
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SCREEN_READER_DELAY)
    })

    expect(result.current.screenReaderMessage).toBe('3 characters over')
  })

  it('does not announce when there is no character limit', async () => {
    const {result} = renderHook(() => useCharacterCountAnnouncement(undefined))

    act(() => {
      result.current.announce(5)
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SCREEN_READER_DELAY)
    })

    expect(result.current.screenReaderMessage).toBe('')
  })

  it('cancels a pending announcement on unmount', async () => {
    const {result, unmount} = renderHook(() => useCharacterCountAnnouncement(100))

    act(() => {
      result.current.announce(5)
    })

    unmount()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SCREEN_READER_DELAY)
    })

    expect(result.current.screenReaderMessage).toBe('')
  })
})
