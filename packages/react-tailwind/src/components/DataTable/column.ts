import type {Column, UniqueRow} from './DataTable'

export function createColumnHelper<Data extends UniqueRow>() {
  return {column: (column: Column<Data>) => ({...column, id: column.id ?? column.field})}
}
