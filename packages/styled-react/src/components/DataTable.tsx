import {Table as PrimerDataTable, type TableContainerProps} from '@primer/react/experimental'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import type React from 'react'

const {Container: PrimerDataTableContainer, ...rest} = PrimerDataTable

type DataTableContainerProps<As extends React.ElementType = 'div'> = TableContainerProps<As> & SxProp

const StyleDataTableContainer: React.ComponentType<DataTableContainerProps> = styled(
  PrimerDataTableContainer,
).withConfig({
  shouldForwardProp: prop => (prop as keyof DataTableContainerProps) !== 'sx',
})<DataTableContainerProps>`
  ${sx}
` as typeof PrimerDataTable.Container & {
  <As extends React.ElementType = 'div'>(props: DataTableContainerProps<As>): React.ReactElement<any> | null
}

function DataTableContainer<As extends React.ElementType = 'div'>({as, ...rest}: DataTableContainerProps<As>) {
  return <StyleDataTableContainer {...rest} {...(as ? {forwardedAs: as} : {})} />
}

const Table: typeof PrimerDataTable & {
  Container: typeof DataTableContainer
} = Object.assign(PrimerDataTable, {
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
