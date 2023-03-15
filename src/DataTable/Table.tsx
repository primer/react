import {SortAscIcon, SortDescIcon} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import Box from '../Box'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {SortDirection} from './sorting'

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
  display: grid;
  font-size: var(--table-font-size);
  grid-template-columns: var(--grid-template-columns);
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

  /* Grid layout */
  .TableHead,
  .TableBody,
  .TableRow {
    display: contents;
  }

  @supports (grid-template-columns: subgrid) {
    .TableHead,
    .TableBody,
    .TableRow {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: -1 /1;
  }
`

export type TableProps = React.ComponentPropsWithoutRef<'table'> & {
  /**
   * Provide an id to an element which uniquely describes this table
   */
  'aria-describedby'?: string

  /**
   * Provide an id to an element which uniquely labels this table
   */
  'aria-labelledby'?: string

  /**
   * Column width definitions
   */
  gridTemplateColumns?: React.CSSProperties['gridTemplateColumns']

  /**
   * Specify the amount of space that should be available around the contents of
   * a cell
   */
  cellPadding?: 'condensed' | 'normal' | 'spacious'
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(
  {cellPadding = 'normal', gridTemplateColumns, ...rest},
  ref,
) {
  return (
    <StyledTable
      {...rest}
      data-cell-padding={cellPadding}
      style={{'--grid-template-columns': gridTemplateColumns} as React.CSSProperties}
      className="Table"
      role="table"
      ref={ref}
    />
  )
})

// ----------------------------------------------------------------------------
// TableHead
// ----------------------------------------------------------------------------

export type TableHeadProps = React.ComponentPropsWithoutRef<'thead'>

function TableHead({children}: TableHeadProps) {
  return (
    // We need to explicitly pass this role because some ATs and browsers drop table semantics
    // when we use `display: contents` or `display: grid` in the table
    // eslint-disable-next-line jsx-a11y/no-redundant-roles
    <thead className="TableHead" role="rowgroup">
      {children}
    </thead>
  )
}

// ----------------------------------------------------------------------------
// TableBody
// ----------------------------------------------------------------------------

export type TableBodyProps = React.ComponentPropsWithoutRef<'tbody'>

function TableBody({children}: TableBodyProps) {
  return (
    // We need to explicitly pass this role because some ATs and browsers drop table semantics
    // when we use `display: contents` or `display: grid` in the table
    // eslint-disable-next-line jsx-a11y/no-redundant-roles
    <tbody className="TableBody" role="rowgroup">
      {children}
    </tbody>
  )
}

// ----------------------------------------------------------------------------
// TableHeader
// ----------------------------------------------------------------------------

export type TableHeaderProps = React.ComponentPropsWithoutRef<'th'>

function TableHeader({children, ...rest}: TableHeaderProps) {
  return (
    <th {...rest} className="TableHeader" role="columnheader" scope="col">
      {children}
    </th>
  )
}

type TableSortHeaderProps = TableHeaderProps & {
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

export type TableRowProps = React.ComponentPropsWithoutRef<'tr'>

function TableRow({children, ...rest}: TableRowProps) {
  return (
    <tr {...rest} className="TableRow" role="row">
      {children}
    </tr>
  )
}

// ----------------------------------------------------------------------------
// TableCell
// ----------------------------------------------------------------------------

export type TableCellProps = React.ComponentPropsWithoutRef<'td'> & {
  /**
   * Provide the scope for a table cell, useful for defining a row header using
   * `scope="row"`
   */
  scope?: 'row'
}

function TableCell({children, scope, ...rest}: TableCellProps) {
  const BaseComponent = scope ? 'th' : 'td'
  const role = scope ? 'rowheader' : 'cell'

  return (
    <BaseComponent {...rest} className="TableCell" scope={scope} role={role}>
      {children}
    </BaseComponent>
  )
}

// ----------------------------------------------------------------------------
// TableContainer
// ----------------------------------------------------------------------------
const StyledTableContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'title actions'
    'divider divider'
    'subtitle subtitle'
    'filter filter'
    'table table'
    'footer footer';
  column-gap: ${get('space.2')};

  ${sx}

  /* TableTitle */
  .TableTitle {
    grid-area: title;
    align-self: center;
  }

  /* TableSubtitle */
  .TableSubtitle {
    grid-area: subtitle;
  }

  /* TableActions */
  .TableActions {
    display: flex;
    column-gap: ${get('space.2')};
    align-items: center;
    grid-area: actions;
    justify-self: end;
  }

  /* TableDivider */
  .TableDivider {
    grid-area: divider;
    margin-top: ${get('space.3')};
    margin-bottom: ${get('space.2')};
  }

  /* Table */
  .Table {
    grid-area: table;
  }

  /* Spacing before the table */
  .TableTitle + .Table,
  .TableSubtitle + .Table,
  .TableActions + .Table {
    margin-top: ${get('space.2')};
  }
`

export type TableContainerProps = React.PropsWithChildren<SxProp>

function TableContainer({children, sx}: TableContainerProps) {
  return <StyledTableContainer sx={sx}>{children}</StyledTableContainer>
}

export type TableTitleProps = React.PropsWithChildren<{
  /**
   * Provide an alternate element or component to use as the container for
   * `TableSubtitle`. This is useful when specifying markup that is more
   * semantic for your use-case, such as a heading tag.
   */
  as?: keyof JSX.IntrinsicElements | React.ComponentType

  /**
   * Provide a unique id for the table subtitle. This should be used along with
   * `aria-labelledby` on `DataTable`
   */
  id: string
}>

function TableTitle({as = 'h2', children, id}: TableTitleProps) {
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

export type TableSubtitleProps = React.PropsWithChildren<{
  /**
   * Provide an alternate element or component to use as the container for
   * `TableSubtitle`. This is useful when specifying markup that is more
   * semantic for your use-case
   */
  as?: keyof JSX.IntrinsicElements | React.ComponentType

  /**
   * Provide a unique id for the table subtitle. This should be used along with
   * `aria-describedby` on `DataTable`
   */
  id: string
}>

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

function TableDivider() {
  return (
    <Box
      className="TableDivider"
      role="presentation"
      sx={{
        backgroundColor: 'border.default',
        width: '100%',
        height: 1,
      }}
    />
  )
}

export type TableActionsProps = React.PropsWithChildren

function TableActions({children}: TableActionsProps) {
  return <div className="TableActions">{children}</div>
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
  TableContainer,
  TableTitle,
  TableSubtitle,
  TableActions,
  TableDivider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableSortHeader,
  TableCell,
}
