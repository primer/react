import type React from 'react'
import {useCallback, useContext, useEffect, useRef} from 'react'
import {useAnchoredPosition, useRenderForcingRef} from '../hooks'
import type {OverlayProps} from '../Overlay'
import Overlay from '../Overlay'
import type {ComponentProps} from '../utils/types'
import {AutocompleteContext} from './AutocompleteContext'
import VisuallyHidden from '../_VisuallyHidden'

import classes from './AutocompleteOverlay.module.css'
import {clsx} from 'clsx'

type AutocompleteOverlayInternalProps = {
  /**
   * The ref of the element that the position of the menu is based on. By default, the menu is positioned based on the text input
   */
  menuAnchorRef?: React.RefObject<HTMLElement>
  /**
   * Props to be spread on the internal `Overlay` component.
   */
  overlayProps?: Partial<OverlayProps>
  children?: React.ReactNode
} & Partial<OverlayProps> &
  Pick<React.AriaAttributes, 'aria-labelledby'> // TODO: consider making 'aria-labelledby' required

function AutocompleteOverlay({
  menuAnchorRef,
  overlayProps: oldOverlayProps,
  children,
  className,
  ...newOverlayProps
}: AutocompleteOverlayInternalProps) {
  const autocompleteContext = useContext(AutocompleteContext)
  if (autocompleteContext === null) {
    throw new Error('AutocompleteContext returned null values')
  }
  const overlayProps = {...oldOverlayProps, ...newOverlayProps}
  const {inputRef, scrollContainerRef, selectedItemLength, setShowMenu, showMenu = false} = autocompleteContext

  const computedAnchorRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const explicit = menuAnchorRef?.current ?? null
    const tokensContainer = inputRef.current
      ? (inputRef.current.closest('[data-prevent-token-wrapping]') as HTMLElement | null)
      : null
    const tokensRoot = tokensContainer?.parentElement ?? null
    computedAnchorRef.current = explicit ?? tokensRoot ?? inputRef.current
  }, [menuAnchorRef, inputRef])

  // Use useRenderForcingRef to trigger position recalculation when overlay mounts
  // (Portal creates element asynchronously via useLayoutEffect)
  const [floatingElementRef, updateFloatingRef] = useRenderForcingRef<HTMLDivElement>()

  const {position} = useAnchoredPosition(
    {
      side: 'outside-bottom',
      align: 'start',
      anchorElementRef: computedAnchorRef as React.RefObject<HTMLElement>,
      floatingElementRef,
    },
    [showMenu, selectedItemLength, floatingElementRef.current],
  )

  // Sync floatingElementRef to scrollContainerRef for scroll handling
  useEffect(() => {
    scrollContainerRef.current = floatingElementRef.current
  }, [scrollContainerRef, floatingElementRef.current])

  // Clear overlay ref when closed so position resets between open/close cycles
  useEffect(() => {
    if (!showMenu && floatingElementRef.current) {
      updateFloatingRef(null)
    }
  }, [showMenu, floatingElementRef, updateFloatingRef])

  const closeOptionList = useCallback(() => {
    setShowMenu(false)
  }, [setShowMenu])

  // Note: Overlay uses Portal which requires DOM, but it's only rendered when showMenu is true.
  // When showMenu is false, we safely render VisuallyHidden which doesn't require DOM.

  return showMenu ? (
    <Overlay
      returnFocusRef={inputRef}
      preventFocusOnOpen={true}
      onClickOutside={closeOptionList}
      onEscape={closeOptionList}
      ref={updateFloatingRef}
      top={position?.top}
      left={position?.left}
      className={clsx(classes.Overlay, className)}
      {...overlayProps}
    >
      {children}
    </Overlay>
  ) : (
    // HACK: This ensures AutocompleteMenu is still mounted when closing the menu and all of the hooks inside of it are still called.
    // A better way to do this would be to move the hooks to AutocompleteOverlay or somewhere that won't get unmounted.
    <VisuallyHidden aria-hidden="true">{children}</VisuallyHidden>
  )
}

AutocompleteOverlay.displayName = 'AutocompleteOverlay'

export type AutocompleteOverlayProps = ComponentProps<typeof AutocompleteOverlay>
export default AutocompleteOverlay

AutocompleteOverlay.__SLOT__ = Symbol('Autocomplete.Overlay')
