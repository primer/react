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
      as="hr"
      sx={{
        border: 'none', // override browser styles
        height: 1,
        backgroundColor: 'border.muted',
        marginTop: (theme: Theme) => `calc(${get('space.2')(theme)} - 1px)`,
        marginBottom: 2
      }}
      data-component="ActionList.Divider"
    />
  )
}

/**
 * `Divider` fulfills the `ItemPropsWithCustomRenderer` contract,
 * so it can be used inline in an `ActionList`’s `items` prop.
 * In other words, `items={[ActionList.Divider]}` is supported as a concise
 * alternative to `items={[{renderItem: () => <ActionList.Divider />}]}`.
 */
Divider.renderItem = Divider
