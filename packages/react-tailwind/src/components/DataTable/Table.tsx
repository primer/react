import {SortAscIcon, SortDescIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {ButtonBase} from '../Button'
import {SkeletonText} from '../SkeletonText'

export interface TableProps extends React.ComponentPropsWithoutRef<'table'> {
  cellPadding?: 'condensed' | 'normal' | 'spacious'
}
export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(
  {cellPadding = 'normal', className, ...props},
  ref,
) {
  return (
    <div className="overflow-x-auto">
      <table
        {...props}
        ref={ref}
        data-component="Table"
        data-cell-padding={cellPadding}
        className={cn('group w-full border-collapse text-left text-sm', className)}
      />
    </div>
  )
})

export type TableHeadProps = React.ComponentPropsWithoutRef<'thead'>
export const TableHead = React.forwardRef<HTMLTableSectionElement, TableHeadProps>(function TableHead(
  {className, ...props},
  ref,
) {
  return <thead {...props} ref={ref} data-component="Table.Head" className={cn('border-b border-default', className)} />
})

export type TableBodyProps = React.ComponentPropsWithoutRef<'tbody'>
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  {className, ...props},
  ref,
) {
  return <tbody {...props} ref={ref} data-component="Table.Body" className={cn('divide-y divide-default', className)} />
})

export type TableRowProps = React.ComponentPropsWithoutRef<'tr'>
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  {className, ...props},
  ref,
) {
  return <tr {...props} ref={ref} data-component="Table.Row" className={cn('hover:bg-muted', className)} />
})

type Alignment = 'start' | 'end'
export interface TableHeaderProps extends Omit<React.ComponentPropsWithoutRef<'th'>, 'align'> {
  align?: Alignment
}
export const TableHeader = React.forwardRef<HTMLTableCellElement, TableHeaderProps>(function TableHeader(
  {align, className, ...props},
  ref,
) {
  return (
    <th
      {...props}
      ref={ref}
      scope="col"
      data-component="Table.Header"
      data-align={align}
      className={cn(
        'px-3 py-2 font-semibold text-default data-[align=end]:text-right group-data-[cell-padding=condensed]:px-2 group-data-[cell-padding=condensed]:py-1 group-data-[cell-padding=spacious]:px-4 group-data-[cell-padding=spacious]:py-3',
        className,
      )}
    />
  )
})

export type SortDirection = 'ASC' | 'DESC' | 'NONE'
export interface TableSortHeaderProps extends TableHeaderProps {
  direction: SortDirection
  onToggleSort: () => void
}
export const TableSortHeader = React.forwardRef<HTMLTableCellElement, TableSortHeaderProps>(function TableSortHeader(
  {children, className, direction, onToggleSort, ...props},
  ref,
) {
  return (
    <TableHeader
      {...props}
      ref={ref}
      aria-sort={direction === 'ASC' ? 'ascending' : direction === 'DESC' ? 'descending' : undefined}
      data-component="Table.SortHeader"
      className={className}
    >
      <ButtonBase
        type="button"
        onClick={onToggleSort}
        className="inline-flex items-center gap-1 rounded-sm focus-visible:outline-2 focus-visible:outline-focus"
      >
        {children}
        {direction === 'DESC' ? <SortDescIcon aria-hidden="true" /> : <SortAscIcon aria-hidden="true" />}
        <span className="sr-only">
          {direction === 'ASC' ? 'sort descending' : direction === 'DESC' ? 'sort ascending' : 'sort ascending'}
        </span>
      </ButtonBase>
    </TableHeader>
  )
})

export interface TableCellProps extends Omit<React.ComponentPropsWithoutRef<'td'>, 'align'> {
  align?: Alignment
  scope?: 'row'
}
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  {align, className, scope, ...props},
  ref,
) {
  const Component = scope ? 'th' : 'td'
  return (
    <Component
      {...props}
      ref={ref as React.Ref<HTMLTableCellElement>}
      scope={scope}
      data-component="Table.Cell"
      data-align={align}
      className={cn(
        'px-3 py-2 data-[align=end]:text-right group-data-[cell-padding=condensed]:px-2 group-data-[cell-padding=condensed]:py-1 group-data-[cell-padding=spacious]:px-4 group-data-[cell-padding=spacious]:py-3',
        className,
      )}
    />
  )
})

export type TableContainerProps = React.ComponentPropsWithoutRef<'div'>
export const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(function TableContainer(
  {className, ...props},
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      data-component="Table.Container"
      className={cn('rounded-md border border-default', className)}
    />
  )
})

export type TableTitleProps = React.ComponentPropsWithoutRef<'h2'>
export const TableTitle = React.forwardRef<HTMLHeadingElement, TableTitleProps>(function TableTitle(
  {children, className, ...props},
  ref,
) {
  return (
    <h2
      {...props}
      ref={ref}
      data-component="Table.Title"
      className={cn('px-3 pt-3 text-title-small font-display', className)}
    >
      {children}
    </h2>
  )
})

export type TableSubtitleProps = React.ComponentPropsWithoutRef<'p'>
export const TableSubtitle = React.forwardRef<HTMLParagraphElement, TableSubtitleProps>(function TableSubtitle(
  {className, ...props},
  ref,
) {
  return <p {...props} ref={ref} data-component="Table.Subtitle" className={cn('px-3 text-sm text-muted', className)} />
})

export const TableActions = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function TableActions(props, ref) {
    return (
      <div
        {...props}
        ref={ref}
        data-component="Table.Actions"
        className={cn('flex items-center gap-2 p-3', props.className)}
      />
    )
  },
)

export const TableDivider = () => <hr data-component="Table.Divider" className="border-default" />

export const TableCellPlaceholder = ({className, ...props}: React.ComponentPropsWithoutRef<'span'>) => (
  <span {...props} data-component="Table.CellPlaceholder" className={cn('text-muted', className)} />
)

export interface TableSkeletonProps extends Omit<TableProps, 'children'> {
  columns: Array<{header: React.ReactNode}>
  rows?: number
}
export function TableSkeleton({columns, rows = 10, ...props}: TableSkeletonProps) {
  return (
    <Table {...props} aria-busy="true">
      <TableHead>
        <TableRow>
          {columns.map((column, index) => (
            <TableHeader key={index}>{column.header}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({length: rows}, (_, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((_, columnIndex) => (
              <TableCell key={columnIndex}>
                <SkeletonText aria-label="Loading" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

Table.displayName = 'Table'
