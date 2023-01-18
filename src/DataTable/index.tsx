import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {useId} from '../hooks/useId'

// ----------------------------------------------------------------------------
// DataTable
// ----------------------------------------------------------------------------
interface DataTableProps {
  children?: React.ReactNode
}

function DataTable({children}: DataTableProps) {
  const id = useId()

  return (
    <>
      <div>{children}</div>
    </>
  )
}

// ----------------------------------------------------------------------------
// Table
// ----------------------------------------------------------------------------

const StyledTable = styled.table`
  & {
    --table-cell-padding: var(--cell-padding-block, 0.5rem) var(--cell-padding-inline, 0.75rem);
    --table-font-size: 0.75rem;
    --table-border-radius: 0.375rem;
    --table-offset: 1rem;

    background-color: ${get('colors.canvas.default')};
    border-spacing: 0;
    border-collapse: separate;
    border-top-left-radius: var(--table-border-radius);
    border-top-right-radius: var(--table-border-radius);
    font-size: var(--table-font-size);
    line-height: calc(20 / var(--table-font-size));
    width: 100%;
    overflow-x: auto;
  }

  /* Density modes: condensed, normal, spacious */
  &[data-density='condensed'] {
    --cell-padding-block: 0.25rem;
    --cell-padding-inline: 0.5rem;
  }

  &[data-density='normal'] {
    --cell-padding-block: 0.5rem;
    --cell-padding-inline: 0.75rem;
  }

  &[data-density='spacious'] {
    --cell-padding-block: 0.75rem;
    --cell-padding-inline: 1rem;
  }

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
    text-align: start;
  }

  .TableHeader {
    background-color: ${get('colors.canvas.subtle')};
    color: ${get('colors.fg.muted')};
    font-weight: 600;
    text-align: start;
    border-top: 1px solid ${get('colors.border.default')};
  }

  .TableHeader:first-child {
    border-top-left-radius: var(--table-border-radius);
  }

  .TableHeader:last-child {
    border-top-right-radius: var(--table-border-radius);
  }

  .TableRow:last-of-type .TableCell:first-child {
    border-bottom-left-radius: var(--table-border-radius);
  }

  .TableRow:last-of-type .TableCell:last-child {
    border-bottom-right-radius: var(--table-border-radius);
  }

  .TableRow {
    padding-inline-start: 16px;
    padding-inline-end: 16px;
  }

  .TableCell,
  .TableHeader {
    padding: var(--table-cell-padding);
  }

  .TableCell:first-of-type {
    padding-inline-start: var(--table-offset);
  }

  .TableCell:last-of-type {
    padding-inline-end: var(--table-offset);
  }

  .TableCell[scope='row'] {
    color: ${get('colors.fg.default')};
    font-weight: 600;
  }
`

interface TableProps {
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
   * the table
   */
  density?: 'condensed' | 'normal' | 'spacious' | undefined
}

function Table({
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  children,
  density = 'normal',
  ...rest
}: TableProps) {
  return (
    <StyledTable {...rest} aria-labelledby={labelledBy} aria-describedby={describedBy} data-density={density}>
      {children}
    </StyledTable>
  )
}

// ----------------------------------------------------------------------------
// TableHead
// ----------------------------------------------------------------------------

interface TableHeadProps {
  children?: React.ReactNode
}

function TableHead({children}: TableHeadProps) {
  return <thead className="TableHead">{children}</thead>
}

// ----------------------------------------------------------------------------
// TableBody
// ----------------------------------------------------------------------------

interface TableBodyProps {
  children?: React.ReactNode
}

function TableBody({children}: TableBodyProps) {
  return <tbody className="TableBody">{children}</tbody>
}

// ----------------------------------------------------------------------------
// TableHeader
// ----------------------------------------------------------------------------

interface TableHeaderProps {
  children?: React.ReactNode
}

function TableHeader({children}: TableHeaderProps) {
  return <th className="TableHeader">{children}</th>
}

// ----------------------------------------------------------------------------
// TableRow
// ----------------------------------------------------------------------------

interface TableRowProps {
  children?: React.ReactNode
}

function TableRow({children}: TableRowProps) {
  return <tr className="TableRow">{children}</tr>
}

// ----------------------------------------------------------------------------
// TableCell
// ----------------------------------------------------------------------------

interface TableCellProps {
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

export {Table, TableHead, TableBody, TableHeader, TableRow, TableCell}
