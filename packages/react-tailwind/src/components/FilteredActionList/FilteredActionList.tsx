'use client'

import {Combobox} from '@base-ui/react/combobox'
import {CheckIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {areItemsEqual, getItemRenderKey, getItemText, itemIdKey, renderItemVisual} from '../../internal/collectionItem'
import {mergeRefs} from '../../internal/refs'
import type {CSSPropertiesWithCustomProperties} from '../../utils/types'
import {
  ActionItemContent,
  ActionItemElementContent,
  ActionList,
  actionItemClassName,
  type ActionListItemProps,
  type ActionListRootProps,
} from '../ActionList/ActionList'
import {Checkbox} from '../Checkbox'
import {SkeletonBox} from '../SkeletonBox'
import {Spinner} from '../Spinner'
import {TextInput, type TextInputProps} from '../TextInput'
import {FilteredActionListLoadingTypes, type FilteredActionListLoadingType} from './constants'

export type FilteredActionListItemId = string | number
export type {FilteredActionListLoadingType} from './constants'

type ItemVisual = React.ElementType | React.ReactNode
type FilteredActionListValue = {
  item: FilteredActionListItem
  label: string
  renderKey: string
}

export interface FilteredActionListItem {
  /** Stable identity used for selection. Number and string ids stay distinct. */
  id?: FilteredActionListItemId
  /** Primary label for the item. */
  text?: React.ReactNode
  /** Text used to filter an item whose label is not plain text. */
  filterValue?: string
  /** Secondary text shown with the label. */
  description?: React.ReactNode
  /** Whether the description sits beside the label or on its own line. */
  descriptionVariant?: 'inline' | 'block'
  /** Visual shown before the label. */
  leadingVisual?: ItemVisual
  /** Visual shown after the label. */
  trailingVisual?: ItemVisual
  /** Marks the item selected in an uncontrolled list. */
  selected?: boolean
  /** Prevents the item being activated or selected. */
  disabled?: boolean
  /** Group this item belongs to, matched against `groupMetadata`. */
  groupId?: string
  /** Use `danger` for a destructive action. */
  variant?: 'default' | 'danger'
  children?: React.ReactNode
  className?: string
  /** Called when the item is activated by click or keyboard. */
  onAction?: (
    item: FilteredActionListItem,
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => void
  /** Renderer for this item, taking precedence over the group and list renderers. */
  renderItem?: FilteredActionListRenderItem
}

export type FilteredActionListRenderItem = (item: FilteredActionListItem) => React.ReactElement | null

export interface FilteredActionListGroup {
  /** Identifier items reference through their own `groupId`. */
  groupId: string
  /** Heading shown above the group. */
  header?: {
    title?: React.ReactNode
    variant?: 'subtle' | 'filled'
  }
  /** Renderer for items in this group, taking precedence over the list renderer. */
  renderItem?: FilteredActionListRenderItem
  /** Component used to render this group, replacing the default group element. */
  renderGroup?: React.ElementType
}

export interface FilteredActionListTextInputProps
  extends Omit<TextInputProps, 'aria-label' | 'onChange' | 'placeholder' | 'value'> {
  /** Visual shown inside the filter input, before the text. */
  leadingVisual?: ItemVisual
}

export interface FilteredActionListProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children' | 'data-component' | 'onChange'> {
  /** Items to list. Filtering, selection, and virtualization all operate on this array. */
  items: readonly FilteredActionListItem[]
  /** Group headers and per-group renderers, matched to items by `groupId`. */
  groupMetadata?: readonly FilteredActionListGroup[]
  /** A list-level renderer used unless a group or item provides one. */
  renderItem?: FilteredActionListRenderItem
  /** Component used to render each group, replacing the default group element. */
  renderGroup?: React.ElementType
  /** Density and inset treatment of the underlying list. */
  variant?: 'inset' | 'horizontal-inset' | 'full'
  /** How many items may be selected and which selection semantics the list reports. */
  selectionVariant?: 'single' | 'multiple' | 'radio'
  /** Draws a divider between items. */
  showItemDividers?: boolean
  /** Controlled filter query. */
  filterValue?: string
  /** Initial filter query for an uncontrolled list. */
  defaultFilterValue?: string
  /** Called with the new query whenever the filter input changes. */
  onFilterChange?: (value: string, details: Combobox.Root.ChangeEventDetails) => void
  /** Controlled selected IDs. Number and string IDs remain distinct. */
  selectedItemIds?: readonly FilteredActionListItemId[]
  /** Initially selected ids for an uncontrolled list. */
  defaultSelectedItemIds?: readonly FilteredActionListItemId[]
  /** Called with the full set of selected ids whenever selection changes. */
  onSelectedChange?: (selectedItemIds: FilteredActionListItemId[], details?: Combobox.Root.ChangeEventDetails) => void
  /** Opts a multiple-selection list into a select-all control. */
  onSelectAllChange?: (selected: boolean) => void
  /** Shows a loading affordance in place of results. */
  loading?: boolean
  /** Which loading affordance to show, and whether it replaces the list or sits beside it. */
  loadingType?: FilteredActionListLoadingType
  /** Placeholder shown in the filter input. */
  placeholderText?: string
  /** Extra props forwarded to the filter input. */
  textInputProps?: FilteredActionListTextInputProps
  /** Content shown in place of the list, for an error or other terminal state. */
  message?: React.ReactNode
  /** Title and description for the built-in message, as an alternative to supplying `message`. */
  messageText?: {title: string; description: string}
  /** Content shown when the filter matches no items. */
  emptyStateText?: React.ReactNode
  /** Extra props forwarded to the underlying list. */
  actionListProps?: Omit<Partial<ActionListRootProps>, 'children' | 'data-component'>
  /** Ref to the filter input, for focusing it from outside. */
  inputRef?: React.Ref<HTMLInputElement>
  /** Ref to the scrolling results container. */
  scrollContainerRef?: React.Ref<HTMLDivElement>
  /** Called when the filter input element is attached or replaced. */
  onInputRefChanged?: (ref: React.RefObject<HTMLInputElement | null>) => void
  /** Called when the results container element is attached or replaced. */
  onListContainerRefChanged?: (element: HTMLElement | null) => void
  /** Announces result counts and selection changes to assistive technology. */
  announcementsEnabled?: boolean
  /**
   * Increases the input text size on narrow viewports to prevent iOS from
   * zooming while the input is focused.
   */
  fullScreenOnNarrow?: boolean
  /**
   * Determines whether keyboard navigation stops or wraps at the first and
   * last enabled option.
   * @default 'wrap'
   */
  focusOutBehavior?: 'stop' | 'wrap'
  /** Called when keyboard focus moves to a different option. */
  onActiveDescendantChanged?: (
    current: HTMLElement | undefined,
    previous: HTMLElement | undefined,
    directlyActivated: boolean,
  ) => void
  /** Stops hovering an option from making it the active descendant. */
  disableSelectOnHover?: boolean
  /** Moves focus to the filter input when the list mounts. */
  setInitialFocus?: boolean
  /** Includes elements rendered before the list in the keyboard focus order. */
  focusPrependedElements?: boolean
  /** Scrolling behavior used when bringing the active option into view. */
  scrollBehavior?: ScrollBehavior
  /** Enables fixed-row virtualization for ungrouped, uniform default items. */
  virtualized?: boolean
}

const compactVirtualRowHeight = 32
const blockDescriptionVirtualRowHeight = 52
const virtualOverscan = 6
const skeletonRowHeight = 24
const skeletonMinimumRows = 3
const skeletonWidths = ['80%', '52.5%', '67.5%', '40%', '72.5%'] as const
const getUndefinedSnapshot = () => undefined

function getVirtualRowHeight(
  items: readonly FilteredActionListItem[],
  grouped: boolean,
  itemRenderer?: FilteredActionListRenderItem,
) {
  if (
    grouped ||
    itemRenderer !== undefined ||
    !items.every(
      item =>
        !item.renderItem &&
        item.children === undefined &&
        item.className === undefined &&
        item.variant === undefined &&
        typeof item.text === 'string',
    )
  ) {
    return undefined
  }

  if (items.every(item => item.description === undefined && item.descriptionVariant === undefined)) {
    return compactVirtualRowHeight
  }

  if (items.every(item => item.description !== undefined && item.descriptionVariant === 'block')) {
    return blockDescriptionVirtualRowHeight
  }

  return undefined
}

/**
 * `announce` gives the loader its own status message for when the list's live region is disabled;
 * otherwise that live region already announces loading and the loader stays visual.
 */
function BodyLoader({announce, loadingType}: {announce: boolean; loadingType: FilteredActionListLoadingType}) {
  const [skeletonElement, setSkeletonElement] = React.useState<HTMLDivElement | null>(null)
  const subscribeToSkeletonHeight = React.useCallback(
    (onStoreChange: () => void) => {
      if (!skeletonElement || typeof ResizeObserver === 'undefined') return () => {}
      const observer = new ResizeObserver(onStoreChange)
      observer.observe(skeletonElement)
      return () => observer.disconnect()
    },
    [skeletonElement],
  )
  const getSkeletonHeight = React.useCallback(() => skeletonElement?.clientHeight, [skeletonElement])
  const skeletonHeight = React.useSyncExternalStore(subscribeToSkeletonHeight, getSkeletonHeight, getUndefinedSnapshot)

  if (loadingType === FilteredActionListLoadingTypes.bodySpinner) {
    return (
      <div
        className="flex h-full min-h-[200px] w-full flex-1 items-center justify-center p-4 text-muted"
        data-component="FilteredActionList.Spinner"
        role={announce ? 'status' : undefined}
      >
        <Spinner data-testid="filtered-action-list-spinner" srText={null} />
        {announce ? <span className="sr-only">Loading items</span> : null}
      </div>
    )
  }

  const skeletonRows =
    skeletonHeight === undefined ? 10 : Math.max(skeletonMinimumRows, Math.floor(skeletonHeight / skeletonRowHeight))

  return (
    <div
      className="flex h-full min-h-[200px] w-full flex-1 flex-col gap-2 p-2"
      data-component="FilteredActionList.Skeleton"
      data-testid="filtered-action-list-skeleton"
      ref={setSkeletonElement}
      role={announce ? 'status' : undefined}
    >
      {announce ? <span className="sr-only">Loading items</span> : null}
      {Array.from({length: skeletonRows}, (_, index) => (
        <div key={index} className="flex items-center gap-2">
          <SkeletonBox className="size-4 shrink-0" />
          <SkeletonBox height="10px" width={skeletonWidths[index % skeletonWidths.length]} />
        </div>
      ))}
    </div>
  )
}

interface FilteredActionListOptionProps {
  group?: FilteredActionListGroup
  itemNodes: React.RefObject<Map<FilteredActionListItem, HTMLElement>>
  itemRenderer?: FilteredActionListRenderItem
  item: FilteredActionListValue
  multiple: boolean
  optionCount: number
  behaviorIndex: number
  optionIndex: number
  radio: boolean
  selectable: boolean
  selected: boolean
  showItemDividers: boolean
  variant: NonNullable<FilteredActionListProps['variant']>
  virtualized?: boolean
}

function FilteredActionListOption({
  group,
  itemNodes,
  itemRenderer,
  item: value,
  multiple,
  optionCount,
  behaviorIndex,
  optionIndex,
  radio,
  selectable,
  selected,
  showItemDividers,
  variant: listVariant,
  virtualized = false,
}: FilteredActionListOptionProps) {
  const item = value.item
  const {
    children,
    className,
    description,
    descriptionVariant,
    disabled,
    filterValue,
    groupId,
    id: itemId,
    leadingVisual,
    onAction,
    renderItem,
    text,
    trailingVisual,
    variant,
  } = item
  const renderer = renderItem ?? group?.renderItem ?? itemRenderer
  const renderedItem = renderer?.({...item, selected})
  const renderedActionListItem =
    React.isValidElement<
      Pick<ActionListItemProps, 'children' | 'description' | 'leadingVisual' | 'trailingVisual'> & {
        className?: string
        disabled?: boolean
        onClick?: React.MouseEventHandler<HTMLElement>
        onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
        variant?: FilteredActionListItem['variant']
      }
    >(renderedItem) && renderedItem.type === ActionList.Item
      ? renderedItem
      : undefined
  const optionDisabled = Boolean(disabled || renderedActionListItem?.props.disabled)
  const optionVariant = renderedActionListItem?.props.variant ?? variant
  const selection = !selectable ? null : multiple ? (
    <span
      aria-hidden="true"
      className="grid size-4 shrink-0 place-items-center rounded-sm border border-[var(--control-borderColor-emphasis)] bg-default group-data-[selected]:border-[var(--control-checked-bgColor-rest)] group-data-[selected]:bg-[var(--control-checked-bgColor-rest)] group-data-[selected]:text-on-emphasis"
    >
      <Combobox.ItemIndicator>
        <CheckIcon className="size-3" />
      </Combobox.ItemIndicator>
    </span>
  ) : radio ? (
    <span
      aria-hidden="true"
      className="grid size-4 shrink-0 place-items-center rounded-full border border-[var(--control-borderColor-emphasis)] group-data-[selected]:border-[var(--control-checked-bgColor-rest)]"
    >
      <Combobox.ItemIndicator>
        <span className="size-2 rounded-full bg-[var(--control-checked-bgColor-rest)]" />
      </Combobox.ItemIndicator>
    </span>
  ) : (
    <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center">
      <Combobox.ItemIndicator>
        <CheckIcon className="size-4" />
      </Combobox.ItemIndicator>
    </span>
  )

  return (
    <Combobox.Item
      aria-posinset={optionIndex + 1}
      aria-setsize={optionCount}
      className={cn(
        actionItemClassName,
        'group cursor-default items-center outline-none data-[highlighted]:bg-neutral-muted',
        listVariant !== 'full' && 'mx-2 w-auto',
        descriptionVariant === 'block' && 'items-start',
        optionVariant === 'danger' && 'text-danger hover:bg-[var(--control-danger-bgColor-hover)]',
        virtualized && 'h-(--filtered-action-list-virtual-row-height) overflow-hidden',
        className,
        renderedActionListItem?.props.className,
      )}
      data-component="FilteredActionList.Item"
      data-filter-value={filterValue}
      data-group-id={groupId}
      data-index={optionIndex}
      data-item-id={itemId === undefined ? undefined : itemIdKey(itemId)}
      disabled={optionDisabled}
      index={virtualized ? behaviorIndex : undefined}
      onClick={event => {
        renderedActionListItem?.props.onClick?.(event)
        if (!event.defaultPrevented) {
          if (renderedActionListItem?.props.onSelect) renderedActionListItem.props.onSelect(event)
          else onAction?.(item, event)
        }
        if (event.defaultPrevented) event.preventBaseUIHandler()
      }}
      ref={node => {
        if (node) itemNodes.current.set(item, node)
        else itemNodes.current.delete(item)
      }}
      value={value}
    >
      {renderedActionListItem ? (
        <ActionItemElementContent
          item={renderedActionListItem.props}
          selection={selection}
          showDivider={showItemDividers && optionIndex > 0}
        />
      ) : (
        (renderedItem ?? (
          <ActionItemContent
            description={description}
            descriptionVariant={descriptionVariant}
            leadingVisual={leadingVisual ? renderItemVisual(leadingVisual) : undefined}
            selection={selection}
            showDivider={showItemDividers && optionIndex > 0}
            trailingVisual={trailingVisual ? renderItemVisual(trailingVisual) : undefined}
          >
            {children}
            {text}
          </ActionItemContent>
        ))
      )}
    </Combobox.Item>
  )
}

interface FilteredActionListDisabledOptionProps {
  group?: FilteredActionListGroup
  itemRenderer?: FilteredActionListRenderItem
  item: FilteredActionListValue
  optionCount: number
  optionIndex: number
  showItemDividers: boolean
  variant: NonNullable<FilteredActionListProps['variant']>
}

function FilteredActionListDisabledOption({
  group,
  itemRenderer,
  item: value,
  optionCount,
  optionIndex,
  showItemDividers,
  variant: listVariant,
}: FilteredActionListDisabledOptionProps) {
  const item = value.item
  const {
    children,
    className,
    description,
    descriptionVariant,
    filterValue,
    groupId,
    id: itemId,
    leadingVisual,
    renderItem,
    text,
    trailingVisual,
    variant,
  } = item
  const renderer = renderItem ?? group?.renderItem ?? itemRenderer
  const renderedItem = renderer?.({...item, selected: false})
  const renderedActionListItem =
    React.isValidElement<
      Pick<ActionListItemProps, 'children' | 'description' | 'leadingVisual' | 'trailingVisual'> & {
        className?: string
        variant?: FilteredActionListItem['variant']
      }
    >(renderedItem) && renderedItem.type === ActionList.Item
      ? renderedItem
      : undefined
  const optionVariant = renderedActionListItem?.props.variant ?? variant

  return (
    <div
      aria-disabled="true"
      aria-posinset={optionIndex + 1}
      aria-selected="false"
      aria-setsize={optionCount}
      className={cn(
        actionItemClassName,
        'cursor-not-allowed items-center text-disabled',
        listVariant !== 'full' && 'mx-2 w-auto',
        descriptionVariant === 'block' && 'items-start',
        optionVariant === 'danger' && 'text-danger',
        className,
        renderedActionListItem?.props.className,
      )}
      data-component="FilteredActionList.Item"
      data-filter-value={filterValue}
      data-group-id={groupId}
      data-index={optionIndex}
      data-item-id={itemId === undefined ? undefined : itemIdKey(itemId)}
      role="option"
    >
      {renderedActionListItem ? (
        <ActionItemElementContent
          item={renderedActionListItem.props}
          showDivider={showItemDividers && optionIndex > 0}
        />
      ) : (
        (renderedItem ?? (
          <ActionItemContent
            description={description}
            descriptionVariant={descriptionVariant}
            leadingVisual={leadingVisual ? renderItemVisual(leadingVisual) : undefined}
            showDivider={showItemDividers && optionIndex > 0}
            trailingVisual={trailingVisual ? renderItemVisual(trailingVisual) : undefined}
          >
            {children}
            {text}
          </ActionItemContent>
        ))
      )}
    </div>
  )
}

interface FilteredActionListVirtualizedOptionsProps {
  itemNodes: React.RefObject<Map<FilteredActionListItem, HTMLElement>>
  itemRenderer?: FilteredActionListRenderItem
  multiple: boolean
  radio: boolean
  rowHeight: number
  selectable: boolean
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  scrollTop: number
  selectedKeys: ReadonlySet<string>
  showItemDividers: boolean
  values: readonly FilteredActionListValue[]
  variant: NonNullable<FilteredActionListProps['variant']>
}

function FilteredActionListVirtualizedOptions({
  itemNodes,
  itemRenderer,
  multiple,
  radio,
  rowHeight,
  selectable,
  scrollContainerRef,
  scrollTop,
  selectedKeys,
  showItemDividers,
  values,
  variant,
}: FilteredActionListVirtualizedOptionsProps) {
  const [viewportHeight, setViewportHeight] = React.useState(320)
  const firstIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - virtualOverscan)
  const lastIndex = Math.min(values.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + virtualOverscan)
  const visibleValues = values.slice(firstIndex, lastIndex)
  const virtualStyle: CSSPropertiesWithCustomProperties = {
    '--filtered-action-list-virtual-height': `${values.length * rowHeight}px`,
    '--filtered-action-list-virtual-row-height': `${rowHeight}px`,
  }

  React.useEffect(() => {
    const element = scrollContainerRef.current
    if (!element) return

    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(entries => {
      const height = entries[0]?.contentRect.height
      if (height) setViewportHeight(height)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [scrollContainerRef])

  return (
    <div
      className="relative w-full h-[var(--filtered-action-list-virtual-height)]"
      role="presentation"
      style={virtualStyle}
    >
      {visibleValues.map((value, offset) => {
        const index = firstIndex + offset
        const itemStyle: CSSPropertiesWithCustomProperties = {
          '--filtered-action-list-virtual-offset': `${index * rowHeight}px`,
        }

        return (
          <div
            className="absolute inset-x-0 top-0 translate-y-[var(--filtered-action-list-virtual-offset)]"
            key={value.renderKey}
            role="presentation"
            style={itemStyle}
          >
            <FilteredActionListOption
              item={value}
              itemNodes={itemNodes}
              itemRenderer={itemRenderer}
              multiple={multiple}
              optionCount={values.length}
              behaviorIndex={index}
              optionIndex={index}
              radio={radio}
              selectable={selectable}
              selected={value.item.id !== undefined && selectedKeys.has(itemIdKey(value.item.id))}
              showItemDividers={showItemDividers}
              variant={variant}
              virtualized
            />
          </div>
        )
      })}
    </div>
  )
}

function scrollVirtualizedOptionIntoView(
  container: HTMLDivElement | null,
  index: number,
  rowHeight: number,
  behavior: ScrollBehavior | undefined,
) {
  if (!container) return

  const itemTop = index * rowHeight
  const itemBottom = itemTop + rowHeight
  const viewportTop = container.scrollTop
  const viewportBottom = viewportTop + container.clientHeight
  const top =
    itemTop < viewportTop ? itemTop : itemBottom > viewportBottom ? itemBottom - container.clientHeight : undefined

  if (top !== undefined && 'scrollTo' in container) container.scrollTo({top, behavior: behavior ?? 'auto'})
}

/** A configured, data-driven filterable ActionList. */
export const FilteredActionList = React.forwardRef<HTMLElement, FilteredActionListProps>(function FilteredActionList(
  {
    'aria-label': ariaLabel = 'Filter items',
    actionListProps,
    announcementsEnabled = true,
    className,
    defaultFilterValue = '',
    defaultSelectedItemIds,
    disableSelectOnHover = false,
    emptyStateText = 'No items found',
    filterValue: controlledFilterValue,
    focusOutBehavior = 'wrap',
    focusPrependedElements = false,
    fullScreenOnNarrow = false,
    groupMetadata,
    inputRef,
    items,
    loading = false,
    loadingType = FilteredActionListLoadingTypes.bodySpinner,
    message,
    messageText,
    onActiveDescendantChanged,
    onFilterChange,
    onInputRefChanged,
    onListContainerRefChanged,
    onSelectAllChange,
    onSelectedChange,
    placeholderText = 'Filter items',
    renderGroup,
    renderItem,
    scrollBehavior,
    scrollContainerRef,
    selectedItemIds,
    selectionVariant,
    setInitialFocus = false,
    showItemDividers = false,
    textInputProps,
    variant = 'inset',
    virtualized = false,
    ...rootProps
  },
  forwardedRef,
) {
  const [uncontrolledFilterValue, setUncontrolledFilterValue] = React.useState(defaultFilterValue)
  const [uncontrolledSelectedItemIds, setUncontrolledSelectedItemIds] = React.useState<FilteredActionListItemId[]>(
    () => {
      return defaultSelectedItemIds
        ? [...defaultSelectedItemIds]
        : items.flatMap(item => (item.selected && item.id !== undefined ? [item.id] : []))
    },
  )
  const [virtualScrollTop, setVirtualScrollTop] = React.useState(0)
  const inputElementRef = React.useRef<HTMLInputElement | null>(null)
  const itemNodes = React.useRef(new Map<FilteredActionListItem, HTMLElement>())
  const previousActiveItem = React.useRef<HTMLElement | undefined>(undefined)
  const scrollElementRef = React.useRef<HTMLDivElement | null>(null)
  const filterDescriptionId = React.useId()
  const generatedListId = React.useId()
  const filterValue = controlledFilterValue ?? uncontrolledFilterValue
  const grouped = Boolean(groupMetadata?.length)
  const multiple = selectionVariant === 'multiple'
  const radio = selectionVariant === 'radio'
  const selectable = selectionVariant !== undefined
  const virtualRowHeight = getVirtualRowHeight(items, grouped, renderItem)
  const useVirtualization = virtualized && virtualRowHeight !== undefined
  const hasLegacySelectedItems = selectedItemIds === undefined && items.some(item => item.selected !== undefined)
  const selectedIds =
    selectedItemIds ??
    (hasLegacySelectedItems
      ? items.flatMap(item => (item.selected && item.id !== undefined ? [item.id] : []))
      : uncontrolledSelectedItemIds)
  const selectedKeys = React.useMemo(() => new Set(selectedIds.map(itemIdKey)), [selectedIds])
  const visibleItems = React.useMemo(() => {
    const query = filterValue.trim().toLocaleLowerCase()
    if (!query) return items
    return items.filter(item => getItemText(item).toLocaleLowerCase().includes(query))
  }, [filterValue, items])
  const values = React.useMemo(
    () =>
      visibleItems.map((item, index) => ({
        item,
        label: getItemText(item),
        renderKey: getItemRenderKey(item, index),
      })),
    [visibleItems],
  )
  const selectableValues = React.useMemo(() => values.filter(value => !value.item.disabled), [values])
  const optionIndexByValue = React.useMemo(() => new Map(values.map((value, index) => [value, index])), [values])
  const behaviorIndexByValue = React.useMemo(
    () => new Map(selectableValues.map((value, index) => [value, index])),
    [selectableValues],
  )
  const groupedValues = React.useMemo(() => {
    if (!groupMetadata?.length) return undefined

    return groupMetadata
      .map(group => ({
        groupId: group.groupId,
        header: group.header,
        items: values.filter(value => value.item.groupId === group.groupId),
        renderGroup: group.renderGroup,
        renderItem: group.renderItem,
      }))
      .filter(group => group.items.length > 0)
  }, [groupMetadata, values])
  const selectedValues = React.useMemo(
    () =>
      items.flatMap((item, index) =>
        item.id !== undefined && selectedKeys.has(itemIdKey(item.id))
          ? [{item, label: getItemText(item), renderKey: getItemRenderKey(item, index)}]
          : [],
      ),
    [items, selectedKeys],
  )
  const bodyLoading = loading && loadingType !== FilteredActionListLoadingTypes.input
  const hasMessage = message !== null && message !== undefined
  const {
    className: actionListClassName,
    id: actionListId,
    onScroll: actionListOnScroll,
    selectionVariant: _actionListSelectionVariant,
    showDividers: _actionListShowDividers,
    style: actionListStyle,
    variant: _actionListVariant,
    ...actionListDomProps
  } = actionListProps ?? {}
  const {className: inputClassName, leadingVisual: LeadingVisual, ...inputProps} = textInputProps ?? {}
  void _actionListSelectionVariant
  void _actionListShowDividers
  void _actionListVariant

  React.useEffect(() => {
    onInputRefChanged?.(inputElementRef)
  }, [onInputRefChanged])

  const setListElement = React.useCallback(
    (node: HTMLDivElement | null) => {
      onListContainerRefChanged?.(node)
    },
    [onListContainerRefChanged],
  )

  const setScrollElement = React.useCallback(
    (node: HTMLDivElement | null) => {
      scrollElementRef.current = node
      mergeRefs(scrollContainerRef)(node)
    },
    [scrollContainerRef],
  )

  const onFilterValueChange = React.useCallback(
    (nextFilterValue: string, details: Combobox.Root.ChangeEventDetails) => {
      if (controlledFilterValue === undefined) setUncontrolledFilterValue(nextFilterValue)
      onFilterChange?.(nextFilterValue, details)
    },
    [controlledFilterValue, onFilterChange],
  )

  const updateSelectedIds = React.useCallback(
    (nextSelectedIds: FilteredActionListItemId[], details?: Combobox.Root.ChangeEventDetails) => {
      if (selectedItemIds === undefined && !hasLegacySelectedItems) setUncontrolledSelectedItemIds(nextSelectedIds)
      onSelectedChange?.(nextSelectedIds, details)
    },
    [hasLegacySelectedItems, onSelectedChange, selectedItemIds],
  )

  const onValueChange = React.useCallback(
    (
      nextValue: FilteredActionListValue | FilteredActionListValue[] | null,
      details: Combobox.Root.ChangeEventDetails,
    ) => {
      const nextValues = Array.isArray(nextValue) ? nextValue : nextValue ? [nextValue] : []
      const nextIds = nextValues.flatMap(value => (value.item.id === undefined ? [] : [value.item.id]))
      const visibleItemKeys = new Set(
        values.flatMap(value => (value.item.id === undefined ? [] : [itemIdKey(value.item.id)])),
      )
      const preservedIds = multiple ? selectedIds.filter(id => !visibleItemKeys.has(itemIdKey(id))) : []
      const nextSelectedIds =
        !multiple && selectionVariant === 'single' && nextIds.length === 1 && selectedKeys.has(itemIdKey(nextIds[0]))
          ? []
          : [...new Map([...preservedIds, ...nextIds].map(id => [itemIdKey(id), id])).values()]
      updateSelectedIds(nextSelectedIds, details)
    },
    [multiple, selectedIds, selectedKeys, selectionVariant, updateSelectedIds, values],
  )

  const onHighlighted = React.useCallback(
    (value: FilteredActionListValue | undefined, details: Combobox.Root.HighlightEventDetails) => {
      const current = value ? itemNodes.current.get(value.item) : undefined
      onActiveDescendantChanged?.(current, previousActiveItem.current, details.reason === 'keyboard')
      previousActiveItem.current = current

      if (details.reason !== 'keyboard' || !value) return
      const index = details.index
      if (useVirtualization && index >= 0) {
        scrollVirtualizedOptionIntoView(scrollElementRef.current, index, virtualRowHeight, scrollBehavior)
      } else if (current && 'scrollIntoView' in current) {
        current.scrollIntoView({behavior: scrollBehavior ?? 'auto', block: 'nearest'})
      }
    },
    [onActiveDescendantChanged, scrollBehavior, useVirtualization, virtualRowHeight],
  )

  const selectableVisibleItems = visibleItems.filter(item => !item.disabled && item.id !== undefined)
  const allSelected =
    selectableVisibleItems.length > 0 && selectableVisibleItems.every(item => selectedKeys.has(itemIdKey(item.id!)))
  const someSelected = !allSelected && selectableVisibleItems.some(item => selectedKeys.has(itemIdKey(item.id!)))
  const selectAllLabel = allSelected ? 'Deselect all' : 'Select all'

  return (
    <Combobox.Root<FilteredActionListValue, boolean>
      autoHighlight={focusPrependedElements || !setInitialFocus}
      defaultInputValue={defaultFilterValue}
      filteredItems={selectableValues}
      highlightItemOnHover={!disableSelectOnHover}
      inline
      inputValue={filterValue}
      isItemEqualToValue={(first, second) => areItemsEqual(first.item, second.item)}
      itemToStringLabel={value => value.label}
      items={selectableValues}
      loopFocus={focusOutBehavior !== 'stop'}
      multiple={multiple}
      onInputValueChange={onFilterValueChange}
      onItemHighlighted={onHighlighted}
      onValueChange={onValueChange}
      open
      value={multiple ? selectedValues : (selectedValues[0] ?? null)}
      virtualized={useVirtualization}
    >
      <div
        {...rootProps}
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        className={cn('flex h-full min-h-0 w-full flex-col overflow-hidden', className)}
        data-component="FilteredActionList"
      >
        <div
          className="relative z-1 shrink-0 shadow-[0_1px_0_var(--borderColor-default)]"
          data-component="FilteredActionList.Header"
        >
          <Combobox.Input
            aria-describedby={filterDescriptionId}
            aria-label={ariaLabel}
            placeholder={placeholderText}
            ref={mergeRefs(inputElementRef, inputRef)}
            render={
              <TextInput
                loaderPosition="leading"
                {...inputProps}
                block
                leadingVisual={LeadingVisual ? renderItemVisual(LeadingVisual) : undefined}
                loading={loading && loadingType === FilteredActionListLoadingTypes.input}
                className={cn(
                  'min-w-0',
                  // Match upstream: keep iOS from zooming the viewport when focusing a narrow input.
                  fullScreenOnNarrow &&
                    'max-md:supports-[-webkit-touch-callout:none]:text-[var(--text-title-size-small)]',
                  inputClassName,
                )}
              />
            }
          />
        </div>
        <span id={filterDescriptionId} className="sr-only">
          Items will be filtered as you type
        </span>
        {announcementsEnabled ? (
          <span aria-live="polite" className="sr-only">
            {loading
              ? 'Loading items'
              : `${visibleItems.length} ${visibleItems.length === 1 ? 'item' : 'items'} available`}
          </span>
        ) : null}
        {multiple && onSelectAllChange ? (
          <div
            className="flex h-8 shrink-0 items-center gap-2 border-b border-default bg-muted px-4 text-sm text-muted"
            data-component="FilteredActionList.SelectAll"
          >
            <Checkbox
              aria-label={selectAllLabel}
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={checked => {
                const visibleKeys = new Set(selectableVisibleItems.map(item => itemIdKey(item.id!)))
                const nextSelectedIds = checked
                  ? [
                      ...selectedIds,
                      ...selectableVisibleItems
                        .filter(item => !selectedKeys.has(itemIdKey(item.id!)))
                        .map(item => item.id!),
                    ]
                  : selectedIds.filter(id => !visibleKeys.has(itemIdKey(id)))
                updateSelectedIds(nextSelectedIds)
                onSelectAllChange(checked)
              }}
              data-component="FilteredActionList.SelectAllCheckbox"
            />
            <span data-component="FilteredActionList.SelectAllLabel">{selectAllLabel}</span>
          </div>
        ) : null}
        <div
          className="flex min-h-0 flex-1 overflow-auto"
          data-component="FilteredActionList.Container"
          onScroll={event => {
            ;(actionListOnScroll as React.UIEventHandler<HTMLDivElement> | undefined)?.(event)
            if (useVirtualization) setVirtualScrollTop(event.currentTarget.scrollTop)
          }}
          ref={setScrollElement}
        >
          {bodyLoading ? (
            <BodyLoader announce={!announcementsEnabled} loadingType={loadingType} />
          ) : hasMessage ? (
            <div className="flex flex-1" data-component="FilteredActionList.MessageContainer">
              {message}
            </div>
          ) : (
            <Combobox.List
              {...(actionListDomProps as React.ComponentPropsWithoutRef<typeof Combobox.List>)}
              aria-label={actionListProps?.['aria-label'] ?? ariaLabel}
              className={cn(
                'm-0 min-h-full flex-1 text-default',
                variant === 'inset' && !useVirtualization && 'py-2',
                variant === 'horizontal-inset' && 'pb-2',
                actionListClassName,
              )}
              data-component="FilteredActionList.List"
              id={actionListId ?? generatedListId}
              ref={setListElement}
              style={actionListStyle}
            >
              {useVirtualization ? (
                <FilteredActionListVirtualizedOptions
                  itemNodes={itemNodes}
                  itemRenderer={renderItem}
                  multiple={multiple}
                  radio={radio}
                  rowHeight={virtualRowHeight}
                  selectable={selectable}
                  scrollContainerRef={scrollElementRef}
                  scrollTop={virtualScrollTop}
                  selectedKeys={selectedKeys}
                  showItemDividers={showItemDividers}
                  values={values}
                  variant={variant}
                />
              ) : groupedValues ? (
                groupedValues.map(group => {
                  const hasDisabledItems = group.items.some(value => value.item.disabled)
                  const renderOption = (value: FilteredActionListValue) => {
                    const optionIndex = optionIndexByValue.get(value)!
                    if (value.item.disabled) {
                      return (
                        <FilteredActionListDisabledOption
                          group={group}
                          item={value}
                          itemRenderer={renderItem}
                          key={value.renderKey}
                          optionCount={values.length}
                          optionIndex={optionIndex}
                          showItemDividers={showItemDividers}
                          variant={variant}
                        />
                      )
                    }

                    return (
                      <FilteredActionListOption
                        behaviorIndex={behaviorIndexByValue.get(value)!}
                        group={group}
                        item={value}
                        itemNodes={itemNodes}
                        itemRenderer={renderItem}
                        key={value.renderKey}
                        multiple={multiple}
                        optionCount={values.length}
                        optionIndex={optionIndex}
                        radio={radio}
                        selectable={selectable}
                        selected={value.item.id !== undefined && selectedKeys.has(itemIdKey(value.item.id))}
                        showItemDividers={showItemDividers}
                        variant={variant}
                      />
                    )
                  }
                  const groupContent = (
                    <>
                      <Combobox.GroupLabel
                        className={cn(
                          'flex min-h-[30px] items-center px-3 py-1.5 text-xs leading-[18px] font-semibold text-muted',
                          group.header?.variant === 'filled' && 'mb-2 border-y border-muted bg-muted',
                        )}
                        data-component="FilteredActionList.GroupHeading"
                      >
                        {group.header?.title ?? `Group ${group.groupId}`}
                      </Combobox.GroupLabel>
                      {hasDisabledItems ? (
                        group.items.map(renderOption)
                      ) : (
                        <Combobox.Collection>
                          {(value: FilteredActionListValue) => renderOption(value)}
                        </Combobox.Collection>
                      )}
                    </>
                  )
                  const GroupRenderer = group.renderGroup ?? renderGroup

                  return (
                    <Combobox.Group
                      className="block pb-2 last:pb-0"
                      items={group.items.filter(value => !value.item.disabled)}
                      key={group.groupId}
                    >
                      {GroupRenderer ? <GroupRenderer>{groupContent}</GroupRenderer> : groupContent}
                    </Combobox.Group>
                  )
                })
              ) : (
                <>
                  {values.some(value => value.item.disabled) ? (
                    values.map(value => {
                      const optionIndex = optionIndexByValue.get(value)!
                      if (value.item.disabled) {
                        return (
                          <FilteredActionListDisabledOption
                            item={value}
                            itemRenderer={renderItem}
                            key={value.renderKey}
                            optionCount={values.length}
                            optionIndex={optionIndex}
                            showItemDividers={showItemDividers}
                            variant={variant}
                          />
                        )
                      }

                      return (
                        <FilteredActionListOption
                          behaviorIndex={behaviorIndexByValue.get(value)!}
                          item={value}
                          itemNodes={itemNodes}
                          itemRenderer={renderItem}
                          key={value.renderKey}
                          multiple={multiple}
                          optionCount={values.length}
                          optionIndex={optionIndex}
                          radio={radio}
                          selectable={selectable}
                          selected={value.item.id !== undefined && selectedKeys.has(itemIdKey(value.item.id))}
                          showItemDividers={showItemDividers}
                          variant={variant}
                        />
                      )
                    })
                  ) : (
                    <Combobox.Collection>
                      {(value: FilteredActionListValue) => {
                        const optionIndex = optionIndexByValue.get(value)!
                        return (
                          <FilteredActionListOption
                            behaviorIndex={behaviorIndexByValue.get(value)!}
                            item={value}
                            itemNodes={itemNodes}
                            itemRenderer={renderItem}
                            key={value.renderKey}
                            multiple={multiple}
                            optionCount={values.length}
                            optionIndex={optionIndex}
                            radio={radio}
                            selectable={selectable}
                            selected={value.item.id !== undefined && selectedKeys.has(itemIdKey(value.item.id))}
                            showItemDividers={showItemDividers}
                            variant={variant}
                          />
                        )
                      }}
                    </Combobox.Collection>
                  )}
                </>
              )}
            </Combobox.List>
          )}
        </div>
        {!bodyLoading && !hasMessage && visibleItems.length === 0 ? (
          <Combobox.Empty className="flex flex-1" data-component="FilteredActionList.Empty">
            <div className="p-3 text-sm text-muted">{emptyStateText}</div>
          </Combobox.Empty>
        ) : null}
        {messageText ? (
          <span className="sr-only" role="status">
            {messageText.title}. {messageText.description}
          </span>
        ) : null}
      </div>
    </Combobox.Root>
  )
})

FilteredActionList.displayName = 'FilteredActionList'
