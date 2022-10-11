import { List } from './List.js';
import { Group } from './Group.js';
import { Item } from './Item.js';
import { LinkItem } from './LinkItem.js';
import { Divider } from './Divider.js';
import { Description } from './Description.js';
import { LeadingVisual, TrailingVisual } from './Visuals.js';

/**
 * Collection of list-related components.
 */
const ActionList = Object.assign(List, {
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
  TrailingVisual
});

export { ActionList };
