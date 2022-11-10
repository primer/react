import React from 'react'
import {getScrollContainer} from '../utils/scroll'

/**
 * Manage the active element when the user presses `PageUp` or `PageDown`
 * while using the TreeView. This hook tackles the following scenarios when
 * dealing with this scenarios:
 *
 * - When the TreeView is within a nested scroll container or scrolls through
 *   the document
 * - When the user hits the edge of a scroll container
 * - When the user presses and holds either PageUp or PageDown
 * - When the user presses either key and the item is still visible
 */
export function usePageUpDown(ref: React.RefObject<HTMLElement>) {
  const {onScrollEnd} = useScrollEnd(ref)

  React.useEffect(() => {
    if (ref.current === null) {
      return
    }

    const {current: tree} = ref

    function listener(event: KeyboardEvent) {
      if (event.key === 'PageUp' || event.key === 'PageDown') {
        onScrollEnd(() => {
          const scrollContainer = getScrollContainer(tree)
          const {activeElement} = document
          if (activeElement === null) {
            return
          }

          if (isVisible(document.activeElement as HTMLElement, scrollContainer)) {
            return
          }

          const items = Array.from(tree.querySelectorAll('[role="treeitem"]')).filter((item): item is HTMLElement => {
            const position = activeElement.compareDocumentPosition(item)
            if (event.key === 'PageUp') {
              return !!(position & Node.DOCUMENT_POSITION_PRECEDING)
            }
            return !!(position & Node.DOCUMENT_POSITION_FOLLOWING)
          })
          if (event.key === 'PageUp') {
            items.reverse()
          }

          for (const item of items) {
            if (item.firstElementChild === null) {
              continue
            }

            if (isVisible(item, scrollContainer)) {
              item.focus()
              break
            }
          }
        })
      }
    }

    tree.addEventListener('keyup', listener)

    return () => {
      tree.removeEventListener('keyup', listener)
    }
  }, [ref, onScrollEnd])
}

/**
 * The amount of time (in ms) to wait before registering that scrolling has
 * ended.
 */
const SCROLL_DELAY = 60

/**
 * Provides a function, `onScrollEnd`, that will call the given callback when it
 * detects that the application is no longer scrolling.
 */
function useScrollEnd(ref: React.RefObject<HTMLElement>) {
  // Keep track of the current timeout and scroll listener in case the owner
  // component unmounts before the timer has a chance to complete
  const timeoutId = React.useRef<number | null>(null)
  const activeListener = React.useRef<(() => void) | null>(null)

  // Detect when the user has stopped scrolling by listening to scroll events
  // and calling the given callback after a `scroll` event has not been fired
  // after a certain amount of time.
  //
  // This callback will also be called if no scroll event is detected after a
  // certain amount of time
  const onScrollEnd = React.useCallback(
    callback => {
      const container = getScrollContainer(ref.current) ?? window

      // If there and currently any timers, like from previous calls to
      // `onScrollEnd`, cancel them and remove any active event listeners
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }

      if (activeListener.current !== null) {
        container.removeEventListener('scroll', activeListener.current)
        activeListener.current = null
      }

      function onScroll() {
        if (timeoutId.current !== null) {
          clearTimeout(timeoutId.current)
        }
        timeoutId.current = window.setTimeout(scrollEnd, SCROLL_DELAY)
      }

      // When we have detected that scrolling has ended, clean up any active
      // event listeners and reset our refs that track our active listener and
      // timeout
      function scrollEnd() {
        container.removeEventListener('scroll', onScroll)
        activeListener.current = null
        timeoutId.current = null

        callback()
      }

      // eslint-disable-next-line github/prefer-observers
      container.addEventListener('scroll', onScroll)
      activeListener.current = onScroll

      // Add an initial timer in case no event is triggered after the scroll
      // event is registered. This is useful when at the end of a scroll
      // container where you want the code to run but technically a scroll event
      // has not run
      timeoutId.current = window.setTimeout(scrollEnd, SCROLL_DELAY)
    },
    [ref]
  )

  // If the owner component unmounts, clear up any pending timers and remove any
  // event listeners that are currently registered
  React.useEffect(() => {
    const container = getScrollContainer(ref.current) ?? window

    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }

      if (activeListener.current !== null) {
        container.removeEventListener('scroll', activeListener.current)
        activeListener.current = null
      }
    }
  }, [ref])

  return {
    onScrollEnd
  }
}

/**
 * Determine the visibility of an element
 */
function isVisible(element: HTMLElement, scrollContainer?: Element | null): boolean {
  // If a scroll container is present, check to see if the element is visible
  // within it
  if (scrollContainer) {
    const elementTop = element.offsetTop
    const elementBottom = elementTop + element.clientHeight
    const parentTop = scrollContainer.scrollTop
    const parentBottom = parentTop + scrollContainer.clientHeight

    return elementTop >= parentTop && elementBottom <= parentBottom
  }

  // Otherwise, check to see if the element is visible in the viewport
  return isInViewport(element)
}

function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
