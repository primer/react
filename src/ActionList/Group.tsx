import React from 'react'
import {ItemProps} from './Item'

/**
 * Contract for props passed to the `Group` component.
 */
export interface GroupProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * A `Group`-level custom `Item` renderer. Every `Item` within this `Group`
   * without an `Item`-level custom `Item` renderer will be rendered using
   * this function component.
   */
  renderItem?: (props: ItemProps) => JSX.Element
}

/**
 * Collects related `Items` in an `ActionList`.
 */
export function Group({renderItem: _renderItem, ...props}: GroupProps): JSX.Element {
  return <div {...props} />
}
