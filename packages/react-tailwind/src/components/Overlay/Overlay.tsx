import React from 'react'
import {cn} from '../../internal/cn'

const overlayClassName =
  'primer:absolute primer:min-w-48 primer:max-w-[calc(100vw-var(--base-size-32))] primer:max-h-dvh primer:overflow-auto primer:rounded-lg primer:bg-[var(--overlay-bgColor)] primer:text-default primer:shadow-floating-sm primer:outline-none primer:contrast-more:border-current primer:motion-safe:transition primer:motion-safe:duration-200 primer:motion-reduce:transition-none'

export type OverlayProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'data-component'>

/**
 * A presentational floating surface. Use it when positioning and dismissal are
 * provided by another primitive, or use AnchoredOverlay, Popover, or Dialog for
 * an interactive overlay pattern.
 */
export const OverlayRoot = React.forwardRef<HTMLElement, OverlayProps>(function Overlay({className, ...rest}, ref) {
  return (
    <div
      {...rest}
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(overlayClassName, className)}
      data-component="Overlay"
    />
  )
})

OverlayRoot.displayName = 'Overlay'

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

export const Overlay = Object.assign(OverlayRoot, {
  Root: OverlayRoot,
  Content: OverlayContent,
})
