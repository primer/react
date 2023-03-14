import {ObjectPaths} from './utils'
import {UniqueRow} from './row'
import {SortStrategies} from './sorting'

export interface Column<Data extends UniqueRow> {
  id?: string

  /**
   * Provide the name of the column. This will be rendered as a table header
   * within the table itself
   */
  header: string | (() => React.ReactNode)

  /**
   * Optionally provide a field to render for this column. This may be the key
   * of the object or a string that accesses nested objects through `.`. For
   * exmaple: `field: a.b.c`
   *
   * Alternatively, you may provide a `renderCell` for this column to render the
   * field in a row
   */
  field?: ObjectPaths<Data>

  /**
   * Provide a custom component or render prop to render the data for this
   * column in a row
   */
  renderCell?: (data: Data) => React.ReactNode

  /**
   * Specify if the value of this column for a row should be treated as a row
   * header
   */
  rowHeader?: boolean

  /**
   * Specify if the table should sort by this column and, if applicable, a
   * specific sort strategy or custom sort strategy
   */
  sortBy?: boolean | SortStrategies
}

export function createColumnHelper<T extends UniqueRow>() {
  function column(column: Column<T>): Column<T> {
    return {
      ...column,
      id: column.id ?? column.field,
    }
  }

  return {
    column,
  }
}
