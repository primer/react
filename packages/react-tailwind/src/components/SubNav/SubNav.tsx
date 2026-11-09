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
        'primer:flex primer:items-start primer:justify-between primer:gap-2',
        full && 'primer:w-full',
        align === 'right' && 'primer:justify-end',
        className,
      )}
      data-component="SubNav"
    >
      <div className="primer:flex primer:h-[33px] primer:min-w-0 primer:flex-wrap primer:gap-2">{children}</div>
      {actions ? <div className="primer:shrink-0 primer:self-center">{actions}</div> : null}
    </nav>
  )
})

export type SubNavLinksProps = React.ComponentPropsWithoutRef<'div'>
const SubNavLinks = React.forwardRef<HTMLDivElement, SubNavLinksProps>(function SubNavLinks({className, ...rest}, ref) {
  return <div {...rest} ref={ref} className={cn('primer:flex', className)} data-component="SubNav.Links" />
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
        'primer:flex primer:min-h-[34px] primer:items-center primer:border-y primer:border-r primer:border-default primer:px-4 primer:text-center primer:text-sm primer:leading-5 primer:font-medium primer:text-default primer:no-underline primer:first:rounded-l-md primer:first:border-l primer:last:rounded-r-md primer:hover:bg-muted primer:focus:bg-muted primer:focus-visible:outline-2 primer:focus-visible:outline-focus',
        selected &&
          'primer:border-[var(--bgColor-accent-emphasis)] primer:bg-accent-emphasis primer:text-on-emphasis primer:hover:bg-accent-emphasis primer:focus:bg-accent-emphasis',
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
