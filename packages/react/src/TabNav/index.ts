import {TabNav as TabNavImpl, TabNavLink} from './TabNav'
export type {TabNavProps, TabNavLinkProps} from './TabNav'

export const TabNav = Object.assign(TabNavImpl, {Link: TabNavLink})
