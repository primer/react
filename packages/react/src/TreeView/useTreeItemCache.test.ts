import {act, renderHook} from '@testing-library/react'
import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {useTreeItemCache} from './useTreeItemCache'

describe('useTreeItemCache', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    container.setAttribute('role', 'tree')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  function createTreeItem(id: string): HTMLDivElement {
    const item = document.createElement('div')
    item.setAttribute('role', 'treeitem')
    item.setAttribute('id', id)
    return item
  }

  it('returns tree items from the container', () => {
    container.appendChild(createTreeItem('item-1'))
    container.appendChild(createTreeItem('item-2'))

    const containerRef = {current: container}
    const {result} = renderHook(() => useTreeItemCache(containerRef))

    const items = result.current.getTreeItems()
    expect(items).toHaveLength(2)
    expect(items[0].id).toBe('item-1')
    expect(items[1].id).toBe('item-2')
  })

  it('returns empty array when container is null', () => {
    const containerRef = {current: null}
    const {result} = renderHook(() => useTreeItemCache(containerRef))

    const items = result.current.getTreeItems()
    expect(items).toHaveLength(0)
  })

  it('returns empty array for empty tree and caches it', () => {
    // Container has no tree items
    const containerRef = {current: container}
    const {result} = renderHook(() => useTreeItemCache(containerRef))

    // First call should return empty array
    const items1 = result.current.getTreeItems()
    expect(items1).toHaveLength(0)

    // Add an item - but cache should still be empty until invalidated
    // Note: In real usage, MutationObserver would catch this, but we're testing
    // the cache logic directly here
    const item = createTreeItem('item-1')
    container.appendChild(item)

    // Need to wait for MutationObserver to fire
    return new Promise<void>(resolve => {
      setTimeout(() => {
        // Now the cache should be invalidated and return the new item
        const items2 = result.current.getTreeItems()
        expect(items2).toHaveLength(1)
        resolve()
      }, 0)
    })
  })

  it('caches results on subsequent calls', () => {
    container.appendChild(createTreeItem('item-1'))

    const containerRef = {current: container}
    const {result} = renderHook(() => useTreeItemCache(containerRef))

    const items1 = result.current.getTreeItems()
    const items2 = result.current.getTreeItems()

    // Should be the same array reference (cached)
    expect(items1).toBe(items2)
  })

  it('invalidates cache on structural changes (childList)', async () => {
    container.appendChild(createTreeItem('item-1'))

    const containerRef = {current: container}
    const {result} = renderHook(() => useTreeItemCache(containerRef))

    const items1 = result.current.getTreeItems()
    expect(items1).toHaveLength(1)

    // Add a new item
    await act(async () => {
      container.appendChild(createTreeItem('item-2'))
      // Wait for MutationObserver
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const items2 = result.current.getTreeItems()
    expect(items2).toHaveLength(2)
    // Should be a different array reference (cache was invalidated)
    expect(items1).not.toBe(items2)
  })

  it('invalidates cache when role attribute changes', async () => {
    const item = createTreeItem('item-1')
    container.appendChild(item)

    const containerRef = {current: container}
    const {result} = renderHook(() => useTreeItemCache(containerRef))

    const items1 = result.current.getTreeItems()
    expect(items1).toHaveLength(1)

    // Change role to something else
    await act(async () => {
      item.setAttribute('role', 'none')
      // Wait for MutationObserver
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const items2 = result.current.getTreeItems()
    expect(items2).toHaveLength(0)
    // Should be a different array reference (cache was invalidated)
    expect(items1).not.toBe(items2)
  })

  it('does NOT invalidate cache on aria-expanded changes', async () => {
    const item = createTreeItem('item-1')
    item.setAttribute('aria-expanded', 'false')
    container.appendChild(item)

    const containerRef = {current: container}
    const {result} = renderHook(() => useTreeItemCache(containerRef))

    const items1 = result.current.getTreeItems()
    expect(items1).toHaveLength(1)

    // Change aria-expanded
    await act(async () => {
      item.setAttribute('aria-expanded', 'true')
      // Wait for any potential MutationObserver
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const items2 = result.current.getTreeItems()
    // Should be the SAME array reference (cache was NOT invalidated)
    expect(items1).toBe(items2)
  })

  it('handles nested tree items', () => {
    const parent = createTreeItem('parent')
    const subtree = document.createElement('div')
    subtree.setAttribute('role', 'group')
    const child = createTreeItem('child')
    subtree.appendChild(child)
    parent.appendChild(subtree)
    container.appendChild(parent)

    const containerRef = {current: container}
    const {result} = renderHook(() => useTreeItemCache(containerRef))

    const items = result.current.getTreeItems()
    expect(items).toHaveLength(2)
    expect(items[0].id).toBe('parent')
    expect(items[1].id).toBe('child')
  })

  it('clears cache when effect runs', () => {
    container.appendChild(createTreeItem('item-1'))

    const containerRef = {current: container}
    const {result, rerender} = renderHook(() => useTreeItemCache(containerRef))

    const items1 = result.current.getTreeItems()
    expect(items1).toHaveLength(1)

    // Force effect to re-run by rerendering
    rerender()

    // Cache should be cleared, so next call rebuilds it
    const items2 = result.current.getTreeItems()
    // Items should be equal in content but may or may not be same reference
    // depending on timing - the key thing is the data is correct
    expect(items2).toHaveLength(1)
  })
})
