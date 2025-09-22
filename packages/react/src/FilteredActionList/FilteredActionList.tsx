import type {ScrollIntoViewOptions} from '@primer/behaviors'
import {scrollIntoView, FocusKeys} from '@primer/behaviors'
import type {KeyboardEventHandler} from 'react'
import type React from 'react'
import {useCallback, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import type {TextInputProps} from '../TextInput'
import TextInput from '../TextInput'
import {get} from '../constants'
import {ActionList} from '../ActionList'
import type {GroupedListProps, ListPropsBase, ItemInput, RenderItemFn} from './'
import {useFocusZone} from '../hooks/useFocusZone'
import {useId} from '../hooks/useId'
import {useProvidedRefOrCreate} from '../hooks/useProvidedRefOrCreate'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import useScrollFlash from '../hooks/useScrollFlash'
import {VisuallyHidden} from '../VisuallyHidden'
import type {FilteredActionListLoadingType} from './FilteredActionListLoaders'
import {FilteredActionListLoadingTypes, FilteredActionListBodyLoader} from './FilteredActionListLoaders'
import classes from './FilteredActionList.module.css'
import Checkbox from '../Checkbox'

import {ActionListContainerContext} from '../ActionList/ActionListContainerContext'
import {isValidElementType} from 'react-is'
import {useAnnouncements} from './useAnnouncements'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'

const menuScrollMargins: ScrollIntoViewOptions = {startMargin: 0, endMargin: 8}

export interface FilteredActionListProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  loading?: boolean
  loadingType?: FilteredActionListLoadingType
  placeholderText?: string
  filterValue?: string
  onFilterChange: (value: string, e: React.ChangeEvent<HTMLInputElement> | null) => void
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

  const inputAndListContainerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useProvidedRefOrCreate<HTMLInputElement>(providedInputRef)

  const usingRemoveActiveDescendant = useFeatureFlag('primer_react_select_panel_remove_active_descendant')
  const [listContainerElement, setListContainerElement] = useState<HTMLUListElement | null>(null)
  const activeDescendantRef = useRef<HTMLElement>()

  const listId = useId()
  const inputDescriptionTextId = useId()
  const [isInputFocused, setIsInputFocused] = useState(false)

  const selectAllChecked = items.length > 0 && items.every(item => item.selected)
  const selectAllIndeterminate = !selectAllChecked && items.some(item => item.selected)

  const selectAllLabelText = selectAllChecked ? 'Deselect all' : 'Select all'

  const getItemListForEachGroup = useCallback(
    (groupId: string) => {
      const itemsInGroup = []
      for (const item of items) {
        // Look up the group associated with the current item.
        if (item.groupId === groupId) {
          itemsInGroup.push(item)
        }
      }
      return itemsInGroup
    },
    [items],
  )

  const onInputKeyDown = useCallback(
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
          let firstGroupIndex = 0

          for (let i = 0; i < groupMetadata.length; i++) {
            if (getItemListForEachGroup(groupMetadata[i].groupId).length > 0) {
              break
            } else {
              firstGroupIndex++
            }
          }

          const firstGroup = groupMetadata[firstGroupIndex].groupId
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
    [items, groupMetadata, getItemListForEachGroup],
  )

  const onInputKeyPress: KeyboardEventHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
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

  // BEGIN: Todo remove when we remove usingRemoveActiveDescendant
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
  //END: Todo remove when we remove usingRemoveActiveDescendant

  useFocusZone(
    !usingRemoveActiveDescendant
      ? {
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
        }
      : undefined,
    [listContainerElement, usingRemoveActiveDescendant],
  )

  useEffect(() => {
    if (activeDescendantRef.current && scrollContainerRef.current) {
      scrollIntoView(activeDescendantRef.current, scrollContainerRef.current, {
        ...menuScrollMargins,
        behavior: 'auto',
      })
    }
  }, [items, inputRef])

  useEffect(() => {
    if (usingRemoveActiveDescendant) {
      const inputAndListContainerElement = inputAndListContainerRef.current
      if (!inputAndListContainerElement) return
      const list = listRef.current
      if (!list) return

      // Listen for focus changes within the container
      const handleFocusIn = (event: FocusEvent) => {
        if (event.target === inputRef.current || list.contains(event.target as Node)) {
          setIsInputFocused(inputRef.current && inputRef.current === document.activeElement ? true : false)
        }
      }

      inputAndListContainerElement.addEventListener('focusin', handleFocusIn)

      return () => {
        inputAndListContainerElement.removeEventListener('focusin', handleFocusIn)
      }
    }
  }, [items, inputRef, listContainerElement, usingRemoveActiveDescendant]) // Re-run when items change to update active indicators

  useEffect(() => {
    if (usingRemoveActiveDescendant && !loading) {
      setIsInputFocused(inputRef.current && inputRef.current === document.activeElement ? true : false)
    }
  }, [loading, inputRef, usingRemoveActiveDescendant])

  useAnnouncements(
    items,
    usingRemoveActiveDescendant ? listRef : {current: listContainerElement},
    inputRef,
    announcementsEnabled,
    loading,
    messageText,
  )
  useScrollFlash(scrollContainerRef)

  const handleSelectAllChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onSelectAllChange) {
        onSelectAllChange(e.target.checked)
      }
    },
    [onSelectAllChange],
  )

  function getBodyContent() {
    if (loading && scrollContainerRef.current && loadingType.appearsInBody) {
      return <FilteredActionListBodyLoader loadingType={loadingType} height={scrollContainerRef.current.clientHeight} />
    }
    if (message) {
      return message
    }
    let firstGroupIndex = 0
    const actionListContent = (
      <ActionList
        ref={usingRemoveActiveDescendant ? listRef : listContainerRefCallback}
        showDividers={showItemDividers}
        selectionVariant={selectionVariant}
        {...listProps}
        role="listbox"
        id={listId}
        className={classes.ActionList}
      >
        {groupMetadata?.length
          ? groupMetadata.map((group, index) => {
              if (index === firstGroupIndex && getItemListForEachGroup(group.groupId).length === 0) {
                firstGroupIndex++ // Increment firstGroupIndex if the first group has no items
              }
              return (
                <ActionList.Group key={index}>
                  <ActionList.GroupHeading variant={group.header?.variant ? group.header.variant : undefined}>
                    {group.header?.title ? group.header.title : `Group ${group.groupId}`}
                  </ActionList.GroupHeading>
                  {getItemListForEachGroup(group.groupId).map(({key: itemKey, ...item}, itemIndex) => {
                    const key = itemKey ?? item.id?.toString() ?? itemIndex.toString()
                    return (
                      <MappedActionListItem
                        key={key}
                        className={clsx(classes.ActionListItem, 'className' in item ? item.className : undefined)}
                        data-input-focused={isInputFocused ? '' : undefined}
                        data-first-child={index === firstGroupIndex && itemIndex === 0 ? '' : undefined}
                        {...item}
                        renderItem={listProps.renderItem}
                      />
                    )
                  })}
                </ActionList.Group>
              )
            })
          : items.map(({key: itemKey, ...item}, index) => {
              const key = itemKey ?? item.id?.toString() ?? index.toString()
              return (
                <MappedActionListItem
                  key={key}
                  className={clsx(classes.ActionListItem, 'className' in item ? item.className : undefined)}
                  data-input-focused={isInputFocused ? '' : undefined}
                  data-first-child={index === 0 ? '' : undefined}
                  {...item}
                  renderItem={listProps.renderItem}
                />
              )
            })}
      </ActionList>
    )

    // Use ActionListContainerContext.Provider only for the old behavior (when feature flag is disabled)
    if (usingRemoveActiveDescendant) {
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
          {actionListContent}
        </ActionListContainerContext.Provider>
      )
    } else {
      return actionListContent
    }
  }

  return (
    <div ref={inputAndListContainerRef} className={clsx(className, classes.Root)} data-testid="filtered-action-list">
      <StyledHeader>
        <TextInput
          ref={inputRef}
          block
          width="auto"
          color="fg.default"
          value={filterValue}
          onChange={onInputChange}
          onKeyPress={onInputKeyPress}
          onKeyDown={usingRemoveActiveDescendant ? onInputKeyDown : () => {}}
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
    </div>
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
