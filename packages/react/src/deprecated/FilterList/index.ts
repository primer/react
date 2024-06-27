import {FilterList as FilterListImpl, FilterListItem} from './FilterList'
import type {FilterListProps, FilterListItemProps} from './FilterList'

FilterListItem.displayName = 'FilterList.Item'

export const FilterList = Object.assign(FilterListImpl, {Item: FilterListItem})

export type {FilterListProps, FilterListItemProps}
