import React, {type PropsWithChildren} from 'react'
import type {
  PageHeaderProps as PrimerPageHeaderProps,
  ParentLinkProps as PrimerParentLinkProps,
  TitleProps as PrimerTitleProps,
} from '@primer/react'
import styled from 'styled-components'
import {PageHeader as PrimerPageHeader, Box} from '@primer/react'
import {sx, type SxProp} from '../sx'
import type {AriaRole} from '../types/AriaRole'

type PageHeaderProps = PropsWithChildren<
  // Needed to remove `role` and manually re-add because it's not exported from `@primer/react`.
  // This was causing a type inference error on the `Object.assign` export at the bottom.
  Omit<PrimerPageHeaderProps, 'role'> & {role?: AriaRole}
> &
  SxProp

type PageHeaderTitleProps = PropsWithChildren<PrimerTitleProps> & SxProp

// Using Box crashes Vite for some reason?
const PageHeaderTitle = styled(PrimerPageHeader.Title)<PageHeaderTitleProps>`
  ${sx}
`

type PageHeaderParentLinkProps = PropsWithChildren<PrimerParentLinkProps> & SxProp

const PageHeaderParentLink = React.forwardRef<HTMLAnchorElement, PageHeaderParentLinkProps>((props, ref) => {
  return <Box as={PrimerPageHeader.ParentLink} ref={ref} {...props} />
})

// weird typecast to get around mysterious TS error
const PageHeader = Object.assign(PrimerPageHeader as unknown as React.FC<PageHeaderProps>, {
  // Wrapped components that need sx support added back in
  Title: PageHeaderTitle,
  ParentLink: PageHeaderParentLink,

  // Re-exporting others directly
  ContextArea: PrimerPageHeader.ContextArea,
  ContextBar: PrimerPageHeader.ContextBar,
  TitleArea: PrimerPageHeader.TitleArea,
  ContextAreaActions: PrimerPageHeader.ContextAreaActions,
  LeadingAction: PrimerPageHeader.LeadingAction,
  Breadcrumbs: PrimerPageHeader.Breadcrumbs,
  LeadingVisual: PrimerPageHeader.LeadingVisual,
  TrailingVisual: PrimerPageHeader.TrailingVisual,
  TrailingAction: PrimerPageHeader.TrailingAction,
  Actions: PrimerPageHeader.Actions,
  Description: PrimerPageHeader.Description,
  Navigation: PrimerPageHeader.Navigation,
})

export {PageHeader}
export type {PageHeaderProps}
