import React from 'react'
import type {SystemStyleObject} from '@styled-system/css'
import {actionListItemDivider, s16, s8} from './variables'
import {StyledDiv} from './StyledDiv'

export interface ActionListSectionDividerProps extends React.ComponentPropsWithoutRef<'div'> {
  [key: string]: unknown
}

const actionListSectionDividerStyles: SystemStyleObject = {
  position: 'relative',
  height: '1px',
  background: actionListItemDivider,
  border: 0,
  margin: `${s8 - 1}px ${-s8}px ${s8}px`,
  padding: 0,

  '::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    width: `calc(100% - ${s16}px)`,
    height: '1px',
    background: actionListItemDivider,
    top: 0,
    left: `${s8}px`
  }
}

export function ActionListSectionDivider(props: ActionListSectionDividerProps): JSX.Element {
  return <StyledDiv data-component="ActionListSectionDivider" sx={actionListSectionDividerStyles} {...props} />
}
