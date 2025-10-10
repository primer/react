import {Breadcrumbs as PrimerBreadcrumbs} from '@primer/react'
import type {
  BreadcrumbsProps as PrimerBreadcrumbsProps,
  BreadcrumbsItemProps as PrimerBreadcrumbsItemsProps,
} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'
import type React from 'react'

type BreadcrumbsProps = PrimerBreadcrumbsProps & SxProp
type BreadcrumbsItemProps<As extends React.ElementType = 'a'> = PrimerBreadcrumbsItemsProps<As> & SxProp

const BreadcrumbsImpl = styled(PrimerBreadcrumbs).withConfig({
  shouldForwardProp: prop => (prop as keyof BreadcrumbsProps) !== 'sx',
})<BreadcrumbsProps>`
  ${sx}
`

const StyledBreadcrumbsItem: ForwardRefComponent<'a', BreadcrumbsItemProps> = styled(PrimerBreadcrumbs.Item).withConfig(
  {
    shouldForwardProp: prop => (prop as keyof BreadcrumbsItemProps) !== 'sx',
  },
)<BreadcrumbsItemProps>`
  ${sx}
`

function BreadcrumbsItem<As extends React.ElementType = 'a'>({as, ...props}: BreadcrumbsItemProps<As>) {
  return <StyledBreadcrumbsItem {...props} {...(as ? {forwardedAs: as} : {})} />
}

const Breadcrumbs: ForwardRefComponent<'nav', BreadcrumbsProps> & {Item: typeof BreadcrumbsItem} = Object.assign(
  BreadcrumbsImpl,
  {Item: BreadcrumbsItem},
)

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Breadcrumbs.__SLOT__ = PrimerBreadcrumbs.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
BreadcrumbsItem.__SLOT__ = PrimerBreadcrumbs.Item.__SLOT__

/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */
const Breadcrumb = Breadcrumbs

export {Breadcrumbs, Breadcrumb, type BreadcrumbsProps, type BreadcrumbsItemProps}
