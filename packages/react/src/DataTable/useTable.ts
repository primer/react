import {useState} from 'react'
import type {Column} from './column'
import type {UniqueRow} from './row'
import {DEFAULT_SORT_DIRECTION, SortDirection, transition, strategies} from './sorting'
import type {ObjectPathValue} from './utils'

interface TableConfig<Data extends UniqueRow> {
  columns: Array<Column<Data>>
  data: Array<Data>
  initialSortColumn?: string | number
  initialSortDirection?: Exclude<SortDirection, 'NONE'>
}

interface Table<Data extends UniqueRow> {
  headers: Array<Header<Data>>
  rows: Array<Row<Data>>
  actions: {
    sortBy: (header: Header<Data>) => void
  }
  gridTemplateColumns: React.CSSProperties['gridTemplateColumns']
}

interface Header<Data extends UniqueRow> {
  id: string
  column: Column<Data>
  isSortable: () => boolean
  getSortDirection: () => SortDirection | Exclude<SortDirection, 'NONE'>
}

interface Row<Data extends UniqueRow> {
  id: string | number
  getCells: () => Array<Cell<Data>>
  getValue: () => Data
}

interface Cell<Data extends UniqueRow> {
  id: string
  column: Column<Data>
  getValue: () => Data[keyof Data]
  rowHeader: boolean
}

type ColumnSortState = {id: string | number; direction: Exclude<SortDirection, 'NONE'>} | null

export function useTable<Data extends UniqueRow>({
  columns,
  data,
  initialSortColumn,
  initialSortDirection,
}: TableConfig<Data>): Table<Data> {
  const [rowOrder, setRowOrder] = useState(data)
  const [prevData, setPrevData] = useState(data)
  const [prevColumns, setPrevColumns] = useState(columns)
  const [sortByColumn, setSortByColumn] = useState<ColumnSortState>(() => {
    return getInitialSortState(columns, initialSortColumn, initialSortDirection)
  })
  const {gridTemplateColumns} = useTableLayout(columns)

  // Reset the `sortByColumn` state if the columns change and that column is no
  // longer provided
  if (columns !== prevColumns) {
    setPrevColumns(columns)
    if (sortByColumn) {
      const column = columns.find(column => {
        const id = column.id ?? column.field
        return sortByColumn.id === id
      })
      if (!column) {
        setSortByColumn(null)
      }
    }
  }

  const headers = columns.map(column => {
    const id = column.id ?? column.field
    if (id === undefined) {
      throw new Error(`Expected either an \`id\` or \`field\` to be defined for a Column`)
    }

    const sortable = column.sortBy !== undefined && column.sortBy !== false
    return {
      id,
      column,
      isSortable() {
        return sortable
      },
      getSortDirection() {
        if (sortByColumn && sortByColumn.id === id) {
          return sortByColumn.direction
        }
        return SortDirection.NONE
      },
    }
  })

  // Update the row order and apply the current sort column to the incoming data
  if (data !== prevData) {
    setPrevData(data)
    setRowOrder(data)
    if (sortByColumn) {
      sortRows(sortByColumn)
    }
  }

  /**
   * Sort the input row data by the given header
   */
  function sortBy(header: Header<Data>) {
    const sortState = {
      id: header.id,
      direction:
        sortByColumn && sortByColumn.id === header.id ? transition(sortByColumn.direction) : DEFAULT_SORT_DIRECTION,
    }
    setSortByColumn(sortState)
    sortRows(sortState)
  }

  /**
   * Sort the rows of a table with the given column sort state. If the data in the table is sparse,
   * blank values will be ordered last regardless of the sort direction.
   */
  function sortRows(state: Exclude<ColumnSortState, null>) {
    const header = headers.find(header => {
      return header.id === state.id
    })
    if (!header) {
      throw new Error(`Unable to find header with id: ${state.id}`)
    }

    if (header.column.sortBy === false || header.column.sortBy === undefined) {
      throw new Error(`The column for this header is not sortable`)
    }

    const sortMethod =
      header.column.sortBy === true
        ? strategies.basic
        : typeof header.column.sortBy === 'string'
        ? strategies[header.column.sortBy]
        : header.column.sortBy

    setRowOrder(rowOrder => {
      return rowOrder.slice().sort((a, b) => {
        if (header.column.field === undefined) {
          return 0
        }

        // Custom sort functions operate on the row versus the field
        if (typeof header.column.sortBy === 'function') {
          if (state.direction === SortDirection.ASC) {
            // @ts-ignore todo
            return sortMethod(a, b)
          }
          // @ts-ignore todo
          return sortMethod(b, a)
        }

        const valueA = get(a, header.column.field)
        const valueB = get(b, header.column.field)

        if (valueA && valueB) {
          if (state.direction === SortDirection.ASC) {
            // @ts-ignore todo
            return sortMethod(valueA, valueB)
          }
          // @ts-ignore todo
          return sortMethod(valueB, valueA)
        }

        if (valueA) {
          return -1
        }

        if (valueB) {
          return 1
        }
        return 0
      })
    })
  }

  return {
    headers,
    rows: rowOrder.map(row => {
      return {
        id: `${row.id}`,
        getValue() {
          return row
        },
        getCells() {
          return headers.map(header => {
            return {
              id: `${row.id}:${header.id}`,
              column: header.column,
              rowHeader: header.column.rowHeader ?? false,
              getValue() {
                if (header.column.field !== undefined) {
                  return get(row, header.column.field)
                }
                throw new Error(`Unable to get value for column header ${header.id}`)
              },
            }
          })
        },
      }
    }),
    actions: {
      sortBy,
    },
    gridTemplateColumns,
  }
}

function getInitialSortState<Data extends UniqueRow>(
  columns: Array<Column<Data>>,
  initialSortColumn?: string | number,
  initialSortDirection?: Exclude<SortDirection, 'NONE'>,
) {
  if (initialSortColumn !== undefined) {
    const column = columns.find(column => {
      return column.id === initialSortColumn || column.field === initialSortColumn
    })

    if (column === undefined) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          `Warning: Unable to find a column with id or field set to: ${initialSortColumn}. Please provide a value to \`initialSortColumn\` which corresponds to a \`id\` or \`field\` value in a column.`,
        )
      }
      return null
    }

    if (column.sortBy === false || column.sortBy === undefined) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          `Warning: The column specified by initialSortColumn={${initialSortColumn}} is not sortable. Please set \`sortBy\` to true or provide a sort strategy.`,
        )
      }
      return null
    }

    return {
      id: `${initialSortColumn}`,
      direction: initialSortDirection ?? DEFAULT_SORT_DIRECTION,
    }
  }

  if (initialSortDirection !== undefined) {
    const column = columns.find(column => {
      return column.sortBy !== false && column.sortBy !== undefined
    })

    if (!column) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          `Warning: An initialSortDirection value was provided but no columns are sortable. Please set \`sortBy\` to true or provide a sort strategy to a column.`,
        )
      }
      return null
    }

    const id = column.id ?? column.field
    if (id === undefined) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          `Warning: Unable to find an \`id\` or \`field\` for the column: ${column}. Please set one of these properties on the column.`,
        )
      }
      return null
    }

    return {
      id,
      direction: initialSortDirection,
    }
  }

  return null
}

export function useTableLayout<Data extends UniqueRow>(columns: Array<Column<Data>>): {gridTemplateColumns: string} {
  return {
    gridTemplateColumns: getGridTemplateFromColumns(columns).join(' '),
  }
}

export function getGridTemplateFromColumns<Data extends UniqueRow>(columns: Array<Column<Data>>): string[] {
  return columns.map(column => {
    const columnWidth = column.width ?? 'grow'
    let minWidth = 'auto'
    let maxWidth = '1fr'

    if (columnWidth === 'auto') {
      maxWidth = 'auto'
    }

    // Setting a min-width of 'max-content' ensures that the column will grow to fit the widest cell's content.
    // However, If the column has a max width, we can't set the min width to `max-content` because
    // the widest cell's content might overflow the container.
    if (columnWidth === 'grow' && !column.maxWidth) {
      minWidth = 'max-content'
    }

    // Column widths set to "growCollapse" don't need a min width unless one is explicitly provided.
    if (columnWidth === 'growCollapse') {
      minWidth = '0'
    }

    // If a consumer passes `minWidth` or `maxWidth`, we need to override whatever we set above.
    if (column.minWidth) {
      minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth
    }

    if (column.maxWidth) {
      maxWidth = typeof column.maxWidth === 'number' ? `${column.maxWidth}px` : column.maxWidth
    }

    // If a consumer is passing one of the shorthand widths or doesn't pass a width at all, we use the
    // min and max width calculated above to create a minmax() column template value.
    if (typeof columnWidth !== 'number' && ['grow', 'growCollapse', 'auto'].includes(columnWidth)) {
      return minWidth === maxWidth ? minWidth : `minmax(${minWidth}, ${maxWidth})`
    }

    // If we reach this point, the consumer is passing an explicit width value.
    return typeof columnWidth === 'number' ? `${columnWidth}px` : columnWidth
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function get<ObjectType extends Record<string, any>, Path extends string>(
  object: ObjectType,
  path: Path,
): ObjectPathValue<ObjectType, Path> {
  return path.split('.').reduce<ObjectPathValue<ObjectType, Path>>((value, key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (value as any)[key]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, object as any)
}
