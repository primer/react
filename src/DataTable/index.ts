import {DataTable} from './DataTable'
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

export {DataTable, Table}
