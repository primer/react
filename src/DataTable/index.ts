import {DataTable} from './DataTable'
import {ErrorDialog} from './ErrorDialog'
import {
  Table as TableImpl,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableSortHeader,
  TableCell,
  TableCellPlaceholder,
  TableContainer,
  TableTitle,
  TableSubtitle,
  TableActions,
  TableDivider,
  TableSkeleton,
  TableSkeletonRows,
} from './Table'
import {Pagination} from './Pagination'

const Table = Object.assign(TableImpl, {
  Container: TableContainer,
  Title: TableTitle,
  Subtitle: TableSubtitle,
  Actions: TableActions,
  Divider: TableDivider,
  Skeleton: TableSkeleton,
  SkeletonRows: TableSkeletonRows,
  Head: TableHead,
  Body: TableBody,
  Header: TableHeader,
  SortHeader: TableSortHeader,
  Row: TableRow,
  Cell: TableCell,
  CellPlaceholder: TableCellPlaceholder,
  Pagination,
  ErrorDialog,
})

export {DataTable, Table}
export type {DataTableProps} from './DataTable'
export type {TableErrorDialogProps} from './ErrorDialog'
export type {
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderProps,
  TableSortHeaderProps,
  TableCellProps,
  TableContainerProps,
  TableTitleProps,
  TableSubtitleProps,
  TableActionsProps,
  TableSkeletonProps,
  TableSkeletonRowsProps,
} from './Table'
