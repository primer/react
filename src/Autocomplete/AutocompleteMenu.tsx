import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActionList, ItemProps } from '../ActionList'
import { useAnchoredPosition } from '../hooks'
import { useFocusZone } from '../hooks/useFocusZone'
import Overlay, { OverlayProps } from '../Overlay'
import { ComponentProps, MandateProps } from '../utils/types'
import { Box, Spinner } from '../'
import { registerPortalRoot } from '../Portal'
import { AutocompleteContext } from './AutocompleteContext'
import { useCombinedRefs } from '../hooks/useCombinedRefs'
import { PlusIcon } from '@primer/octicons-react'
import { uniqueId } from '../utils/uniqueId'
import { scrollIntoViewingArea } from '../utils/scrollIntoViewingArea'

type OnAction<T> = (item: T, event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void

const DROPDOWN_PORTAL_CONTAINER_NAME = '__listcontainerportal__'

const getDefaultSortFn = (isItemSelectedFn: (itemId: string | number) => boolean) => 
    (itemIdA: string | number, itemIdB: string | number) => isItemSelectedFn(itemIdA) === isItemSelectedFn(itemIdB)
        ? 0
        : isItemSelectedFn(itemIdA)
            ? -1
            : 1

function getDefaultItemFilter<T extends MandateProps<ItemProps, 'id'>>(filterValue: string) {
    return function (item: T, _i: number) {
        return Boolean(
            item.text
                ?.toLowerCase()
                .startsWith((filterValue)
                .toLowerCase())
        )
    }
}

type AutocompleteItemProps<T = Record<string, any>> = MandateProps<ItemProps, 'id'> & { metadata?: T }

type AutocompleteMenuInternalProps<T extends AutocompleteItemProps> = {
  /**
   * A menu item that is used to allow users make a selection that is not available in the array passed to the `items` prop.
   * This menu item gets appended to the end of the list of options.
   */
  // TODO: rethink this part of the component API. this is kind of weird and confusing to use
  // TODO: rethink `addNewItem` prop name
  addNewItem?: Omit<T, 'onAction' | 'leadingVisual' | 'id'> & {handleAddItem: (item: Omit<T, 'onAction' | 'leadingVisual'>) => void}
  /**
   * The text that appears in the menu when there are no options in the array passed to the `items` prop.
   */
  emptyStateText?: React.ReactNode | false
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
   * The function that is called when an item in the list is de-selected
   */
  onItemDeselect?: OnAction<T>
  /**
   * The function that is called when an item in the list is selected
   */
  onItemSelect?: OnAction<T>
  /**
   * Whether the data is loaded for the menu items
   */
  loading?: boolean
  /**
   * The IDs of the selected items
   */
  // NOTE: this diverges from the SelectPanel component API, where we pass an array of objects to the `selected` prop
  selectedItemIds: Array<string | number>
  /**
   * The sort function that is applied to the options in the array passed to the `items` prop after the user closes the menu.
   * By default, selected items are sorted to the top after the user closes the menu.
   */
  sortOnCloseFn?: (itemIdA: string | number, itemIdB: string | number) => number
  /**
   * Whether there can be one item selected from the menu or multiple items selected from the menu
   */
  selectionVariant?: 'single' | 'multiple'
  /**
   * The ref of the element that the position of the menu is based on. By default, the menu is positioned based on the text input
   */
  menuAnchorRef?: React.RefObject<Element>
  /**
   * Whether the menu should be displayed in an overlay
   */
  preventOverlay?: boolean
  /**
   * Props to be spread on the internal `Overlay` component.
   */
   overlayProps?: Partial<OverlayProps>
} & Pick<React.AriaAttributes, 'aria-labelledby'> // TODO: consider making 'aria-labelledby' required

function getDefaultOnItemSelectFn<T extends MandateProps<ItemProps, 'id'>>(setInputValueFn?: React.Dispatch<React.SetStateAction<string>>): OnAction<T> {
    if (setInputValueFn) {
        return function ({text = ''}) {
            setInputValueFn(text)
        }
    }

    return ({text}) => {
        console.error(`getDefaultOnItemSelectFn could not be called with ${text} because a function to set the text input was undefined`)
    }
}

function AutocompleteMenu<T extends AutocompleteItemProps>(props: AutocompleteMenuInternalProps<T>) {
    const {
        activeDescendantRef,
        id,
        inputRef,
        inputValue = '',
        setAutocompleteSuggestion,
        setShowMenu,
        setInputValue,
        setIsMenuDirectlyActivated,
        showMenu,
    } = useContext(AutocompleteContext)
    const {
        items,
        selectedItemIds,
        sortOnCloseFn,
        onItemSelect = getDefaultOnItemSelectFn(setInputValue),
        onItemDeselect,
        emptyStateText,
        addNewItem,
        loading,
        selectionVariant,
        filterFn = getDefaultItemFilter(inputValue),
        menuAnchorRef,
        "aria-labelledby": ariaLabelledBy,
        preventOverlay,
        overlayProps
    } = props
    const listContainerRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [highlightedItem, setHighlightedItem] = useState<T>()
    const [sortedItemIds, setSortedItemIds] = useState<Array<number | string>>(items.map(({id}) => id))

    const {floatingElementRef, position} = useAnchoredPosition(
        {
            side: 'outside-bottom',
            align: 'start',
            anchorElementRef: menuAnchorRef ? menuAnchorRef : inputRef
        },
        [showMenu, selectedItemIds]
    )

    const combinedOverlayRef = useCombinedRefs(scrollContainerRef, floatingElementRef)

    const closeOptionList = () => {
        setShowMenu && setShowMenu(false)
    }

    const isItemSelected = (itemId: string | number) => selectedItemIds.includes(itemId)

    const selectableItems = items.map((selectableItem) => ({
            ...selectableItem,
            role: "option",
            id: selectableItem.id,
            selected: selectionVariant === 'multiple' ? isItemSelected(selectableItem.id) : undefined,
            onAction: (item: T, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
                const handleItemSelection = () => {
                    onItemSelect(item, e)

                    if (selectionVariant === 'multiple') {
                        setInputValue && setInputValue('')
                        setAutocompleteSuggestion && setAutocompleteSuggestion('')
                    }
                }

                if (item.selected) {
                    onItemDeselect && onItemDeselect(item, e)
                } else {
                    handleItemSelection()
                }

                if (selectionVariant === 'single') {
                    setShowMenu && setShowMenu(false)
                    inputRef?.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
                }
            }
        })
    )

    const itemSortOrderData = sortedItemIds.reduce<Record<string | number, number>>((acc, curr, i) => {
        acc[curr] = i

        return acc
    }, {})

    const sortedAndFilteredItemsToRender =
        selectableItems.filter(
            (item, i) => filterFn(item, i)
        ).sort((a, b) => itemSortOrderData[a.id] - itemSortOrderData[b.id])

    const allItemsToRender = [
        // sorted and filtered selectable items
        ...sortedAndFilteredItemsToRender,

        // menu item used for creating a token from whatever is in the text input
        ...(addNewItem
            ? [{
                ...addNewItem,
                leadingVisual: () => ( <PlusIcon /> ),
                onAction: (item: T, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
                    // TODO: make it possible to pass a leadingVisual when using `addNewItem`
                    addNewItem.handleAddItem({...item, id: item.id || uniqueId(), leadingVisual: undefined})

                    if (selectionVariant === 'multiple') {
                        setInputValue && setInputValue('')
                        setAutocompleteSuggestion && setAutocompleteSuggestion('')
                    }
                }
            }]
            : []
        )
    ]

    useFocusZone({
        containerRef: listContainerRef,
        focusOutBehavior: 'wrap',
        focusableElementFilter: element => {
            return !(element instanceof HTMLInputElement)
        },
        activeDescendantFocus: inputRef,
        onActiveDescendantChanged: (current, _previous, directlyActivated) => {
            if (activeDescendantRef) {
                activeDescendantRef.current = current || null
            }
            if (current) {
                const selectedItem = selectableItems.find(item => item.id.toString() === current?.dataset.id)

                setHighlightedItem(selectedItem)
                setIsMenuDirectlyActivated && setIsMenuDirectlyActivated(directlyActivated)
            }

            if (current && scrollContainerRef.current && directlyActivated) {
                scrollIntoViewingArea(current, scrollContainerRef.current)
            }
        }
    }, [loading])

    useEffect(() => {
        if (!setAutocompleteSuggestion) {
            return
        }

        if (highlightedItem?.text?.startsWith(inputValue) && !selectedItemIds.includes(highlightedItem.id)) {
            setAutocompleteSuggestion(highlightedItem.text)
        } else {
            setAutocompleteSuggestion('')
        }
    }, [highlightedItem, inputValue])

    useEffect(() => {
        setSortedItemIds(
            [...sortedItemIds].sort(sortOnCloseFn ? sortOnCloseFn : getDefaultSortFn(isItemSelected))
        )
    }, [showMenu])

    if (listContainerRef.current) {
        registerPortalRoot(listContainerRef.current, DROPDOWN_PORTAL_CONTAINER_NAME)
    }

    const selectionList = (
        <>
            {loading ? (
                <Box p={3} display="flex" justifyContent="center">
                    <Spinner />
                </Box>
            ) : (
                <div ref={listContainerRef}>
                    {allItemsToRender.length ? (
                        <ActionList
                            selectionVariant="multiple"
                            // have to typecast to `ItemProps` because we have an extra property 
                            // on `items` for Autocomplete: `metadata`
                            items={allItemsToRender as ItemProps[]}
                            role="listbox"
                            id={`${id}-listbox`}
                            aria-labelledby={ariaLabelledBy}
                        />
                        ) : (
                            <Box p={3}>{emptyStateText}</Box>
                        )}
                </div>
            )}
        </>
    );

    if (preventOverlay) {
        return selectionList
    }

    return (
        <Overlay
            returnFocusRef={inputRef}
            preventFocusOnOpen={true}
            onClickOutside={closeOptionList}
            onEscape={closeOptionList}
            ref={combinedOverlayRef as React.RefObject<HTMLDivElement>}
            top={position?.top}
            left={position?.left}
            visibility={showMenu ? 'visible' : 'hidden'}
            {...overlayProps}
        >
            <Box height="100%" overflow="auto">
                {selectionList}
            </Box>
        </Overlay>
    )
}

AutocompleteMenu.defaultProps = {
    emptyStateText: 'No selectable options',
    selectionVariant: 'single',
}

AutocompleteMenu.displayName = 'AutocompleteMenu'

export type AutocompleteMenuProps = ComponentProps<typeof AutocompleteMenu>
export default AutocompleteMenu
