import {clsx} from 'clsx'
import type {To} from 'history'
import React from 'react'

import styles from './SubNav.module.css'
import type {WithSlotMarker} from '../utils/types'

export type SubNavProps = React.ComponentProps<'nav'> & {
  actions?: React.ReactNode
  align?: 'right'
  full?: boolean
  label?: string
}
export type SubNavLinksProps = React.ComponentProps<'div'>
export type SubNavLinkProps = React.ComponentProps<'a'> & {to?: To; selected?: boolean}

const SubNav = React.forwardRef<HTMLElement, SubNavProps>(function SubNav(
  {actions, className, children, label, ...rest},
  forwardRef,
) {
  return (
    <nav {...rest} ref={forwardRef} className={clsx(className, 'SubNav', styles.SubNav)} aria-label={label}>
      <div className={clsx('SubNav-body', styles.Body)}>{children}</div>
      {actions && <div className={clsx('SubNav-actions', styles.Actions)}>{actions}</div>}
    </nav>
  )
})
SubNav.displayName = 'SubNav'

// SubNav.Links

const SubNavLinks = React.forwardRef<HTMLDivElement, SubNavLinksProps>(({children, className, ...rest}, forwardRef) => {
  return (
    <div {...rest} ref={forwardRef} className={clsx(className, styles.Links)}>
      {children}
    </div>
  )
})
SubNavLinks.displayName = 'SubNav.Links'

// SubNav.Link

const SubNavLink = React.forwardRef<HTMLAnchorElement, SubNavLinkProps>(
  ({children, className, ...rest}, forwardRef) => {
    return (
      <a
        {...rest}
        ref={forwardRef}
        className={clsx(className, styles.Link)}
        data-selected={rest.selected}
        aria-current={rest.selected}
      >
        {children}
      </a>
    )
  },
)

SubNavLink.displayName = 'SubNav.Link'

export default Object.assign(SubNav, {
  Link: SubNavLink as WithSlotMarker<typeof SubNavLink>,
  Links: SubNavLinks,
  __SLOT__: Symbol('SubNav'),
})
;(SubNavLink as WithSlotMarker<typeof SubNavLink>).__SLOT__ = Symbol('SubNav.Link')
