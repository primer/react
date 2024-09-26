import {List} from './List'
import {Group} from './Group'
import {Item} from './Item'
import {Divider} from './Divider'
export type {ListProps as ActionListProps} from './List'
export type {GroupProps} from './Group'
export type {ItemProps} from './Item'

/**
 * @deprecated Use ActionList with composable API instead. See https://primer.style/react/ActionList for more details.
 */
export const ActionList = Object.assign(List, {
  /** Collects related `Items` in an `ActionList`. */
  Group,

  /** An actionable or selectable `Item` with an optional icon and description. */
  Item,

  /** Visually separates `Item`s or `Group`s in an `ActionList`. */
  Divider,
})
