import React from 'react'
import type {AriaRole} from '../utils/types'
import type {PolymorphicProps} from '../utils/modern-polymorphic'

// need to explicitly omit `onSelect` from native HTML <li> attributes to avoid collision
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExcludeSelectEventHandler<T> = T extends any ? Omit<T, 'onSelect'> : never

export type ActionListItemProps<As extends React.ElementType = 'li'> = ExcludeSelectEventHandler<
  PolymorphicProps<As, 'li'>
> & {
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
  size?: 'medium' | 'large'
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
   * Whether the item is loading
   */
  loading?: boolean
  /**
   * Private API for use internally only. Used by LinkItem to wrap contents in an anchor
   */
  _PrivateItemWrapper?: React.FC<React.PropsWithChildren<MenuItemProps>>
  className?: string
  groupId?: string
  renderItem?: (item: React.FC<React.PropsWithChildren<MenuItemProps>>) => React.ReactNode
  handleAddItem?: (item: React.FC<React.PropsWithChildren<MenuItemProps>>) => void

  as?: As

  // Link-specific props - optional, only needed when using Item as a link
  /** Download attribute for links */
  download?: string
  /** URL for links */
  href?: string
  /** Language of linked resource */
  hrefLang?: string
  /** Media query for link resource */
  media?: string
  /** Space-separated URLs to ping when link is followed */
  ping?: string
  /** Relationship of linked resource */
  rel?: string
  /** Where to open linked resource */
  target?: string
  /** MIME type of linked resource (for anchor elements only, won't conflict with user's 'type' prop) */
  type?: string
  /** Referrer policy for links */
  referrerPolicy?: React.AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy']
  /** React Router style 'to' prop */
  to?: string
}
 
export type LinkProps = {
  download?: string
  href?: string
  hrefLang?: string
  media?: string
  ping?: string
  rel?: string
  target?: string
  type?: string
  referrerPolicy?: React.AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy']
  to?: string
}

export type MenuItemProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLElement>) => void
  'aria-disabled'?: boolean
  tabIndex?: number
  'aria-labelledby'?: string
  'aria-describedby'?: string
  role?: string
  className?: string
}

export type ItemContext = Pick<ActionListItemProps<React.ElementType>, 'variant' | 'disabled' | 'size'> & {
  inlineDescriptionId?: string
  blockDescriptionId?: string
  trailingVisualId?: string
  inactive?: boolean
}

export const ItemContext = React.createContext<ItemContext>({})

export const getVariantStyles = (
  variant: ActionListItemProps<React.ElementType>['variant'],
  disabled: ActionListItemProps<React.ElementType>['disabled'],
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

export type ActionListProps<As extends React.ElementType = 'ul'> = PolymorphicProps<
  As,
  'ul',
  React.PropsWithChildren<{
    /**
     * `inset` children are offset (vertically and horizontally) from `List`’s edges, `full` children are flush (vertically and horizontally) with `List` edges
     */
    variant?: 'inset' | 'horizontal-inset' | 'full'
    /**
     * Whether multiple Items or a single Item can be selected.
     */
    selectionVariant?: 'single' | 'radio' | 'multiple'
    /**
     * Display a divider above each `Item` in this `List` when it does not follow a `Header` or `Divider`.
     */
    showDividers?: boolean
    /**
     * The ARIA role describing the function of `List` component. `listbox` or `menu` are a common values.
     */
    role?: AriaRole
    /**
     * Disables the focus zone for the list if applicable. Focus zone is enabled by default for `menu` and `listbox` roles, or components such as `ActionMenu` and `SelectPanel`.
     */
    disableFocusZone?: boolean
    className?: string
  }>
>

type ContextProps = Pick<
  ActionListProps<React.ElementType>,
  'variant' | 'selectionVariant' | 'showDividers' | 'role'
> & {
  headingId?: string
}

export const ListContext = React.createContext<ContextProps>({})
