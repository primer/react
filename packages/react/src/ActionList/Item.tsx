import React from 'react'
import styled from 'styled-components'

import Box from '../Box'
import {useId} from '../hooks/useId'
import {useSlots} from '../hooks/useSlots'
import type {BetterSystemStyleObject, SxProp} from '../sx'
import sx, {merge} from '../sx'
import {useTheme} from '../ThemeProvider'
import {defaultSxProp} from '../utils/defaultSxProp'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {ActionListContainerContext} from './ActionListContainerContext'
import {Description} from './Description'
import {GroupContext} from './Group'
import type {ActionListItemProps, ActionListProps} from './shared'
import {Selection} from './Selection'
import {LeadingVisual, TrailingVisual, VisualOrIndicator} from './Visuals'
import {getVariantStyles, ItemContext, ListContext} from './shared'
import {TrailingAction} from './TrailingAction'
import {ConditionalWrapper} from '../internal/components/ConditionalWrapper'
import {invariant} from '../utils/invariant'
import {useFeatureFlag} from '../FeatureFlags'
import VisuallyHidden from '../_VisuallyHidden'
import classes from './ActionList.module.css'
import {clsx} from 'clsx'

import {actionListCssModulesFlag} from './featureflag'

const LiBox = styled.li<SxProp>(sx)

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
      disabled = false,
      inactiveText,
      selected = undefined,
      active = false,
      onSelect: onSelectUser,
      sx: sxProp = defaultSxProp,
      id,
      role,
      loading,
      _PrivateItemWrapper,
      className,
      ...props
    },
    forwardedRef,
  ): JSX.Element => {
    const enabled = useFeatureFlag(actionListCssModulesFlag)

    const baseSlots = {
      leadingVisual: LeadingVisual,
      trailingVisual: TrailingVisual,
      trailingAction: TrailingAction,
      subItem: SubItem,
    }

    const [partialSlots, childrenWithoutSlots] = useSlots(
      props.children,
      enabled
        ? {...baseSlots, description: Description}
        : {
            ...baseSlots,
            blockDescription: [Description, props => props.variant === 'block'],
            inlineDescription: [Description, props => props.variant !== 'block'],
          },
    )

    const slots = {blockDescription: undefined, inlineDescription: undefined, description: undefined, ...partialSlots}

    const {container, afterSelect, selectionAttribute, defaultTrailingVisual} =
      React.useContext(ActionListContainerContext)

    // Be sure to avoid rendering the container unless there is a default
    const wrappedDefaultTrailingVisual = defaultTrailingVisual ? (
      <TrailingVisual>{defaultTrailingVisual}</TrailingVisual>
    ) : null
    const trailingVisual = slots.trailingVisual ?? wrappedDefaultTrailingVisual

    const {
      variant: listVariant,
      role: listRole,
      showDividers,
      selectionVariant: listSelectionVariant,
    } = React.useContext(ListContext)
    const {selectionVariant: groupSelectionVariant} = React.useContext(GroupContext)
    const inactive = Boolean(inactiveText)
    const showInactiveIndicator = inactive && container === undefined

    const onSelect = React.useCallback(
      (
        event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
        // eslint-disable-next-line @typescript-eslint/ban-types
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
    } else if (container === 'SelectPanel' && listRole === 'listbox') {
      if (selectionVariant !== undefined) inferredItemRole = 'option'
    }

    const itemRole = role || inferredItemRole
    const menuContext = container === 'ActionMenu' || container === 'SelectPanel'

    if (slots.trailingAction) {
      invariant(!menuContext, `ActionList.TrailingAction can not be used within a ${container}.`)
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
    const listSemantics = (listRole && listRoleTypes.includes(listRole)) || inactive || listItemSemantics || !enabled
    const buttonSemantics = !listSemantics && !_PrivateItemWrapper

    const {theme} = useTheme()

    const activeStyles = {
      fontWeight: 'bold',
      bg: 'actionListItem.default.selectedBg',
      '&::after': {
        position: 'absolute',
        top: 'calc(50% - 12px)',
        left: -2,
        width: '4px',
        height: '24px',
        content: '""',
        bg: 'var(--borderColor-accent-emphasis)',
        borderRadius: 2,
      },
    }

    const styles = {
      position: 'relative',
      display: 'flex',
      paddingX: 2,
      fontSize: 1,
      paddingY: '6px', // custom value off the scale
      lineHeight: '16px',
      minHeight: 5,
      marginX: listVariant === 'inset' ? 2 : 0,
      borderRadius: 2,
      transition: 'background 33.333ms linear',
      color: getVariantStyles(variant, disabled, inactive || loading).color,
      cursor: 'pointer',
      '&[data-loading]': {
        cursor: 'default',
      },
      '&[aria-disabled], &[data-inactive]': {
        cursor: 'not-allowed',
        '[data-component="ActionList.Checkbox"]': {
          cursor: 'not-allowed',
          bg: selected ? 'fg.muted' : 'var(--control-bgColor-disabled, rgba(175, 184, 193, 0.2))',
          borderColor: selected ? 'fg.muted' : 'var(--color-input-disabled-bg, rgba(175, 184, 193, 0.2))',
        },
        '[data-component="ActionList.Selection"]': {
          color: 'primer.fg.disabled',
        },
      },

      // Button reset styles (to support as="button")
      appearance: 'none',
      background: 'unset',
      border: 'unset',
      width: listVariant === 'inset' ? 'calc(100% - 16px)' : '100%',
      fontFamily: 'unset',
      textAlign: 'unset',
      marginY: 'unset',

      '@media (forced-colors: active)': {
        ':focus, &:focus-visible, > a.focus-visible, &[data-is-active-descendant]': {
          // Support for Windows high contrast https://sarahmhigley.com/writing/whcm-quick-tips
          outline: 'solid 1px transparent !important',
        },
      },

      '@media (hover: hover) and (pointer: fine)': {
        '&:hover:not([aria-disabled]):not([data-inactive])': {
          backgroundColor: `actionListItem.${variant}.hoverBg`,
          color: getVariantStyles(variant, disabled, inactive).hoverColor,
          boxShadow: `inset 0 0 0 max(1px, 0.0625rem) ${theme?.colors.actionListItem.default.activeBorder}`,
        },
        '&:focus-visible, > a.focus-visible, &:focus.focus-visible': {
          outline: 'none',
          border: `2 solid`,
          boxShadow: `0 0 0 2px var(--focus-outlineColor)`,
        },
        '&:active:not([aria-disabled]):not([data-inactive])': {
          backgroundColor: `actionListItem.${variant}.activeBg`,
          color: getVariantStyles(variant, disabled, inactive).hoverColor,
        },
      },

      /** Divider styles */
      '[data-component="ActionList.Item--DividerContainer"]': {
        position: 'relative',
      },
      '[data-component="ActionList.Item--DividerContainer"]::before': {
        content: '" "',
        display: 'block',
        position: 'absolute',
        width: '100%',
        top: '-7px',
        border: '0 solid',
        borderTopWidth: showDividers ? `1px` : '0',
        borderColor: 'var(--divider-color, transparent)',
      },

      // show between 2 items
      ':not(:first-of-type)': {'--divider-color': theme?.colors.actionListItem.inlineDivider},
      // hide divider after dividers & group header, with higher importance!
      '[data-component="ActionList.Divider"] + &': {'--divider-color': 'transparent !important'},
      // hide border on current and previous item
      '&:hover:not([aria-disabled]):not([data-inactive]):not([data-loading]), &[data-focus-visible-added]:not([aria-disabled]):not([data-inactive])':
        {
          '--divider-color': 'transparent',
        },
      '&:hover:not([aria-disabled]):not([data-inactive]):not([data-loading]) + &, &[data-focus-visible-added] + li': {
        '--divider-color': 'transparent',
      },

      /** Active styles */
      ...(active ? activeStyles : {}), // NavList
      '&[data-is-active-descendant]': {...activeStyles, fontWeight: 'normal'}, // SelectPanel
    }

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
            // immediately reset defaultPrevented once it's job is done
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

    let DefaultItemWrapper = React.Fragment
    if (enabled) {
      DefaultItemWrapper = listSemantics ? DivItemContainerNoBox : ButtonItemContainerNoBox
    } else {
      DefaultItemWrapper = React.Fragment
    }

    const ItemWrapper = _PrivateItemWrapper || DefaultItemWrapper

    // only apply aria-selected and aria-checked to selectable items
    const selectableRoles = ['menuitemradio', 'menuitemcheckbox', 'option']
    const includeSelectionAttribute = itemSelectionAttribute && itemRole && selectableRoles.includes(itemRole)

    let focusable

    // if item is disabled and is of type (menuitem*, option) it should remain focusable, if inactive, apply the same rules
    if ((disabled && !inferredItemRole) || showInactiveIndicator) {
      focusable = true
    }

    const menuItemProps = {
      onClick: clickHandler,
      onKeyPress: !buttonSemantics ? keyPressHandler : undefined,
      'aria-disabled': disabled ? true : undefined,
      'data-inactive': inactive ? true : undefined,
      'data-loading': loading && !inactive ? true : undefined,
      tabIndex: focusable ? undefined : 0,
      'aria-labelledby': `${labelId} ${slots.trailingVisual ? trailingVisualId : ''} ${
        slots.inlineDescription ? inlineDescriptionId : ''
      }`,
      'aria-describedby':
        [slots.blockDescription ? blockDescriptionId : undefined, inactiveWarningId ?? undefined]
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

    // Extract the variant prop value from the description slot component

    const descriptionVariant = slots.description?.props.variant ?? 'inline'

    if (enabled) {
      if (sxProp !== defaultSxProp) {
        return (
          <ItemContext.Provider
            value={{
              variant,
              disabled,
              inactive: Boolean(inactiveText),
              inlineDescriptionId,
              blockDescriptionId,
              trailingVisualId,
            }}
          >
            <LiBox
              {...containerProps}
              sx={sxProp}
              ref={listSemantics ? forwardedRef : null}
              data-variant={variant === 'danger' ? variant : undefined}
              data-active={active ? true : undefined}
              data-inactive={inactiveText ? true : undefined}
              data-has-subitem={slots.subItem ? true : undefined}
              className={clsx(classes.ActionListItem, className)}
            >
              <ItemWrapper {...wrapperProps} className={classes.ActionListContent}>
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
                <span className={classes.ActionListSubContent}>
                  <ConditionalWrapper
                    if={!!slots.description}
                    className={classes.ItemDescriptionWrap}
                    data-description-variant={descriptionVariant}
                  >
                    <span id={labelId} className={classes.ItemLabel}>
                      {childrenWithoutSlots}
                      {/* Loading message needs to be in here so it is read with the label */}
                      {loading === true && <VisuallyHidden>Loading</VisuallyHidden>}
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
                    inactive && container ? (
                      <span className={classes.InactiveWarning} id={inactiveWarningId}>
                        {inactiveText}
                      </span>
                    ) : null
                  }
                </span>
              </ItemWrapper>
              {!inactive && !loading && !menuContext && Boolean(slots.trailingAction) && slots.trailingAction}
              {slots.subItem}
            </LiBox>
          </ItemContext.Provider>
        )
      }
      return (
        <ItemContext.Provider
          value={{
            variant,
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
            className={clsx(classes.ActionListItem, className)}
          >
            <ItemWrapper {...wrapperProps} className={classes.ActionListContent}>
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
              <span className={classes.ActionListSubContent}>
                <ConditionalWrapper
                  if={!!slots.description}
                  className={classes.ItemDescriptionWrap}
                  data-description-variant={descriptionVariant}
                >
                  <span id={labelId} className={classes.ItemLabel}>
                    {childrenWithoutSlots}
                    {/* Loading message needs to be in here so it is read with the label */}
                    {loading === true && <VisuallyHidden>Loading</VisuallyHidden>}
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
                  inactive && container ? (
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
    }

    return (
      <ItemContext.Provider
        value={{
          variant,
          disabled,
          inactive: Boolean(inactiveText),
          inlineDescriptionId,
          blockDescriptionId,
          trailingVisualId,
        }}
      >
        <LiBox
          ref={listSemantics ? forwardedRef : null}
          className={className}
          sx={merge<BetterSystemStyleObject>(styles, sxProp)}
          data-variant={variant === 'danger' ? variant : undefined}
          {...containerProps}
        >
          <ItemWrapper {...wrapperProps}>
            <Selection selected={selected} />
            <VisualOrIndicator
              inactiveText={showInactiveIndicator ? inactiveText : undefined}
              itemHasLeadingVisual={Boolean(slots.leadingVisual)}
              labelId={labelId}
              loading={loading}
              position="leading"
            >
              {slots.leadingVisual}
            </VisualOrIndicator>
            <Box
              data-component="ActionList.Item--DividerContainer"
              sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0}}
            >
              <ConditionalWrapper
                // we need a flex container if:
                // - there is a trailing visual
                // - OR there is a loading or inactive indicator
                // - AND no leading visual to replace with an indicator
                if={Boolean(trailingVisual || ((showInactiveIndicator || loading) && !slots.leadingVisual))}
                sx={{display: 'flex', flexGrow: 1}}
              >
                <ConditionalWrapper
                  if={!!slots.inlineDescription}
                  sx={{display: 'flex', flexGrow: 1, alignItems: 'baseline', minWidth: 0}}
                >
                  <Box
                    as="span"
                    id={labelId}
                    sx={{
                      flexGrow: slots.inlineDescription ? 0 : 1,
                      fontWeight: slots.inlineDescription || slots.blockDescription || active ? 'bold' : 'normal',
                      marginBlockEnd: slots.blockDescription ? '4px' : undefined,
                      wordBreak: slots.inlineDescription ? 'normal' : 'break-word',
                      lineHeight: '20px',
                    }}
                  >
                    {childrenWithoutSlots}
                    {/* Loading message needs to be in here so it is read with the label */}
                    {loading === true && <VisuallyHidden>Loading</VisuallyHidden>}
                  </Box>
                  {slots.inlineDescription}
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
              </ConditionalWrapper>
              {
                // If the item is inactive, but it's not in an overlay (e.g. ActionMenu, SelectPanel),
                // render the inactive warning message directly in the item.
                inactive && container ? (
                  <Box
                    as="span"
                    sx={{
                      fontSize: 0,
                      lineHeight: '16px',
                      color: 'attention.fg',
                    }}
                    id={inactiveWarningId}
                  >
                    {inactiveText}
                  </Box>
                ) : null
              }
              {slots.blockDescription}
            </Box>
          </ItemWrapper>
          {!inactive && !loading && !menuContext && Boolean(slots.trailingAction) && slots.trailingAction}
        </LiBox>
      </ItemContext.Provider>
    )
  },
) as PolymorphicForwardRefComponent<'li', ActionListItemProps>

Item.displayName = 'ActionList.Item'
