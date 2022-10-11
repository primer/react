import { List } from './List.js';
import { Group } from './Group.js';
import { Item } from './Item.js';
import { Divider } from './Divider.js';

/**
 * @deprecated Use ActionList with composable API instead. See https://primer.style/react/ActionList for more details.
 */
const ActionList = Object.assign(List, {
  /** Collects related `Items` in an `ActionList`. */
  Group,

  /** An actionable or selectable `Item` with an optional icon and description. */
  Item,

  /** Visually separates `Item`s or `Group`s in an `ActionList`. */
  Divider
});

export { ActionList };
