import type {SystemStyleObject} from '@styled-system/css'
import React from 'react'
import {StyledDiv} from './StyledDiv'

export interface ActionListProps extends React.ComponentPropsWithoutRef<'div'> {
  [key: string]: unknown
}

const actionListStyles: SystemStyleObject = {
  fontSize: '14px'
}

export function ActionList(props: ActionListProps): JSX.Element {
  return <StyledDiv data-component="ActionList" sx={actionListStyles} {...props} />
}
