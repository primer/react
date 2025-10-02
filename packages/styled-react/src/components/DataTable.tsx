import {Table as PrimerDataTable} from '@primer/react/experimental'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import type React from 'react'
import type {ComponentProps} from 'react'

const {Container: PrimerDataTableContainer, ...rest} = PrimerDataTable

type DataTableContainerProps = ComponentProps<typeof PrimerDataTable.Container> & SxProp

const DataTableContainer: React.ComponentType<DataTableContainerProps> = styled(PrimerDataTableContainer).withConfig({
  shouldForwardProp: prop => (prop as keyof DataTableContainerProps) !== 'sx',
})<DataTableContainerProps>`
  ${sx}
`

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
