import {useState} from 'react'
import {Column} from './column'
import {UniqueRow} from './row'
import {DEFAULT_SORT_DIRECTION, SortDirection, transition, strategies} from './sorting'
import {ObjectPathValue} from './utils'

interface TableConfig<Data extends UniqueRow> {
  columns: Array<Column<Data>>
  data: Array<Data>
  initialSortColumn?: string | undefined
  initialSortDirection?: Exclude<SortDirection, 'NONE'> | undefined
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

type ColumnSortState = {id: string; direction: Exclude<SortDirection, 'NONE'>} | null

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
    if (initialSortColumn) {
      if (initialSortDirection) {
        return {
          id: initialSortColumn,
          direction: initialSortDirection,
        }
      }
      return {
        id: initialSortColumn,
        direction: DEFAULT_SORT_DIRECTION,
      }
    }

    if (initialSortDirection) {
      const defaultSortColumn = columns.find(column => {
        return column.sortBy
      })
      if (defaultSortColumn) {
        return {
          id: defaultSortColumn.id ?? defaultSortColumn.field,
          direction: initialSortDirection,
        }
      }
    }

    const sortableColumn = columns.find(column => {
      return column.sortBy
    })
    if (sortableColumn) {
      return {
        id: sortableColumn.id ?? sortableColumn.field,
        direction: DEFAULT_SORT_DIRECTION,
      }
    }

    return null
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
                return get(row, header.column.field)
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
