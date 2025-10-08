import React from 'react'
import {clsx} from 'clsx'
import type {MaxWidthProps} from 'styled-system'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import classes from './Truncate.module.css'

type TruncateProps = React.HTMLAttributes<HTMLElement> & {
  title: string
  inline?: boolean
  expandable?: boolean
} & MaxWidthProps

const Truncate = React.forwardRef(function Truncate(
  {as: Component = 'div', children, className, title, inline, expandable, maxWidth = 125, style, ...rest},
  ref,
) {
  return (
    <Component
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
