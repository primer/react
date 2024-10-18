import React from 'react'
import Box from '../Box'
import {get} from '../constants'
import type {Theme} from '../ThemeProvider'
import type {SxProp} from '../sx'
import {merge} from '../sx'

export type ActionListDividerProps = SxProp & {
  className?: string
}

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export const Divider: React.FC<React.PropsWithChildren<ActionListDividerProps>> = ({sx = {}, className}) => {
  return (
    <Box
      as="li"
      aria-hidden="true"
      className={className}
      sx={merge(
        {
          height: 1,
          backgroundColor: 'actionListItem.inlineDivider',
          marginTop: (theme: Theme) => `calc(${get('space.2')(theme)} - 1px)`,
          marginBottom: 2,
          listStyle: 'none', // hide the ::marker inserted by browser's stylesheet
        },
        sx as SxProp,
      )}
      data-component="ActionList.Divider"
    />
  )
}
