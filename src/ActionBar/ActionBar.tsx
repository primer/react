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

const ActionBarContext = React.createContext<{size: Size}>({size: 'medium'})

/*
small (28px), medium (32px), large (40px)
*/
type Size = 'small' | 'medium' | 'large'

export type ActionBarProps = {
  size?: Size
  children: any
}

export type ActionBarIconButtonProps = IconButtonProps

export const ActionBar: React.FC<React.PropsWithChildren<ActionBarProps>> = props => {
  const {size = 'medium', children} = props
  const sx = {
    display: 'inline-flex',
    alignItems: 'center',
    height: size === 'small' ? '28px' : size === 'medium' ? '32px' : '40px',
  }
  return (
    <ActionBarContext.Provider value={{size}}>
      <Box sx={sx}>{children}</Box>
    </ActionBarContext.Provider>
  )
}

export const ActionBarIconButton = (props: ActionBarIconButtonProps) => {
  const {size} = React.useContext(ActionBarContext)
  return <IconButton data-component="ActionBar.IconButton" size={size} {...props} variant="invisible" />
}

const sizeToHeight = {
  small: '24px',
  medium: '28px',
  large: '32px',
}
export const VerticalDivider = () => {
  const {size} = React.useContext(ActionBarContext)

  return (
    <Box
      data-component="ActionBar.VerticalDivider"
      aria-hidden="true"
      sx={{
        display: 'inline-block',
        borderLeft: '1px solid',
        borderColor: 'actionListItem.inlineDivider',
        height: sizeToHeight[size],
        mx: 2,
      }}
    />
  )
}
