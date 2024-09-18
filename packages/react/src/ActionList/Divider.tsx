import React from 'react'
import Box from '../Box'
import {get} from '../constants'
import type {Theme} from '../ThemeProvider'
import type {SxProp} from '../sx'
import {merge} from '../sx'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './ActionList.module.css'

export type ActionListDividerProps = SxProp

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export const Divider: React.FC<React.PropsWithChildren<ActionListDividerProps>> = ({sx = {}}) => {
  const enabled = useFeatureFlag('primer_react_css_modules_team')
  if (enabled) {
    if (sx) {
      return (
        <Box className={clsx(classes.Divider)} as="li" aria-hidden="true" sx={sx} data-component="ActionList.Divider" />
      )
    }
    return <li className={clsx(classes.Divider)} aria-hidden="true" data-component="ActionList.Divider" />
  }
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
        },
        sx as SxProp,
      )}
      data-component="ActionList.Divider"
    />
  )
}
