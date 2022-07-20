import React from 'react'
import {iterateFocusableElements} from '@primer/behaviors/utils'

export const useMenuInitialFocus = (
  open: boolean,
  containerRef: React.RefObject<HTMLElement>,
  anchorRef: React.RefObject<HTMLElement>
) => {
  /**
   * We need to pick the first element to focus based on how the menu was opened,
   * however, we need to wait for the menu to be open to set focus.
   * This is why we use set openingKey in state and have 2 effects
   */
  const [openingGesture, setOpeningGesture] = React.useState<string | undefined>(undefined)

  React.useEffect(
    function inferOpeningKey() {
      const anchorElement = anchorRef.current

      const clickHandler = (event: MouseEvent) => {
        // event.detail === 0 means onClick was fired by Enter/Space key
        // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
        if (event.detail !== 0) setOpeningGesture('mouse-click')
      }
      const keydownHandler = (event: KeyboardEvent) => {
        if (['Space', 'Enter', 'ArrowDown', 'ArrowUp'].includes(event.code)) {
          setOpeningGesture(event.code)
        }
      }

      anchorElement?.addEventListener('click', clickHandler)
      anchorElement?.addEventListener('keydown', keydownHandler)
      return () => {
        anchorElement?.removeEventListener('click', clickHandler)
        anchorElement?.removeEventListener('keydown', keydownHandler)
      }
    },
    [anchorRef]
  )

  /**
   * Pick the first element to focus based on the key used to open the Menu
   * Click: anchor
   * ArrowDown | Space | Enter: first element
   * ArrowUp: last element
   */
  React.useEffect(
    function moveFocusOnOpen() {
      if (!open) return
      if (!openingGesture || !containerRef.current) return

      const iterable = iterateFocusableElements(containerRef.current)

      if (openingGesture === 'mouse-click') {
        if (anchorRef.current) anchorRef.current.focus()
        else throw new Error('For focus management, please attach anchorRef')
      } else if (['ArrowDown', 'Space', 'Enter'].includes(openingGesture)) {
        const firstElement = iterable.next().value
        /** We push imperative focus to the next tick to prevent React's batching */
        setTimeout(() => firstElement?.focus())
      } else if ('ArrowUp' === openingGesture) {
        const elements = [...iterable]
        const lastElement = elements[elements.length - 1]
        setTimeout(() => lastElement.focus())
      }
    },
    [open, openingGesture, containerRef, anchorRef]
  )
}
