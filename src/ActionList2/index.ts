import {List} from './List'
import {Group} from './Group'
import {Item} from './Item'
import {Divider} from './Divider'
import {Description} from './Description'
import {LeadingVisual, TrailingVisual} from './Visuals'

export type {ListProps as ActionListProps} from './List'
export type {GroupProps} from './Group'
export type {ItemProps} from './Item'
export type {DescriptionProps} from './Description'
export type {LeadingVisualProps, TrailingVisualProps} from './Visuals'

/**
 * Collection of list-related components.
 */
export const ActionList = Object.assign(List, {
  /** Collects related `Items` in an `ActionList`. */
  Group,

  /** An actionable or selectable `Item` with an optional icon and description. */
  Item,

  /** Visually separates `Item`s or `Group`s in an `ActionList`. */
  Divider,

  Description,

  LeadingVisual,
  TrailingVisual
})
