import React from 'react'
import {cn} from '../../internal/cn'

export interface TruncateProps extends React.HTMLAttributes<HTMLElement> {
  /** Element or component to render, such as `Link` for a truncated link. Components also receive `inline`. */
  as?: React.ElementType
  /** URL to navigate to when `as` renders a link. */
  href?: string
  /** Full text, shown on hover and kept available to assistive technology when the text is clipped. */
  title: string
  /** Renders inline rather than as a block. */
  inline?: boolean
  /** Reveals the full text on hover and focus. */
  expandable?: boolean
  /** Width past which the text is clipped. */
  maxWidth?: number | string
}

export const Truncate = React.forwardRef<HTMLElement, TruncateProps>(function Truncate(
  {as: Component = 'div', className, expandable, inline, maxWidth = 125, style, ...rest},
  ref,
) {
  const passthroughProps = typeof Component === 'string' ? {} : {inline}

  return (
    <Component
      {...passthroughProps}
      {...rest}
      ref={ref}
      title={rest.title}
      data-component="Truncate"
      data-expandable={expandable || undefined}
      className={cn(
        inline ? 'inline-block align-top' : 'block',
        'max-w-(--truncate-max-width) truncate',
        expandable && 'hover:max-w-[10000px] focus-within:max-w-[10000px]',
        className,
      )}
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
