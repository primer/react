import type {Column, UniqueRow} from './DataTable'

export function createColumnHelper<Data extends UniqueRow>() {
  return {
    column: (column: Column<Data>): Column<Data> =>
      column.field === undefined ? column : {...column, id: column.id ?? column.field},
  }
}
