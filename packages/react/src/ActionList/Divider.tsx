import type React from 'react'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'

export type ActionListDividerProps = {
  className?: string
}

/**
 * Visually separates `Items or `Groups in an `ActionList`.
 */
export const Divider: React.FC<React.PropsWithChildren<ActionListDividerProps>> = ({className}) => {
  return <li className={clsx(className, classes.Divider)} aria-hidden="true" data-component="ActionList.Divider" />
}
