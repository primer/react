import type {To} from 'history'
import type {ComponentProps} from './utils/types'
import Link, {type LinkProps} from './Link'
import type React from 'react'
import {type PropsWithChildren} from 'react'
import {clsx} from 'clsx'
import classes from './SideNav.module.css'

type SideNavBaseProps = {
  as?: React.ElementType
  variant?: 'lightweight' | 'normal'
  bordered?: boolean
  className?: string
  children?: React.ReactNode
  'aria-label'?: string
}

function SideNav({
  as: Component = 'nav',
  variant = 'normal',
  className,
  bordered,
  children,
  'aria-label': ariaLabel,
}: SideNavBaseProps) {
  const variantClassName = variant === 'lightweight' ? 'lightweight' : 'normal'
  const newClassName = clsx(
    classes.SideNav,
    classes[`SideNavVariant--${variantClassName}`],
    'sidenav',
    `variant-${variantClassName}`,
    className,
    {
      [classes.SideNavBordered]: bordered,
    },
  )

  return (
    <Component className={newClassName} aria-label={ariaLabel}>
      {children}
    </Component>
  )
}

type StyledSideNavLinkProps = PropsWithChildren<{
  to?: To
  selected?: boolean
  variant?: 'full' | 'normal'
}> &
  LinkProps

const SideNavLink = ({selected, to, variant, className, children, ...rest}: StyledSideNavLinkProps) => {
  const isReactRouter = typeof to === 'string'
  const newClassName = clsx(classes.SideNavLink, className, {[classes.SideNavLinkFull]: variant === 'full'})
  // according to their docs, NavLink supports aria-current:
  // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
  return (
    <Link {...rest} aria-current={isReactRouter || selected ? 'page' : undefined} className={newClassName}>
      {children}
    </Link>
  )
}

SideNavLink.displayName = 'SideNav.Link'

export type SideNavProps = ComponentProps<typeof SideNav>
export type SideNavLinkProps = ComponentProps<typeof SideNavLink>

/** @deprecated Use [NavList](https://primer.style/react/NavList) instead */
export default Object.assign(SideNav, {Link: SideNavLink})
