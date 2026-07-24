import React from 'react'
import {cn} from '../../internal/cn'

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
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
      className={cn('z-32 flex flex-nowrap items-center overflow-auto bg-inset p-4 text-default', className)}
      data-component="Header"
    />
  )
})

export interface HeaderItemProps extends React.HTMLAttributes<HTMLDivElement> {
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
      className={cn('mr-4 flex flex-nowrap items-center self-stretch', full && 'flex-auto', className)}
      data-component="Header.Item"
      data-full={full || undefined}
    />
  )
})

export interface HeaderLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
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
        'flex items-center whitespace-nowrap font-semibold text-accent no-underline hover:text-default',
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
