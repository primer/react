import styled from 'styled-components'
import React, { forwardRef, useRef } from 'react'
import {get} from './constants'
import theme from './theme'
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
`

export type OverlayProps = {
  triggerRef: React.RefObject<HTMLElement>
  isOpen: boolean
  returnRef: React.RefObject<HTMLElement>
  onClickOutside: (e: TouchOrMouseEvent) => void
  onEscape: (e: KeyboardEvent) => void
} & ComponentProps<typeof StyledOverlay>

const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  (
    {isOpen, onClickOutside, returnRef, triggerRef, onEscape, ...rest},
    forwardedRef
  ) => {
    const overlayProps = useOverlay({forwardedRef, returnRef, onEscape, triggerRef, onClickOutside, isOpen})
    return (
      <StyledOverlay {...overlayProps} {...rest}/>
    )
})

Overlay.defaultProps = {
  theme,
  height: 'auto',
  width: 'auto'
}

export default Overlay