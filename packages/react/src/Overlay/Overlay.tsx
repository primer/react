import type {ComponentPropsWithRef, ReactElement} from 'react'
import React, {useEffect, useRef} from 'react'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import type {AriaRole, Merge} from '../utils/types'
import type {TouchOrMouseEvent} from '../hooks'
import {useOverlay} from '../hooks'
import Portal from '../Portal'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import type {AnchorSide} from '@primer/behaviors'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './Overlay.module.css'
import {clsx} from 'clsx'

type StyledOverlayProps = {
  width?: keyof typeof widthMap
  height?: keyof typeof heightMap
  maxHeight?: keyof Omit<typeof heightMap, 'auto' | 'initial'>
  maxWidth?: keyof Omit<typeof widthMap, 'auto'>
  visibility?: 'visible' | 'hidden'
  overflow?: 'auto' | 'hidden' | 'scroll' | 'visible'
  style?: React.CSSProperties
}

export const heightMap = {
  xsmall: '192px',
  small: '256px',
  medium: '320px',
  large: '432px',
  xlarge: '600px',
  auto: 'auto',
  initial: 'auto', // Passing 'initial' initially applies 'auto'
  'fit-content': 'fit-content',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const widthMap = {
  small: '256px',
  medium: '320px',
  large: '480px',
  xlarge: '640px',
  xxlarge: '960px',
  auto: 'auto',
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

type BaseOverlayProps = {
  visibility?: 'visible' | 'hidden'
  'data-test-id'?: unknown
  position?: React.CSSProperties['position']
  top?: React.CSSProperties['top']
  left?: React.CSSProperties['left']
  right?: React.CSSProperties['right']
  bottom?: React.CSSProperties['bottom']
  role?: AriaRole
  children?: React.ReactNode
  className?: string
  responsiveVariant?: 'fullscreen' // we only support fullscreen today but we might add bottomsheet in the future
}

type OwnOverlayProps = Merge<StyledOverlayProps, BaseOverlayProps>

/**
 * An `Overlay` is a flexible floating surface, used to display transient content such as menus,
 * selection options, dialogs, and more. Overlays use shadows to express elevation. The `Overlay`
 * component handles all behaviors needed by overlay UIs as well as the common styles that all overlays * should have.
 * @param height Sets the height of the `Overlay`, pick from our set list of heights, or pass `auto` to automatically set the height based on the content of the `Overlay`, or pass `initial` to set the height based on the initial content of the `Overlay` (i.e. ignoring content changes). `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.
 * @param width Sets the width of the `Overlay`, pick from our set list of widths, or pass `auto` to automatically set the width based on the content of the `Overlay`. `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `480px`, `xlarge` corresponds to `640px`, `xxlarge` corresponds to `960px`.
 * @param maxHeight Sets the maximum height of the `Overlay`, pick from our set list of heights. `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.
 * @param top Optional. Vertical top position of the overlay, relative to its closest positioned ancestor (often its `Portal`).
 * @param left Optional. Horizontal left position of the overlay, relative to its closest positioned ancestor (often its `Portal`).
 * @param right Optional. Horizontal right position of the overlay, relative to its closest positioned ancestor (often its `Portal`).
 * @param bottom Optional. Vertical bottom position of the overlay, relative to its closest positioned ancestor (often its `Portal`).
 * @param position Optional. Sets how an element is positioned in a document. Defaults to `absolute` positioning.
 */
export const BaseOverlay = React.forwardRef(
  (
    {
      visibility,
      height,
      width,
      top,
      left,
      right,
      bottom,
      position,
      style: styleFromProps,
      className,
      maxHeight,
      maxWidth,
      as: Component = 'div',
      ...rest
    },
    forwardedRef,
  ): ReactElement => {
    return (
      <Component
        {...rest}
        ref={forwardedRef}
        style={
          {
            left,
            right,
            top,
            bottom,
            position,
            ...styleFromProps,
          } as React.CSSProperties
        }
        {...{
          [`data-width-${width}`]: '',
          [`data-max-width-${maxWidth}`]: maxWidth ? '' : undefined,
          [`data-height-${height}`]: '',
          [`data-max-height-${maxHeight}`]: maxHeight ? '' : undefined,
          [`data-visibility-${visibility}`]: '',
          [`data-overflow-${rest.overflow}`]: rest.overflow ? '' : undefined,
        }}
        className={clsx(className, classes.Overlay)}
      />
    )
  },
) as PolymorphicForwardRefComponent<'div', OwnOverlayProps>

type ContainerProps = {
  anchorSide?: AnchorSide
  ignoreClickRefs?: React.RefObject<HTMLElement>[]
  initialFocusRef?: React.RefObject<HTMLElement>
  onClickOutside: (e: TouchOrMouseEvent) => void
  onEscape: (e: KeyboardEvent) => void
  portalContainerName?: string
  preventOverflow?: boolean
  preventFocusOnOpen?: boolean
  returnFocusRef: React.RefObject<HTMLElement>
}

type internalOverlayProps = Merge<OwnOverlayProps, ContainerProps>

/**
 * @param anchorSide If provided, the Overlay will slide into position from the side of the anchor with a brief animation
 * @param height Sets the height of the `Overlay`, pick from our set list of heights, or pass `auto` to automatically set the height based on the content of the `Overlay`, or pass `initial` to set the height based on the initial content of the `Overlay` (i.e. ignoring content changes). `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.
 * @param ignoreClickRefs Optional. An array of ref objects to ignore clicks on in the `onOutsideClick` behavior. This is often used to ignore clicking on the element that toggles the open/closed state for the `Overlay` to prevent the `Overlay` from being toggled twice.
 * @param initialFocusRef Optional. Ref for the element to focus when the `Overlay` is opened. If nothing is provided, the first focusable element in the `Overlay` body is focused.
 * @param left Optional. Horizontal left position of the overlay, relative to its closest positioned ancestor (often its `Portal`).
 * @param onClickOutside  Required. Function to call when clicking outside of the `Overlay`. Typically this function removes the Overlay.
 * @param onEscape Required. Function to call when user presses `Escape`. Typically this function removes the Overlay.
 * @param portalContainerName Optional. The name of the portal container to render the Overlay into.
 * @param preventOverflow Optional. The Overlay width will be adjusted responsively if there is not enough space to display the Overlay. If `preventOverflow` is `true`, the width of the `Overlay` will not be adjusted.
 * @param preventFocusOnOpen Optional. If 'true', focus will not be applied when the component is first mounted, even if initialFocusRef prop is given.
 * @param returnFocusRef Required. Ref for the element to focus when the `Overlay` is closed.
 * @param right Optional. Horizontal right position of the overlay, relative to its closest positioned ancestor (often its `Portal`).
 * @param width Sets the width of the `Overlay`, pick from our set list of widths, or pass `auto` to automatically set the width based on the content of the `Overlay`. `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `480px`, `xlarge` corresponds to `640px`, `xxlarge` corresponds to `960px`.

 */
const Overlay = React.forwardRef<HTMLDivElement, internalOverlayProps>(
  (
    {
      anchorSide,
      height = 'auto',
      ignoreClickRefs,
      initialFocusRef,
      left,
      onClickOutside,
      onEscape,
      portalContainerName,
      preventOverflow = true,
      preventFocusOnOpen,
      returnFocusRef,
      right,
      role = 'none',
      visibility = 'visible',
      width = 'auto',
      responsiveVariant,
      ...props
    },
    forwardedRef,
  ): ReactElement => {
    const overlayRef = useRef<HTMLDivElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, overlayRef)
    const slideAnimationDistance = 8 // var(--base-size-8), hardcoded to do some math
    const slideAnimationEasing = 'cubic-bezier(0.33, 1, 0.68, 1)'

    useOverlay({
      overlayRef,
      returnFocusRef,
      onEscape,
      ignoreClickRefs,
      onClickOutside,
      initialFocusRef,
      preventFocusOnOpen,
    })

    useEffect(() => {
      if (height === 'initial' && overlayRef.current?.clientHeight) {
        overlayRef.current.style.height = `${overlayRef.current.clientHeight}px`
      }
    }, [height])

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
          easing: slideAnimationEasing,
        },
      )
    }, [anchorSide, slideAnimationDistance, slideAnimationEasing, visibility])

    // To be backwards compatible with the old Overlay, we need to set the left prop if x-position is not specified
    const leftPosition = left === undefined && right === undefined ? 0 : left

    const overflowEnabled = useFeatureFlag('primer_react_overlay_overflow')
    return (
      <Portal containerName={portalContainerName}>
        <BaseOverlay
          role={role}
          width={width}
          data-reflow-container={overflowEnabled || !preventOverflow ? true : undefined}
          ref={overlayRef}
          left={leftPosition}
          right={right}
          height={height}
          visibility={visibility}
          data-responsive={responsiveVariant}
          {...props}
        />
      </Portal>
    )
  },
) as PolymorphicForwardRefComponent<'div', internalOverlayProps>

export type OverlayProps = ComponentPropsWithRef<typeof Overlay>

export default Overlay
