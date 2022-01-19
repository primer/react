import React from 'react'
import {iterateFocusableElements} from '@primer/behaviors/utils'

type Gesture = 'anchor-click' | 'anchor-key-press'
type Callback = (gesture: Gesture, event?: React.KeyboardEvent<HTMLElement>) => unknown

export const useMenuFocus = (open: boolean, onOpen?: Callback) => {
  const containerRef = React.createRef<HTMLDivElement>()
  const [openingKey, setOpeningKey] = React.useState<string | undefined>(undefined)

  const openWithFocus: Callback = (gesture, event) => {
    if (gesture === 'anchor-key-press' && event) setOpeningKey(event.code)
    else setOpeningKey(undefined)
    if (typeof onOpen === 'function') onOpen(gesture, event)
  }

  // Handle the first element to focus
  React.useEffect(() => {
    if (!open) return
    if (!openingKey || !containerRef.current) return

    const iterable = iterateFocusableElements(containerRef.current)
    if (['ArrowDown', 'Space', 'Enter'].includes(openingKey)) {
      const firstElement = iterable.next().value
      /** We push imperative focus to the next tick to prevent React's batching */
      setTimeout(() => firstElement?.focus())
    } else if (['ArrowUp'].includes(openingKey)) {
      const elements = [...iterable]
      const lastElement = elements[elements.length - 1]
      setTimeout(() => lastElement.focus())
    }
  }, [open, openingKey, containerRef])

  // Handle focus based on the first letter
  React.useEffect(() => {
    if (!open) return

    const container = containerRef.current
    if (!container) return

    const handler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isAlphabetKey(event)) return
      const letter = event.key.toLowerCase()

      const activeElement = document.activeElement as HTMLElement
      if (activeElement.tagName === 'INPUT') return

      const focusableItems = [...iterateFocusableElements(container)]
      const itemsStartingWithKey = focusableItems.filter(item => {
        return item.textContent?.toLowerCase().startsWith(letter)
      })

      let elementToFocus: HTMLElement | undefined

      const currentActiveIndex = itemsStartingWithKey.indexOf(activeElement)

      // If the last element is already selected, cycle through the list
      if (currentActiveIndex === itemsStartingWithKey.length - 1) elementToFocus = itemsStartingWithKey[0]
      else {
        elementToFocus = itemsStartingWithKey.find((item, index) => {
          return index > currentActiveIndex
        })
      }

      elementToFocus?.focus()
    }

    container.addEventListener('keydown', handler)
    return () => container.removeEventListener('keydown', handler)
  }, [open, containerRef])

  return {containerRef, openWithFocus}
}

const isAlphabetKey = (event: React.KeyboardEvent<HTMLElement>) => {
  return /[a-z]/i.test(event.key)
}
