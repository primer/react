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
        current.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'})
      }
    }
  })

  useEffect(() => {
    // if items changed, we want to instantly move active descendant into view
    activeDescendantRef.current?.scrollIntoView({block: 'center', inline: 'center'})
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
      <Box overflow="auto">
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
