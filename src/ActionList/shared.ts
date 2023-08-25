import React from 'react'
import {SxProp} from '../sx'
import {AriaRole} from '../utils/types'

export type ActionListItemProps = {
  /**
   * Primary content for an Item
   */
  children?: React.ReactNode
  /**
   * Callback that will trigger both on click selection and keyboard selection.
   */
  onSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  /**
   * Is the `Item` is currently selected?
   */
  selected?: boolean
  /**
   * Indicate whether the item is active. There should never be more than one active item.
   */
  active?: boolean
  /**
   * Style variations associated with various `Item` types.
   *
   * - `"default"` - An action `Item`.
   * - `"danger"` - A destructive action `Item`.
   */
  variant?: 'default' | 'danger'
  /**
   * Items that are disabled can not be clicked, selected, or navigated through.
   */
  disabled?: boolean
  /**
   * The ARIA role describing the function of `Item` component. `option` is a common value.
   */
  role?: AriaRole
  /**
   * id to attach to the root element of the Item
   */
  id?: string
  /**
   * Private API for use internally only. Used by LinkItem to wrap contents in an anchor
   */
  _PrivateItemWrapper?: React.FC<React.PropsWithChildren<MenuItemProps>>
} & SxProp

type MenuItemProps = {
  onClick?: (event: React.MouseEvent) => void
  onKeyPress?: (event: React.KeyboardEvent) => void
  'aria-disabled'?: boolean
  tabIndex?: number
  'aria-labelledby'?: string
  'aria-describedby'?: string
  role?: string
}

export type ItemContext = Pick<ActionListItemProps, 'variant' | 'disabled'> & {
  inlineDescriptionId?: string
  blockDescriptionId?: string
}

export const ItemContext = React.createContext<ItemContext>({})

export const getVariantStyles = (
  variant: ActionListItemProps['variant'],
  disabled: ActionListItemProps['disabled'],
) => {
  if (disabled) {
    return {
      color: 'primer.fg.disabled',
      iconColor: 'primer.fg.disabled',
      annotationColor: 'primer.fg.disabled',
    }
  }

  switch (variant) {
    case 'danger':
      return {
        color: 'danger.fg',
        iconColor: 'danger.fg',
        annotationColor: 'fg.muted',
        hoverColor: 'actionListItem.danger.hoverText',
      }
    default:
      return {
        color: 'fg.default',
        iconColor: 'fg.muted',
        annotationColor: 'fg.muted',
        hoverColor: 'fg.default',
      }
  }
}

export const TEXT_ROW_HEIGHT = '20px' // custom value off the scale
