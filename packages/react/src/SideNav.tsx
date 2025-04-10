import type {To} from 'history'
import type {ComponentProps} from './utils/types'
import Link, {type LinkProps} from './Link'
import React, {type PropsWithChildren} from 'react'
import {clsx} from 'clsx'
import type {SxProp} from './sx'
import classes from './SideNav.module.css'
import {toggleSxComponent} from './internal/utils/toggleSxComponent'
import {defaultSxProp} from './utils/defaultSxProp'

type SideNavBaseProps = {
  as?: React.ElementType
  variant?: 'lightweight' | 'normal'
  bordered?: boolean
  className?: string
  children?: React.ReactNode
  'aria-label'?: string
} & SxProp

function SideNav({
  as = 'nav',
  variant = 'normal',
  className,
  bordered,
  children,
  'aria-label': ariaLabel,
  sx: sxProp = defaultSxProp,
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

  const BaseComponent = toggleSxComponent(as) as React.ComponentType<SideNavBaseProps>

  return (
    <BaseComponent className={newClassName} aria-label={ariaLabel} sx={sxProp}>
      {children}
    </BaseComponent>
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
  const BaseComponent = toggleSxComponent(Link) as React.ComponentType<StyledSideNavLinkProps>
  // according to their docs, NavLink supports aria-current:
  // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
  return (
    <BaseComponent
      aria-current={isReactRouter || selected ? 'page' : undefined}
      className={newClassName}
      variant={variant}
      {...rest}
    >
      {children}
    </BaseComponent>
  )
}

SideNavLink.displayName = 'SideNav.Link'

export type SideNavProps = ComponentProps<typeof SideNav>
export type SideNavLinkProps = ComponentProps<typeof SideNavLink>

/** @deprecated Use [NavList](https://primer.style/react/NavList) instead */
export default Object.assign(SideNav, {Link: SideNavLink})
