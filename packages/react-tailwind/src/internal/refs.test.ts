import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {mergeRefs} from './refs'

describe('mergeRefs', () => {
  it('assigns every ref and forwards callback ref cleanups', () => {
    const objectRef = React.createRef<string>()
    const plainCallback = vi.fn()
    const cleanup = vi.fn()
    const callbackWithCleanup = vi.fn(() => cleanup)

    const merged = mergeRefs(objectRef, plainCallback, callbackWithCleanup, undefined)
    expect(merged('node')).toBeUndefined()
    expect(objectRef.current).toBe('node')
    expect(plainCallback).toHaveBeenCalledWith('node')
    expect(callbackWithCleanup).toHaveBeenCalledWith('node')

    expect(merged(null)).toBeUndefined()
    expect(objectRef.current).toBeNull()
    expect(plainCallback).toHaveBeenLastCalledWith(null)
    expect(cleanup).toHaveBeenCalledOnce()
    expect(callbackWithCleanup).toHaveBeenCalledTimes(1)
  })

  it('runs cleanups only for the attachment they belong to', () => {
    const firstCleanup = vi.fn()
    const secondCleanup = vi.fn()
    const callback = vi.fn().mockReturnValueOnce(firstCleanup).mockReturnValueOnce(secondCleanup)
    const merged = mergeRefs(callback)

    merged('first')
    merged(null)
    merged('second')
    merged(null)

    expect(firstCleanup).toHaveBeenCalledOnce()
    expect(secondCleanup).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).not.toHaveBeenCalledWith(null)
  })
})
