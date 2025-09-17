import {
  PageHeader as PrimerPageHeader,
  type PageHeaderProps as PrimerPageHeaderProps,
  type PageHeaderTitleProps as PrimerPageHeaderTitleProps,
  type PageHeaderActionsProps as PrimerPageHeaderActionsProps,
} from '@primer/react'
import styled from 'styled-components'
import {sx, type SxProp} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'
import {Box} from './Box'

type PageHeaderProps = PrimerPageHeaderProps & SxProp

const PageHeaderImpl: ForwardRefComponent<'div', PageHeaderProps> = styled(
  PrimerPageHeader,
).withConfig<PageHeaderProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

type PageHeaderActionsProps = PrimerPageHeaderActionsProps & SxProp

function PageHeaderActions(props: PageHeaderActionsProps) {
  return <Box as={PrimerPageHeader.Actions} {...props} />
}

type PageHeaderTitleProps = PrimerPageHeaderTitleProps & SxProp

function PageHeaderTitle(props: PageHeaderTitleProps) {
  // @ts-expect-error type mismatch between Box usage here and PrimerPageHeader.Title
  return <Box as={PrimerPageHeader.Title} {...props} />
}

const PageHeader = Object.assign(PageHeaderImpl, {
  Actions: PageHeaderActions,
  Title: PageHeaderTitle,
})

export {PageHeader}
export type {PageHeaderProps, PageHeaderActionsProps, PageHeaderTitleProps}
