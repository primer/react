import React from 'react'

import {useId} from '../hooks/useId'
import {useSlots} from '../hooks/useSlots'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {ActionListContainerContext} from './ActionListContainerContext'
import {Description} from './Description'
import {GroupContext} from './Group'
import type {ActionListItemProps, ActionListProps} from './shared'
import {Selection} from './Selection'
import {LeadingVisual, TrailingVisual, VisualOrIndicator} from './Visuals'
import {ItemContext, ListContext} from './shared'
import {TrailingAction} from './TrailingAction'
import {ConditionalWrapper} from '../internal/components/ConditionalWrapper'
import {invariant} from '../utils/invariant'
import VisuallyHidden from '../_VisuallyHidden'
import classes from './ActionList.module.css'
import {clsx} from 'clsx'

type ActionListSubItemProps = {
  children?: React.ReactNode
}

export const SubItem: React.FC<ActionListSubItemProps> = ({children}) => {
  return <>{children}</>
}

SubItem.displayName = 'ActionList.SubItem'

const ButtonItemContainerNoBox = React.forwardRef(({children, style, ...props}, forwardedRef) => {
  return (
    <button type="button" ref={forwardedRef as React.Ref<HTMLButtonElement>} style={style} {...props}>
      {children}
    </button>
  )
}) as PolymorphicForwardRefComponent<React.ElementType, ActionListItemProps>

const DivItemContainerNoBox = React.forwardRef(({children, ...props}, forwardedRef) => {
  return (
    <div ref={forwardedRef as React.Ref<HTMLDivElement>} {...props}>
      {children}
    </div>
  )
}) as PolymorphicForwardRefComponent<React.ElementType, ActionListItemProps>

export const Item = React.forwardRef<HTMLLIElement, ActionListItemProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      disabled = false,
      inactiveText,
      selected = undefined,
      active = false,
      onSelect: onSelectUser,
      id,
      role,
      loading,
      _PrivateItemWrapper,
      className,
      groupId: _groupId,
      renderItem: _renderItem,
      handleAddItem: _handleAddItem,
      ...props
    },
    forwardedRef,
  ): JSX.Element => {
    const baseSlots = {
      leadingVisual: LeadingVisual,
      trailingVisual: TrailingVisual,
      trailingAction: TrailingAction,
      subItem: SubItem,
    }

    const [partialSlots, childrenWithoutSlots] = useSlots(props.children, {...baseSlots, description: Description})

    const slots = {description: undefined, ...partialSlots}

    const {container, afterSelect, selectionAttribute, defaultTrailingVisual} =
      React.useContext(ActionListContainerContext)

    // Be sure to avoid rendering the container unless there is a default
    const wrappedDefaultTrailingVisual = defaultTrailingVisual ? (
      <TrailingVisual>{defaultTrailingVisual}</TrailingVisual>
    ) : null
    const trailingVisual = slots.trailingVisual ?? wrappedDefaultTrailingVisual

    const {role: listRole, selectionVariant: listSelectionVariant} = React.useContext(ListContext)
    const {selectionVariant: groupSelectionVariant} = React.useContext(GroupContext)
    const inactive = Boolean(inactiveText)
    // TODO change `menuContext` check to ```listRole !== undefined && ['menu', 'listbox'].includes(listRole)```
    // once we have a better way to handle existing usage in dotcom that incorrectly use ActionList.TrailingAction
    const menuContext = container === 'ActionMenu' || container === 'SelectPanel' || container === 'FilteredActionList'
    // TODO: when we change `menuContext` to check `listRole` instead of `container`
    const showInactiveIndicator = inactive && !(listRole !== undefined && ['menu', 'listbox'].includes(listRole))

    const onSelect = React.useCallback(
      (
        event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        afterSelect?: Function,
      ) => {
        if (typeof onSelectUser === 'function') onSelectUser(event)
        if (event.defaultPrevented) return
        if (typeof afterSelect === 'function') afterSelect(event)
      },
      [onSelectUser],
    )

    const selectionVariant: ActionListProps['selectionVariant'] = groupSelectionVariant
      ? groupSelectionVariant
      : listSelectionVariant

    /** Infer item role based on the container */
    let inferredItemRole: ActionListItemProps['role']
    if (container === 'ActionMenu') {
      if (selectionVariant === 'single') inferredItemRole = 'menuitemradio'
      else if (selectionVariant === 'multiple') inferredItemRole = 'menuitemcheckbox'
      else inferredItemRole = 'menuitem'
    } else if (listRole === 'listbox') {
      if (selectionVariant !== undefined && !role) inferredItemRole = 'option'
    }

    const itemRole = role || inferredItemRole

    if (slots.trailingAction) {
      invariant(
        !menuContext,
        `ActionList.TrailingAction can not be used within a list with an ARIA role of "menu" or "listbox".`,
      )
    }

    /** Infer the proper selection attribute based on the item's role */
    let inferredSelectionAttribute: 'aria-selected' | 'aria-checked' | undefined
    if (itemRole === 'menuitemradio' || itemRole === 'menuitemcheckbox') inferredSelectionAttribute = 'aria-checked'
    else if (itemRole === 'option') inferredSelectionAttribute = 'aria-selected'

    const itemSelectionAttribute = selectionAttribute || inferredSelectionAttribute
    // Ensures ActionList.Item retains list item semantics if a valid ARIA role is applied, or if item is inactive
    const listItemSemantics =
      role === 'option' || role === 'menuitem' || role === 'menuitemradio' || role === 'menuitemcheckbox'

    const listRoleTypes = ['listbox', 'menu', 'list']
    const listSemantics = (listRole && listRoleTypes.includes(listRole)) || inactive || listItemSemantics
    const buttonSemantics = !listSemantics && !_PrivateItemWrapper

    const clickHandler = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        if (disabled || inactive || loading) return
        onSelect(event, afterSelect)
      },
      [onSelect, disabled, inactive, afterSelect, loading],
    )

    const keyPressHandler = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        if (disabled || inactive || loading) return
        if ([' ', 'Enter'].includes(event.key)) {
          if (event.key === ' ') {
            event.preventDefault() // prevent scrolling on Space
            // immediately reset defaultPrevented once its job is done
            // so as to not disturb the functions that use that event after this
            event.defaultPrevented = false
          }
          onSelect(event, afterSelect)
        }
      },
      [onSelect, disabled, loading, inactive, afterSelect],
    )

    const itemId = useId(id)
    const labelId = `${itemId}--label`
    const inlineDescriptionId = `${itemId}--inline-description`
    const blockDescriptionId = `${itemId}--block-description`
    const trailingVisualId = `${itemId}--trailing-visual`
    const inactiveWarningId = inactive && !showInactiveIndicator ? `${itemId}--warning-message` : undefined

    const DefaultItemWrapper = listSemantics ? DivItemContainerNoBox : ButtonItemContainerNoBox

    const ItemWrapper = _PrivateItemWrapper || DefaultItemWrapper

    // only apply aria-selected and aria-checked to selectable items
    const selectableRoles = ['menuitemradio', 'menuitemcheckbox', 'option']
    const includeSelectionAttribute = itemSelectionAttribute && itemRole && selectableRoles.includes(itemRole)

    let focusable

    if (showInactiveIndicator) {
      focusable = true
    }

    // Extract the variant prop value from the description slot component
    const descriptionVariant = slots.description?.props.variant ?? 'inline'

    const menuItemProps = {
      onClick: clickHandler,
      onKeyPress: !buttonSemantics ? keyPressHandler : undefined,
      'aria-disabled': disabled ? true : undefined,
      'data-inactive': inactive ? true : undefined,
      'data-loading': loading && !inactive ? true : undefined,
      tabIndex: focusable ? undefined : 0,
      'aria-labelledby': `${labelId} ${slots.trailingVisual ? trailingVisualId : ''} ${
        slots.description && descriptionVariant === 'inline' ? inlineDescriptionId : ''
      }`,
      'aria-describedby':
        [
          slots.description && descriptionVariant === 'block' ? blockDescriptionId : undefined,
          inactiveWarningId ?? undefined,
        ]
          .filter(String)
          .join(' ')
          .trim() || undefined,
      ...(includeSelectionAttribute && {[itemSelectionAttribute]: selected}),
      role: itemRole,
      id: itemId,
    }

    const containerProps = _PrivateItemWrapper
      ? {role: itemRole ? 'none' : undefined, ...props}
      : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (listSemantics && {...menuItemProps, ...props, ref: forwardedRef}) || {}

    const wrapperProps = _PrivateItemWrapper
      ? menuItemProps
      : !listSemantics && {
          ...menuItemProps,
          ...props,
          ref: forwardedRef,
        }

    return (
      <ItemContext.Provider
        value={{
          variant,
          size,
          disabled,
          inactive: Boolean(inactiveText),
          inlineDescriptionId,
          blockDescriptionId,
          trailingVisualId,
        }}
      >
        <li
          {...containerProps}
          ref={listSemantics ? forwardedRef : null}
          data-variant={variant === 'danger' ? variant : undefined}
          data-active={active ? true : undefined}
          data-inactive={inactiveText ? true : undefined}
          data-has-subitem={slots.subItem ? true : undefined}
          data-has-description={slots.description ? true : false}
          className={clsx(classes.ActionListItem, className)}
        >
          <ItemWrapper {...wrapperProps} className={classes.ActionListContent} data-size={size}>
            <span className={classes.Spacer} />
            <Selection selected={selected} className={classes.LeadingAction} />
            <VisualOrIndicator
              inactiveText={showInactiveIndicator ? inactiveText : undefined}
              itemHasLeadingVisual={Boolean(slots.leadingVisual)}
              labelId={labelId}
              loading={loading}
              position="leading"
            >
              {slots.leadingVisual}
            </VisualOrIndicator>
            <span className={classes.ActionListSubContent} data-component="ActionList.Item--DividerContainer">
              <ConditionalWrapper
                if={!!slots.description}
                className={classes.ItemDescriptionWrap}
                data-description-variant={descriptionVariant}
              >
                <span id={labelId} className={classes.ItemLabel}>
                  {childrenWithoutSlots}
                  {/* Loading message needs to be in here so it is read with the label */}
                  {/* If the item is inactive, we do not simultaneously announce that it is loading */}
                  {loading === true && !inactive && <VisuallyHidden>Loading</VisuallyHidden>}
                </span>
                {slots.description}
              </ConditionalWrapper>
              <VisualOrIndicator
                inactiveText={showInactiveIndicator ? inactiveText : undefined}
                itemHasLeadingVisual={Boolean(slots.leadingVisual)}
                labelId={labelId}
                loading={loading}
                position="trailing"
              >
                {trailingVisual}
              </VisualOrIndicator>

              {
                // If the item is inactive, but it's not in an overlay (e.g. ActionMenu, SelectPanel),
                // render the inactive warning message directly in the item.
                !showInactiveIndicator && inactiveText ? (
                  <span className={classes.InactiveWarning} id={inactiveWarningId}>
                    {inactiveText}
                  </span>
                ) : null
              }
            </span>
          </ItemWrapper>
          {!inactive && !loading && !menuContext && Boolean(slots.trailingAction) && slots.trailingAction}
          {slots.subItem}
        </li>
      </ItemContext.Provider>
    )
  },
) as PolymorphicForwardRefComponent<'li', ActionListItemProps>

Item.displayName = 'ActionList.Item'
