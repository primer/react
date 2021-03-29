import React from 'react'
import {ItemProps} from './Item'

export interface GroupProps extends React.ComponentPropsWithoutRef<'div'> {
  renderItem?: (props: ItemProps) => JSX.Element
}

export function Group({renderItem: _renderItem, ...props}: GroupProps): JSX.Element {
  return <div {...props} />
}
