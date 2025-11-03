// Announcements for FilteredActionList (and SelectPanel) based
// on https://github.com/github/multi-select-user-testing

import {announce as liveRegionAnnounce} from '@primer/live-region-element'
import {useCallback, useEffect, useRef} from 'react'
import type {FilteredActionListProps} from './index'
import type {ItemInput} from '../SelectPanel'
import {useFeatureFlag} from '../FeatureFlags'

// we add a delay so that it does not interrupt default screen reader announcement and queues after it
const delayMs = 500

const useFirstRender = () => {
  const firstRender = useRef(true)
  useEffect(() => {
    firstRender.current = false
  }, [])
  return firstRender.current
}

//TODO remove this when we remove usingRemoveActiveDescendant
const getItemWithActiveDescendant = (
  listRef: React.RefObject<HTMLUListElement | null>,
  items: FilteredActionListProps['items'],
) => {
  const listElement = listRef.current
  const activeItemElement = listElement?.querySelector('[data-is-active-descendant]')

  if (!listElement || !activeItemElement?.textContent) return

  const optionElements = listElement.querySelectorAll('[role="option"]')

  const index = Array.from(optionElements).indexOf(activeItemElement)
  const activeItem = items[index] as ItemInput | undefined

  const text = activeItem?.text
  const selected = activeItem?.selected

  return {index, text, selected}
}
//TODO remove this when we remove usingRemoveActiveDescendant

export const useAnnouncements = (
  items: FilteredActionListProps['items'],
  listContainerRef: React.RefObject<HTMLUListElement | null>,
  inputRef: React.RefObject<HTMLInputElement | null>,
  enabled: boolean = true,
  loading: boolean = false,
  message?: {title: string; description: string},
) => {
  const usingRemoveActiveDescendant = useFeatureFlag('primer_react_select_panel_remove_active_descendant')
  const liveRegion = document.querySelector('live-region')

  // Notify user of the number of items available
  const selectedItems = items.filter(item => item.selected).length

  const announce = useCallback(
    (...args: Parameters<typeof liveRegionAnnounce>): ReturnType<typeof liveRegionAnnounce> | undefined => {
      if (enabled) {
        return liveRegionAnnounce(...args)
      }
    },
    [enabled],
  )

  useEffect(
    function announceInitialFocus() {
      const focusHandler = () => {
        if (usingRemoveActiveDescendant) {
          const announcementText = `${items.length} item${items.length > 1 ? 's' : ''} available, ${selectedItems} selected.`
          announce(announcementText, {
            delayMs,
            from: liveRegion ? liveRegion : undefined, // announce will create a liveRegion if it doesn't find one
          })
        } else {
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
      }

      const inputElement = inputRef.current
      inputElement?.addEventListener('focus', focusHandler)
      return () => inputElement?.removeEventListener('focus', focusHandler)
    },
    [listContainerRef, inputRef, items, liveRegion, announce, usingRemoveActiveDescendant, selectedItems],
  )

  const isFirstRender = useFirstRender()
  useEffect(
    function announceListUpdates() {
      if (isFirstRender) return // ignore on first render as announceInitialFocus will also announce

      liveRegion?.clear() // clear previous announcements

      if (items.length === 0 && !loading) {
        announce(`${message?.title}. ${message?.description}`, {delayMs})
        return
      }

      if (usingRemoveActiveDescendant) {
        const announcementText = `${items.length} item${items.length > 1 ? 's' : ''} available, ${selectedItems} selected.`

        announce(announcementText, {
          delayMs,
          from: liveRegion ? liveRegion : undefined,
        })
      } else {
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
      }
    },
    [
      announce,
      isFirstRender,
      items,
      listContainerRef,
      liveRegion,
      usingRemoveActiveDescendant,
      message?.title,
      message?.description,
      loading,
      selectedItems,
    ],
  )
}
