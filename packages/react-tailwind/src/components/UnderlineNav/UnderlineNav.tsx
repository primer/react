import React from 'react'
import {cn} from '../../internal/cn'

export interface UnderlineNavProps extends React.ComponentPropsWithoutRef<'nav'> {
  variant?: 'inset' | 'flush'
}

const Root = React.forwardRef<HTMLElement, UnderlineNavProps>(function UnderlineNav(
  {className, variant = 'inset', ...props},
  ref,
) {
  return (
    <nav
      {...props}
      ref={ref}
      data-component="UnderlineNav"
      data-variant={variant}
      className={cn('overflow-x-auto border-b border-default', variant === 'inset' ? 'px-2' : '', className)}
    />
  )
})

export type UnderlineNavListProps = React.ComponentPropsWithoutRef<'ul'>
const List = React.forwardRef<HTMLUListElement, UnderlineNavListProps>(function UnderlineNavList(
  {className, ...props},
  ref,
) {
  return (
    <ul {...props} ref={ref} data-component="UnderlineNav.List" className={cn('flex min-w-max list-none', className)} />
  )
})

export interface UnderlineNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  counter?: React.ReactNode
  leadingVisual?: React.ReactNode
}
const Item = React.forwardRef<HTMLAnchorElement, UnderlineNavItemProps>(function UnderlineNavItem(
  {className, children, counter, leadingVisual, 'aria-current': ariaCurrent, ...props},
  ref,
) {
  const current = ariaCurrent && ariaCurrent !== 'false'
  return (
    <li data-component="UnderlineNav.Item">
      <a
        {...props}
        ref={ref}
        aria-current={ariaCurrent}
        data-current={current || undefined}
        className={cn(
          'relative -mb-px inline-flex min-h-12 items-center gap-2 border-b-2 border-transparent px-3 text-sm text-muted hover:text-default focus-visible:z-10 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-focus data-[current]:border-accent-emphasis data-[current]:font-semibold data-[current]:text-default',
          className,
        )}
      >
        {leadingVisual ? <span aria-hidden="true">{leadingVisual}</span> : null}
        {children}
        {counter === undefined ? null : (
          <span className="rounded-full bg-neutral-muted px-1 text-xs" aria-hidden="true">
            {counter}
          </span>
        )}
      </a>
    </li>
  )
})

export const UnderlineNav = Object.assign(Root, {List, Item})
Root.displayName = 'UnderlineNav'
List.displayName = 'UnderlineNav.List'
Item.displayName = 'UnderlineNav.Item'
