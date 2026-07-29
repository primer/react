import React from 'react'
import {cn} from '../../internal/cn'

export interface SubNavProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** Controls shown at the end of the bar, beside the links. */
  actions?: React.ReactNode
  /** Aligns the links to the end of the bar. */
  align?: 'right'
  /** Stretches the bar to fill the width of its container. */
  full?: boolean
  /** Accessible name for the navigation region. */
  label?: string
}

const SubNavRoot = React.forwardRef<HTMLElement, SubNavProps>(function SubNav(
  {actions, align, children, className, full, label, 'aria-label': ariaLabel, ...rest},
  ref,
) {
  return (
    <nav
      {...rest}
      ref={ref}
      aria-label={ariaLabel ?? label}
      className={cn(
        'flex items-start justify-between gap-2',
        full && 'w-full',
        align === 'right' && 'justify-end',
        className,
      )}
      data-component="SubNav"
    >
      <div className="flex h-[33px] min-w-0 flex-wrap gap-2">{children}</div>
      {actions ? <div className="shrink-0 self-center">{actions}</div> : null}
    </nav>
  )
})

export type SubNavLinksProps = React.ComponentPropsWithoutRef<'div'>
const SubNavLinks = React.forwardRef<HTMLDivElement, SubNavLinksProps>(function SubNavLinks({className, ...rest}, ref) {
  return <div {...rest} ref={ref} className={cn('flex', className)} data-component="SubNav.Links" />
})

export interface SubNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Element to render. Use a non-anchor element when the link is handled by a router. */
  as?: React.ElementType
  /** Marks the link as the current page. */
  selected?: boolean
}
const SubNavLink = React.forwardRef<HTMLElement, SubNavLinkProps>(function SubNavLink(
  {as: Component = 'a', className, selected, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref}
      aria-current={selected ? 'page' : undefined}
      className={cn(
        'flex min-h-[34px] items-center border-y border-r border-default px-4 text-center text-sm leading-5 font-medium text-default no-underline first:rounded-l-md first:border-l last:rounded-r-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-focus',
        selected && 'border-accent-emphasis bg-accent-emphasis text-on-emphasis hover:bg-accent-emphasis',
        className,
      )}
      data-component="SubNav.Link"
      data-selected={selected || undefined}
    />
  )
})

SubNavRoot.displayName = 'SubNav'
SubNavLinks.displayName = 'SubNav.Links'
SubNavLink.displayName = 'SubNav.Link'
export const SubNav = Object.assign(SubNavRoot, {Link: SubNavLink, Links: SubNavLinks})
