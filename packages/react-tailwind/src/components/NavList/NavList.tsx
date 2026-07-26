'use client'

import {Collapsible} from '@base-ui/react/collapsible'
import {ChevronDownIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {ActionList, type ActionListDescriptionProps, type ActionListTrailingActionProps} from '../ActionList/ActionList'
import {Heading} from '../Heading'

const NavListDepthContext = React.createContext(0)
const itemPadding = ['px-2', 'pr-2 pl-4', 'pr-2 pl-6', 'pr-2 pl-8', 'pr-2 pl-10'] as const

function getItemPadding(depth: number) {
  return itemPadding[Math.min(depth, itemPadding.length - 1)]
}

export type NavListProps = React.ComponentPropsWithoutRef<'nav'>
const Root = React.forwardRef<HTMLElement, NavListProps>(function NavList(
  {children, className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, ...props},
  ref,
) {
  const fallbackHeadingId = React.useId()
  const childParts = React.Children.toArray(children)
  const heading = childParts.find(
    child => React.isValidElement<NavListHeadingProps>(child) && child.type === NavListHeading,
  ) as React.ReactElement<NavListHeadingProps> | undefined
  const content = childParts.filter(child => !(React.isValidElement(child) && child.type === NavListHeading))
  const headingId = heading?.props.id ?? fallbackHeadingId

  return (
    <nav
      {...props}
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby ?? (ariaLabel ? undefined : heading ? headingId : undefined)}
      data-component="NavList"
      className={cn(className)}
    >
      {heading ? React.cloneElement(heading, {id: headingId}) : null}
      <div className="p-2" data-component="NavList.Content">
        {content}
      </div>
    </nav>
  )
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
      className={cn('m-0 mb-2 ml-4 font-semibold leading-6', visuallyHidden && 'sr-only', className)}
    />
  )
})

export interface NavListGroupProps extends Omit<React.ComponentPropsWithoutRef<'section'>, 'title'> {
  hideDivider?: boolean
  title?: React.ReactNode
}
const Group = React.forwardRef<HTMLElement, NavListGroupProps>(function NavListGroup(
  {children, className, hideDivider = false, title, ...props},
  ref,
) {
  return (
    <section
      {...props}
      ref={ref}
      data-component="NavList.Group"
      className={cn(
        !hideDivider &&
          '-mx-2 mt-2 border-t border-default px-2 pt-[13px] first-of-type:border-t-0 first-of-type:pt-1.5',
        className,
      )}
    >
      {title ? <GroupHeading>{title}</GroupHeading> : null}
      {children}
    </section>
  )
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
      className={cn(
        'm-0 mb-1.5 px-2 text-xs font-semibold leading-[18px] text-muted [&>a]:text-default [&>a]:no-underline hover:[&>a]:underline',
        className,
      )}
    >
      {children}
    </h3>
  )
})

export type NavListListProps = React.ComponentPropsWithoutRef<'ul'>
const List = React.forwardRef<HTMLUListElement, NavListListProps>(function NavListList({className, ...props}, ref) {
  return <ul {...props} ref={ref} data-component="NavList.List" className={cn('m-0 list-none p-0', className)} />
})

const LeadingVisual = ActionList.LeadingVisual
const TrailingVisual = ActionList.TrailingVisual
const TrailingAction = ActionList.TrailingAction

export type NavListLeadingVisualProps = React.ComponentPropsWithoutRef<typeof LeadingVisual>
export type NavListTrailingVisualProps = React.ComponentPropsWithoutRef<typeof TrailingVisual>
export type NavListTrailingActionProps = ActionListTrailingActionProps
export type NavListDescriptionProps = ActionListDescriptionProps
const Description = ActionList.Description

export interface NavListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  inactiveText?: React.ReactNode
  leadingVisual?: React.ReactNode
  trailingVisual?: React.ReactNode
}
const Item = React.forwardRef<HTMLAnchorElement, NavListItemProps>(function NavListItem(
  {
    className,
    children,
    href,
    inactiveText,
    leadingVisual,
    onClick,
    trailingVisual,
    'aria-current': ariaCurrent,
    ...props
  },
  ref,
) {
  const depth = React.useContext(NavListDepthContext)
  const childParts = React.Children.toArray(children)
  const leadingVisualChild = childParts.find(child => React.isValidElement(child) && child.type === LeadingVisual) as
    | React.ReactElement<React.ComponentPropsWithoutRef<'span'>>
    | undefined
  const trailingVisualChild = childParts.find(child => React.isValidElement(child) && child.type === TrailingVisual) as
    | React.ReactElement<React.ComponentPropsWithoutRef<'span'>>
    | undefined
  const trailingActionChild = childParts.find(child => React.isValidElement(child) && child.type === TrailingAction) as
    | React.ReactElement<ActionListTrailingActionProps>
    | undefined
  const descriptions = childParts.filter(
    child => React.isValidElement(child) && child.type === Description,
  ) as React.ReactElement<NavListDescriptionProps>[]
  const label = childParts.filter(
    child =>
      !(
        React.isValidElement(child) &&
        (child.type === LeadingVisual ||
          child.type === TrailingVisual ||
          child.type === TrailingAction ||
          child.type === Description)
      ),
  )
  const resolvedLeadingVisual =
    leadingVisualChild ?? (leadingVisual ? <LeadingVisual>{leadingVisual}</LeadingVisual> : null)
  const resolvedTrailingVisual =
    trailingVisualChild ?? (trailingVisual ? <TrailingVisual>{trailingVisual}</TrailingVisual> : null)
  const hasLeadingVisual = Boolean(resolvedLeadingVisual)
  const hasBlockDescription = descriptions.some(description => description.props.variant === 'block')
  const isCurrent = Boolean(ariaCurrent) && ariaCurrent !== 'false'
  const isInactive = inactiveText !== undefined || props['aria-disabled'] === true || props['aria-disabled'] === 'true'

  return (
    <li
      className={cn(
        'relative list-none rounded-md',
        isCurrent &&
          'bg-[var(--control-transparent-bgColor-selected)] after:absolute after:inset-y-1 after:-left-2 after:w-1 after:rounded-full after:bg-accent-emphasis',
        trailingActionChild && 'flex items-center gap-1',
      )}
    >
      <a
        {...props}
        ref={ref}
        href={href}
        aria-current={ariaCurrent}
        aria-disabled={isInactive || undefined}
        onClick={event => {
          onClick?.(event)
          if (isInactive && !event.defaultPrevented) event.preventDefault()
        }}
        data-component="NavList.Item"
        data-current={isCurrent || undefined}
        data-inactive={isInactive || undefined}
        className={cn(
          'relative grid min-h-8 w-full min-w-0 flex-1 items-start gap-x-2 rounded-md py-1.5 text-left leading-6 text-default no-underline hover:bg-[var(--control-transparent-bgColor-hover)] focus-visible:outline-2 focus-visible:outline-focus',
          hasLeadingVisual
            ? 'grid-cols-[min-content_minmax(0,1fr)_min-content]'
            : 'grid-cols-[minmax(0,1fr)_min-content]',
          isCurrent && 'font-semibold',
          isInactive && 'cursor-not-allowed text-muted hover:bg-transparent',
          trailingActionChild && 'min-w-0',
          getItemPadding(depth),
          className,
        )}
      >
        {resolvedLeadingVisual
          ? React.cloneElement(resolvedLeadingVisual, {
              className: cn(
                'row-start-1 flex min-h-5 items-center font-normal text-muted [&>svg]:size-4',
                resolvedLeadingVisual.props.className,
              ),
            })
          : null}
        <span
          className={cn(
            'row-start-1 flex min-w-0',
            hasBlockDescription ? 'flex-col gap-1' : 'items-baseline gap-2',
            hasLeadingVisual ? 'col-start-2' : 'col-start-1',
          )}
        >
          <span className="min-w-0 text-sm leading-5">{label}</span>
          {descriptions.length > 0 ? <span className="sr-only">{',\u00a0'}</span> : null}
          {descriptions.map((description, index) =>
            React.cloneElement(description, {
              key: description.key ?? index,
              className: cn('font-normal leading-4', description.props.className),
            }),
          )}
        </span>
        {resolvedTrailingVisual
          ? React.cloneElement(resolvedTrailingVisual, {
              className: cn(
                'row-start-1 flex min-h-5 items-center text-muted',
                hasLeadingVisual ? 'col-start-3' : 'col-start-2',
                resolvedTrailingVisual.props.className,
              ),
            })
          : null}
      </a>
      {trailingActionChild}
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
      className={className}
    />
  )
})

export type NavListSubNavTriggerProps = React.ComponentPropsWithoutRef<typeof Collapsible.Trigger>
const SubNavTrigger = React.forwardRef<HTMLButtonElement, NavListSubNavTriggerProps>(function NavListSubNavTrigger(
  {className, children, ...props},
  ref,
) {
  const depth = React.useContext(NavListDepthContext)
  return (
    <Collapsible.Trigger
      {...props}
      ref={ref}
      data-component="NavList.SubNav.Trigger"
      className={cn(
        'group flex h-8 w-full appearance-none items-center gap-2 rounded-md border-0 bg-transparent py-1 text-left font-normal leading-5 text-default hover:bg-muted focus-visible:outline-2 focus-visible:outline-focus',
        getItemPadding(depth),
        className,
      )}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <ChevronDownIcon
        aria-hidden="true"
        className="shrink-0 text-muted transition-transform group-data-[panel-open]:rotate-0 group-data-[panel-closed]:-rotate-90"
        size={16}
      />
    </Collapsible.Trigger>
  )
})

export type NavListSubNavPanelProps = Omit<
  React.ComponentPropsWithoutRef<typeof Collapsible.Panel>,
  'className' | 'render'
> &
  React.ComponentPropsWithoutRef<'ul'>
const SubNavPanel = React.forwardRef<HTMLUListElement, NavListSubNavPanelProps>(function NavListSubNavPanel(
  {children, className, ...props},
  ref,
) {
  const depth = React.useContext(NavListDepthContext)
  return (
    <Collapsible.Panel
      {...props}
      ref={ref as React.Ref<HTMLDivElement>}
      render={<ul />}
      data-component="NavList.SubNav.Panel"
      className={cn('m-0 list-none p-0', className)}
    >
      <NavListDepthContext.Provider value={depth + 1}>{children}</NavListDepthContext.Provider>
    </Collapsible.Panel>
  )
})

export const NavList = Object.assign(Root, {
  Heading: NavListHeading,
  Group,
  GroupHeading,
  List,
  Item,
  LeadingVisual,
  TrailingVisual,
  TrailingAction,
  Description,
  SubNav: Object.assign(SubNav, {Trigger: SubNavTrigger, Panel: SubNavPanel}),
})
Root.displayName = 'NavList'
;('use client')
