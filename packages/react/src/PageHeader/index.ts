import {
  Root,
  ContextArea,
  ParentLink,
  ContextBar,
  TitleArea,
  ContextAreaActions,
  LeadingAction,
  Breadcrumbs,
  LeadingVisual,
  Title,
  TrailingVisual,
  TrailingAction,
  Actions,
  Description,
  Navigation,
} from './PageHeader'
import type {PageHeaderProps, ParentLinkProps, TitleProps, NavigationProps} from './PageHeader'

export const PageHeader = Object.assign(Root, {
  ContextArea,
  ParentLink,
  ContextBar,
  TitleArea,
  ContextAreaActions,
  LeadingAction,
  Breadcrumbs,
  LeadingVisual,
  Title,
  TrailingVisual,
  TrailingAction,
  Actions,
  Description,
  Navigation,
})

export type {PageHeaderProps, ParentLinkProps, TitleProps, NavigationProps}
