import React, {startTransition} from 'react'
import useSafeTimeout from '../hooks/useSafeTimeout'
import {getAccessibleName} from './shared'
import {useTreeItemCache} from './useTreeItemCache'

type TypeaheadOptions = {
  containerRef: React.RefObject<HTMLElement>
  onFocusChange: (element: Element) => void
}

export function useTypeahead({containerRef, onFocusChange}: TypeaheadOptions) {
  const searchValue = React.useRef('')
  const timeoutRef = React.useRef(0)
  const onFocusChangeRef = React.useRef(onFocusChange)
  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()
  const {getTreeItems} = useTreeItemCache(containerRef)

  // Update the ref when the callback changes
  React.useEffect(() => {
    onFocusChangeRef.current = onFocusChange
  }, [onFocusChange])

  // Focus the closest element that matches the search value
  const focusSearchValue = React.useCallback(
    (searchValue: string) => {
      // Don't change focus if the search value is empty
      if (!searchValue) return

      if (!containerRef.current) return

      // PERFORMANCE: Use cached tree items instead of querySelectorAll on every keypress
      const elements = getTreeItems()

      // Get the index of active element
      const activeIndex = elements.findIndex(element => element === document.activeElement)

      // Wrap the array elements such that the active descendant is at the beginning
      let sortedElements = wrapArray(elements, activeIndex)

      // Remove the active descendant from the beginning of the array
      // when the user initiates a new search
      if (searchValue.length === 1) {
        sortedElements = sortedElements.slice(1)
      }

      // Find the first element that matches the search value
      const nextElement = sortedElements.find(element => {
        const name = getAccessibleName(element).toLowerCase()
        return name.startsWith(searchValue.toLowerCase())
      })

      // If a match is found, focus it
      if (nextElement) {
        onFocusChangeRef.current(nextElement)
      }
    },
    [containerRef, getTreeItems],
  )

  // Update the search value when the user types
  React.useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    function onKeyDown(event: KeyboardEvent) {
      // Ignore key presses that don't produce a character value
      if (!event.key || event.key.length > 1 || event.key === ' ') return

      // Ignore key presses that occur with a modifier
      if (event.ctrlKey || event.altKey || event.metaKey) return

      // Update the existing search value with the new key press
      searchValue.current += event.key
      // Defer the expensive search operation to avoid blocking user input
      startTransition(() => {
        focusSearchValue(searchValue.current)
      })

      // Reset the timeout
      safeClearTimeout(timeoutRef.current)
      timeoutRef.current = safeSetTimeout(() => (searchValue.current = ''), 300)

      // Prevent default behavior
      event.preventDefault()
      event.stopPropagation()
    }

    container.addEventListener('keydown', onKeyDown)
    return () => container.removeEventListener('keydown', onKeyDown)
  }, [containerRef, focusSearchValue, safeClearTimeout, safeSetTimeout])
}

/**
 * Wraps an array around itself at a given start index
 *
 * @example
 * wrapArray(['a', 'b', 'c', 'd'], 2) // ['c', 'd', 'a', 'b']
 */
function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length])
}
