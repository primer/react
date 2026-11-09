'use client'

import {Collapsible} from '@base-ui/react/collapsible'
import {ChevronDownIcon, PlusIcon} from '@primer/octicons-react'
import React from 'react'
import {flushSync} from 'react-dom'
import {cn} from '../../internal/cn'
import {flattenChildren} from '../../internal/children'
import {joinIdRefs} from '../../internal/idRefs'
import {mergeClassName} from '../../internal/mergeClassName'
import {itemGapFeatureFlag, ListContainerContext} from '../../internal/listContainer'
import {isPartOf, regionElements, resolveRegions} from '../../internal/regions'
import {unstyledButtonResetClassName} from '../../internal/UnstyledButton'
import type {RegionProps} from '../../utils/types'
import type {BroadAsProps, PolymorphicPropsWithDefaultRef} from '../../utils/types/component'
import {
  ActionItemContent,
  ActionList,
  type ActionListDescriptionProps,
  type ActionListTrailingActionProps,
} from '../ActionList/ActionList'
import {
  actionItemPartClassName,
  getActionItemStateAttributes,
  getActionItemStateClassName,
} from '../ActionList/itemState'
import {useFeatureFlag} from '../FeatureFlags/useFeatureFlag'
import {Heading} from '../Heading'
import {Tooltip} from '../Tooltip'

const NavListDepthContext = React.createContext(0)
type HeadingLevel = NonNullable<React.ComponentPropsWithoutRef<typeof Heading>['as']>
const headingLevels: readonly HeadingLevel[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const NavListGroupHeadingLevelContext = React.createContext<HeadingLevel>('h3')
const NavListListContext = React.createContext(false)
const tooltipDelay = 400
const itemPadding = [
  'primer:px-2',
  'primer:pr-2 primer:pl-4',
  'primer:pr-2 primer:pl-6',
  'primer:pr-2 primer:pl-8',
  'primer:pr-2 primer:pl-10',
] as const

function getItemPadding(depth: number) {
  return itemPadding[Math.min(depth, itemPadding.length - 1)]
}

// Mirrors ActionList: when only some items have descriptions, every label returns to normal weight.
const mixedDescriptionsClassName =
  'primer:has-[[data-has-description=true]]:has-[[data-has-description=false]]:[&_[data-item-label]]:font-normal'

const itemGapClassName =
  "primer:[&_li+li]:mt-0.5 primer:[&_li:has(>[data-component='NavList.Group'])+li]:mt-0 primer:[&_[data-component='NavList.SubNav.Panel']]:mt-0.5"

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
  const headingLevel = heading?.props.as ?? 'h2'
  const groupHeadingLevel = heading
    ? headingLevels[Math.min(headingLevels.indexOf(headingLevel) + 1, headingLevels.length - 1)]
    : 'h3'
  const sections: React.ReactNode[] = []
  let items: React.ReactNode[] = []
  function flushItems() {
    if (items.length === 0) return
    const decorative = items.every(child => React.isValidElement(child) && isPartOf(Divider)(child))
    sections.push(
      <List
        key={`items-${sections.length}`}
        role={decorative ? 'presentation' : undefined}
        aria-hidden={decorative || undefined}
      >
        {items}
      </List>,
    )
    items = []
  }
  for (const child of flattenChildren(content)) {
    if (
      React.isValidElement(child) &&
      (isPartOf(Group)(child) || isPartOf(List)(child) || child.type === 'ul' || child.type === 'ol')
    ) {
      flushItems()
      sections.push(
        child.type === 'ul' || child.type === 'ol' ? (
          <NavListListContext.Provider key={child.key ?? `list-${sections.length}`} value>
            {child}
          </NavListListContext.Provider>
        ) : (
          child
        ),
      )
    } else {
      items.push(child)
    }
  }
  flushItems()

  return (
    <nav
      {...props}
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby ?? (ariaLabel ? undefined : heading ? headingId : undefined)}
      data-component="NavList"
      className={cn(className)}
    >
      <NavListListContext.Provider value={false}>
        <NavListGroupHeadingLevelContext.Provider value={groupHeadingLevel}>
          {heading ? React.cloneElement(heading, {id: headingId}) : null}
          <div
            className={cn(
              'primer:p-2',
              "primer:[&>ul:not(:first-child)>[data-component='ActionList.Divider']:first-child]:block",
              mixedDescriptionsClassName,
              itemGap && itemGapClassName,
            )}
            data-component="NavList.Content"
            data-item-gap={itemGap || undefined}
          >
            <ListContainerContext.Provider value="NavList">{sections}</ListContainerContext.Provider>
          </div>
        </NavListGroupHeadingLevelContext.Provider>
      </NavListListContext.Provider>
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
      className={cn(
        'primer:m-0 primer:mb-2 primer:ml-4 primer:font-semibold primer:leading-6',
        visuallyHidden && 'primer:sr-only',
        className,
      )}
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
  const insideList = React.useContext(NavListListContext)
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

  const group = (
    <section
      {...props}
      ref={ref}
      data-component="NavList.Group"
      className={cn(
        hideDivider
          ? cn(
              'primer:mt-2',
              insideList ? 'primer:[ul:first-child>li:first-child>&]:mt-0' : 'primer:first:mt-0',
              heading && 'primer:pt-1.5',
            )
          : cn(
              'primer:-mx-2 primer:mt-[7px] primer:border-t primer:border-default primer:px-2',
              insideList
                ? 'primer:[ul:first-child>li:first-child>&]:mt-2 primer:[ul:first-child>li:first-child>&]:border-t-0'
                : 'primer:first:mt-2 primer:first:border-t-0',
              heading
                ? cn(
                    'primer:pt-3.5',
                    insideList ? 'primer:[ul:first-child>li:first-child>&]:pt-1.5' : 'primer:first:pt-1.5',
                  )
                : cn('primer:pt-2', insideList ? 'primer:[ul:first-child>li:first-child>&]:pt-0' : 'primer:first:pt-0'),
            ),
        className,
      )}
    >
      {heading}
      <NavListListContext.Provider value>
        <ul className="primer:m-0 primer:list-none primer:p-0" aria-labelledby={heading ? headingId : undefined}>
          {items}
        </ul>
      </NavListListContext.Provider>
    </section>
  )

  return insideList ? <li className="primer:list-none">{group}</li> : group
})

export interface NavListGroupHeadingProps extends React.ComponentPropsWithoutRef<'h3'>, RegionProps<'trailingAction'> {
  /** Heading element to render, so the level fits the surrounding document outline. */
  as?: HeadingLevel
}
const GroupHeading = React.forwardRef<HTMLHeadingElement, NavListGroupHeadingProps>(function NavListGroupHeading(
  {as, children, className, trailingAction: trailingActionProp, ...props},
  ref,
) {
  const defaultHeadingLevel = React.useContext(NavListGroupHeadingLevelContext)
  const Component = as ?? defaultHeadingLevel
  const {
    regions: {trailingAction},
    rest: headingChildren,
  } = resolveRegions(
    children,
    {trailingAction: {match: isPartOf(ActionList.GroupHeading.TrailingAction)}},
    {trailingAction: trailingActionProp},
  )
  const heading = (
    <Component
      {...props}
      ref={ref}
      data-component="NavList.GroupHeading"
      className={cn(
        'primer:m-0 primer:px-2 primer:text-xs primer:font-semibold primer:leading-[18px] primer:text-muted primer:[&>a]:text-default primer:[&>a]:no-underline primer:hover:[&>a]:underline',
        !trailingAction && 'primer:mb-1.5',
        className,
      )}
    >
      {headingChildren}
    </Component>
  )

  return trailingAction ? (
    <div className="primer:mb-1.5 primer:flex primer:items-center primer:justify-between">
      {heading}
      {trailingAction}
    </div>
  ) : (
    heading
  )
})

export type NavListListProps = React.ComponentPropsWithoutRef<'ul'>
const List = React.forwardRef<HTMLUListElement, NavListListProps>(function NavListList({className, ...props}, ref) {
  return (
    <NavListListContext.Provider value>
      <ul
        {...props}
        ref={ref}
        data-component="NavList.List"
        className={cn('primer:m-0 primer:list-none primer:p-0', className)}
      />
    </NavListListContext.Provider>
  )
})

export type NavListDividerProps = React.ComponentPropsWithoutRef<typeof ActionList.Divider>
const Divider = ActionList.Divider
const LeadingVisual = ActionList.LeadingVisual
const TrailingVisual = ActionList.TrailingVisual
const TrailingAction = ActionList.TrailingAction

export type NavListLeadingVisualProps = React.ComponentPropsWithoutRef<typeof LeadingVisual>
export type NavListTrailingVisualProps = React.ComponentPropsWithoutRef<typeof TrailingVisual>
export type NavListTrailingActionProps = ActionListTrailingActionProps
export type NavListDescriptionProps = ActionListDescriptionProps
const Description = ActionList.Description

interface NavListItemOwnProps
  extends RegionProps<'leadingVisual' | 'trailingVisual' | 'trailingAction' | 'description'> {
  /** Element to render in place of the anchor, such as a router's link component. */
  as?: React.ElementType
  /** Marks the item temporarily unavailable and explains why. The item stays reachable. */
  inactiveText?: React.ReactNode
  /** Supplementary text shown in a tooltip when the item is hovered or focused. */
  tooltipText?: string
}

type NavListItemInternalProps = NavListItemOwnProps &
  React.ComponentPropsWithoutRef<'a'> & {
    /** Route the item links to, forwarded to the element supplied with `as` for router integration. */
    to?: string
  }

export type NavListItemProps<As extends React.ElementType = never> = PolymorphicPropsWithDefaultRef<
  As,
  NavListItemOwnProps & ([As] extends [never] ? {to?: string} : As extends 'a' ? {to?: string} : object),
  'a',
  HTMLAnchorElement
>

const ItemRoot = React.forwardRef<HTMLAnchorElement, NavListItemInternalProps>(function NavListItem(
  {
    as: Component = 'a',
    className,
    children,
    description: descriptionProp,
    href,
    inactiveText,
    leadingVisual,
    onAuxClick,
    onClick,
    to,
    tooltipText,
    trailingAction,
    trailingVisual,
    'aria-current': ariaCurrent,
    'aria-describedby': describedBy,
    ...props
  },
  ref,
) {
  const depth = React.useContext(NavListDepthContext)
  const inactiveReasonId = React.useId()
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
  const accessibility = ActionItemContent.useAccessibility({
    describedBy,
    label: props['aria-label'],
    labelledBy: props['aria-labelledby'],
    render: undefined,
    resolveContent: id =>
      ActionItemContent.resolveParts(
        {descriptions, label, leadingVisual: resolvedLeadingVisual, trailingVisual: resolvedTrailingVisual},
        id,
      ),
  })
  const resolvedDescriptions = accessibility.resolvedContent.descriptions
  const hasLeadingVisual = Boolean(resolvedLeadingVisual)
  const hasBlockDescription = descriptions.some(description => description.props.variant === 'block')
  const {hasWrappingInlineDescription} = accessibility.resolvedContent
  const isCurrent = Boolean(ariaCurrent) && ariaCurrent !== 'false'
  const isInactive = inactiveText !== undefined || props['aria-disabled'] === true || props['aria-disabled'] === 'true'
  const hasInactiveReason =
    inactiveText !== undefined && inactiveText !== null && inactiveText !== false && inactiveText !== true
  const itemDescribedBy = joinIdRefs(accessibility.describedBy, hasInactiveReason && inactiveReasonId)
  const trailingVisualId = accessibility.resolvedContent.trailingVisualId
  const visual = resolvedTrailingVisual
    ? React.cloneElement(resolvedTrailingVisual, {
        className: cn(
          !trailingVisualId && 'primer:row-start-1',
          'primer:flex primer:min-h-5 primer:items-center primer:font-normal',
          actionItemPartClassName.trailingVisual,
          !trailingVisualId && (hasLeadingVisual ? 'primer:col-start-3' : 'primer:col-start-2'),
          resolvedTrailingVisual.props.className,
        ),
      })
    : null

  const link = (
    <Component
      {...props}
      ref={ref}
      href={href}
      to={to}
      aria-current={ariaCurrent}
      aria-labelledby={accessibility.labelledBy}
      // With a tooltip, the trigger merges this with the tooltip description. Any key on the link, even `undefined`,
      // would replace that merged value.
      {...(tooltipText ? {} : {'aria-describedby': itemDescribedBy})}
      aria-disabled={isInactive || undefined}
      onAuxClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        if (isInactive) {
          event.preventDefault()
          return
        }
        onAuxClick?.(event)
      }}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        if (isInactive) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      data-component="NavList.Item"
      data-current={isCurrent || undefined}
      data-has-description={descriptions.length > 0}
      data-inactive={isInactive || undefined}
      className={cn(
        unstyledButtonResetClassName,
        'primer:relative primer:box-border primer:grid primer:min-h-8 primer:w-full primer:min-w-0 primer:flex-1 primer:cursor-pointer primer:items-start primer:gap-x-2 primer:rounded-md primer:py-1.5 primer:text-left primer:leading-6 primer:no-underline primer:focus-visible:outline-2 primer:focus-visible:outline-offset-0 primer:focus-visible:outline-focus',
        actionItemPartClassName.content,
        hasLeadingVisual
          ? 'primer:grid-cols-[min-content_minmax(0,1fr)_fit-content(50%)]'
          : 'primer:grid-cols-[minmax(0,1fr)_fit-content(50%)]',
        isCurrent && 'primer:font-semibold',
        isInactive && 'primer:cursor-not-allowed',
        trailingActionChild && 'primer:min-w-0',
        getItemPadding(depth),
        className,
      )}
    >
      {resolvedLeadingVisual
        ? React.cloneElement(resolvedLeadingVisual, {
            className: cn(
              'primer:row-start-1 primer:flex primer:min-h-5 primer:items-center primer:font-normal primer:[&>svg]:size-4',
              actionItemPartClassName.leadingVisual,
              resolvedLeadingVisual.props.className,
            ),
          })
        : null}
      <span
        className={cn(
          'primer:row-start-1 primer:flex primer:min-w-0',
          hasBlockDescription ? 'primer:flex-col primer:gap-1' : 'primer:items-baseline primer:gap-2',
          !hasBlockDescription && hasWrappingInlineDescription && 'primer:flex-wrap',
          hasLeadingVisual ? 'primer:col-start-2' : 'primer:col-start-1',
        )}
      >
        <span
          className={cn(
            'primer:min-w-0 primer:wrap-anywhere',
            depth > 0 ? 'primer:text-xs' : 'primer:text-sm',
            'primer:leading-5',
            actionItemPartClassName.label,
            descriptions.length > 0 && 'primer:font-semibold',
          )}
          data-item-label=""
          id={accessibility.resolvedContent.labelId}
        >
          {label}
        </span>
        {resolvedDescriptions.map((description, index) =>
          React.cloneElement(description, {
            key: description.key ?? index,
            className: cn('primer:font-normal primer:leading-4', description.props.className),
          }),
        )}
      </span>
      {trailingVisualId ? (
        <span
          className={cn(
            'primer:row-start-1 primer:flex primer:min-h-5 primer:items-center',
            hasLeadingVisual ? 'primer:col-start-3' : 'primer:col-start-2',
          )}
          id={trailingVisualId}
        >
          {visual}
        </span>
      ) : (
        visual
      )}
    </Component>
  )

  return (
    <li
      {...getActionItemStateAttributes({active: isCurrent, inactive: isInactive})}
      className={cn(
        'primer:relative primer:list-none primer:rounded-md',
        // The row owns the state, so hovering the current item replaces its fill rather than layering over it.
        getActionItemStateClassName({active: isCurrent, inactive: isInactive}),
        trailingActionChild && 'primer:flex primer:items-center primer:gap-1',
      )}
    >
      {tooltipText ? (
        <Tooltip.Root>
          <Tooltip.Trigger aria-describedby={itemDescribedBy} render={link} delay={tooltipDelay} />
          <Tooltip.Content side="right">{tooltipText}</Tooltip.Content>
        </Tooltip.Root>
      ) : (
        link
      )}
      {hasInactiveReason ? (
        <span className="primer:sr-only" id={inactiveReasonId}>
          {inactiveText}
        </span>
      ) : null}
      {trailingActionChild}
    </li>
  )
})

const Item = ItemRoot as {
  <As extends React.ElementType>(props: NavListItemProps<As> & {as: As}): React.ReactElement | null
  (props: NavListItemProps<'a'>): React.ReactElement | null
  <As extends React.ElementType>(props: BroadAsProps<As, NavListItemProps>): React.ReactElement | null
  displayName?: string
}

export interface NavListGroupExpandItem
  extends Omit<NavListItemInternalProps, 'children' | 'leadingVisual' | 'trailingAction' | 'trailingVisual'> {
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
    <ItemRoot {...itemProps}>
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
    </ItemRoot>
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
        <li
          {...getActionItemStateAttributes({})}
          className={cn('primer:relative primer:list-none primer:rounded-md', getActionItemStateClassName({}))}
        >
          <button
            ref={ref}
            type="button"
            aria-expanded="false"
            data-component="NavList.GroupExpand"
            className={cn(
              'primer:grid primer:min-h-8 primer:w-full primer:cursor-pointer primer:appearance-none primer:grid-cols-[minmax(0,1fr)_min-content] primer:items-start primer:gap-x-2 primer:rounded-md primer:border-0 primer:bg-transparent primer:py-1.5 primer:text-left primer:font-normal primer:focus-visible:outline-2 primer:focus-visible:outline-offset-0 primer:focus-visible:outline-focus',
              actionItemPartClassName.content,
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
            <span
              className={cn(
                'primer:min-w-0',
                depth > 0 ? 'primer:text-xs' : 'primer:text-sm',
                'primer:leading-5',
                actionItemPartClassName.label,
              )}
              data-item-label=""
            >
              {label}
            </span>
            <span
              className={cn('primer:flex primer:min-h-5 primer:items-center', actionItemPartClassName.trailingVisual)}
            >
              <PlusIcon aria-hidden="true" />
            </span>
          </button>
        </li>
      ) : null}
    </>
  )
})

function hasCurrentNavItem(node: React.ReactNode): boolean {
  return React.Children.toArray(node).some(child => {
    if (!React.isValidElement<{children?: React.ReactNode; 'aria-current'?: unknown}>(child)) return false
    const ariaCurrent = child.props['aria-current']
    if (Boolean(ariaCurrent) && ariaCurrent !== 'false') return true
    return hasCurrentNavItem(child.props.children)
  })
}

interface SubNavContextValue {
  /** The section is collapsed while it contains the current item. */
  active: boolean
  triggerId: string | undefined
}
const SubNavContext = React.createContext<SubNavContextValue>({active: false, triggerId: undefined})

export type NavListSubNavProps = React.ComponentPropsWithoutRef<typeof Collapsible.Root>
const SubNav = React.forwardRef<HTMLElement, NavListSubNavProps>(function NavListSubNav(
  {children, className, defaultOpen = false, onOpenChange, open: openProp, ...props},
  ref,
) {
  const generatedTriggerId = React.useId()
  const trigger = flattenChildren(children).find(child =>
    React.isValidElement(child) ? isPartOf(SubNavTrigger)(child) : false,
  )
  const triggerId =
    (React.isValidElement<NavListSubNavTriggerProps>(trigger) ? trigger.props.id : undefined) ?? generatedTriggerId
  // Upstream opens a section that contains the current item, including when navigation moves the current item into it.
  const containsCurrentItem = hasCurrentNavItem(children)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen || containsCurrentItem)
  const [previousContainsCurrentItem, setPreviousContainsCurrentItem] = React.useState(containsCurrentItem)
  if (containsCurrentItem !== previousContainsCurrentItem) {
    setPreviousContainsCurrentItem(containsCurrentItem)
    if (containsCurrentItem) setUncontrolledOpen(true)
  }
  const open = openProp ?? uncontrolledOpen
  const active = !open && containsCurrentItem

  return (
    <SubNavContext.Provider value={{active, triggerId}}>
      <Collapsible.Root
        render={<li />}
        {...props}
        ref={ref as React.Ref<HTMLDivElement>}
        open={open}
        onOpenChange={(nextOpen, eventDetails) => {
          onOpenChange?.(nextOpen, eventDetails)
          if (!eventDetails.isCanceled && openProp === undefined) setUncontrolledOpen(nextOpen)
        }}
        data-component="NavList.SubNav"
        className={mergeClassName('primer:list-none', className)}
      >
        {children}
      </Collapsible.Root>
    </SubNavContext.Provider>
  )
})

export type NavListSubNavTriggerProps = React.ComponentPropsWithoutRef<typeof Collapsible.Trigger>
const SubNavTrigger = React.forwardRef<HTMLButtonElement, NavListSubNavTriggerProps>(function NavListSubNavTrigger(
  {className, children, id, ...props},
  ref,
) {
  const depth = React.useContext(NavListDepthContext)
  const {active, triggerId} = React.useContext(SubNavContext)
  return (
    <Collapsible.Trigger
      {...props}
      {...getActionItemStateAttributes({active})}
      ref={ref}
      id={id ?? triggerId}
      data-component="NavList.SubNav.Trigger"
      className={cn(
        'primer:group primer:relative primer:flex primer:h-8 primer:w-full primer:cursor-pointer primer:appearance-none primer:items-center primer:gap-2 primer:rounded-md primer:border-0 primer:bg-transparent primer:py-1 primer:text-left primer:font-normal primer:focus-visible:outline-2 primer:focus-visible:outline-offset-0 primer:focus-visible:outline-focus',
        actionItemPartClassName.content,
        // A section holds its own state, so a collapsed section that contains the current item is marked as current.
        getActionItemStateClassName({active}),
        depth > 0 ? 'primer:text-xs' : 'primer:text-sm',
        'primer:leading-5',
        getItemPadding(depth),
        className,
      )}
    >
      <span className={cn('primer:min-w-0 primer:flex-1', actionItemPartClassName.label)} data-item-label="">
        {children}
      </span>
      <ChevronDownIcon
        aria-hidden="true"
        className={cn(
          'primer:shrink-0 primer:group-data-[panel-open]:-scale-y-100',
          actionItemPartClassName.trailingVisual,
        )}
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
  const {triggerId} = React.useContext(SubNavContext)
  return (
    <Collapsible.Panel
      aria-labelledby={triggerId}
      {...props}
      ref={ref as React.Ref<HTMLDivElement>}
      render={<ul />}
      data-component="NavList.SubNav.Panel"
      className={cn('primer:m-0 primer:list-none primer:p-0', className)}
    >
      <NavListDepthContext.Provider value={depth + 1}>{children}</NavListDepthContext.Provider>
    </Collapsible.Panel>
  )
})

export const NavList = Object.assign(Root, {
  Heading: NavListHeading,
  Group,
  GroupExpand,
  GroupHeading: Object.assign(GroupHeading, {TrailingAction: ActionList.GroupHeading.TrailingAction}),
  List,
  Divider,
  Item,
  LeadingVisual,
  TrailingVisual,
  TrailingAction,
  Description,
  SubNav: Object.assign(SubNav, {Trigger: SubNavTrigger, Panel: SubNavPanel}),
})
Root.displayName = 'NavList'
