/*
TODO
- Decide props for ActionBar
- Add api docs
- Add proper types
- Size should be based on actionbar size
- Divider is loopy
- Add more functionality with responsiveness
*/

import React from 'react'
//import styled from 'styled-components'
import {IconButton, IconButtonProps} from '../Button'
import Box from '../Box'
// import {get} from '../constants'
//import sx, {BetterCssProperties, BetterSystemStyleObject, SxProp, merge} from '../sx'
// import {ComponentProps} from '../utils/types'
// import {ResponsiveValue, isResponsiveValue} from '../hooks/useResponsiveValue'
// import {getBreakpointDeclarations} from '../utils/getBreakpointDeclarations'
// import {defaultSxProp} from '../utils/defaultSxProp'

export type ActionBarProps = {
  children: any
}

export type ActionBarIconButtonProps = IconButtonProps

export const ActionBar: React.FC<React.PropsWithChildren<ActionBarProps>> = ({children}) => {
  return <Box>{children}</Box>
}

export const ActionBarIconButton = (props: ActionBarIconButtonProps) => {
  //height should be based on actionbar size
  return <IconButton {...props} variant="invisible" />
}

export const VerticalDivider = () => {
  //height should be based on actionbar size
  return (
    <Box
      aria-hidden="true"
      sx={{
        display: 'inline-block',
        borderLeft: '1px solid',
        borderColor: 'actionListItem.inlineDivider',
        height: '24px',
        mx: 2,
      }}
    />
  )
}
