import type {ScrollIntoViewOptions} from '@primer/behaviors'
import {scrollIntoView, FocusKeys} from '@primer/behaviors'
import type {KeyboardEventHandler} from 'react'
import type React from 'react'
import {useCallback, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import Box from '../Box'
import type {TextInputProps} from '../TextInput'
import TextInput from '../TextInput'
import {get} from '../constants'
import {ActionList} from '../ActionList'
import type {GroupedListProps, ListPropsBase, ItemInput} from '../SelectPanel/types'
import {useFocusZone} from '../hooks/useFocusZone'
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

import {isValidElementType} from 'react-is'
import type {RenderItemFn} from '../deprecated/ActionList/List'
import {useAnnouncements} from './useAnnouncements'
import {clsx} from 'clsx'

const menuScrollMargins: ScrollIntoViewOptions = {startMargin: 0, endMargin: 8}

export interface FilteredActionListProps
  extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>,
    ListPropsBase,
    SxProp {
  loading?: boolean
  loadingType?: FilteredActionListLoadingType
  placeholderText?: string
  filterValue?: string
  onFilterChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
  onListContainerRefChanged?: (ref: HTMLElement | null) => void
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
  onListContainerRefChanged,
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

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useProvidedRefOrCreate<HTMLInputElement>(providedInputRef)
  const [listContainerElement, setListContainerElement] = useState<HTMLUListElement | null>(null)
  const activeDescendantRef = useRef<HTMLElement>()
  const listId = useId()
  const inputDescriptionTextId = useId()

  const selectAllChecked = items.length > 0 && items.every(item => item.selected)
  const selectAllIndeterminate = !selectAllChecked && items.some(item => item.selected)

  const selectAllLabelText = selectAllChecked ? 'Deselect all' : 'Select all'
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
    (node: HTMLUListElement | null) => {
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
      bindKeys: FocusKeys.ArrowVertical | FocusKeys.PageUpDown,
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

  useAnnouncements(items, {current: listContainerElement}, inputRef, announcementsEnabled, loading, messageText)
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
      <ActionList
        ref={listContainerRefCallback}
        showDividers={showItemDividers}
        {...listProps}
        role="listbox"
        id={listId}
        sx={{flexGrow: 1}}
      >
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
    )
  }

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
          onKeyPress={onInputKeyPress}
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
