import {TabNav as PrimerTabNav} from '@primer/react/deprecated'
import type {TabNavProps as PrimerTabNavProps, TabNavLinkProps as PrimerTabNavLinkProps} from '@primer/react/deprecated'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'

type TabNavProps = PrimerTabNavProps & SxProp
type TabNavLinkProps = PrimerTabNavLinkProps & SxProp

const TabNavImpl = styled(PrimerTabNav).withConfig({
  shouldForwardProp: prop => (prop as keyof TabNavProps) !== 'sx',
})<TabNavProps>`
  ${sx}
`

const TabNavLink: ForwardRefComponent<'a', TabNavLinkProps> = styled(PrimerTabNav.Link).withConfig({
  shouldForwardProp: prop => (prop as keyof TabNavLinkProps) !== 'sx',
})<TabNavLinkProps>`
  ${sx}
`

const TabNav = Object.assign(TabNavImpl, {
  Link: TabNavLink,
})

export {TabNav, type TabNavProps, type TabNavLinkProps}
