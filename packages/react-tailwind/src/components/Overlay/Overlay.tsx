import React from 'react'
import {cn} from '../../internal/cn'

const overlayClassName =
  'absolute min-w-48 max-w-[calc(100vw-var(--base-size-32))] max-h-dvh overflow-auto rounded-lg bg-default text-default shadow-floating-sm outline-none contrast-more:border-current motion-safe:transition motion-safe:duration-200 motion-reduce:transition-none'

export type OverlayProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'data-component'>

/**
 * A presentational floating surface. Use it when positioning and dismissal are
 * provided by another primitive, or use AnchoredOverlay, Popover, or Dialog for
 * an interactive overlay pattern.
 */
export const Overlay = React.forwardRef<HTMLElement, OverlayProps>(function Overlay({className, ...rest}, ref) {
  return (
    <div
      {...rest}
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(overlayClassName, className)}
      data-component="Overlay"
    />
  )
})

Overlay.displayName = 'Overlay'

export const OverlayContent = React.forwardRef<HTMLElement, OverlayProps>(function OverlayContent(props, ref) {
  const {className, ...rest} = props
  return (
    <div
      {...rest}
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(overlayClassName, className)}
      data-component="Overlay.Content"
    />
  )
})

OverlayContent.displayName = 'Overlay.Content'

export const OverlayRoot = Overlay

export const OverlayParts = Object.assign(Overlay, {
  Root: OverlayRoot,
  Content: OverlayContent,
})
