// Announcements for FilteredActionList (and SelectPanel) based
// on https://github.com/github/multi-select-user-testing

import {announce} from '@primer/live-region-element'
import {useEffect, useRef} from 'react'
import type {FilteredActionListProps} from './FilteredActionListEntry'

const useFirstRender = () => {
  const firstRender = useRef(true)
  useEffect(() => {
    firstRender.current = false
  }, [])
  return firstRender.current
}

export const useAnnouncements = (
  items: FilteredActionListProps['items'],
  listContainerRef: React.RefObject<HTMLUListElement>,
  inputRef: React.RefObject<HTMLInputElement>,
) => {
  useEffect(
    function announceInitialFocus() {
      const listElement = listContainerRef.current

      const focusHandler = () => {
        // give @primer/behaviors a moment to apply active-descendant
        window.requestAnimationFrame(() => {
          const activeItemElement = listElement?.querySelector('[data-is-active-descendant]')
          if (listElement && activeItemElement?.textContent) {
            const activeItemIndex = Array.from(listElement.children).indexOf(activeItemElement)
            const activeItemText = items[activeItemIndex].text
            const selected = items[activeItemIndex].selected

            const announcementText = `
            Focus on filter text box and list of labels.
            Focused item, ${activeItemText}, ${selected ? 'selected' : 'not selected'}, ${activeItemIndex + 1} of ${
              items.length
            }
          `

            announce(announcementText, {delayMs: 500 /* we add a delay so that it does not interrupt user action */})
          }
        })
      }

      const inputElement = inputRef.current
      inputElement?.addEventListener('focus', focusHandler)
      return () => inputElement?.removeEventListener('focus', focusHandler)
    },
    [listContainerRef, inputRef, items],
  )

  const isFirstRender = useFirstRender()
  useEffect(
    function announceListUpdates() {
      if (isFirstRender) return // ignore on first render as announceInitialFocus will also announce
      const announcementText =
        items.length > 0 ? `List updated. Focused item, ${items[0].text}, 1 of ${items.length}` : 'No matching items.'
      announce(announcementText, {delayMs: 500 /* we add a delay so that it does not interrupt user action */})
    },
    [isFirstRender, items],
  )
}
