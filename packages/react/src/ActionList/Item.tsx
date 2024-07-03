import React from 'react'
import styled from 'styled-components'
import {AlertIcon} from '@primer/octicons-react'

import Box from '../Box'
import type {TooltipProps} from '../TooltipV2/Tooltip'
import {Tooltip} from '../TooltipV2/Tooltip'
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
import {getVariantStyles, ItemContext, TEXT_ROW_HEIGHT, ListContext} from './shared'
import type {VisualProps} from './Visuals'
import {LeadingVisual, TrailingVisual} from './Visuals'
import {TrailingAction} from './TrailingAction'
import {ConditionalWrapper} from '../internal/components/ConditionalWrapper'
import {invariant} from '../utils/invariant'
import {useFeatureFlag} from '../FeatureFlags'

const LiBox = styled.li<SxProp>(sx)

const InactiveIndicator: React.FC<{
  labelId: string
  text: TooltipProps['text']
  visualComponent: React.FC<React.PropsWithChildren<VisualProps>>
}> = ({labelId, text, visualComponent: VisualComponent}) => (
  <Tooltip text={text}>
    <Box
      as="button"
      sx={{
        background: 'none',
        color: 'inherit',
        border: 'none',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        display: 'flex',
      }}
      aria-labelledby={labelId}
    >
      <VisualComponent>
        <AlertIcon />
      </VisualComponent>
    </Box>
  </Tooltip>
)

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
      _PrivateItemWrapper,
      ...props
    },
    forwardedRef,
  ): JSX.Element => {
    const [slots, childrenWithoutSlots] = useSlots(props.children, {
      leadingVisual: LeadingVisual,
      trailingVisual: TrailingVisual,
      trailingAction: TrailingAction,
      blockDescription: [Description, props => props.variant === 'block'],
      inlineDescription: [Description, props => props.variant !== 'block'],
    })

    const {container, afterSelect, selectionAttribute, defaultTrailingVisual} =
      React.useContext(ActionListContainerContext)

    const buttonSemanticsFeatureFlag = useFeatureFlag('primer_react_action_list_item_as_button')

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

    if (slots.trailingAction) {
      invariant(!container, `ActionList.TrailingAction can not be used within a ${container}.`)
    }

    /** Infer the proper selection attribute based on the item's role */
    let inferredSelectionAttribute: 'aria-selected' | 'aria-checked' | undefined
    if (itemRole === 'menuitemradio' || itemRole === 'menuitemcheckbox') inferredSelectionAttribute = 'aria-checked'
    else if (itemRole === 'option') inferredSelectionAttribute = 'aria-selected'

    const itemSelectionAttribute = selectionAttribute || inferredSelectionAttribute
    // Ensures ActionList.Item retains list item semantics if a valid ARIA role is applied, or if item is inactive
    const listSemantics = listRole === 'listbox' || listRole === 'menu' || inactive || container === 'NavList'
    const buttonSemantics = !listSemantics && !_PrivateItemWrapper && buttonSemanticsFeatureFlag

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
        bg: 'accent.fg',
        borderRadius: 2,
      },
    }

    const hoverStyles = {
      '@media (hover: hover) and (pointer: fine)': {
        ':hover:not([aria-disabled]):not([data-inactive])': {
          backgroundColor: `actionListItem.${variant}.hoverBg`,
          color: getVariantStyles(variant, disabled, inactive).hoverColor,
          boxShadow: `inset 0 0 0 max(1px, 0.0625rem) ${theme?.colors.actionListItem.default.activeBorder}`,
        },
        '&:focus-visible, > a.focus-visible, &:focus.focus-visible': {
          outline: 'none',
          border: `2 solid`,
          boxShadow: `0 0 0 2px ${theme?.colors.accent.emphasis}`,
        },
        ':active:not([aria-disabled]):not([data-inactive])': {
          backgroundColor: `actionListItem.${variant}.activeBg`,
          color: getVariantStyles(variant, disabled, inactive).hoverColor,
        },
      },
    }

    const listItemStyles = {
      display: 'flex',
      // show between 2 items
      ':not(:first-of-type)': {'--divider-color': theme?.colors.actionListItem.inlineDivider},
      width: 'calc(100% - 16px)',
      marginX: buttonSemantics ? '2' : '0',
      ...(buttonSemantics ? hoverStyles : {}),
    }

    const styles = {
      position: 'relative',
      display: 'flex',
      paddingX: 2,
      fontSize: 1,
      paddingY: '6px', // custom value off the scale
      lineHeight: TEXT_ROW_HEIGHT,
      minHeight: 5,
      marginX: listVariant === 'inset' && !buttonSemantics ? 2 : 0,
      borderRadius: 2,
      transition: 'background 33.333ms linear',
      color: getVariantStyles(variant, disabled, inactive).color,
      cursor: 'pointer',
      '&[aria-disabled], &[data-inactive]': {
        cursor: 'not-allowed',
        '[data-component="ActionList.Checkbox"]': {
          cursor: 'not-allowed',
          bg: selected ? 'fg.muted' : 'var(--color-input-disabled-bg, rgba(175, 184, 193, 0.2))',
          borderColor: selected ? 'fg.muted' : 'var(--color-input-disabled-bg, rgba(175, 184, 193, 0.2))',
        },
      },

      // Button reset styles (to support as="button")
      appearance: 'none',
      background: 'unset',
      border: 'unset',
      width: listVariant === 'inset' && !buttonSemantics ? 'calc(100% - 16px)' : '100%',
      fontFamily: 'unset',
      textAlign: 'unset',
      marginY: 'unset',

      '@media (hover: hover) and (pointer: fine)': {
        ':hover:not([aria-disabled]):not([data-inactive])': {
          backgroundColor: `actionListItem.${variant}.hoverBg`,
          color: getVariantStyles(variant, disabled, inactive).hoverColor,
          boxShadow: `inset 0 0 0 max(1px, 0.0625rem) ${theme?.colors.actionListItem.default.activeBorder}`,
        },
        '&:focus-visible, > a.focus-visible, &:focus.focus-visible': {
          outline: 'none',
          border: `2 solid`,
          boxShadow: `0 0 0 2px ${theme?.colors.accent.emphasis}`,
        },
        ':active:not([aria-disabled]):not([data-inactive])': {
          backgroundColor: `actionListItem.${variant}.activeBg`,
          color: getVariantStyles(variant, disabled, inactive).hoverColor,
        },
      },

      '@media (forced-colors: active)': {
        ':focus, &:focus-visible, > a.focus-visible': {
          // Support for Windows high contrast https://sarahmhigley.com/writing/whcm-quick-tips
          outline: 'solid 1px transparent !important',
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
      '&:hover:not([aria-disabled]):not([data-inactive]), &:focus:not([aria-disabled]):not([data-inactive]), &[data-focus-visible-added]:not([aria-disabled]):not([data-inactive])':
        {
          '--divider-color': 'transparent',
        },
      '&:hover:not([aria-disabled]):not([data-inactive]) + &, &[data-focus-visible-added] + li': {
        '--divider-color': 'transparent',
      },
      ...(active ? activeStyles : {}),
    }

    const clickHandler = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        if (disabled || inactive) return
        onSelect(event, afterSelect)
      },
      [onSelect, disabled, inactive, afterSelect],
    )

    const keyPressHandler = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        if (disabled || inactive) return
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
      [onSelect, disabled, inactive, afterSelect],
    )

    const itemId = useId(id)
    const labelId = `${itemId}--label`
    const inlineDescriptionId = `${itemId}--inline-description`
    const blockDescriptionId = `${itemId}--block-description`
    const inactiveWarningId = inactive && !showInactiveIndicator ? `${itemId}--warning-message` : undefined

    const ButtonItemWrapper = React.forwardRef(({as: Component = 'button', children, ...props}, forwardedRef) => {
      return (
        <Box
          as={Component as React.ElementType}
          sx={merge<BetterSystemStyleObject>(styles, sxProp)}
          ref={forwardedRef}
          {...props}
        >
          {children}
        </Box>
      )
    }) as PolymorphicForwardRefComponent<React.ElementType, ActionListItemProps>

    let DefaultItemWrapper = React.Fragment
    if (buttonSemanticsFeatureFlag) {
      DefaultItemWrapper = listSemantics ? React.Fragment : ButtonItemWrapper
    }

    const ItemWrapper = _PrivateItemWrapper || DefaultItemWrapper

    // only apply aria-selected and aria-checked to selectable items
    const selectableRoles = ['menuitemradio', 'menuitemcheckbox', 'option']
    const includeSelectionAttribute = itemSelectionAttribute && itemRole && selectableRoles.includes(itemRole)

    const menuItemProps = {
      onClick: clickHandler,
      onKeyPress: keyPressHandler,
      'aria-disabled': disabled ? true : undefined,
      'data-inactive': inactive ? true : undefined,
      tabIndex: disabled || showInactiveIndicator ? undefined : 0,
      'aria-labelledby': `${labelId} ${slots.inlineDescription ? inlineDescriptionId : ''}`,
      'aria-describedby': slots.blockDescription
        ? [blockDescriptionId, inactiveWarningId].join(' ')
        : inactiveWarningId,
      ...(includeSelectionAttribute && {[itemSelectionAttribute]: selected}),
      role: itemRole,
      id: itemId,
    }

    let containerProps
    let wrapperProps

    if (buttonSemanticsFeatureFlag) {
      containerProps = _PrivateItemWrapper
        ? {role: itemRole ? 'none' : undefined, ...props}
        : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          (listSemantics && {...menuItemProps, ...props, ref: forwardedRef}) || {}

      wrapperProps = _PrivateItemWrapper
        ? menuItemProps
        : !listSemantics && {
            ...menuItemProps,
            ...props,
            styles: merge<BetterSystemStyleObject>(styles, sxProp),
            ref: forwardedRef,
          }
    } else {
      containerProps = _PrivateItemWrapper ? {role: itemRole ? 'none' : undefined} : {...menuItemProps, ...props}
      wrapperProps = _PrivateItemWrapper ? menuItemProps : {}
    }

    return (
      <ItemContext.Provider
        value={{variant, disabled, inactive: Boolean(inactiveText), inlineDescriptionId, blockDescriptionId}}
      >
        <LiBox
          ref={!buttonSemanticsFeatureFlag || listSemantics ? forwardedRef : null}
          sx={
            buttonSemanticsFeatureFlag
              ? merge<BetterSystemStyleObject>(
                  listSemantics || _PrivateItemWrapper ? styles : listItemStyles,
                  listSemantics || _PrivateItemWrapper ? sxProp : {},
                )
              : merge<BetterSystemStyleObject>(styles, sxProp)
          }
          data-variant={variant === 'danger' ? variant : undefined}
          {...containerProps}
        >
          <ItemWrapper {...wrapperProps}>
            <Selection selected={selected} />
            {
              // If we're showing an inactive indicator and a leading visual has been passed,
              // replace the leading visual with the inactive indicator.
              //
              // Inactive items without a leading visual place the inactive indicator in the
              // trailing visual slot. This preserves the left alignment of item text.
              showInactiveIndicator && slots.leadingVisual ? (
                <InactiveIndicator labelId={labelId} text={inactiveText!} visualComponent={LeadingVisual} />
              ) : (
                // If it's not inactive, just render the leading visual slot
                slots.leadingVisual
              )
            }
            <Box
              data-component="ActionList.Item--DividerContainer"
              sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0}}
            >
              <ConditionalWrapper
                if={Boolean(trailingVisual) || (showInactiveIndicator && !slots.leadingVisual)}
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
                      wordBreak: 'break-word',
                    }}
                  >
                    {childrenWithoutSlots}
                  </Box>
                  {slots.inlineDescription}
                </ConditionalWrapper>
                {
                  // If we're showing an inactive indicator and a leading visual has NOT been passed,
                  // replace the trailing visual with the inactive indicator.
                  //
                  // This preserves the left alignment of item text.
                  showInactiveIndicator && !slots.leadingVisual ? (
                    <InactiveIndicator labelId={labelId} text={inactiveText!} visualComponent={TrailingVisual} />
                  ) : (
                    // If it's not inactive, or it has a leading visual that can be replaced,
                    // just render the trailing visual slot.
                    trailingVisual
                  )
                }
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
          {!inactive && Boolean(slots.trailingAction) && !container && slots.trailingAction}
        </LiBox>
      </ItemContext.Provider>
    )
  },
) as PolymorphicForwardRefComponent<'li', ActionListItemProps>

Item.displayName = 'ActionList.Item'
