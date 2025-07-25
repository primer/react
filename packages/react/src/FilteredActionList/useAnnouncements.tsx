// Announcements for FilteredActionList (and SelectPanel) based
// on https://github.com/github/multi-select-user-testing

import {announce as liveRegionAnnounce} from '@primer/live-region-element'
import {useCallback, useEffect, useRef} from 'react'
import type {FilteredActionListProps} from './FilteredActionListEntry'

// we add a delay so that it does not interrupt default screen reader announcement and queues after it
const delayMs = 1000

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
  enabled: boolean = true,
  message?: {title?: string; description?: string},
) => {
  const liveRegion = document.querySelector('live-region')

  // Notify user of the number of items available
  const selectedItems = items.filter(item => item.selected).length
  const announcementText =
    items.length > 0
      ? `${items.length} item${items.length > 1 ? 's' : ''} available, ${selectedItems} selected.`
      : `${message?.title}. ${message?.description}` || 'No matching items.'

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
        announce(announcementText, {
          delayMs,
          from: liveRegion ? liveRegion : undefined, // announce will create a liveRegion if it doesn't find one
        })
      }

      const inputElement = inputRef.current
      inputElement?.addEventListener('focus', focusHandler)
      return () => inputElement?.removeEventListener('focus', focusHandler)
    },
    [listContainerRef, inputRef, items, liveRegion, announce, announcementText],
  )

  const isFirstRender = useFirstRender()
  useEffect(
    function announceListUpdates() {
      if (isFirstRender) return // ignore on first render as announceInitialFocus will also announce

      liveRegion?.clear() // clear previous announcements

      announce(announcementText, {
        delayMs,
        from: liveRegion ? liveRegion : undefined,
      })
    },
    [announce, isFirstRender, items, listContainerRef, liveRegion, announcementText],
  )
}
