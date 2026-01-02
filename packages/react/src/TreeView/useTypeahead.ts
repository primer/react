import React, {useDeferredValue, useState, useEffect} from 'react'
import useSafeTimeout from '../hooks/useSafeTimeout'
import {getAccessibleName} from './shared'
import {useTreeItemCache} from './useTreeItemCache'

type TypeaheadOptions = {
  containerRef: React.RefObject<HTMLElement>
  onFocusChange: (element: Element) => void
}

export function useTypeahead({containerRef, onFocusChange}: TypeaheadOptions) {
  // Use state instead of ref so React can track changes
  const [searchValue, setSearchValue] = useState('')
  // Defer the search value for expensive operations
  const deferredSearchValue = useDeferredValue(searchValue)

  const timeoutRef = React.useRef(0)
  const onFocusChangeRef = React.useRef(onFocusChange)
  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()
  const {getTreeItems} = useTreeItemCache(containerRef)

  // Update the ref when the callback changes
  useEffect(() => {
    onFocusChangeRef.current = onFocusChange
  }, [onFocusChange])

  // Focus logic runs when deferred value changes
  useEffect(() => {
    if (!deferredSearchValue || !containerRef.current) return

    const elements = getTreeItems()
    const activeIndex = elements.findIndex(element => element === document.activeElement)
    let sortedElements = wrapArray(elements, activeIndex)

    // Remove the active descendant from the beginning when starting a new search
    if (deferredSearchValue.length === 1) {
      sortedElements = sortedElements.slice(1)
    }

    const nextElement = sortedElements.find(element => {
      const name = getAccessibleName(element).toLowerCase()
      return name.startsWith(deferredSearchValue.toLowerCase())
    })

    if (nextElement) {
      onFocusChangeRef.current(nextElement)
    }
  }, [deferredSearchValue, containerRef, getTreeItems])

  // Keydown handler updates state immediately for responsive UI
  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    function onKeyDown(event: KeyboardEvent) {
      // Ignore key presses that don't produce a character value
      if (!event.key || event.key.length > 1 || event.key === ' ') return

      // Ignore key presses that occur with a modifier
      if (event.ctrlKey || event.altKey || event.metaKey) return

      // Update state immediately - React will defer the expensive focus operation
      setSearchValue(prev => prev + event.key)

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
