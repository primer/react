'use client'

import {useRender} from '@base-ui/react/use-render'
import type {ComponentRenderFn, HTMLProps} from '@base-ui/react/types'
import {AlertIcon} from '@primer/octicons-react'
import React from 'react'
import {flattenChildren} from '../../internal/children'
import {cn} from '../../internal/cn'
import {getDisabledActivationHandlers, guardDisabledRender} from '../../internal/disabledActivation'
import {renderIcon} from '../../internal/icon'
import {joinIdRefs} from '../../internal/idRefs'
import {useItemGap} from '../../internal/listContainer'
import {mergeRefs} from '../../internal/refs'
import {isPartOf, regionElements, resolveRegions} from '../../internal/regions'
import {SelectionVisual} from '../../internal/selectionVisuals'
import {useFocusZone} from '../../internal/useFocusZone'
import type {RegionProps} from '../../utils/types'
import {Button, ButtonBase, type ButtonBaseProps, type ButtonProps} from '../Button'
import {IconButton} from '../IconButton'
import {getIconButtonClassName} from '../IconButton/iconButtonClassName'
import {LinkButton, type LinkButtonProps} from '../LinkButton'
import {Spinner} from '../Spinner'
import {Tooltip} from '../Tooltip/Tooltip'
import {tooltipDirectionPlacement, type TooltipDirection} from '../Tooltip/direction'
import {
  actionItemClassName,
  actionItemPartClassName,
  getActionItemStateAttributes,
  getActionItemStateClassName,
  staticActionItemClassName,
} from './itemState'
import {getSelectionAttribute, getSelectionRole, type SelectionVariant} from './selectionUtils'

type ListContextValue = {
  groupLabelId?: string
  itemGap?: boolean
  listboxComposition?: boolean
  role?: string
  selectionVariant?: SelectionVariant | false
  showDividers?: boolean
  variant?: 'inset' | 'horizontal-inset' | 'full'
}

const ListContext = React.createContext<ListContextValue>({})
const GroupHeadingContext = React.createContext<{auxiliaryText?: string; labelId?: string}>({})
const DirectTreeItemContext = React.createContext(false)

const listClassName = 'primer:m-0 primer:list-none primer:p-0 primer:text-default'
const actionItemDividerClassName = cn(
  "primer:relative primer:before:absolute primer:before:inset-x-0 primer:before:-top-[7px] primer:before:h-px primer:before:bg-[var(--borderColor-muted)] primer:before:content-['']",
  "primer:[li:first-of-type>*>&]:before:invisible primer:[[data-component='ActionList.Divider']+li>*>&]:before:invisible",
  'primer:[[data-active]>&]:before:invisible primer:[li:has(>[data-active])+li>*>&]:before:invisible',
  'primer:[:focus-visible>&]:before:invisible primer:[li:has(>:focus-visible)+li>*>&]:before:invisible',
  'primer:[@media(hover:hover)]:[li:hover>*>&]:before:invisible primer:[@media(hover:hover)]:[li:hover+li>*>&]:before:invisible',
)
const directItemDividerClassName = cn(
  "primer:relative primer:before:absolute primer:before:inset-x-0 primer:before:-top-[7px] primer:before:h-px primer:before:bg-[var(--borderColor-muted)] primer:before:content-['']",
  'primer:[:first-child>&]:before:invisible primer:[[data-list-divider]+*>&]:before:invisible primer:[[data-group-heading]+*>&]:before:invisible',
  'primer:[[data-active]>&]:before:invisible primer:[[data-active]+*>&]:before:invisible',
  'primer:[:focus-visible>&]:before:invisible primer:[:focus-visible+*>&]:before:invisible',
  'primer:[@media(hover:hover)]:[:hover>&]:before:invisible primer:[@media(hover:hover)]:[:hover+*>&]:before:invisible',
)

interface ActionListTrailingActionBaseProps {
  className?: string
  /** Icon component to render. */
  icon?: React.ElementType
  /** Accessible name for the action, since the icon alone conveys nothing. */
  label: string
  style?: React.CSSProperties
  /**
   * Side and alignment of the tooltip that shows `label` for an icon action.
   * @default 'w'
   */
  tooltipDirection?: TooltipDirection
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
    'primer:relative primer:inline-flex primer:h-8 primer:min-h-8 primer:min-w-8 primer:items-center primer:justify-center primer:rounded-md primer:!border-0 primer:px-2 primer:text-sm primer:!shadow-none primer:focus-visible:outline-2 primer:focus-visible:outline-offset-[-2px] primer:focus-visible:outline-focus primer:disabled:cursor-not-allowed',
    !hasIcon && 'primer:!px-[13px]',
    // A loading text action keeps its width and moves the spinner to the end, where an icon action's spinner sits.
    !hasIcon &&
      loading &&
      "primer:!pr-px primer:!pl-[25px] primer:[&_[data-component='buttonContent']>[data-component='leadingVisual']]:right-0 primer:[&_[data-component='buttonContent']>[data-component='leadingVisual']]:left-auto primer:[&_[data-component='buttonContent']>[data-component='leadingVisual']]:translate-x-0",
    size === 'small' && 'primer:size-7 primer:min-h-7 primer:min-w-7 primer:!border primer:p-0',
  )
}

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
    const {as: actionType, className, icon: Icon, label, style, tooltipDirection = 'w', ...linkProps} = props
    void actionType
    void className
    void style
    if (Icon) {
      // Matches an invisible `IconButton`, which cannot render a link because a Base UI button adds `role="button"`.
      const placement = tooltipDirectionPlacement[tooltipDirection]
      // Render-element props override the trigger's, so `id` and ARIA references go through the trigger.
      const {'aria-describedby': describedBy, 'aria-labelledby': labelledBy, id, ...iconLinkProps} = linkProps
      action = (
        <Tooltip.Root type="label">
          <Tooltip.Trigger
            ref={ref}
            id={id}
            aria-describedby={describedBy}
            aria-labelledby={labelledBy}
            render={
              <LinkButton
                {...iconLinkProps}
                aria-label={label}
                className={cn(
                  getIconButtonClassName({inactive: iconLinkProps.inactive, size, variant: 'invisible'}),
                  getTrailingActionClassName(true, size),
                )}
                data-component={`${dataComponent}.Button`}
                size={size}
                variant="invisible"
              >
                {renderIcon(Icon, 'primer:block')}
              </LinkButton>
            }
          />
          <Tooltip.Content align={placement.align} side={placement.side}>
            {label}
          </Tooltip.Content>
        </Tooltip.Root>
      )
    } else {
      action = (
        <LinkButton
          {...linkProps}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={getTrailingActionClassName(false, size)}
          data-component={`${dataComponent}.Button`}
          size={size}
          variant="invisible"
        >
          {label}
        </LinkButton>
      )
    }
  } else {
    const {
      as: actionType,
      className,
      icon: Icon,
      label,
      style,
      tooltipDirection = 'w',
      type = 'button',
      ...buttonProps
    } = props
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
        tooltipDirection={tooltipDirection}
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
        'primer:ms-auto primer:shrink-0',
        size === 'small' ? 'primer:inline-flex primer:items-center' : 'primer:self-stretch',
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

const focusZoneRoles = new Set(['menu', 'menubar', 'listbox'])

interface ActionListSharedRootProps extends RegionProps<'heading'> {
  /**
   * Keeps every item in the tab order. Otherwise a `menu`, `menubar`, or `listbox` list keeps only one item in the
   * tab order and moves focus between items with the arrow, Home, End, Page Up, and Page Down keys.
   * @default false
   */
  disableFocusZone?: boolean
  /** Disable the gap between items when this list is rendered in a `NavList`. */
  disableItemGap?: boolean
  /** How many items may be selected, which also decides the list's ARIA role. */
  selectionVariant?: SelectionVariant
  /** Density and inset treatment of the list. */
  variant?: 'inset' | 'horizontal-inset' | 'full'
  /** Draws a divider between items. */
  showDividers?: boolean
}

export interface ActionListRootProps extends React.ComponentPropsWithoutRef<'ul'>, ActionListSharedRootProps {}

export interface ActionListListboxProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'role'>,
    ActionListSharedRootProps {}

interface ActionListRootImplementationProps extends React.HTMLAttributes<HTMLElement>, ActionListSharedRootProps {
  element: 'ul' | 'div'
  forwardedRef: React.Ref<HTMLElement>
}

function ActionListRootImplementation({
  children,
  className,
  disableFocusZone = false,
  disableItemGap = false,
  element: Element,
  forwardedRef,
  heading: headingProp,
  role = 'list',
  selectionVariant,
  showDividers = false,
  variant = 'inset',
  ...rest
}: ActionListRootImplementationProps) {
  const listRole = role
  const listboxComposition = Element === 'div'
  const itemGap = useItemGap(disableItemGap)
  const generatedHeadingId = React.useId()
  const {
    matched: {heading: matchedHeadings},
    rest: listChildren,
  } = resolveRegions(children, {heading: {match: isPartOf(Heading)}}, {heading: headingProp})
  const heading = regionElements<ActionListHeadingProps>(headingProp, matchedHeadings).at(0)
  const headingId = heading ? (heading.props.id ?? generatedHeadingId) : undefined
  const listRef = React.useRef<HTMLElement | null>(null)
  const focusZoneRef = useFocusZone<HTMLElement>({
    bindKeys: ['ArrowVertical', 'HomeAndEnd', 'PageUpDown'],
    disabled: disableFocusZone || !focusZoneRoles.has(role),
    focusOutBehavior: role === 'menu' ? 'wrap' : 'stop',
  })
  const setListRef = React.useMemo(() => mergeRefs(listRef, forwardedRef, focusZoneRef), [forwardedRef, focusZoneRef])

  React.useEffect(() => {
    const list = listRef.current
    if (!list) return
    const hasMixedDescriptions =
      list.querySelector('[data-has-description="true"]') !== null &&
      list.querySelector('[data-has-description="false"]') !== null
    list.toggleAttribute('data-mixed-descriptions', hasMixedDescriptions)
  })

  return (
    <ListContext.Provider
      value={{itemGap, listboxComposition, role: listRole, selectionVariant, showDividers, variant}}
    >
      {heading ? React.cloneElement(heading, {id: headingId}) : null}
      <Element
        aria-labelledby={headingId}
        {...rest}
        ref={setListRef}
        role={role}
        className={cn(
          listClassName,
          variant === 'inset' && 'primer:py-2',
          variant === 'horizontal-inset' && 'primer:pb-2',
          'primer:data-[mixed-descriptions]:[&_[data-item-label]]:font-normal',
          className,
        )}
        data-component={listboxComposition ? 'ActionList.Listbox' : 'ActionList'}
        data-variant={variant}
        data-dividers={showDividers || undefined}
        data-item-gap={itemGap || undefined}
      >
        {listChildren}
      </Element>
    </ListContext.Provider>
  )
}

const Root = React.forwardRef<HTMLUListElement, ActionListRootProps>(function ActionListRoot(props, ref) {
  return <ActionListRootImplementation {...props} element="ul" forwardedRef={ref} />
})

const ListboxRoot = React.forwardRef<HTMLDivElement, ActionListListboxProps>(function ActionListListbox(props, ref) {
  return (
    <ActionListRootImplementation
      {...props}
      aria-multiselectable={props['aria-multiselectable'] ?? (props.selectionVariant === 'multiple' ? true : undefined)}
      element="div"
      forwardedRef={ref}
      role="listbox"
    />
  )
})

export interface ActionListItemProps
  extends Omit<ButtonBaseProps, 'data-component' | 'children' | 'className' | 'disabled' | 'onSelect'>,
    RegionProps<'leadingVisual' | 'trailingVisual' | 'description' | 'trailingAction'> {
  children?: React.ReactNode
  className?: string
  /**
   * Prevents activation. In a plain list the item also leaves the keyboard order; in a menu, menubar, listbox, or
   * tree it stays focusable and is marked `aria-disabled`, so keyboard users can still discover it.
   */
  disabled?: boolean
  /** Marks the item temporarily unavailable and displays why. Unlike `disabled`, the item stays reachable. */
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

export interface ActionListStaticItemProps
  extends Omit<
      React.ComponentPropsWithoutRef<'li'>,
      'aria-checked' | 'aria-disabled' | 'aria-selected' | 'onClick' | 'onSelect' | 'role' | 'type'
    >,
    Pick<
      ActionListItemProps,
      | 'active'
      | 'description'
      | 'inactiveText'
      | 'leadingVisual'
      | 'size'
      | 'trailingAction'
      | 'trailingVisual'
      | 'variant'
    > {
  /** Renders a static item in an ordinary list rather than an interactive action. */
  role: 'listitem'
  /** Checked state is not supported on a static list item. */
  'aria-checked'?: never
  /** Disabled state is not supported; use `inactiveText` only when a meaningful reason is available. */
  'aria-disabled'?: never
  /** Selected state is not supported on a static list item. */
  'aria-selected'?: never
  /** Static list items cannot be disabled. */
  disabled?: false
  /** Static list items do not manage disabled focus behavior. */
  focusableWhenDisabled?: never
  /** Loading state is not supported on a static list item. */
  loading?: false
  /** Static list items do not announce a loading state. */
  loadingText?: never
  /** Static list items are not buttons. */
  nativeButton?: never
  /** The static item itself cannot have an activation handler. */
  onClick?: never
  /** Selection handlers are not supported on a static list item. */
  onSelect?: never
  /** The static `li` root cannot be replaced through `render`. */
  render?: never
  /** Selection is not supported on a static list item. */
  selected?: never
  /** Button types are not supported on a static list item. */
  type?: never
}

type ActionListItemComponent = <Role extends React.AriaRole | undefined = undefined>(
  props: {role?: Role} & (Role extends 'listitem' ? ActionListStaticItemProps : ActionListItemProps) &
    React.RefAttributes<HTMLElement>,
) => React.ReactElement | null

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
    matched: {description: matchedDescriptions},
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
  const descriptions =
    overrides.description == null
      ? (matchedDescriptions as React.ReactElement<ActionListDescriptionProps>[])
      : flattenChildren(overrides.description).map((child, index) =>
          React.isValidElement<ActionListDescriptionProps>(child) ? (
            child
          ) : (
            <Description key={index}>{child}</Description>
          ),
        )
  return {
    itemChildren,
    parts: {descriptions, label, leadingVisual, trailingVisual},
    hasDescription: description !== undefined && description !== null,
    trailingAction,
  }
}

interface ActionItemContentRegions {
  children?: React.ReactNode
  description?: React.ReactNode
  descriptionVariant?: ActionListDescriptionProps['variant']
  leadingVisual?: React.ReactNode
  trailingVisual?: React.ReactNode
}

function resolveActionItemContent(
  {children, description, descriptionVariant, leadingVisual, trailingVisual}: ActionItemContentRegions,
  accessibilityId?: string,
) {
  const composedChildren = [
    leadingVisual ? React.createElement(LeadingVisual, {key: 'leading-visual'}, leadingVisual) : null,
    children,
    description
      ? React.createElement(Description, {key: 'description', variant: descriptionVariant}, description)
      : null,
    trailingVisual ? React.createElement(TrailingVisual, {key: 'trailing-visual'}, trailingVisual) : null,
  ]
  return resolveActionItemParts(getItemParts(composedChildren), accessibilityId)
}

interface ActionItemParts {
  descriptions: React.ReactElement<ActionListDescriptionProps>[]
  label: React.ReactNode
  leadingVisual?: React.ReactNode
  trailingVisual?: React.ReactNode
}

function resolveActionItemParts(parts: ActionItemParts, accessibilityId?: string) {
  const descriptions = accessibilityId
    ? parts.descriptions.map((item, index) => {
        const generatedId = `${accessibilityId}-description-${index}`
        if (item.type === Description || typeof item.type === 'string') {
          return React.cloneElement(item, {id: item.props.id ?? generatedId})
        }
        return (
          <span
            key={item.key ?? index}
            id={generatedId}
            className={cn(
              'primer:min-w-0 primer:max-w-full primer:text-xs primer:leading-4',
              item.props.variant === 'block' && 'primer:block primer:w-full primer:basis-full',
              item.props.truncate && 'primer:overflow-hidden primer:text-ellipsis primer:whitespace-nowrap',
            )}
          >
            {item}
          </span>
        )
      })
    : parts.descriptions

  return {
    ...parts,
    blockDescriptions: descriptions.filter((_, index) => parts.descriptions[index].props.variant === 'block'),
    descriptionAliases: accessibilityId
      ? parts.descriptions.flatMap((item, index) => {
          const renderedId = descriptions[index].props.id
          return item.props.id && renderedId && item.props.id !== renderedId
            ? [{from: item.props.id, to: renderedId}]
            : []
        })
      : [],
    descriptionIds: accessibilityId
      ? parts.descriptions.flatMap((item, index) =>
          !item.props.hidden && item.props['aria-hidden'] !== true && item.props['aria-hidden'] !== 'true'
            ? [descriptions[index].props.id]
            : [],
        )
      : [],
    descriptions,
    hasWrappingInlineDescription: parts.descriptions.some(
      description => description.props.variant !== 'block' && !description.props.truncate,
    ),
    inlineDescriptions: descriptions.filter((_, index) => parts.descriptions[index].props.variant !== 'block'),
    labelId: accessibilityId ? `${accessibilityId}-label` : undefined,
    trailingVisualId: accessibilityId && parts.trailingVisual ? `${accessibilityId}-trailing-visual` : undefined,
  }
}

type ActionItemElementProps = Pick<ActionListItemProps, 'children' | 'description' | 'leadingVisual' | 'trailingVisual'>

function resolveActionItemElementContent(item: ActionItemElementProps, accessibilityId?: string) {
  const {children, description, leadingVisual, trailingVisual} = item
  const {itemChildren} = resolveItemRegions(children, {description, leadingVisual, trailingVisual})
  return resolveActionItemContent({children: itemChildren}, accessibilityId)
}

function resolveActionItemOptionContent(
  regions: ActionItemContentRegions,
  renderedItem: React.ReactNode,
  renderedActionListItem: React.ReactElement<ActionItemElementProps> | undefined,
  accessibilityId: string,
) {
  if (renderedActionListItem) return resolveActionItemElementContent(renderedActionListItem.props, accessibilityId)
  return renderedItem == null ? resolveActionItemContent(regions, accessibilityId) : undefined
}

function ActionItemContentRoot({
  children,
  description,
  descriptionVariant,
  dividerClassName = actionItemDividerClassName,
  indicator,
  leadingVisual,
  resolvedContent,
  selection,
  showDivider,
  size = 'medium',
  supportingText,
  supportingTextId,
  trailingVisual,
}: {
  children?: React.ReactNode
  description?: React.ReactNode
  descriptionVariant?: ActionListDescriptionProps['variant']
  /** Draws the divider for this item's structure. Defaults to the divider for items rendered in list items. */
  dividerClassName?: string
  indicator?: React.ReactNode
  leadingVisual?: React.ReactNode
  resolvedContent?: ReturnType<typeof resolveActionItemContent>
  selection?: React.ReactNode
  showDivider?: boolean
  size?: 'small' | 'medium' | 'large'
  supportingText?: React.ReactNode
  supportingTextId?: string
  trailingVisual?: React.ReactNode
}) {
  const {
    blockDescriptions,
    descriptions,
    hasWrappingInlineDescription,
    inlineDescriptions,
    label,
    labelId,
    leadingVisual: resolvedLeadingVisual,
    trailingVisual: resolvedTrailingVisual,
    trailingVisualId,
  } = resolvedContent ??
  resolveActionItemContent({children, description, descriptionVariant, leadingVisual, trailingVisual})
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
          className={cn(
            'primer:flex primer:min-h-5 primer:min-w-max primer:shrink-0 primer:items-center primer:leading-5',
            actionItemPartClassName.leadingVisual,
          )}
          data-component="ActionList.Selection"
        >
          {selection}
        </span>
      ) : null}
      {renderedLeadingVisual}
      <span
        className={cn(
          'primer:flex primer:min-w-0 primer:flex-1 primer:flex-col',
          showDivider && dividerClassName,
          // Upstream paints the divider a second time for items with inline descriptions.
          showDivider && inlineDescriptions.length > 0 && 'primer:before:shadow-[inset_0_1px_var(--borderColor-muted)]',
        )}
        data-component="ActionList.Item--DividerContainer"
      >
        <span className="primer:flex primer:min-w-0 primer:items-start primer:gap-2">
          <span
            className={cn(
              'primer:flex primer:min-w-0 primer:flex-1 primer:gap-1',
              hasBlockDescription ? 'primer:flex-col' : 'primer:flex-row primer:items-baseline primer:gap-2',
            )}
            data-description-variant={hasBlockDescription ? 'block' : 'inline'}
          >
            <span
              className={cn(
                'primer:flex primer:min-w-0 primer:items-baseline',
                inlineDescriptions.length > 0 && 'primer:gap-x-2',
                hasWrappingInlineDescription && 'primer:flex-wrap',
              )}
            >
              <span
                className={cn(
                  'primer:relative primer:min-w-0 primer:wrap-anywhere',
                  actionItemPartClassName.label,
                  size === 'small' ? 'primer:text-xs' : 'primer:text-sm primer:leading-5',
                  descriptions.length === 0 && 'primer:flex-1',
                  descriptions.length > 0 && 'primer:font-semibold',
                )}
                data-component="ActionList.Item.Label"
                data-item-label=""
                id={labelId}
              >
                {label}
              </span>
              {inlineDescriptions}
            </span>
            {blockDescriptions}
          </span>
          {renderedTrailingVisual != null && typeof renderedTrailingVisual !== 'boolean' ? (
            // Reference the visible wrapper so CSS-hidden visuals are omitted from the accessible name.
            <span
              className="primer:min-w-0 primer:max-w-1/2 primer:shrink-0 primer:wrap-anywhere"
              id={trailingVisualId}
            >
              {renderedTrailingVisual}
            </span>
          ) : null}
        </span>
        {supportingText ? (
          <span
            className="primer:min-w-0 primer:wrap-break-word primer:text-xs primer:leading-4 primer:text-attention"
            id={supportingTextId}
          >
            {supportingText}
          </span>
        ) : null}
      </span>
    </>
  )
}

type ActionItemRender<State> = React.ReactElement | ComponentRenderFn<HTMLProps, State> | undefined

function containsRenderedContent(node: React.ReactNode, content: React.ReactNode): boolean {
  if (node === content) return true
  if (Array.isArray(content)) {
    return content
      .filter(child => child !== null && child !== undefined && typeof child !== 'boolean')
      .every(child => containsRenderedContent(node, child))
  }
  if (Array.isArray(node)) return node.some(child => containsRenderedContent(child, content))
  if (!React.isValidElement<{children?: React.ReactNode; id?: string; resolvedContent?: unknown}>(node)) return false
  if (
    React.isValidElement<{children?: React.ReactNode; id?: string; resolvedContent?: unknown}>(content) &&
    node.type === content.type &&
    ((content.props.resolvedContent !== undefined && node.props.resolvedContent === content.props.resolvedContent) ||
      (content.props.id !== undefined && node.props.id === content.props.id) ||
      (content.props.children !== undefined && node.props.children === content.props.children))
  ) {
    return true
  }
  return containsRenderedContent(node.props.children, content)
}

function replaceDescriptionAliases(value: string | undefined, aliases: Array<{from: string; to: string}>) {
  return joinIdRefs(...(value?.split(/\s+/).map(id => aliases.find(alias => alias.from === id)?.to ?? id) ?? []))
}

function omitIdRefs(value: string | undefined, omitted: Array<string | undefined>) {
  return joinIdRefs(...(value?.split(/\s+/).filter(id => !omitted.includes(id)) ?? []))
}

function useActionItemAccessibility<State>({
  describedBy,
  label,
  labelledBy,
  loadingText,
  render,
  resolveContent,
  skip,
  supportingText,
}: {
  describedBy?: string
  label?: string
  labelledBy?: string
  loadingText?: string
  render: ActionItemRender<State>
  resolveContent: (id?: string) => ReturnType<typeof resolveActionItemParts>
  skip?: boolean
  supportingText?: React.ReactNode
}) {
  const id = React.useId()
  const content = resolveContent(id)
  const renderReplacesChildren =
    React.isValidElement<{children?: React.ReactNode}>(render) && 'children' in render.props
  const hasDescription =
    !skip &&
    !renderReplacesChildren &&
    (content.descriptionIds.length > 0 || Boolean(supportingText) || Boolean(loadingText))
  const renderAria = React.isValidElement<React.AriaAttributes>(render) ? render.props : undefined
  // Like upstream, the name is the label and trailing visual whether or not the item has a description, so a leading
  // visual's label never changes the name. An item without label text is named from its content instead.
  const nameFromLabel =
    !skip &&
    !renderReplacesChildren &&
    React.Children.toArray(content.label).length > 0 &&
    label === undefined &&
    labelledBy === undefined &&
    renderAria?.['aria-label'] === undefined &&
    renderAria?.['aria-labelledby'] === undefined
  const resolvedContent = hasDescription || nameFromLabel ? content : resolveContent()
  const supportingTextId = hasDescription && supportingText ? `${id}-supporting-text` : undefined
  const loadingTextId = hasDescription && loadingText ? `${id}-loading-text` : undefined
  const generatedLabelledBy = nameFromLabel
    ? joinIdRefs(resolvedContent.labelId, resolvedContent.trailingVisualId, loadingTextId)
    : undefined
  const descriptionIds = [
    ...resolvedContent.descriptionIds,
    ...(supportingTextId ? [supportingTextId] : []),
    ...(loadingTextId && !generatedLabelledBy ? [loadingTextId] : []),
  ]
  const aliases = resolvedContent.descriptionAliases
  const resolvedDescribedBy = joinIdRefs(
    replaceDescriptionAliases(describedBy, aliases),
    replaceDescriptionAliases(renderAria?.['aria-describedby'], aliases),
    ...descriptionIds,
  )

  function withDescriptions(element: React.ReactElement, fromCallback: boolean, contentForwarded = true) {
    if (!React.isValidElement<React.AriaAttributes>(element)) return element
    const explicitRenderedName =
      element.props['aria-label'] !== undefined ||
      (element.props['aria-labelledby'] !== undefined && element.props['aria-labelledby'] !== generatedLabelledBy)
    const aria: React.AriaAttributes = {
      'aria-describedby': joinIdRefs(
        replaceDescriptionAliases(describedBy, aliases),
        replaceDescriptionAliases(
          contentForwarded
            ? element.props['aria-describedby']
            : omitIdRefs(element.props['aria-describedby'], descriptionIds),
          aliases,
        ),
        ...(contentForwarded ? descriptionIds : []),
        ...(loadingTextId && generatedLabelledBy && contentForwarded && explicitRenderedName ? [loadingTextId] : []),
      ),
    }
    if (fromCallback && generatedLabelledBy && (!contentForwarded || explicitRenderedName)) {
      aria['aria-labelledby'] = omitIdRefs(element.props['aria-labelledby'], generatedLabelledBy.split(/\s+/))
    }
    return React.cloneElement(element, aria)
  }

  const resolvedRender =
    !hasDescription && !generatedLabelledBy
      ? render
      : typeof render === 'function'
        ? (props: HTMLProps, state: State) => {
            const element = render(props, state)
            return withDescriptions(
              element,
              true,
              React.isValidElement<{children?: React.ReactNode}>(element) &&
                containsRenderedContent(element.props.children, props.children),
            )
          }
        : React.isValidElement<React.AriaAttributes>(render) && 'aria-describedby' in render.props
          ? withDescriptions(render, false)
          : render

  return {
    describedBy: resolvedDescribedBy,
    labelledBy: labelledBy ?? generatedLabelledBy,
    loadingTextId,
    render: resolvedRender,
    resolvedContent,
    supportingTextId,
  }
}

/**
 * Names a generated option from its label and trailing visual, as `ActionList.Item` does, so a leading visual never
 * joins the name, with or without a description. Content without label text keeps its subtree name.
 */
function getActionItemOptionLabelledBy(
  resolvedContent: ReturnType<typeof resolveActionItemContent> | undefined,
  ariaLabel: string | undefined,
) {
  if (ariaLabel !== undefined || !resolvedContent || React.Children.toArray(resolvedContent.label).length === 0) {
    return undefined
  }
  return joinIdRefs(resolvedContent.labelId, resolvedContent.trailingVisualId)
}

export const ActionItemContent = Object.assign(ActionItemContentRoot, {
  optionLabelledBy: getActionItemOptionLabelledBy,
  resolve: resolveActionItemContent,
  resolveParts: resolveActionItemParts,
  resolveOption: resolveActionItemOptionContent,
  useAccessibility: useActionItemAccessibility,
})

const Item = React.forwardRef<HTMLElement, ActionListItemProps>(function ActionListItem(
  {
    active,
    'aria-checked': explicitChecked,
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': labelledBy,
    'aria-selected': explicitSelected,
    children,
    className,
    description: descriptionProp,
    disabled,
    focusableWhenDisabled: focusableWhenDisabledProp,
    inactiveText,
    leadingVisual: leadingVisualProp,
    loading = false,
    loadingText,
    onAuxClickCapture,
    onClick,
    onClickCapture,
    onKeyDown,
    onKeyDownCapture,
    onKeyUpCapture,
    onSelect: onSelectItem,
    render,
    role: roleProp,
    selected,
    size = 'medium',
    title,
    trailingAction: trailingActionProp,
    trailingVisual: trailingVisualProp,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const {
    itemGap,
    listboxComposition,
    role: listRole,
    selectionVariant,
    showDividers,
    variant: listVariant,
  } = React.useContext(ListContext)
  const directTreeItem = React.useContext(DirectTreeItemContext)
  const direct = Boolean(listboxComposition || directTreeItem)
  const role = roleProp ?? getSelectionRole(listRole, selectionVariant)
  const selectionAttribute = getSelectionAttribute(role)
  const selectionState = explicitChecked ?? explicitSelected ?? selected
  const isSelected = selectionState === true || selectionState === 'true'
  const isIndeterminate = selectionState === 'mixed'
  const {
    itemChildren,
    hasDescription,
    parts,
    trailingAction: resolvedTrailingAction,
  } = resolveItemRegions(children, {
    leadingVisual: leadingVisualProp,
    trailingVisual: trailingVisualProp,
    description: descriptionProp,
    trailingAction: trailingActionProp,
  })
  const isTreeItem = listRole === 'tree' || role === 'treeitem'
  const accessibility = useActionItemAccessibility({
    describedBy,
    label: ariaLabel,
    labelledBy,
    loadingText: loading ? loadingText : undefined,
    render,
    resolveContent: id =>
      isTreeItem ? resolveActionItemContent({children: itemChildren}, id) : resolveActionItemParts(parts, id),
    skip: isTreeItem,
    supportingText: inactiveText,
  })
  const renderedTrailingAction = !inactiveText && !loading ? resolvedTrailingAction : null
  if (direct && renderedTrailingAction) {
    throw new Error('ActionList listbox options and tree items cannot contain a trailing action.')
  }
  const trailingActionLoading = !disabled && isTrailingActionLoading(renderedTrailingAction)
  const showInactiveIndicator = Boolean(inactiveText && listRole !== 'menu' && listRole !== 'listbox')
  // Composite widgets keep disabled items discoverable unless the caller explicitly opts out.
  const focusableWhenDisabled = disabled
    ? (focusableWhenDisabledProp ?? (focusZoneRoles.has(listRole ?? '') || listRole === 'tree' || role === 'treeitem'))
    : Boolean(inactiveText || loading)
  const itemState = {
    active,
    disabled,
    inactive: Boolean(inactiveText),
    loading,
    trailingActionLoading,
    variant,
  }
  const selection = selectionVariant ? (
    <SelectionVisual
      checked={isSelected}
      disabled={disabled}
      indeterminate={isIndeterminate}
      // Menus draw a checkmark for every selection variant except radio, as upstream does.
      variant={
        selectionVariant === 'radio'
          ? 'radio'
          : selectionVariant === 'multiple' && listRole !== 'menu'
            ? 'multiple'
            : 'single'
      }
    />
  ) : null
  const statusIndicator = showInactiveIndicator ? (
    <AlertIcon aria-hidden="true" className="primer:size-4 primer:shrink-0 primer:text-muted" />
  ) : loading ? (
    <Spinner aria-hidden="true" className="primer:shrink-0" size="small" srText={null} />
  ) : null

  const stateAttributes = getActionItemStateAttributes(itemState)

  if (roleProp === 'listitem') {
    if (direct || listRole !== 'list') {
      throw new Error('ActionList.Item with role="listitem" must be rendered within an ActionList with role="list".')
    }
    if (
      render ||
      onSelectItem ||
      onClick ||
      selected !== undefined ||
      explicitSelected !== undefined ||
      explicitChecked !== undefined ||
      loading
    ) {
      throw new Error(
        'ActionList.Item with role="listitem" is static content and cannot be selected, activated, or loading.',
      )
    }
    if (disabled || rest['aria-disabled'] !== undefined) {
      throw new Error(
        'ActionList.Item with role="listitem" cannot be disabled: aria-disabled is deprecated on list items and does not prevent activation of descendants. Use inactiveText to explain why the row is unavailable.',
      )
    }
    const listItemProps: Record<string, unknown> = {
      ...rest,
      onAuxClickCapture,
      onClickCapture,
      onKeyDown,
      onKeyDownCapture,
      onKeyUpCapture,
    }
    delete listItemProps.nativeButton
    delete listItemProps.type
    return (
      <li
        {...(listItemProps as React.ComponentPropsWithoutRef<'li'>)}
        ref={ref as React.Ref<HTMLLIElement>}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        title={title}
        data-component="ActionList.Item"
        data-static=""
        data-active={(active && !inactiveText) || undefined}
        data-inactive={inactiveText ? true : undefined}
        data-has-description={hasDescription}
        data-size={size}
        className={cn(
          'primer:relative primer:list-none primer:rounded-md',
          listVariant !== 'full' && 'primer:mx-2',
          itemGap && "primer:[[data-component$='Item']+&]:mt-0.5",
          renderedTrailingAction && 'primer:flex primer:items-center',
          staticActionItemClassName,
          inactiveText &&
            'primer:[--action-list-item-fgColor:var(--fgColor-muted)] primer:[--action-list-item-label-fgColor:var(--fgColor-muted)]',
          active &&
            !inactiveText &&
            'primer:bg-[var(--control-transparent-bgColor-selected)] primer:[&_[data-item-label]]:font-semibold',
          className,
        )}
      >
        <div
          className={cn(
            actionItemClassName,
            size === 'small' && 'primer:py-1',
            size === 'large' && 'primer:py-2.5',
            renderedTrailingAction && 'primer:min-w-0 primer:flex-1',
          )}
          data-component="ActionList.Item.Content"
        >
          <ActionItemContent
            indicator={statusIndicator}
            resolvedContent={accessibility.resolvedContent}
            showDivider={showDividers}
            size={size}
            supportingText={inactiveText}
          />
        </div>
        {renderedTrailingAction}
      </li>
    )
  }

  const action = (
    <ButtonBase
      {...rest}
      {...(direct ? stateAttributes : {})}
      ref={ref}
      role={role}
      disabled={disabled || Boolean(inactiveText) || loading}
      focusableWhenDisabled={focusableWhenDisabled}
      aria-describedby={isTreeItem ? describedBy : accessibility.describedBy}
      aria-label={ariaLabel}
      aria-labelledby={isTreeItem ? labelledBy : accessibility.labelledBy}
      aria-disabled={focusableWhenDisabled || inactiveText || loading ? true : undefined}
      render={guardDisabledRender(
        Boolean(disabled || inactiveText || loading),
        isTreeItem ? render : accessibility.render,
      )}
      title={title ?? (typeof inactiveText === 'string' ? inactiveText : undefined)}
      aria-selected={
        explicitSelected ??
        (explicitChecked === undefined && selectionAttribute === 'aria-selected' ? Boolean(selected) : undefined)
      }
      aria-checked={
        explicitChecked ??
        (explicitSelected === undefined && selectionAttribute === 'aria-checked' ? Boolean(selected) : undefined)
      }
      {...getDisabledActivationHandlers(Boolean(disabled || inactiveText || loading), {
        onAuxClickCapture,
        onClickCapture,
        onKeyDownCapture,
        onKeyUpCapture,
      })}
      onClick={event => {
        onClick?.(event)
        if (!event.defaultPrevented && !inactiveText && !loading) onSelectItem?.(event)
      }}
      onKeyDown={
        directTreeItem
          ? event => {
              onKeyDown?.(event)
              if (event.defaultPrevented) {
                event.preventBaseUIHandler()
              } else if (event.key === 'Enter' && event.target === event.currentTarget) {
                // Base UI's non-native Enter handler passes a prevented key event to onClick.
                event.preventDefault()
                event.preventBaseUIHandler()
                event.currentTarget.click()
              }
            }
          : onKeyDown
      }
      className={cn(
        actionItemClassName,
        direct && 'primer:relative',
        direct && listVariant !== 'full' && 'primer:mx-2 primer:w-[calc(100%-1rem)]',
        direct && itemGap && 'primer:[[data-action-list-item]+&]:mt-0.5',
        direct && getActionItemStateClassName(itemState),
        size === 'small' && 'primer:py-1',
        size === 'large' && 'primer:py-2.5',
        renderedTrailingAction && 'primer:min-w-0 primer:flex-1',
        className,
      )}
      data-component={directTreeItem ? 'ActionList.TreeItem' : direct ? 'ActionList.Item' : 'ActionList.Item.Action'}
      data-action-list-item={direct || undefined}
      data-active={direct ? stateAttributes['data-active'] : active || undefined}
      data-has-description={hasDescription}
      data-selected={isSelected || undefined}
      data-indeterminate={isIndeterminate || undefined}
      data-size={size}
      data-variant={variant === 'danger' ? variant : undefined}
    >
      <ActionItemContent
        dividerClassName={direct ? directItemDividerClassName : undefined}
        indicator={statusIndicator}
        resolvedContent={accessibility.resolvedContent}
        selection={selection}
        showDivider={showDividers}
        size={size}
        supportingText={inactiveText}
        supportingTextId={accessibility.supportingTextId}
      />
      {loading && loadingText ? (
        <span className="primer:sr-only" id={accessibility.loadingTextId}>
          {loadingText}
        </span>
      ) : null}
    </ButtonBase>
  )

  if (direct) return action

  return (
    <li
      role={getSelectionRole(listRole, selectionVariant) ? 'none' : undefined}
      data-component="ActionList.Item"
      {...stateAttributes}
      data-trailing-action-loading={trailingActionLoading || undefined}
      className={cn(
        'primer:relative primer:list-none primer:rounded-md',
        listVariant !== 'full' && 'primer:mx-2',
        itemGap && "primer:[[data-component$='Item']+&]:mt-0.5",
        renderedTrailingAction && 'primer:flex primer:items-center',
        getActionItemStateClassName(itemState),
      )}
    >
      {action}
      {renderedTrailingAction}
    </li>
  )
}) as ActionListItemComponent

export type ActionListTreeItemProps = Omit<ActionListItemProps, 'nativeButton' | 'render' | 'role' | 'trailingAction'>

const TreeItem = React.forwardRef<HTMLElement, ActionListTreeItemProps>(function ActionListTreeItem(props, ref) {
  const {role} = React.useContext(ListContext)
  if (role !== 'tree') throw new Error('ActionList.TreeItem must be rendered within an ActionList with role="tree".')
  return (
    <DirectTreeItemContext.Provider value>
      <Item {...props} ref={ref} nativeButton={false} render={<li />} role="treeitem" />
    </DirectTreeItemContext.Provider>
  )
})

export interface ActionListLinkItemProps
  extends React.ComponentPropsWithoutRef<'a'>,
    RegionProps<'leadingVisual' | 'trailingVisual' | 'description' | 'trailingAction'> {
  /** Highlights the link as the current one. */
  active?: boolean
  /** Marks the link temporarily unavailable and displays why. The link cannot navigate until it is available. */
  inactiveText?: React.ReactNode
  /** Renders the link using a ref-forwarding element, such as a router link. */
  render?: useRender.RenderProp<{active: boolean}>
  /** Row height and label size. Use `small` for dense lists and `large` for a more comfortable touch target. */
  size?: 'small' | 'medium' | 'large'
  /** Use `danger` for a destructive navigation. */
  variant?: 'default' | 'danger'
}

const LinkItem = React.forwardRef<HTMLAnchorElement, ActionListLinkItemProps>(function ActionListLinkItem(
  {
    active,
    'aria-checked': explicitChecked,
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': labelledBy,
    'aria-selected': explicitSelected,
    children,
    className,
    description: descriptionProp,
    href,
    inactiveText,
    leadingVisual: leadingVisualProp,
    onAuxClickCapture,
    onClick,
    onClickCapture,
    onKeyDownCapture,
    onKeyUpCapture,
    render,
    role: roleProp,
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
  const direct = Boolean(context.listboxComposition)
  const role = roleProp ?? (direct ? 'option' : undefined)
  const {itemChildren, parts, hasDescription, trailingAction} = resolveItemRegions(children, {
    leadingVisual: leadingVisualProp,
    trailingVisual: trailingVisualProp,
    description: descriptionProp,
    trailingAction: trailingActionProp,
  })
  const isTreeItem = context.role === 'tree' || role === 'treeitem'
  const accessibility = useActionItemAccessibility({
    describedBy,
    label: ariaLabel,
    labelledBy,
    render: inactiveText ? undefined : render,
    resolveContent: id =>
      isTreeItem ? resolveActionItemContent({children: itemChildren}, id) : resolveActionItemParts(parts, id),
    skip: isTreeItem,
    supportingText: inactiveText,
  })

  const renderedTrailingAction = inactiveText ? null : trailingAction
  if (direct && renderedTrailingAction) {
    throw new Error('ActionList listbox options cannot contain a trailing action.')
  }
  const trailingActionLoading = isTrailingActionLoading(renderedTrailingAction)
  const itemState = {active, inactive: Boolean(inactiveText), trailingActionLoading, variant}
  const selectionState = explicitChecked ?? explicitSelected
  const isSelected = selectionState === true || selectionState === 'true'
  const isIndeterminate = selectionState === 'mixed'
  const selection =
    direct && context.selectionVariant ? (
      <SelectionVisual
        checked={isSelected}
        indeterminate={isIndeterminate}
        variant={context.selectionVariant === 'multiple' ? 'multiple' : context.selectionVariant}
      />
    ) : null
  const link = useRender<{active: boolean}, HTMLAnchorElement>({
    defaultTagName: 'a',
    render: isTreeItem && !inactiveText ? render : accessibility.render,
    ref,
    state: {active: Boolean(active)},
    props: {
      ...rest,
      ...(direct ? getActionItemStateAttributes(itemState) : {}),
      ...(href !== undefined && !inactiveText ? {href} : {}),
      role,
      'aria-checked': explicitChecked,
      'aria-describedby': isTreeItem ? describedBy : accessibility.describedBy,
      'aria-disabled': inactiveText ? true : undefined,
      'aria-label': ariaLabel,
      'aria-labelledby': isTreeItem ? labelledBy : accessibility.labelledBy,
      'aria-selected':
        explicitSelected ?? (direct && role === 'option' && explicitChecked === undefined ? false : undefined),
      className: cn(
        actionItemClassName,
        direct && 'primer:relative',
        direct && context.variant !== 'full' && 'primer:mx-2 primer:w-[calc(100%-1rem)]',
        direct && context.itemGap && 'primer:[[data-action-list-item]+&]:mt-0.5',
        direct && getActionItemStateClassName(itemState),
        size === 'small' && 'primer:py-1',
        size === 'large' && 'primer:py-2.5',
        renderedTrailingAction && 'primer:min-w-0 primer:flex-1',
        inactiveText && 'primer:cursor-not-allowed',
        className,
      ),
      'data-active': active || undefined,
      'data-action-list-item': direct || undefined,
      'data-component': direct ? 'ActionList.LinkItem' : undefined,
      'data-has-description': hasDescription,
      'data-inactive': inactiveText ? true : undefined,
      'data-indeterminate': direct && isIndeterminate ? true : undefined,
      'data-selected': direct && isSelected ? true : undefined,
      'data-size': size,
      ...getDisabledActivationHandlers(Boolean(inactiveText), {
        onAuxClickCapture,
        onClickCapture,
        onKeyDownCapture,
        onKeyUpCapture,
      }),
      onClick: inactiveText ? undefined : onClick,
      tabIndex: inactiveText && direct ? (rest.tabIndex ?? 0) : rest.tabIndex,
      children: (
        <>
          <ActionItemContent
            dividerClassName={direct ? directItemDividerClassName : undefined}
            indicator={
              inactiveText ? (
                <AlertIcon aria-hidden="true" className="primer:size-4 primer:shrink-0 primer:text-muted" />
              ) : undefined
            }
            resolvedContent={accessibility.resolvedContent}
            selection={selection}
            showDivider={showDividers}
            size={size}
            supportingText={inactiveText}
            supportingTextId={accessibility.supportingTextId}
          />
        </>
      ),
    },
  })

  if (direct) return link

  return (
    <li
      data-component="ActionList.LinkItem"
      {...getActionItemStateAttributes(itemState)}
      data-trailing-action-loading={trailingActionLoading || undefined}
      className={cn(
        'primer:relative primer:list-none primer:rounded-md',
        context.variant !== 'full' && 'primer:mx-2',
        context.itemGap && "primer:[[data-component$='Item']+&]:mt-0.5",
        renderedTrailingAction && 'primer:flex primer:items-center',
        getActionItemStateClassName(itemState),
      )}
    >
      {link}
      {renderedTrailingAction}
    </li>
  )
})

export interface ActionListGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'li'>, 'title'>,
    RegionProps<'heading'> {
  /** Heading text for the group, as an alternative to supplying a heading child. */
  title?: React.ReactNode
  /** Secondary text shown below the group's first heading. */
  auxiliaryText?: string
  /** Overrides the list's selection behaviour for this group. `false` renders the group's items without selection. */
  selectionVariant?: SelectionVariant | false
}

function resolveGroupContent({
  children,
  generatedGroupLabelId,
  headingProp,
  title,
}: {
  children: React.ReactNode
  generatedGroupLabelId: string
  headingProp: ActionListGroupProps['heading']
  title: React.ReactNode
}) {
  const {
    matched: {heading: matchedHeadings},
    rest: listChildren,
  } = resolveRegions(children, {heading: {match: isPartOf(GroupHeading), multiple: true}})
  const headingChildren = regionElements<ActionListGroupHeadingProps>(headingProp, matchedHeadings)
  const groupLabelId = title
    ? generatedGroupLabelId
    : (headingChildren[0]?.props.id ?? (headingChildren.length > 0 ? generatedGroupLabelId : undefined))
  const headings = (
    <>
      {title ? <GroupHeading id={groupLabelId}>{title}</GroupHeading> : null}
      {headingChildren.map((heading, index) =>
        React.cloneElement(heading, {
          id: heading.props.id ?? (!title && index === 0 ? groupLabelId : `${generatedGroupLabelId}-heading-${index}`),
        }),
      )}
    </>
  )
  return {groupLabelId, headings, listChildren}
}

const Group = React.forwardRef<HTMLLIElement, ActionListGroupProps>(function ActionListGroup(
  {auxiliaryText, children, className, heading: headingProp, selectionVariant, title, ...rest},
  ref,
) {
  const context = React.useContext(ListContext)
  const generatedGroupLabelId = React.useId()
  if (context.listboxComposition) {
    throw new Error('Use ActionList.Listbox.Group inside ActionList.Listbox.')
  }
  const {groupLabelId, headings, listChildren} = resolveGroupContent({
    children,
    generatedGroupLabelId,
    headingProp,
    title,
  })
  if (auxiliaryText && groupLabelId === undefined) {
    throw new Error('ActionList.Group auxiliaryText requires a group heading.')
  }
  return (
    <li
      {...rest}
      ref={ref}
      role={getSelectionRole(context.role, context.selectionVariant) ? 'none' : rest.role}
      className={cn('primer:not-first:mt-2', className)}
      data-component="ActionList.Group"
    >
      <ListContext.Provider
        value={{...context, groupLabelId, selectionVariant: selectionVariant ?? context.selectionVariant}}
      >
        <GroupHeadingContext.Provider value={{auxiliaryText, labelId: groupLabelId}}>
          {headings}
        </GroupHeadingContext.Provider>
        <ul
          className="primer:m-0 primer:list-none primer:p-0"
          aria-labelledby={groupLabelId}
          role={getSelectionRole(context.role, context.selectionVariant) ? 'group' : undefined}
        >
          {listChildren}
        </ul>
      </ListContext.Provider>
    </li>
  )
})

export interface ActionListListboxGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'role' | 'title'>,
    RegionProps<'heading'> {
  /** Heading text for the group, as an alternative to supplying a heading child. */
  title?: React.ReactNode
  /** Secondary text shown below the group's first heading. */
  auxiliaryText?: string
  /** Overrides the list's selection behaviour for this group. */
  selectionVariant?: SelectionVariant | false
}

const ListboxGroup = React.forwardRef<HTMLDivElement, ActionListListboxGroupProps>(function ActionListListboxGroup(
  {auxiliaryText, children, className, heading: headingProp, selectionVariant, title, ...rest},
  ref,
) {
  const context = React.useContext(ListContext)
  const generatedGroupLabelId = React.useId()
  if (!context.listboxComposition) {
    throw new Error('ActionList.Listbox.Group must be rendered within ActionList.Listbox.')
  }
  const {groupLabelId, headings, listChildren} = resolveGroupContent({
    children,
    generatedGroupLabelId,
    headingProp,
    title,
  })
  if (auxiliaryText && groupLabelId === undefined) {
    throw new Error('ActionList.Listbox.Group auxiliaryText requires a group heading.')
  }
  const labelledBy = rest['aria-labelledby'] ?? (rest['aria-label'] === undefined ? groupLabelId : undefined)
  return (
    <div
      {...rest}
      ref={ref}
      aria-labelledby={labelledBy}
      role="group"
      className={cn('primer:not-first:mt-2', className)}
      data-component="ActionList.Listbox.Group"
    >
      <ListContext.Provider
        value={{...context, groupLabelId, selectionVariant: selectionVariant ?? context.selectionVariant}}
      >
        <GroupHeadingContext.Provider value={{auxiliaryText, labelId: groupLabelId}}>
          {headings}
        </GroupHeadingContext.Provider>
        {listChildren}
      </ListContext.Provider>
    </div>
  )
})

export interface ActionListGroupHeadingProps
  extends React.ComponentPropsWithoutRef<'h3'>,
    RegionProps<'trailingAction'> {
  /** Heading element to render, so the group heading fits the surrounding document outline. */
  as?: React.ElementType
  /** Secondary text shown below the group heading. */
  auxiliaryText?: string
  /** Use `filled` to give the heading a background and separate it from the items above. */
  variant?: 'subtle' | 'filled'
}

const groupHeadingWrapperClassName =
  'primer:flex primer:min-h-[30px] primer:items-center primer:gap-2 primer:px-4 primer:py-1.5 primer:text-xs primer:leading-[18px] primer:font-semibold primer:text-muted'

const GroupHeading = React.forwardRef<HTMLElement, ActionListGroupHeadingProps>(function ActionListGroupHeading(
  {as, auxiliaryText, children, className, id, trailingAction: trailingActionProp, variant = 'subtle', ...rest},
  ref,
) {
  const {groupLabelId, listboxComposition, role} = React.useContext(ListContext)
  const groupHeading = React.useContext(GroupHeadingContext)
  const headingId = id ?? groupLabelId
  const secondaryText =
    auxiliaryText ??
    (headingId !== undefined && headingId === groupHeading.labelId ? groupHeading.auxiliaryText : undefined)
  const compositeHeading = listboxComposition || (role !== undefined && role !== 'list')
  const menuOrListbox = listboxComposition || role === 'menu' || role === 'menubar' || role === 'listbox'
  const Component = as ?? (compositeHeading ? 'span' : 'h3')
  const {
    regions: {trailingAction},
    rest: headingChildren,
  } = resolveRegions(
    children,
    {trailingAction: {match: isPartOf(GroupHeadingTrailingAction)}},
    {trailingAction: trailingActionProp},
  )
  if (menuOrListbox && ((typeof Component === 'string' && /^h[1-6]$/.test(Component)) || rest.role === 'heading')) {
    throw new Error('A menu or listbox group heading cannot use a semantic heading element or role.')
  }
  if (listboxComposition && trailingAction) {
    throw new Error('An ActionList.Listbox group heading cannot contain a trailing action.')
  }
  const heading = (
    <Component
      {...rest}
      ref={ref}
      id={headingId}
      role={menuOrListbox ? rest.role : undefined}
      className={cn(
        'primer:m-0 primer:min-w-0 primer:wrap-break-word primer:text-xs primer:leading-[18px] primer:font-semibold primer:text-muted',
        className,
      )}
    >
      {headingChildren}
    </Component>
  )
  return (
    <div
      className={cn(
        groupHeadingWrapperClassName,
        variant === 'filled' && 'primer:mb-2 primer:border-y primer:border-muted primer:bg-muted',
      )}
      data-component="ActionList.GroupHeading"
      data-group-heading={listboxComposition || undefined}
      data-variant={variant}
    >
      {secondaryText ? (
        <div className="primer:min-w-0 primer:flex-1">
          {heading}
          <div className="primer:wrap-break-word primer:text-xs primer:leading-4 primer:font-normal">
            {secondaryText}
          </div>
        </div>
      ) : (
        heading
      )}
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
  'primer:mt-[7px] primer:mb-2 primer:block primer:h-px primer:list-none primer:border-0 primer:bg-[var(--borderColor-muted)] primer:p-0 primer:first:hidden'

const Divider = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  function ActionListDivider(props, ref) {
    const {listboxComposition, role} = React.useContext(ListContext)
    if (listboxComposition) throw new Error('Use ActionList.Listbox.Divider inside ActionList.Listbox.')
    // Only menus permit separator children; other list roles keep the rule decorative.
    const isSeparator = role === 'menu' || role === 'menubar'
    return (
      <li
        {...props}
        ref={ref}
        role={isSeparator ? 'separator' : undefined}
        aria-hidden={isSeparator ? undefined : true}
        className={cn(actionListDividerClassName, props.className)}
        data-component="ActionList.Divider"
      />
    )
  },
)

const ListboxDivider = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<'div'>, 'aria-hidden' | 'role'>
>(function ActionListListboxDivider({className, ...props}, ref) {
  const {listboxComposition} = React.useContext(ListContext)
  if (!listboxComposition) {
    throw new Error('ActionList.Listbox.Divider must be rendered within ActionList.Listbox.')
  }
  return (
    <div
      {...props}
      ref={ref}
      aria-hidden="true"
      className={cn(actionListDividerClassName, className)}
      data-component="ActionList.Listbox.Divider"
      data-list-divider
    />
  )
})

const LeadingVisual = ({className, ...props}: React.ComponentPropsWithoutRef<'span'>) => (
  <span
    {...props}
    className={cn(
      'primer:flex primer:min-h-5 primer:min-w-max primer:shrink-0 primer:items-center primer:leading-5',
      actionItemPartClassName.leadingVisual,
      className,
    )}
    data-component="ActionList.LeadingVisual"
  />
)
const TrailingVisual = ({className, ...props}: React.ComponentPropsWithoutRef<'span'>) => (
  <span
    {...props}
    className={cn(
      'primer:ml-auto primer:flex primer:min-h-5 primer:min-w-0 primer:max-w-full primer:items-center primer:text-sm primer:leading-5 primer:wrap-anywhere',
      actionItemPartClassName.trailingVisual,
      className,
    )}
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
      'primer:min-w-0 primer:max-w-full primer:text-xs primer:leading-4 primer:wrap-anywhere',
      actionItemPartClassName.description,
      variant === 'block' && 'primer:block primer:w-full primer:basis-full',
      truncate && 'primer:overflow-hidden primer:text-ellipsis primer:whitespace-nowrap',
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
  small: 'primer:font-display primer:text-title-small',
  medium: 'primer:font-display primer:text-title-medium',
  large: 'primer:font-display primer:text-title-large',
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
        'primer:m-0 primer:mb-2 primer:text-[length:var(--text-title-size-large)] primer:font-semibold',
        size && headingSizeClassName[size],
        variant === 'full' ? 'primer:ms-2' : 'primer:ms-4',
        visuallyHidden && 'primer:sr-only',
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
  TreeItem,
  LinkItem,
  Group,
  Listbox: Object.assign(ListboxRoot, {Group: ListboxGroup, Divider: ListboxDivider}),
  GroupHeading: Object.assign(GroupHeading, {TrailingAction: GroupHeadingTrailingAction}),
  Divider,
  LeadingVisual,
  TrailingVisual,
  Description,
  Heading,
  TrailingAction,
})

ActionList.displayName = 'ActionList'
