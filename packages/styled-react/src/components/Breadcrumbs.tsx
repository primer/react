import {Breadcrumbs as PrimerBreadcrumbs} from '@primer/react'
import type {
  BreadcrumbsProps as PrimerBreadcrumbsProps,
  BreadcrumbsItemProps as PrimerBreadcrumbsItemsProps,
} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'
import React from 'react'

type BreadcrumbsProps = PrimerBreadcrumbsProps & SxProp
type BreadcrumbsItemProps<As extends React.ElementType = 'a'> = PrimerBreadcrumbsItemsProps<As> & SxProp

const BreadcrumbsImpl = styled(PrimerBreadcrumbs).withConfig({
  shouldForwardProp: prop => (prop as keyof BreadcrumbsProps) !== 'sx',
})<BreadcrumbsProps>`
  ${sx}
`

const StyledBreadcrumbsItem = styled(PrimerBreadcrumbs.Item).withConfig({
  shouldForwardProp: prop => (prop as keyof BreadcrumbsItemProps) !== 'sx',
})<BreadcrumbsItemProps>`
  ${sx}
`

const BreadcrumbsItemImpl = React.forwardRef<HTMLElement, BreadcrumbsItemProps<React.ElementType>>(
  ({as, ...props}, ref) => <StyledBreadcrumbsItem ref={ref} {...props} {...(as ? {forwardedAs: as} : {})} />,
)

BreadcrumbsItemImpl.displayName = 'Breadcrumbs.Item'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BreadcrumbsItem: ForwardRefComponent<'a', BreadcrumbsItemProps<React.ElementType>> = BreadcrumbsItemImpl as any

const Breadcrumbs: ForwardRefComponent<'nav', BreadcrumbsProps> & {Item: typeof BreadcrumbsItem} = Object.assign(
  BreadcrumbsImpl,
  {Item: BreadcrumbsItem},
)

/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */
const Breadcrumb = Breadcrumbs

export {Breadcrumbs, Breadcrumb, type BreadcrumbsProps, type BreadcrumbsItemProps}
