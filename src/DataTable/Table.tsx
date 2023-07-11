import {SortAscIcon, SortDescIcon} from '@primer/octicons-react'
import clsx from 'clsx'
import React from 'react'
import styled, {keyframes} from 'styled-components'
import Box from '../Box'
import Text from '../Text'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import VisuallyHidden from '../_VisuallyHidden'
import {Column, CellAlignment} from './column'
import {UniqueRow} from './row'
import {SortDirection} from './sorting'
import {useTableLayout} from './useTable'
import {useOverflow} from '../internal/hooks/useOverflow'

// ----------------------------------------------------------------------------
// Table
// ----------------------------------------------------------------------------

const shimmer = keyframes`
  from { mask-position: 200%; }
  to { mask-position: 0%; }
`
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
    text-align: start;
    border-bottom: 1px solid ${get('colors.border.default')};
  }

  .TableHeader[data-cell-align='end'],
  .TableCell[data-cell-align='end'] {
    text-align: end;
    display: flex;
    justify-content: flex-end;
  }

  .TableHeader[data-cell-align='end'] .TableSortButton {
    display: flex;
    flex-direction: row-reverse;
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

  .TableOverflowWrapper:last-child & .TableBody .TableRow:last-of-type .TableCell:first-child {
    border-bottom-left-radius: var(--table-border-radius);
  }

  .TableOverflowWrapper:last-child & .TableBody .TableRow:last-of-type .TableCell:last-child {
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
  .TableRow > *:first-child:not(.TableCellSkeleton),
  .TableRow > *:first-child .TableCellSkeletonItem {
    padding-inline-start: 1rem;
  }

  .TableRow > *:last-child:not(.TableCellSkeleton),
  .TableRow > *:last-child .TableCellSkeletonItem {
    padding-inline-end: 1rem;
  }

  /* TableHeader */
  .TableHeader {
    background-color: ${get('colors.canvas.subtle')};
    color: ${get('colors.fg.muted')};
    font-weight: 600;
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
  .TableHeader .TableSortButton:focus .TableSortIcon--ascending {
    visibility: visible;
  }

  /* Each sort icon is visible if the TableHeader is currently in the corresponding sort state */
  .TableHeader[aria-sort='ascending'] .TableSortIcon--ascending,
  .TableHeader[aria-sort='descending'] .TableSortIcon--descending {
    visibility: visible;
  }

  /* TableRow */
  .TableRow:hover .TableCell:not(.TableCellSkeleton) {
    /* TODO: update this token when the new primitive tokens are released */
    background-color: ${get('colors.actionListItem.default.hoverBg')};
  }

  /* TableCell */
  .TableCell[scope='row'] {
    color: ${get('colors.fg.default')};
    font-weight: 600;
  }

  /* TableCellSkeleton */
  .TableCellSkeleton {
    padding: 0;
  }

  .TableCellSkeletonItems {
    display: flex;
    flex-direction: column;
  }

  .TableCellSkeletonItem {
    padding: var(--table-cell-padding);

    &:nth-of-type(5n + 1) {
      --skeleton-item-width: 85%;
    }

    &:nth-of-type(5n + 2) {
      --skeleton-item-width: 67.5%;
    }

    &:nth-of-type(5n + 3) {
      --skeleton-item-width: 80%;
    }

    &:nth-of-type(5n + 4) {
      --skeleton-item-width: 60%;
    }

    &:nth-of-type(5n + 5) {
      --skeleton-item-width: 75%;
    }
  }

  .TableCellSkeletonItem:not(:last-of-type) {
    border-bottom: 1px solid ${get('colors.border.default')};
  }

  .TableCellSkeletonItem::before {
    display: block;
    content: '';
    height: 1rem;
    width: var(--skeleton-item-width, 67%);
    background-color: ${get('colors.canvas.subtle')};
    border-radius: 3px;

    @media (prefers-reduced-motion: no-preference) {
      mask-image: linear-gradient(75deg, #000 30%, rgba(0, 0, 0, 0.65) 80%);
      mask-size: 200%;
      animation: ${shimmer};
      animation-duration: 1s;
      animation-iteration-count: infinite;
    }

    @media (forced-colors: active) {
      outline: 1px solid transparent;
      outline-offset: -1px;
    }
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
  {'aria-labelledby': labelledby, cellPadding = 'normal', className, gridTemplateColumns, ...rest},
  ref,
) {
  return (
    <ScrollableRegion aria-labelledby={labelledby} className="TableOverflowWrapper">
      <StyledTable
        {...rest}
        aria-labelledby={labelledby}
        data-cell-padding={cellPadding}
        className={clsx('Table', className)}
        role="table"
        ref={ref}
        style={{'--grid-template-columns': gridTemplateColumns} as React.CSSProperties}
      />
    </ScrollableRegion>
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

export type TableHeaderProps = Omit<React.ComponentPropsWithoutRef<'th'>, 'align'> & {
  /**
   * The horizontal alignment of the cell's content
   */
  align?: CellAlignment
}

function TableHeader({align, children, ...rest}: TableHeaderProps) {
  return (
    <th {...rest} className="TableHeader" role="columnheader" scope="col" data-cell-align={align}>
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

function TableSortHeader({align, children, direction, onToggleSort, ...rest}: TableSortHeaderProps) {
  const ariaSort = direction === 'DESC' ? 'descending' : direction === 'ASC' ? 'ascending' : undefined

  return (
    <TableHeader {...rest} aria-sort={ariaSort} align={align}>
      <Button
        type="button"
        className="TableSortButton"
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

export type TableCellProps = Omit<React.ComponentPropsWithoutRef<'td'>, 'align'> & {
  /**
   * The horizontal alignment of the cell's content
   */
  align?: CellAlignment

  /**
   * Provide the scope for a table cell, useful for defining a row header using
   * `scope="row"`
   */
  scope?: 'row'
}

function TableCell({align, className, children, scope, ...rest}: TableCellProps) {
  const BaseComponent = scope ? 'th' : 'td'
  const role = scope ? 'rowheader' : 'cell'

  return (
    <BaseComponent {...rest} className={clsx('TableCell', className)} scope={scope} role={role} data-cell-align={align}>
      {children}
    </BaseComponent>
  )
}

type TableCellPlaceholderProps = React.PropsWithChildren

function TableCellPlaceholder({children}: TableCellPlaceholderProps) {
  return <Text color="fg.subtle">{children}</Text>
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
  .TableTitle + .TableOverflowWrapper,
  .TableSubtitle + .TableOverflowWrapper,
  .TableActions + .TableOverflowWrapper {
    margin-top: ${get('space.2')};
  }

  .TableOverflowWrapper {
    grid-area: table;
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

const TableTitle = React.forwardRef<HTMLElement, TableTitleProps>(function TableTitle({as = 'h2', children, id}, ref) {
  return (
    <Box
      as={as}
      className="TableTitle"
      id={id}
      ref={ref}
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
})

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
// TableSkeleton
// ----------------------------------------------------------------------------
export type TableSkeletonProps<Data extends UniqueRow> = React.ComponentPropsWithoutRef<'table'> & {
  /**
   * Specify the amount of space that should be available around the contents of
   * a cell
   */
  cellPadding?: 'condensed' | 'normal' | 'spacious'

  /**
   * Provide an array of columns for the table. Columns will render as the headers
   * of the table.
   */
  columns: Array<Column<Data>>

  /**
   * Optionally specify the number of rows which should be included in the
   * skeleton state of the component
   */
  rows?: number
}

function TableSkeleton<Data extends UniqueRow>({cellPadding, columns, rows = 10, ...rest}: TableSkeletonProps<Data>) {
  const {gridTemplateColumns} = useTableLayout(columns)
  return (
    <Table {...rest} cellPadding={cellPadding} gridTemplateColumns={gridTemplateColumns}>
      <TableHead>
        <TableRow>
          {Array.isArray(columns)
            ? columns.map((column, i) => {
                return (
                  <TableHeader key={i}>
                    {typeof column.header === 'string' ? column.header : column.header()}
                  </TableHeader>
                )
              })
            : null}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {Array.from({length: columns.length}).map((_, i) => {
            return (
              <TableCell key={i} className="TableCellSkeleton">
                <VisuallyHidden>Loading</VisuallyHidden>
                <div className="TableCellSkeletonItems">
                  {Array.from({length: rows}).map((_, i) => {
                    return <div key={i} className="TableCellSkeletonItem" />
                  })}
                </div>
              </TableCell>
            )
          })}
        </TableRow>
      </TableBody>
    </Table>
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

type ScrollableRegionProps = React.PropsWithChildren<{
  'aria-labelledby'?: string
  className?: string
}>

function ScrollableRegion({'aria-labelledby': labelledby, children, ...rest}: ScrollableRegionProps) {
  const ref = React.useRef(null)
  const hasOverflow = useOverflow(ref)
  const regionProps = hasOverflow
    ? {
        'aria-labelledby': labelledby,
        role: 'region',
        tabIndex: 0,
      }
    : {}

  return (
    <Box {...rest} {...regionProps} ref={ref} sx={{overflow: 'auto'}}>
      {children}
    </Box>
  )
}

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
  TableCellPlaceholder,
  TableSkeleton,
}
