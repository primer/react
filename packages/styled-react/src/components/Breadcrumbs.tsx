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

const BreadcrumbsItem = ({as, ...props}: BreadcrumbsItemProps) => (
  <StyledBreadcrumbsItem {...props} {...(as ? {forwardedAs: as} : {})} />
)

const Breadcrumbs: ForwardRefComponent<'nav', BreadcrumbsProps> & {Item: typeof BreadcrumbsItem} = Object.assign(
  BreadcrumbsImpl,
  {Item: BreadcrumbsItem},
)

/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */
const Breadcrumb = Breadcrumbs

export {Breadcrumbs, Breadcrumb, type BreadcrumbsProps, type BreadcrumbsItemProps}
