import {SearchIcon, TriangleDownIcon} from '@primer/octicons-react'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {AnchoredOverlayProps} from '../AnchoredOverlay'
import {AnchoredOverlay} from '../AnchoredOverlay'
import type {AnchoredOverlayWrapperAnchorProps} from '../AnchoredOverlay/AnchoredOverlay'
import Box from '../Box'
import type {FilteredActionListProps} from '../FilteredActionList'
import {FilteredActionList} from '../FilteredActionList'
import Heading from '../Heading'
import type {OverlayProps} from '../Overlay'
import type {TextInputProps} from '../TextInput'
import type {ItemProps, ItemInput} from './types'

import {Button} from '../Button'
import {useProvidedRefOrCreate} from '../hooks'
import type {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {useId} from '../hooks/useId'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import {LiveRegion, LiveRegionOutlet, Message} from '../internal/components/LiveRegion'
import useSafeTimeout from '../hooks/useSafeTimeout'
import type {FilteredActionListLoadingType} from '../FilteredActionList/FilteredActionListLoaders'
import {FilteredActionListLoadingTypes} from '../FilteredActionList/FilteredActionListLoaders'
import {useFeatureFlag} from '../FeatureFlags'
import {announce} from '@primer/live-region-element'

import classes from './SelectPanel.module.css'
import {clsx} from 'clsx'

// we add a delay so that it does not interrupt default screen reader announcement and queues after it
const delayMs = 500
const loadingDelayMs = 1000

const getItemWithActiveDescendant = (
  listRef: React.RefObject<HTMLElement>,
  items: FilteredActionListProps['items'],
) => {
  const listElement = listRef.current
  const activeItemElement = listElement?.querySelector('[data-is-active-descendant]')

  if (!listElement || !activeItemElement?.textContent) return

  const optionElements = listElement.querySelectorAll('[role="option"]')

  const index = Array.from(optionElements).indexOf(activeItemElement)
  const activeItem = items[index] as ItemInput | undefined

  const text = activeItem?.text
  const selected = activeItem?.selected

  return {index, text, selected}
}

async function announceText(text: string) {
  const liveRegion = document.querySelector('live-region')

  liveRegion?.clear() // clear previous announcements

  await announce(text, {
    delayMs,
    from: liveRegion ? liveRegion : undefined, // announce will create a liveRegion if it doesn't find one
  })
}

async function announceFilterFocused() {
  await announceText('Focus on filter text box and list of items')
}

async function announceNoItems() {
  await announceText('No matching items.')
}

async function announceLoading() {
  await announceText('Loading.')
}

async function announceItemsChanged(
  items: FilteredActionListProps['items'],
  listContainerRef: React.RefObject<HTMLElement>,
) {
  const liveRegion = document.querySelector('live-region')

  liveRegion?.clear() // clear previous announcements

  // give @primer/behaviors a moment to update active-descendant
  await new Promise(resolve => window.requestAnimationFrame(resolve))

  const activeItem = getItemWithActiveDescendant(listContainerRef, items)
  if (!activeItem) return
  const {index, text, selected} = activeItem

  const announcementText = [
    'List updated',
    `Focused item: ${text}`,
    `${selected ? 'selected' : 'not selected'}`,
    `${index + 1} of ${items.length}`,
  ].join(', ')

  await announce(announcementText, {
    delayMs,
    from: liveRegion ? liveRegion : undefined, // announce will create a liveRegion if it doesn't find one
  })
}

interface SelectPanelSingleSelection {
  selected: ItemInput | undefined
  onSelectedChange: (selected: ItemInput | undefined) => void
}

interface SelectPanelMultiSelection {
  selected: ItemInput[]
  onSelectedChange: (selected: ItemInput[]) => void
}

export type InitialLoadingType = 'spinner' | 'skeleton'

interface SelectPanelBaseProps {
  // TODO: Make `title` required in the next major version
  title?: string | React.ReactElement
  subtitle?: string | React.ReactElement
  onOpenChange: (
    open: boolean,
    gesture: 'anchor-click' | 'anchor-key-press' | 'click-outside' | 'escape' | 'selection',
  ) => void
  placeholder?: string
  // TODO: Make `inputLabel` required in next major version
  inputLabel?: string
  overlayProps?: Partial<OverlayProps>
  footer?: string | React.ReactElement
  initialLoadingType?: InitialLoadingType
  className?: string
}

export type SelectPanelProps = SelectPanelBaseProps &
  Omit<FilteredActionListProps, 'selectionVariant'> &
  Pick<AnchoredOverlayProps, 'open' | 'height' | 'width'> &
  AnchoredOverlayWrapperAnchorProps &
  (SelectPanelSingleSelection | SelectPanelMultiSelection)

function isMultiSelectVariant(
  selected: SelectPanelSingleSelection['selected'] | SelectPanelMultiSelection['selected'],
): selected is SelectPanelMultiSelection['selected'] {
  return Array.isArray(selected)
}

const focusZoneSettings: Partial<FocusZoneHookSettings> = {
  // Let FilteredActionList handle focus zone
  disabled: true,
}

const areItemsEqual = (itemA: ItemInput, itemB: ItemInput) => {
  // prefer checking equivality by item.id
  if (typeof itemA.id !== 'undefined') return itemA.id === itemB.id
  else return itemA === itemB
}

const doesItemsIncludeItem = (items: ItemInput[], item: ItemInput) => {
  return items.some(i => areItemsEqual(i, item))
}

export function SelectPanel({
  open,
  onOpenChange,
  renderAnchor = props => {
    const {children, ...rest} = props
    return (
      <Button trailingAction={TriangleDownIcon} {...rest}>
        {children}
      </Button>
    )
  },
  anchorRef: externalAnchorRef,
  placeholder,
  placeholderText = 'Filter items',
  inputLabel = placeholderText,
  selected,
  title = isMultiSelectVariant(selected) ? 'Select items' : 'Select an item',
  subtitle,
  onSelectedChange,
  filterValue: externalFilterValue,
  onFilterChange: externalOnFilterChange,
  items,
  footer,
  textInputProps,
  overlayProps,
  sx,
  loading,
  initialLoadingType = 'spinner',
  className,
  height,
  width,
  id,
  ...listProps
}: SelectPanelProps): JSX.Element {
  const titleId = useId()
  const subtitleId = useId()
  const [dataLoadedOnce, setDataLoadedOnce] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filterValue, setInternalFilterValue] = useProvidedStateOrCreate(externalFilterValue, undefined, '')
  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()
  const loadingDelayTimeoutId = useRef<number | null>(null)
  const loadingManagedInternally = loading === undefined
  const loadingManagedExternally = !loadingManagedInternally
  const [inputRef, setInputRef] = React.useState<React.RefObject<HTMLInputElement> | null>(null)
  const [listContainerElement, setListContainerElement] = useState<HTMLElement | null>(null)
  const [needItemsChangedAnnouncement, setNeedItemsChangedAnnouncement] = useState<boolean>(false)

  const onListContainerRefChanged: FilteredActionListProps['onListContainerRefChanged'] = useCallback(
    (node: HTMLElement | null) => {
      setListContainerElement(node)

      if (needItemsChangedAnnouncement) {
        announceItemsChanged(items, {current: node})
        setNeedItemsChangedAnnouncement(false)
      }
    },
    [items, needItemsChangedAnnouncement],
  )

  const onInputRefChanged = useCallback(
    (ref: React.RefObject<HTMLInputElement>) => {
      setInputRef(ref)
    },
    [setInputRef],
  )

  const onFilterChange: FilteredActionListProps['onFilterChange'] = useCallback(
    (value, e) => {
      if (loadingManagedInternally) {
        if (loadingDelayTimeoutId.current) {
          safeClearTimeout(loadingDelayTimeoutId.current)
        }

        if (dataLoadedOnce) {
          // If data has already been loaded once, delay the spinner a bit. This also helps
          // not show and then immediately hide the spinner if items are loaded quickly, i.e.
          // not async.

          loadingDelayTimeoutId.current = safeSetTimeout(() => {
            setIsLoading(true)
            announceLoading()
          }, loadingDelayMs)
        } else {
          // If this is the first data load and there are no items, show the loading spinner
          // immediately

          if (items.length === 0) {
            setIsLoading(true)
          }

          // We still want to announce if loading is taking too long
          loadingDelayTimeoutId.current = safeSetTimeout(() => {
            announceLoading()
          }, loadingDelayMs)
        }
      }

      externalOnFilterChange(value, e)
      setInternalFilterValue(value)
    },
    [
      loadingManagedInternally,
      externalOnFilterChange,
      setInternalFilterValue,
      dataLoadedOnce,
      safeSetTimeout,
      safeClearTimeout,
      items.length,
    ],
  )

  useEffect(() => {
    if (open) {
      if (items.length === 0) {
        announceNoItems()
      } else {
        if (listContainerElement) {
          announceItemsChanged(items, {current: listContainerElement})
        } else {
          setNeedItemsChangedAnnouncement(true)
        }
      }
    }

    if (loadingManagedExternally) {
      if (items.length > 0) {
        setDataLoadedOnce(true)
      }

      return
    }

    if (isLoading) {
      setIsLoading(false)
      setDataLoadedOnce(true)
    }

    if (loadingDelayTimeoutId.current) {
      safeClearTimeout(loadingDelayTimeoutId.current)
    }

    // Only fire this effect if items have changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  useEffect(() => {
    if (inputRef?.current) {
      const ref = inputRef.current
      const listener = () => {
        announceFilterFocused()
      }

      if (document.activeElement === ref) {
        listener()
      }

      ref.addEventListener('focus', listener)

      // We would normally expect AnchoredOverlay's focus trap to automatically focus the input,
      // but for some reason the ref isn't populated until _after_ the panel is open, which is
      // too late. So, we focus manually here.
      if (open) {
        ref.focus()
      }

      return () => ref.removeEventListener('focus', listener)
    }
  }, [inputRef, open])

  // Populate panel with items on first open
  useEffect(() => {
    if (loadingManagedExternally) return

    // If data was already loaded once, do nothing
    if (dataLoadedOnce) return

    // Only load data when the panel is open
    if (open) {
      // Only trigger filter change event if there are no items
      if (items.length === 0) {
        // Trigger filter event to populate panel on first open
        onFilterChange(filterValue, null)
      }
    }
  }, [open, dataLoadedOnce, onFilterChange, filterValue, items, loadingManagedExternally, listContainerElement])

  const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const onOpen: AnchoredOverlayProps['onOpen'] = useCallback(
    (gesture: Parameters<Exclude<AnchoredOverlayProps['onOpen'], undefined>>[0]) => onOpenChange(true, gesture),
    [onOpenChange],
  )
  const onClose = useCallback(
    (gesture: Parameters<Exclude<AnchoredOverlayProps['onClose'], undefined>>[0] | 'selection') => {
      onOpenChange(false, gesture)
    },
    [onOpenChange],
  )

  const renderMenuAnchor = useMemo(() => {
    if (renderAnchor === null) {
      return null
    }

    const selectedItems = Array.isArray(selected) ? selected : [...(selected ? [selected] : [])]

    return <T extends React.HTMLAttributes<HTMLElement>>(props: T) => {
      return renderAnchor({
        ...props,
        children: selectedItems.length ? selectedItems.map(item => item.text).join(', ') : placeholder,
      })
    }
  }, [placeholder, renderAnchor, selected])

  const itemsToRender = useMemo(() => {
    return items.map(item => {
      const isItemSelected = isMultiSelectVariant(selected) ? doesItemsIncludeItem(selected, item) : selected === item

      return {
        ...item,
        role: 'option',
        selected: 'selected' in item && item.selected === undefined ? undefined : isItemSelected,
        onAction: (itemFromAction, event) => {
          item.onAction?.(itemFromAction, event)

          if (event.defaultPrevented) {
            return
          }

          if (isMultiSelectVariant(selected)) {
            const otherSelectedItems = selected.filter(selectedItem => !areItemsEqual(selectedItem, item))
            const newSelectedItems = doesItemsIncludeItem(selected, item)
              ? otherSelectedItems
              : [...otherSelectedItems, item]

            const multiSelectOnChange = onSelectedChange as SelectPanelMultiSelection['onSelectedChange']
            multiSelectOnChange(newSelectedItems)
            return
          }

          // single select
          const singleSelectOnChange = onSelectedChange as SelectPanelSingleSelection['onSelectedChange']
          singleSelectOnChange(item === selected ? undefined : item)
          onClose('selection')
        },
      } as ItemProps
    })
  }, [onClose, onSelectedChange, items, selected])

  const focusTrapSettings = {
    initialFocusRef: inputRef || undefined,
  }

  const extendedTextInputProps: Partial<TextInputProps> = useMemo(() => {
    return {
      sx: {m: 2},
      contrast: true,
      leadingVisual: SearchIcon,
      'aria-label': inputLabel,
      ...textInputProps,
    }
  }, [inputLabel, textInputProps])

  const loadingType = (): FilteredActionListLoadingType => {
    if (dataLoadedOnce) {
      return FilteredActionListLoadingTypes.input
    } else {
      if (initialLoadingType === 'spinner') {
        return FilteredActionListLoadingTypes.bodySpinner
      } else {
        return FilteredActionListLoadingTypes.bodySkeleton
      }
    }
  }
  const usingModernActionList = useFeatureFlag('primer_react_select_panel_with_modern_action_list')

  return (
    <LiveRegion>
      <AnchoredOverlay
        renderAnchor={renderMenuAnchor}
        anchorRef={anchorRef}
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        overlayProps={{
          role: 'dialog',
          'aria-labelledby': titleId,
          'aria-describedby': subtitle ? subtitleId : undefined,
          ...overlayProps,
        }}
        focusTrapSettings={focusTrapSettings}
        focusZoneSettings={focusZoneSettings}
        height={height}
        width={width}
        anchorId={id}
        pinPosition={!height}
      >
        <LiveRegionOutlet />
        {usingModernActionList ? null : (
          <Message
            value={
              filterValue === ''
                ? 'Showing all items'
                : items.length <= 0
                  ? 'No matching items'
                  : `${items.length} matching ${items.length === 1 ? 'item' : 'items'}`
            }
          />
        )}
        <Box
          sx={enabled ? undefined : {display: 'flex', flexDirection: 'column', height: 'inherit', maxHeight: 'inherit'}}
          className={enabled ? classes.Wrapper : undefined}
        >
          <Box sx={enabled ? undefined : {pt: 2, px: 3}} className={enabled ? classes.Content : undefined}>
            <Heading
              as="h1"
              id={titleId}
              sx={enabled ? undefined : {fontSize: 1}}
              className={enabled ? classes.Title : undefined}
            >
              {title}
            </Heading>
            {subtitle ? (
              <Box
                id={subtitleId}
                sx={enabled ? undefined : {fontSize: 0, color: 'fg.muted'}}
                className={enabled ? classes.Subtitle : undefined}
              >
                {subtitle}
              </Box>
            ) : null}
          </Box>
          <FilteredActionList
            filterValue={filterValue}
            onFilterChange={onFilterChange}
            onListContainerRefChanged={onListContainerRefChanged}
            onInputRefChanged={onInputRefChanged}
            placeholderText={placeholderText}
            {...listProps}
            role="listbox"
            // browsers give aria-labelledby precedence over aria-label so we need to make sure
            // we don't accidentally override props.aria-label
            aria-labelledby={listProps['aria-label'] ? undefined : titleId}
            aria-multiselectable={isMultiSelectVariant(selected) ? 'true' : 'false'}
            selectionVariant={isMultiSelectVariant(selected) ? 'multiple' : 'single'}
            items={itemsToRender}
            textInputProps={extendedTextInputProps}
            loading={loading || isLoading}
            loadingType={loadingType()}
            // inheriting height and maxHeight ensures that the FilteredActionList is never taller
            // than the Overlay (which would break scrolling the items)
            sx={enabled ? sx : {...sx, height: 'inherit', maxHeight: 'inherit'}}
            className={enabled ? clsx(className, classes.FilteredActionList) : className}
            announcementsEnabled={false}
          />
          {footer && (
            <Box
              sx={
                enabled
                  ? undefined
                  : {
                      display: 'flex',
                      borderTop: '1px solid',
                      borderColor: 'border.default',
                      padding: 2,
                    }
              }
              className={enabled ? classes.Footer : undefined}
            >
              {footer}
            </Box>
          )}
        </Box>
      </AnchoredOverlay>
    </LiveRegion>
  )
}

SelectPanel.displayName = 'SelectPanel'
