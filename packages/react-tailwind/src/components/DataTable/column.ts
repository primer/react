import type React from 'react'
import type {Column, UniqueRow} from './DataTable'

export function renderColumnHeader(header: React.ReactNode | Column<UniqueRow>['header']) {
  return typeof header === 'function' ? header() : header
}

export function createColumnHelper<Data extends UniqueRow>() {
  return {
    column: (column: Column<Data>): Column<Data> =>
      column.field === undefined ? column : {...column, id: column.id ?? column.field},
  }
}
