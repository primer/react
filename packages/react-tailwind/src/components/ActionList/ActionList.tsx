import {CheckIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {ButtonBase, type ButtonBaseProps} from '../Button'
import {getSelectionAttribute, getSelectionRole, type SelectionVariant} from './selectionUtils'

type ListContextValue = {
  role?: 'list' | 'listbox' | 'menu'
  selectionVariant?: SelectionVariant
}

const ListContext = React.createContext<ListContextValue>({})

const listClassName = 'm-0 list-none p-0 text-sm text-default'
const itemClassName =
  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-default hover:bg-neutral-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emphasis data-[disabled]:cursor-not-allowed data-[disabled]:text-disabled'

export interface ActionListRootProps extends React.ComponentPropsWithoutRef<'ul'> {
  selectionVariant?: SelectionVariant
  variant?: 'inset' | 'horizontal-inset' | 'full'
  showDividers?: boolean
}

const Root = React.forwardRef<HTMLUListElement, ActionListRootProps>(function ActionListRoot(
  {children, className, role = 'list', selectionVariant, showDividers = false, variant = 'inset', ...rest},
  ref,
) {
  const listRole = (
    role === 'list' || role === 'listbox' || role === 'menu' ? role : undefined
  ) as ListContextValue['role']
  return (
    <ListContext.Provider value={{role: listRole, selectionVariant}}>
      <ul
        {...rest}
        ref={ref}
        role={role}
        className={cn(listClassName, variant !== 'full' && 'px-2', className)}
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
  extends Omit<ButtonBaseProps, 'data-component' | 'children' | 'className' | 'disabled' | 'onSelect'> {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  selected?: boolean
  active?: boolean
  variant?: 'default' | 'danger'
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
}

const Item = React.forwardRef<HTMLElement, ActionListItemProps>(function ActionListItem(
  {
    active,
    children,
    className,
    disabled,
    onClick,
    onSelect: onSelectItem,
    role: roleProp,
    selected,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const {role: listRole, selectionVariant} = React.useContext(ListContext)
  const role = roleProp ?? getSelectionRole(listRole, selectionVariant)
  const selectionAttribute = getSelectionAttribute(role)

  return (
    <li role={listRole === 'menu' || listRole === 'listbox' ? 'none' : undefined} data-component="ActionList.Item">
      <ButtonBase
        {...rest}
        ref={ref}
        role={role}
        disabled={disabled}
        aria-selected={selectionAttribute === 'aria-selected' ? selected : undefined}
        aria-checked={selectionAttribute === 'aria-checked' ? selected : undefined}
        onClick={event => {
          onClick?.(event)
          if (!event.defaultPrevented) onSelectItem?.(event)
        }}
        className={cn(
          itemClassName,
          variant === 'danger' && 'text-danger-fg hover:bg-danger-subtle',
          selected && 'bg-accent-muted',
          active && 'ring-2 ring-accent-emphasis',
          className,
        )}
        data-component="ActionList.Item.Action"
        data-active={active || undefined}
        data-selected={selected || undefined}
        data-variant={variant === 'danger' ? variant : undefined}
      >
        {selectionVariant && selected ? <CheckIcon aria-hidden="true" className="shrink-0" /> : null}
        {children}
      </ButtonBase>
    </li>
  )
})

export interface ActionListLinkItemProps extends React.ComponentPropsWithoutRef<'a'> {
  selected?: boolean
  variant?: 'default' | 'danger'
}

const LinkItem = React.forwardRef<HTMLAnchorElement, ActionListLinkItemProps>(function ActionListLinkItem(
  {children, className, selected, variant = 'default', ...rest},
  ref,
) {
  return (
    <li data-component="ActionList.LinkItem">
      <a
        {...rest}
        ref={ref}
        className={cn(
          itemClassName,
          variant === 'danger' && 'text-danger-fg hover:bg-danger-subtle',
          selected && 'bg-accent-muted',
          className,
        )}
        data-selected={selected || undefined}
      >
        {children}
      </a>
    </li>
  )
})

export interface ActionListGroupProps extends Omit<React.ComponentPropsWithoutRef<'li'>, 'title'> {
  title?: React.ReactNode
  selectionVariant?: SelectionVariant
}

const Group = React.forwardRef<HTMLLIElement, ActionListGroupProps>(function ActionListGroup(
  {children, selectionVariant, title, ...rest},
  ref,
) {
  const context = React.useContext(ListContext)
  return (
    <li
      {...rest}
      ref={ref}
      role={context.role === 'menu' || context.role === 'listbox' ? 'none' : rest.role}
      data-component="ActionList.Group"
    >
      <ListContext.Provider value={{...context, selectionVariant: selectionVariant ?? context.selectionVariant}}>
        {title ? <GroupHeading>{title}</GroupHeading> : null}
        <ul
          className="m-0 list-none p-0"
          role={context.role === 'menu' || context.role === 'listbox' ? 'group' : undefined}
        >
          {children}
        </ul>
      </ListContext.Provider>
    </li>
  )
})

export interface ActionListGroupHeadingProps extends React.ComponentPropsWithoutRef<'h3'> {
  as?: React.ElementType
}

const GroupHeading = React.forwardRef<HTMLElement, ActionListGroupHeadingProps>(function ActionListGroupHeading(
  {as: Component = 'h3', className, ...rest},
  ref,
) {
  const {role} = React.useContext(ListContext)
  return (
    <Component
      {...rest}
      ref={ref}
      role={role === 'menu' || role === 'listbox' ? 'presentation' : undefined}
      className={cn('px-2 pb-1 pt-3 text-xs font-semibold text-muted', className)}
      data-component="ActionList.GroupHeading"
    />
  )
})

const Divider = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  function ActionListDivider(props, ref) {
    return (
      <li
        {...props}
        ref={ref}
        role="separator"
        className={cn('my-1 border-t border-default', props.className)}
        data-component="ActionList.Divider"
      />
    )
  },
)

const LeadingVisual = ({className, ...props}: React.ComponentPropsWithoutRef<'span'>) => (
  <span {...props} className={cn('shrink-0 text-muted', className)} data-component="ActionList.LeadingVisual" />
)
const TrailingVisual = ({className, ...props}: React.ComponentPropsWithoutRef<'span'>) => (
  <span
    {...props}
    className={cn('ml-auto shrink-0 text-muted', className)}
    data-component="ActionList.TrailingVisual"
  />
)
const Description = ({className, ...props}: React.ComponentPropsWithoutRef<'span'>) => (
  <span {...props} className={cn('block text-xs text-muted', className)} data-component="ActionList.Description" />
)
const Heading = ({children, className, ...props}: React.ComponentPropsWithoutRef<'h2'>) => (
  <h2 {...props} className={cn('px-2 py-1 text-sm font-semibold', className)} data-component="ActionList.Heading">
    {children}
  </h2>
)

export const ActionList = Object.assign(Root, {
  Root,
  Item,
  LinkItem,
  Group,
  GroupHeading,
  Divider,
  LeadingVisual,
  TrailingVisual,
  Description,
  Heading,
})

ActionList.displayName = 'ActionList'
