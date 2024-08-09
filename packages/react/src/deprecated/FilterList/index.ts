import {FilterList as FilterListImpl, FilterListItem} from './FilterList'
import type {FilterListProps, FilterListItemProps} from './FilterList'

export const FilterList = Object.assign(FilterListImpl, {Item: FilterListItem})

export type {FilterListProps, FilterListItemProps}
