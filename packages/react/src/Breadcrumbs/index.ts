import {
  Breadcrumbs as BreadcrumbsImpl,
  BreadcrumbsItem,
  type BreadcrumbItemProps,
  type BreadcrumbProps,
  type BreadcrumbsItemProps,
  type BreadcrumbsProps,
} from './Breadcrumbs'

BreadcrumbsItem.displayName = 'Breadcrumbs.Item'

export const Breadcrumbs = Object.assign(BreadcrumbsImpl, {Item: BreadcrumbsItem})

export type {BreadcrumbsItemProps, BreadcrumbItemProps}

// Deprecated names

/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */
export const Breadcrumb = Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

export type {BreadcrumbsProps, BreadcrumbProps}
