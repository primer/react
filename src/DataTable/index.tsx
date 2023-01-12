import styled from 'styled-components'
import {get} from '../constants'

const StyledTable = styled.table`
  & {
    --table-cell-padding: var(--cell-padding-block, 0.5rem) var(--cell-padding-inline, 0.75rem);
    --table-font-size: 0.75rem;
    --table-border-radius: 0.375rem;

    background-color: ${get('colors.canvas.default')};
    border-spacing: 0;
    border-collapse: separate;
    border-top-left-radius: var(--table-border-radius);
    border-top-right-radius: var(--table-border-radius);
    font-size: var(--table-font-size);
    line-height: calc(20 / var(--table-font-size));
    width: 100%;
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

  .TableCell:first-of-type,
  .TableHeader:first-of-type {
    border-left: 1px solid ${get('colors.border.default')};
  }

  .TableHeader,
  .TableCell {
    border-right: 1px solid ${get('colors.border.default')};
    border-bottom: 1px solid ${get('colors.border.default')};
  }

  .TableHeader {
    background-color: ${get('colors.canvas.subtle')};
    color: ${get('colors.fg.muted')};
    font-weight: 600;
    text-align: start;
    /* How does this work for multiple <th> groups??? */
    border-top: 1px solid ${get('colors.border.default')};
  }

  .TableHeader:first-of-type {
    border-top-left-radius: var(--table-border-radius);
  }

  .TableHeader:last-of-type {
    border-top-right-radius: var(--table-border-radius);
  }

  .TableRow {
    padding-inline-start: 16px;
    padding-inline-end: 16px;
  }

  .TableCell,
  .TableHeader {
    padding: var(--table-cell-padding);
  }

  .TableCell[scope='row'] {
    color: ${get('colors.fg.default')};
    font-weight: 600;
  }
`

interface TableProps {
  density?: 'condensed' | 'normal' | 'spacious' | undefined
}

function Table({children, density = 'normal'}: React.PropsWithChildren<TableProps>) {
  return <StyledTable data-density={density}>{children}</StyledTable>
}

interface TableHeadProps {}

function TableHead({children}: React.PropsWithChildren<TableHeadProps>) {
  return <thead className="TableHead">{children}</thead>
}

interface TableBodyProps {}

function TableBody({children}: React.PropsWithChildren<TableBodyProps>) {
  return <tbody className="TableBody">{children}</tbody>
}

interface TableHeaderProps {}

function TableHeader({children}: React.PropsWithChildren<TableHeaderProps>) {
  return <th className="TableHeader">{children}</th>
}

interface TableRowProps {}

function TableRow({children}: React.PropsWithChildren<TableRowProps>) {
  return <tr className="TableRow">{children}</tr>
}

interface TableCellProps {
  scope?: string | undefined
}

function TableCell({children, scope}: React.PropsWithChildren<TableCellProps>) {
  return (
    <td className="TableCell" scope={scope}>
      {children}
    </td>
  )
}

export {Table, TableHead, TableBody, TableHeader, TableRow, TableCell}
