import React from 'react'
import styled from 'styled-components'
import Box, {BoxProps} from '../Box'
import {useId} from '../hooks/useId'
import {useSlots} from '../hooks/useSlots'
import sx, {BetterSystemStyleObject, merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import {defaultSxProp} from '../utils/defaultSxProp'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {ActionListContainerContext} from './ActionListContainerContext'
import {Description} from './Description'
import {GroupContext} from './Group'
import {ActionListProps, ListContext} from './List'
import {Selection} from './Selection'
import {ActionListItemProps, getVariantStyles, ItemContext, TEXT_ROW_HEIGHT} from './shared'
import {LeadingVisual, TrailingVisual} from './Visuals'

const LiBox = styled.li<SxProp>(sx)

export const Item = React.forwardRef<HTMLLIElement, ActionListItemProps>(
  (
    {
      variant = 'default',
      disabled = false,
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
      description: Description,
    })
    const {variant: listVariant, showDividers, selectionVariant: listSelectionVariant} = React.useContext(ListContext)
    const {selectionVariant: groupSelectionVariant} = React.useContext(GroupContext)
    const {container, afterSelect, selectionAttribute} = React.useContext(ActionListContainerContext)

    const onSelect = React.useCallback(
      (
        event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>,
        // eslint-disable-next-line @typescript-eslint/ban-types
        afterSelect?: Function,
      ) => {
        if (typeof onSelectUser === 'function') onSelectUser(event)
        if (event.defaultPrevented) return
        if (typeof afterSelect === 'function') afterSelect()
      },
      [onSelectUser],
    )

    const selectionVariant: ActionListProps['selectionVariant'] = groupSelectionVariant
      ? groupSelectionVariant
      : listSelectionVariant

    /** Infer item role based on the container */
    let itemRole: ActionListItemProps['role']
    if (container === 'ActionMenu' || container === 'DropdownMenu') {
      if (selectionVariant === 'single') itemRole = 'menuitemradio'
      else if (selectionVariant === 'multiple') itemRole = 'menuitemcheckbox'
      else itemRole = 'menuitem'
    }

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

    const styles = {
      position: 'relative',
      display: 'flex',
      paddingX: 2,
      fontSize: 1,
      paddingY: '6px', // custom value off the scale
      lineHeight: TEXT_ROW_HEIGHT,
      minHeight: 5,
      marginX: listVariant === 'inset' ? 2 : 0,
      borderRadius: listVariant === 'inset' ? 2 : 0,
      transition: 'background 33.333ms linear',
      color: getVariantStyles(variant, disabled).color,
      cursor: 'pointer',
      '&[aria-disabled]': {cursor: 'not-allowed'},

      // Button reset styles (to support as="button")
      appearance: 'none',
      background: 'unset',
      border: 'unset',
      width: listVariant === 'inset' ? 'calc(100% - 16px)' : '100%',
      fontFamily: 'unset',
      textAlign: 'unset',
      marginY: 'unset',

      '@media (hover: hover) and (pointer: fine)': {
        ':hover:not([aria-disabled])': {
          backgroundColor: `actionListItem.${variant}.hoverBg`,
          color: getVariantStyles(variant, disabled).hoverColor,
        },
        '&:focus-visible, > a:focus-visible': {
          outline: 'none',
          border: `2 solid`,
          boxShadow: `0 0 0 2px ${theme?.colors.accent.emphasis}`,
        },
        ':active:not([aria-disabled])': {
          backgroundColor: `actionListItem.${variant}.activeBg`,
          color: getVariantStyles(variant, disabled).hoverColor,
        },
      },

      '@media (forced-colors: active)': {
        ':focus': {
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
      '&:hover:not([aria-disabled]), &:focus:not([aria-disabled]), &[data-focus-visible-added]:not([aria-disabled])': {
        '--divider-color': 'transparent',
      },
      '&:hover:not([aria-disabled]) + &, &[data-focus-visible-added] + li': {
        '--divider-color': 'transparent',
      },
      ...(active ? activeStyles : {}),
    }

    const clickHandler = React.useCallback(
      (event: React.MouseEvent<HTMLLIElement>) => {
        if (disabled) return
        onSelect(event, afterSelect)
      },
      [onSelect, disabled, afterSelect],
    )

    const keyPressHandler = React.useCallback(
      (event: React.KeyboardEvent<HTMLLIElement>) => {
        if (disabled) return
        if ([' ', 'Enter'].includes(event.key)) {
          onSelect(event, afterSelect)
        }
      },
      [onSelect, disabled, afterSelect],
    )

    // use props.id if provided, otherwise generate one.
    const labelId = useId(id)
    const inlineDescriptionId = useId(id && `${id}--inline-description`)
    const blockDescriptionId = useId(id && `${id}--block-description`)

    const ItemWrapper = _PrivateItemWrapper || React.Fragment

    const menuItemProps = {
      onClick: clickHandler,
      onKeyPress: keyPressHandler,
      'aria-disabled': disabled ? true : undefined,
      tabIndex: disabled ? undefined : 0,
      'aria-labelledby': `${labelId} ${
        slots.description && slots.description.props.variant !== 'block' ? inlineDescriptionId : ''
      }`,
      'aria-describedby': slots.description?.props.variant === 'block' ? blockDescriptionId : undefined,
      ...(selectionAttribute && {[selectionAttribute]: selected}),
      role: role || itemRole,
    }

    const containerProps = _PrivateItemWrapper ? {role: role || itemRole ? 'none' : undefined} : menuItemProps

    const wrapperProps = _PrivateItemWrapper ? menuItemProps : {}

    return (
      <ItemContext.Provider value={{variant, disabled, inlineDescriptionId, blockDescriptionId}}>
        <LiBox
          ref={forwardedRef}
          sx={merge<BetterSystemStyleObject>(styles, sxProp)}
          data-variant={variant === 'danger' ? variant : undefined}
          {...containerProps}
          {...props}
        >
          <ItemWrapper {...wrapperProps}>
            <Selection selected={selected} />
            {slots.leadingVisual}
            <Box
              data-component="ActionList.Item--DividerContainer"
              sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0}}
            >
              <ConditionalBox if={Boolean(slots.trailingVisual)} sx={{display: 'flex', flexGrow: 1}}>
                <ConditionalBox
                  if={!!slots.description && slots.description.props.variant !== 'block'}
                  sx={{display: 'flex', flexGrow: 1, alignItems: 'baseline', minWidth: 0}}
                >
                  <Box
                    as="span"
                    id={labelId}
                    sx={{
                      flexGrow: slots.description && slots.description.props.variant !== 'block' ? 0 : 1,
                      fontWeight: slots.description ? 'bold' : 'normal',
                      marginBlockEnd:
                        slots.description && slots.description.props.variant !== 'inline' ? '4px' : undefined,
                    }}
                  >
                    {childrenWithoutSlots}
                  </Box>
                  {slots.description?.props.variant !== 'block' ? slots.description : null}
                </ConditionalBox>
                {slots.trailingVisual}
              </ConditionalBox>
              {slots.description?.props.variant === 'block' ? slots.description : null}
            </Box>
          </ItemWrapper>
        </LiBox>
      </ItemContext.Provider>
    )
  },
) as PolymorphicForwardRefComponent<'li', ActionListItemProps>

Item.displayName = 'ActionList.Item'

const ConditionalBox: React.FC<React.PropsWithChildren<{if: boolean} & BoxProps>> = props => {
  const {if: condition, ...rest} = props

  if (condition) return <Box {...rest}>{props.children}</Box>
  else return <>{props.children}</>
}
