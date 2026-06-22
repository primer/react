import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {CharacterCounter} from '../character-counter'

describe('CharacterCounter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call onCountUpdate with correct values when under limit', () => {
    const onCountUpdate = vi.fn()
    const onScreenReaderAnnounce = vi.fn()

    const counter = new CharacterCounter({
      onCountUpdate,
      onScreenReaderAnnounce,
    })

    counter.updateCharacterCount(5, 10)

    expect(onCountUpdate).toHaveBeenCalledWith(5, false, '5 characters remaining')
  })

  it('should call onCountUpdate with correct values when over limit', () => {
    const onCountUpdate = vi.fn()
    const onScreenReaderAnnounce = vi.fn()

    const counter = new CharacterCounter({
      onCountUpdate,
      onScreenReaderAnnounce,
    })

    counter.updateCharacterCount(15, 10)

    expect(onCountUpdate).toHaveBeenCalledWith(5, true, '5 characters over')
  })

  it('should use singular "character" when count is 1', () => {
    const onCountUpdate = vi.fn()
    const onScreenReaderAnnounce = vi.fn()

    const counter = new CharacterCounter({
      onCountUpdate,
      onScreenReaderAnnounce,
    })

    counter.updateCharacterCount(9, 10)

    expect(onCountUpdate).toHaveBeenCalledWith(1, false, '1 character remaining')
  })

  it('should use singular "character" when over by 1', () => {
    const onCountUpdate = vi.fn()
    const onScreenReaderAnnounce = vi.fn()

    const counter = new CharacterCounter({
      onCountUpdate,
      onScreenReaderAnnounce,
    })

    counter.updateCharacterCount(11, 10)

    expect(onCountUpdate).toHaveBeenCalledWith(1, true, '1 character over')
  })

  it('should not announce to screen reader on initial load', () => {
    const onCountUpdate = vi.fn()
    const onScreenReaderAnnounce = vi.fn()

    const counter = new CharacterCounter({
      onCountUpdate,
      onScreenReaderAnnounce,
    })

    counter.updateCharacterCount(5, 10)

    // Fast-forward time
    vi.runAllTimers()

    expect(onScreenReaderAnnounce).not.toHaveBeenCalled()
  })

  it('should announce to screen reader after first update', () => {
    const onCountUpdate = vi.fn()
    const onScreenReaderAnnounce = vi.fn()

    const counter = new CharacterCounter({
      onCountUpdate,
      onScreenReaderAnnounce,
    })

    // First update (initial load)
    counter.updateCharacterCount(5, 10)
    vi.runAllTimers()
    expect(onScreenReaderAnnounce).not.toHaveBeenCalled()

    // Second update (user typing)
    counter.updateCharacterCount(6, 10)
    vi.runAllTimers()
    expect(onScreenReaderAnnounce).toHaveBeenCalledWith('4 characters remaining')
  })

  it('should debounce screen reader announcements', () => {
    const onCountUpdate = vi.fn()
    const onScreenReaderAnnounce = vi.fn()

    const counter = new CharacterCounter({
      onCountUpdate,
      onScreenReaderAnnounce,
    })

    // Initial load
    counter.updateCharacterCount(0, 10)
    vi.runAllTimers()

    // Multiple rapid updates
    counter.updateCharacterCount(1, 10)
    counter.updateCharacterCount(2, 10)
    counter.updateCharacterCount(3, 10)

    // Should only announce once with the last value after debounce
    vi.runAllTimers()
    expect(onScreenReaderAnnounce).toHaveBeenCalledTimes(1)
    expect(onScreenReaderAnnounce).toHaveBeenCalledWith('7 characters remaining')
  })

  it('should clean up timeout on cleanup', () => {
    const onCountUpdate = vi.fn()
    const onScreenReaderAnnounce = vi.fn()

    const counter = new CharacterCounter({
      onCountUpdate,
      onScreenReaderAnnounce,
    })

    // Initial load
    counter.updateCharacterCount(0, 10)

    // User types
    counter.updateCharacterCount(5, 10)

    // Cleanup before timer fires
    counter.cleanup()
    vi.runAllTimers()

    // Should not announce because cleanup was called
    expect(onScreenReaderAnnounce).not.toHaveBeenCalled()
  })

  it('should handle exactly at limit', () => {
    const onCountUpdate = vi.fn()
    const onScreenReaderAnnounce = vi.fn()

    const counter = new CharacterCounter({
      onCountUpdate,
      onScreenReaderAnnounce,
    })

    counter.updateCharacterCount(10, 10)

    expect(onCountUpdate).toHaveBeenCalledWith(0, false, '0 characters remaining')
  })
})
