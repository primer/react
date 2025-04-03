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
  variant?: 'anchored' | 'modal'
}

export type SelectPanelProps = SelectPanelBaseProps &
  Omit<FilteredActionListProps, 'selectionVariant' | 'variant'> &
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
  message,
  notice,
  onCancel,
  variant = 'anchored',
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
  const isNarrowScreenSize = useResponsiveValue({narrow: true, regular: false, wide: false}, false)

  const usingModernActionList = useFeatureFlag('primer_react_select_panel_modern_action_list')
  const usingFullScreenOnNarrow = useFeatureFlag('primer_react_select_panel_fullscreen_on_narrow')

  // Single select modals work differently, they have an intermediate state where the user has selected an item but
  // has not yet confirmed the selection. This is the only time the user can cancel the selection.
  const isSingleSelectModal = variant === 'modal' && !isMultiSelectVariant(selected)
  const [intermediateSelected, setIntermediateSelected] = useState<ItemInput | undefined>(
    isSingleSelectModal ? selected : undefined,
  )

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
      if (variant === 'modal' && gesture === 'click-outside') onCancel?.()
      onOpenChange(false, gesture)
    },
    [onOpenChange, variant, onCancel],
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
        children: selectedItems.length ? selectedItems.map(item => item.text).join(', ') : placeholder,
      })
    }
  }, [placeholder, renderAnchor, selected])

  const itemsToRender = useMemo(() => {
    return items.map(item => {
      const isItemSelected = isMultiSelectVariant(selected)
        ? doesItemsIncludeItem(selected, item)
        : isSingleSelectModal
          ? intermediateSelected?.id === item.id
          : selected?.id === item.id

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

          if (isSingleSelectModal) {
            setIntermediateSelected(item)
            return
          }
          // single select anchored, direct save on click
          const singleSelectOnChange = onSelectedChange as SelectPanelSingleSelection['onSelectedChange']
          singleSelectOnChange(item === selected ? undefined : item)
          onClose('selection')
        },
      } as ItemProps
    })
  }, [onClose, onSelectedChange, items, selected, intermediateSelected])

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

  // We add a save and cancel button on narrow screens when SelectPanel is full-screen
  // Save and Cancel buttons are only useful for multiple selection, single selection instantly closes the panel
  const showCancelSaveButtons = variant === 'modal' || (isMultiSelectVariant(selected) && usingFullScreenOnNarrow)
  const showXCloseIcon = variant === 'modal' || usingFullScreenOnNarrow

  return (
    <>
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
          ...(variant === 'modal'
            ? {
                /* override AnchoredOverlay position */
                top: '50vh',
                left: '50vw',
                anchorSide: undefined,
              }
            : {}),
          style: {
            '--max-height': overlayProps?.maxHeight ? heightMap[overlayProps.maxHeight] : heightMap['large'],
            /* override AnchoredOverlay position */
            transform: variant === 'modal' ? 'translate(-50%, -50%)' : undefined,
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
        <div className={classes.Wrapper} data-variant={variant}>
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
            {showXCloseIcon && (
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
            )}
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
            selectionVariant={isSingleSelectModal ? 'radio' : isMultiSelectVariant(selected) ? 'multiple' : 'single'}
            items={itemsToRender}
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
          ) : showCancelSaveButtons ? (
            /* Save and Cancel buttons are only useful for multiple selection, single selection instantly closes the panel */
            <div className={clsx(classes.Footer, classes.ResponsiveFooter)}>
              <Button
                size="medium"
                onClick={() => {
                  onCancel?.()
                  onCancelRequested()
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={() => {
                  if (isSingleSelectModal) {
                    const singleSelectOnChange = onSelectedChange as SelectPanelSingleSelection['onSelectedChange']
                    singleSelectOnChange(intermediateSelected)
                    onClose('selection')
                  } else {
                    onClose('click-outside')
                  }
                }}
              >
                Save
              </Button>
            </div>
          ) : null}
        </div>
      </AnchoredOverlay>
      {variant === 'modal' && open ? <div className={classes.Backdrop} /> : null}
    </>
  )
}
