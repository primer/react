import {renderHook} from '@testing-library/react'
import {describe, expect, it, vi, beforeEach} from 'vitest'
import {useScrollLock} from '../useScrollLock'

describe('useScrollLock', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  })

  it('sets overflow hidden on body when enabled', () => {
    renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('removes overflow hidden when disabled', () => {
    const {rerender} = renderHook(({enabled}) => useScrollLock(enabled), {
      initialProps: {enabled: true},
    })

    expect(document.body.style.overflow).toBe('hidden')

    rerender({enabled: false})
    expect(document.body.style.overflow).toBe('')
  })

  it('restores body styles on unmount', () => {
    const {unmount} = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('handles nested locks — only removes on last unlock', () => {
    const hook1 = renderHook(() => useScrollLock(true))
    const hook2 = renderHook(() => useScrollLock(true))

    expect(document.body.style.overflow).toBe('hidden')

    hook1.unmount()
    // Still locked because hook2 is active
    expect(document.body.style.overflow).toBe('hidden')

    hook2.unmount()
    // Now unlocked
    expect(document.body.style.overflow).toBe('')
  })

  it('does not lock when initially disabled', () => {
    renderHook(() => useScrollLock(false))
    expect(document.body.style.overflow).toBe('')
  })

  it('compensates for scrollbar width', () => {
    // In browser test env scrollbar width is 0, so paddingRight is '0px'
    renderHook(() => useScrollLock(true))
    const px = parseInt(document.body.style.paddingRight, 10)
    expect(px).toBe(0)
  })
})
