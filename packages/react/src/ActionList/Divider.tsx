import React from 'react'
import Box from '../Box'
import type {SxProp} from '../sx'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'

export type ActionListDividerProps = SxProp & {
  className?: string
}

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export const Divider: React.FC<React.PropsWithChildren<ActionListDividerProps>> = ({sx = defaultSxProp, className}) => {
  if (sx !== defaultSxProp) {
    return (
      <Box
        className={clsx(className, classes.Divider)}
        as="li"
        aria-hidden="true"
        sx={sx}
        data-component="ActionList.Divider"
      />
    )
  }
  return <li className={clsx(className, classes.Divider)} aria-hidden="true" data-component="ActionList.Divider" />
}
