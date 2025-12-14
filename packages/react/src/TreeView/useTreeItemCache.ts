import React from 'react'

type TreeItemCache = {
  items: HTMLElement[]
  version: number
}

/**
 * A hook that caches tree items to avoid expensive querySelectorAll calls on every keypress.
 * The cache is invalidated when the tree structure changes (via MutationObserver).
 *
 * PERFORMANCE: This is critical for INP because querySelectorAll('[role="treeitem"]')
 * on large trees can take 10-50ms, which directly blocks user input response.
 */
export function useTreeItemCache(containerRef: React.RefObject<HTMLElement>) {
  const cacheRef = React.useRef<TreeItemCache>({items: [], version: 0})

  // Invalidate cache when tree structure changes
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const invalidateCache = () => {
      cacheRef.current.version++
    }

    // Watch for structural changes (items added/removed, expanded/collapsed)
    const observer = new MutationObserver(invalidateCache)
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-expanded', 'role'],
    })

    // Initial invalidation to ensure fresh cache on mount
    invalidateCache()

    return () => observer.disconnect()
  }, [containerRef])

  const getTreeItems = React.useCallback((): HTMLElement[] => {
    const container = containerRef.current
    if (!container) return []

    // Return cached items if cache is still valid
    const currentVersion = cacheRef.current.version
    if (cacheRef.current.items.length > 0 && cacheRef.current.version === currentVersion) {
      return cacheRef.current.items
    }

    // Rebuild cache
    const items = Array.from(container.querySelectorAll('[role="treeitem"]')) as HTMLElement[]
    cacheRef.current = {items, version: currentVersion}

    return items
  }, [containerRef])

  return {getTreeItems}
}
