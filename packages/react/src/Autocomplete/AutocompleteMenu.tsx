import React, {useContext, useEffect, useMemo, useRef, useState} from 'react'
import {debounce} from '@github/mini-throttle'
import {announce} from '@primer/live-region-element'
import {scrollIntoView} from '@primer/behaviors'
import type {ScrollIntoViewOptions} from '@primer/behaviors'
import type {ActionListItemProps} from '../ActionList'
import {ActionList} from '../ActionList'
import {useFocusZone} from '../hooks/useFocusZone'
import type {ComponentProps, MandateProps, AriaRole} from '../utils/types'
import Spinner from '../Spinner'
import {useId} from '../hooks/useId'
import {AutocompleteContext} from './AutocompleteContext'
import type {IconProps} from '@primer/octicons-react'
import {PlusIcon} from '@primer/octicons-react'
import VisuallyHidden from '../_VisuallyHidden'
import {isElement} from 'react-is'

import classes from './AutocompleteMenu.module.css'

type OnSelectedChange<T> = (item: T | T[]) => void
export type AutocompleteMenuItem = MandateProps<ActionListItemProps, 'id'> & {
  leadingVisual?: React.FunctionComponent<React.PropsWithChildren<IconProps>> | React.ReactElement<any>
  text?: string
  trailingVisual?: React.FunctionComponent<React.PropsWithChildren<IconProps>> | React.ReactElement<any>
}

const getDefaultSortFn = (isItemSelectedFn: (itemId: string) => boolean) => (itemIdA: string, itemIdB: string) =>
  isItemSelectedFn(itemIdA) === isItemSelectedFn(itemIdB) ? 0 : isItemSelectedFn(itemIdA) ? -1 : 1
const menuScrollMargins: ScrollIntoViewOptions = {startMargin: 0, endMargin: 8}

function getDefaultItemFilter<T extends AutocompleteMenuItem>(filterValue: string) {
  return function (item: T, _i: number) {
    return Boolean(item.text?.toLowerCase().startsWith(filterValue.toLowerCase()))
  }
}

function getdefaultCheckedSelectionChange<T extends AutocompleteMenuItem>(
  setInputValueFn: (value: string) => void,
): OnSelectedChange<T> {
  return function (itemOrItems) {
    const {text = ''} = Array.isArray(itemOrItems) ? itemOrItems.slice(-1)[0] : itemOrItems
    setInputValueFn(text)
  }
}

const isItemSelected = (itemId: string, selectedItemIds: Array<string>) => selectedItemIds.includes(itemId)

function getItemById<T extends AutocompleteMenuItem>(itemId: string, items: T[]) {
  return items.find(item => item.id === itemId)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AutocompleteItemProps<T = Record<string, any>> = AutocompleteMenuItem & {metadata?: T}

export type AutocompleteMenuInternalProps<T extends AutocompleteItemProps> = {
  /**
   * A menu item that is used to allow users make a selection that is not available in the array passed to the `items` prop.
   * This menu item gets appended to the end of the list of options.
   */
  addNewItem?: T & {
    handleAddItem: (item: Omit<T, 'onAction' | 'leadingVisual'>) => void
  }

  /**
   * The text that appears in the menu when there are no options in the array passed to the `items` prop.
   */
  emptyStateText?: React.ReactNode | false | null

  /**
   * A custom function used to filter the options in the array passed to the `items` prop.
   * By default, we filter out items that don't match the value of the autocomplete text input. The default filter is not case-sensitive.
   */
  filterFn?: (item: T, i: number) => boolean

  /**
   * The options for field values that are displayed in the dropdown menu.
   * One or more may be selected depending on the value of the `selectionVariant` prop.
   */
  items: T[]

  /**
   * Whether the data is loaded for the menu items
   */
  loading?: boolean

  /**
   * The IDs of the selected items
   */
  // NOTE: this diverges from the SelectPanel component API, where we pass an array of objects to the `selected` prop
  selectedItemIds: string[]

  /**
   * The sort function that is applied to the options in the array passed to the `items` prop after the user closes the menu.
   * By default, selected items are sorted to the top after the user closes the menu.
   */
  sortOnCloseFn?: (itemIdA: string, itemIdB: string) => number

  /**
   * Whether there can be one item selected from the menu or multiple items selected from the menu
   */
  selectionVariant?: 'single' | 'multiple'

  /**
   * Function that gets called when the menu is opened or closed
   */
  onOpenChange?: (open: boolean) => void

  /**
   * The function that is called when an item in the list is selected or deselected
   */
  onSelectedChange?: OnSelectedChange<T>

  /**
   * If the menu is rendered in a scrolling element other than the `Autocomplete.Overlay` component,
   * pass the ref of that element to `customScrollContainerRef` to ensure the container automatically
   * scrolls when the user highlights an item in the menu that is outside the scroll container
   */
  customScrollContainerRef?: React.MutableRefObject<HTMLElement | null>
  // TODO: instead of making this required, maybe we can infer aria-labelledby from the ID of the text input somehow?
  ['aria-labelledby']: string
}

/**
 * Announces a message to screen readers at a slowed-down rate. This is useful when you want to announce don't want to
 * overwhelm the user with too many announcements in rapid succession.
 */
const debounceAnnouncement = debounce((announcement: string) => {
  announce(announcement)
}, 250)

function AutocompleteMenu<T extends AutocompleteItemProps>(props: AutocompleteMenuInternalProps<T>) {
  const autocompleteContext = useContext(AutocompleteContext)
  if (autocompleteContext === null) {
    throw new Error('AutocompleteContext returned null values')
  }
  const {
    activeDescendantRef,
    id,
    inputRef,
    inputValue = '',
    scrollContainerRef,
    setAutocompleteSuggestion,
    setShowMenu,
    setInputValue,
    setIsMenuDirectlyActivated,
    setSelectedItemLength,
    showMenu,
  } = autocompleteContext
  const {
    items,
    selectedItemIds,
    sortOnCloseFn,
    emptyStateText = 'No selectable options',
    addNewItem,
    loading,
    selectionVariant = 'single',
    filterFn,
    'aria-labelledby': ariaLabelledBy,
    onOpenChange,
    onSelectedChange,
    customScrollContainerRef,
  } = props
  const listContainerRef = useRef<HTMLDivElement>(null)
  const allItemsToRenderRef = useRef<T[]>([])
  const [highlightedItem, setHighlightedItem] = useState<T>()
  const [sortedItemIds, setSortedItemIds] = useState<Array<string>>(items.map(({id: itemId}) => itemId))
  const generatedUniqueId = useId(id)

  const selectableItems = useMemo(
    () =>
      items.map(selectableItem => {
        return {
          ...selectableItem,
          role: 'option',
          id: selectableItem.id,
          active: highlightedItem?.id === selectableItem.id,
          selected: selectionVariant === 'multiple' ? selectedItemIds.includes(selectableItem.id) : undefined,
          onAction: (item: T) => {
            const otherSelectedItemIds = selectedItemIds.filter(selectedItemId => selectedItemId !== item.id)
            const newSelectedItemIds = selectedItemIds.includes(item.id)
              ? otherSelectedItemIds
              : [...otherSelectedItemIds, item.id]
            const onSelectedChangeFn = onSelectedChange
              ? onSelectedChange
              : getdefaultCheckedSelectionChange(setInputValue)

            onSelectedChangeFn(
              newSelectedItemIds.map(newSelectedItemId => getItemById(newSelectedItemId, items)) as T[],
            )

            if (selectionVariant === 'multiple') {
              setInputValue('')
              setAutocompleteSuggestion('')
            } else {
              setShowMenu(false)
              inputRef.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
            }
          },
        }
      }),
    [
      highlightedItem,
      items,
      selectedItemIds,
      inputRef,
      onSelectedChange,
      selectionVariant,
      setAutocompleteSuggestion,
      setInputValue,
      setShowMenu,
    ],
  )

  const itemSortOrderData = useMemo(
    () =>
      sortedItemIds.reduce<Record<string, number>>((acc, curr, i) => {
        acc[curr] = i

        return acc
      }, {}),
    [sortedItemIds],
  )

  const sortedAndFilteredItemsToRender = useMemo(
    () =>
      selectableItems
        .filter(filterFn ? filterFn : getDefaultItemFilter(inputValue))
        .sort((a, b) => itemSortOrderData[a.id] - itemSortOrderData[b.id]),
    [selectableItems, itemSortOrderData, filterFn, inputValue],
  )

  const allItemsToRender = useMemo(
    () => [
      // sorted and filtered selectable items
      ...sortedAndFilteredItemsToRender,

      // menu item used for creating a token from whatever is in the text input
      ...(addNewItem
        ? [
            {
              ...addNewItem,
              role: 'option',
              key: addNewItem.id,
              active: highlightedItem?.id === addNewItem.id,
              selected: selectionVariant === 'multiple' ? selectedItemIds.includes(addNewItem.id) : undefined,
              leadingVisual: () => <PlusIcon />,
              onAction: (item: T) => {
                // TODO: make it possible to pass a leadingVisual when using `addNewItem`
                addNewItem.handleAddItem({...item, id: item.id || generatedUniqueId, leadingVisual: undefined})

                if (selectionVariant === 'multiple') {
                  setInputValue('')
                  setAutocompleteSuggestion('')
                }
              },
            },
          ]
        : []),
    ],
    [
      sortedAndFilteredItemsToRender,
      addNewItem,
      setAutocompleteSuggestion,
      selectionVariant,
      setInputValue,
      generatedUniqueId,
      highlightedItem,
      selectedItemIds,
    ],
  )

  React.useEffect(() => {
    allItemsToRenderRef.current = allItemsToRender
  })

  React.useEffect(() => {
    if (allItemsToRender.length === 0) {
      debounceAnnouncement(emptyStateText as string)
    }
  }, [allItemsToRender, emptyStateText])

  useFocusZone(
    {
      containerRef: listContainerRef,
      focusOutBehavior: 'wrap',
      focusableElementFilter: element => {
        return !(element instanceof HTMLInputElement)
      },
      activeDescendantFocus: inputRef,
      onActiveDescendantChanged: (current, _previous, directlyActivated) => {
        activeDescendantRef.current = current || null
        if (current) {
          const selectedItem = allItemsToRenderRef.current.find(item => {
            return item.id === current.closest('li')?.getAttribute('data-id')
          })

          setHighlightedItem(selectedItem)
          setIsMenuDirectlyActivated(directlyActivated)
        }

        if (current && customScrollContainerRef && customScrollContainerRef.current && directlyActivated) {
          scrollIntoView(current, customScrollContainerRef.current, menuScrollMargins)
        } else if (current && scrollContainerRef.current && directlyActivated) {
          scrollIntoView(current, scrollContainerRef.current, menuScrollMargins)
        }
      },
    },
    [loading],
  )

  useEffect(() => {
    if (highlightedItem?.text?.startsWith(inputValue) && !selectedItemIds.includes(highlightedItem.id)) {
      setAutocompleteSuggestion(highlightedItem.text)
    } else {
      setAutocompleteSuggestion('')
    }
  }, [highlightedItem, inputValue, selectedItemIds, setAutocompleteSuggestion])

  useEffect(() => {
    const itemIdSortResult = [...sortedItemIds].sort(
      sortOnCloseFn ? sortOnCloseFn : getDefaultSortFn(itemId => isItemSelected(itemId, selectedItemIds)),
    )
    const sortResultMatchesState =
      itemIdSortResult.length === sortedItemIds.length &&
      itemIdSortResult.every((element, index) => element === sortedItemIds[index])

    if (showMenu === false && !sortResultMatchesState) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSortedItemIds(itemIdSortResult)
    }

    onOpenChange && onOpenChange(Boolean(showMenu))
  }, [showMenu, onOpenChange, selectedItemIds, sortOnCloseFn, sortedItemIds])

  useEffect(() => {
    if (selectedItemIds.length) {
      setSelectedItemLength(selectedItemIds.length)
    }
  }, [selectedItemIds, setSelectedItemLength])

  if (selectionVariant === 'single' && selectedItemIds.length > 1) {
    throw new Error('Autocomplete: selectionVariant "single" cannot be used with multiple selected items')
  }

  return (
    <VisuallyHidden isVisible={showMenu}>
      {loading ? (
        <div className={classes.SpinnerWrapper}>
          <Spinner />
        </div>
      ) : (
        <div ref={listContainerRef}>
          {allItemsToRender.length ? (
            <ActionList
              selectionVariant={selectionVariant} // TODO: make this configurable
              role="listbox"
              id={`${id}-listbox`}
              aria-labelledby={ariaLabelledBy}
            >
              {allItemsToRender.map(item => {
                const {
                  id,
                  onAction,
                  children,
                  text,
                  leadingVisual: LeadingVisual,
                  trailingVisual: TrailingVisual,
                  key,
                  role,
                  ...itemProps
                } = item
                return (
                  <ActionList.Item
                    key={(key ?? id) as string | number}
                    onSelect={() => onAction(item)}
                    {...itemProps}
                    id={id}
                    data-id={id}
                    role={role as AriaRole}
                  >
                    {LeadingVisual && (
                      <ActionList.LeadingVisual>
                        {isElement(LeadingVisual) ? LeadingVisual : <LeadingVisual />}
                      </ActionList.LeadingVisual>
                    )}
                    {(children ?? text) as React.ReactNode}
                    {TrailingVisual && (
                      <ActionList.TrailingVisual>
                        {isElement(TrailingVisual) ? TrailingVisual : <TrailingVisual />}
                      </ActionList.TrailingVisual>
                    )}
                  </ActionList.Item>
                )
              })}
            </ActionList>
          ) : emptyStateText !== false && emptyStateText !== null ? (
            <div className={classes.EmptyStateWrapper}>{emptyStateText}</div>
          ) : null}
        </div>
      )}
    </VisuallyHidden>
  )
}

AutocompleteMenu.displayName = 'AutocompleteMenu'

export type AutocompleteMenuProps = ComponentProps<typeof AutocompleteMenu>
export default AutocompleteMenu

AutocompleteMenu.__SLOT__ = Symbol('Autocomplete.Menu')
