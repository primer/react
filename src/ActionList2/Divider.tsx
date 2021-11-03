import React from 'react'
import Box from '../Box'
import {get} from '../constants'
import {Theme} from '../ThemeProvider'

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export function Divider(): JSX.Element {
  return (
    <Box
      as="li"
      role="separator"
      sx={{
        height: 1,
        backgroundColor: 'actionListItem.inlineDivider',
        marginTop: (theme: Theme) => `calc(${get('space.2')(theme)} - 1px)`,
        marginBottom: 2,
        listStyle: 'none' // hide the ::marker inserted by browser's stylesheet
      }}
      data-component="ActionList.Divider"
    />
  )
}
