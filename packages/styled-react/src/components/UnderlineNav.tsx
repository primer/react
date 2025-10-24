import {
  UnderlineNav as PrimerUnderlineNav,
  type UnderlineNavProps as PrimerUnderlineNavProps,
  type UnderlineNavItemProps as PrimerUnderlineNavItemProps,
} from '@primer/react'
import {Box} from './Box'
import type {ForwardRefComponent} from '../polymorphic'
import {forwardRef} from 'react'
import styled from 'styled-components'
import {sx, type SxProp} from '../sx'

export type UnderlineNavProps = PrimerUnderlineNavProps & SxProp

const StyledUnderlineNav = forwardRef<HTMLElement, UnderlineNavProps>(function UnderlineNav(props, ref) {
  return <Box {...props} as={PrimerUnderlineNav} ref={ref} />
})

export const UnderlineNavImpl = forwardRef(({as, ...props}: UnderlineNavProps, ref) => (
  <StyledUnderlineNav {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
)) as ForwardRefComponent<'nav', UnderlineNavProps>

export type UnderlineNavItemProps = PrimerUnderlineNavItemProps & SxProp & React.HTMLAttributes<HTMLElement>

const StyledUnderlineNavItem: ForwardRefComponent<'a', UnderlineNavItemProps> = styled(
  PrimerUnderlineNav.Item,
).withConfig<UnderlineNavItemProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`
export const UnderlineNavItem = forwardRef(({as, ...props}: UnderlineNavItemProps, ref) => (
  <StyledUnderlineNavItem {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
)) as ForwardRefComponent<'a', UnderlineNavItemProps>

export const UnderlineNav = Object.assign(UnderlineNavImpl, {
  Item: UnderlineNavItem,
})
