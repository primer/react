import {Breadcrumbs as PrimerBreadcrumbs} from '@primer/react'
import type {
  BreadcrumbsProps as PrimerBreadcrumbsProps,
  BreadcrumbsItemProps as PrimerBreadcrumbsItemsProps,
} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'

type BreadcrumbsProps = PrimerBreadcrumbsProps & SxProp
type BreadcrumbsItemProps = PrimerBreadcrumbsItemsProps & SxProp

const StyledBreadcrumbs = styled(PrimerBreadcrumbs).withConfig({
  shouldForwardProp: prop => (prop as keyof BreadcrumbsProps) !== 'sx',
})<BreadcrumbsProps>`
  ${sx}
`

// @ts-ignore forwardedAs is valid here but I don't know how to fix the typescript error
const BreadcrumbsImpl = ({as, ...props}: BreadcrumbsProps) => <StyledBreadcrumbs forwardedAs={as} {...props} />

const StyledBreadcrumbsItem: ForwardRefComponent<'a', BreadcrumbsItemProps> = styled(PrimerBreadcrumbs.Item).withConfig(
  {
    shouldForwardProp: prop => (prop as keyof BreadcrumbsItemProps) !== 'sx',
  },
)<BreadcrumbsItemProps>`
  ${sx}
`

// @ts-ignore forwardedAs is valid here but I don't know how to fix the typescript error
const BreadcrumbsItem = ({as, ...props}: BreadcrumbsItemProps) => <StyledBreadcrumbsItem forwardedAs={as} {...props} />

const Breadcrumbs = Object.assign(BreadcrumbsImpl, {Item: BreadcrumbsItem})

/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */
const Breadcrumb = Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

export {Breadcrumbs, Breadcrumb, type BreadcrumbsProps, type BreadcrumbsItemProps}
