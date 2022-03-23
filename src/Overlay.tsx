import styled from 'styled-components'
import React, {ComponentPropsWithRef, ReactElement, useEffect, useRef} from 'react'
import useLayoutEffect from './utils/useIsomorphicLayoutEffect'
import {get} from './constants'
import {AriaRole, Merge} from './utils/types'
import {useOverlay, TouchOrMouseEvent} from './hooks'
import Portal from './Portal'
import sx, {SxProp} from './sx'
import {useCombinedRefs} from './hooks/useCombinedRefs'
import type {AnchorSide} from '@primer/behaviors'
import {useTheme} from './ThemeProvider'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'

type StyledOverlayProps = {
  width?: keyof typeof widthMap
  height?: keyof typeof heightMap
  maxHeight?: keyof Omit<typeof heightMap, 'auto' | 'initial'>
  visibility?: 'visible' | 'hidden'
  anchorSide?: AnchorSide
} & SxProp

const heightMap = {
  xsmall: '192px',
  small: '256px',
  medium: '320px',
  large: '432px',
  xlarge: '600px',
  auto: 'auto',
  initial: 'auto' // Passing 'initial' initially applies 'auto'
}

const widthMap = {
  small: '256px',
  medium: '320px',
  large: '480px',
  xlarge: '640px',
  xxlarge: '960px',
  auto: 'auto'
}
const animationDuration = 200

function getSlideAnimationStartingVector(anchorSide?: AnchorSide): {x: number; y: number} {
  if (anchorSide?.endsWith('bottom')) {
    return {x: 0, y: -1}
  } else if (anchorSide?.endsWith('top')) {
    return {x: 0, y: 1}
  } else if (anchorSide?.endsWith('right')) {
    return {x: -1, y: 0}
  } else if (anchorSide?.endsWith('left')) {
    return {x: 1, y: 0}
  }

  return {x: 0, y: 0}
}

const StyledOverlay = styled.div<StyledOverlayProps>`
  background-color: ${get('colors.canvas.overlay')};
  box-shadow: ${get('shadows.overlay.shadow')};
  position: absolute;
  min-width: 192px;
  max-width: 640px;
  height: ${props => heightMap[props.height || 'auto']};
  max-height: ${props => props.maxHeight && heightMap[props.maxHeight]};
  width: ${props => widthMap[props.width || 'auto']};
  border-radius: 12px;
  overflow: hidden;
  animation: overlay-appear ${animationDuration}ms ${get('animation.easeOutCubic')};

  @keyframes overlay-appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  visibility: var(--styled-overlay-visibility);
  :focus {
    outline: none;
  }

  @media (forced-colors: active) {
    /* Support for Windows high contrast https://sarahmhigley.com/writing/whcm-quick-tips */
    outline: solid 1px transparent;
  }

  ${sx};
`
type BaseOverlayProps = {
  ignoreClickRefs?: React.RefObject<HTMLElement>[]
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
  onClickOutside: (e: TouchOrMouseEvent) => void
  onEscape: (e: KeyboardEvent) => void
  visibility?: 'visible' | 'hidden'
  'data-test-id'?: unknown
  top?: number
  left?: number
  portalContainerName?: string
  preventFocusOnOpen?: boolean
  role?: AriaRole
  children?: React.ReactNode
}

type OwnOverlayProps = Merge<StyledOverlayProps, BaseOverlayProps>

/**
 * An `Overlay` is a flexible floating surface, used to display transient content such as menus,
 * selection options, dialogs, and more. Overlays use shadows to express elevation. The `Overlay`
 * component handles all behaviors needed by overlay UIs as well as the common styles that all overlays * should have.
 * @param ignoreClickRefs Optional. An array of ref objects to ignore clicks on in the `onOutsideClick` behavior. This is often used to ignore clicking on the element that toggles the open/closed state for the `Overlay` to prevent the `Overlay` from being toggled twice.
 * @param initialFocusRef Optional. Ref for the element to focus when the `Overlay` is opened. If nothing is provided, the first focusable element in the `Overlay` body is focused.
 * @param returnFocusRef Required. Ref for the element to focus when the `Overlay` is closed.
 * @param onClickOutside  Required. Function to call when clicking outside of the `Overlay`. Typically this function removes the Overlay.
 * @param onEscape Required. Function to call when user presses `Escape`. Typically this function removes the Overlay.
 * @param width Sets the width of the `Overlay`, pick from our set list of widths, or pass `auto` to automatically set the width based on the content of the `Overlay`. `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `480px`, `xlarge` corresponds to `640px`, `xxlarge` corresponds to `960px`.
 * @param height Sets the height of the `Overlay`, pick from our set list of heights, or pass `auto` to automatically set the height based on the content of the `Overlay`, or pass `initial` to set the height based on the initial content of the `Overlay` (i.e. ignoring content changes). `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.
 * @param maxHeight Sets the maximum height of the `Overlay`, pick from our set list of heights. `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.
 * @param anchorSide If provided, the Overlay will slide into position from the side of the anchor with a brief animation
 * @param top Optional. Vertical position of the overlay, relative to its closest positioned ancestor (often its `Portal`).
 * @param left Optional. Horizontal position of the overlay, relative to its closest positioned ancestor (often its `Portal`).
 * @param portalContainerName Optional. The name of the portal container to render the Overlay into.
 */
const Overlay = React.forwardRef<HTMLDivElement, OwnOverlayProps>(
  (
    {
      onClickOutside,
      role = 'none',
      initialFocusRef,
      returnFocusRef,
      ignoreClickRefs,
      onEscape,
      visibility = 'visible',
      height,
      top,
      left,
      anchorSide,
      portalContainerName,
      preventFocusOnOpen,
      ...rest
    },
    forwardedRef
  ): ReactElement => {
    const overlayRef = useRef<HTMLDivElement>(null)
    const combinedRef = useCombinedRefs(overlayRef, forwardedRef)
    const {theme} = useTheme()
    const slideAnimationDistance = parseInt(get('space.2')(theme).replace('px', ''))
    const slideAnimationEasing = get('animation.easeOutCubic')(theme)

    useOverlay({
      overlayRef,
      returnFocusRef,
      onEscape,
      ignoreClickRefs,
      onClickOutside,
      initialFocusRef,
      preventFocusOnOpen
    })

    useEffect(() => {
      if (height === 'initial' && combinedRef.current?.clientHeight) {
        combinedRef.current.style.height = `${combinedRef.current.clientHeight}px`
      }
    }, [height, combinedRef])

    useLayoutEffect(() => {
      const {x, y} = getSlideAnimationStartingVector(anchorSide)
      if ((!x && !y) || !overlayRef.current?.animate || visibility === 'hidden') {
        return
      }

      // JS animation is required because Safari does not allow css animations to start paused and then run
      overlayRef.current.animate(
        {transform: [`translate(${slideAnimationDistance * x}px, ${slideAnimationDistance * y}px)`, `translate(0, 0)`]},
        {
          duration: animationDuration,
          easing: slideAnimationEasing
        }
      )
    }, [anchorSide, slideAnimationDistance, slideAnimationEasing, visibility])

    return (
      <Portal containerName={portalContainerName}>
        <StyledOverlay
          height={height}
          role={role}
          {...rest}
          ref={combinedRef}
          style={
            {
              top: `${top || 0}px`,
              left: `${left || 0}px`,
              '--styled-overlay-visibility': visibility
            } as React.CSSProperties
          }
        />
      </Portal>
    )
  }
) as PolymorphicForwardRefComponent<'div', OwnOverlayProps>

export type OverlayProps = ComponentPropsWithRef<typeof Overlay>

Overlay.defaultProps = {
  height: 'auto',
  width: 'auto'
}

export default Overlay
