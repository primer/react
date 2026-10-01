import type React from 'react'
import type {ForwardedRef} from 'react'
import {clsx} from 'clsx'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'
import classes from './Truncate.module.css'

type TruncateOwnProps = {
  title: string
  inline?: boolean
  expandable?: boolean
  maxWidth?: number | string
  className?: string
  style?: React.CSSProperties
}

export type TruncateProps<As extends React.ElementType = 'div'> = PolymorphicProps<As, 'div', TruncateOwnProps>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Truncate<As extends React.ElementType = 'div'>(props: TruncateProps<As>, ref: ForwardedRef<any>) {
  const {as: Component = 'div', children, className, title, inline, expandable, maxWidth = 125, style, ...rest} = props

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
}

Truncate.displayName = 'Truncate'

export default fixedForwardRef(Truncate)
