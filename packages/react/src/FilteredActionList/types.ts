import type {Key} from 'react'
import type {Merge} from '../utils/polymorphic'
import type {Group} from '../ActionList/Group'
import type {ActionListGroupProps, ActionListProps} from '../deprecated'
import type {AriaRole} from '../utils/types'
import type {FilteredActionListLoadingType} from './FilteredActionListLoaders'
import type {TextInputProps} from '../TextInput'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RenderItemFn = (props: FilteredActionListItemProps) => React.ReactElement<any>

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

export interface FilteredActionListProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  loading?: boolean
  loadingType?: FilteredActionListLoadingType
  placeholderText?: string
  filterValue?: string
  onFilterChange: (value: string, e: React.ChangeEvent<HTMLInputElement> | null) => void
  onListContainerRefChanged?: (ref: HTMLElement | null) => void
  onInputRefChanged?: (ref: React.RefObject<HTMLInputElement>) => void
  /**
   * A ref assigned to the scrollable container wrapping the ActionList
   */
  scrollContainerRef?: React.Ref<HTMLDivElement | null>
  textInputProps?: Partial<Omit<TextInputProps, 'onChange'>>
  inputRef?: React.RefObject<HTMLInputElement>
  message?: React.ReactNode
  messageText?: {
    title: string
    description: string
  }
  className?: string
  announcementsEnabled?: boolean
  fullScreenOnNarrow?: boolean
  onSelectAllChange?: (checked: boolean) => void
  /**
   * Additional props to pass to the underlying ActionList component.
   */
  actionListProps?: Partial<ActionListProps>
  /**
   * Determines how keyboard focus behaves when navigating beyond the first or last item in the list.
   *
   * - `'stop'`: Focus will stop at the first or last item; further navigation in that direction will not move focus.
   * - `'wrap'`: Focus will wrap around to the opposite end of the list when navigating past the boundaries (e.g., pressing Down on the last item moves focus to the first).
   *
   *  @default 'wrap'
   */
  focusOutBehavior?: 'stop' | 'wrap'
  /**
   * Private API for use internally only. Adds the ability to switch between
   * `active-descendant` and roving tabindex.
   *
   * By default, FilteredActionList uses `aria-activedescendant` to manage focus.
   *
   * Roving tabindex is an alternative focus management method that moves
   * focus to the list items themselves instead of keeping focus on the input.
   *
   * Improper usage can lead to inaccessible experiences, so this prop should be used with caution.
   *
   * For usage, refer to the documentation:
   *
   * WAI-ARIA `aria-activedescendant`: https://www.w3.org/TR/wai-aria-1.2/#aria-activedescendant
   *
   * Roving Tabindex: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
   *
   * @default 'active-descendant'
   */
  _PrivateFocusManagement?: 'roving-tabindex' | 'active-descendant'
}
