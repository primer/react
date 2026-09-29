import React from 'react'
import {clsx} from 'clsx'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import classes from './Truncate.module.css'

type TruncateProps = React.HTMLAttributes<HTMLElement> & {
  title: string
  inline?: boolean
  expandable?: boolean
  maxWidth?: number | string
}

const Truncate = React.forwardRef(function Truncate(
  {as: Component = 'div', children, className, title, inline, expandable, maxWidth = 125, style, ...rest},
  ref,
) {
  // Forward `inline` to custom components (e.g. `Link`) that also accept it, but not to DOM elements
  const passthroughProps = typeof Component === 'string' ? {} : {inline}

  return (
    <Component
      {...passthroughProps}
      {...rest}
      ref={ref}
      className={clsx(className, classes.Truncate)}
      data-expandable={expandable}
      data-inline={inline}
      title={title}
      style={
        {
          ...style,
          [`--truncate-max-width`]:
            typeof maxWidth === 'number' ? `${maxWidth}px` : typeof maxWidth === 'string' ? maxWidth : undefined,
        } as React.CSSProperties
      }
    >
      {children}
    </Component>
  )
}) as PolymorphicForwardRefComponent<'div', TruncateProps>

if (__DEV__) {
  Truncate.displayName = 'Truncate'
}

export type {TruncateProps}
export default Truncate
