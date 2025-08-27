import React from 'react'
import {clsx} from 'clsx'
import type {MaxWidthProps} from 'styled-system'
import type {SxProp} from '../sx'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import classes from './Truncate.module.css'

type TruncateProps = React.HTMLAttributes<HTMLElement> & {
  title: string
  inline?: boolean
  expandable?: boolean
} & MaxWidthProps &
  SxProp

const Truncate = React.forwardRef(function Truncate(
  {as, children, className, title, inline, expandable, maxWidth = 125, style, sx, ...rest},
  ref,
) {
  return (
    <BoxWithFallback
      {...rest}
      ref={ref}
      as={as}
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
      sx={sx}
    >
      {children}
    </BoxWithFallback>
  )
}) as PolymorphicForwardRefComponent<'div', TruncateProps>

if (__DEV__) {
  Truncate.displayName = 'Truncate'
}

export type {TruncateProps}
export default Truncate
