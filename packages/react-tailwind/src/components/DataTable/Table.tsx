'use client'

import {ChevronLeftIcon, ChevronRightIcon, SortAscIcon, SortDescIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {joinIdRefs} from '../../internal/idRefs'
import {UnstyledButton} from '../../internal/UnstyledButton'
import {Checkbox} from '../Checkbox'
import {Pagination, type PaginationProps} from '../Pagination'
import {useOverflowWithFocusRetention} from '../ScrollableRegion/useOverflow'
import {SkeletonText} from '../SkeletonText'
import {VisuallyHidden} from '../VisuallyHidden'
import {renderColumnHeader} from './column'
import type {Column, UniqueRow} from './DataTable'
import {getGridTemplateColumns, type TableColumnLayout} from './layout'
import {TableGroupContext} from './TableGroupContext'

const cellPaddingClassName =
  'primer:px-3 primer:py-2 primer:first:pl-4 primer:last:pr-4 primer:group-data-[cell-padding=condensed]:px-2 primer:group-data-[cell-padding=condensed]:py-1 primer:group-data-[cell-padding=spacious]:px-4 primer:group-data-[cell-padding=spacious]:py-3'

// Only the final visible row rounds its corners, and only when nothing (such as pagination) follows the table.
const cellClassName = cn(
  'primer:flex primer:items-center primer:border-b primer:border-default primer:text-start primer:first:border-l primer:last:border-r primer:data-[align=end]:justify-end primer:data-[align=end]:text-end',
  cellPaddingClassName,
  "primer:[[data-component='Table.OverflowWrapper']:last-child_tbody:last-of-type>tr:last-of-type>&:first-child]:rounded-bl-md",
  "primer:[[data-component='Table.OverflowWrapper']:last-child_tbody:last-of-type>tr:last-of-type>&:last-child]:rounded-br-md",
)

function resolveHeaders(group: React.ContextType<typeof TableGroupContext>, headers: string | undefined) {
  return joinIdRefs(group?.headerId, headers)
}

export interface TableProps extends React.ComponentPropsWithoutRef<'table'> {
  /**
   * Vertical spacing inside cells, which sets the density of the table.
   * @default 'normal'
   */
  cellPadding?: 'condensed' | 'normal' | 'spacious'
  /** Explicit column track sizes, as a CSS grid template. */
  gridTemplateColumns?: React.CSSProperties['gridTemplateColumns']
}
export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(
  {cellPadding = 'normal', className, gridTemplateColumns, style, ...props},
  ref,
) {
  const inheritedGroup = React.useContext(TableGroupContext)
  const [wrapper, setWrapper] = React.useState<HTMLDivElement | null>(null)
  const needsOverflowRegion = useOverflowWithFocusRetention(wrapper)
  const table = (
    <div
      ref={setWrapper}
      className="primer:overflow-x-auto"
      data-component="Table.OverflowWrapper"
      {...(needsOverflowRegion
        ? {
            role: 'region',
            tabIndex: 0,
            'aria-label': props['aria-labelledby'] ? undefined : props['aria-label'],
            'aria-labelledby': props['aria-labelledby'],
          }
        : {})}
    >
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
          // Keep absolutely positioned cell content within the overflow wrapper's clipping.
          'primer:relative primer:group primer:grid primer:w-full primer:border-spacing-0 primer:bg-default primer:text-xs primer:leading-[calc(20/12)] primer:[grid-template-columns:var(--grid-template-columns)]',
          className,
        )}
      />
    </div>
  )

  // A table nested inside a group cell must not inherit the outer group's header association.
  return inheritedGroup ? <TableGroupContext.Provider value={undefined}>{table}</TableGroupContext.Provider> : table
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
      className={cn('primer:grid primer:grid-cols-subgrid primer:[grid-column:-1/1]', className)}
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
      className={cn('primer:grid primer:grid-cols-subgrid primer:[grid-column:-1/1]', className)}
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
      className={cn('primer:group/row primer:grid primer:grid-cols-subgrid primer:[grid-column:-1/1]', className)}
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
      data-component="Table.Header"
      {...props}
      ref={ref}
      scope="col"
      data-align={align}
      className={cn(
        'primer:flex primer:items-center primer:border-y primer:border-default primer:bg-muted primer:px-3 primer:py-2 primer:text-start primer:font-semibold primer:text-muted primer:first:rounded-tl-md primer:first:border-l primer:first:pl-4 primer:last:rounded-tr-md primer:last:border-r primer:last:pr-4 primer:aria-[sort=ascending]:text-default primer:aria-[sort=descending]:text-default primer:data-[align=end]:justify-end primer:data-[align=end]:text-end primer:group-data-[cell-padding=condensed]:px-2 primer:group-data-[cell-padding=condensed]:py-1 primer:group-data-[cell-padding=spacious]:px-4 primer:group-data-[cell-padding=spacious]:py-3',
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
  const sortDescriptionId = `${React.useId()}-sort-description`
  return (
    <TableHeader
      {...props}
      ref={ref}
      align={align}
      aria-sort={direction === 'ASC' ? 'ascending' : direction === 'DESC' ? 'descending' : undefined}
      data-component="Table.SortHeader"
      className={cn('primer:group/header', className)}
    >
      <UnstyledButton
        data-component="Table.SortHeader.Button"
        // The column name stays the button's name; the sort action it performs is supplementary.
        aria-describedby={sortDescriptionId}
        onClick={onToggleSort}
        className={cn('primer:group/sort primer:gap-x-2', align === 'end' && 'primer:flex primer:flex-row-reverse')}
      >
        {children}
        {direction !== 'DESC' ? (
          <SortAscIcon
            aria-hidden="true"
            className="primer:invisible primer:group-hover/header:visible primer:group-focus/sort:visible primer:group-aria-[sort=ascending]/header:visible"
          />
        ) : null}
        {direction === 'DESC' ? <SortDescIcon aria-hidden="true" /> : null}
      </UnstyledButton>
      <span hidden id={sortDescriptionId}>
        {direction === 'ASC' ? 'Sort descending' : 'Sort ascending'}
      </span>
    </TableHeader>
  )
})

export interface TableSelectionHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<'th'>, 'align' | 'children' | 'onChange'> {
  /** Whether all, some, or none of the selectable rows are selected. */
  selection: 'all' | 'some' | 'none'
  /** Prevents toggling selection, for when no rows can be selected. */
  disabled?: boolean
  /** Called when the reader asks to select or clear every selectable row. */
  onToggleSelect?: () => void
  /** Ref to the selection checkbox, for returning focus to it. */
  checkboxRef?: React.Ref<HTMLElement>
  /** Accessible name for the selection checkbox. */
  'aria-label'?: string
  /** IDs of elements that describe the selection checkbox. */
  'aria-describedby'?: string
  /** Supplementary description for the selection checkbox, such as how many rows it selects. */
  description?: string
}
export const TableSelectionHeader = React.forwardRef<HTMLTableCellElement, TableSelectionHeaderProps>(
  function TableSelectionHeader(
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel = 'Select rows',
      checkboxRef,
      className,
      description,
      disabled,
      onToggleSelect,
      selection,
      ...props
    },
    ref,
  ) {
    const descriptionId = `${React.useId()}-description`
    return (
      <TableHeader
        {...props}
        ref={ref}
        data-component="Table.SelectionHeader"
        className={cn('primer:justify-center', className)}
      >
        <Checkbox
          ref={checkboxRef}
          aria-describedby={joinIdRefs(description && descriptionId, ariaDescribedBy)}
          aria-label={ariaLabel}
          checked={selection === 'all'}
          disabled={disabled}
          indeterminate={selection === 'some'}
          onCheckedChange={() => onToggleSelect?.()}
        />
        {description ? (
          <span hidden id={descriptionId}>
            {description}
          </span>
        ) : null}
      </TableHeader>
    )
  },
)

export interface TableCellProps extends Omit<React.ComponentPropsWithoutRef<'td'>, 'align'> {
  /** Horizontal alignment of the cell's content. */
  align?: Alignment
  /** Marks the cell as a header for its row or column, which assistive technology uses to describe other cells. */
  scope?: 'row'
}
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  {align, className, headers, scope, ...props},
  ref,
) {
  const group = React.useContext(TableGroupContext)
  const Component = scope ? 'th' : 'td'
  return (
    <Component
      {...props}
      ref={ref as React.Ref<HTMLTableCellElement>}
      headers={resolveHeaders(group, headers)}
      scope={scope}
      data-component="Table.Cell"
      data-align={align}
      data-scope={scope}
      className={cn(cellClassName, 'primer:data-[scope=row]:font-semibold', className)}
    />
  )
})

export interface TableRowSelectionProps
  extends Omit<React.ComponentPropsWithoutRef<'td'>, 'align' | 'children' | 'onChange'> {
  /** Whether the row is selected. */
  selected: boolean
  /** Prevents selecting the row. */
  disabled?: boolean
  /** Called when the reader asks to select or deselect the row. */
  onToggleSelect?: () => void
  /** Ref to the row's selection checkbox. */
  checkboxRef?: React.Ref<HTMLElement>
  /** Accessible name for the checkbox when no row header labels it. */
  'aria-label'?: string
  /** Ids of the row header or headers that label the checkbox. The selection action is prepended automatically. */
  'aria-labelledby'?: string
}
export const TableRowSelection = React.forwardRef<HTMLTableCellElement, TableRowSelectionProps>(
  function TableRowSelection(
    {
      'aria-label': ariaLabel = 'Select row',
      'aria-labelledby': ariaLabelledBy,
      checkboxRef,
      className,
      disabled,
      headers,
      onToggleSelect,
      selected,
      ...props
    },
    ref,
  ) {
    const actionLabelId = React.useId()
    const group = React.useContext(TableGroupContext)
    return (
      <td
        {...props}
        ref={ref}
        headers={resolveHeaders(group, headers)}
        data-component="Table.RowSelection"
        className={cn(cellClassName, 'primer:justify-center', className)}
      >
        {ariaLabelledBy ? <VisuallyHidden id={actionLabelId}>Select</VisuallyHidden> : null}
        <Checkbox
          ref={checkboxRef}
          aria-label={ariaLabelledBy ? undefined : ariaLabel}
          aria-labelledby={ariaLabelledBy ? `${actionLabelId} ${ariaLabelledBy}` : undefined}
          checked={selected}
          disabled={disabled}
          onCheckedChange={() => onToggleSelect?.()}
        />
      </td>
    )
  },
)

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
        "primer:grid primer:grid-cols-[1fr_1fr] primer:gap-x-2 primer:[&>[data-component='Table.OverflowWrapper']]:col-span-2 primer:[&>[data-component='Table.OverflowWrapper']:not(:first-child)]:mt-2",
        className,
      )}
    />
  )
})

type TableTextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'

export interface TableTitleProps extends React.ComponentPropsWithoutRef<'h2'> {
  /**
   * Native heading or paragraph element, chosen independently of the title's visual style.
   * @default 'h2'
   */
  as?: TableTextElement
}
export const TableTitle = React.forwardRef<HTMLHeadingElement, TableTitleProps>(function TableTitle(
  {as: Component = 'h2', children, className, ...props},
  ref,
) {
  return (
    <Component
      {...props}
      ref={ref}
      data-component="Table.Title"
      className={cn('primer:m-0 primer:self-center primer:text-sm primer:font-semibold primer:leading-5', className)}
    >
      {children}
    </Component>
  )
})

export interface TableSubtitleProps extends React.ComponentPropsWithoutRef<'p'> {
  /**
   * Native heading or paragraph element, chosen independently of the subtitle's visual style.
   * @default 'p'
   */
  as?: TableTextElement
}
export const TableSubtitle = React.forwardRef<HTMLParagraphElement, TableSubtitleProps>(function TableSubtitle(
  {as: Component = 'p', className, ...props},
  ref,
) {
  return (
    <Component
      {...props}
      ref={ref}
      data-component="Table.Subtitle"
      className={cn(
        'primer:col-span-2 primer:m-0 primer:text-xs primer:font-[number:inherit] primer:leading-[1.5]',
        className,
      )}
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
        className={cn(
          'primer:col-start-2 primer:row-start-1 primer:flex primer:items-center primer:justify-self-end primer:gap-2',
          props.className,
        )}
      />
    )
  },
)

export const TableDivider = () => (
  <div
    aria-hidden="true"
    data-component="Table.Divider"
    className="primer:col-span-2 primer:mt-4 primer:mb-2 primer:h-px primer:w-full primer:bg-default"
  />
)

export const TableCellPlaceholder = ({className, ...props}: React.ComponentPropsWithoutRef<'span'>) => (
  <span {...props} data-component="Table.CellPlaceholder" className={cn('primer:text-muted', className)} />
)

const defaultShowPages = {narrow: false} as const

// Previous and Next sit flush together wherever numbered pages are hidden.
const paginationEdgeSpacing = {
  previous: {
    narrow: {true: 'primer:mr-4', false: 'primer:mr-0'},
    regular: {true: 'primer:md:mr-4', false: 'primer:md:mr-0'},
    wide: {true: 'primer:2xl:mr-4', false: 'primer:2xl:mr-0'},
  },
  next: {
    narrow: {true: 'primer:ml-4', false: 'primer:ml-0'},
    regular: {true: 'primer:md:ml-4', false: 'primer:md:ml-0'},
    wide: {true: 'primer:2xl:ml-4', false: 'primer:2xl:ml-0'},
  },
} as const

function getPaginationEdgeSpacing(showPages: NonNullable<PaginationProps['showPages']>, edge: 'previous' | 'next') {
  return (['narrow', 'regular', 'wide'] as const).map(viewport => {
    const visible = typeof showPages === 'boolean' ? showPages : (showPages[viewport] ?? true)
    return paginationEdgeSpacing[edge][viewport][visible ? 'true' : 'false']
  })
}

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
  /** Shows the numbered pages. Defaults to hiding them on narrow viewports, keeping only Previous and Next. */
  showPages?: PaginationProps['showPages']
}
export const TablePagination = React.forwardRef<HTMLElement, TablePaginationProps>(function TablePagination(
  {className, defaultPageIndex = 0, onChange, pageSize, showPages = defaultShowPages, totalCount, ...props},
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
        'primer:col-span-2 primer:!m-0 primer:flex primer:min-h-[53px] primer:w-full primer:items-center primer:justify-between primer:gap-4 primer:rounded-b-md primer:border-thin primer:border-t-0 primer:border-default primer:px-4 primer:py-2 primer:[&_[role=presentation]]:mr-0 primer:[&_[role=presentation]]:text-[14px] primer:[&_[role=presentation]]:leading-5',
        className,
      )}
      currentPage={pageIndex + 1}
      data-component="Table.Pagination"
      pageCount={pageCount}
      showPages={showPages}
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
              'primer:mr-0 primer:h-auto primer:min-h-8 primer:appearance-none primer:border-0 primer:bg-transparent primer:[font-family:inherit] primer:text-[14px] primer:leading-5 primer:aria-disabled:text-muted',
              pageType === 'previous' && ['primer:px-2', getPaginationEdgeSpacing(showPages, 'previous')],
              pageType === 'next' && ['primer:px-2', getPaginationEdgeSpacing(showPages, 'next')],
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
                {!disabled ? <ChevronLeftIcon aria-hidden="true" className="primer:size-4" /> : null}
                <span>Previous</span>
                <VisuallyHidden>&nbsp;page</VisuallyHidden>
              </>
            ) : pageType === 'next' ? (
              <>
                <span>Next</span>
                <VisuallyHidden>&nbsp;page</VisuallyHidden>
                {!disabled ? <ChevronRightIcon aria-hidden="true" className="primer:size-4" /> : null}
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
      <p className="primer:m-0 primer:text-xs primer:text-muted" data-component="Table.Pagination.Range">
        {pageStart}
        <VisuallyHidden>&nbsp;through&nbsp;</VisuallyHidden>
        <span aria-hidden="true">‒</span>
        {pageEnd} of {totalCount}
      </p>
    </Pagination>
  )
})

export interface TableSkeletonProps<Data extends UniqueRow = UniqueRow> extends Omit<TableProps, 'children'> {
  /** DataTable columns or header-only definitions whose headers, alignment, and layout the placeholder mirrors. */
  columns: Array<
    | Column<Data>
    | (TableColumnLayout & Pick<Column<Data>, 'align'> & {header: React.ReactNode | Column<Data>['header']})
  >
  /** Number of placeholder rows to render while data loads. */
  rows?: number
}
export function TableSkeleton<Data extends UniqueRow = UniqueRow>({
  columns,
  rows = 10,
  ...props
}: TableSkeletonProps<Data>) {
  return (
    <Table {...props} gridTemplateColumns={getGridTemplateColumns(columns)}>
      <TableHead>
        <TableRow>
          {columns.map((column, index) => (
            <TableHeader key={index} align={column.align}>
              {renderColumnHeader(column.header)}
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {columns.map((column, columnIndex) => (
            <TableCell key={columnIndex} align={column.align} className="primer:p-0 primer:first:pl-0 primer:last:pr-0">
              <VisuallyHidden>Loading</VisuallyHidden>
              <div aria-hidden="true" className="primer:flex primer:w-full primer:flex-col">
                {Array.from({length: rows}, (_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={cn(
                      'primer:flex primer:border-b primer:border-default primer:px-3 primer:py-2 primer:last:border-b-0',
                      column.align === 'end' && 'primer:justify-end',
                      columnIndex === 0 && 'primer:pl-4',
                      columnIndex === columns.length - 1 && 'primer:pr-4',
                    )}
                  >
                    <SkeletonText maxWidth={`${[85, 67.5, 80, 60, 75][rowIndex % 5]}%`} />
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
