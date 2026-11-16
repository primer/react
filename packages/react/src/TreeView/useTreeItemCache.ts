import React from 'react'

/**
 * A hook that caches tree items to avoid expensive querySelectorAll calls on every keypress.
 * The cache is invalidated when the tree structure changes (via MutationObserver).
 *
 * PERFORMANCE: This is critical for INP because querySelectorAll('[role="treeitem"]')
 * on large trees can take 10-50ms, which directly blocks user input response.
 *
 * Note: useRovingTabIndex also uses querySelectorAll for Home/End/PageUp/PageDown navigation,
 * but those are infrequent single keypresses. Typeahead fires on every character typed,
 * making it the priority optimization target.
 */
export function useTreeItemCache(containerRef: React.RefObject<HTMLElement>) {
  // Use null to distinguish "not cached" from "cached as empty array"
  const cacheRef = React.useRef<HTMLElement[] | null>(null)

  // Invalidate cache when tree structure changes
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Watch for structural changes (items added/removed)
    // Note: We only watch childList changes, not aria-expanded.
    // aria-expanded changes don't affect which items exist, only their visibility.
    // The caller (useTypeahead, useRovingTabIndex) handles visibility filtering.
    const observer = new MutationObserver(mutations => {
      // Only invalidate on structural changes (childList) or role attribute changes
      // Ignore aria-expanded changes as they don't affect the set of treeitems
      const hasStructuralChange = mutations.some(
        mutation =>
          mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'role'),
      )
      if (hasStructuralChange) {
        cacheRef.current = null
      }
    })
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['role'],
    })

    // Clear cache on mount to ensure fresh query
    cacheRef.current = null

    return () => observer.disconnect()
  }, [containerRef])

  const getTreeItems = React.useCallback((): HTMLElement[] => {
    const container = containerRef.current
    if (!container) return []

    // Return cached items if valid (null means not cached, [] means cached as empty)
    if (cacheRef.current !== null) {
      return cacheRef.current
    }

    // Rebuild cache
    cacheRef.current = Array.from(container.querySelectorAll('[role="treeitem"]')) as HTMLElement[]
    return cacheRef.current
  }, [containerRef])

  return {getTreeItems}
}
