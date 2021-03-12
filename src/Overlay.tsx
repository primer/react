import styled from 'styled-components'
import React, {ReactElement} from 'react'
import {get, COMMON, POSITION} from './constants'
import {ComponentProps} from './utils/types'
import { useOverlay, AnchoredPositionHookSettings, TouchOrMouseEvent } from './hooks'
import Portal from './Portal'

type StyledOverlayProps = {
  width?: keyof typeof widthMap
  height?: keyof typeof heightMap
}

const heightMap = {
  'sm': '480px',
  'md': '640px',
  'auto': 'auto'
}

const widthMap = {
  'sm': '256px',
  'md': '320px',
  'lg': '480px',
  'xl': '640px',
  'auto': 'auto'
}

const StyledOverlay  = styled.div<StyledOverlayProps>`
  background-color: ${get('overlay.bg')};
  box-shadow: ${get('overlay.popover.boxShadow')};
  position: absolute;
  z-index: 100;
  min-width: 192px;
  max-width: 480px;
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
  ${COMMON};
  ${POSITION};
`

export type OverlayProps = {
  ignoreClickRefs: React.RefObject<HTMLElement> []
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
  triggerRef: React.RefObject<HTMLElement>
  onClickOutside: (e: TouchOrMouseEvent) => void
  onEscape: (e: KeyboardEvent) => void
  positionSettings?: AnchoredPositionHookSettings
  positionDeps?: React.DependencyList
} & ComponentProps<typeof StyledOverlay>

const Overlay =
  (
    {onClickOutside, positionSettings, positionDeps, triggerRef, initialFocusRef, returnFocusRef, ignoreClickRefs, onEscape, ...rest}: OverlayProps
  ) : ReactElement => {
    const overlayProps = useOverlay({triggerRef, positionSettings, positionDeps, returnFocusRef, onEscape, ignoreClickRefs, onClickOutside, initialFocusRef})
    return (
      <Portal>
        <StyledOverlay {...overlayProps} {...rest}/>
      </Portal>
    )
}

Overlay.defaultProps = {
  height: 'auto',
  width: 'auto'
}

export default Overlay