import React from 'react'
import Box from '../Box'
// import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

export type ActionListTrailingActionProps = {
  as?: 'button' | 'a'
  href?: string
  icon: React.ElementType
  'aria-label': string
  showOnHover?: boolean
}

export type TrailingActionProps = {
  children: React.ReactElement
  showOnHover?: boolean
}
export const TrailingAction: React.FC<TrailingActionProps> = ({children, showOnHover = false}) => {
  return (
    <Box
      sx={{
        display: showOnHover ? 'none' : 'flex',
      }}
      data-component="ActionList_TrailingAction"
    >
      {children}
    </Box>
  )
}

TrailingAction.displayName = 'ActionList.TrailingAction'
