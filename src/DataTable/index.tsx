import {SortAscIcon, SortDescIcon} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import Box from '../Box'
import {get} from '../constants'
import {Column} from './column'
import {useTable} from './useTable'
import {SortDirection} from './sorting'
import {UniqueRow} from './row'
import {ObjectPaths} from './utils'

// ----------------------------------------------------------------------------
// DataTable
// ----------------------------------------------------------------------------

export interface DataTableProps<Data extends UniqueRow> {
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

  /**
   * Provide the id or field of the column by which the table is sorted. When
   * using this `prop`, the input data must be sorted by this column in
   * ascending order
   */
  initialSortColumn?: ObjectPaths<Data> | string | undefined

  /**
   * Provide the sort direction that the table should be sorted by on the
   * currently sorted column
   */
  initialSortDirection?: Exclude<SortDirection, 'NONE'> | undefined
}

function DataTable<Data extends UniqueRow>({
  'aria-labelledby': labelledby,
  'aria-describedby': describedby,
  cellPadding,
  columns,
  data,
  initialSortColumn,
  initialSortDirection,
}: DataTableProps<Data>) {
  const {headers, rows, actions} = useTable({
    data,
    columns,
    initialSortColumn,
    initialSortDirection,
  })
  return (
    <Table aria-labelledby={labelledby} aria-describedby={describedby} cellPadding={cellPadding}>
      <TableHead>
        <TableRow>
          {headers.map(header => {
            if (header.isSortable()) {
              return (
                <TableSortHeader
                  key={header.id}
                  direction={header.getSortDirection()}
                  onToggleSort={() => {
                    actions.sortBy(header)
                  }}
                >
                  {header.column.header}
                </TableSortHeader>
              )
            }
            return <TableHeader key={header.id}>{header.column.header}</TableHeader>
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => {
          return (
            <TableRow key={row.id}>
              {row.getCells().map(cell => {
                return (
                  <TableCell key={cell.id} scope={cell.rowHeader ? 'row' : undefined}>
                    {cell.column.renderCell
                      ? cell.column.renderCell(row.getValue())
                      : (cell.getValue() as React.ReactNode)}
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

  /* Control visibility of sort icons */
  .TableSortIcon {
    visibility: hidden;
  }

  /* The ASC icon is visible if the header is sortable and is hovered or focused */
  .TableHeader:hover .TableSortIcon--ascending,
  .TableHeader button:focus .TableSortIcon--ascending {
    visibility: visible;
  }

  /* Each sort icon is visible if the TableHeader is currently in the corresponding sort state */
  .TableHeader[aria-sort='ascending'] .TableSortIcon--ascending,
  .TableHeader[aria-sort='descending'] .TableSortIcon--descending {
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

interface TableSortHeaderProps extends TableHeaderProps {
  /**
   * Specify the sort direction for the TableHeader
   */
  direction: SortDirection

  /**
   * Provide a handler that is called when the sortable TableHeader is
   * interacted with via a click or keyboard interaction
   */
  onToggleSort: () => void
}

function TableSortHeader({children, direction, onToggleSort, ...rest}: TableSortHeaderProps) {
  const ariaSort = direction === 'DESC' ? 'descending' : direction === 'ASC' ? 'ascending' : undefined
  return (
    <TableHeader {...rest} aria-sort={ariaSort}>
      <Button
        type="button"
        onClick={() => {
          onToggleSort()
        }}
      >
        {children}
        {direction === SortDirection.NONE || direction === SortDirection.ASC ? (
          <SortAscIcon className="TableSortIcon TableSortIcon--ascending" />
        ) : null}
        {direction === SortDirection.DESC ? <SortDescIcon className="TableSortIcon TableSortIcon--descending" /> : null}
      </Button>
    </TableHeader>
  )
}

// ----------------------------------------------------------------------------
// TableRow
// ----------------------------------------------------------------------------

interface TableRowProps extends React.ComponentPropsWithoutRef<'tr'> {
  children?: React.ReactNode
}

function TableRow({children, ...rest}: TableRowProps) {
  return (
    <tr {...rest} className="TableRow">
      {children}
    </tr>
  )
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

function TableCell({children, scope, ...rest}: TableCellProps) {
  const BaseComponent = scope ? 'th' : 'td'

  return (
    <BaseComponent {...rest} className="TableCell" scope={scope}>
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

// ----------------------------------------------------------------------------
// Utilities
// ----------------------------------------------------------------------------

// Button "reset" component that provides an unstyled <button> element for use
// in the table
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
