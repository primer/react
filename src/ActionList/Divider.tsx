import React from 'react'
import Box from '../Box'
import {get} from '../constants'
import {Theme} from '../ThemeProvider'
import {SxProp, merge} from '../sx'

export type ActionListDividerProps = {
  as?: React.ElementType
} & SxProp

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export const Divider: React.FC<React.PropsWithChildren<ActionListDividerProps>> = ({sx = {}, as = 'li'}) => {
  return (
    <Box
      as={as}
      aria-hidden="true"
      role="separator"
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
