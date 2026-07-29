'use client'

import {ChevronLeftIcon, ChevronRightIcon, SortAscIcon, SortDescIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {ButtonBase} from '../Button'
import {Pagination, type PaginationProps} from '../Pagination'
import {SkeletonText} from '../SkeletonText'
import {VisuallyHidden} from '../VisuallyHidden'
import {getGridTemplateColumns, type TableColumnLayout} from './layout'

export interface TableProps extends React.ComponentPropsWithoutRef<'table'> {
  /** Vertical spacing inside cells, which sets the density of the table. */
  cellPadding?: 'condensed' | 'normal' | 'spacious'
  /** Explicit column track sizes, as a CSS grid template. */
  gridTemplateColumns?: React.CSSProperties['gridTemplateColumns']
}
export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(
  {cellPadding = 'normal', className, gridTemplateColumns, style, ...props},
  ref,
) {
  return (
    <div className="overflow-x-auto" data-component="Table.OverflowWrapper">
      <table
        {...props}
        ref={ref}
        data-component="Table"
        data-cell-padding={cellPadding}
        style={
          {
            ...style,
            '--grid-template-columns': gridTemplateColumns,
            borderCollapse: 'separate',
          } as React.CSSProperties
        }
        className={cn(
          'group grid w-full border-spacing-0 bg-default text-xs leading-[calc(20/12)] [grid-template-columns:var(--grid-template-columns)]',
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
  return (
    <thead
      {...props}
      ref={ref}
      data-component="Table.Head"
      className={cn('grid grid-cols-subgrid [grid-column:-1/1]', className)}
    />
  )
})

export type TableBodyProps = React.ComponentPropsWithoutRef<'tbody'>
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  {className, ...props},
  ref,
) {
  return (
    <tbody
      {...props}
      ref={ref}
      data-component="Table.Body"
      className={cn('grid grid-cols-subgrid [grid-column:-1/1]', className)}
    />
  )
})

export type TableRowProps = React.ComponentPropsWithoutRef<'tr'>
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  {className, ...props},
  ref,
) {
  return (
    <tr
      {...props}
      ref={ref}
      data-component="Table.Row"
      className={cn('group/row grid grid-cols-subgrid [grid-column:-1/1]', className)}
    />
  )
})

type Alignment = 'start' | 'end'
export interface TableHeaderProps extends Omit<React.ComponentPropsWithoutRef<'th'>, 'align'> {
  /** Horizontal alignment of the header's content. */
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
        'flex items-center border-y border-default bg-muted px-3 py-2 font-semibold text-muted first:rounded-tl-md first:border-l first:pl-4 last:rounded-tr-md last:border-r last:pr-4 aria-[sort=ascending]:text-default aria-[sort=descending]:text-default data-[align=end]:justify-end data-[align=end]:text-right group-data-[cell-padding=condensed]:px-2 group-data-[cell-padding=condensed]:py-1 group-data-[cell-padding=spacious]:px-4 group-data-[cell-padding=spacious]:py-3',
        className,
      )}
    />
  )
})

export type SortDirection = 'ASC' | 'DESC' | 'NONE'
export interface TableSortHeaderProps extends TableHeaderProps {
  /** Current sort direction for this column. */
  direction: SortDirection
  /** Called when the header is activated to change the sort. */
  onToggleSort: () => void
}
export const TableSortHeader = React.forwardRef<HTMLTableCellElement, TableSortHeaderProps>(function TableSortHeader(
  {align, children, className, direction, onToggleSort, ...props},
  ref,
) {
  return (
    <TableHeader
      {...props}
      ref={ref}
      align={align}
      aria-sort={direction === 'ASC' ? 'ascending' : direction === 'DESC' ? 'descending' : undefined}
      data-component="Table.SortHeader"
      className={className}
    >
      <ButtonBase
        type="button"
        onClick={onToggleSort}
        className={cn(
          'inline-flex items-center gap-2 rounded-sm border-0 bg-transparent p-0 text-inherit shadow-none focus-visible:outline-2 focus-visible:outline-focus',
          align === 'end' && 'flex-row-reverse',
        )}
      >
        {children}
        {direction === 'DESC' ? (
          <SortDescIcon aria-hidden="true" />
        ) : (
          <SortAscIcon aria-hidden="true" className={direction === 'NONE' ? 'invisible' : undefined} />
        )}
        {direction === 'NONE' ? <span className="sr-only">sort ascending</span> : null}
      </ButtonBase>
    </TableHeader>
  )
})

export interface TableCellProps extends Omit<React.ComponentPropsWithoutRef<'td'>, 'align'> {
  /** Horizontal alignment of the cell's content. */
  align?: Alignment
  /** Marks the cell as a header for its row or column, which assistive technology uses to describe other cells. */
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
      data-scope={scope}
      className={cn(
        'flex items-center border-b border-default px-3 py-2 first:border-l first:pl-4 last:border-r last:pr-4 group-last/row:first:rounded-bl-md group-last/row:last:rounded-br-md data-[align=end]:justify-end data-[align=end]:text-right data-[scope=row]:font-semibold group-data-[cell-padding=condensed]:px-2 group-data-[cell-padding=condensed]:py-1 group-data-[cell-padding=spacious]:px-4 group-data-[cell-padding=spacious]:py-3',
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
        "grid grid-cols-2 gap-x-2 [&>[data-component='Table.OverflowWrapper']]:col-span-2 [&>[data-component='Table.OverflowWrapper']:not(:first-child)]:mt-2",
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
      className={cn('col-span-2 m-0 text-xs leading-[1.5]', className)}
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
  <div aria-hidden="true" data-component="Table.Divider" className="col-span-2 mt-4 mb-2 h-px w-full bg-default" />
)

export const TableCellPlaceholder = ({className, ...props}: React.ComponentPropsWithoutRef<'span'>) => (
  <span {...props} data-component="Table.CellPlaceholder" className={cn('text-muted', className)} />
)

export interface TablePaginationProps
  extends Omit<PaginationProps, 'currentPage' | 'pageCount' | 'onChange' | 'onPageChange'> {
  /** Zero-based page shown on first render. */
  defaultPageIndex?: number
  /** Number of rows shown per page. */
  pageSize: number
  /** Total number of rows across all pages. */
  totalCount: number
  /** Called with the new page index when the reader pages through the table. */
  onChange?: (details: {pageIndex: number}) => void
}
export const TablePagination = React.forwardRef<HTMLElement, TablePaginationProps>(function TablePagination(
  {className, defaultPageIndex = 0, onChange, pageSize, totalCount, ...props},
  ref,
) {
  const [pageIndex, setPageIndex] = React.useState(defaultPageIndex)
  const pageCount = Math.ceil(totalCount / pageSize)
  const pageStart = pageIndex * pageSize + 1
  const pageEnd = Math.min((pageIndex + 1) * pageSize, totalCount)

  return (
    <Pagination
      {...props}
      ref={ref}
      className={cn(
        'col-span-2 !m-0 flex min-h-[53px] w-full items-center justify-between gap-4 rounded-b-md border border-t-0 border-default px-4 py-2 [&_[role=presentation]]:mr-0 [&_[role=presentation]]:text-[14px] [&_[role=presentation]]:leading-5',
        className,
      )}
      currentPage={pageIndex + 1}
      data-component="Table.Pagination"
      pageCount={pageCount}
      renderPage={page => {
        const {children, className: pageClassName, number, onPageSelect, pageType} = page
        const disabled = page['aria-disabled']
        return (
          <button
            aria-current={page['aria-current']}
            aria-disabled={disabled}
            aria-label={page['aria-label']}
            className={cn(
              pageClassName,
              'mr-0 h-auto min-h-8 appearance-none border-0 bg-transparent [font-family:inherit] text-[14px] leading-5 aria-disabled:text-muted',
              pageType === 'previous' && 'mr-4 px-2',
              pageType === 'next' && 'ml-4 px-2',
            )}
            data-component={
              pageType === 'previous'
                ? 'Table.Pagination.PreviousPageButton'
                : pageType === 'next'
                  ? 'Table.Pagination.NextPageButton'
                  : 'Table.Pagination.Page'
            }
            data-page={pageType}
            data-page-number={number}
            key={`${pageType}-${number}`}
            type="button"
            onClick={onPageSelect}
          >
            {pageType === 'previous' ? (
              <>
                {!disabled ? <ChevronLeftIcon aria-hidden="true" className="size-4" /> : null}
                <span>Previous</span>
                <VisuallyHidden>&nbsp;page</VisuallyHidden>
              </>
            ) : pageType === 'next' ? (
              <>
                <span>Next</span>
                <VisuallyHidden>&nbsp;page</VisuallyHidden>
                {!disabled ? <ChevronRightIcon aria-hidden="true" className="size-4" /> : null}
              </>
            ) : (
              children
            )}
          </button>
        )
      }}
      onPageChange={(event, page) => {
        event.preventDefault()
        const nextPageIndex = page - 1
        setPageIndex(nextPageIndex)
        onChange?.({pageIndex: nextPageIndex})
      }}
    >
      <p className="m-0 text-xs text-muted" data-component="Table.Pagination.Range">
        {pageStart}
        <VisuallyHidden>&nbsp;through&nbsp;</VisuallyHidden>
        <span aria-hidden="true">‒</span>
        {pageEnd} of {totalCount}
      </p>
    </Pagination>
  )
})

export interface TableSkeletonProps extends Omit<TableProps, 'children'> {
  /** Column definitions the placeholder should mirror. */
  columns: Array<TableColumnLayout & {header: React.ReactNode}>
  /** Number of placeholder rows to render while data loads. */
  rows?: number
}
export function TableSkeleton({columns, rows = 10, ...props}: TableSkeletonProps) {
  return (
    <Table {...props} aria-busy="true" gridTemplateColumns={getGridTemplateColumns(columns)}>
      <TableHead>
        <TableRow>
          {columns.map((column, index) => (
            <TableHeader key={index}>{column.header}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {columns.map((_, columnIndex) => (
            <TableCell key={columnIndex} className="p-0 first:pl-0 last:pr-0">
              <div className="flex w-full flex-col">
                {Array.from({length: rows}, (_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={cn(
                      'border-b border-default px-3 py-2 last:border-b-0',
                      columnIndex === 0 && 'pl-4',
                      columnIndex === columns.length - 1 && 'pr-4',
                    )}
                  >
                    <SkeletonText aria-label="Loading" style={{maxWidth: `${[85, 67.5, 80, 60, 75][rowIndex % 5]}%`}} />
                  </div>
                ))}
              </div>
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  )
}

Table.displayName = 'Table'
;('use client')
