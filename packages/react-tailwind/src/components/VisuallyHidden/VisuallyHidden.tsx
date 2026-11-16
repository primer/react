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
        'primer:sr-only primer:focus:not-sr-only primer:focus:absolute primer:focus:z-skip-link primer:focus:m-1 primer:focus:h-auto primer:focus:w-auto primer:focus:overflow-visible primer:focus:whitespace-normal primer:focus:rounded-sm primer:focus:bg-default primer:focus:p-2 primer:focus:text-default primer:focus:outline-2 primer:focus:outline-focus primer:focus:outline-offset-focus',
        className,
      )}
    />
  )
})

VisuallyHidden.displayName = 'VisuallyHidden'
