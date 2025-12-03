import type React from 'react'
import {type CSSProperties, type PropsWithChildren, type JSX} from 'react'
import {clsx} from 'clsx'

import classes from './BaseStyles.module.css'

import 'focus-visible'

export type BaseStylesProps = PropsWithChildren & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any> | keyof JSX.IntrinsicElements
  className?: string
  style?: CSSProperties
  color?: string // Fixes `color` ts-error
}
function BaseStyles({children, color, className, as: Component = 'div', style, ...rest}: BaseStylesProps) {
  const newClassName = clsx(classes.BaseStyles, className)
  const baseStyles = {
    ['--BaseStyles-fgColor']: color,
  }

  return (
    <Component
      className={newClassName}
      data-portal-root
      style={{
        ...baseStyles,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default BaseStyles
