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
  Header: TableHeader,
  Row: TableRow,
  Cell: TableCell,
  CellPlaceholder: TableCellPlaceholder,
  Pagination,
  ErrorDialog,
})

Table.__SLOT__ = Symbol('Table')

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
export {createColumnHelper} from './column'
export type {Column, CellAlignment, ColumnWidth} from './column'
export type {UniqueRow} from './row'
export type {ObjectPaths} from './utils'
