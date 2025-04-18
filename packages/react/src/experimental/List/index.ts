import {List as ListImpl} from './List'
import {ListItem as Item} from './ListItem'
import {Description} from './Description'
import {Label} from './Label'
import {LeadingVisual, TrailingVisual} from './Visual'

export const List = Object.assign(ListImpl, {
  ListItem: Item,
  Description,
  Label,
  LeadingVisual,
  TrailingVisual,
})
export type {ListProps} from './List'
export type {ListItemProps} from './ListItem'
export type {DescriptionProps} from './Description'
export type {LabelProps} from './Label'
export type {LeadingVisualProps, TrailingVisualProps} from './Visual'
