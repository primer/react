import React, {useCallback, useEffect, useRef, useState} from 'react'
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
import {ActionListContainerContext} from '../ActionList/ActionListContainerContext'

import {isValidElementType} from 'react-is'
import type {RenderItemFn} from '../deprecated/ActionList/List'
import {useAnnouncements} from './useAnnouncements'

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
  className?: string
  announcementsEnabled?: boolean
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
  className,
  selectionVariant,
  announcementsEnabled = true,
  ...listProps
}: FilteredActionListProps): JSX.Element {
  const [filterValue, setInternalFilterValue] = useProvidedStateOrCreate(externalFilterValue, undefined, '')
  const [enableAnnouncements, setEnableAnnouncements] = useState(false)
  const [selectedItems, setSelectedItems] = useState<(string | number | undefined)[]>([])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      onFilterChange(value, e)
      setInternalFilterValue(value)
    },
    [onFilterChange, setInternalFilterValue],
  )

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useProvidedRefOrCreate<HTMLInputElement>(providedInputRef)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()
  const inputDescriptionTextId = useId()

  const keydownListener = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      if (listRef.current) {
        const firstSelectedItem = listRef.current.querySelector('[role="option"]') as HTMLElement | undefined
        firstSelectedItem?.focus()

        event.preventDefault()
      }
    }
  }, [])

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

  useEffect(() => {
    const selectedItemIds = items.filter(item => item.selected).map(item => item.id)
    setSelectedItems(selectedItemIds)
  }, [items])

  useEffect(() => {
    setEnableAnnouncements(announcementsEnabled)
  }, [announcementsEnabled])

  useScrollFlash(scrollContainerRef)

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

  useAnnouncements(items, listRef, inputRef, enableAnnouncements)

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
          onKeyDown={keydownListener}
          placeholder={placeholderText}
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-label={placeholderText}
          aria-describedby={inputDescriptionTextId}
          loaderPosition={'leading'}
          loading={loading && !loadingType.appearsInBody}
          {...textInputProps}
        />
      </StyledHeader>
      <VisuallyHidden id={inputDescriptionTextId}>Items will be filtered as you type</VisuallyHidden>
      <Box ref={scrollContainerRef} overflow="auto" display="flex" flexGrow={1}>
        {loading && scrollContainerRef.current && loadingType.appearsInBody ? (
          <FilteredActionListBodyLoader loadingType={loadingType} height={scrollContainerRef.current.clientHeight} />
        ) : (
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
                        {getItemListForEachGroup(group.groupId).map((item, index) => {
                          const key = item.key ?? item.id?.toString() ?? index.toString()
                          return <MappedActionListItem key={key} {...item} renderItem={listProps.renderItem} />
                        })}
                      </ActionList.Group>
                    )
                  })
                : items.map((item, index) => {
                    const key = item.key ?? item.id?.toString() ?? index.toString()
                    return <MappedActionListItem key={key} {...item} renderItem={listProps.renderItem} />
                  })}
            </ActionList>
          </ActionListContainerContext.Provider>
        )}
      </Box>
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
