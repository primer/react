import React from 'react'
import {cn} from '../../internal/cn'

export interface TruncateProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  title: string
  inline?: boolean
  expandable?: boolean
  maxWidth?: number | string
}

export const Truncate = React.forwardRef<HTMLElement, TruncateProps>(function Truncate(
  {as: Component = 'span', className, expandable, inline, maxWidth = 125, style, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref}
      title={rest.title}
      data-component="Truncate"
      data-expandable={expandable || undefined}
      className={cn(inline ? 'inline-block' : 'block', 'max-w-(--truncate-max-width) truncate', className)}
      style={
        {
          '--truncate-max-width': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          ...style,
        } as React.CSSProperties
      }
    />
  )
})

Truncate.displayName = 'Truncate'
