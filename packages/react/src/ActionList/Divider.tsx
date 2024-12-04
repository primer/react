import React from 'react'
import Box from '../Box'
import {get} from '../constants'
import type {Theme} from '../ThemeProvider'
import type {SxProp} from '../sx'
import {merge} from '../sx'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './ActionList.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'

export type ActionListDividerProps = SxProp

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
export const Divider: React.FC<React.PropsWithChildren<ActionListDividerProps>> = ({sx = defaultSxProp}) => {
  const enabled = useFeatureFlag('primer_react_css_modules_team')
  if (enabled) {
    if (sx !== defaultSxProp) {
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
          marginRight: 'calc(-1 * var(--base-size-8))',
          marginLeft: 'calc(-1 * var(--base-size-8))',
        },
        sx as SxProp,
      )}
      data-component="ActionList.Divider"
    />
  )
}
