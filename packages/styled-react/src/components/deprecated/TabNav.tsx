import {TabNav as PrimerTabNav} from '@primer/react/deprecated'
import type {TabNavProps as PrimerTabNavProps, TabNavLinkProps as PrimerTabNavLinkProps} from '@primer/react/deprecated'
import {sx, type SxProp} from '../../sx'
import styled from 'styled-components'
import {forwardRef} from 'react'

type TabNavProps = PrimerTabNavProps & SxProp
type TabNavLinkProps = PrimerTabNavLinkProps & SxProp

const StyledTabNav = styled(PrimerTabNav).withConfig({
  shouldForwardProp: prop => (prop as keyof TabNavProps) !== 'sx',
})<TabNavProps>`
  ${sx}
`

const TabNavImpl = ({as, ...props}: TabNavProps) => {
  return <StyledTabNav {...props} {...(as ? {forwardedAs: as as React.ElementType} : {})} />
}

const StyledTabNavLink = styled(PrimerTabNav.Link).withConfig({
  shouldForwardProp: prop => (prop as keyof TabNavLinkProps) !== 'sx',
})<TabNavLinkProps>`
  ${sx}
`

const TabNavLink = forwardRef<HTMLAnchorElement, TabNavLinkProps>(({as, ...props}, ref) => (
  <StyledTabNavLink {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
))

const TabNav = Object.assign(TabNavImpl, {
  Link: TabNavLink,
})

// @ts-ignore -- TS doesn't know about the __SLOT__ property
TabNavImpl.__SLOT__ = PrimerTabNav.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
TabNavLink.__SLOT__ = PrimerTabNav.Link.__SLOT__

export {TabNav, type TabNavProps, type TabNavLinkProps}
