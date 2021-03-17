import styled from 'styled-components'
import React, {ReactElement} from 'react'
import {get, COMMON, POSITION} from './constants'
import {ComponentProps} from './utils/types'
import {useOverlay, AnchoredPositionHookSettings, TouchOrMouseEvent} from './hooks'
import Portal from './Portal'

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
const StyledOverlay = styled.div<StyledOverlayProps>`
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
} & Omit<ComponentProps<typeof StyledOverlay>, 'visibility'>

// omit positions props

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
