import {renderHook, act} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {useSelectionState} from '../useSelectionState'

describe('useSelectionState', () => {
  it('single-select replaces the previous selection', () => {
    const {result} = renderHook(() => useSelectionState({selectionVariant: 'single'}))

    act(() => result.current.toggle('a'))
    expect([...result.current.selectedKeys]).toEqual(['a'])

    act(() => result.current.toggle('b'))
    expect([...result.current.selectedKeys]).toEqual(['b'])
  })

  it('single-select toggles off when re-selected', () => {
    const {result} = renderHook(() => useSelectionState({selectionVariant: 'single'}))
    act(() => result.current.toggle('a'))
    act(() => result.current.toggle('a'))
    expect(result.current.selectedKeys.size).toBe(0)
  })

  it('multi-select accumulates and removes keys', () => {
    const {result} = renderHook(() => useSelectionState({selectionVariant: 'multiple'}))
    act(() => result.current.toggle('a'))
    act(() => result.current.toggle('b'))
    expect([...result.current.selectedKeys].sort()).toEqual(['a', 'b'])

    act(() => result.current.toggle('a'))
    expect([...result.current.selectedKeys]).toEqual(['b'])
  })

  it('isSelected reflects membership; clear empties', () => {
    const {result} = renderHook(() => useSelectionState({selectionVariant: 'multiple', defaultSelectedKeys: ['x']}))
    expect(result.current.isSelected('x')).toBe(true)
    act(() => result.current.clear())
    expect(result.current.selectedKeys.size).toBe(0)
  })

  it('fires onSelectionChange', () => {
    const onSelectionChange = vi.fn()
    const {result} = renderHook(() => useSelectionState({onSelectionChange}))
    act(() => result.current.toggle('a'))
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['a']))
  })

  it('supports a controlled selection', () => {
    const onSelectionChange = vi.fn()
    const {result, rerender} = renderHook(({keys}) => useSelectionState({selectedKeys: keys, onSelectionChange}), {
      initialProps: {keys: ['a'] as string[]},
    })
    expect(result.current.isSelected('a')).toBe(true)

    // toggling does not mutate internal state when controlled, but notifies
    act(() => result.current.toggle('b'))
    expect(onSelectionChange).toHaveBeenCalled()
    expect(result.current.isSelected('b')).toBe(false)

    rerender({keys: ['a', 'b']})
    expect(result.current.isSelected('b')).toBe(true)
  })
})
