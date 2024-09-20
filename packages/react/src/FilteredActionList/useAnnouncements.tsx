// Announcements for FilteredActionList (and SelectPanel) based
// on https://github.com/github/multi-select-user-testing

import {announce} from '@primer/live-region-element'
import {useEffect, useRef} from 'react'
import type {FilteredActionListProps} from './FilteredActionListEntry'

// we add a delay so that it does not interrupt default screen reader announcement and queues after it
const delayMs = 500

const useFirstRender = () => {
  const firstRender = useRef(true)
  useEffect(() => {
    firstRender.current = false
  }, [])
  return firstRender.current
}

const getItemWithActiveDescendant = (
  listRef: React.RefObject<HTMLUListElement>,
  items: FilteredActionListProps['items'],
) => {
  const listElement = listRef.current
  const activeItemElement = listElement?.querySelector('[data-is-active-descendant]')

  if (!listElement || !activeItemElement?.textContent) return

  const optionElements = listElement.querySelectorAll('[role="option"]')

  const index = Array.from(optionElements).indexOf(activeItemElement)
  const activeItem = items[index]

  const text = activeItem.text
  const selected = activeItem.selected

  return {index, text, selected}
}

export const useAnnouncements = (
  items: FilteredActionListProps['items'],
  listContainerRef: React.RefObject<HTMLUListElement>,
  inputRef: React.RefObject<HTMLInputElement>,
) => {
  const liveRegion = document.querySelector('live-region')

  useEffect(
    function announceInitialFocus() {
      const focusHandler = () => {
        // give @primer/behaviors a moment to apply active-descendant
        window.requestAnimationFrame(() => {
          const activeItem = getItemWithActiveDescendant(listContainerRef, items)
          if (!activeItem) return
          const {index, text, selected} = activeItem

          const announcementText = [
            `Focus on filter text box and list of items`,
            `Focused item: ${text}`,
            `${selected ? 'selected' : 'not selected'}`,
            `${index + 1} of ${items.length}`,
          ].join(', ')
          announce(announcementText, {
            delayMs,
            from: liveRegion ? liveRegion : undefined, // announce will create a liveRegion if it doesn't find one
          })
        })
      }

      const inputElement = inputRef.current
      inputElement?.addEventListener('focus', focusHandler)
      return () => inputElement?.removeEventListener('focus', focusHandler)
    },
    [listContainerRef, inputRef, items, liveRegion],
  )

  const isFirstRender = useFirstRender()
  useEffect(
    function announceListUpdates() {
      if (isFirstRender) return // ignore on first render as announceInitialFocus will also announce

      liveRegion?.clear() // clear previous announcements

      if (items.length === 0) {
        announce('No matching items.', {delayMs})
        return
      }

      // give @primer/behaviors a moment to update active-descendant
      window.requestAnimationFrame(() => {
        const activeItem = getItemWithActiveDescendant(listContainerRef, items)
        if (!activeItem) return
        const {index, text, selected} = activeItem

        const announcementText = [
          `List updated`,
          `Focused item: ${text}`,
          `${selected ? 'selected' : 'not selected'}`,
          `${index + 1} of ${items.length}`,
        ].join(', ')

        announce(announcementText, {
          delayMs,
          from: liveRegion ? liveRegion : undefined, // announce will create a liveRegion if it doesn't find one
        })
      })
    },
    [isFirstRender, items, listContainerRef, liveRegion],
  )
}
