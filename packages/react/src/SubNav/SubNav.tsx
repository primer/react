import {clsx} from 'clsx'
import type {To} from 'history'
import React from 'react'

import styles from './SubNav.module.css'
import type {WithSlotMarker} from '../utils/types'
import {mergeProps} from '../utils/mergeProps'

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
    <nav
      ref={forwardRef}
      {...mergeProps(
        {
          className: clsx('SubNav', styles.SubNav, className),
          'aria-label': label,
        },
        rest,
      )}
      data-component="SubNav"
    >
      <div className={clsx('SubNav-body', styles.Body)}>{children}</div>
      {actions && <div className={clsx('SubNav-actions', styles.Actions)}>{actions}</div>}
    </nav>
  )
})
SubNav.displayName = 'SubNav'

// SubNav.Links

const SubNavLinks = React.forwardRef<HTMLDivElement, SubNavLinksProps>(({children, className, ...rest}, forwardRef) => {
  return (
    <div
      ref={forwardRef}
      {...mergeProps({className: clsx(styles.Links, className)}, rest)}
      data-component="SubNav.Links"
    >
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
        ref={forwardRef}
        {...mergeProps(
          {
            className: clsx(styles.Link, className),
            'data-selected': rest.selected,
            'aria-current': rest.selected,
          },
          rest,
        )}
        data-component="SubNav.Link"
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
