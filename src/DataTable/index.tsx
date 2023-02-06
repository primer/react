import React from 'react'
import styled from 'styled-components'
import Box from '../Box'
import {get} from '../constants'

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
}

function DataTable<Data extends Row>({
  'aria-labelledby': labelledby,
  'aria-describedby': describedby,
  cellPadding,
  columns,
  data,
}: DataTableProps<Data>) {
  return (
    <Table aria-labelledby={labelledby} aria-describedby={describedby} cellPadding={cellPadding}>
      <TableHead>
        <TableRow>
          {columns.map(column => {
            return <TableHeader key={column.header}>{column.header}</TableHeader>
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(row => {
          return (
            <TableRow key={row.id}>
              {columns.map(column => {
                const columnProps = {
                  scope: column.rowHeader ? 'row' : undefined,
                }

                if (column.renderCell) {
                  return (
                    <TableCell key={column.header} {...columnProps}>
                      {column.renderCell(row)}
                    </TableCell>
                  )
                }

                if (column.field) {
                  const value = row[column.field]

                  if (typeof value === 'string' || typeof value === 'number' || React.isValidElement(value)) {
                    return (
                      <TableCell key={column.header} {...columnProps}>
                        {value}
                      </TableCell>
                    )
                  }
                }

                return null
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

function TableHeader({children}: TableHeaderProps) {
  return <th className="TableHeader">{children}</th>
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
        fontWeight: 'bold',
        fontSize: 1,
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
        fontWeight: 'normal',
        fontSize: 0,
        lineHeight: 'default',
        margin: 0,
      }}
    >
      {children}
    </Box>
  )
}

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
