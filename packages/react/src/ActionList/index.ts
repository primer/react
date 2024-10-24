import {List} from './List'
import {Group, GroupHeading} from './Group'
import {Item} from './Item'
import {LinkItem} from './LinkItem'
import {Divider} from './Divider'
import {Description} from './Description'
import {TrailingAction} from './TrailingAction'
import {LeadingVisual, TrailingVisual} from './Visuals'
import {Heading} from './Heading'

export type {ActionListProps} from './shared'
export type {ActionListGroupProps, ActionListGroupHeadingProps} from './Group'
export type {ActionListItemProps} from './shared'
export type {ActionListLinkItemProps} from './LinkItem'
export type {ActionListDividerProps} from './Divider'
export type {ActionListDescriptionProps} from './Description'
export type {ActionListLeadingVisualProps, ActionListTrailingVisualProps} from './Visuals'
export type {ActionListHeadingProps} from './Heading'
export type {ActionListTrailingActionProps} from './TrailingAction'

/**
 * Collection of list-related components.
 */
export const ActionList = Object.assign(List, {
  /** Collects related `Items` in an `ActionList`. */
  Group,

  /** An actionable or selectable `Item` */
  Item,

  /** A `Item` that renders a full-size anchor inside ListItem */
  LinkItem,

  /** Visually separates `Item`s or `Group`s in an `ActionList`. */
  Divider,

  /** Secondary text which provides additional information about an `Item`. */
  Description,

  /** Icon (or similar) positioned before `Item` text. */
  LeadingVisual,

  /** Icon (or similar) positioned after `Item` text. */
  TrailingVisual,

  /** Heading for an `ActionList`. */
  Heading,

  /** Heading for `ActionList.Group` */
  GroupHeading,

  /** Secondary action */
  TrailingAction,
})
