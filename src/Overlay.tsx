import styled from 'styled-components'
import React, { ReactElement } from 'react'
import {get, COMMON} from './constants'
import {ComponentProps} from './utils/types'
import {TouchOrMouseEvent} from './hooks/useOnOutsideClick'
import { useOverlay } from './hooks/useOverlay'

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
`

export type OverlayProps = {
  ignoreClickRefs: React.RefObject<HTMLElement> []
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
  onClickOutside: (e: TouchOrMouseEvent) => void
  onEscape: (e: KeyboardEvent) => void
} & ComponentProps<typeof StyledOverlay>

const Overlay =
  (
    {onClickOutside, initialFocusRef, returnFocusRef, ignoreClickRefs, onEscape, ...rest}: OverlayProps
  ): ReactElement | null => {
    const overlayProps = useOverlay({returnFocusRef, onEscape, ignoreClickRefs, onClickOutside, initialFocusRef})
    return <StyledOverlay {...overlayProps} {...rest}/>
}

Overlay.defaultProps = {
  height: 'auto',
  width: 'auto'
}

export default Overlay