import type {Key} from 'react'
import type {Merge} from '../utils/polymorphic'
import type {Group} from '../ActionList/Group'
import type {ActionListGroupProps} from '../deprecated'
import type {AriaRole} from '../utils/types'

export type RenderItemFn = (props: FilteredActionListItemProps) => React.ReactElement

export type ItemInput =
  | Merge<React.ComponentPropsWithoutRef<'div'>, FilteredActionListItemProps>
  | ((Partial<FilteredActionListItemProps> & {renderItem: RenderItemFn}) & {key?: Key})

export interface FilteredActionListItemProps {
  /**
   * Primary text which names an `Item`.
   */
  text?: string

  /**
   * Secondary text which provides additional information about an `Item`.
   */
  description?: string

  /**
   * Secondary text style variations. Usage is discretionary.
   *
   * - `"inline"` - Secondary text is positioned beside primary text.
   * - `"block"` - Secondary text is positioned below primary text.
   */
  descriptionVariant?: 'inline' | 'block'

  /**
   * Icon (or similar) positioned before `Item` text.
   */
  leadingVisual?: React.ElementType

  /**
   * @deprecated Use `trailingVisual` instead
   * Icon (or similar) positioned after `Item` text.
   */
  trailingIcon?: React.ElementType

  /**
   * @deprecated Use `trailingVisual` instead
   * Text positioned after `Item` text and optional trailing icon.
   */
  trailingText?: string

  /**
   * Icon or text positioned after `Item` text.
   */
  trailingVisual?: React.ElementType | React.ReactNode

  /**
   * An action positioned after the `Item` text. This is a button or link that appears at the end of the item.
   * Only available for items in SelectPanel (not available in ActionMenu or other contexts with menu/listbox roles).
   */
  trailingAction?: {
    /**
     * The label for the action button. Used as aria-label if icon is provided, or as button text if no icon.
     */
    label: string
    /**
     * Optional icon to display in the action button.
     */
    icon?: React.ElementType
    /**
     * The element type to render. Defaults to 'button'.
     */
    as?: 'button' | 'a'
    /**
     * The href for the action when rendered as a link (as='a').
     */
    href?: string
    /**
     * Whether the action is in a loading state. Only available for button elements.
     */
    loading?: boolean
    /**
     * onClick handler for the action.
     */
    onClick?: (event: React.MouseEvent<HTMLElement>) => void
  }

  /**
   * Style variations associated with various `Item` types.
   *
   * - `"default"` - An action `Item`.
   * - `"danger"` - A destructive action `Item`.
   */
  variant?: 'default' | 'danger'

  /**
   * For `Item`s which can be selected, whether the `Item` is currently selected.
   */
  selected?: boolean

  /**
   * Designates the group that an item belongs to.
   */
  groupId?: string

  /**
   * Items that are disabled can not be clicked, selected, or navigated through.
   */
  disabled?: boolean

  /**
   * Callback that will trigger both on click selection and keyboard selection.
   */
  onAction?: (
    item: FilteredActionListItemProps,
    event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void

  /**
   * An id associated with this item.  Should be unique between items
   */
  id?: number | string

  /**
   * Node to be included inside the item before the text.
   */
  children?: React.ReactNode

  /**
   * The ARIA role describing the function of `List` component. `option` is a common value.
   */
  role?: AriaRole

  /**
   * An item to pass back in the `onAction` callback, meant as
   */
  item?: ItemInput
  /**
   * className to apply to the list item
   */
  className?: string
}

/**
 * Contract for props passed to the `List` component, when its `Item`s are collected in `Group`s.
 */
export interface GroupedListProps extends ListPropsBase {
  /**
   * A collection of `Group` props (except `items`), plus a unique group identifier
   * and `Group`-level custom `Item` or `Group` renderers.
   */
  groupMetadata: ((
    | Omit<ActionListGroupProps, 'items'>
    | Omit<Partial<ActionListGroupProps> & {renderItem?: RenderItemFn; renderGroup?: typeof Group}, 'items'>
  ) & {groupId: string})[]

  /**
   * A collection of `Item` props, plus associated group identifiers
   * and `Item`-level custom `Item` renderers.
   */
  items: ((FilteredActionListItemProps | (Partial<FilteredActionListItemProps> & {renderItem: RenderItemFn})) & {
    groupId: string
  })[]
}

/**
 * Contract for props passed to the `List` component.
 */
export interface ListPropsBase {
  /**
   * A collection of `Item` props and `Item`-level custom `Item` renderers.
   */
  items: ItemInput[]

  /**
   * The ARIA role describing the function of `List` component. `listbox` is a common value.
   */
  role?: AriaRole

  /**
   * id to attach to the base DOM node of the list
   */
  id?: string

  /**
   * aria-label to attach to the base DOM node of the list
   */
  'aria-label'?: string

  /**
   * A `List`-level custom `Item` renderer. Every `Item` within this `List`
   * without a `Group`-level or `Item`-level custom `Item` renderer will be
   * rendered using this function component.
   */
  renderItem?: RenderItemFn

  /**
   * A `List`-level custom `Group` renderer. Every `Group` within this `List`
   * without a `Group`-level custom `Item` renderer will be rendered using
   * this function component.
   */
  renderGroup?: typeof Group

  /**
   * Style variations. Usage is discretionary.
   *
   * - `"inset"` - `List` children are offset (vertically and horizontally) from `List`’s edges
   * - `"full"` - `List` children are flush (vertically and horizontally) with `List` edges
   */
  variant?: 'inset' | 'horizontal-inset' | 'full'

  /**
   *  For `Item`s which can be selected, whether `multiple` `Item`s or a `single` `Item` can be selected
   */
  selectionVariant?: 'single' | 'multiple' | 'radio'

  /**
   * Whether to display a divider above each `Item` in this `List` when it does not follow a `Header` or `Divider`.
   */
  showItemDividers?: boolean
}
