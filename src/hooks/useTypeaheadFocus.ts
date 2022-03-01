import React from 'react'
import {iterateFocusableElements} from '@primer/behaviors/utils'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'

export const TYPEAHEAD_TIMEOUT = 1000

export const useTypeaheadFocus = (open: boolean, providedRef?: React.RefObject<HTMLElement>) => {
  const containerRef = useProvidedRefOrCreate(providedRef)

  React.useEffect(() => {
    if (!open || !containerRef.current) return
    const container = containerRef.current

    let query = ''
    let timeout: number | undefined

    const handler = (event: KeyboardEvent) => {
      // skip if a TextInput has focus
      const activeElement = document.activeElement as HTMLElement
      if (activeElement.tagName === 'INPUT') return

      // skip if used with modifier to preserve shortcuts like ⌘ + F
      const hasModifier = event.ctrlKey || event.altKey || event.metaKey
      if (hasModifier) return

      if (query.length && event.code === 'Space') {
        // prevent the menu from selecting an option
        event.preventDefault()
      }

      // skip if it's not a alphabet key
      else if (!isAlphabetKey(event)) {
        query = '' // reset the typeahead query
        return
      }

      query += event.key.toLowerCase()

      // if this is a typeahead event, don't propagate outside of menu
      event.stopPropagation()

      // reset the query after timeout
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => (query = ''), TYPEAHEAD_TIMEOUT)

      let elementToFocus: HTMLElement | undefined

      const focusableItems = [...iterateFocusableElements(container)]

      const focusNextMatch = () => {
        const itemsStartingWithKey = focusableItems.filter(item => {
          return item.textContent?.toLowerCase().startsWith(query)
        })

        const currentActiveIndex = itemsStartingWithKey.indexOf(activeElement)

        // If the last element is already selected, cycle through the list
        if (currentActiveIndex === itemsStartingWithKey.length - 1) {
          elementToFocus = itemsStartingWithKey[0]
        } else {
          elementToFocus = itemsStartingWithKey.find((item, index) => {
            return index > currentActiveIndex
          })
        }
        elementToFocus?.focus()
      }

      // Single character in query: Jump to the next match
      if (query.length === 1) return focusNextMatch()

      // 2 characters in query but the user is pressing
      // the same key, jump to the next match
      if (query.length === 2 && query[0] === query[1]) {
        query = query[0] // remove the second key
        return focusNextMatch()
      }

      // More > 1 characters in query
      // If active element satisfies the query stay there,
      if (activeElement.textContent?.toLowerCase().startsWith(query)) return
      // otherwise move to the next one that does.
      return focusNextMatch()
    }

    container.addEventListener('keydown', handler)
    return () => container.removeEventListener('keydown', handler)
  }, [open, containerRef])

  const isAlphabetKey = (event: KeyboardEvent) => {
    return event.key.length === 1 && /[a-z\d]/i.test(event.key)
  }

  return {containerRef}
}
