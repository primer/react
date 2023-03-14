import {useState} from 'react'
import {Column} from './column'
import {UniqueRow} from './row'
import {DEFAULT_SORT_DIRECTION, SortDirection, transition, strategies} from './sorting'
import {ObjectPathValue} from './utils'

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

  // Update the row order and apply the current sort column to the incoming data
  if (data !== prevData) {
    setPrevData(data)
    setRowOrder(data)
    if (sortByColumn) {
      sortRows(sortByColumn)
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
   * Sort the rows of a table with the given column sort state
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

        const valueA = get(a, header.column.field)
        const valueB = get(b, header.column.field)

        if (state.direction === SortDirection.ASC) {
          return sortMethod(valueB, valueA)
        }
        return sortMethod(valueA, valueB)
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
