import {TabNav as PrimerTabNav} from '@primer/react/deprecated'
import type {TabNavProps as PrimerTabNavProps, TabNavLinkProps as PrimerTabNavLinkProps} from '@primer/react/deprecated'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {ForwardRefComponent} from '../polymorphic'
import type {SxProp} from '../sx'

type TabNavProps = PrimerTabNavProps & SxProp
type TabNavLinkProps = PrimerTabNavLinkProps & SxProp

const TabNavImpl = forwardRef(function TabNavImpl(props, ref) {
  return <Box ref={ref} as={PrimerTabNav} {...props} />
}) as ForwardRefComponent<'div', TabNavProps>

const TabNavLink = forwardRef(function TabNavLinkImpl(props, ref) {
  return <Box ref={ref} as={PrimerTabNav.Link} {...props} />
}) as ForwardRefComponent<'a', TabNavLinkProps>

const TabNav = Object.assign(TabNavImpl, {
  Link: TabNavLink,
})

export {TabNav, type TabNavProps, type TabNavLinkProps}
