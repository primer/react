import React, {type PropsWithChildren} from 'react'
import type {
  PageHeaderProps as PrimerPageHeaderProps,
  ParentLinkProps as PrimerParentLinkProps,
  TitleProps as PrimerTitleProps,
} from '@primer/react'
import {PageHeader as PrimerPageHeader, Box} from '@primer/react'
import type {SxProp} from '../sx'
import type {AriaRole} from '../types/AriaRole'

type PageHeaderProps = PropsWithChildren<
  // Needed to remove `role` and manually re-add because it's not exported from `@primer/react`.
  // This was causing a type inference error on the `Object.assign` export at the bottom.
  Omit<PrimerPageHeaderProps, 'role'> & {role?: AriaRole}
> &
  SxProp

type PageHeaderTitleProps = PropsWithChildren<PrimerTitleProps> & SxProp

// Create wrapped versions of components that need sx support
const PageHeaderTitle = React.forwardRef<HTMLElement, PageHeaderTitleProps>((props, ref) => {
  // @ts-expect-error - PrimerPageHeader.Title is not recognized as a valid component type
  return <Box as={PrimerPageHeader.Title} ref={ref} {...props} />
})

type PageHeaderParentLinkProps = PropsWithChildren<PrimerParentLinkProps> & SxProp

const PageHeaderParentLink = React.forwardRef<HTMLAnchorElement, PageHeaderParentLinkProps>((props, ref) => {
  return <Box as={PrimerPageHeader.ParentLink} ref={ref} {...props} />
})

const PageHeader = Object.assign(PrimerPageHeader as React.FC<PageHeaderProps>, {
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
