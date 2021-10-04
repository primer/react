import React, { useCallback, useContext } from 'react'
import { useAnchoredPosition } from '../hooks'
import Overlay, { OverlayProps } from '../Overlay'
import { ComponentProps } from '../utils/types'
import { AutocompleteContext } from './AutocompleteContext'
import { useCombinedRefs } from '../hooks/useCombinedRefs'

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
} & Pick<React.AriaAttributes, 'aria-labelledby'> // TODO: consider making 'aria-labelledby' required

const AutocompleteOverlay: React.FC<AutocompleteOverlayInternalProps> = ({
    menuAnchorRef,
    overlayProps,
    children
}) => {
    const {
        inputRef,
        scrollContainerRef,
        selectedItemLength,
        setShowMenu,
        showMenu = false,
    } = useContext(AutocompleteContext)
    const {floatingElementRef, position} = useAnchoredPosition(
        {
            side: 'outside-bottom',
            align: 'start',
            anchorElementRef: menuAnchorRef ? menuAnchorRef : inputRef
        },
        [showMenu, selectedItemLength]
    )

    const combinedOverlayRef = useCombinedRefs(scrollContainerRef, floatingElementRef)

    const closeOptionList = useCallback(() => {
        setShowMenu && setShowMenu(false)
    }, [setShowMenu])

    return (
        <Overlay
            returnFocusRef={inputRef}
            preventFocusOnOpen={true}
            onClickOutside={closeOptionList}
            onEscape={closeOptionList}
            ref={combinedOverlayRef as React.RefObject<HTMLDivElement>}
            top={position?.top}
            left={position?.left}
            visibility={showMenu ? 'visible' : 'hidden'}
            sx={{
                overflow: "auto"
            }}
            {...overlayProps}
        >
            {children}
        </Overlay>
    )
}

AutocompleteOverlay.displayName = 'AutocompleteOverlay'

export type AutocompleteOverlayProps = ComponentProps<typeof AutocompleteOverlay>
export default AutocompleteOverlay
