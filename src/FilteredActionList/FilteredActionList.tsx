import React, {KeyboardEventHandler, useCallback, useEffect, useMemo, useRef} from 'react'
import {GroupedListProps, ListPropsBase} from '../ActionList/List'
import TextInput, {TextInputProps} from '../TextInput'
import Box from '../Box'
import Flex from '../Flex'
import {ActionList} from '../ActionList'
import Spinner from '../Spinner'
import {useFocusZone} from '../hooks/useFocusZone'
import {uniqueId} from '../utils/uniqueId'
import {itemActiveDescendantClass} from '../ActionList/Item'

export interface FilteredActionListProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  loading?: boolean
  placeholderText: string
  onFilterChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
  textInputProps?: Partial<Omit<TextInputProps, 'onChange'>>
}

function scrollIntoViewingArea(
  child: HTMLElement,
  container: HTMLElement,
  margin = 8,
  behavior: ScrollBehavior = 'smooth'
) {
  const {top: childTop, bottom: childBottom} = child.getBoundingClientRect()
  const {top: containerTop, bottom: containerBottom} = container.getBoundingClientRect()

  const isChildTopAboveViewingArea = childTop < containerTop + margin
  const isChildBottomBelowViewingArea = childBottom > containerBottom - margin

  if (isChildTopAboveViewingArea) {
    const scrollHeightToChildTop = childTop - containerTop + container.scrollTop
    container.scrollTo({behavior, top: scrollHeightToChildTop - margin})
  } else if (isChildBottomBelowViewingArea) {
    const scrollHeightToChildBottom = childBottom - containerBottom + container.scrollTop
    container.scrollTo({behavior, top: scrollHeightToChildBottom + margin})
  }

  // either completely in view or outside viewing area on both ends, don't scroll
}

export function FilteredActionList({
  loading = false,
  placeholderText,
  onFilterChange,
  items,
  textInputProps,
  ...listProps
}: FilteredActionListProps): JSX.Element {
  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      onFilterChange(value, e)
    },
    [onFilterChange]
  )

  const containerRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const activeDescendantRef = useRef<HTMLElement>()
  const listId = useMemo(uniqueId, [])
  const onInputKeyPress: KeyboardEventHandler = useCallback(
    event => {
      if (event.key === 'Enter' && activeDescendantRef.current) {
        event.preventDefault()
        event.nativeEvent.stopImmediatePropagation()

        // Forward Enter key press to active descendant so that item gets activated
        const activeDescendantEvent = new KeyboardEvent(event.type, event.nativeEvent)
        activeDescendantRef.current.dispatchEvent(activeDescendantEvent)
      }
    },
    [activeDescendantRef]
  )

  useFocusZone({
    containerRef,
    focusOutBehavior: 'wrap',
    focusableElementFilter: element => {
      if (element instanceof HTMLInputElement) {
        // No active-descendant focus on checkboxes in list items or filter input
        return false
      }
      return true
    },
    activeDescendantFocus: inputRef,
    onActiveDescendantChanged: (current, previous) => {
      activeDescendantRef.current = current

      if (previous) {
        previous.classList.remove(itemActiveDescendantClass)
      }

      if (current) {
        current.classList.add(itemActiveDescendantClass)

        if (scrollContainerRef.current) {
          scrollIntoViewingArea(current, scrollContainerRef.current)
        }
      }
    }
  })

  useEffect(() => {
    // if items changed, we want to instantly move active descendant into view
    if (activeDescendantRef.current && scrollContainerRef.current) {
      scrollIntoViewingArea(activeDescendantRef.current, scrollContainerRef.current, undefined, 'auto')
    }
  }, [items])

  return (
    <Flex ref={containerRef} flexDirection="column" overflow="hidden">
      <TextInput
        ref={inputRef}
        block
        width="auto"
        color="text.primary"
        onChange={onInputChange}
        onKeyPress={onInputKeyPress}
        placeholder={placeholderText}
        aria-label={placeholderText}
        aria-controls={listId}
        {...textInputProps}
      />
      <Box ref={scrollContainerRef} overflow="auto">
        {loading ? (
          <Box width="100%" display="flex" flexDirection="row" justifyContent="center" pt={6} pb={7}>
            <Spinner />
          </Box>
        ) : (
          <ActionList items={items} {...listProps} role="listbox" id={listId} />
        )}
      </Box>
    </Flex>
  )
}

FilteredActionList.displayName = 'FilteredActionList'
