import {DataTable} from './DataTable'
import {ErrorDialog} from './ErrorDialog'
import {Pagination} from './Pagination'
import {
  TableActions,
  TableBody,
  TableCell,
  TableCellPlaceholder,
  TableContainer,
  TableDivider,
  TableHead,
  TableHeader,
  Table as TableImpl,
  TableRow,
  TableSkeleton,
  TableSubtitle,
  TableTitle,
} from './Table'

const Table = Object.assign(TableImpl, {
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
