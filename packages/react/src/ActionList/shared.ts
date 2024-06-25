import React from 'react'
import type {SxProp} from '../sx'
import type {AriaRole} from '../utils/types'

export type ActionListItemProps = {
  /**
   * Primary content for an Item
   */
  children?: React.ReactNode
  /**
   * Callback that will trigger both on click selection and keyboard selection.
   * This is not called for disabled or inactive items.
   */
  onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
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
   * Text describing why the item is inactive. This may be used when an item's usual functionality
   * is unavailable due to a system error such as a database outage.
   */
  inactiveText?: string
  /**
   * Private API for use internally only. Used by LinkItem to wrap contents in an anchor
   */
  _PrivateItemWrapper?: React.FC<React.PropsWithChildren<MenuItemProps>>
} & SxProp

type MenuItemProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLElement>) => void
  'aria-disabled'?: boolean
  tabIndex?: number
  'aria-labelledby'?: string
  'aria-describedby'?: string
  role?: string
}

export type ItemContext = Pick<ActionListItemProps, 'variant' | 'disabled'> & {
  inlineDescriptionId?: string
  blockDescriptionId?: string
  inactive?: boolean
}

export const ItemContext = React.createContext<ItemContext>({})

export const getVariantStyles = (
  variant: ActionListItemProps['variant'],
  disabled: ActionListItemProps['disabled'],
  inactive?: boolean,
) => {
  if (disabled) {
    return {
      color: 'primer.fg.disabled',
      iconColor: 'primer.fg.disabled',
      annotationColor: 'primer.fg.disabled',
    }
  }

  if (inactive) {
    return {
      color: 'fg.muted',
      iconColor: 'fg.muted',
      annotationColor: 'fg.muted',
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

export type ActionListProps = React.PropsWithChildren<{
  /**
   * `inset` children are offset (vertically and horizontally) from `List`’s edges, `full` children are flush (vertically and horizontally) with `List` edges
   */
  variant?: 'inset' | 'full'
  /**
   * Whether multiple Items or a single Item can be selected.
   */
  selectionVariant?: 'single' | 'multiple'
  /**
   * Display a divider above each `Item` in this `List` when it does not follow a `Header` or `Divider`.
   */
  showDividers?: boolean
  /**
   * The ARIA role describing the function of `List` component. `listbox` or `menu` are a common values.
   */
  role?: AriaRole
}> &
  SxProp

type ContextProps = Pick<ActionListProps, 'variant' | 'selectionVariant' | 'showDividers' | 'role'> & {
  headingId?: string
}

export const ListContext = React.createContext<ContextProps>({})
