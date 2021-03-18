import styled from 'styled-components'
import React, {ReactElement} from 'react'
import {get, COMMON, POSITION, SystemPositionProps, SystemCommonProps} from './constants'
import {ComponentProps} from './utils/types'
import {useOverlay, AnchoredPositionHookSettings, TouchOrMouseEvent} from './hooks'
import Portal from './Portal'
import sx, {SxProp} from './sx'

type StyledOverlayProps = {
  width?: keyof typeof widthMap
  height?: keyof typeof heightMap
  visibility: 'visible' | 'hidden'
}

const heightMap = {
  sm: '480px',
  md: '640px',
  auto: 'auto'
}

const widthMap = {
  sm: '256px',
  md: '320px',
  lg: '480px',
  xl: '640px',
  auto: 'auto'
}

/*TODO replace with shadow functional color variable when it's shipped to primer/primitives*/
const StyledOverlay = styled.div<StyledOverlayProps & SystemCommonProps & SystemPositionProps & SxProp>`
  background-color: ${get('colors.bg.overlay')};
  box-shadow: ${get('overlay.boxShadow')};
  position: absolute;
  min-width: 192px;
  max-width: 640px;
  height: ${props => heightMap[props.height || 'auto']};
  width: ${props => widthMap[props.width || 'auto']};
  border-radius: ${get('overlay.borderRadius')};
  overflow: hidden;
  animation: overlay-appear 200ms ${get('animation.easeOutCubic')};

  @keyframes overlay-appear {
    0% {
      opacity: 0;
      transform: translateY(${get('space.2')});
    }
    100% {
      opacity: 1;
    }
  }
  visibility: ${props => props.visibility};
  ${COMMON};
  ${POSITION};
  ${sx};
`
export type OverlayProps = {
  ignoreClickRefs: React.RefObject<HTMLElement>[]
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
  anchorRef: React.RefObject<HTMLElement>
  onClickOutside: (e: TouchOrMouseEvent) => void
  onEscape: (e: KeyboardEvent) => void
  positionSettings?: AnchoredPositionHookSettings
  positionDeps?: React.DependencyList
} & Omit<ComponentProps<typeof StyledOverlay>, 'visibility' | keyof SystemPositionProps>

/**
 * An `Overlay` is a flexible floating surface, used to display transient content such as menus,
 * selection options, dialogs, and more. Overlays use shadows to express elevation. The `Overlay`
 * component handles all behaviors needed by overlay UIs as well as the common styles that all overlays * should have.
 * @param positionSettings Settings for calculating the anchored position.
 * @param positionDeps Dependencies to determine when to re-calculate the position of the overlay.
 * @param ignoreClickRefs Optional. An array of ref objects to ignore clicks on in the `onOutsideClick` behavior. This is often used to ignore clicking on the element that toggles the open/closed state for the `Overlay` to prevent the `Overlay` from being toggled twice.
 * @param initialFocusRef Optional. Ref for the element to focus when the `Overlay` is opened. If nothing is provided, the first focusable element in the `Overlay` body is focused.
 * @param anchorRef Required. Element the `Overlay` should be anchored to.
 * @param returnFocusRef Required. Ref for the element to focus when the `Overlay` is closed.
 * @param onClickOutside  Required. Function to call when clicking outside of the `Overlay`. Typically this function sets the `Overlay` visibility state to `false`.
 * @param onEscape Required. Function to call when user presses `Escape`. Typically this function sets the `Overlay` visibility state to `false`.
 * @param width Sets the width of the `Overlay`, pick from our set list of widths, or pass `auto` to automatically set the width based on the content of the `Overlay`. `sm` corresponds to `256px`, `md` corresponds to `320px`, `lg` corresponds to `480px`, and `xl` corresponds to `640px`.
 * @param height Sets the height of the `Overlay`, pick from our set list of heights, or pass `auto` to automatically set the height based on the content of the `Overlay`. `sm` corresponds to `480px` and `md` corresponds to `640px`.
 */
const Overlay = ({
  onClickOutside,
  role = 'dialog',
  positionSettings,
  positionDeps,
  anchorRef,
  initialFocusRef,
  returnFocusRef,
  ignoreClickRefs,
  onEscape,
  ...rest
}: OverlayProps): ReactElement => {
  const {position, ...overlayRest} = useOverlay({
    anchorRef,
    positionSettings,
    positionDeps,
    returnFocusRef,
    onEscape,
    ignoreClickRefs,
    onClickOutside,
    initialFocusRef
  })
  return (
    <Portal>
      <StyledOverlay
        {...overlayRest}
        {...position}
        visibility={position ? 'visible' : 'hidden'}
        aria-modal="true"
        role={role}
        {...rest}
      />
    </Portal>
  )
}

Overlay.defaultProps = {
  height: 'auto',
  width: 'auto'
}

export default Overlay
