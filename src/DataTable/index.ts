import {DataTable, DataTableProps} from './DataTable'
import {
  Table as TableImpl,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  TableContainer,
  TableTitle,
  TableSubtitle,
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderProps,
  TableCellProps,
  TableContainerProps,
  TableTitleProps,
  TableSubtitleProps,
} from './Table'

const Table = Object.assign(TableImpl, {
  Container: TableContainer,
  Title: TableTitle,
  Subtitle: TableSubtitle,
  Head: TableHead,
  Body: TableBody,
  Header: TableHeader,
  Row: TableRow,
  Cell: TableCell,
})

export {
  DataTable,
  DataTableProps,
  Table,
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderProps,
  TableCellProps,
  TableContainerProps,
  TableTitleProps,
  TableSubtitleProps,
}
