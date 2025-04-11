import {AlertIcon, InfoIcon, SearchIcon, StopIcon, TriangleDownIcon, XIcon} from '@primer/octicons-react'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {AnchoredOverlayProps} from '../AnchoredOverlay'
import {AnchoredOverlay} from '../AnchoredOverlay'
import type {AnchoredOverlayWrapperAnchorProps} from '../AnchoredOverlay/AnchoredOverlay'
import type {FilteredActionListProps} from '../FilteredActionList'
import {FilteredActionList} from '../FilteredActionList'
import Heading from '../Heading'
import type {OverlayProps} from '../Overlay'
import type {TextInputProps} from '../TextInput'
import type {ItemProps, ItemInput} from './types'
import {SelectPanelMessage} from './SelectPanelMessage'

import {Button, IconButton} from '../Button'
import {useProvidedRefOrCreate} from '../hooks'
import type {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {useId} from '../hooks/useId'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import useSafeTimeout from '../hooks/useSafeTimeout'
import type {FilteredActionListLoadingType} from '../FilteredActionList/FilteredActionListLoaders'
import {FilteredActionListLoadingTypes} from '../FilteredActionList/FilteredActionListLoaders'
import {useFeatureFlag} from '../FeatureFlags'
import {announce} from '@primer/live-region-element'
import classes from './SelectPanel.module.css'
import {clsx} from 'clsx'
import {heightMap} from '../Overlay/Overlay'
import {debounce} from '@github/mini-throttle'
import {useResponsiveValue} from '../hooks/useResponsiveValue'

// we add a delay so that it does not interrupt default screen reader announcement and queues after it
const SHORT_DELAY_MS = 500
const LONG_DELAY_MS = 1000

const DefaultEmptyMessage = (
  <SelectPanelMessage variant="empty" title="You haven't created any items yet" key="empty-message">
    Please add or create new items to populate the list.
  </SelectPanelMessage>
)

async function announceText(text: string, delayMs = SHORT_DELAY_MS) {
  const liveRegion = document.querySelector('live-region')

  liveRegion?.clear() // clear previous announcements

  await announce(text, {
    delayMs,
    from: liveRegion ? liveRegion : undefined, // announce will create a liveRegion if it doesn't find one
  })
}

async function announceLoading() {
  await announceText('Loading.')
}

const announceNoItems = debounce((message?: string) => {
  announceText(message ?? 'No matching items.', LONG_DELAY_MS)
}, 250)

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
    gesture: 'anchor-click' | 'anchor-key-press' | 'click-outside' | 'escape' | 'selection' | 'cancel',
  ) => void
  placeholder?: string
  // TODO: Make `inputLabel` required in next major version
  inputLabel?: string
  overlayProps?: Partial<OverlayProps>
  footer?: string | React.ReactElement
  initialLoadingType?: InitialLoadingType
  className?: string
  notice?: {
    text: string | React.ReactElement
    variant: 'info' | 'warning' | 'error'
  }
  message?: {
    title: string
    body: string | React.ReactElement
    variant: 'empty' | 'error' | 'warning'
  }
  onCancel?: () => void
  orderSelectedFirst?: boolean
  sortKey?: keyof ItemInput
  sortDirection?: 'asc' | 'desc'
  sortFn?: (a: ItemInput, b: ItemInput) => number
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

function usePreviousValue<T>(value: T): T {
  const ref = React.useRef(value)

  React.useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

function compareByKey(sortKey?: keyof ItemInput, sortDirection: 'asc' | 'desc' = 'asc') {
  return (itemA: ItemInput, itemB: ItemInput) => {
    if (sortKey) {
      if (sortDirection === 'asc') {
        if ((itemA[sortKey] ?? '') < (itemB[sortKey] ?? '')) {
          return -1
        } else if ((itemA.text ?? '') > (itemB.text ?? '')) {
          return 1
        }
      } else {
        if ((itemA[sortKey] ?? '') > (itemB[sortKey] ?? '')) {
          return -1
        } else if ((itemA.text ?? '') < (itemB.text ?? '')) {
          return 1
        }
      }
    }
    return 0
  }
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
  message,
  notice,
  onCancel,
  orderSelectedFirst = true,
  sortDirection = 'asc',
  sortFn,
  sortKey,
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
  const [needsNoItemsAnnouncement, setNeedsNoItemsAnnouncement] = useState<boolean>(false)
  const prevItems = usePreviousValue(items)
  const [selectedOnSort, setSelectedOnSort] = useState<ItemInput[]>([])
  const [itemsToRender, setItemsToRender] = useState<ItemInput[]>([])
  const [sortedItems, setSortedItems] = useState<ItemInput[]>([])
  const isNarrowScreenSize = useResponsiveValue({narrow: true, regular: false, wide: false}, false)

  const usingModernActionList = useFeatureFlag('primer_react_select_panel_modern_action_list')
  const usingFullScreenOnNarrow = useFeatureFlag('primer_react_select_panel_fullscreen_on_narrow')

  const onListContainerRefChanged: FilteredActionListProps['onListContainerRefChanged'] = useCallback(
    (node: HTMLElement | null) => {
      setListContainerElement(node)
      if (!node && needsNoItemsAnnouncement) {
        announceNoItems()
        setNeedsNoItemsAnnouncement(false)
      }
    },
    [needsNoItemsAnnouncement],
  )

  const onInputRefChanged = useCallback(
    (ref: React.RefObject<HTMLInputElement>) => {
      setInputRef(ref)
    },
    [setInputRef],
  )

  const resetSort = useCallback(() => {
    if (isMultiSelectVariant(selected)) {
      setSelectedOnSort(selected)
    } else if (selected) {
      setSelectedOnSort([selected])
    } else {
      setSelectedOnSort([])
    }
  }, [selected])

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
          }, LONG_DELAY_MS)
        } else {
          // If this is the first data load and there are no items, show the loading spinner
          // immediately

          if (items.length === 0) {
            setIsLoading(true)
          }

          // We still want to announce if loading is taking too long
          loadingDelayTimeoutId.current = safeSetTimeout(() => {
            announceLoading()
          }, LONG_DELAY_MS)
        }
      }

      externalOnFilterChange(value, e)
      setInternalFilterValue(value)
      if (!value) {
        resetSort()
      }
    },
    [
      loadingManagedInternally,
      externalOnFilterChange,
      setInternalFilterValue,
      dataLoadedOnce,
      safeSetTimeout,
      safeClearTimeout,
      items.length,
      resetSort,
    ],
  )

  // disable body scroll when the panel is open on narrow screens
  useEffect(() => {
    if (open && isNarrowScreenSize && usingFullScreenOnNarrow) {
      const bodyOverflowStyle = document.body.style.overflow || ''
      // If the body is already set to overflow: hidden, it likely means
      // that there is already a modal open. In that case, we should bail
      // so we don't re-enable scroll after the second dialog is closed.
      if (bodyOverflowStyle === 'hidden') {
        return
      }

      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = bodyOverflowStyle
      }
    }
  }, [isNarrowScreenSize, open, usingFullScreenOnNarrow])

  useEffect(() => {
    if (open) {
      if (items.length === 0 && !(isLoading || loading)) {
        // we need to wait for the listContainerElement to disappear before announcing no items, otherwise it will be interrupted
        if (!listContainerElement || !usingModernActionList) {
          announceNoItems(message?.title)
        } else {
          setNeedsNoItemsAnnouncement(true)
        }
      }
    }

    if (loadingManagedExternally) {
      if (items.length > 0) {
        setDataLoadedOnce(true)
      }

      return
    }

    if (isLoading || items.length > 0) {
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

      // We would normally expect AnchoredOverlay's focus trap to automatically focus the input,
      // but for some reason the ref isn't populated until _after_ the panel is open, which is
      // too late. So, we focus manually here.
      if (open) {
        ref.focus()
      }
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

  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const onOpen: AnchoredOverlayProps['onOpen'] = useCallback(
    (gesture: Parameters<Exclude<AnchoredOverlayProps['onOpen'], undefined>>[0]) => onOpenChange(true, gesture),
    [onOpenChange],
  )
  const onClose = useCallback(
    (gesture: Parameters<Exclude<AnchoredOverlayProps['onClose'], undefined>>[0] | 'selection' | 'escape') => {
      onOpenChange(false, gesture)
    },
    [onOpenChange],
  )

  const onCancelRequested = useCallback(() => {
    onOpenChange(false, 'cancel')
  }, [onOpenChange])

  const renderMenuAnchor = useMemo(() => {
    if (renderAnchor === null) {
      return null
    }

    const selectedItems = Array.isArray(selected) ? selected : [...(selected ? [selected] : [])]

    return <T extends React.HTMLAttributes<HTMLElement>>(props: T) => {
      return renderAnchor({
        ...props,
        children: selectedItems.length
          ? selectedItems
              .sort(sortFn ?? compareByKey(sortKey, sortDirection))
              .map(item => item.text)
              .join(', ')
          : placeholder,
      })
    }
  }, [placeholder, renderAnchor, selected, sortDirection, sortFn, sortKey])

  useEffect(() => {
    if (open) {
      resetSort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (prevItems.length === 0 && items.length > 0) {
      resetSort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, prevItems])

  useEffect(() => {
    const itemsToRender = items.map(item => {
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

    setItemsToRender(itemsToRender)
  }, [onClose, onSelectedChange, items, selected])

  useEffect(() => {
    if (sortFn) {
      setSortedItems(itemsToRender.sort(sortFn))
      return
    } else if (sortKey || orderSelectedFirst) {
      const compare = compareByKey(sortKey, sortDirection)

      const sorted = itemsToRender.sort((itemA, itemB) => {
        if (orderSelectedFirst) {
          // itemA is selected (for sorting purposes) if an object in selectedOnSort matches every property of itemA, except for the selected property
          const itemASelected = selectedOnSort.some(item =>
            Object.entries(item).every(([key, value]) => {
              if (key === 'selected') {
                return true
              }
              return itemA[key as keyof ItemProps] === value
            }),
          )

          // itemB is selected (for sorting purposes) if an object in selectedOnSort matches every property of itemA, except for the selected property
          const itemBSelected = selectedOnSort.some(item =>
            Object.entries(item).every(([key, value]) => {
              if (key === 'selected') {
                return true
              }
              return itemB[key as keyof ItemProps] === value
            }),
          )

          // order selected items first
          if (itemASelected > itemBSelected) {
            return -1
          } else if (itemASelected < itemBSelected) {
            return 1
          }
        }

        return compare(itemA, itemB)
      })

      setSortedItems(sorted)
    } else {
      setSortedItems(itemsToRender)
    }
  }, [itemsToRender, selectedOnSort, sortKey, sortDirection, sortFn, orderSelectedFirst])

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

  const iconForNoticeVariant = {
    info: <InfoIcon size={16} />,
    warning: <AlertIcon size={16} />,
    error: <StopIcon size={16} />,
  }

  function getMessage() {
    if (items.length === 0 && !message) {
      return DefaultEmptyMessage
    } else if (message) {
      return (
        <SelectPanelMessage title={message.title} variant={message.variant}>
          {message.body}
        </SelectPanelMessage>
      )
    }
  }

  // because of instant selection, canceling on single select is the same as closing the panel, no onCancel needed
  const shouldShowXButton = (onCancel || !isMultiSelectVariant(selected)) && usingFullScreenOnNarrow

  return (
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
        style: {
          '--max-height': overlayProps?.maxHeight ? heightMap[overlayProps.maxHeight] : heightMap['large'],
        } as React.CSSProperties,
      }}
      focusTrapSettings={focusTrapSettings}
      focusZoneSettings={focusZoneSettings}
      height={height}
      width={width}
      anchorId={id}
      variant={usingFullScreenOnNarrow ? {regular: 'anchored', narrow: 'fullscreen'} : undefined}
      pinPosition={!height}
      className={classes.Overlay}
    >
      <div className={classes.Wrapper}>
        <div className={classes.Header}>
          <div>
            <Heading as="h1" id={titleId} className={classes.Title}>
              {title}
            </Heading>
            {subtitle ? (
              <div id={subtitleId} className={classes.Subtitle}>
                {subtitle}
              </div>
            ) : null}
          </div>
          {shouldShowXButton ? (
            <IconButton
              type="button"
              variant="invisible"
              icon={XIcon}
              aria-label="Cancel and close"
              className={classes.ResponsiveCloseButton}
              onClick={() => {
                onCancel?.()
                onCancelRequested()
              }}
            />
          ) : null}
        </div>
        {notice && (
          <div aria-live="polite" data-variant={notice.variant} className={classes.Notice}>
            {iconForNoticeVariant[notice.variant]}
            <div>{notice.text}</div>
          </div>
        )}
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
          items={sortedItems}
          textInputProps={extendedTextInputProps}
          loading={loading || isLoading}
          loadingType={loadingType()}
          // hack because the deprecated ActionList does not support this prop
          {...{
            message: getMessage(),
          }}
          // inheriting height and maxHeight ensures that the FilteredActionList is never taller
          // than the Overlay (which would break scrolling the items)
          sx={sx}
          className={clsx(className, classes.FilteredActionList)}
          // needed to explicitly enable announcements for deprecated FilteredActionList, we can remove when we fully remove the deprecated version
          announcementsEnabled
        />
        {footer ? (
          <div className={classes.Footer}>{footer}</div>
        ) : isMultiSelectVariant(selected) && usingFullScreenOnNarrow ? (
          /* Save and Cancel buttons are only useful for multiple selection, single selection instantly closes the panel */
          <div className={clsx(classes.Footer, classes.ResponsiveFooter)}>
            {/* we add a save and cancel button on narrow screens when SelectPanel is full-screen */}
            {onCancel && (
              <Button
                size="medium"
                onClick={() => {
                  onCancel()
                  onCancelRequested()
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="primary"
              size="medium"
              block={onCancel ? false : true}
              onClick={() => onClose('click-outside')}
            >
              Save
            </Button>
          </div>
        ) : null}
      </div>
    </AnchoredOverlay>
  )
}
