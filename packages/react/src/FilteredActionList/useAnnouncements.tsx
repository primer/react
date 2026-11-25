// Announcements for FilteredActionList (and SelectPanel) based
// on https://github.com/github/multi-select-user-testing

import {announce as liveRegionAnnounce} from '@primer/live-region-element'
import {useCallback, useEffect, useRef} from 'react'
import type {FilteredActionListProps} from './index'
import type {ItemInput} from '../SelectPanel'

// we add a delay so that it does not interrupt default screen reader announcement and queues after it
const delayMs = 500
const listUpdateDelayMs = 250

const getInputLabel = (input: HTMLInputElement | null) => {
  if (!input) return

  const labelledBy = input.getAttribute('aria-labelledby')
  if (labelledBy) {
    const label = labelledBy
      .split(/\s+/)
      .map(id => input.ownerDocument.getElementById(id)?.textContent.trim())
      .filter(Boolean)
      .join(' ')

    if (label) return label
  }

  const ariaLabel = input.getAttribute('aria-label')
  if (ariaLabel) return ariaLabel

  const label = Array.from(input.labels ?? [])
    .map(label => label.textContent.trim())
    .filter(Boolean)
    .join(' ')

  return label || undefined
}

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

const getAnnouncementState = (
  items: FilteredActionListProps['items'],
  loading: boolean,
  message?: {title: string; description: string},
  filterValue?: string,
) =>
  JSON.stringify({
    items: items.map((item, index) => [item.id ?? item.text ?? index, item.text, item.selected]),
    loading,
    message,
    filterValue,
  })

export const useAnnouncements = (
  items: FilteredActionListProps['items'],
  listContainerRef: React.RefObject<HTMLUListElement | null>,
  inputRef: React.RefObject<HTMLInputElement | null>,
  enabled: boolean = true,
  loading: boolean = false,
  message?: {title: string; description: string},
  focusManagement?: 'active-descendant' | 'roving-tabindex',
  filterValue?: string,
) => {
  const usingRovingTabindex = focusManagement === 'roving-tabindex'

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

  const pendingListAnnouncement = useRef<(() => void) | null>(null)
  const cancelPendingListAnnouncement = useCallback(() => {
    pendingListAnnouncement.current?.()
    pendingListAnnouncement.current = null
  }, [])

  useEffect(() => cancelPendingListAnnouncement, [cancelPendingListAnnouncement, enabled, usingRovingTabindex])

  const onInputFocus = useCallback(() => {
    if (usingRovingTabindex) {
      const announcementText = `${items.length} item${items.length > 1 ? 's' : ''} available, ${selectedItems} selected.`
      announce(announcementText, {
        delayMs,
        from: liveRegion ? liveRegion : undefined, // announce will create a liveRegion if it doesn't find one
      })
      return
    }

    window.setTimeout(() => {
      const activeItem = getItemWithActiveDescendant(listContainerRef, items)
      if (!activeItem) return
      const {index, text, selected} = activeItem
      const inputLabel = getInputLabel(inputRef.current)

      const announcementText = [
        inputLabel ? `${inputLabel}, filter text box and list of items` : 'Focus on filter text box and list of items',
        `Focused item: ${text}`,
        `${selected ? 'selected' : 'not selected'}`,
        `${index + 1} of ${items.length}`,
      ].join(', ')
      announce(announcementText, {
        delayMs,
        from: liveRegion ? liveRegion : undefined, // announce will create a liveRegion if it doesn't find one
      })
    })
  }, [announce, inputRef, items, listContainerRef, liveRegion, selectedItems, usingRovingTabindex])

  const announcementState = getAnnouncementState(items, loading, message, filterValue)
  const previousAnnouncementState = useRef(announcementState)
  useEffect(
    function announceListUpdates() {
      if (previousAnnouncementState.current === announcementState) return
      previousAnnouncementState.current = announcementState

      cancelPendingListAnnouncement()
      // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler -- Updates can come from props, independently of input events.
      if (!enabled) return

      liveRegion?.clear() // clear previous announcements

      let frameId: number | undefined
      let timeoutId: number | undefined
      let delivery: ReturnType<typeof announce>
      pendingListAnnouncement.current = () => {
        if (frameId !== undefined) window.cancelAnimationFrame(frameId)
        if (timeoutId !== undefined) window.clearTimeout(timeoutId)
        delivery?.cancel()
      }

      const schedule = (getText: () => string | undefined, options: Parameters<typeof liveRegionAnnounce>[1]) => {
        timeoutId = window.setTimeout(() => {
          const text = getText()
          if (text !== undefined) delivery = announce(text, options)
        }, listUpdateDelayMs)
      }

      // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler
      if (items.length === 0 && !loading) {
        schedule(() => `${message?.title}. ${message?.description}`, {delayMs})
        return
      }

      const options = {delayMs, from: liveRegion ?? undefined}
      if (usingRovingTabindex) {
        schedule(
          () => `${items.length} item${items.length > 1 ? 's' : ''} available, ${selectedItems} selected.`,
          options,
        )
      } else {
        // Give @primer/behaviors a frame to update active-descendant, then
        // read focus when the delay ends so intervening navigation is included.
        frameId = window.requestAnimationFrame(() => {
          schedule(() => {
            const activeItem = getItemWithActiveDescendant(listContainerRef, items)
            if (!activeItem) return
            const {index, text, selected} = activeItem

            return [
              'List updated',
              `Focused item: ${text}`,
              selected ? 'selected' : 'not selected',
              `${index + 1} of ${items.length}`,
            ].join(', ')
          }, options)
        })
      }
    },
    [
      announce,
      announcementState,
      cancelPendingListAnnouncement,
      enabled,
      items,
      listContainerRef,
      liveRegion,
      usingRovingTabindex,
      message?.title,
      message?.description,
      loading,
      selectedItems,
    ],
  )

  return onInputFocus
}
