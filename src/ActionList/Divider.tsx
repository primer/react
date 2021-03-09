import React from 'react'
import type {SystemStyleObject} from '@styled-system/css'
import {actionListItemDivider, s16, s8} from './private/variables'
import {StyledDiv} from './private/StyledDiv'

export interface DividerProps {}

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

export function Divider(props?: DividerProps): JSX.Element {
  return <StyledDiv data-component="ActionList.Divider" sx={actionListSectionDividerStyles} {...props} />
}
Divider.renderItem = Divider
