import {Table as PrimerDataTable, type TableContainerProps, type TableProps} from '@primer/react/experimental'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import React from 'react'

const {Container: PrimerDataTableContainer, ...rest} = PrimerDataTable

type DataTableContainerProps<As extends React.ElementType = 'div'> = TableContainerProps<As> & SxProp

const StyleDataTableContainer: React.ComponentType<DataTableContainerProps> = styled(
  PrimerDataTableContainer,
).withConfig({
  shouldForwardProp: prop => (prop as keyof DataTableContainerProps) !== 'sx',
})<DataTableContainerProps>`
  ${sx}
` as typeof PrimerDataTable.Container & {
  <As extends React.ElementType = 'div'>(props: DataTableContainerProps<As>): React.ReactElement | null
}

function DataTableContainer<As extends React.ElementType = 'div'>({as, ...rest}: DataTableContainerProps<As>) {
  return <StyleDataTableContainer {...rest} {...(as ? {forwardedAs: as} : {})} />
}

// Create a wrapper component to avoid mutating the original PrimerDataTable
const TableRoot = React.forwardRef<HTMLTableElement, TableProps>(function TableRoot(props, ref) {
  return <PrimerDataTable {...props} ref={ref} />
})
;(TableRoot as typeof TableRoot & {__SLOT__?: symbol}).__SLOT__ = (
  PrimerDataTable as typeof PrimerDataTable & {__SLOT__?: symbol}
).__SLOT__

const Table: typeof PrimerDataTable & {
  Container: typeof DataTableContainer
} = Object.assign(TableRoot, {
  Container: DataTableContainer,
  ...rest,
})

export type {
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderProps,
  TableCellProps,
  TableTitleProps,
  TableSubtitleProps,
  TableActionsProps,
} from '@primer/react/experimental'

export {Table, type DataTableContainerProps}
