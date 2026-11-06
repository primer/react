import {
  Table as TableRoot,
  TableActions,
  TableBody,
  TableCell,
  TableCellPlaceholder,
  TableContainer,
  TableDivider,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
  TableRowSelection,
  TableSelectionHeader,
  TableSkeleton,
  TableSortHeader,
  TableSubtitle,
  TableTitle,
} from './Table'
import {TableBulkActions} from './TableBulkActions'
import {TableGroup} from './TableGroup'
export {createColumnHelper} from './column'

export const Table = Object.assign(TableRoot, {
  Actions: TableActions,
  Body: TableBody,
  BulkActions: TableBulkActions,
  Cell: TableCell,
  CellPlaceholder: TableCellPlaceholder,
  Container: TableContainer,
  Divider: TableDivider,
  Group: TableGroup,
  Head: TableHead,
  Header: TableHeader,
  Pagination: TablePagination,
  Row: TableRow,
  RowSelection: TableRowSelection,
  SelectionHeader: TableSelectionHeader,
  SortHeader: TableSortHeader,
  Skeleton: TableSkeleton,
  Subtitle: TableSubtitle,
  Title: TableTitle,
})

export {
  DataTable,
  type DataTableBulkActionsContext,
  type DataTableData,
  type DataTableProps,
  type DataTableRowGroup,
  type DataTableRowId,
  type Column,
  type UniqueRow,
  type CellAlignment,
  type ColumnWidth,
  type SortStrategy,
} from './DataTable'
export {
  type TableProps,
  type TableHeadProps,
  type TableBodyProps,
  type TableRowProps,
  type TableHeaderProps,
  type TablePaginationProps,
  type TableSortHeaderProps,
  type TableCellProps,
  type TableRowSelectionProps,
  type TableSelectionHeaderProps,
  type TableContainerProps,
  type TableTitleProps,
  type TableSubtitleProps,
  type TableSkeletonProps,
  type SortDirection,
} from './Table'
export {type TableBulkActionsProps} from './TableBulkActions'
export {type TableGroupProps} from './TableGroup'
