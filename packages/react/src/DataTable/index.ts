import {DataTable} from './DataTable'
import {ErrorDialog} from './ErrorDialog'
import {
  Table as TableImpl,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableSelectionHeader,
  TableCell,
  TableRowSelection,
  TableCellPlaceholder,
  TableContainer,
  TableTitle,
  TableSubtitle,
  TableActions,
  TableDivider,
  TableSkeleton,
} from './Table'
import {TableGroup} from './TableGroup'
import {TableBulkActions} from './TableBulkActions'
import {Pagination} from './Pagination'
import type {SlotMarker} from '../utils/types/Slots'

const Table: typeof TableImpl &
  SlotMarker & {
    Container: typeof TableContainer
    Title: typeof TableTitle
    Subtitle: typeof TableSubtitle
    Actions: typeof TableActions
    BulkActions: typeof TableBulkActions
    Divider: typeof TableDivider
    Skeleton: typeof TableSkeleton
    Head: typeof TableHead
    Body: typeof TableBody
    Group: typeof TableGroup
    Header: typeof TableHeader
    SelectionHeader: typeof TableSelectionHeader
    Row: typeof TableRow
    RowSelection: typeof TableRowSelection
    Cell: typeof TableCell
    CellPlaceholder: typeof TableCellPlaceholder
    Pagination: typeof Pagination
    ErrorDialog: typeof ErrorDialog
  } = Object.assign(TableImpl, {
  Container: TableContainer,
  Title: TableTitle,
  Subtitle: TableSubtitle,
  Actions: TableActions,
  BulkActions: TableBulkActions,
  Divider: TableDivider,
  Skeleton: TableSkeleton,
  Head: TableHead,
  Body: TableBody,
  Group: TableGroup,
  Header: TableHeader,
  SelectionHeader: TableSelectionHeader,
  Row: TableRow,
  RowSelection: TableRowSelection,
  Cell: TableCell,
  CellPlaceholder: TableCellPlaceholder,
  Pagination,
  ErrorDialog,
})

export {DataTable, Table}
export type {DataTableProps, DataTableBulkActionsContext} from './DataTable'
export type {TableBulkActionsProps} from './TableBulkActions'
export type {
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderProps,
  TableSelectionHeaderProps,
  TableCellProps,
  TableRowSelectionProps,
  TableContainerProps,
  TableTitleProps,
  TableSubtitleProps,
  TableActionsProps,
  TableSkeletonProps,
} from './Table'
export type {TableGroupProps} from './TableGroup'
export {createColumnHelper} from './column'
export type {Column, CellAlignment, ColumnWidth} from './column'
export type {DataTableData, DataTableRowGroup, DataTableRowId, UniqueRow} from './row'
export type {ObjectPaths} from './utils'
