import type {ScrollIntoViewOptions} from '@primer/behaviors'
import {scrollIntoView} from '@primer/behaviors'
import type {KeyboardEventHandler, RefObject} from 'react'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import Box from '../Box'
import type {TextInputProps} from '../TextInput'
import TextInput from '../TextInput'
import {get} from '../constants'
import {ActionList} from '../deprecated/ActionList'
import type {GroupedListProps, ListPropsBase} from '../SelectPanel/types'
import {useFocusZone} from '../hooks/useFocusZone'
import {useId} from '../hooks/useId'
import {useProvidedRefOrCreate} from '../hooks/useProvidedRefOrCreate'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import useScrollFlash from '../hooks/useScrollFlash'
import {VisuallyHidden} from '../VisuallyHidden'
import type {SxProp} from '../sx'
import {
  type FilteredActionListLoadingType,
  FilteredActionListBodyLoader,
  FilteredActionListLoadingTypes,
} from './FilteredActionListLoaders'

const menuScrollMargins: ScrollIntoViewOptions = {startMargin: 0, endMargin: 8}

export interface FilteredActionListProps
  extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>,
    ListPropsBase,
    SxProp {
  loading?: boolean
  loadingType?: FilteredActionListLoadingType
  placeholderText?: string
  filterValue?: string
  onFilterChange: (value: string, e: React.ChangeEvent<HTMLInputElement> | null) => void
  onListContainerRefChanged?: (ref: HTMLElement | null) => void
  onInputRefChanged?: (ref: React.RefObject<HTMLInputElement>) => void
  textInputProps?: Partial<Omit<TextInputProps, 'onChange'>>
  inputRef?: React.RefObject<HTMLInputElement>
  className?: string
  announcementsEnabled?: boolean
}

const StyledHeader = styled.div`
  box-shadow: 0 1px 0 ${get('colors.border.default')};
  z-index: 1;
`

export function FilteredActionList({
  loading = false,
  loadingType = FilteredActionListLoadingTypes.bodySpinner,
  placeholderText,
  filterValue: externalFilterValue,
  onFilterChange,
  onListContainerRefChanged,
  onInputRefChanged,
  items,
  textInputProps,
  inputRef: providedInputRef,
  sx,
  className,
  announcementsEnabled: _announcementsEnabled = true,
  ...listProps
}: FilteredActionListProps): JSX.Element {
  const [filterValue, setInternalFilterValue] = useProvidedStateOrCreate(externalFilterValue, undefined, '')
  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      onFilterChange(value, e)
      setInternalFilterValue(value)
    },
    [onFilterChange, setInternalFilterValue],
  )

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [listContainerElement, setListContainerElement] = useState<HTMLDivElement | null>(null)
  const inputRef = useProvidedRefOrCreate<HTMLInputElement>(providedInputRef)
  const activeDescendantRef = useRef<HTMLElement>()
  const listId = useId()
  const inputDescriptionTextId = useId()
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
    [activeDescendantRef],
  )

  const listContainerRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      setListContainerElement(node)
      onListContainerRefChanged?.(node)
    },
    [onListContainerRefChanged],
  )

  useEffect(() => {
    onInputRefChanged?.(inputRef)
  }, [inputRef, onInputRefChanged])

  useFocusZone(
    {
      containerRef: {current: listContainerElement},
      focusOutBehavior: 'wrap',
      focusableElementFilter: element => {
        return !(element instanceof HTMLInputElement)
      },
      activeDescendantFocus: inputRef,
      onActiveDescendantChanged: (current, previous, directlyActivated) => {
        activeDescendantRef.current = current

        if (current && scrollContainerRef.current && directlyActivated) {
          scrollIntoView(current, scrollContainerRef.current, menuScrollMargins)
        }
      },
    },
    [
      // List container isn't in the DOM while loading.  Need to re-bind focus zone when it changes.
      listContainerElement,
    ],
  )

  useEffect(() => {
    // if items changed, we want to instantly move active descendant into view
    if (activeDescendantRef.current && scrollContainerRef.current) {
      scrollIntoView(activeDescendantRef.current, scrollContainerRef.current, {
        ...menuScrollMargins,
        behavior: 'auto',
      })
    }
  }, [items])

  useScrollFlash(scrollContainerRef)

  return (
    <Box
      display="flex"
      flexDirection="column"
      overflow="hidden"
      flexGrow={1}
      sx={sx}
      className={className}
      data-testid="filtered-action-list"
    >
      <StyledHeader>
        <TextInput
          ref={inputRef}
          block
          width="auto"
          color="fg.default"
          value={filterValue}
          onChange={onInputChange}
          onKeyPress={onInputKeyPress}
          placeholder={placeholderText}
          aria-label={placeholderText}
          aria-controls={listId}
          aria-describedby={inputDescriptionTextId}
          loaderPosition={'leading'}
          loading={loading && !loadingType.appearsInBody}
          {...textInputProps}
        />
      </StyledHeader>
      <VisuallyHidden id={inputDescriptionTextId}>Items will be filtered as you type</VisuallyHidden>
      <Box ref={scrollContainerRef} overflow="auto" flexGrow={1}>
        {loading && scrollContainerRef.current && loadingType.appearsInBody ? (
          <FilteredActionListBodyLoader loadingType={loadingType} height={scrollContainerRef.current.clientHeight} />
        ) : (
          <ActionList ref={listContainerRefCallback} items={items} {...listProps} role="listbox" id={listId} />
        )}
      </Box>
    </Box>
  )
}

FilteredActionList.displayName = 'FilteredActionList'
