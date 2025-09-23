import type React from 'react'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

export type ActionListDividerProps = {
  className?: string
}

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export const Divider: React.FC<React.PropsWithChildren<ActionListDividerProps>> = ({className}) => {
  return (
    <BoxWithFallback
      className={clsx(className, classes.Divider)}
      as="li"
      aria-hidden="true"
      data-component="ActionList.Divider"
    />
  )
}
