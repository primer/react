import {List} from './List'
export type {ListProps as ActionListProps} from './List'
import {Group} from './Group'
export type {GroupProps} from './Group'
import {Item} from './Item'
export type {ItemProps} from './Item'
import {Divider} from './Divider'

/**
 * Collection of list-related components.
 */
export const ActionList = Object.assign(List, {
  /** Collects related `Items` in an `ActionList`. */
  Group,

  /** An actionable or selectable `Item` with an optional icon and description. */
  Item,

  /** Visually separates `Item`s or `Group`s in an `ActionList`. */
  Divider
})
