import React from 'react'
import {cn} from '../../internal/cn'

export type VisuallyHiddenProps = React.HTMLAttributes<HTMLSpanElement>

export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(function VisuallyHidden(
  {className, ...rest},
  ref,
) {
  return (
    <span
      {...rest}
      ref={ref}
      data-component="VisuallyHidden"
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-1 focus:h-auto focus:w-auto focus:overflow-visible focus:whitespace-normal focus:rounded-sm focus:bg-default focus:p-2 focus:text-default focus:outline-2 focus:outline-focus',
        className,
      )}
    />
  )
})

VisuallyHidden.displayName = 'VisuallyHidden'
