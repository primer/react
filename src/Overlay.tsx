import styled from 'styled-components'
import React, { forwardRef } from 'react'
import {get} from './constants'
import theme from './theme'
import {ComponentProps} from './utils/types'
import {useCloseOnOutsideClick, useProvidedRefOrCreate} from './hooks'

type StyledOverlayProps = {
  width?: keyof typeof widthMap
  height?: keyof typeof heightMap
}

/* TODO should we allow custom heights/widths? */

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
  insideRefs?: React.RefObject<HTMLElement>[]
  isOpen: boolean
  onClickOutside: (e: MouseEvent) => void
} & ComponentProps<typeof StyledOverlay>

const Overlay = forwardRef<HTMLElement, OverlayProps>(
  (
    {insideRefs, isOpen, onClickOutside, ...rest},
    forwardedRef: React.ForwardedRef<HTMLElement>
  ) => {
    const overlayRef = useProvidedRefOrCreate<React.ForwardedRef<HTMLDivElement>>(forwardedRef)
    useCloseOnOutsideClick(insideRefs, isOpen, onClickOutside)
    return (
      <StyledOverlay ref={overlayRef} {...rest}/>
    )
})

Overlay.defaultProps = {
  theme,
  height: 'auto',
  width: 'auto'
}

export default Overlay