import {List, ListItem, ListGroup} from './Listbox'

export const Listbox = Object.assign(List, {
  /** Collects related `Items` in a `List`. */
  Item: ListItem,
  Group: ListGroup,
})
