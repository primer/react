import {clsx} from 'clsx'
import type {To} from 'history'
import React from 'react'
import type {ComponentProps} from '../utils/types'

import styles from './SubNav.module.css'

type StyledSubNavProps = React.ComponentProps<'nav'> & {
  actions?: React.ReactNode
  align?: 'right'
  full?: boolean
  label?: string
}
type StyledSubNavLinksProps = React.ComponentProps<'div'>
type StyledSubNavLinkProps = React.ComponentProps<'a'> & {to?: To; selected?: boolean}

const SubNav = React.forwardRef<HTMLElement, StyledSubNavProps>(function SubNav(
  {actions, className, children, label, ...rest},
  forwardRef,
) {
  return (
    <nav ref={forwardRef} className={clsx(className, 'SubNav', styles.SubNav)} aria-label={label} {...rest}>
      <div className={clsx('SubNav-body', styles.Body)}>{children}</div>
      {actions && <div className={clsx('SubNav-actions', styles.Actions)}>{actions}</div>}
    </nav>
  )
})
SubNav.displayName = 'SubNav'

// SubNav.Links

const SubNavLinks = React.forwardRef<HTMLDivElement, StyledSubNavLinksProps>(
  ({children, className, ...rest}, forwardRef) => {
    return (
      <div ref={forwardRef} className={clsx(className, styles.Links)} {...rest}>
        {children}
      </div>
    )
  },
)
SubNavLinks.displayName = 'SubNav.Links'

// SubNav.Link

const SubNavLink = React.forwardRef<HTMLAnchorElement, StyledSubNavLinkProps>(
  ({children, className, ...rest}, forwardRef) => {
    return (
      <a
        ref={forwardRef}
        className={clsx(className, styles.Link)}
        data-selected={rest.selected}
        aria-current={rest.selected}
        {...rest}
      >
        {children}
      </a>
    )
  },
)

SubNavLink.displayName = 'SubNav.Link'

export type SubNavProps = ComponentProps<typeof SubNav>
export type SubNavLinksProps = ComponentProps<typeof SubNavLinks>
export type SubNavLinkProps = ComponentProps<typeof SubNavLink>
export default Object.assign(SubNav, {Link: SubNavLink, Links: SubNavLinks})
