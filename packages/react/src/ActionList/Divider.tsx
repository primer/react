import React from 'react'
import type {SxProp} from '../sx'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

export type ActionListDividerProps = SxProp & {
  className?: string
}

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export const Divider: React.FC<React.PropsWithChildren<ActionListDividerProps>> = ({sx = defaultSxProp, className}) => {
  return (
    <BoxWithFallback
      className={clsx(className, classes.Divider)}
      as="li"
      aria-hidden="true"
      sx={sx}
      data-component="ActionList.Divider"
    />
  )
}
