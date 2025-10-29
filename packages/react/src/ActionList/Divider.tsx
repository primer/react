import type React from 'react'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'
import type {FCWithSlotMarker} from '../utils/types/Slots'

export type ActionListDividerProps = {
  className?: string
  style?: React.CSSProperties
}

/**
 * Visually separates `Items` or `Groups` in an `ActionList`.
 */
export const Divider: FCWithSlotMarker<React.PropsWithChildren<ActionListDividerProps>> = ({className, style}) => {
  return (
    <li
      className={clsx(className, classes.Divider)}
      style={style}
      aria-hidden="true"
      data-component="ActionList.Divider"
    />
  )
}

Divider.__SLOT__ = Symbol('ActionList.Divider')
