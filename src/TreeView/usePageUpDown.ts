import React from 'react'

/**
 * Manage the active element when the user presses `PageUp` or `PageDown`
 * while using the TreeView
 */
export function usePageUpDown(ref: React.RefObject<HTMLElement>) {
  const {onScrollEnd} = useScrollEnd()

  React.useEffect(() => {
    if (ref.current === null) {
      return
    }

    const {current: tree} = ref

    function listener(event: KeyboardEvent) {
      // When pressing PageUp, look at treeitem's above the current active element
      // and find the first one that is not in the viewport. If one exists, focus it
      if (event.key === 'PageUp') {
        onScrollEnd(() => {
          const items: HTMLElement[] = Array.from(tree.querySelectorAll('[role="treeitem"]'))
            .filter((item): item is HTMLElement => {
              if (item.nodeType !== Node.ELEMENT_NODE) {
                return false
              }

              const position = document.activeElement?.compareDocumentPosition(item)
              if (position === undefined) {
                return false
              }

              return !!(position & Node.DOCUMENT_POSITION_PRECEDING)
            })
            .reverse()

          for (const item of items) {
            if (item.firstElementChild === null) {
              continue
            }

            // Check the first element element instead of the item in case the
            // tree contains child items
            if (isInViewport(item.firstElementChild)) {
              item.focus()
              break
            }
          }
        })
      }

      // When pressing PageDown, look at treeitem's below the current active element
      // and find the first one that is not in the viewport. If one exists, focus it
      if (event.key === 'PageDown') {
        onScrollEnd(() => {
          const items: HTMLElement[] = Array.from(tree.querySelectorAll('[role="treeitem"]')).filter(
            (item): item is HTMLElement => {
              if (item.nodeType !== Node.ELEMENT_NODE) {
                return false
              }

              const position = document.activeElement?.compareDocumentPosition(item)
              if (position === undefined) {
                return false
              }

              return !!(position & Node.DOCUMENT_POSITION_FOLLOWING)
            }
          )

          for (const item of items) {
            if (item.firstElementChild === null) {
              continue
            }

            // Check the first element element instead of the item in case the
            // tree contains child items
            if (isInViewport(item.firstElementChild)) {
              item.focus()
              break
            }
          }
        })
      }
    }

    tree.addEventListener('keydown', listener)

    return () => {
      tree.removeEventListener('keydown', listener)
    }
  }, [ref, onScrollEnd])
}

/**
 * Provides a function, `onScrollEnd`, that will call the given callback when it
 * detects that the application is no longer scrolling.
 */
function useScrollEnd() {
  // Keep track of the current timeout and scroll listener in case the owner
  // component unmounts before the timer has a chance to complete
  const timeoutId = React.useRef<number | null>(null)
  const activeListener = React.useRef<(() => void) | null>(null)
  const onScrollEnd = React.useCallback(callback => {
    function listener() {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
      }
      timeoutId.current = window.setTimeout(() => {
        callback()
        window.removeEventListener('scroll', listener)
        activeListener.current = null
      }, 60)
    }

    window.addEventListener('scroll', listener)
    activeListener.current = listener
  }, [])

  React.useEffect(() => {
    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }

      if (activeListener.current !== null) {
        window.removeEventListener('scroll', activeListener.current)
        activeListener.current = null
      }
    }
  }, [])

  return {
    onScrollEnd
  }
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
