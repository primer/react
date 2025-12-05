import type {ScrollIntoViewOptions} from '@primer/behaviors'
import {scrollIntoView, FocusKeys} from '@primer/behaviors'
import type {KeyboardEventHandler, JSX} from 'react'
import type React from 'react'
import {forwardRef, useCallback, useEffect, useRef, useState} from 'react'
import type {TextInputProps} from '../TextInput'
import TextInput from '../TextInput'
import {ActionList, type ActionListProps} from '../ActionList'
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

const menuScrollMargins: ScrollIntoViewOptions = {startMargin: 0, endMargin: 8}

export interface FilteredActionListProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  loading?: boolean
  loadingType?: FilteredActionListLoadingType
  placeholderText?: string
  filterValue?: string
  onFilterChange: (value: string, e: React.ChangeEvent<HTMLInputElement> | null) => void
  onListContainerRefChanged?: (ref: HTMLElement | null) => void
  onInputRefChanged?: (ref: React.RefObject<HTMLInputElement | null>) => void
  /**
   * A ref assigned to the scrollable container wrapping the ActionList
   */
  scrollContainerRef?: React.Ref<HTMLDivElement | null>
  textInputProps?: Partial<Omit<TextInputProps, 'onChange'>>
  inputRef?: React.RefObject<HTMLInputElement | null>
  message?: React.ReactNode
  messageText?: {
    title: string
    description: string
  }
  className?: string
  announcementsEnabled?: boolean
  fullScreenOnNarrow?: boolean
  onSelectAllChange?: (checked: boolean) => void
  /**
   * Additional props to pass to the underlying ActionList component.
   */
  actionListProps?: Partial<ActionListProps>
  /**
   * Determines how keyboard focus behaves when navigating beyond the first or last item in the list.
   *
   * - `'stop'`: Focus will stop at the first or last item; further navigation in that direction will not move focus.
   * - `'wrap'`: Focus will wrap around to the opposite end of the list when navigating past the boundaries (e.g., pressing Down on the last item moves focus to the first).
   *
   *  @default 'wrap'
   */
  focusOutBehavior?: 'stop' | 'wrap'
  /**
   * Private API for use internally only. Adds the ability to switch between
   * `active-descendant` and roving tabindex.
   *
   * By default, FilteredActionList uses `aria-activedescendant` to manage focus.
   *
   * Roving tabindex is an alternative focus management method that moves
   * focus to the list items themselves instead of keeping focus on the input.
   *
   * Improper usage can lead to inaccessible experiences, so this prop should be used with caution.
   *
   * For usage, refer to the documentation:
   *
   * WAI-ARIA `aria-activedescendant`: https://www.w3.org/TR/wai-aria-1.2/#aria-activedescendant
   *
   * Roving Tabindex: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
   *
   * @default 'active-descendant'
   */
  _PrivateFocusManagement?: 'roving-tabindex' | 'active-descendant'
  /**
   * If true, disables selecting items when hovering over them with the mouse.
   */
  disableSelectOnHover?: boolean
  /**
   * If true, does not set `aria-activedescendant` value until user action.
   */
  setInitialFocus?: boolean
}

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
  scrollContainerRef: providedScrollContainerRef,
  groupMetadata,
  showItemDividers,
  message,
  messageText,
  className,
  selectionVariant,
  announcementsEnabled = true,
  fullScreenOnNarrow,
  onSelectAllChange,
  actionListProps,
  focusOutBehavior = 'wrap',
  _PrivateFocusManagement = 'active-descendant',
  disableSelectOnHover = false,
  setInitialFocus = false,
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

  const scrollContainerRef = useProvidedRefOrCreate<HTMLDivElement>(
    providedScrollContainerRef as React.RefObject<HTMLDivElement>,
  )
  const inputRef = useProvidedRefOrCreate<HTMLInputElement>(providedInputRef)

  const usingRovingTabindex = _PrivateFocusManagement === 'roving-tabindex'
  const [listContainerElement, setListContainerElement] = useState<HTMLUListElement | null>(null)
  const activeDescendantRef = useRef<HTMLElement>()

  const listId = useId(actionListProps?.id)
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
    !usingRovingTabindex
      ? {
          containerRef: {current: listContainerElement},
          bindKeys: FocusKeys.ArrowVertical | FocusKeys.PageUpDown,
          focusOutBehavior,
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
          focusInStrategy: setInitialFocus ? 'initial' : 'previous',
          ignoreHoverEvents: disableSelectOnHover ? true : false,
        }
      : undefined,
    [listContainerElement, usingRovingTabindex],
  )

  useEffect(() => {
    if (activeDescendantRef.current && scrollContainerRef.current) {
      scrollIntoView(activeDescendantRef.current, scrollContainerRef.current, {
        ...menuScrollMargins,
        behavior: 'auto',
      })
    }
  }, [items, inputRef, scrollContainerRef])

  useEffect(() => {
    if (usingRovingTabindex) {
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
  }, [items, inputRef, listContainerElement, usingRovingTabindex]) // Re-run when items change to update active indicators

  useEffect(() => {
    if (usingRovingTabindex && !loading) {
      setIsInputFocused(inputRef.current && inputRef.current === document.activeElement ? true : false)
    }
  }, [loading, inputRef, usingRovingTabindex])

  useAnnouncements(
    items,
    usingRovingTabindex ? listRef : {current: listContainerElement},
    inputRef,
    announcementsEnabled,
    loading,
    messageText,
    _PrivateFocusManagement,
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
        ref={usingRovingTabindex ? listRef : listContainerRefCallback}
        showDividers={showItemDividers}
        selectionVariant={selectionVariant}
        {...listProps}
        {...actionListProps}
        role="listbox"
        id={listId}
        className={clsx(classes.ActionList, actionListProps?.className)}
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
                        data-select-on-hover={disableSelectOnHover ? 'true' : 'false'}
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
                  data-select-on-hover={disableSelectOnHover ? 'true' : 'false'}
                  {...item}
                  renderItem={listProps.renderItem}
                />
              )
            })}
      </ActionList>
    )

    // Use ActionListContainerContext.Provider only for the old behavior (when feature flag is disabled)
    if (usingRovingTabindex) {
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

  const {className: textInputClassName, ...restTextInputProps} = textInputProps || {}

  return (
    <div ref={inputAndListContainerRef} className={clsx(className, classes.Root)} data-testid="filtered-action-list">
      <div className={classes.Header}>
        <TextInput
          // @ts-expect-error it needs a non nullable ref
          ref={inputRef}
          block
          width="auto"
          color="fg.default"
          value={filterValue}
          onChange={onInputChange}
          onKeyPress={onInputKeyPress}
          onKeyDown={usingRovingTabindex ? onInputKeyDown : () => {}}
          placeholder={placeholderText}
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-label={placeholderText}
          aria-describedby={inputDescriptionTextId}
          loaderPosition={'leading'}
          loading={loading && !loadingType.appearsInBody}
          className={clsx(textInputClassName, {[classes.FullScreenTextInput]: fullScreenOnNarrow})}
          {...restTextInputProps}
        />
      </div>
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
      {/* @ts-expect-error div needs a non nullable ref */}
      <div ref={scrollContainerRef} className={classes.Container}>
        {getBodyContent()}
      </div>
    </div>
  )
}
const MappedActionListItem = forwardRef<HTMLLIElement, ItemInput & {renderItem?: RenderItemFn}>((item, ref) => {
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
      ref={ref}
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
})

FilteredActionList.displayName = 'FilteredActionList'
