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
            // TODO: This does not work with groups yet!
            const activeItemIndex = Array.from(listElement.children).indexOf(activeItemElement)
            const activeItemText = items[activeItemIndex].text
            const activeItemSelected = items[activeItemIndex].selected

            const announcementText = [
              `Focus on filter text box and list of labels`,
              `Focused item, ${activeItemText}`,
              `${activeItemSelected ? 'selected' : 'not selected'}`,
              `${activeItemIndex + 1} of ${items.length}`,
            ].join(', ')
            announce(announcementText, {delayMs})
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

      if (items.length === 0) {
        announce('No matching items.', {delayMs})
        return
      }

      const activeItemIndex = 0
      const activeItemText = items[activeItemIndex].text
      const activeItemSelected = items[activeItemIndex].selected

      const announcementText = [
        `List updated`,
        `Focused item, ${activeItemText}`,
        `${activeItemSelected ? 'selected' : 'not selected'}`,
        `${1} of ${items.length}`,
      ].join(', ')
      announce(announcementText, {delayMs})
    },
    [isFirstRender, items],
  )
}
