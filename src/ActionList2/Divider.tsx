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
        backgroundColor: 'border.muted',
        marginTop: (theme: Theme) => `calc(${get('space.2')(theme)} - 1px)`,
        marginBottom: 2
      }}
      data-component="ActionList.Divider"
    />
  )
}
