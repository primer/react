import React from 'react'
import useSafeTimeout from '../hooks/useSafeTimeout'

type TypeaheadOptions = {
  containerRef: React.RefObject<HTMLElement>
  onFocusChange: (element: Element) => void
}

export function useTypeahead({containerRef, onFocusChange}: TypeaheadOptions) {
  const [searchValue, setSearchValue] = React.useState('')
  const timeoutRef = React.useRef(0)
  const onFocusChangeRef = React.useRef(onFocusChange)
  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()

  // Update the ref when the callback changes
  React.useEffect(() => {
    onFocusChangeRef.current = onFocusChange
  }, [onFocusChange])

  // Update the search value when the user types
  React.useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    function onKeyDown(event: KeyboardEvent) {
      // Ignore key presses that don't produce a character value
      if (!event.key || event.key.length > 1) return

      // Ignore key presses that occur with a modifier
      if (event.ctrlKey || event.altKey || event.metaKey) return

      // Update the existing search value with the new key press
      setSearchValue(value => value + event.key)

      // Reset the timeout
      safeClearTimeout(timeoutRef.current)
      timeoutRef.current = safeSetTimeout(() => setSearchValue(''), 300)

      // Prevent default behavior
      event.preventDefault()
      event.stopPropagation()
    }

    container.addEventListener('keydown', onKeyDown)
    return () => container.removeEventListener('keydown', onKeyDown)
  }, [containerRef, safeClearTimeout, safeSetTimeout])

  // Update focus when the search value changes
  React.useEffect(() => {
    // Don't change focus if the search value is empty
    if (!searchValue) return

    if (!containerRef.current) return
    const container = containerRef.current

    // Get focusable elements
    const elements = Array.from(container.querySelectorAll('[role="treeitem"]'))
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
  }, [searchValue, containerRef])
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
