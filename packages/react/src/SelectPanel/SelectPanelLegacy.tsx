import {SearchIcon, XIcon} from '@primer/octicons-react'
import {announceFromElement} from '@primer/live-region-element'
import {debounce} from '@github/mini-throttle'
import {clsx} from 'clsx'
import React, {useCallback, useEffect, useMemo, useRef, useState, type JSX} from 'react'

import {AnchoredOverlay} from '../AnchoredOverlay'
import type {AnchoredOverlayProps} from '../AnchoredOverlay'
import {Banner} from '../Banner'
import {Button, IconButton} from '../Button'
import {useFeatureFlag} from '../FeatureFlags'
import {FilteredActionList} from '../FilteredActionList'
import type {FilteredActionListProps, ItemInput, ItemProps} from '../FilteredActionList'
import {FilteredActionListLoadingTypes} from '../FilteredActionList/FilteredActionListLoaders'
import {useFormControlContext} from '../FormControl/_FormControlContext'
import Heading from '../Heading'
import {useProvidedRefOrCreate} from '../hooks'
import {useId} from '../hooks/useId'
import {isAlphabetKey} from '../hooks/useMnemonics'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import {useResponsiveValue} from '../hooks/useResponsiveValue'
import useSafeTimeout from '../hooks/useSafeTimeout'
import classes from './SelectPanel.module.css'
import {SelectPanelMessage} from './SelectPanelMessage'
import {
  DefaultEmptyMessage,
  LONG_DELAY_MS,
  announceLoading,
  areItemsEqual,
  closeButtonProps,
  defaultRenderAnchor,
  doesItemsIncludeItem,
  focusZoneSettings,
  isMultiSelectVariant,
  type SelectPanelMultiSelection,
  type SelectPanelProps,
  type SelectPanelSingleSelection,
} from './SelectPanel.shared'

const EMPTY_MESSAGE = {
  title: 'No items available',
  description: '',
}

export function SelectPanelLegacy({
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
  focusPrependedElements,
  virtualized,
  displayInViewport,
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
  const [inputRef, setInputRef] = React.useState<React.RefObject<HTMLInputElement | null> | null>(null)
  const [needsNoItemsAnnouncement, setNeedsNoItemsAnnouncement] = useState(false)
  const isNarrowScreenSize = useResponsiveValue({narrow: true, regular: false, wide: false}, false)
  const [selectedOnSort, setSelectedOnSort] = useState<ItemInput[]>([])
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
  const {isReferenced, labelId} = useFormControlContext()
  const selectedValueId = id ? `${id}-selected-value` : undefined

  const isSingleSelectModal = variant === 'modal' && !isMultiSelectVariant(selected)
  const [intermediateSelected, setIntermediateSelected] = useState<ItemInput | undefined>(
    isSingleSelectModal ? selected : undefined,
  )

  useEffect(() => {
    setIntermediateSelected(isSingleSelectModal ? selected : undefined)
  }, [isSingleSelectModal, open, selected])

  const onListContainerRefChanged: FilteredActionListProps['onListContainerRefChanged'] = useCallback(
    (node: HTMLElement | null) => {
      if (!node && needsNoItemsAnnouncement) {
        setNeedsNoItemsAnnouncement(false)
      }
    },
    [needsNoItemsAnnouncement],
  )

  const onInputRefChanged = useCallback((ref: React.RefObject<HTMLInputElement | null>) => {
    setInputRef(ref)
  }, [])

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
    (value, event) => {
      if (loadingManagedInternally) {
        if (loadingDelayTimeoutId.current) {
          safeClearTimeout(loadingDelayTimeoutId.current)
        }

        const shouldSkipInitialInternalLoading =
          externalFilterValue !== undefined && !dataLoadedOnce && items.length === 0

        if (dataLoadedOnce) {
          loadingDelayTimeoutId.current = safeSetTimeout(() => {
            setIsLoading(true)
            announceLoading()
          }, LONG_DELAY_MS)
        } else if (!shouldSkipInitialInternalLoading) {
          if (items.length === 0) {
            setIsLoading(true)
          }

          loadingDelayTimeoutId.current = safeSetTimeout(() => {
            announceLoading()
          }, LONG_DELAY_MS)
        }
      }

      externalOnFilterChange(value, event)
      setInternalFilterValue(value)
      if (!value) {
        resetSort()
      }
    },
    [
      externalFilterValue,
      dataLoadedOnce,
      externalOnFilterChange,
      items.length,
      loadingManagedInternally,
      resetSort,
      safeClearTimeout,
      safeSetTimeout,
      setInternalFilterValue,
    ],
  )

  const itemsInViewSet = useMemo(() => {
    const set = new Set<string | number | ItemInput>()

    for (const item of items) {
      if (item.id !== undefined) {
        set.add(item.id)
      } else {
        set.add(item)
      }
    }

    return set
  }, [items])

  const handleSelectAllChange = useCallback(
    (checked: boolean) => {
      if (!isMultiSelectVariant(selected)) {
        return
      }

      const multiSelectOnChange = onSelectedChange as SelectPanelMultiSelection['onSelectedChange']
      const selectedItemsNotInFilteredView = selected.filter(selectedItem => {
        if (selectedItem.id !== undefined) {
          return !itemsInViewSet.has(selectedItem.id)
        }

        return !itemsInViewSet.has(selectedItem)
      })

      if (checked) {
        multiSelectOnChange([...selectedItemsNotInFilteredView, ...items])
      } else {
        multiSelectOnChange(selectedItemsNotInFilteredView)
      }
    },
    [items, itemsInViewSet, onSelectedChange, selected],
  )

  useEffect(() => {
    if (open && isNarrowScreenSize && usingFullScreenOnNarrow) {
      const bodyOverflowStyle = document.body.style.overflow || ''
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
    if (open && items.length === 0 && !(isLoading || loading)) {
      setNeedsNoItemsAnnouncement(true)
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  useEffect(() => {
    if (inputRef?.current && open) {
      inputRef.current.focus()
    }
  }, [inputRef, open])

  useEffect(() => {
    if (!loadingManagedExternally) {
      return
    }

    if (isLoading) {
      loadingDelayTimeoutId.current = safeSetTimeout(() => {
        announceLoading()
      }, LONG_DELAY_MS)
    } else if (loadingDelayTimeoutId.current) {
      safeClearTimeout(loadingDelayTimeoutId.current)
    }
  }, [isLoading, loadingManagedExternally, safeClearTimeout, safeSetTimeout])

  useEffect(() => {
    if (loadingManagedExternally || dataLoadedOnce || !open || items.length > 0) {
      return
    }

    onFilterChange(filterValue, null)
  }, [dataLoadedOnce, filterValue, items.length, loadingManagedExternally, onFilterChange, open])

  useEffect(() => {
    if (!window.visualViewport || !open || !isNarrowScreenSize) {
      return
    }

    initialHeightRef.current = window.visualViewport.height
    initialScaleRef.current = window.visualViewport.scale

    const handleViewportChange = debounce(() => {
      if (!window.visualViewport) {
        return
      }

      const isZooming = window.visualViewport.scale !== initialScaleRef.current
      if (isZooming) {
        return
      }

      const currentHeight = window.visualViewport.height
      const keyboardVisible = initialHeightRef.current - currentHeight > KEYBOARD_VISIBILITY_THRESHOLD
      setIsKeyboardVisible(keyboardVisible)
      setAvailablePanelHeight(keyboardVisible ? currentHeight : undefined)
    }, 100)

    // Using visualViewport to track the virtual keyboard requires these listeners.
    // eslint-disable-next-line github/prefer-observers
    window.visualViewport.addEventListener('resize', handleViewportChange)
    // eslint-disable-next-line github/prefer-observers
    window.visualViewport.addEventListener('scroll', handleViewportChange)

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange)
        window.visualViewport.removeEventListener('scroll', handleViewportChange)
      }
      handleViewportChange.cancel()
    }
  }, [isNarrowScreenSize, open])

  useEffect(() => {
    const announceNotice = async () => {
      if (!noticeRef.current) {
        return
      }

      const liveRegion = document.querySelector('live-region')
      liveRegion?.clear()

      await announceFromElement(noticeRef.current, {
        from: liveRegion || undefined,
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
    [onCancel, onCancelRequested, onOpenChange, variant],
  )

  const renderMenuAnchor = useMemo(() => {
    if (renderAnchor === null) {
      return null
    }

    const selectedItems = Array.isArray(selected) ? selected : [...(selected ? [selected] : [])]
    const selectedValueText = selectedItems.length ? selectedItems.map(item => item.text).join(', ') : placeholder
    const shouldAutoWireLabel = isReferenced === false && Boolean(labelId) && Boolean(selectedValueId)

    return <T extends React.HTMLAttributes<HTMLElement>>(props: T) => {
      return renderAnchor({
        ...props,
        ...(shouldAutoWireLabel
          ? {
              'aria-labelledby': [labelId, selectedValueId].filter(Boolean).join(' '),
            }
          : {}),
        children: shouldAutoWireLabel ? <span id={selectedValueId}>{selectedValueText}</span> : selectedValueText,
      })
    }
  }, [isReferenced, labelId, placeholder, renderAnchor, selected, selectedValueId])

  const selectedItemsSet = useMemo(() => {
    const set = new Set<string | number | ItemInput>()

    if (isMultiSelectVariant(selected)) {
      for (const item of selected) {
        if (item.id !== undefined) {
          set.add(item.id)
        } else {
          set.add(item)
        }
      }
    }

    return set
  }, [selected])

  const isItemCurrentlySelected = useCallback(
    (item: ItemInput) => {
      if (isMultiSelectVariant(selected)) {
        if (item.id !== undefined) {
          return selectedItemsSet.has(item.id)
        }

        return selectedItemsSet.has(item)
      }

      if (isSingleSelectModal) {
        return intermediateSelected?.id !== undefined
          ? intermediateSelected.id === item.id
          : intermediateSelected === item
      }

      return selected?.id !== undefined ? selected.id === item.id : selected === item
    },
    [intermediateSelected, isSingleSelectModal, selected, selectedItemsSet],
  )

  const itemsToRender = useMemo(() => {
    const selectedOnSortSet = new Set<string | number | ItemInput>()
    for (const item of selectedOnSort) {
      if (item.id !== undefined) {
        selectedOnSortSet.add(item.id)
      } else {
        selectedOnSortSet.add(item)
      }
    }

    const isSelectedForSort = (item: ItemProps) => {
      if (item.id !== undefined) {
        return selectedOnSortSet.has(item.id)
      }

      return selectedOnSortSet.has(item as unknown as ItemInput)
    }

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
                setIntermediateSelected(undefined)
              } else {
                setIntermediateSelected(item)
              }
              return
            }

            const singleSelectOnChange = onSelectedChange as SelectPanelSingleSelection['onSelectedChange']
            singleSelectOnChange(item === selected ? undefined : item)
            onClose('selection')
          },
        } as ItemProps
      })
      .sort((itemA, itemB) => {
        if (!shouldOrderSelectedFirst) {
          return 0
        }

        const itemASelected = isSelectedForSort(itemA)
        const itemBSelected = isSelectedForSort(itemB)

        if (itemASelected && !itemBSelected) {
          return -1
        }

        if (!itemASelected && itemBSelected) {
          return 1
        }

        return 0
      })
  }, [
    intermediateSelected,
    isItemCurrentlySelected,
    isSingleSelectModal,
    items,
    onClose,
    onSelectedChange,
    selected,
    selectedOnSort,
    shouldOrderSelectedFirst,
  ])

  const prevItemsRef = useRef(items)
  useEffect(() => {
    if (prevItemsRef.current !== items) {
      if (prevItemsRef.current.length === 0 && items.length > 0) {
        resetSort()
      }
      prevItemsRef.current = items
    }
  }, [items, resetSort])

  const prevOpenRef = useRef(open)
  useEffect(() => {
    if (prevOpenRef.current !== open) {
      resetSort()
      prevOpenRef.current = open
    }
  }, [open, resetSort])

  const focusTrapSettings = useMemo(() => ({initialFocusRef: inputRef || undefined}), [inputRef])

  const extendedTextInputProps = useMemo(() => {
    return {
      className: classes.TextInput,
      contrast: true,
      leadingVisual: SearchIcon,
      'aria-label': inputLabel,
      ...textInputProps,
    }
  }, [inputLabel, textInputProps])

  const loadingType = () => {
    if (dataLoadedOnce) {
      return FilteredActionListLoadingTypes.input
    }

    return initialLoadingType === 'spinner'
      ? FilteredActionListLoadingTypes.bodySpinner
      : FilteredActionListLoadingTypes.bodySkeleton
  }

  const getMessage = () => {
    if (items.length === 0 && !message) {
      return DefaultEmptyMessage
    }

    if (message) {
      return (
        <SelectPanelMessage title={message.title} variant={message.variant} icon={message.icon} action={message.action}>
          {message.body}
        </SelectPanelMessage>
      )
    }

    return undefined
  }

  const showPermanentCancelSaveButtons = variant === 'modal'
  const showResponsiveCancelSaveButtons =
    variant !== 'modal' && usingFullScreenOnNarrow && isMultiSelectVariant(selected) && onCancel !== undefined
  const showResponsiveSaveAndCloseButton =
    variant !== 'modal' && usingFullScreenOnNarrow && isMultiSelectVariant(selected) && onCancel === undefined

  const renderFooter =
    secondaryAction !== undefined ||
    showPermanentCancelSaveButtons ||
    showResponsiveSaveAndCloseButton ||
    showResponsiveCancelSaveButtons

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

  const showXCloseIcon = (onCancel !== undefined || !isMultiSelectVariant(selected)) && usingFullScreenOnNarrow

  const shouldShowInitialControlledEmptyState =
    externalFilterValue !== undefined && !dataLoadedOnce && items.length === 0

  const currentResponsiveVariant = useResponsiveValue(
    usingFullScreenOnNarrow ? {regular: 'anchored', narrow: 'fullscreen'} : undefined,
    'anchored',
  )

  const preventBubbling = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      overlayProps?.onKeyDown?.(event as unknown as React.KeyboardEvent<HTMLDivElement>)

      const activeElement = document.activeElement as HTMLElement
      if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        return
      }

      const hasModifier = event.ctrlKey || event.altKey || event.metaKey
      if (hasModifier) {
        return
      }

      if (event.key !== '/' && !isAlphabetKey(event.nativeEvent as KeyboardEvent)) {
        return
      }

      event.stopPropagation()
    },
    [overlayProps],
  )

  const mergedOverlayProps = useMemo(() => {
    return {
      role: 'dialog' as const,
      'aria-labelledby': titleId,
      'aria-describedby': subtitle ? subtitleId : undefined,
      ...overlayProps,
      ...(variant === 'modal'
        ? {
            top: '50vh' as const,
            left: '50vw' as const,
            anchorSide: undefined,
          }
        : {}),
      style: {
        transform: variant === 'modal' ? 'translate(-50%, -50%)' : undefined,
        ...(isKeyboardVisible
          ? {
              maxHeight: availablePanelHeight !== undefined ? `${availablePanelHeight}px` : 'auto',
            }
          : {}),
      } as React.CSSProperties,
      onKeyDown: preventBubbling,
    }
  }, [availablePanelHeight, isKeyboardVisible, overlayProps, preventBubbling, subtitle, subtitleId, titleId, variant])

  return (
    <>
      <AnchoredOverlay
        renderAnchor={renderMenuAnchor}
        anchorRef={anchorRef}
        align={align}
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        overlayProps={mergedOverlayProps}
        focusTrapSettings={focusTrapSettings}
        focusZoneSettings={focusZoneSettings}
        height={height}
        width={width}
        anchorId={id}
        variant={usingFullScreenOnNarrow ? {regular: 'anchored', narrow: 'fullscreen'} : undefined}
        pinPosition={!height}
        className={classes.Overlay}
        displayCloseButton={showXCloseIcon}
        closeButtonProps={closeButtonProps}
        displayInViewport={displayInViewport}
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
          {notice ? (
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
          ) : null}
          <FilteredActionList
            filterValue={filterValue}
            onFilterChange={onFilterChange}
            onListContainerRefChanged={onListContainerRefChanged}
            onInputRefChanged={onInputRefChanged}
            placeholderText={placeholderText}
            {...listProps}
            variant={listProps.groupMetadata?.length ? 'horizontal-inset' : 'inset'}
            role="listbox"
            aria-labelledby={listProps['aria-label'] ? undefined : titleId}
            aria-multiselectable={isMultiSelectVariant(selected) ? 'true' : 'false'}
            selectionVariant={isSingleSelectModal ? 'radio' : isMultiSelectVariant(selected) ? 'multiple' : 'single'}
            items={itemsToRender}
            textInputProps={extendedTextInputProps}
            loading={loading || (isLoading && !message && !shouldShowInitialControlledEmptyState)}
            loadingType={loadingType()}
            onSelectAllChange={showSelectAll ? handleSelectAllChange : undefined}
            message={getMessage()}
            messageText={{
              title: message?.title || EMPTY_MESSAGE.title,
              description: typeof message?.body === 'string' ? message.body : EMPTY_MESSAGE.description,
            }}
            fullScreenOnNarrow={usingFullScreenOnNarrow}
            className={clsx(className, classes.FilteredActionList)}
            focusPrependedElements={focusPrependedElements}
            virtualized={virtualized}
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
