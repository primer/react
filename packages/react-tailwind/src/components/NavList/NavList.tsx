import {Collapsible} from '@base-ui/react/collapsible'
import React from 'react'
import {cn} from '../../internal/cn'
import {Heading} from '../Heading'

export type NavListProps = React.ComponentPropsWithoutRef<'nav'>
const Root = React.forwardRef<HTMLElement, NavListProps>(function NavList({className, ...props}, ref) {
  return <nav {...props} ref={ref} data-component="NavList" className={cn('text-sm', className)} />
})

export interface NavListHeadingProps extends React.ComponentPropsWithoutRef<typeof Heading> {
  visuallyHidden?: boolean
}
const NavListHeading = React.forwardRef<HTMLHeadingElement, NavListHeadingProps>(function NavListHeading(
  {className, visuallyHidden, size = 'small', ...props},
  ref,
) {
  return (
    <Heading
      {...props}
      ref={ref}
      size={size}
      data-component="NavList.Heading"
      className={cn(visuallyHidden && 'sr-only', className)}
    />
  )
})

export type NavListGroupProps = React.ComponentPropsWithoutRef<'section'>
const Group = React.forwardRef<HTMLElement, NavListGroupProps>(function NavListGroup({className, ...props}, ref) {
  return <section {...props} ref={ref} data-component="NavList.Group" className={cn('py-2', className)} />
})

export type NavListGroupHeadingProps = React.ComponentPropsWithoutRef<'h3'>
const GroupHeading = React.forwardRef<HTMLHeadingElement, NavListGroupHeadingProps>(function NavListGroupHeading(
  {children, className, ...props},
  ref,
) {
  return (
    <h3
      {...props}
      ref={ref}
      data-component="NavList.GroupHeading"
      className={cn('px-2 py-1 text-xs font-semibold text-muted', className)}
    >
      {children}
    </h3>
  )
})

export type NavListListProps = React.ComponentPropsWithoutRef<'ul'>
const List = React.forwardRef<HTMLUListElement, NavListListProps>(function NavListList({className, ...props}, ref) {
  return <ul {...props} ref={ref} data-component="NavList.List" className={cn('m-0 list-none p-0', className)} />
})

export interface NavListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  leadingVisual?: React.ReactNode
  trailingVisual?: React.ReactNode
}
const Item = React.forwardRef<HTMLAnchorElement, NavListItemProps>(function NavListItem(
  {className, children, leadingVisual, trailingVisual, 'aria-current': ariaCurrent, ...props},
  ref,
) {
  return (
    <li>
      <a
        {...props}
        ref={ref}
        aria-current={ariaCurrent}
        data-component="NavList.Item"
        data-current={ariaCurrent && ariaCurrent !== 'false' ? '' : undefined}
        className={cn(
          'flex min-h-8 items-center gap-2 rounded-md px-2 py-1 text-default hover:bg-muted focus-visible:outline-2 focus-visible:outline-focus data-[current]:bg-accent-muted data-[current]:font-semibold',
          className,
        )}
      >
        {leadingVisual ? <span aria-hidden="true">{leadingVisual}</span> : null}
        <span className="min-w-0 flex-1">{children}</span>
        {trailingVisual ? <span aria-hidden="true">{trailingVisual}</span> : null}
      </a>
    </li>
  )
})

export type NavListSubNavProps = React.ComponentPropsWithoutRef<typeof Collapsible.Root>
const SubNav = React.forwardRef<HTMLElement, NavListSubNavProps>(function NavListSubNav({className, ...props}, ref) {
  return (
    <Collapsible.Root
      {...props}
      ref={ref as React.Ref<HTMLDivElement>}
      data-component="NavList.SubNav"
      className={cn('pl-3', className)}
    />
  )
})

export type NavListSubNavTriggerProps = React.ComponentPropsWithoutRef<typeof Collapsible.Trigger>
const SubNavTrigger = React.forwardRef<HTMLButtonElement, NavListSubNavTriggerProps>(function NavListSubNavTrigger(
  {className, ...props},
  ref,
) {
  return (
    <Collapsible.Trigger
      {...props}
      ref={ref}
      data-component="NavList.SubNav.Trigger"
      className={cn(
        'flex min-h-8 w-full items-center rounded-md px-2 py-1 text-left text-sm font-semibold text-default hover:bg-muted focus-visible:outline-2 focus-visible:outline-focus',
        className,
      )}
    />
  )
})

export type NavListSubNavPanelProps = Omit<
  React.ComponentPropsWithoutRef<typeof Collapsible.Panel>,
  'className' | 'render'
> &
  React.ComponentPropsWithoutRef<'ul'>
const SubNavPanel = React.forwardRef<HTMLUListElement, NavListSubNavPanelProps>(function NavListSubNavPanel(
  {className, ...props},
  ref,
) {
  return (
    <Collapsible.Panel
      {...props}
      ref={ref as React.Ref<HTMLDivElement>}
      render={<ul />}
      data-component="NavList.SubNav.Panel"
      className={cn('m-0 list-none p-0 pl-3', className)}
    />
  )
})

export const NavList = Object.assign(Root, {
  Heading: NavListHeading,
  Group,
  GroupHeading,
  List,
  Item,
  SubNav: Object.assign(SubNav, {Trigger: SubNavTrigger, Panel: SubNavPanel}),
})
Root.displayName = 'NavList'
