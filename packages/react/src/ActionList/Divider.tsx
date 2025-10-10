import type React from 'react'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'

export type ActionListDividerProps = {
  className?: string
  style?: React.CSSProperties
}

/**
 * Visually separates `Items` or `Groups` in an `ActionList`.
 */
export const Divider: React.FC<React.PropsWithChildren<ActionListDividerProps>> = ({className, style}) => {
  return (
    <li
      className={clsx(className, classes.Divider)}
      style={style}
      aria-hidden="true"
      data-component="ActionList.Divider"
    />
  )
}

// @ts-ignore - TypeScript doesn't know about the __SLOT__ property
Divider.__SLOT__ = Symbol('ActionList.Divider')
