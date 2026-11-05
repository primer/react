'use client'

import {Collapsible} from '@base-ui/react/collapsible'
import {ChevronDownIcon, PlusIcon} from '@primer/octicons-react'
import React from 'react'
import {flushSync} from 'react-dom'
import {cn} from '../../internal/cn'
import {mergeClassName} from '../../internal/mergeClassName'
import {itemGapFeatureFlag, ListContainerContext} from '../../internal/listContainer'
import {isPartOf, regionElements, resolveRegions} from '../../internal/regions'
import type {RegionProps} from '../../utils/types'
import {ActionList, type ActionListDescriptionProps, type ActionListTrailingActionProps} from '../ActionList/ActionList'
import {useFeatureFlag} from '../FeatureFlags/useFeatureFlag'
import {Heading} from '../Heading'
import {Tooltip} from '../Tooltip'

const NavListDepthContext = React.createContext(0)
const tooltipDelay = 400
const itemPadding = ['px-2', 'pr-2 pl-4', 'pr-2 pl-6', 'pr-2 pl-8', 'pr-2 pl-10'] as const

function getItemPadding(depth: number) {
  return itemPadding[Math.min(depth, itemPadding.length - 1)]
}

// Mirrors ActionList: when only some items have descriptions, every label returns to normal weight.
const mixedDescriptionsClassName =
  'has-[[data-has-description=true]]:has-[[data-has-description=false]]:[&_[data-item-label]]:font-normal'

const itemGapClassName = "[&_li+li]:mt-0.5 [&_[data-component='NavList.SubNav.Panel']]:mt-0.5"

export interface NavListProps extends React.ComponentPropsWithoutRef<'nav'>, RegionProps<'heading'> {
  /** Disable the gap between items when the item gap feature is enabled. */
  disableItemGap?: boolean
}
const Root = React.forwardRef<HTMLElement, NavListProps>(function NavList(
  {
    children,
    className,
    disableItemGap = false,
    heading: headingProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...props
  },
  ref,
) {
  const itemGap = useFeatureFlag(itemGapFeatureFlag) && !disableItemGap
  const fallbackHeadingId = React.useId()
  const {
    regions: {heading: headingNode},
    rest: content,
  } = resolveRegions(children, {heading: {match: isPartOf(NavListHeading)}}, {heading: headingProp})
  const heading = React.isValidElement<NavListHeadingProps>(headingNode) ? headingNode : undefined
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
      <div
        className={cn('p-2', mixedDescriptionsClassName, itemGap && itemGapClassName)}
        data-component="NavList.Content"
        data-item-gap={itemGap || undefined}
      >
        <ListContainerContext.Provider value="NavList">{content}</ListContainerContext.Provider>
      </div>
    </nav>
  )
})

export interface NavListHeadingProps extends React.ComponentPropsWithoutRef<typeof Heading> {
  /** Hides the heading visually while keeping it available to assistive technology. */
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

export interface NavListGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'section'>, 'title'>,
    RegionProps<'heading'> {
  /** Removes the divider drawn above the group. */
  hideDivider?: boolean
  /** Heading text for the group. A `NavList.GroupHeading` child takes precedence. */
  title?: React.ReactNode
}
const Group = React.forwardRef<HTMLElement, NavListGroupProps>(function NavListGroup(
  {children, className, heading: headingProp, hideDivider = false, title, ...props},
  ref,
) {
  const generatedHeadingId = React.useId()
  const {
    regions: {heading: headingNode},
    rest: items,
  } = resolveRegions(children, {heading: {match: isPartOf(GroupHeading)}}, {heading: headingProp})
  const explicitHeading = React.isValidElement<NavListGroupHeadingProps>(headingNode) ? headingNode : undefined
  const headingId = explicitHeading?.props.id ?? generatedHeadingId
  const heading = explicitHeading ? (
    React.cloneElement(explicitHeading, {id: headingId})
  ) : title ? (
    <GroupHeading id={headingId}>{title}</GroupHeading>
  ) : null

  return (
    <section
      {...props}
      ref={ref}
      data-component="NavList.Group"
      className={cn(
        hideDivider
          ? cn('mt-2 first:mt-0', heading && 'pt-1.5')
          : cn(
              '-mx-2 mt-[7px] border-t border-default px-2 first:mt-2 first:border-t-0',
              heading ? 'pt-3.5 first:pt-1.5' : 'pt-2 first:pt-0',
            ),
        className,
      )}
    >
      {heading}
      <ul className="m-0 list-none p-0" aria-labelledby={heading ? headingId : undefined}>
        {items}
      </ul>
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

export interface NavListItemProps
  extends React.ComponentPropsWithoutRef<'a'>,
    RegionProps<'leadingVisual' | 'trailingVisual' | 'trailingAction' | 'description'> {
  /** Element to render in place of the anchor, such as a router's link component. */
  as?: React.ElementType
  /** Marks the item temporarily unavailable and explains why. The item stays reachable. */
  inactiveText?: React.ReactNode
  /** Route the item links to, forwarded to the element supplied with `as` for router integration. */
  to?: string
  /** Supplementary text shown in a tooltip when the item is hovered or focused. */
  tooltipText?: string
}
const Item = React.forwardRef<HTMLAnchorElement, NavListItemProps>(function NavListItem(
  {
    as: Component = 'a',
    className,
    children,
    description: descriptionProp,
    href,
    inactiveText,
    leadingVisual,
    onClick,
    to,
    tooltipText,
    trailingAction,
    trailingVisual,
    'aria-current': ariaCurrent,
    ...props
  },
  ref,
) {
  const depth = React.useContext(NavListDepthContext)
  const {
    regions: {leadingVisual: leadingVisualNode, trailingVisual: trailingVisualNode, trailingAction: trailingActionNode},
    matched: {description: matchedDescriptions},
    rest: label,
  } = resolveRegions(
    children,
    {
      leadingVisual: {match: isPartOf(LeadingVisual)},
      trailingVisual: {match: isPartOf(TrailingVisual)},
      trailingAction: {match: isPartOf(TrailingAction)},
      description: {match: isPartOf(Description), multiple: true},
    },
    {
      leadingVisual,
      trailingVisual,
      trailingAction,
      description: descriptionProp,
    },
  )
  const descriptions = regionElements<NavListDescriptionProps>(descriptionProp, matchedDescriptions)
  const resolvedLeadingVisual = React.isValidElement<React.ComponentPropsWithoutRef<'span'>>(leadingVisualNode)
    ? leadingVisualNode
    : null
  const resolvedTrailingVisual = React.isValidElement<React.ComponentPropsWithoutRef<'span'>>(trailingVisualNode)
    ? trailingVisualNode
    : null
  const trailingActionChild = trailingActionNode
  const hasLeadingVisual = Boolean(resolvedLeadingVisual)
  const hasBlockDescription = descriptions.some(description => description.props.variant === 'block')
  const isCurrent = Boolean(ariaCurrent) && ariaCurrent !== 'false'
  const isInactive = inactiveText !== undefined || props['aria-disabled'] === true || props['aria-disabled'] === 'true'

  const link = (
    <Component
      {...props}
      ref={ref}
      href={href}
      to={to}
      aria-current={ariaCurrent}
      aria-disabled={isInactive || undefined}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        if (isInactive && !event.defaultPrevented) event.preventDefault()
      }}
      data-component="NavList.Item"
      data-current={isCurrent || undefined}
      data-has-description={descriptions.length > 0}
      data-inactive={isInactive || undefined}
      className={cn(
        'relative grid min-h-8 w-full min-w-0 flex-1 items-start gap-x-2 rounded-md py-1.5 text-left leading-6 text-default no-underline hover:bg-[var(--control-transparent-bgColor-hover)] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus',
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
        <span
          className={cn(
            'min-w-0',
            depth > 0 ? 'text-xs' : 'text-sm',
            'leading-5',
            descriptions.length > 0 && 'font-semibold',
          )}
          data-item-label=""
        >
          {label}
        </span>
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
              'row-start-1 flex min-h-5 items-center font-normal text-muted',
              hasLeadingVisual ? 'col-start-3' : 'col-start-2',
              resolvedTrailingVisual.props.className,
            ),
          })
        : null}
    </Component>
  )

  return (
    <li
      className={cn(
        'relative list-none rounded-md',
        isCurrent &&
          'bg-[var(--control-transparent-bgColor-selected)] after:absolute after:inset-y-1 after:-left-2 after:w-1 after:rounded-full after:bg-accent-emphasis',
        trailingActionChild && 'flex items-center gap-1',
      )}
    >
      {tooltipText ? (
        <Tooltip.Root>
          <Tooltip.Trigger render={link} delay={tooltipDelay} />
          <Tooltip.Content side="right">{tooltipText}</Tooltip.Content>
        </Tooltip.Root>
      ) : (
        link
      )}
      {trailingActionChild}
    </li>
  )
})

export interface NavListGroupExpandItem
  extends Omit<NavListItemProps, 'children' | 'leadingVisual' | 'trailingAction' | 'trailingVisual'> {
  /** Label of the item. */
  text: string
  /** Icon shown before the label. */
  leadingVisual?: React.ElementType
  /** Icon, or short text such as a count, shown after the label. */
  trailingVisual?: React.ElementType | string
  /** Action rendered beside the item. */
  trailingAction?: ActionListTrailingActionProps
  /** Marks the item that receives focus after a reveal. Set by `NavList.GroupExpand`. */
  'data-expand-focus-target'?: string
}

export interface NavListGroupExpandProps {
  /** Text of the button that reveals more items. */
  label?: string
  /** Number of reveals needed to show every item. `0` reveals them all at once. */
  pages?: number
  /** Items revealed by the button. */
  items: NavListGroupExpandItem[]
  /**
   * Renders a revealed item, in place of the default `NavList.Item`. Spread the item's props to keep focus management.
   * @default item => <NavList.Item {...item}>{item.text}</NavList.Item>
   */
  renderItem?: (item: NavListGroupExpandItem) => React.ReactNode
}

function renderGroupExpandItem({
  leadingVisual: LeadingVisualIcon,
  text,
  trailingAction,
  trailingVisual: TrailingVisualIcon,
  ...itemProps
}: NavListGroupExpandItem) {
  return (
    <Item {...itemProps}>
      {LeadingVisualIcon ? (
        <LeadingVisual>
          <LeadingVisualIcon />
        </LeadingVisual>
      ) : null}
      {text}
      {TrailingVisualIcon ? (
        <TrailingVisual>
          {typeof TrailingVisualIcon === 'string' ? TrailingVisualIcon : <TrailingVisualIcon />}
        </TrailingVisual>
      ) : null}
      {trailingAction ? <TrailingAction {...trailingAction} /> : null}
    </Item>
  )
}

const GroupExpand = React.forwardRef<HTMLButtonElement, NavListGroupExpandProps>(function NavListGroupExpand(
  {label = 'Show more', pages = 0, items, renderItem = renderGroupExpandItem},
  ref,
) {
  const depth = React.useContext(NavListDepthContext)
  const [currentPage, setCurrentPage] = React.useState(0)
  const focusTargetId = React.useId()
  const itemsPerPage = items.length / pages
  const amountToShow = pages === 0 ? items.length : Math.ceil(itemsPerPage * currentPage)
  const focusTargetIndex = currentPage === 1 ? 0 : amountToShow - Math.floor(itemsPerPage)

  return (
    <>
      {currentPage > 0
        ? items.slice(0, amountToShow).map((item, index) => (
            <React.Fragment key={`${index}-${item.text}`}>
              {renderItem({
                ...item,
                'data-expand-focus-target': index === focusTargetIndex ? focusTargetId : undefined,
              })}
            </React.Fragment>
          ))
        : null}
      {currentPage < pages || currentPage === 0 ? (
        <li className="relative list-none rounded-md">
          <button
            ref={ref}
            type="button"
            aria-expanded="false"
            data-component="NavList.GroupExpand"
            className={cn(
              'grid min-h-8 w-full cursor-pointer appearance-none grid-cols-[minmax(0,1fr)_min-content] items-start gap-x-2 rounded-md border-0 bg-transparent py-1.5 text-left font-normal text-default hover:bg-[var(--control-transparent-bgColor-hover)] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus',
              getItemPadding(depth),
            )}
            onClick={event => {
              const ownerDocument = event.currentTarget.ownerDocument
              flushSync(() => setCurrentPage(page => page + 1))
              const focusTargets = ownerDocument.querySelectorAll<HTMLElement>(
                `[data-expand-focus-target="${focusTargetId}"]`,
              )
              Array.from(focusTargets).at(-1)?.focus()
            }}
          >
            <span className={cn('min-w-0', depth > 0 ? 'text-xs' : 'text-sm', 'leading-5')}>{label}</span>
            <span className="flex min-h-5 items-center text-muted">
              <PlusIcon aria-hidden="true" />
            </span>
          </button>
        </li>
      ) : null}
    </>
  )
})

export type NavListSubNavProps = React.ComponentPropsWithoutRef<typeof Collapsible.Root>
const SubNav = React.forwardRef<HTMLElement, NavListSubNavProps>(function NavListSubNav({className, ...props}, ref) {
  return (
    <Collapsible.Root
      render={<li />}
      {...props}
      ref={ref as React.Ref<HTMLDivElement>}
      data-component="NavList.SubNav"
      className={mergeClassName('list-none', className)}
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
        'group flex h-8 w-full appearance-none items-center gap-2 rounded-md border-0 bg-transparent py-1 text-left font-normal text-default hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus',
        depth > 0 ? 'text-xs' : 'text-sm',
        'leading-5',
        getItemPadding(depth),
        className,
      )}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <ChevronDownIcon
        aria-hidden="true"
        className="shrink-0 text-muted group-data-[panel-open]:-scale-y-100"
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
  GroupExpand,
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
