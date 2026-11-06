// Announcements for FilteredActionList (and SelectPanel) based
// on https://github.com/github/multi-select-user-testing

import {useCallback, useEffect, useRef} from 'react'
import type {FilteredActionListProps} from './index'
import type {ItemInput} from '../SelectPanel'
import {useAnnounce} from '../live-region'

// we add a delay so that it does not interrupt default screen reader announcement and queues after it
const delayMs = 500

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
  // Notify user of the number of items available
  const selectedItems = items.filter(item => item.selected).length
  const {announce: ariaNotify, cancel} = useAnnounce()
  const focusTimeoutId = useRef<number | null>(null)
  const updateFrameId = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (focusTimeoutId.current !== null) {
        clearTimeout(focusTimeoutId.current)
        focusTimeoutId.current = null
      }
      if (updateFrameId.current !== null) {
        cancelAnimationFrame(updateFrameId.current)
        updateFrameId.current = null
      }
    }
  }, [])
  const announce = useCallback(
    (...args: Parameters<typeof ariaNotify>) => {
      if (enabled) {
        ariaNotify(...args)
      }
    },
    [ariaNotify, enabled],
  )

  const onInputFocus = useCallback(() => {
    if (loading) {
      return
    }

    if (usingRovingTabindex) {
      const announcementText = `${items.length} item${items.length > 1 ? 's' : ''} available, ${selectedItems} selected.`
      announce(announcementText, {
        delayMs,
      })
      return
    }

    if (focusTimeoutId.current !== null) {
      clearTimeout(focusTimeoutId.current)
    }
    focusTimeoutId.current = window.setTimeout(() => {
      focusTimeoutId.current = null
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
      })
    })
  }, [announce, inputRef, items, listContainerRef, loading, selectedItems, usingRovingTabindex])

  const announcementState = getAnnouncementState(items, loading, message, filterValue)
  const previousAnnouncementState = useRef(announcementState)
  useEffect(
    function announceListUpdates() {
      if (previousAnnouncementState.current === announcementState) return
      previousAnnouncementState.current = announcementState

      // clear previous announcements
      cancel()
      if (focusTimeoutId.current !== null) {
        clearTimeout(focusTimeoutId.current)
        focusTimeoutId.current = null
      }
      if (updateFrameId.current !== null) {
        cancelAnimationFrame(updateFrameId.current)
        updateFrameId.current = null
      }

      // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler
      if (loading) {
        return
      }

      // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler
      if (items.length === 0) {
        announce(`${message?.title}. ${message?.description}`, {delayMs})
        return
      }

      if (usingRovingTabindex) {
        const announcementText = `${items.length} item${items.length > 1 ? 's' : ''} available, ${selectedItems} selected.`

        announce(announcementText, {
          delayMs,
        })
      } else {
        // give @primer/behaviors a moment to update active-descendant
        updateFrameId.current = window.requestAnimationFrame(() => {
          updateFrameId.current = null
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
          })
        })
      }
    },
    [
      announce,
      cancel,
      announcementState,
      items,
      listContainerRef,
      usingRovingTabindex,
      message?.title,
      message?.description,
      loading,
      selectedItems,
    ],
  )

  return onInputFocus
}
