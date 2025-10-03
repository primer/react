import {clsx} from 'clsx'
import type {To} from 'history'
import React from 'react'
import type {ComponentProps} from '../../utils/types'
import classes from './UnderlineNav.module.css'

export type UnderlineNavProps = {
  actions?: React.ReactNode
  align?: 'right'
  full?: boolean
  label?: string
} & React.ComponentProps<'nav'>

function UnderlineNav({actions, className, align, children, full, label, ...rest}: UnderlineNavProps) {
  const navClasses = clsx(
    className,
    classes.UnderlineNav,
    'PRC-UnderlineNav',
    align && classes['UnderlineNav--right'],
    full && classes['UnderlineNav--full'],
  )
  return (
    <nav className={navClasses} aria-label={label} {...rest}>
      <div className={classes.UnderlineNavBody}>{children}</div>
      {actions && <div className={classes.UnderlineNavActions}>{actions}</div>}
    </nav>
  )
}

type StyledUnderlineNavLinkProps = {
  to?: To
  selected?: boolean
}

type UnderlineNavLinkProps = React.ComponentProps<'a'> & StyledUnderlineNavLinkProps

const UnderlineNavLink = React.forwardRef<HTMLAnchorElement, UnderlineNavLinkProps>(function UnderlineNavLink(
  {className, selected, ...props},
  forwardRef,
) {
  const linkClasses = clsx(className, classes.UnderlineNavLink)
  return <a ref={forwardRef} data-selected={selected ? '' : undefined} className={linkClasses} {...props} />
})

UnderlineNavLink.displayName = 'UnderlineNav.Link'

export type {UnderlineNavLinkProps}
/**
 * @deprecated UnderlineNav is deprecated and will be replaced by the draft `UnderlineNav` in the next major release. See https://primer.style/react/drafts/UnderlineNav2 for more details.
 */
export default Object.assign(UnderlineNav, {Link: UnderlineNavLink})
