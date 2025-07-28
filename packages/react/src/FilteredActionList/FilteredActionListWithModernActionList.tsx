import React, {useCallback, useEffect, useRef, useState, type KeyboardEventHandler} from 'react'
import styled from 'styled-components'
import Box from '../Box'
import type {TextInputProps} from '../TextInput'
import TextInput from '../TextInput'
import {get} from '../constants'
import {ActionList} from '../ActionList'
import type {GroupedListProps, ListPropsBase, ItemInput} from '../SelectPanel/types'
import {useId} from '../hooks/useId'
import {useProvidedRefOrCreate} from '../hooks/useProvidedRefOrCreate'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import useScrollFlash from '../hooks/useScrollFlash'
import {VisuallyHidden} from '../VisuallyHidden'
import type {SxProp} from '../sx'
import type {FilteredActionListLoadingType} from './FilteredActionListLoaders'
import {FilteredActionListLoadingTypes, FilteredActionListBodyLoader} from './FilteredActionListLoaders'
import classes from './FilteredActionList.module.css'
import Checkbox from '../Checkbox'

import {ActionListContainerContext} from '../ActionList/ActionListContainerContext'
import {isValidElementType} from 'react-is'
import type {RenderItemFn} from '../deprecated/ActionList/List'
import {useAnnouncements} from './useAnnouncements'
import {clsx} from 'clsx'

export interface FilteredActionListProps
  extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>,
    ListPropsBase,
    SxProp {
  loading?: boolean
  loadingType?: FilteredActionListLoadingType
  placeholderText?: string
  filterValue?: string
  onFilterChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
  onInputRefChanged?: (ref: React.RefObject<HTMLInputElement>) => void
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
}

const StyledHeader = styled.div`
  box-shadow: 0 1px 0 ${get('colors.border.default')};
  z-index: 1;
`

export function FilteredActionList({
  loading = false,
  placeholderText,
  filterValue: externalFilterValue,
  loadingType = FilteredActionListLoadingTypes.bodySpinner,
  onFilterChange,
  onInputRefChanged,
  items,
  textInputProps,
  inputRef: providedInputRef,
  sx,
  groupMetadata,
  showItemDividers,
  message,
  messageText,
  className,
  selectionVariant,
  announcementsEnabled = true,
  fullScreenOnNarrow,
  onSelectAllChange,
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

  const [enableAnnouncements, setEnableAnnouncements] = useState(false)
  const [selectedItems] = useState<(string | number | undefined)[]>([])

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useProvidedRefOrCreate<HTMLInputElement>(providedInputRef)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()
  const inputDescriptionTextId = useId()

  const selectAllChecked = items.length > 0 && items.every(item => item.selected)
  const selectAllIndeterminate = !selectAllChecked && items.some(item => item.selected)

  const selectAllLabelText = selectAllChecked ? 'Deselect all' : 'Select all'
  const onInputKeyPress: KeyboardEventHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        if (listRef.current) {
          const firstSelectedItem = listRef.current.querySelector('[role="option"]') as HTMLElement | undefined
          firstSelectedItem?.focus()

          event.preventDefault()
        }
      } else if (event.key === 'Enter') {
        let firstItem
        // If there are groups, it's not guaranteed that the first item is the actual first item in the first -
        // as groups are rendered in the order of the groupId provided
        if (groupMetadata) {
          const firstGroup = groupMetadata[0].groupId
          firstItem = items.filter(item => item.groupId === firstGroup)[0]
        } else {
          firstItem = items[0]
        }

        if (firstItem.onAction) {
          firstItem.onAction(firstItem, event)
          event.preventDefault()
        }
      }
    },
    [items, groupMetadata],
  )

  useEffect(() => {
    onInputRefChanged?.(inputRef)
  }, [inputRef, onInputRefChanged])

  useEffect(() => {
    if (items.length === 0) {
      inputRef.current?.focus()
    } else {
      const itemIds = items.filter(item => item.selected).map(item => item.id)
      const removedItem = selectedItems.find(item => !itemIds.includes(item))
      if (removedItem && document.activeElement !== inputRef.current) {
        const list = listRef.current
        if (list) {
          const firstSelectedItem = list.querySelector('[role="option"]') as HTMLElement
          firstSelectedItem.focus()
        }
      }
    }
  }, [items, inputRef, selectedItems])

  // Add data-input-focused attribute to first list item when input is focused
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const updateInputFocusedAttribute = () => {
      const isInputFocused = inputRef.current && document.activeElement === inputRef.current
      const firstItem = list.querySelector('[role="option"]')
      
      if (firstItem) {
        if (isInputFocused) {
          firstItem.setAttribute('data-input-focused', 'true')
        } else {
          firstItem.removeAttribute('data-input-focused')
        }
      }
    }

    // Initial update
    updateInputFocusedAttribute()

    // Listen for focus changes
    const handleFocusIn = (event: FocusEvent) => {
      if (event.target === inputRef.current || list.contains(event.target as Node)) {
        updateInputFocusedAttribute()
      }
    }

    document.addEventListener('focusin', handleFocusIn)

    return () => {
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [items, inputRef]) // Re-run when items change to update attributes

  useEffect(() => {
    setEnableAnnouncements(announcementsEnabled)
  }, [announcementsEnabled])
  useScrollFlash(scrollContainerRef)

  const handleSelectAllChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onSelectAllChange) {
        onSelectAllChange(e.target.checked)
      }
    },
    [onSelectAllChange],
  )

  function getItemListForEachGroup(groupId: string) {
    const itemsInGroup = []
    for (const item of items) {
      // Look up the group associated with the current item.
      if (item.groupId === groupId) {
        itemsInGroup.push(item)
      }
    }
    return itemsInGroup
  }

  function getBodyContent() {
    if (loading && scrollContainerRef.current && loadingType.appearsInBody) {
      return <FilteredActionListBodyLoader loadingType={loadingType} height={scrollContainerRef.current.clientHeight} />
    }
    if (message) {
      return message
    }

    return (
      <ActionListContainerContext.Provider
        value={{
          container: 'FilteredActionList',
          listRole: 'listbox',
          selectionAttribute: 'aria-selected',
          selectionVariant,
          enableFocusZone: true,
        }}
      >
        <ActionList ref={listRef} showDividers={showItemDividers} {...listProps} id={listId} sx={{flexGrow: 1}}>
          {groupMetadata?.length
            ? groupMetadata.map((group, index) => {
                return (
                  <ActionList.Group key={index}>
                    <ActionList.GroupHeading variant={group.header?.variant ? group.header.variant : undefined}>
                      {group.header?.title ? group.header.title : `Group ${group.groupId}`}
                    </ActionList.GroupHeading>
                    {getItemListForEachGroup(group.groupId).map(({key: itemKey, ...item}, index) => {
                      const key = itemKey ?? item.id?.toString() ?? index.toString()
                      return <MappedActionListItem key={key} {...item} renderItem={listProps.renderItem} />
                    })}
                  </ActionList.Group>
                )
              })
            : items.map(({key: itemKey, ...item}, index) => {
                const key = itemKey ?? item.id?.toString() ?? index.toString()
                return <MappedActionListItem key={key} {...item} renderItem={listProps.renderItem} />
              })}
        </ActionList>
      </ActionListContainerContext.Provider>
    )
  }
  useAnnouncements(items, listRef, inputRef, enableAnnouncements, messageText)
  return (
    <Box
      display="flex"
      flexDirection="column"
      overflow="hidden"
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
          onKeyDown={onInputKeyPress}
          placeholder={placeholderText}
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-label={placeholderText}
          aria-describedby={inputDescriptionTextId}
          loaderPosition={'leading'}
          loading={loading && !loadingType.appearsInBody}
          className={clsx(textInputProps?.className, fullScreenOnNarrow && classes.FullScreenTextInput)}
          {...textInputProps}
        />
      </StyledHeader>
      <VisuallyHidden id={inputDescriptionTextId}>Items will be filtered as you type</VisuallyHidden>
      {onSelectAllChange !== undefined && (
        <div className={classes.SelectAllContainer}>
          <Checkbox
            id="select-all-checkbox"
            className={classes.SelectAllCheckbox}
            checked={selectAllChecked}
            indeterminate={selectAllIndeterminate}
            onChange={handleSelectAllChange}
          />
          <label className={classes.SelectAllLabel} htmlFor="select-all-checkbox">
            {selectAllLabelText}
          </label>
        </div>
      )}
      <div ref={scrollContainerRef} className={classes.Container}>
        {getBodyContent()}
      </div>
    </Box>
  )
}

function MappedActionListItem(item: ItemInput & {renderItem?: RenderItemFn}) {
  // keep backward compatibility for renderItem
  // escape hatch for custom Item rendering
  if (typeof item.renderItem === 'function') return item.renderItem(item)

  const {
    id,
    description,
    descriptionVariant,
    text,
    trailingVisual: TrailingVisual,
    leadingVisual: LeadingVisual,
    trailingText,
    trailingIcon: TrailingIcon,
    onAction,
    children,
    ...rest
  } = item

  return (
    <ActionList.Item
      role="option"
      // @ts-ignore - for now
      onSelect={(e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        if (typeof onAction === 'function')
          onAction(item, e as React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>)
      }}
      data-id={id}
      {...rest}
    >
      {LeadingVisual ? (
        <ActionList.LeadingVisual>
          <LeadingVisual />
        </ActionList.LeadingVisual>
      ) : null}
      {children}
      {text}
      {description ? <ActionList.Description variant={descriptionVariant}>{description}</ActionList.Description> : null}
      {TrailingVisual ? (
        <ActionList.TrailingVisual>
          {typeof TrailingVisual !== 'string' && isValidElementType(TrailingVisual) ? (
            <TrailingVisual />
          ) : (
            TrailingVisual
          )}
        </ActionList.TrailingVisual>
      ) : TrailingIcon || trailingText ? (
        <ActionList.TrailingVisual>
          {trailingText}
          {TrailingIcon && <TrailingIcon />}
        </ActionList.TrailingVisual>
      ) : null}
    </ActionList.Item>
  )
}

FilteredActionList.displayName = 'FilteredActionList'
