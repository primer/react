import React from 'react'

/**
 * A hook that caches tree items to avoid expensive querySelectorAll calls on every keypress.
 * The cache is invalidated when the tree structure changes (via MutationObserver).
 *
 * PERFORMANCE: This is critical for INP because querySelectorAll('[role="treeitem"]')
 * on large trees can take 10-50ms, which directly blocks user input response.
 */
export function useTreeItemCache(containerRef: React.RefObject<HTMLElement>) {
  const cacheRef = React.useRef<HTMLElement[]>([])

  // Invalidate cache when tree structure changes
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Watch for structural changes (items added/removed, expanded/collapsed)
    const observer = new MutationObserver(() => {
      cacheRef.current = []
    })
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-expanded', 'role'],
    })

    // Clear cache on mount to ensure fresh query
    cacheRef.current = []

    return () => observer.disconnect()
  }, [containerRef])

  const getTreeItems = React.useCallback((): HTMLElement[] => {
    const container = containerRef.current
    if (!container) return []

    // Return cached items if valid
    if (cacheRef.current.length > 0) {
      return cacheRef.current
    }

    // Rebuild cache
    cacheRef.current = Array.from(container.querySelectorAll('[role="treeitem"]')) as HTMLElement[]
    return cacheRef.current
  }, [containerRef])

  return {getTreeItems}
}
