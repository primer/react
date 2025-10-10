import {List} from './List'
import {Group} from './Group'
import {Item} from './Item'
import {Divider} from './Divider'
export type {ListProps as ActionListProps, GroupedListProps, ItemInput} from './List'
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

// @ts-ignore -- TS doesn't know about the __SLOT__ property
List.__SLOT__ = Symbol('DEPRECATED_ActionList')
// @ts-ignore -- TS doesn't know about the __SLOT__ property
Group.__SLOT__ = Symbol('DEPRECATED_ActionList.Group')
Item.__SLOT__ = Symbol('DEPRECATED_ActionList.Item')
// @ts-ignore -- TS doesn't know about the __SLOT__ property
Divider.__SLOT__ = Symbol('DEPRECATED_ActionList.Divider')
