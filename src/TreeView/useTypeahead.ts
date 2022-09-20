import React from 'react'

type TypeaheadOptions = {
  containerRef: React.RefObject<HTMLElement>
  onFocusChange: (element: Element) => void
}

export function useTypeahead({containerRef, onFocusChange}: TypeaheadOptions) {
  const [searchValue, setSearchValue] = React.useState('')
  const timeoutRef = React.useRef(0)

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      // Ignore key presses that don't produce a character value
      if (!event.key || event.key.length > 1) return

      // Ignore key presses that occur with a modifier
      if (event.ctrlKey || event.altKey || event.metaKey) return

      // Combine the existing search value with the new key press
      const newSearchValue = searchValue + event.key

      // Get focusable elements
      const elements = Array.from(containerRef.current?.querySelectorAll('[role="treeitem"]') ?? [])
        // Filter out collapsed items
        .filter(element => !element.parentElement?.closest('[role=treeitem][aria-expanded=false]'))

      // Get the index of active descendant
      const activeDescendantIndex = elements.findIndex(
        element => element.id === containerRef.current?.getAttribute('aria-activedescendant')
      )

      // Wrap the array elements such that the active descendant is at the beginning
      let sortedElements = wrapArray(elements, activeDescendantIndex)

      // Remove the active descendant from the beginning of the array
      // when the user initiates a new search
      if (newSearchValue.length === 1) {
        sortedElements = sortedElements.slice(1)
      }

      // Find the first element that matches the search value
      const nextElement = sortedElements.find(element => {
        const name = getAccessibleName(element).toLowerCase()
        return name.startsWith(newSearchValue.toLowerCase())
      })

      // If a match is found, focus it
      if (nextElement) {
        onFocusChange(nextElement)
      }

      // Update the search value
      setSearchValue(newSearchValue)

      // Reset timer
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => setSearchValue(''), 300)

      // Prevent default behavior
      event.preventDefault()
      event.stopPropagation()
    },
    [containerRef, searchValue, onFocusChange]
  )

  React.useEffect(() => {
    const container = containerRef.current

    if (!container) return

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [containerRef, handleKeyDown])
}

/**
 * Returns the accessible name of an element
 */
function getAccessibleName(element: Element) {
  const label = element.getAttribute('aria-label')
  const labelledby = element.getAttribute('aria-labelledby')

  if (label) return label
  if (labelledby) return document.getElementById(labelledby)?.textContent ?? ''
  return element.textContent ?? ''
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
