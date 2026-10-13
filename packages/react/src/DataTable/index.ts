import {DataTable} from './DataTable'
import {ErrorDialog} from './ErrorDialog'
import {
  Table as TableImpl,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  TableCellPlaceholder,
  TableContainer,
  TableTitle,
  TableSubtitle,
  TableActions,
  TableDivider,
  TableSkeleton,
} from './Table'
import {TableGroup} from './TableGroup'
import {Pagination} from './Pagination'
import type {SlotMarker} from '../utils/types/Slots'

const Table: typeof TableImpl &
  SlotMarker & {
    Container: typeof TableContainer
    Title: typeof TableTitle
    Subtitle: typeof TableSubtitle
    Actions: typeof TableActions
    Divider: typeof TableDivider
    Skeleton: typeof TableSkeleton
    Head: typeof TableHead
    Body: typeof TableBody
    Group: typeof TableGroup
    Header: typeof TableHeader
    Row: typeof TableRow
    Cell: typeof TableCell
    CellPlaceholder: typeof TableCellPlaceholder
    Pagination: typeof Pagination
    ErrorDialog: typeof ErrorDialog
  } = Object.assign(TableImpl, {
  Container: TableContainer,
  Title: TableTitle,
  Subtitle: TableSubtitle,
  Actions: TableActions,
  Divider: TableDivider,
  Skeleton: TableSkeleton,
  Head: TableHead,
  Body: TableBody,
  Group: TableGroup,
  Header: TableHeader,
  Row: TableRow,
  Cell: TableCell,
  CellPlaceholder: TableCellPlaceholder,
  Pagination,
  ErrorDialog,
})

export {DataTable, Table}
export type {DataTableProps} from './DataTable'
export type {
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderProps,
  TableCellProps,
  TableContainerProps,
  TableTitleProps,
  TableSubtitleProps,
  TableActionsProps,
  TableSkeletonProps,
} from './Table'
export type {TableGroupProps} from './TableGroup'
export {createColumnHelper} from './column'
export type {Column, CellAlignment, ColumnWidth} from './column'
export type {DataTableData, DataTableRowGroup, UniqueRow} from './row'
export type {ObjectPaths} from './utils'
