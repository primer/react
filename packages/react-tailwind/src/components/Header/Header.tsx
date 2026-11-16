import React from 'react'
import {cn} from '../../internal/cn'

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. */
  as?: React.ElementType
}

const HeaderRoot = React.forwardRef<HTMLElement, HeaderProps>(function Header(
  {as: Component = 'header', className, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref}
      className={cn(
        'primer:z-sticky primer:flex primer:flex-nowrap primer:items-center primer:overflow-auto primer:bg-[var(--header-bgColor)] primer:p-4 primer:text-sm primer:leading-[var(--text-title-lineHeight-large)] primer:text-[color:var(--header-fgColor-default)]',
        className,
      )}
      data-component="Header"
    />
  )
})

export interface HeaderItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lets the item grow to fill the remaining space, pushing later items to the end. */
  full?: boolean
}

const HeaderItem = React.forwardRef<HTMLDivElement, HeaderItemProps>(function HeaderItem(
  {className, full, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'primer:mr-4 primer:flex primer:flex-nowrap primer:items-center primer:self-stretch',
        full && 'primer:flex-auto',
        className,
      )}
      data-component="Header.Item"
      data-full={full || undefined}
    />
  )
})

export interface HeaderLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Element to render. Use a non-anchor element when the item does not link anywhere. */
  as?: React.ElementType
}

const HeaderLink = React.forwardRef<HTMLElement, HeaderLinkProps>(function HeaderLink(
  {as: Component = 'a', className, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref}
      className={cn(
        'primer:flex primer:cursor-pointer primer:items-center primer:whitespace-nowrap primer:font-semibold primer:text-[color:var(--header-fgColor-logo)] primer:no-underline primer:hover:text-[color:var(--header-fgColor-default)] primer:focus:text-[color:var(--header-fgColor-default)]',
        className,
      )}
      data-component="Header.Link"
    />
  )
})

HeaderRoot.displayName = 'Header'
HeaderItem.displayName = 'Header.Item'
HeaderLink.displayName = 'Header.Link'
export const Header = Object.assign(HeaderRoot, {Item: HeaderItem, Link: HeaderLink})
