'use client'

import {AlertIcon, CheckIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {isPartOf, regionElements, resolveRegions} from '../../internal/regions'
import type {RegionProps} from '../../utils/types'
import {Button, ButtonBase, type ButtonBaseProps, type ButtonProps} from '../Button'
import {IconButton} from '../IconButton'
import {LinkButton, type LinkButtonProps} from '../LinkButton'
import {getSelectionAttribute, getSelectionRole, type SelectionVariant} from './selectionUtils'

type ListContextValue = {
  groupLabelId?: string
  role?: string
  selectionVariant?: SelectionVariant
  showDividers?: boolean
  variant?: 'inset' | 'horizontal-inset' | 'full'
}

const ListContext = React.createContext<ListContextValue>({})

const listClassName = 'm-0 list-none p-0 text-default'
export const actionItemClassName =
  'flex !min-w-0 w-full !justify-start gap-2 appearance-none rounded-md !border-0 bg-transparent px-2 py-1.5 text-left text-sm font-normal ![line-height:20px] whitespace-normal text-default no-underline !shadow-none hover:bg-neutral-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus data-[disabled]:cursor-not-allowed data-[disabled]:text-disabled'

interface ActionListTrailingActionBaseProps {
  className?: string
  icon?: React.ElementType
  label: string
  style?: React.CSSProperties
}

type ActionListTrailingActionButtonProps = {
  as?: 'button'
  href?: never
} & Omit<
  ButtonProps,
  'children' | 'className' | 'data-component' | 'leadingVisual' | 'style' | 'trailingAction' | 'trailingVisual'
>

type ActionListTrailingActionLinkProps = {
  as: 'a'
} & Omit<LinkButtonProps, 'children' | 'className' | 'leadingVisual' | 'style' | 'trailingVisual' | 'variant'>

export type ActionListTrailingActionProps = ActionListTrailingActionBaseProps &
  (ActionListTrailingActionButtonProps | ActionListTrailingActionLinkProps)

function getTrailingActionClassName(hasIcon: boolean) {
  return cn(
    'relative inline-flex h-8 min-h-8 min-w-8 items-center justify-center rounded-md !border-0 bg-transparent px-2 text-sm !shadow-none hover:bg-neutral-muted hover:text-default focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus disabled:cursor-not-allowed',
    hasIcon ? 'text-muted' : '!px-[13px] text-default',
  )
}

function renderTrailingActionContainer(
  action: React.ReactNode,
  className: string | undefined,
  style: React.CSSProperties | undefined,
) {
  return (
    <span
      className={cn('ml-auto shrink-0 self-stretch', className)}
      data-component="ActionList.TrailingAction"
      style={style}
    >
      {action}
    </span>
  )
}

const TrailingAction = React.forwardRef<HTMLElement, ActionListTrailingActionProps>(
  function ActionListTrailingAction(props, ref) {
    if (props.as === 'a') {
      const {as: actionType, className, icon: Icon, label, style, ...linkProps} = props
      void actionType
      const action = (
        <LinkButton
          {...linkProps}
          ref={ref as React.Ref<HTMLAnchorElement>}
          aria-label={Icon ? label : linkProps['aria-label']}
          className={getTrailingActionClassName(Boolean(Icon))}
          data-component="ActionList.TrailingAction.Button"
          leadingVisual={Icon ? <Icon aria-hidden="true" /> : undefined}
          variant="invisible"
        >
          {Icon ? null : label}
        </LinkButton>
      )
      return renderTrailingActionContainer(action, className, style)
    }

    const {as: actionType, className, icon: Icon, label, style, type = 'button', ...buttonProps} = props
    void actionType
    const action = Icon ? (
      <IconButton
        {...buttonProps}
        ref={ref}
        type={type}
        aria-label={label}
        className={getTrailingActionClassName(true)}
        data-component="ActionList.TrailingAction.Button"
        icon={Icon}
        variant="invisible"
      />
    ) : (
      <Button
        {...buttonProps}
        ref={ref}
        type={type}
        className={getTrailingActionClassName(false)}
        data-component="ActionList.TrailingAction.Button"
        variant="invisible"
      >
        {label}
      </Button>
    )
    return renderTrailingActionContainer(action, className, style)
  },
)

export interface ActionListRootProps extends React.ComponentPropsWithoutRef<'ul'> {
  selectionVariant?: SelectionVariant
  variant?: 'inset' | 'horizontal-inset' | 'full'
  showDividers?: boolean
}

const Root = React.forwardRef<HTMLUListElement, ActionListRootProps>(function ActionListRoot(
  {children, className, role = 'list', selectionVariant, showDividers = false, variant = 'inset', ...rest},
  ref,
) {
  const listRole = role
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
    <ListContext.Provider value={{role: listRole, selectionVariant, showDividers, variant}}>
      <ul
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
      >
        {children}
      </ul>
    </ListContext.Provider>
  )
})

export interface ActionListItemProps
  extends Omit<ButtonBaseProps, 'data-component' | 'children' | 'className' | 'disabled' | 'onSelect'>,
    RegionProps<'leadingVisual' | 'trailingVisual' | 'description' | 'trailingAction'> {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  inactiveText?: React.ReactNode
  loading?: boolean
  loadingText?: string
  selected?: boolean
  size?: 'medium' | 'large'
  active?: boolean
  variant?: 'default' | 'danger'
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
  leadingVisual,
  selection,
  showDivider,
  supportingText,
  trailingVisual,
}: {
  children: React.ReactNode
  description?: React.ReactNode
  descriptionVariant?: ActionListDescriptionProps['variant']
  leadingVisual?: React.ReactNode
  selection?: React.ReactNode
  showDivider?: boolean
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

  return (
    <>
      {selection}
      {resolvedLeadingVisual}
      <span
        className={cn(
          'flex min-w-0 flex-1 items-start',
          supportingText ? 'flex-wrap gap-x-2 gap-y-0' : 'gap-2',
          showDivider &&
            "relative before:absolute before:inset-x-0 before:-top-[7px] before:h-px before:bg-[var(--borderColor-muted)] before:content-['']",
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
                'relative text-sm leading-5 wrap-break-word',
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
        {resolvedTrailingVisual}
        {supportingText ? <span className="basis-full text-xs leading-4 text-attention">{supportingText}</span> : null}
      </span>
    </>
  )
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
  const {role: listRole, selectionVariant, showDividers, variant: listVariant} = React.useContext(ListContext)
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
  const showInactiveWarning = Boolean(inactiveText && (listRole === 'menu' || listRole === 'listbox'))
  const selection =
    selectionVariant === 'multiple' ? (
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
    ) : selectionVariant === 'single' || selectionVariant === 'radio' ? (
      <CheckIcon aria-hidden="true" className={cn('shrink-0', !selected && 'invisible')} />
    ) : null
  const statusIndicator = loading ? (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  ) : null
  const inactiveIndicator =
    inactiveText && !showInactiveWarning ? (
      <AlertIcon aria-hidden="true" className="size-4 shrink-0 text-muted" />
    ) : null

  return (
    <li
      role={listRole === 'menu' || listRole === 'listbox' ? 'none' : undefined}
      data-component="ActionList.Item"
      className={cn(
        'relative list-none rounded-md',
        listVariant !== 'full' && 'mx-2',
        showDividers &&
          "after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-[var(--borderColor-muted)] after:content-[''] last:after:hidden",
        renderedTrailingAction && 'flex items-center',
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
        data-variant={variant === 'danger' ? variant : undefined}
      >
        <ActionItemContent
          selection={statusIndicator ?? selection}
          supportingText={showInactiveWarning ? inactiveText : null}
          trailingVisual={inactiveIndicator}
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
  selected?: boolean
  variant?: 'default' | 'danger'
}

const LinkItem = React.forwardRef<HTMLAnchorElement, ActionListLinkItemProps>(function ActionListLinkItem(
  {
    children,
    className,
    description: descriptionProp,
    leadingVisual: leadingVisualProp,
    selected,
    trailingAction: trailingActionProp,
    trailingVisual: trailingVisualProp,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const context = React.useContext(ListContext)
  const {itemChildren, hasDescription, trailingAction} = resolveItemRegions(children, {
    leadingVisual: leadingVisualProp,
    trailingVisual: trailingVisualProp,
    description: descriptionProp,
    trailingAction: trailingActionProp,
  })

  return (
    <li
      data-component="ActionList.LinkItem"
      className={cn(
        'relative list-none rounded-md',
        context.variant !== 'full' && 'mx-2',
        trailingAction && 'flex items-center',
      )}
    >
      <a
        {...rest}
        ref={ref}
        className={cn(
          actionItemClassName,
          trailingAction && 'min-w-0 flex-1',
          variant === 'danger' && 'text-danger hover:bg-[var(--control-danger-bgColor-hover)]',
          selected && 'bg-accent-muted',
          className,
        )}
        data-selected={selected || undefined}
        data-has-description={hasDescription}
      >
        <ActionItemContent>{itemChildren}</ActionItemContent>
      </a>
      {trailingAction}
    </li>
  )
})

export interface ActionListGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'li'>, 'title'>,
    RegionProps<'heading'> {
  title?: React.ReactNode
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
  const hasFilledHeading = headingChildren.some(child => child.props.variant === 'filled')
  return (
    <li
      {...rest}
      ref={ref}
      role={context.role === 'menu' || context.role === 'listbox' ? 'none' : rest.role}
      className={cn(!hasFilledHeading && '[&+&]:mt-2', className)}
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
  as?: React.ElementType
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

export type ActionListGroupHeadingTrailingActionProps = ActionListTrailingActionProps & {icon: React.ElementType}

const GroupHeadingTrailingAction = React.forwardRef<HTMLElement, ActionListGroupHeadingTrailingActionProps>(
  function ActionListGroupHeadingTrailingAction(props, ref) {
    return <TrailingAction {...props} ref={ref} />
  },
)

const Divider = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  function ActionListDivider(props, ref) {
    return (
      <li
        {...props}
        ref={ref}
        role="separator"
        className={cn(
          "relative h-4 border-0 after:absolute after:inset-x-4 after:top-1/2 after:h-px after:bg-[var(--borderColor-muted)] after:content-['']",
          props.className,
        )}
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
  truncate?: boolean
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
  as?: React.ElementType
  size?: 'small' | 'medium'
}
const Heading = ({as: Component = 'h2', children, className, size = 'medium', ...props}: ActionListHeadingProps) => (
  <Component
    {...props}
    className={cn('m-0 px-4 py-1.5 font-semibold', size === 'small' ? 'text-xs leading-[18px]' : 'text-sm', className)}
    data-component="ActionList.Heading"
  >
    {children}
  </Component>
)

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
;('use client')
