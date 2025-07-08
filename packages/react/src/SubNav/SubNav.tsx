import {clsx} from 'clsx'
import type {To} from 'history'
import React from 'react'
import type {ComponentProps} from '../utils/types'

import styles from './SubNav.module.css'
import type {SxProp} from '../sx'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

type StyledSubNavProps = React.ComponentProps<'nav'> & {
  actions?: React.ReactNode
  align?: 'right'
  full?: boolean
  label?: string
} & SxProp
type StyledSubNavLinksProps = React.ComponentProps<'div'> & SxProp
type StyledSubNavLinkProps = React.ComponentProps<'a'> & {to?: To; selected?: boolean} & SxProp

const SubNav = React.forwardRef<HTMLElement, StyledSubNavProps>(function SubNav(
  {actions, className, children, label, ...rest},
  forwardRef,
) {
  return (
    <BoxWithFallback
      as="nav"
      ref={forwardRef}
      className={clsx(className, 'SubNav', styles.SubNav)}
      aria-label={label}
      {...rest}
    >
      <div className={clsx('SubNav-body', styles.Body)}>{children}</div>
      {actions && <div className={clsx('SubNav-actions', styles.Actions)}>{actions}</div>}
    </BoxWithFallback>
  )
})
SubNav.displayName = 'SubNav'

// SubNav.Links

const SubNavLinks = React.forwardRef<HTMLDivElement, StyledSubNavLinksProps>(
  ({children, className, ...rest}, forwardRef) => {
    return (
      <BoxWithFallback ref={forwardRef} className={clsx(className, styles.Links)} {...rest}>
        {children}
      </BoxWithFallback>
    )
  },
)
SubNavLinks.displayName = 'SubNav.Links'

// SubNav.Link

const SubNavLink = React.forwardRef<HTMLAnchorElement, StyledSubNavLinkProps>(
  ({children, className, ...rest}, forwardRef) => {
    return (
      <BoxWithFallback
        as="a"
        ref={forwardRef}
        className={clsx(className, styles.Link)}
        data-selected={rest.selected}
        aria-current={rest.selected}
        {...rest}
      >
        {children}
      </BoxWithFallback>
    )
  },
)

SubNavLink.displayName = 'SubNav.Link'

export type SubNavProps = ComponentProps<typeof SubNav>
export type SubNavLinksProps = ComponentProps<typeof SubNavLinks>
export type SubNavLinkProps = ComponentProps<typeof SubNavLink>
export default Object.assign(SubNav, {Link: SubNavLink, Links: SubNavLinks})
