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
  return <Box as={PrimerUnderlineNav} ref={ref} {...props} />
})

export const UnderlineNavImpl = ({as, ...props}: UnderlineNavProps) => (
  // @ts-ignore forwardedAs is valid here but I don't know how to fix the typescript error
  <StyledUnderlineNav forwardedAs={as} {...props} />
)

export type UnderlineNavItemProps = PrimerUnderlineNavItemProps & SxProp

const StyledUnderlineNavItem: ForwardRefComponent<'a', UnderlineNavItemProps> = styled(
  PrimerUnderlineNav.Item,
).withConfig<UnderlineNavItemProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`
export const UnderlineNavItem = ({as, ...props}: UnderlineNavItemProps) => (
  // @ts-ignore forwardedAs is valid here but I don't know how to fix the typescript error
  <StyledUnderlineNavItem forwardedAs={as} {...props} />
)

export const UnderlineNav = Object.assign(UnderlineNavImpl, {
  Item: UnderlineNavItem,
})
