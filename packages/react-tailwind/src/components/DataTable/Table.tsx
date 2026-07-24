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
    <div className="overflow-x-auto" data-component="Table.OverflowWrapper">
      <table
        {...props}
        ref={ref}
        data-component="Table"
        data-cell-padding={cellPadding}
        className={cn(
          'group w-full table-fixed border-separate border-spacing-0 text-left text-xs leading-[calc(20/12)]',
          className,
        )}
      />
    </div>
  )
})

export type TableHeadProps = React.ComponentPropsWithoutRef<'thead'>
export const TableHead = React.forwardRef<HTMLTableSectionElement, TableHeadProps>(function TableHead(
  {className, ...props},
  ref,
) {
  return <thead {...props} ref={ref} data-component="Table.Head" className={className} />
})

export type TableBodyProps = React.ComponentPropsWithoutRef<'tbody'>
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  {className, ...props},
  ref,
) {
  return <tbody {...props} ref={ref} data-component="Table.Body" className={className} />
})

export type TableRowProps = React.ComponentPropsWithoutRef<'tr'>
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  {className, ...props},
  ref,
) {
  return <tr {...props} ref={ref} data-component="Table.Row" className={cn('group/row hover:bg-muted', className)} />
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
        'border-y border-default bg-muted px-3 py-2 font-semibold text-muted first:rounded-tl-md first:border-l first:pl-4 last:rounded-tr-md last:border-r last:pr-4 aria-[sort=ascending]:text-default aria-[sort=descending]:text-default data-[align=end]:text-right group-data-[cell-padding=condensed]:px-2 group-data-[cell-padding=condensed]:py-1 group-data-[cell-padding=spacious]:px-4 group-data-[cell-padding=spacious]:py-3',
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
        className="inline-flex items-center gap-2 rounded-sm border-0 bg-transparent p-0 text-inherit shadow-none focus-visible:outline-2 focus-visible:outline-focus"
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
        'border-b border-default px-3 py-2 first:border-l first:pl-4 last:border-r last:pr-4 group-last/row:first:rounded-bl-md group-last/row:last:rounded-br-md data-[align=end]:text-right data-[scope=row]:font-semibold group-data-[cell-padding=condensed]:px-2 group-data-[cell-padding=condensed]:py-1 group-data-[cell-padding=spacious]:px-4 group-data-[cell-padding=spacious]:py-3',
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
      className={cn(
        "grid grid-cols-2 gap-x-2 [&>[data-component='Table.OverflowWrapper']]:col-span-2 [&>[data-component='Table.OverflowWrapper']]:mt-1",
        className,
      )}
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
      className={cn('m-0 self-center text-sm font-semibold leading-5', className)}
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
  return (
    <p
      {...props}
      ref={ref}
      data-component="Table.Subtitle"
      className={cn('col-span-2 m-0 text-xs leading-5', className)}
    />
  )
})

export const TableActions = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function TableActions(props, ref) {
    return (
      <div
        {...props}
        ref={ref}
        data-component="Table.Actions"
        className={cn('col-start-2 row-start-1 flex items-center justify-self-end gap-2', props.className)}
      />
    )
  },
)

export const TableDivider = () => (
  <hr data-component="Table.Divider" className="col-span-2 my-2 w-full border-default" />
)

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
