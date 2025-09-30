import {SearchIcon, TriangleDownIcon, XIcon, type IconProps} from '@primer/octicons-react'
import React, {useCallback, useEffect, useMemo, useRef, useState, type KeyboardEventHandler} from 'react'
import type {AnchoredOverlayProps} from '../AnchoredOverlay'
import {AnchoredOverlay} from '../AnchoredOverlay'
import type {AnchoredOverlayWrapperAnchorProps} from '../AnchoredOverlay/AnchoredOverlay'
import type {FilteredActionListProps} from '../FilteredActionList'
import {FilteredActionList} from '../FilteredActionList'
import Heading from '../Heading'
import type {OverlayProps} from '../Overlay'
import type {TextInputProps} from '../TextInput'
import type {ItemProps, ItemInput} from './'
import {SelectPanelMessage} from './SelectPanelMessage'

import {Button, IconButton, LinkButton} from '../Button'
import {useProvidedRefOrCreate} from '../hooks'
import type {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {useId} from '../hooks/useId'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import useSafeTimeout from '../hooks/useSafeTimeout'
import type {FilteredActionListLoadingType} from '../FilteredActionList/FilteredActionListLoaders'
import {FilteredActionListLoadingTypes} from '../FilteredActionList/FilteredActionListLoaders'
import {useFeatureFlag} from '../FeatureFlags'
import {announce, announceFromElement} from '@primer/live-region-element'
import classes from './SelectPanel.module.css'
import {clsx} from 'clsx'
import {debounce} from '@github/mini-throttle'
import {useResponsiveValue} from '../hooks/useResponsiveValue'
import type {ButtonProps, LinkButtonProps} from '../Button/types'
import {Banner} from '../Banner'
import {isAlphabetKey} from '../hooks/useMnemonics'

// we add a delay so that it does not interrupt default screen reader announcement and queues after it
const SHORT_DELAY_MS = 500
const LONG_DELAY_MS = 1000
const EMPTY_MESSAGE = {
  title: 'No items available',
  description: '',
}

const DefaultEmptyMessage = (
  <SelectPanelMessage variant="empty" title={EMPTY_MESSAGE.title} key="empty-message">
    {EMPTY_MESSAGE.description}
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

interface SelectPanelSingleSelection {
  selected: ItemInput | undefined
  onSelectedChange: (selected: ItemInput | undefined) => void
}

interface SelectPanelMultiSelection {
  selected: ItemInput[]
  onSelectedChange: (selected: ItemInput[]) => void
}

export type InitialLoadingType = 'spinner' | 'skeleton'
export type SelectPanelSecondaryAction =
  | React.ReactElement<typeof SecondaryButton>
  | React.ReactElement<typeof SecondaryLink>

interface SelectPanelBaseProps {
  // TODO: Make `title` required in the next major version
  title?: string | React.ReactElement
  subtitle?: string | React.ReactElement
  onOpenChange: (
    open: boolean,
    gesture: 'anchor-click' | 'anchor-key-press' | 'click-outside' | 'escape' | 'selection' | 'cancel',
  ) => void
  secondaryAction?: SelectPanelSecondaryAction
  placeholder?: string
  // TODO: Make `inputLabel` required in next major version
  inputLabel?: string
  overlayProps?: Partial<OverlayProps>
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
    icon?: React.ComponentType<IconProps>
    action?: React.ReactElement
  }
  /**
   * @deprecated Use `secondaryAction` instead.
   */
  footer?: string | React.ReactElement
  showSelectedOptionsFirst?: boolean
  /**
   * Whether to disable fullscreen behavior on narrow viewports.
   * When `true`, the panel will maintain its anchored position regardless of viewport size.
   * When `false`, the panel will go fullscreen on narrow viewports (if feature flag is enabled).
   * @default undefined (uses feature flag default)
   */
  disableFullscreenOnNarrow?: boolean
  showSelectAll?: boolean
}

// onCancel is optional with variant=anchored, but required with variant=modal
type SelectPanelVariantProps = {variant?: 'anchored'; onCancel?: () => void} | {variant: 'modal'; onCancel: () => void}

export type SelectPanelProps = SelectPanelBaseProps &
  Omit<FilteredActionListProps, 'selectionVariant' | 'variant' | 'message'> &
  Pick<AnchoredOverlayProps, 'open' | 'height' | 'width' | 'align'> &
  AnchoredOverlayWrapperAnchorProps &
  (SelectPanelSingleSelection | SelectPanelMultiSelection) &
  SelectPanelVariantProps

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

const defaultRenderAnchor: NonNullable<SelectPanelProps['renderAnchor']> = props => {
  const {children, ...rest} = props
  return (
    <Button trailingAction={TriangleDownIcon} {...rest}>
      {children}
    </Button>
  )
}

function Panel({
  open,
  onOpenChange,
  renderAnchor = defaultRenderAnchor,
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
  secondaryAction,
  showSelectedOptionsFirst = true,
  disableFullscreenOnNarrow,
  align,
  showSelectAll = false,
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
  const [selectedOnSort, setSelectedOnSort] = useState<ItemInput[]>([])
  const [prevItems, setPrevItems] = useState<ItemInput[]>([])
  const [prevOpen, setPrevOpen] = useState(open)
  const initialHeightRef = useRef(0)
  const initialScaleRef = useRef(1)
  const noticeRef = useRef<HTMLDivElement>(null)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [availablePanelHeight, setAvailablePanelHeight] = useState<number | undefined>(undefined)
  const KEYBOARD_VISIBILITY_THRESHOLD = 10

  const featureFlagFullScreenOnNarrow = useFeatureFlag('primer_react_select_panel_fullscreen_on_narrow')
  const usingFullScreenOnNarrow = disableFullscreenOnNarrow ? false : featureFlagFullScreenOnNarrow
  const shouldOrderSelectedFirst =
    useFeatureFlag('primer_react_select_panel_order_selected_at_top') && showSelectedOptionsFirst
  const usingRemoveActiveDescendant = useFeatureFlag('primer_react_select_panel_remove_active_descendant')

  // Single select modals work differently, they have an intermediate state where the user has selected an item but
  // has not yet confirmed the selection. This is the only time the user can cancel the selection.
  const isSingleSelectModal = variant === 'modal' && !isMultiSelectVariant(selected)
  const [intermediateSelected, setIntermediateSelected] = useState<ItemInput | undefined>(
    isSingleSelectModal ? selected : undefined,
  )

  // Reset the intermediate selected item when the panel is open/closed
  useEffect(() => {
    setIntermediateSelected(isSingleSelectModal ? selected : undefined)
  }, [isSingleSelectModal, open, selected])

  const onListContainerRefChanged: FilteredActionListProps['onListContainerRefChanged'] = useCallback(
    (node: HTMLElement | null) => {
      setListContainerElement(node)
      if (!node && needsNoItemsAnnouncement) {
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

  const handleSelectAllChange = useCallback(
    (checked: boolean) => {
      // Exit early if not in multi-select mode
      if (!isMultiSelectVariant(selected)) {
        return
      }

      const multiSelectOnChange = onSelectedChange as SelectPanelMultiSelection['onSelectedChange']
      const selectedArray = selected as ItemInput[]

      const selectedItemsNotInFilteredView = selectedArray.filter(
        (selectedItem: ItemInput) => !items.some(item => areItemsEqual(item, selectedItem)),
      )

      if (checked) {
        multiSelectOnChange([...selectedItemsNotInFilteredView, ...items])
      } else {
        multiSelectOnChange(selectedItemsNotInFilteredView)
      }
    },
    [items, onSelectedChange, selected],
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
        setNeedsNoItemsAnnouncement(true)
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
    // eslint-disable-next-line react-compiler/react-compiler
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

  // Manage loading announcements when loadingManagedExternally
  useEffect(() => {
    if (loadingManagedExternally) {
      if (isLoading) {
        // Delay the announcement a bit, just in case the loading is quick
        loadingDelayTimeoutId.current = safeSetTimeout(() => {
          announceLoading()
        }, LONG_DELAY_MS)
      } else {
        // If loading is done, we can clear the loading announcement
        if (loadingDelayTimeoutId.current) {
          safeClearTimeout(loadingDelayTimeoutId.current)
        }
      }
    }
  }, [isLoading, loadingManagedExternally, safeSetTimeout, safeClearTimeout])

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

  useEffect(() => {
    if (!window.visualViewport || !open || !isNarrowScreenSize) {
      return
    }

    initialHeightRef.current = window.visualViewport.height
    initialScaleRef.current = window.visualViewport.scale

    const handleViewportChange = debounce(() => {
      if (window.visualViewport) {
        const currentScale = window.visualViewport.scale
        const isZooming = currentScale !== initialScaleRef.current
        if (!isZooming) {
          const currentHeight = window.visualViewport.height
          const keyboardVisible = initialHeightRef.current - currentHeight > KEYBOARD_VISIBILITY_THRESHOLD
          setIsKeyboardVisible(keyboardVisible)
          setAvailablePanelHeight(keyboardVisible ? currentHeight : undefined)
        }
      }
    }, 100)

    // keeping this check to satisfy typescript but need eslint to ignore redundancy rule
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (window.visualViewport) {
      // Using visualViewport to more reliably detect viewport changes across different browsers, which specifically requires these listeners
      // eslint-disable-next-line github/prefer-observers
      window.visualViewport.addEventListener('resize', handleViewportChange)
      // eslint-disable-next-line github/prefer-observers
      window.visualViewport.addEventListener('scroll', handleViewportChange)
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange)
        window.visualViewport.removeEventListener('scroll', handleViewportChange)
      }
      handleViewportChange.cancel()
    }
  }, [open, isNarrowScreenSize])

  useEffect(() => {
    const announceNotice = async () => {
      if (!noticeRef.current) return
      const liveRegion = document.querySelector('live-region')

      liveRegion?.clear()

      await announceFromElement(noticeRef.current, {
        from: liveRegion ? liveRegion : undefined,
      })
    }

    if (open && notice) {
      announceNotice()
    }
  }, [notice, open])

  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const onOpen: AnchoredOverlayProps['onOpen'] = useCallback(
    (gesture: Parameters<Exclude<AnchoredOverlayProps['onOpen'], undefined>>[0]) => onOpenChange(true, gesture),
    [onOpenChange],
  )

  const onCancelRequested = useCallback(() => {
    onOpenChange(false, 'cancel')
  }, [onOpenChange])

  const onClose = useCallback(
    (
      gesture: Parameters<Exclude<AnchoredOverlayProps['onClose'], undefined>>[0] | 'selection' | 'escape' | 'close',
    ) => {
      // Clicking outside should cancel the selection only on modals
      if (variant === 'modal' && gesture === 'click-outside') {
        onCancel?.()
      }
      if (gesture === 'close') {
        onCancel?.()
        onCancelRequested()
      } else {
        onOpenChange(false, gesture)
      }
    },
    [onOpenChange, variant, onCancel, onCancelRequested],
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

  const isItemCurrentlySelected = useCallback(
    (item: ItemInput) => {
      // For multi-select, we just need to check if the item is in the selected array
      if (isMultiSelectVariant(selected)) {
        return doesItemsIncludeItem(selected, item)
      }

      // For single-select modal, there is an intermediate state when the user has selected
      // an item but has not yet saved the selection. We need to check for this state.
      if (isSingleSelectModal) {
        return intermediateSelected?.id !== undefined
          ? intermediateSelected.id === item.id
          : intermediateSelected === item
      }

      // For single-select anchored, we just need to check if the item is the selected item
      return selected?.id !== undefined ? selected.id === item.id : selected === item
    },
    [selected, intermediateSelected, isSingleSelectModal],
  )

  const itemsToRender = useMemo(() => {
    return items
      .map(item => {
        return {
          ...item,
          role: 'option',
          id: item.id,
          selected: 'selected' in item && item.selected === undefined ? undefined : isItemCurrentlySelected(item),
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
              if (intermediateSelected?.id === item.id) {
                // if the item is already selected, we need to unselect it
                setIntermediateSelected(undefined)
              } else {
                setIntermediateSelected(item)
              }
              return
            }
            // single select anchored, direct save on click
            const singleSelectOnChange = onSelectedChange as SelectPanelSingleSelection['onSelectedChange']
            singleSelectOnChange(item === selected ? undefined : item)
            onClose('selection')
          },
        } as ItemProps
      })
      .sort((itemA, itemB) => {
        if (shouldOrderSelectedFirst) {
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

        return 0
      })
  }, [
    onClose,
    onSelectedChange,
    items,
    selected,
    isItemCurrentlySelected,
    isSingleSelectModal,
    intermediateSelected,
    shouldOrderSelectedFirst,
    selectedOnSort,
  ])

  if (prevItems !== items) {
    setPrevItems(items)
    if (prevItems.length === 0 && items.length > 0) {
      resetSort()
    }
  }

  if (open !== prevOpen) {
    setPrevOpen(open)
    resetSort()
  }

  const focusTrapSettings = {
    initialFocusRef: inputRef || undefined,
  }

  const extendedTextInputProps: Partial<TextInputProps> = useMemo(() => {
    return {
      className: classes.TextInput,
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

  function getMessage() {
    if (items.length === 0 && !message) {
      return DefaultEmptyMessage
    } else if (message) {
      return (
        <SelectPanelMessage title={message.title} variant={message.variant} icon={message.icon} action={message.action}>
          {message.body}
        </SelectPanelMessage>
      )
    }
  }

  // We add permanent save and cancel buttons on:
  // - modals
  const showPermanentCancelSaveButtons = variant === 'modal'

  // The next two could be collapsed, left them separate for readability

  // We add a responsive save and cancel button on:
  // - anchored panels with multi select if there is onCancel
  const showResponsiveCancelSaveButtons =
    variant !== 'modal' && usingFullScreenOnNarrow && isMultiSelectVariant(selected) && onCancel !== undefined

  // The responsive save and close button is only covering a very specific case:
  // - anchored panel with multi select if there is no onCancel.
  // This variant should disappear in the future, once onCancel is required,
  // but for now we need to support it so there is a user friendly way to close the panel.
  const showResponsiveSaveAndCloseButton =
    variant !== 'modal' && usingFullScreenOnNarrow && isMultiSelectVariant(selected) && onCancel === undefined

  // If there is any element in the footer, we render it.
  const renderFooter =
    secondaryAction !== undefined ||
    showPermanentCancelSaveButtons ||
    showResponsiveSaveAndCloseButton ||
    showResponsiveCancelSaveButtons

  // If there's any permanent elements in the footer, we show it always.
  // The save button is only shown on small screens.
  const displayFooter =
    secondaryAction !== undefined || showPermanentCancelSaveButtons
      ? 'always'
      : showResponsiveSaveAndCloseButton || showResponsiveCancelSaveButtons
        ? 'only-small'
        : undefined

  const stretchSecondaryAction =
    showResponsiveSaveAndCloseButton || showResponsiveCancelSaveButtons
      ? 'only-big'
      : showPermanentCancelSaveButtons
        ? 'never'
        : 'always'

  const stretchSaveButton = showResponsiveSaveAndCloseButton && secondaryAction === undefined ? 'only-small' : 'never'

  /*
   * SelectPanel uses two close button implementations for different use cases:
   *
   * 1. AnchoredOverlay close button - Enabled on narrow screens (showXCloseIcon logic)
   *
   * 2. SelectPanel modal close button - Used for modal variant on wider screens
   *    (variant === 'modal' && !isNarrowScreenSize logic below)
   *
   * The dual approach handles different responsive behaviors: AnchoredOverlay manages
   * close functionality for narrow fullscreen, while SelectPanel handles modal close on desktop.
   */
  const showXCloseIcon = (onCancel !== undefined || !isMultiSelectVariant(selected)) && usingFullScreenOnNarrow

  const currentResponsiveVariant = useResponsiveValue(
    usingFullScreenOnNarrow ? {regular: 'anchored', narrow: 'fullscreen'} : undefined,
    'anchored',
  )

  const preventBubbling =
    (customOnKeyDown: KeyboardEventHandler<HTMLDivElement> | undefined) =>
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // skip if a TextInput has focus
      customOnKeyDown?.(event)

      const activeElement = document.activeElement as HTMLElement
      if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') return

      // skip if used with modifier to preserve shortcuts like ⌘ + F
      const hasModifier = event.ctrlKey || event.altKey || event.metaKey
      if (hasModifier) return

      // skip if it's not a alphabet key
      if (!isAlphabetKey(event.nativeEvent as KeyboardEvent)) return

      // if this is a typeahead event, don't propagate outside of menu
      event.stopPropagation()
    }

  return (
    <>
      <AnchoredOverlay
        renderAnchor={renderMenuAnchor}
        anchorRef={anchorRef}
        align={align}
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
            /* override AnchoredOverlay position */
            transform: variant === 'modal' ? 'translate(-50%, -50%)' : undefined,
            // set maxHeight based on calculated availablePanelHeight when keyboard is visible
            ...(isKeyboardVisible
              ? {
                  maxHeight: availablePanelHeight !== undefined ? `${availablePanelHeight}px` : 'auto',
                }
              : {}),
          } as React.CSSProperties,
          onKeyDown: usingRemoveActiveDescendant ? preventBubbling(overlayProps?.onKeyDown) : overlayProps?.onKeyDown,
        }}
        focusTrapSettings={focusTrapSettings}
        focusZoneSettings={focusZoneSettings}
        height={height}
        width={width}
        anchorId={id}
        variant={usingFullScreenOnNarrow ? {regular: 'anchored', narrow: 'fullscreen'} : undefined}
        pinPosition={!height}
        className={classes.Overlay}
        displayCloseButton={showXCloseIcon}
        closeButtonProps={{'aria-label': 'Cancel and close'}}
      >
        <div className={classes.Wrapper} data-variant={variant}>
          <div className={classes.Header} data-variant={currentResponsiveVariant}>
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
            {/* AnchoredOverlay displays the close button on narrow screens */}
            {variant === 'modal' && !isNarrowScreenSize ? (
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
            <div ref={noticeRef}>
              <Banner
                variant={notice.variant === 'error' ? 'critical' : notice.variant}
                description={notice.text}
                title="Notice"
                hideTitle
                className={classes.Notice}
                layout="compact"
              />
            </div>
          )}
          <FilteredActionList
            filterValue={filterValue}
            onFilterChange={onFilterChange}
            onListContainerRefChanged={onListContainerRefChanged}
            onInputRefChanged={onInputRefChanged}
            placeholderText={placeholderText}
            {...listProps}
            variant={listProps.groupMetadata?.length ? 'horizontal-inset' : 'inset'}
            role="listbox"
            // browsers give aria-labelledby precedence over aria-label so we need to make sure
            // we don't accidentally override props.aria-label
            aria-labelledby={listProps['aria-label'] ? undefined : titleId}
            aria-multiselectable={isMultiSelectVariant(selected) ? 'true' : 'false'}
            selectionVariant={isSingleSelectModal ? 'radio' : isMultiSelectVariant(selected) ? 'multiple' : 'single'}
            items={itemsToRender}
            textInputProps={extendedTextInputProps}
            loading={loading || (isLoading && !message)}
            loadingType={loadingType()}
            onSelectAllChange={showSelectAll ? handleSelectAllChange : undefined}
            // hack because the deprecated ActionList does not support this prop
            message={getMessage()}
            messageText={{
              title: message?.title || EMPTY_MESSAGE.title,
              description:
                typeof message?.body === 'string'
                  ? message.body
                  : EMPTY_MESSAGE.description || EMPTY_MESSAGE.description,
            }}
            fullScreenOnNarrow={usingFullScreenOnNarrow}
            className={clsx(className, classes.FilteredActionList)}
          />
          {footer ? (
            <div className={classes.Footer}>{footer}</div>
          ) : renderFooter ? (
            <div
              data-display-footer={displayFooter}
              data-stretch-secondary-action={stretchSecondaryAction}
              data-stretch-save-button={stretchSaveButton}
              className={clsx(classes.Footer, classes.ResponsiveFooter)}
            >
              <div data-stretch-secondary-action={stretchSecondaryAction} className={classes.SecondaryAction}>
                {secondaryAction}
              </div>
              {showPermanentCancelSaveButtons || showResponsiveCancelSaveButtons ? (
                <div
                  data-stretch-save-button={stretchSaveButton}
                  className={clsx(classes.CancelSaveButtons, {
                    [classes.ResponsiveSaveButton]: showResponsiveCancelSaveButtons,
                  })}
                >
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
                    block={onCancel === undefined}
                    variant="primary"
                    size="medium"
                    onClick={() => {
                      if (isSingleSelectModal) {
                        const singleSelectOnChange = onSelectedChange as SelectPanelSingleSelection['onSelectedChange']
                        singleSelectOnChange(intermediateSelected)
                      }
                      onClose(variant === 'modal' ? 'selection' : 'click-outside')
                    }}
                  >
                    Save
                  </Button>
                </div>
              ) : null}
              {showResponsiveSaveAndCloseButton ? (
                <div className={classes.ResponsiveSaveButton} data-stretch-save-button={stretchSaveButton}>
                  <Button
                    block
                    variant="primary"
                    size="medium"
                    onClick={() => {
                      onClose('click-outside')
                    }}
                  >
                    Save and close
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </AnchoredOverlay>
      {variant === 'modal' && open ? <div className={classes.Backdrop} /> : null}
    </>
  )
}

const SecondaryButton: React.FC<ButtonProps> = props => {
  return (
    <Button block {...props}>
      {props.children}
    </Button>
  )
}

const SecondaryLink: React.FC<LinkButtonProps & ButtonProps> = props => {
  return (
    <LinkButton {...props} variant="invisible" block>
      {props.children}
    </LinkButton>
  )
}

export const SelectPanel = Object.assign(Panel, {
  SecondaryActionButton: SecondaryButton,
  SecondaryActionLink: SecondaryLink,
})
