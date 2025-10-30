import {SortAscIcon, SortDescIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import React, { type JSX } from 'react';
import Text from '../Text'
import VisuallyHidden from '../_VisuallyHidden'
import type {Column, CellAlignment} from './column'
import type {UniqueRow} from './row'
import {SortDirection} from './sorting'
import {useTableLayout} from './useTable'
import {SkeletonText} from '../SkeletonText'
import {ScrollableRegion} from '../ScrollableRegion'
import {Button} from '../internal/components/ButtonReset'
import classes from './Table.module.css'
import type {PolymorphicProps} from '../utils/modern-polymorphic'

// ----------------------------------------------------------------------------
// Table
// ----------------------------------------------------------------------------

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
    // TODO update type to be non-optional in next major release
    // @ts-expect-error this type should be required in the next major version
    (<ScrollableRegion
      aria-labelledby={labelledby}
      className={clsx('TableOverflowWrapper', classes.TableOverflowWrapper)}
    >
      <table
        {...rest}
        aria-labelledby={labelledby}
        data-cell-padding={cellPadding}
        className={clsx(className, 'Table', classes.Table)}
        role="table"
        ref={ref}
        style={{'--grid-template-columns': gridTemplateColumns} as React.CSSProperties}
      />
    </ScrollableRegion>)
  );
})

// ----------------------------------------------------------------------------
// TableHead
// ----------------------------------------------------------------------------

export type TableHeadProps = React.ComponentPropsWithoutRef<'thead'>

function TableHead({children}: TableHeadProps) {
  return (
    // We need to explicitly pass this role because some ATs and browsers drop table semantics
    // when we use `display: contents` or `display: grid` in the table
    (<thead className={clsx('TableHead', classes.TableHead)} role="rowgroup">
      {children}
    </thead>)
  );
}

// ----------------------------------------------------------------------------
// TableBody
// ----------------------------------------------------------------------------

export type TableBodyProps = React.ComponentPropsWithoutRef<'tbody'>

function TableBody({children}: TableBodyProps) {
  return (
    // We need to explicitly pass this role because some ATs and browsers drop table semantics
    // when we use `display: contents` or `display: grid` in the table
    (<tbody className={clsx('TableBody', classes.TableBody)} role="rowgroup">
      {children}
    </tbody>)
  );
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
    <th
      {...rest}
      className={clsx('TableHeader', classes.TableHeader)}
      role="columnheader"
      scope="col"
      data-cell-align={align}
    >
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
        className={clsx('TableSortButton', classes.TableSortButton)}
        onClick={() => {
          onToggleSort()
        }}
      >
        {children}
        {direction === SortDirection.NONE || direction === SortDirection.ASC ? (
          <>
            <SortAscIcon
              className={clsx(
                'TableSortIcon',
                'TableSortIcon--ascending',
                classes.TableSortIcon,
                classes['TableSortIcon--ascending'],
              )}
            />
            {direction === SortDirection.NONE ? <VisuallyHidden>sort ascending</VisuallyHidden> : null}
          </>
        ) : null}
        {direction === SortDirection.DESC ? (
          <SortDescIcon
            className={clsx(
              'TableSortIcon',
              'TableSortIcon--descending',
              classes.TableSortIcon,
              classes['TableSortIcon--descending'],
            )}
          />
        ) : null}
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
    <tr {...rest} className={clsx('TableRow', classes.TableRow)} role="row">
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
    <BaseComponent
      {...rest}
      className={clsx('TableCell', className, classes.TableCell)}
      scope={scope}
      role={role}
      data-cell-align={align}
    >
      {children}
    </BaseComponent>
  )
}

type TableCellPlaceholderProps = React.PropsWithChildren

function TableCellPlaceholder({children}: TableCellPlaceholderProps) {
  return <Text className={classes.PlaceholderText}>{children}</Text>
}

// ----------------------------------------------------------------------------
// TableContainer
// ----------------------------------------------------------------------------
export type TableContainerProps<As extends React.ElementType = 'div'> = PolymorphicProps<As, 'div'> &
  React.PropsWithChildren

function TableContainer<As extends React.ElementType = 'div'>({
  children,
  className,
  as,
  ...rest
}: TableContainerProps<As>) {
  const Component = as || 'div'
  return (
    <Component {...rest} className={clsx(className, classes.TableContainer)}>
      {children}
    </Component>
  )
}

export type TableTitleProps = React.PropsWithChildren<
  {
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
  } & React.HTMLAttributes<HTMLElement> &
    React.RefAttributes<HTMLElement>
>

const TableTitle = React.forwardRef<HTMLElement, TableTitleProps>(function TableTitle(
  {as: Component = 'h2', children, id},
  ref,
) {
  const BaseComponent = Component as React.ElementType
  return (
    <BaseComponent className={clsx('TableTitle', classes.TableTitle)} id={id} ref={ref}>
      {children}
    </BaseComponent>
  )
})

export type TableSubtitleProps = React.PropsWithChildren<
  {
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
  } & React.HTMLAttributes<HTMLElement>
>

function TableSubtitle({as: BaseComponent = 'div', children, id}: TableSubtitleProps) {
  return (
    <BaseComponent className={clsx('TableSubtitle', classes.TableSubtitle)} id={id}>
      {children}
    </BaseComponent>
  )
}

function TableDivider() {
  return <div className={clsx('TableDivider', classes.TableDivider)} role="presentation" />
}

export type TableActionsProps = React.PropsWithChildren

function TableActions({children}: TableActionsProps) {
  return <div className={clsx('TableActions', classes.TableActions)}>{children}</div>
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
              <TableCell key={i} className={clsx('TableCellSkeleton', classes.TableCellSkeleton)}>
                <VisuallyHidden>Loading</VisuallyHidden>
                <div className={clsx('TableCellSkeletonItems', classes.TableCellSkeletonItems)}>
                  {Array.from({length: rows}).map((_, i) => {
                    return (
                      <div key={i} className={clsx('TableCellSkeletonItem', classes.TableCellSkeletonItem)}>
                        <SkeletonText />
                      </div>
                    )
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
