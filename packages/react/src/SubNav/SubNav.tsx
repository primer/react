import {clsx} from 'clsx'
import type {To} from 'history'
import React from 'react'
import type {ComponentProps} from '../utils/types'

import styles from './SubNav.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'
import type {SxProp} from '../sx'
import Box from '../Box'

type StyledSubNavProps = React.ComponentProps<'nav'> & {
  actions?: React.ReactNode
  align?: 'right'
  full?: boolean
  label?: string
} & SxProp
type StyledSubNavLinksProps = React.ComponentProps<'div'> & SxProp
type StyledSubNavLinkProps = React.ComponentProps<'a'> & {to?: To; selected?: boolean} & SxProp

const SubNav = React.forwardRef<HTMLElement, StyledSubNavProps>(function SubNav(
  {actions, className, children, label, sx: sxProp = defaultSxProp, ...rest},
  forwardRef,
) {
  if (sxProp !== defaultSxProp) {
    return (
      <Box
        as="nav"
        ref={forwardRef}
        sx={sxProp}
        className={clsx(className, 'SubNav', styles.SubNav)}
        aria-label={label}
        {...rest}
      >
        <div className={clsx('SubNav-body', styles.Body)}>{children}</div>
        {actions && <div className={clsx('SubNav-actions', styles.Actions)}>{actions}</div>}
      </Box>
    )
  }
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
  ({children, className, sx: sxProp = defaultSxProp, ...rest}, forwardRef) => {
    if (sxProp !== defaultSxProp) {
      return (
        <Box as="div" ref={forwardRef} sx={sxProp} className={clsx(className, styles.Links)} {...rest}>
          {children}
        </Box>
      )
    }
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
  ({children, className, sx: sxProp = defaultSxProp, ...rest}, forwardRef) => {
    if (sxProp !== defaultSxProp) {
      return (
        <Box
          as="a"
          ref={forwardRef}
          sx={sxProp}
          className={clsx(className, styles.Link)}
          data-selected={rest.selected}
          aria-current={rest.selected}
          {...rest}
        >
          {children}
        </Box>
      )
    }

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
