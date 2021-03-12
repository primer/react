import React from 'react'
import {ItemProps} from './Item'

export interface GroupProps extends React.ComponentPropsWithoutRef<'div'> {
  renderItem?: (props: ItemProps) => JSX.Element
}

export function Group(props: GroupProps): JSX.Element {
  return <div data-component="ActionList.Group" {...props} />
}
