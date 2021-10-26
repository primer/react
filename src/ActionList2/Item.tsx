/**
 * minimize number of divs
 * docs
 * docs for types
 * test suite!
 * ref unhappy with polymorphic
 *
 * check height with divider
 * questions:
 * nicer name for showDivider?
 * change as= li | div based on context of menu or not?
 * should selectionVariant be single by default or nothing. ask for explicit choice?
 * selection api - if one item has selected, should we give all of them selected without the need to pass prop?
 * move custom item themes to primitives?
 * padding: 8 or 6?
 * different size for icon and avatar, range?
 * ActionList.Selection or ActionList.Item selected?
 * aria-describedby empty value bad? also, 2 description = 2 values?
 *
 * activeDescendantAttribute (for actionMenu)
 */

import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import {useSSRSafeId} from '@react-aria/ssr'
import {useColorSchemeVar, useTheme} from '../ThemeProvider'
import Box from '../Box'
import {get} from '../constants'
import {SxProp, merge} from '../sx'
import createSlots from '../utils/create-slots'
import {AriaRole} from '../utils/types'
import {ListContext} from './List'
import {customItemThemes} from './hacks'
import {Selection} from './Selection'

export const getVariantStyles = (variant: ItemProps['variant'], disabled: ItemProps['disabled']) => {
  if (disabled) {
    return {
      color: 'fg.muted',
      iconColor: 'fg.muted',
      annotationColor: 'fg.muted'
    }
  }

  switch (variant) {
    case 'danger':
      return {
        color: 'danger.fg',
        iconColor: 'danger.fg',
        annotationColor: 'fg.muted'
      }
    default:
      return {
        color: 'fg.default',
        iconColor: 'fg.muted',
        annotationColor: 'fg.muted'
      }
  }
}

export type ItemProps = {
  children: React.ReactNode
  onAction?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  selected?: boolean
  variant?: 'default' | 'danger'
  disabled?: boolean
  showDivider?: boolean
  role?: AriaRole
} & SxProp

const {Slots, Slot} = createSlots(['LeadingVisual', 'InlineDescription', 'BlockDescription', 'TrailingVisual'])
export {Slot}
export type ItemContext = Pick<ItemProps, 'variant' | 'disabled'> & {
  inlineDescriptionId: string
  blockDescriptionId: string
}

export const Item = React.forwardRef<HTMLLIElement, ItemProps>(
  (
    {
      variant = 'default',
      disabled = false,
      selected = undefined,
      showDivider = false,
      onAction = () => null,
      sx = {},
      ...props
    },
    forwardedRef
  ): JSX.Element => {
    const customItemTheme = customItemThemes[variant]
    const {variant: listVariant} = React.useContext(ListContext)

    const {theme} = useTheme()

    const styles = {
      display: 'flex',
      paddingX: get('space.2'),
      paddingY: '6px',
      marginX: listVariant === 'inset' ? get('space.2') : 0,
      minHeight: get('space.5'),
      borderRadius: get('radii.2'),
      transition: 'background 33.333ms linear',
      color: getVariantStyles(variant, disabled).color,
      textDecoration: 'none', // for as="a"

      ':not([aria-disabled])': {cursor: 'pointer'},
      '@media (hover: hover) and (pointer: fine)': {
        ':hover:not([aria-disabled])': {
          backgroundColor: useColorSchemeVar(customItemTheme.hover, 'inherit')
        },
        ':focus:not([aria-disabled])': {
          backgroundColor: useColorSchemeVar(customItemTheme.focus, 'inherit')
        }
      },

      /** Divider styles */
      '[data-component="ActionList.Item--Main"]': {
        position: 'relative'
      },
      '[data-component="ActionList.Item--Main"]::before': {
        content: '" "',
        display: 'block',
        position: 'absolute',
        width: '100%',
        top: '-7px',
        border: '0 solid',
        borderTopWidth: showDivider ? `1px` : '0',
        borderColor: 'var(--divider-color, transparent)'
      },
      // show between 2 items
      ':not(:first-of-type)': {'--divider-color': theme?.colors.border.muted},
      // hide divider after dividers & group header
      '[data-component="ActionList.Divider"] + &': {'--divider-color': 'transparent'},
      // hide border on current and previous item
      '&:hover:not([aria-disabled]), &:focus:not([aria-disabled])': {'--divider-color': 'transparent'},
      '&:hover:not([aria-disabled]) + &, &:focus:not([aria-disabled]) + &': {'--divider-color': 'transparent'}
    }

    const clickHandler = React.useCallback(
      event => {
        if (disabled) return
        if (!event.defaultPrevented) onAction(event)
      },
      [onAction, disabled]
    )

    const labelId = useSSRSafeId()
    const inlineDescriptionId = useSSRSafeId()
    const blockDescriptionId = useSSRSafeId()

    return (
      <Slots context={{variant, disabled, inlineDescriptionId, blockDescriptionId}}>
        {slots => (
          <Box
            as="li"
            ref={forwardedRef}
            sx={merge(styles, sx as SxProp)}
            data-component="ActionList.Item"
            onClick={clickHandler}
            aria-selected={selected}
            aria-disabled={disabled ? true : undefined}
            aria-labelledby={labelId}
            aria-describedby={[
              slots.InlineDescription && inlineDescriptionId,
              slots.BlockDescription && blockDescriptionId
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          >
            <Selection selected={selected} disabled={disabled} />
            {slots.LeadingVisual}
            <Box
              data-component="ActionList.Item--Main"
              sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0}}
            >
              <Box sx={{display: 'flex'}}>
                <Box sx={{display: 'flex', flexGrow: 1, alignItems: 'baseline', minWidth: 0}}>
                  <span id={labelId}>{props.children}</span>
                  {slots.InlineDescription}
                </Box>
                {slots.TrailingVisual}
              </Box>
              {slots.BlockDescription}
            </Box>
          </Box>
        )}
      </Slots>
    )
  }
) as PolymorphicForwardRefComponent<'li', ItemProps>

Item.displayName = 'ActionList.Item'
