import type React from 'react'
import {useCallback, useContext} from 'react'
import {useAnchoredPosition} from '../hooks'
import type {OverlayProps} from '../Overlay'
import Overlay from '../Overlay'
import type {ComponentProps} from '../utils/types'
import {AutocompleteContext} from './AutocompleteContext'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import VisuallyHidden from '../_VisuallyHidden'

import classes from './AutocompleteOverlay.module.css'

type AutocompleteOverlayInternalProps = {
  /**
   * The ref of the element that the position of the menu is based on. By default, the menu is positioned based on the text input
   */
  menuAnchorRef?: React.RefObject<HTMLElement | null>
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
  ...newOverlayProps
}: AutocompleteOverlayInternalProps) {
  const autocompleteContext = useContext(AutocompleteContext)
  if (autocompleteContext === null) {
    throw new Error('AutocompleteContext returned null values')
  }
  const overlayProps = {...oldOverlayProps, ...newOverlayProps}
  const {inputRef, scrollContainerRef, selectedItemLength, setShowMenu, showMenu = false} = autocompleteContext
  const {floatingElementRef, position} = useAnchoredPosition(
    {
      side: 'outside-bottom',
      align: 'start',
      anchorElementRef: menuAnchorRef ? menuAnchorRef : inputRef,
    },
    [showMenu, selectedItemLength],
  )

  useRefObjectAsForwardedRef(scrollContainerRef, floatingElementRef)

  const closeOptionList = useCallback(() => {
    setShowMenu(false)
  }, [setShowMenu])

  if (typeof window === 'undefined') {
    return null
  }

  return showMenu ? (
    <Overlay
      returnFocusRef={inputRef}
      preventFocusOnOpen={true}
      onClickOutside={closeOptionList}
      onEscape={closeOptionList}
      // @ts-expect-error [react-19] [TS2322]
      ref={floatingElementRef as React.RefObject<HTMLDivElement | null>}
      top={position?.top}
      left={position?.left}
      className={classes.Overlay}
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
