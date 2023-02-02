import {SortAscIcon} from '@primer/octicons-react'
import React, {useState} from 'react'
import styled from 'styled-components'
import Box from '../Box'
import {get} from '../constants'
import {SortStrategy, sortByNumber, sortByString, transition, SortDirection} from './sorting'

// ----------------------------------------------------------------------------
// DataTable
// ----------------------------------------------------------------------------
interface Row {
  /**
   * Provide a value that uniquely identifies the row
   */
  id: string | number

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface DataTableProps<Data extends Row> {
  /**
   * Provide an id to an element which uniquely describes this table
   */
  'aria-describedby'?: string | undefined

  /**
   * Provide an id to an element which uniquely labels this table
   */
  'aria-labelledby'?: string | undefined

  /**
   * Specify the amount of space that should be available around the contents of
   * a cell
   */
  cellPadding?: 'condensed' | 'normal' | 'spacious' | undefined

  /**
   * Provide a collection of the rows which will be rendered inside of the table
   */
  data: Array<Data>

  /**
   * Provide the columns for the table and the fields in `data` to which they
   * correspond
   */
  columns: Array<Column<Data>>
}

interface Column<Data extends Row> {
  /**
   * Provide the name of the column. This will be rendered as a table header
   * within the table itself
   */
  header: string

  /**
   * Optionally provide a field to render for this column. This may be the key
   * of the object or a string that accesses nested objects through `.`. For
   * exmaple: `field: a.b.c`
   *
   * Alternatively, you may provide a `renderCell` for this column to render the
   * field in a row
   */
  field?: string | undefined

  /**
   * Provide a custom component or render prop to render the data for this
   * column in a row
   */
  renderCell?: ((data: Data) => React.ReactNode) | undefined

  /**
   * Specify if the value of this column for a row should be treated as a row
   * header
   */
  rowHeader?: boolean | undefined

  /**
   * Specify if the table should sort by this column. When a boolean is
   * provided, the sort strategy will try to infer the sorting method to be
   * used.
   *
   * You may also explicitly set the sorting method or provide a custom sorting
   * strategy for this column.
   */
  sortBy?: boolean | SortStrategy<Data[keyof Data]> | undefined
}

function DataTable<Data extends Row>({
  'aria-labelledby': labelledby,
  'aria-describedby': describedby,
  cellPadding,
  columns,
  data,
}: DataTableProps<Data>) {
  const headers = columns.map(column => {
    return {
      id: column.header,
      isSortable: column.sortBy,
      isRowHeader: column.rowHeader,
      column,
    }
  })
  const [rows, setRows] = useState(data)
  const [sorting, setSorting] = useState(() => {
    const state = new Map()
    for (const header of headers) {
      if (header.isSortable) {
        state.set(header.id, 'none')
      }
    }

    return state
  })

  function toggleSort(id: string) {
    const nextState = new Map(sorting)
    for (const [key, value] of nextState) {
      if (key === id) {
        nextState.set(key, transition(value))
        continue
      }

      if (value !== 'none') {
        nextState.set(key, 'none')
      }
    }

    setSorting(nextState)

    const direction = nextState.get(id)
    const header = headers.find(header => {
      return header.id === id
    })
    if (!header) {
      return
    }

    sortRows(header.column, direction)
  }

  function sortRows(column: Column<Data>, direction: SortDirection) {
    setRows(
      rows.slice().sort((a, b) => {
        // We are unable to find the value of this column in this row, as a
        // result we cannot sort or compare them
        if (column.field === undefined) {
          return 0
        }

        // If there is no sort direction, default to the order of an item in
        // the input `data`
        if (direction === 'none') {
          return data.indexOf(a) - data.indexOf(b)
        }

        // When a custom `sortBy` function is  provided, use it before any
        // automatic or inferred sorters
        if (typeof column.sortBy === 'function') {
          return column.sortBy(a[column.field], b[column.field], {direction})
        }

        const valueType = typeof a[column.field]

        if (column.sortBy === 'string' || valueType === 'string') {
          return sortByString(a[column.field], b[column.field], {direction})
        }

        if (column.sortBy === 'number' || valueType === 'number') {
          return sortByNumber(a[column.field], b[column.field], {direction})
        }

        return 0
      }),
    )
  }

  return (
    <Table aria-labelledby={labelledby} aria-describedby={describedby} cellPadding={cellPadding}>
      <TableHead>
        <TableRow>
          {headers.map(header => {
            return (
              <TableHeader key={header.id} aria-sort={header.isSortable ? sorting.get(header.id) : undefined}>
                {header.isSortable ? (
                  <Button
                    type="button"
                    onClick={() => {
                      toggleSort(header.id)
                    }}
                  >
                    {header.column.header}
                    <SortAscIcon className="TableSortIcon" size="small" />
                  </Button>
                ) : (
                  header.column.header
                )}
              </TableHeader>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => {
          return (
            <TableRow key={row.id}>
              {headers.map(header => {
                return (
                  <TableCell key={`${row.id}:${header.id}`} scope={header.isRowHeader ? 'row' : undefined}>
                    {header.column.renderCell
                      ? header.column.renderCell(row)
                      : header.column.field
                      ? row[header.column.field]
                      : undefined}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

// ----------------------------------------------------------------------------
// Table
// ----------------------------------------------------------------------------

const StyledTable = styled.table<React.ComponentPropsWithoutRef<'table'>>`
  /* Default table styles */
  --table-border-radius: 0.375rem;
  --table-cell-padding: var(--cell-padding-block, 0.5rem) var(--cell-padding-inline, 0.75rem);
  --table-font-size: 0.75rem;

  background-color: ${get('colors.canvas.default')};
  border-spacing: 0;
  border-collapse: separate;
  font-size: var(--table-font-size);
  line-height: calc(20 / var(--table-font-size));
  width: 100%;
  overflow-x: auto;

  /* Density modes: condensed, normal, spacious */
  &[data-cell-padding='condensed'] {
    --cell-padding-block: 0.25rem;
    --cell-padding-inline: 0.5rem;
  }

  &[data-cell-padding='normal'] {
    --cell-padding-block: 0.5rem;
    --cell-padding-inline: 0.75rem;
  }

  &[data-cell-padding='spacious'] {
    --cell-padding-block: 0.75rem;
    --cell-padding-inline: 1rem;
  }

  /* Borders */
  .TableCell:first-child,
  .TableHeader:first-child {
    border-left: 1px solid ${get('colors.border.default')};
  }

  .TableCell:last-child,
  .TableHeader:last-child {
    border-right: 1px solid ${get('colors.border.default')};
  }

  .TableHeader,
  .TableCell {
    border-bottom: 1px solid ${get('colors.border.default')};
  }

  .TableHead .TableRow:first-of-type .TableHeader {
    border-top: 1px solid ${get('colors.border.default')};
  }

  /* Border radius */
  .TableHead .TableRow:first-of-type .TableHeader:first-child {
    border-top-left-radius: var(--table-border-radius);
  }

  .TableHead .TableRow:first-of-type .TableHeader:last-child {
    border-top-right-radius: var(--table-border-radius);
  }

  .TableBody .TableRow:last-of-type .TableCell:first-child {
    border-bottom-left-radius: var(--table-border-radius);
  }

  .TableBody .TableRow:last-of-type .TableCell:last-child {
    border-bottom-right-radius: var(--table-border-radius);
  }

  /* TableHeader, TableCell */
  .TableCell,
  .TableHeader {
    padding: var(--table-cell-padding);
  }

  /**
   * Offset padding to make sure type aligns regardless of cell padding
   * selection
   */
  .TableRow > *:first-child {
    padding-inline-start: 1rem;
  }

  .TableRow > *:last-child {
    padding-inline-end: 1rem;
  }

  /* TableHeader */
  .TableHeader {
    background-color: ${get('colors.canvas.subtle')};
    color: ${get('colors.fg.muted')};
    font-weight: 600;
    text-align: start;
    border-top: 1px solid ${get('colors.border.default')};
  }

  .TableHeader[aria-sort='descending'],
  .TableHeader[aria-sort='ascending'] {
    color: ${get('colors.fg.default')};
  }

  .TableHeader[aria-sort='none'] .TableSortIcon {
    visibility: hidden;
  }

  .TableHeader[aria-sort='descending'] .TableSortIcon {
    transform: rotate(180deg) scale(-1, 1);
  }

  .TableHeader[aria-sort='none']:hover .TableSortIcon,
  .TableHeader[aria-sort='none'] button:focus .TableSortIcon {
    visibility: visible;
  }

  /* TableRow */
  .TableRow:hover .TableCell {
    /* TODO: update this token when the new primitive tokens are released */
    background-color: ${get('colors.actionListItem.default.hoverBg')};
  }

  /* TableCell */
  .TableCell[scope='row'] {
    color: ${get('colors.fg.default')};
    font-weight: 600;
    text-align: start;
  }

  /* Spacing if table details are present */
  .TableTitle + &,
  .TableSubtitle + & {
    margin-top: ${get('space.2')};
  }
`

interface TableProps extends React.ComponentPropsWithoutRef<'table'> {
  /**
   * Provide an id to an element which uniquely describes this table
   */
  'aria-describedby'?: string | undefined

  /**
   * Provide an id to an element which uniquely labels this table
   */
  'aria-labelledby'?: string | undefined

  children?: React.ReactNode

  /**
   * Specify the amount of space that should be available around the contents of
   * a cell
   */
  cellPadding?: 'condensed' | 'normal' | 'spacious' | undefined
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table({cellPadding = 'normal', ...rest}, ref) {
  return <StyledTable {...rest} data-cell-padding={cellPadding} ref={ref} />
})

// ----------------------------------------------------------------------------
// TableHead
// ----------------------------------------------------------------------------

interface TableHeadProps extends React.ComponentPropsWithoutRef<'thead'> {
  children?: React.ReactNode
}

function TableHead({children}: TableHeadProps) {
  return <thead className="TableHead">{children}</thead>
}

// ----------------------------------------------------------------------------
// TableBody
// ----------------------------------------------------------------------------

interface TableBodyProps extends React.ComponentPropsWithoutRef<'tbody'> {
  children?: React.ReactNode
}

function TableBody({children}: TableBodyProps) {
  return <tbody className="TableBody">{children}</tbody>
}

// ----------------------------------------------------------------------------
// TableHeader
// ----------------------------------------------------------------------------

interface TableHeaderProps extends React.ComponentPropsWithoutRef<'th'> {
  children?: React.ReactNode
}

function TableHeader({children, ...rest}: TableHeaderProps) {
  return (
    <th {...rest} className="TableHeader" scope="col">
      {children}
    </th>
  )
}

// ----------------------------------------------------------------------------
// TableRow
// ----------------------------------------------------------------------------

interface TableRowProps extends React.ComponentPropsWithoutRef<'tr'> {
  children?: React.ReactNode
}

function TableRow({children}: TableRowProps) {
  return <tr className="TableRow">{children}</tr>
}

// ----------------------------------------------------------------------------
// TableCell
// ----------------------------------------------------------------------------

interface TableCellProps extends React.ComponentPropsWithoutRef<'td'> {
  children?: React.ReactNode

  /**
   * Provide the scope for a table cell, useful for defining a row header using
   * `scope="row"`
   */
  scope?: string | undefined
}

function TableCell({children, scope}: TableCellProps) {
  const BaseComponent = scope ? 'th' : 'td'

  return (
    <BaseComponent className="TableCell" scope={scope}>
      {children}
    </BaseComponent>
  )
}

// ----------------------------------------------------------------------------
// TableContainer
// ----------------------------------------------------------------------------
interface TableContainerProps {
  children?: React.ReactNode | undefined
}

function TableContainer({children}: TableContainerProps) {
  return <Box>{children}</Box>
}

interface TableTitleProps {
  /**
   * Provide an alternate element or component to use as the container for
   * `TableSubtitle`. This is useful when specifying markup that is more
   * semantic for your use-case, such as a heading tag.
   */
  as?: keyof JSX.IntrinsicElements | React.ComponentType

  children?: React.ReactNode | undefined

  /**
   * Provide a unique id for the table subtitle. This should be used along with
   * `aria-labelledby` on `DataTable`
   */
  id: string
}

function TableTitle({as, children, id}: TableTitleProps) {
  return (
    <Box
      as={as}
      className="TableTitle"
      id={id}
      sx={{
        color: 'fg.default',
        fontWeight: 600,
        fontSize: '0.875rem',
        lineHeight: 'calc(20 / 14)',
        margin: 0,
      }}
    >
      {children}
    </Box>
  )
}

interface TableSubtitleProps {
  /**
   * Provide an alternate element or component to use as the container for
   * `TableSubtitle`. This is useful when specifying markup that is more
   * semantic for your use-case
   */
  as?: keyof JSX.IntrinsicElements | React.ComponentType

  children?: React.ReactNode | undefined

  /**
   * Provide a unique id for the table subtitle. This should be used along with
   * `aria-describedby` on `DataTable`
   */
  id: string
}

function TableSubtitle({as, children, id}: TableSubtitleProps) {
  return (
    <Box
      as={as}
      className="TableSubtitle"
      id={id}
      sx={{
        color: 'fg.default',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 'calc(18 / 12)',
        margin: 0,
      }}
    >
      {children}
    </Box>
  )
}

const Button = styled.button`
  padding: 0;
  border: 0;
  margin: 0;
  display: inline-flex;
  padding: 0;
  border: 0;
  appearance: none;
  background: none;
  cursor: pointer;
  text-align: start;
  font: inherit;
  color: inherit;
  column-gap: 0.5rem;
  align-items: center;

  &::-moz-focus-inner {
    border: 0;
  }
`

export {
  DataTable,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  TableContainer,
  TableTitle,
  TableSubtitle,
}
