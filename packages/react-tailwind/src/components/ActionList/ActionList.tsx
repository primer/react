'use client'

import {AlertIcon, CheckIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {useItemGap} from '../../internal/listContainer'
import {isPartOf, regionElements, resolveRegions} from '../../internal/regions'
import type {RegionProps} from '../../utils/types'
import {Button, ButtonBase, type ButtonBaseProps, type ButtonProps} from '../Button'
import {IconButton} from '../IconButton'
import {LinkButton, type LinkButtonProps} from '../LinkButton'
import {Spinner} from '../Spinner'
import {getSelectionAttribute, getSelectionRole, type SelectionVariant} from './selectionUtils'

type ListContextValue = {
  groupLabelId?: string
  itemGap?: boolean
  role?: string
  selectionVariant?: SelectionVariant
  showDividers?: boolean
  variant?: 'inset' | 'horizontal-inset' | 'full'
}

const ListContext = React.createContext<ListContextValue>({})

const listClassName = 'm-0 list-none p-0 text-default'
const actionItemDividerClassName = cn(
  "relative before:absolute before:inset-x-0 before:-top-[7px] before:h-px before:bg-[var(--borderColor-muted)] before:content-['']",
  "[li:first-of-type>*>&]:before:invisible [[data-component='ActionList.Divider']+li>*>&]:before:invisible",
  '[[data-active]>&]:before:invisible [li:has(>[data-active])+li>*>&]:before:invisible',
  '[@media(hover:hover)]:[li:hover>*>&]:before:invisible [@media(hover:hover)]:[li:hover+li>*>&]:before:invisible',
)

export const actionItemClassName =
  'flex !min-w-0 w-full !justify-start gap-2 appearance-none rounded-md !border-0 bg-transparent px-2 py-1.5 text-left text-sm font-normal ![line-height:20px] whitespace-normal text-default no-underline !shadow-none hover:bg-neutral-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus data-[disabled]:cursor-not-allowed data-[disabled]:text-disabled items-start'

interface ActionListTrailingActionBaseProps {
  className?: string
  /** Icon component to render. */
  icon?: React.ElementType
  /** Accessible name for the action, since the icon alone conveys nothing. */
  label: string
  style?: React.CSSProperties
}

// The action always matches the item's density and stays invisible, so `size` and `variant` are not configurable.
type ActionListTrailingActionButtonProps = {
  /**
   * Renders the action as a button.
   * @default 'button'
   */
  as?: 'button'
  /** Not available on a button action. Use `as="a"` to make the action navigate. */
  href?: never
} & Omit<
  ButtonProps,
  | 'children'
  | 'className'
  | 'data-component'
  | 'leadingVisual'
  | 'notificationIndicator'
  | 'size'
  | 'style'
  | 'trailingAction'
  | 'trailingVisual'
  | 'variant'
>

type ActionListTrailingActionLinkProps = {
  /** Renders the action as a link. */
  as: 'a'
} & Omit<
  LinkButtonProps,
  'children' | 'className' | 'data-component' | 'leadingVisual' | 'size' | 'style' | 'trailingVisual' | 'variant'
>

export type ActionListTrailingActionProps = ActionListTrailingActionBaseProps &
  (ActionListTrailingActionButtonProps | ActionListTrailingActionLinkProps)

type TrailingActionSize = 'medium' | 'small'

function getTrailingActionClassName(hasIcon: boolean, size: TrailingActionSize, loading = false) {
  return cn(
    'relative inline-flex h-8 min-h-8 min-w-8 items-center justify-center rounded-md !border-0 bg-transparent px-2 text-sm !shadow-none hover:bg-neutral-muted hover:text-default focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus disabled:cursor-not-allowed',
    hasIcon ? 'text-muted' : '!px-[13px] text-default',
    // A loading text action keeps its width and moves the spinner to the end, where an icon action's spinner sits.
    !hasIcon &&
      loading &&
      "!pr-px !pl-[25px] [&_[data-component='buttonContent']>[data-component='leadingVisual']]:right-0 [&_[data-component='buttonContent']>[data-component='leadingVisual']]:left-auto [&_[data-component='buttonContent']>[data-component='leadingVisual']]:translate-x-0",
    size === 'small' && 'size-7 min-h-7 min-w-7 !border p-0',
  )
}

// While a trailing action loads, descriptions stay at full contrast so the item remains readable.
const trailingActionLoadingClassName = "[&_[data-component='ActionList.Description']]:text-default"

/** Whether a resolved trailing action is loading, so the item can keep its text at full contrast. */
function isTrailingActionLoading(trailingAction: React.ReactNode) {
  return React.isValidElement<{loading?: boolean}>(trailingAction) && Boolean(trailingAction.props.loading)
}

function renderTrailingAction(
  props: ActionListTrailingActionProps,
  ref: React.ForwardedRef<HTMLElement>,
  size: TrailingActionSize,
  dataComponent: string,
) {
  let action: React.ReactNode
  if (props.as === 'a') {
    const {as: actionType, className, icon: Icon, label, style, ...linkProps} = props
    void actionType
    void className
    void style
    action = (
      <LinkButton
        {...linkProps}
        ref={ref as React.Ref<HTMLAnchorElement>}
        aria-label={Icon ? label : linkProps['aria-label']}
        className={getTrailingActionClassName(Boolean(Icon), size)}
        data-component={`${dataComponent}.Button`}
        leadingVisual={Icon ? <Icon aria-hidden="true" /> : undefined}
        size={size}
        variant="invisible"
      >
        {Icon ? null : label}
      </LinkButton>
    )
  } else {
    const {as: actionType, className, icon: Icon, label, style, type = 'button', ...buttonProps} = props
    void actionType
    void className
    void style
    action = Icon ? (
      <IconButton
        {...buttonProps}
        ref={ref}
        type={type}
        aria-label={label}
        className={getTrailingActionClassName(true, size)}
        data-component={`${dataComponent}.Button`}
        icon={Icon}
        size={size}
        variant="invisible"
      />
    ) : (
      <Button
        {...buttonProps}
        ref={ref}
        type={type}
        className={getTrailingActionClassName(false, size, Boolean(buttonProps.loading))}
        data-component={`${dataComponent}.Button`}
        size={size}
        variant="invisible"
      >
        {label}
      </Button>
    )
  }
  return (
    <span
      className={cn(
        'ml-auto shrink-0',
        size === 'small' ? 'inline-flex items-center' : 'self-stretch',
        props.className,
      )}
      data-component={dataComponent}
      style={props.style}
    >
      {action}
    </span>
  )
}

const TrailingAction = React.forwardRef<HTMLElement, ActionListTrailingActionProps>(
  function ActionListTrailingAction(props, ref) {
    return renderTrailingAction(props, ref, 'medium', 'ActionList.TrailingAction')
  },
)

export interface ActionListRootProps extends React.ComponentPropsWithoutRef<'ul'>, RegionProps<'heading'> {
  /** Disable the gap between items when this list is rendered in a `NavList`. */
  disableItemGap?: boolean
  /** How many items may be selected, which also decides the list's ARIA role. */
  selectionVariant?: SelectionVariant
  /** Density and inset treatment of the list. */
  variant?: 'inset' | 'horizontal-inset' | 'full'
  /** Draws a divider between items. */
  showDividers?: boolean
}

const Root = React.forwardRef<HTMLUListElement, ActionListRootProps>(function ActionListRoot(
  {
    children,
    className,
    disableItemGap = false,
    heading: headingProp,
    role = 'list',
    selectionVariant,
    showDividers = false,
    variant = 'inset',
    ...rest
  },
  ref,
) {
  const listRole = role
  const itemGap = useItemGap(disableItemGap)
  const generatedHeadingId = React.useId()
  const {
    matched: {heading: matchedHeadings},
    rest: listChildren,
  } = resolveRegions(children, {heading: {match: isPartOf(Heading)}}, {heading: headingProp})
  const heading = regionElements<ActionListHeadingProps>(headingProp, matchedHeadings).at(0)
  const headingId = heading ? (heading.props.id ?? generatedHeadingId) : undefined
  const listRef = React.useRef<HTMLUListElement | null>(null)
  const setListRef = React.useCallback(
    (node: HTMLUListElement | null) => {
      listRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  React.useEffect(() => {
    const list = listRef.current
    if (!list) return
    const hasMixedDescriptions =
      list.querySelector('[data-has-description="true"]') !== null &&
      list.querySelector('[data-has-description="false"]') !== null
    list.toggleAttribute('data-mixed-descriptions', hasMixedDescriptions)
  })

  return (
    <ListContext.Provider value={{itemGap, role: listRole, selectionVariant, showDividers, variant}}>
      {heading ? React.cloneElement(heading, {id: headingId}) : null}
      <ul
        aria-labelledby={headingId}
        {...rest}
        ref={setListRef}
        role={role}
        className={cn(
          listClassName,
          variant === 'inset' && 'py-2',
          variant === 'horizontal-inset' && 'pb-2',
          'data-[mixed-descriptions]:[&_[data-item-label]]:font-normal',
          className,
        )}
        data-component="ActionList"
        data-variant={variant}
        data-dividers={showDividers || undefined}
        data-item-gap={itemGap || undefined}
      >
        {listChildren}
      </ul>
    </ListContext.Provider>
  )
})

export interface ActionListItemProps
  extends Omit<ButtonBaseProps, 'data-component' | 'children' | 'className' | 'disabled' | 'onSelect'>,
    RegionProps<'leadingVisual' | 'trailingVisual' | 'description' | 'trailingAction'> {
  children?: React.ReactNode
  className?: string
  /** Prevents activation and removes the item from the keyboard order. */
  disabled?: boolean
  /** Marks the item temporarily unavailable and explains why. Unlike `disabled`, the item stays reachable. */
  inactiveText?: React.ReactNode
  /** Shows a spinner in place of the leading visual, or the trailing visual when there is none, and suppresses activation. */
  loading?: boolean
  /** Text announced to assistive technology while the item is loading. */
  loadingText?: string
  /** Marks the item selected, reported through the role's selection attribute. */
  selected?: boolean
  /** Row height and label size. Use `small` for dense lists and `large` for a more comfortable touch target. */
  size?: 'small' | 'medium' | 'large'
  /** Highlights the item as the current one, without marking it selected. */
  active?: boolean
  /** Use `danger` for a destructive action. */
  variant?: 'default' | 'danger'
  /** Called when the item is activated by click or keyboard. */
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
}

function getItemParts(children: React.ReactNode) {
  const {
    regions: {leadingVisual, trailingVisual},
    matched: {description: descriptions},
    rest: label,
  } = resolveRegions(children, {
    leadingVisual: {match: isPartOf(LeadingVisual)},
    trailingVisual: {match: isPartOf(TrailingVisual)},
    description: {match: isPartOf(Description), multiple: true},
    trailingAction: {match: isPartOf(TrailingAction)},
  })
  const typedDescriptions = descriptions as React.ReactElement<ActionListDescriptionProps>[]
  const blockDescriptions = typedDescriptions.filter(description => description.props.variant === 'block')
  const inlineDescriptions = typedDescriptions.filter(description => description.props.variant !== 'block')

  return {
    blockDescriptions,
    descriptions: typedDescriptions,
    inlineDescriptions,
    label,
    leadingVisual,
    trailingVisual,
  }
}

/**
 * Resolves the regions every action item shares, letting an element prop replace the matched
 * child so a consumer's wrapper does not have to be recognizable by identity.
 */
function resolveItemRegions(
  children: React.ReactNode,
  overrides: RegionProps<'leadingVisual' | 'trailingVisual' | 'description' | 'trailingAction'>,
) {
  const {
    regions: {leadingVisual, trailingVisual, description, trailingAction},
    rest: label,
  } = resolveRegions(
    children,
    {
      leadingVisual: {match: isPartOf(LeadingVisual)},
      trailingVisual: {match: isPartOf(TrailingVisual)},
      description: {match: isPartOf(Description), multiple: true},
      trailingAction: {match: isPartOf(TrailingAction)},
    },
    overrides,
  )
  const itemChildren = (
    <>
      {leadingVisual}
      {label}
      {description}
      {trailingVisual}
    </>
  )
  return {itemChildren, hasDescription: description !== undefined && description !== null, trailingAction}
}

export function ActionItemContent({
  children,
  description,
  descriptionVariant,
  dividerClassName = actionItemDividerClassName,
  indicator,
  leadingVisual,
  selection,
  showDivider,
  size = 'medium',
  supportingText,
  trailingVisual,
}: {
  children: React.ReactNode
  description?: React.ReactNode
  descriptionVariant?: ActionListDescriptionProps['variant']
  /** Draws the divider for this item's structure. Defaults to the divider for items rendered in list items. */
  dividerClassName?: string
  indicator?: React.ReactNode
  leadingVisual?: React.ReactNode
  selection?: React.ReactNode
  showDivider?: boolean
  size?: 'small' | 'medium' | 'large'
  supportingText?: React.ReactNode
  trailingVisual?: React.ReactNode
}) {
  const composedChildren = [
    leadingVisual ? React.createElement(LeadingVisual, {key: 'leading-visual'}, leadingVisual) : null,
    children,
    description
      ? React.createElement(Description, {key: 'description', variant: descriptionVariant}, description)
      : null,
    trailingVisual ? React.createElement(TrailingVisual, {key: 'trailing-visual'}, trailingVisual) : null,
  ]
  const {
    blockDescriptions,
    descriptions,
    inlineDescriptions,
    label,
    leadingVisual: resolvedLeadingVisual,
    trailingVisual: resolvedTrailingVisual,
  } = getItemParts(composedChildren)
  const hasBlockDescription = blockDescriptions.length > 0
  // A loading or inactive indicator replaces the leading visual when there is one and the trailing
  // visual otherwise, as upstream does, so the label keeps its alignment.
  const renderedLeadingVisual =
    indicator && resolvedLeadingVisual ? <LeadingVisual>{indicator}</LeadingVisual> : resolvedLeadingVisual
  const renderedTrailingVisual =
    indicator && !resolvedLeadingVisual ? <TrailingVisual>{indicator}</TrailingVisual> : resolvedTrailingVisual

  return (
    <>
      {selection ? (
        <span
          className="flex min-h-5 min-w-max shrink-0 items-center leading-5 text-muted"
          data-component="ActionList.Selection"
        >
          {selection}
        </span>
      ) : null}
      {renderedLeadingVisual}
      <span
        className={cn(
          'flex min-w-0 flex-1 items-start',
          supportingText ? 'flex-wrap gap-x-2 gap-y-0' : 'gap-2',
          showDivider && dividerClassName,
          // Upstream paints the divider a second time for items with inline descriptions.
          showDivider && inlineDescriptions.length > 0 && 'before:shadow-[inset_0_1px_var(--borderColor-muted)]',
        )}
        data-component="ActionList.Item--DividerContainer"
      >
        <span
          className={cn(
            'flex min-w-0 flex-1 gap-1',
            supportingText && 'basis-full',
            hasBlockDescription ? 'flex-col' : 'flex-row items-baseline gap-2',
          )}
          data-description-variant={hasBlockDescription ? 'block' : 'inline'}
        >
          <span className={cn('flex min-w-0 items-baseline', inlineDescriptions.length > 0 && 'gap-2')}>
            <span
              className={cn(
                'relative wrap-break-word',
                size === 'small' ? 'text-xs' : 'text-sm leading-5',
                descriptions.length === 0 && 'min-w-0 flex-1',
                descriptions.length > 0 && 'font-semibold',
              )}
              data-component="ActionList.Item.Label"
              data-item-label=""
            >
              {label}
            </span>
            {inlineDescriptions}
          </span>
          {blockDescriptions}
        </span>
        {renderedTrailingVisual}
        {supportingText ? <span className="basis-full text-xs leading-4 text-attention">{supportingText}</span> : null}
      </span>
    </>
  )
}

type ActionItemElementProps = Pick<ActionListItemProps, 'children' | 'description' | 'leadingVisual' | 'trailingVisual'>

/**
 * Renders an `ActionList.Item` element returned from a `renderItem` escape hatch as the content of a
 * list option. Its regions resolve as `ActionList.Item` resolves them, so the option keeps its
 * selection indicator, divider, and label layout.
 */
export function ActionItemElementContent({
  item,
  ...contentProps
}: Omit<
  React.ComponentProps<typeof ActionItemContent>,
  'children' | 'description' | 'descriptionVariant' | 'leadingVisual' | 'trailingVisual'
> & {item: ActionItemElementProps}) {
  const {children, description, leadingVisual, trailingVisual} = item
  const {itemChildren} = resolveItemRegions(children, {description, leadingVisual, trailingVisual})
  return <ActionItemContent {...contentProps}>{itemChildren}</ActionItemContent>
}

const Item = React.forwardRef<HTMLElement, ActionListItemProps>(function ActionListItem(
  {
    active,
    children,
    className,
    description: descriptionProp,
    disabled,
    inactiveText,
    leadingVisual: leadingVisualProp,
    loading = false,
    loadingText,
    onClick,
    onSelect: onSelectItem,
    role: roleProp,
    selected,
    size = 'medium',
    trailingAction: trailingActionProp,
    trailingVisual: trailingVisualProp,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const {itemGap, role: listRole, selectionVariant, showDividers, variant: listVariant} = React.useContext(ListContext)
  const role = roleProp ?? getSelectionRole(listRole, selectionVariant)
  const selectionAttribute = getSelectionAttribute(role)
  const {
    itemChildren,
    hasDescription,
    trailingAction: resolvedTrailingAction,
  } = resolveItemRegions(children, {
    leadingVisual: leadingVisualProp,
    trailingVisual: trailingVisualProp,
    description: descriptionProp,
    trailingAction: trailingActionProp,
  })
  const renderedTrailingAction = !inactiveText && !loading ? resolvedTrailingAction : null
  const trailingActionLoading = !disabled && isTrailingActionLoading(renderedTrailingAction)
  const showInactiveWarning = Boolean(inactiveText && (listRole === 'menu' || listRole === 'listbox'))
  const selection =
    selectionVariant === 'multiple' && listRole !== 'menu' ? (
      <span
        aria-hidden="true"
        className={cn(
          'grid size-4 shrink-0 place-items-center rounded-sm border border-[var(--control-borderColor-emphasis)] bg-default',
          selected &&
            'border-[var(--control-checked-bgColor-rest)] bg-[var(--control-checked-bgColor-rest)] text-on-emphasis',
        )}
      >
        <CheckIcon className={cn('size-3', !selected && 'invisible')} />
      </span>
    ) : selectionVariant ? (
      <CheckIcon aria-hidden="true" className={cn('shrink-0', !selected && 'invisible')} />
    ) : null
  const statusIndicator =
    inactiveText && !showInactiveWarning ? (
      <AlertIcon aria-hidden="true" className="size-4 shrink-0 text-muted" />
    ) : loading ? (
      <Spinner aria-hidden="true" className="shrink-0" size="small" srText={null} />
    ) : null

  return (
    <li
      role={listRole === 'menu' || listRole === 'listbox' ? 'none' : undefined}
      data-component="ActionList.Item"
      data-trailing-action-loading={trailingActionLoading || undefined}
      className={cn(
        'relative list-none rounded-md',
        listVariant !== 'full' && 'mx-2',
        itemGap && "[[data-component$='Item']+&]:mt-0.5",
        renderedTrailingAction && 'flex items-center',
        trailingActionLoading && trailingActionLoadingClassName,
      )}
    >
      <ButtonBase
        {...rest}
        ref={ref}
        role={role}
        disabled={disabled}
        aria-disabled={inactiveText || loading ? true : undefined}
        title={typeof inactiveText === 'string' ? inactiveText : undefined}
        aria-selected={selectionAttribute === 'aria-selected' ? selected : undefined}
        aria-checked={selectionAttribute === 'aria-checked' ? selected : undefined}
        onClick={event => {
          onClick?.(event)
          if (!event.defaultPrevented && !inactiveText && !loading) onSelectItem?.(event)
        }}
        className={cn(
          actionItemClassName,
          size === 'small' && 'py-1',
          size === 'large' && 'py-2.5',
          renderedTrailingAction && 'min-w-0 flex-1',
          variant === 'danger' && 'text-danger hover:bg-[var(--control-danger-bgColor-hover)]',
          inactiveText && 'text-muted',
          active && 'bg-[var(--control-transparent-bgColor-selected)]',
          className,
        )}
        data-component="ActionList.Item.Action"
        data-active={active || undefined}
        data-has-description={hasDescription}
        data-selected={selected || undefined}
        data-size={size}
        data-variant={variant === 'danger' ? variant : undefined}
      >
        <ActionItemContent
          indicator={statusIndicator}
          selection={selection}
          showDivider={showDividers}
          size={size}
          supportingText={showInactiveWarning ? inactiveText : null}
        >
          {itemChildren}
        </ActionItemContent>
        {inactiveText && !showInactiveWarning ? <span className="sr-only">{inactiveText}</span> : null}
        {loading && loadingText ? <span className="sr-only">{loadingText}</span> : null}
      </ButtonBase>
      {renderedTrailingAction}
    </li>
  )
})

export interface ActionListLinkItemProps
  extends React.ComponentPropsWithoutRef<'a'>,
    RegionProps<'leadingVisual' | 'trailingVisual' | 'description' | 'trailingAction'> {
  /** Highlights the link as the current one. */
  active?: boolean
  /** Marks the link temporarily unavailable and explains why. The link renders as text until it is available. */
  inactiveText?: React.ReactNode
  /** Marks the link as the current one. */
  selected?: boolean
  /** Row height and label size. Use `small` for dense lists and `large` for a more comfortable touch target. */
  size?: 'small' | 'medium' | 'large'
  /** Use `danger` for a destructive navigation. */
  variant?: 'default' | 'danger'
}

const LinkItem = React.forwardRef<HTMLAnchorElement, ActionListLinkItemProps>(function ActionListLinkItem(
  {
    active,
    children,
    className,
    description: descriptionProp,
    href,
    inactiveText,
    leadingVisual: leadingVisualProp,
    selected,
    size = 'medium',
    trailingAction: trailingActionProp,
    trailingVisual: trailingVisualProp,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const context = React.useContext(ListContext)
  const {showDividers} = context
  const {itemChildren, hasDescription, trailingAction} = resolveItemRegions(children, {
    leadingVisual: leadingVisualProp,
    trailingVisual: trailingVisualProp,
    description: descriptionProp,
    trailingAction: trailingActionProp,
  })

  const renderedTrailingAction = inactiveText ? null : trailingAction
  const trailingActionLoading = isTrailingActionLoading(renderedTrailingAction)
  const LinkElement = inactiveText ? 'span' : 'a'

  return (
    <li
      data-component="ActionList.LinkItem"
      data-trailing-action-loading={trailingActionLoading || undefined}
      className={cn(
        'relative list-none rounded-md',
        context.variant !== 'full' && 'mx-2',
        context.itemGap && "[[data-component$='Item']+&]:mt-0.5",
        renderedTrailingAction && 'flex items-center',
        trailingActionLoading && trailingActionLoadingClassName,
      )}
    >
      <LinkElement
        {...rest}
        ref={ref}
        href={inactiveText ? undefined : href}
        aria-disabled={inactiveText ? true : undefined}
        className={cn(
          actionItemClassName,
          size === 'small' && 'py-1',
          size === 'large' && 'py-2.5',
          renderedTrailingAction && 'min-w-0 flex-1',
          variant === 'danger' && 'text-danger hover:bg-[var(--control-danger-bgColor-hover)]',
          selected && 'bg-accent-muted',
          active && 'bg-[var(--control-transparent-bgColor-selected)]',
          inactiveText && 'cursor-not-allowed text-muted hover:bg-transparent',
          className,
        )}
        data-active={active || undefined}
        data-has-description={hasDescription}
        data-inactive={inactiveText ? true : undefined}
        data-selected={selected || undefined}
        data-size={size}
      >
        <ActionItemContent
          indicator={inactiveText ? <AlertIcon aria-hidden="true" className="size-4 shrink-0 text-muted" /> : undefined}
          showDivider={showDividers}
          size={size}
        >
          {itemChildren}
        </ActionItemContent>
        {inactiveText ? <span className="sr-only">{inactiveText}</span> : null}
      </LinkElement>
      {renderedTrailingAction}
    </li>
  )
})

export interface ActionListGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'li'>, 'title'>,
    RegionProps<'heading'> {
  /** Heading text for the group, as an alternative to supplying a heading child. */
  title?: React.ReactNode
  /** Overrides the list's selection behaviour for this group. */
  selectionVariant?: SelectionVariant
}

const Group = React.forwardRef<HTMLLIElement, ActionListGroupProps>(function ActionListGroup(
  {children, className, heading: headingProp, selectionVariant, title, ...rest},
  ref,
) {
  const context = React.useContext(ListContext)
  const generatedGroupLabelId = React.useId()
  const {
    matched: {heading: matchedHeadings},
    rest: listChildren,
  } = resolveRegions(children, {heading: {match: isPartOf(GroupHeading), multiple: true}})
  const headingChildren = regionElements<ActionListGroupHeadingProps>(headingProp, matchedHeadings)
  const groupLabelId = title
    ? generatedGroupLabelId
    : (headingChildren[0]?.props.id ?? (headingChildren.length > 0 ? generatedGroupLabelId : undefined))
  return (
    <li
      {...rest}
      ref={ref}
      role={context.role === 'menu' || context.role === 'listbox' ? 'none' : rest.role}
      className={cn('not-first:mt-2', className)}
      data-component="ActionList.Group"
    >
      <ListContext.Provider
        value={{...context, groupLabelId, selectionVariant: selectionVariant ?? context.selectionVariant}}
      >
        {title ? <GroupHeading id={groupLabelId}>{title}</GroupHeading> : null}
        {headingChildren.map((heading, index) =>
          React.cloneElement(heading, {
            id:
              heading.props.id ?? (!title && index === 0 ? groupLabelId : `${generatedGroupLabelId}-heading-${index}`),
          }),
        )}
        <ul
          className="m-0 list-none p-0"
          aria-labelledby={groupLabelId}
          role={context.role === 'menu' || context.role === 'listbox' ? 'group' : undefined}
        >
          {listChildren}
        </ul>
      </ListContext.Provider>
    </li>
  )
})

export interface ActionListGroupHeadingProps
  extends React.ComponentPropsWithoutRef<'h3'>,
    RegionProps<'trailingAction'> {
  /** Heading element to render, so the group heading fits the surrounding document outline. */
  as?: React.ElementType
  /** Use `filled` to give the heading a background and separate it from the items above. */
  variant?: 'subtle' | 'filled'
}

const groupHeadingWrapperClassName =
  'flex min-h-[30px] items-center gap-2 px-4 py-1.5 text-xs leading-[18px] font-semibold text-muted'

const GroupHeading = React.forwardRef<HTMLElement, ActionListGroupHeadingProps>(function ActionListGroupHeading(
  {as: Component = 'h3', children, className, id, trailingAction: trailingActionProp, variant = 'subtle', ...rest},
  ref,
) {
  const {groupLabelId, role} = React.useContext(ListContext)
  const {
    regions: {trailingAction},
    rest: headingChildren,
  } = resolveRegions(
    children,
    {trailingAction: {match: isPartOf(GroupHeadingTrailingAction)}},
    {trailingAction: trailingActionProp},
  )
  return (
    <div
      className={cn(groupHeadingWrapperClassName, variant === 'filled' && 'mb-2 border-y border-muted bg-muted')}
      data-component="ActionList.GroupHeading"
      data-variant={variant}
    >
      <Component
        {...rest}
        ref={ref}
        id={id ?? groupLabelId}
        role={role === 'menu' || role === 'listbox' ? 'presentation' : undefined}
        className={cn('m-0 text-xs leading-[18px] font-semibold text-muted', className)}
      >
        {headingChildren}
      </Component>
      {trailingAction}
    </div>
  )
})

export type ActionListGroupHeadingTrailingActionProps = ActionListTrailingActionProps & {
  /** Icon rendered inside the heading's trailing action. */
  icon: React.ElementType
}

const GroupHeadingTrailingAction = React.forwardRef<HTMLElement, ActionListGroupHeadingTrailingActionProps>(
  function ActionListGroupHeadingTrailingAction(props, ref) {
    return renderTrailingAction(props, ref, 'small', 'ActionList.GroupHeading.TrailingAction')
  },
)

/** Full-width rule between list items or groups, shared with menu separators. */
export const actionListDividerClassName =
  'mt-[7px] mb-2 block h-px list-none border-0 bg-[var(--borderColor-muted)] p-0 first:hidden'

const Divider = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  function ActionListDivider(props, ref) {
    return (
      <li
        {...props}
        ref={ref}
        role="separator"
        className={cn(actionListDividerClassName, props.className)}
        data-component="ActionList.Divider"
      />
    )
  },
)

const LeadingVisual = ({className, ...props}: React.ComponentPropsWithoutRef<'span'>) => (
  <span
    {...props}
    className={cn('flex min-h-5 min-w-max shrink-0 items-center leading-5 text-muted', className)}
    data-component="ActionList.LeadingVisual"
  />
)
const TrailingVisual = ({className, ...props}: React.ComponentPropsWithoutRef<'span'>) => (
  <span
    {...props}
    className={cn('ml-auto flex min-h-5 min-w-max shrink-0 items-center text-sm leading-5 text-muted', className)}
    data-component="ActionList.TrailingVisual"
  />
)
export interface ActionListDescriptionProps extends React.ComponentPropsWithoutRef<'span'> {
  /** Clips the description to one line instead of wrapping. */
  truncate?: boolean
  /** Whether the description sits beside the label or on its own line. */
  variant?: 'block' | 'inline'
}
const Description = ({className, truncate, variant = 'inline', ...props}: ActionListDescriptionProps) => (
  <span
    {...props}
    className={cn(
      'text-xs text-muted',
      'leading-4',
      variant === 'block' && 'block w-full basis-full',
      truncate && 'overflow-hidden text-ellipsis whitespace-nowrap',
      className,
    )}
    data-component="ActionList.Description"
  />
)
export interface ActionListHeadingProps extends React.ComponentPropsWithoutRef<'h2'> {
  /** Heading element to render, so the list heading fits the surrounding document outline. */
  as?: React.ElementType
  /** Title size of the heading. Omit it to keep the default large heading font size. */
  size?: 'small' | 'medium' | 'large'
  /** Hides the heading visually while it still names the list for assistive technology. */
  visuallyHidden?: boolean
}
const headingSizeClassName = {
  small: 'font-display text-title-small',
  medium: 'font-display text-title-medium',
  large: 'font-display text-title-large',
} as const
const Heading = ({
  as: Component = 'h2',
  children,
  className,
  size,
  visuallyHidden = false,
  ...props
}: ActionListHeadingProps) => {
  const {variant} = React.useContext(ListContext)
  return (
    <Component
      {...props}
      className={cn(
        'm-0 mb-2 text-[length:var(--text-title-size-large)] font-semibold',
        size && headingSizeClassName[size],
        variant === 'full' ? 'ms-2' : 'ms-4',
        visuallyHidden && 'sr-only',
        className,
      )}
      data-component="ActionList.Heading"
      data-list-variant={variant}
    >
      {children}
    </Component>
  )
}

export const ActionList = Object.assign(Root, {
  Root,
  Item,
  LinkItem,
  Group,
  GroupHeading: Object.assign(GroupHeading, {TrailingAction: GroupHeadingTrailingAction}),
  Divider,
  LeadingVisual,
  TrailingVisual,
  Description,
  Heading,
  TrailingAction,
})

ActionList.displayName = 'ActionList'
