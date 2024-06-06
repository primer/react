import type {ObjectPaths} from './utils'
import type {UniqueRow} from './row'
import type {SortStrategy, CustomSortStrategy} from './sorting'

export type ColumnWidth = 'grow' | 'growCollapse' | 'auto' | React.CSSProperties['width']
export type CellAlignment = 'start' | 'end' | undefined
export interface Column<Data extends UniqueRow> {
  id?: string

  /**
   * The horizontal alignment of the column's content
   */
  align?: CellAlignment

  /**
   * Provide the name of the column. This will be rendered as a table header
   * within the table itself
   */
  header: string | (() => React.ReactNode)

  /**
   * Optionally provide a field to render for this column. This may be the key
   * of the object or a string that accesses nested objects through `.`. For
   * example: `field: a.b.c`
   *
   * Alternatively, you may provide a `renderCell` for this column to render the
   * field in a row
   */
  field?: ObjectPaths<Data>

  /**
   * The maximum width the column can grow to
   */
  // TODO: uncomment ResponsiveValue<T> when I'm ready to implement the responsive part
  maxWidth?: React.CSSProperties['maxWidth'] /*| ResponsiveValue<React.CSSProperties['maxWidth']>*/

  /**
   * The minimum width the column can shrink to
   */
  // TODO: uncomment ResponsiveValue<T> when I'm ready to implement the responsive part
  minWidth?: React.CSSProperties['minWidth'] /*| ResponsiveValue<React.CSSProperties['minWidth']>*/

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
  sortBy?: boolean | SortStrategy | CustomSortStrategy<Data>

  /**
   * Controls the width of the column.
   * - 'grow': Stretch to fill available space, and min width is the width of the widest cell in the column
   * - 'growCollapse': Stretch to fill available space or shrink to fit in the available space. Allows the column to shrink smaller than the cell content's width.
   * - 'auto': The column is the width of it’s widest cell. Not intended for use with columns who’s content length varies a lot because a layout shift will occur when the content changes
   * - explicit width: Will be exactly that width and will not grow or shrink to fill the parent
   * @default 'grow'
   */
  width?: ColumnWidth
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
