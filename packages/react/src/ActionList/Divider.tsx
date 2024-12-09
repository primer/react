import React from 'react'
import Box from '../Box'
import {get} from '../constants'
import type {Theme} from '../ThemeProvider'
import type {SxProp} from '../sx'
import {merge} from '../sx'

export type ActionListDividerProps = SxProp

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export const Divider: React.FC<React.PropsWithChildren<ActionListDividerProps>> = ({sx = {}}) => {
  return (
    <Box
      as="li"
      aria-hidden="true"
      sx={merge(
        {
          height: 1,
          backgroundColor: 'actionListItem.inlineDivider',
          marginTop: (theme: Theme) => `calc(${get('space.2')(theme)} - 1px)`,
          marginBottom: 2,
          listStyle: 'none', // hide the ::marker inserted by browser's stylesheet
          marginRight: 'calc(-1 * var(--base-size-8, 8px))',
          marginLeft: 'calc(-1 * var(--base-size-8, 8px))',
        },
        sx as SxProp,
      )}
      data-component="ActionList.Divider"
    />
  )
}
