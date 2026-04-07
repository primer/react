import {SearchIcon} from '@primer/octicons-react'
import type React from 'react'
import {useCallback, useEffect, useMemo, useReducer, useRef, useState, type JSX} from 'react'

import type {AnchoredOverlayProps} from '../AnchoredOverlay'
import {useFeatureFlag} from '../FeatureFlags'
import type {FilteredActionListProps} from '../FilteredActionList'
import {FilteredActionListLoadingTypes} from '../FilteredActionList/FilteredActionListLoaders'
import {useFormControlContext} from '../FormControl/_FormControlContext'
import {useProvidedRefOrCreate} from '../hooks'
import {useId} from '../hooks/useId'
import {isAlphabetKey} from '../hooks/useMnemonics'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import {useResponsiveValue} from '../hooks/useResponsiveValue'
import useSafeTimeout from '../hooks/useSafeTimeout'
import classes from './SelectPanel.module.css'
import {SelectPanelNextFrame} from './SelectPanelNextFrame'
import {SelectPanelMessage} from './SelectPanelMessage'
import {
  DefaultEmptyMessage,
  LONG_DELAY_MS,
  announceLoading,
  closeButtonProps,
  defaultRenderAnchor,
  focusZoneSettings,
  toSelectedItemArray,
  type SelectPanelNextProps,
} from './SelectPanel.shared'
import {
  useFocusInputOnOpen,
  useFullscreenBodyLock,
  useKeyboardViewport,
  useManagedLoadingAnnouncement,
  useMarkLoadedOnItems,
  useNoticeAnnouncement,
  usePopulateOnFirstOpen,
  useSyncSelectPanelNextState,
} from './SelectPanelNext.hooks'
import {getInitialSingleIntermediateSelected, getSyncedSingleIntermediateSelected} from './SelectPanelNext.single.state'
import {getItemsInViewSet} from './SelectPanelNext.multi.utils'
import {createInitialSelectPanelNextState, selectPanelNextReducer} from './SelectPanelNext.state'
import {getFooterLayout} from './SelectPanelNext.shared.utils'
import {getSelectPanelNextMultiModeConfig, handleSelectAllChange} from './SelectPanelNextMulti'
import {getSelectPanelNextSingleModeConfig, handleSingleModeSave} from './SelectPanelNextSingle'

export function SelectPanelNext({
  mode,
  open,
  onOpenChange,
  renderAnchor = defaultRenderAnchor,
  anchorRef: externalAnchorRef,
  placeholder,
  placeholderText = 'Filter items',
  inputLabel = placeholderText,
  selected,
  title = mode === 'multi' ? 'Select items' : 'Select an item',
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
  onInputRefChanged: externalOnInputRefChanged,
  onListContainerRefChanged: externalOnListContainerRefChanged,
  ...listProps
}: SelectPanelNextProps): JSX.Element {
  const titleId = useId()
  const subtitleId = useId()
  const [filterValue, setInternalFilterValue] = useProvidedStateOrCreate(externalFilterValue, undefined, '')
  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()
  const loadingDelayTimeoutId = useRef<number | null>(null)
  const loadingManagedInternally = loading === undefined
  const isNarrowScreenSize = useResponsiveValue({narrow: true, regular: false, wide: false}, false)
  const noticeRef = useRef<HTMLDivElement>(null)
  const [inputRef, setInputRef] = useState<React.RefObject<HTMLInputElement | null> | null>(null)
  const isSingleSelectModal = variant === 'modal' && mode === 'single'
  const [state, dispatch] = useReducer(selectPanelNextReducer, {selected}, createInitialSelectPanelNextState)
  const [intermediateSelected, setIntermediateSelected] = useState(() => {
    if (mode !== 'single') {
      return undefined
    }

    return getInitialSingleIntermediateSelected({
      isSingleSelectModal,
      selected,
    })
  })

  const featureFlagFullScreenOnNarrow = useFeatureFlag('primer_react_select_panel_fullscreen_on_narrow')
  const usingFullScreenOnNarrow = disableFullscreenOnNarrow ? false : featureFlagFullScreenOnNarrow
  const shouldOrderSelectedFirst =
    useFeatureFlag('primer_react_select_panel_order_selected_at_top') && showSelectedOptionsFirst
  const {isReferenced, labelId} = useFormControlContext()
  const selectedValueId = id ? `${id}-selected-value` : undefined
  const responsiveOverlayVariant: AnchoredOverlayProps['variant'] = usingFullScreenOnNarrow
    ? {regular: 'anchored', narrow: 'fullscreen'}
    : undefined
  const currentResponsiveVariant = useResponsiveValue(responsiveOverlayVariant, 'anchored')
  const clearPendingLoadingAnnouncement = useCallback(() => {
    if (loadingDelayTimeoutId.current) {
      safeClearTimeout(loadingDelayTimeoutId.current)
    }
  }, [safeClearTimeout])
  const scheduleLoadingAnnouncement = useCallback(
    (callback: () => void, delayMs: number) => {
      loadingDelayTimeoutId.current = safeSetTimeout(callback, delayMs)
      return loadingDelayTimeoutId.current
    },
    [safeSetTimeout],
  )

  useFullscreenBodyLock({isNarrowScreenSize, open, usingFullScreenOnNarrow})
  useKeyboardViewport({dispatch, isNarrowScreenSize, open})
  useNoticeAnnouncement({notice, noticeRef, open})
  useSyncSelectPanelNextState({dispatch, open, selected})
  useMarkLoadedOnItems({
    clearPendingLoadingAnnouncement,
    dispatch,
    itemsLength: items.length,
  })
  useFocusInputOnOpen({inputRef, open})
  useManagedLoadingAnnouncement({
    clearPendingLoadingAnnouncement,
    loading,
    loadingManagedInternally,
    scheduleLoadingAnnouncement,
  })

  useEffect(() => {
    if (mode !== 'single') {
      return
    }

    setIntermediateSelected(
      getSyncedSingleIntermediateSelected({
        isSingleSelectModal,
        selected,
      }),
    )
  }, [isSingleSelectModal, mode, open, selected])

  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)

  const onInputRefChanged = useCallback(
    (ref: React.RefObject<HTMLInputElement | null>) => {
      setInputRef(ref)
      externalOnInputRefChanged?.(ref)
    },
    [externalOnInputRefChanged],
  )

  const onListContainerRefChanged = useCallback(
    (node: HTMLElement | null) => {
      externalOnListContainerRefChanged?.(node)
    },
    [externalOnListContainerRefChanged],
  )

  const resetSort = useCallback(() => {
    dispatch({type: 'reset-sort', selectedItems: toSelectedItemArray(selected)})
  }, [selected])

  const onFilterChange: FilteredActionListProps['onFilterChange'] = useCallback(
    (value, event) => {
      if (loadingManagedInternally) {
        if (loadingDelayTimeoutId.current) {
          clearPendingLoadingAnnouncement()
        }

        const shouldSkipInitialInternalLoading =
          externalFilterValue !== undefined && !state.dataLoadedOnce && items.length === 0

        if (state.dataLoadedOnce) {
          scheduleLoadingAnnouncement(() => {
            dispatch({type: 'set-internal-loading', value: true})
            announceLoading()
          }, LONG_DELAY_MS)
        } else if (!shouldSkipInitialInternalLoading) {
          if (items.length === 0) {
            dispatch({type: 'set-internal-loading', value: true})
          }

          scheduleLoadingAnnouncement(() => {
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
      externalOnFilterChange,
      items.length,
      loadingManagedInternally,
      resetSort,
      clearPendingLoadingAnnouncement,
      scheduleLoadingAnnouncement,
      setInternalFilterValue,
      state.dataLoadedOnce,
    ],
  )
  usePopulateOnFirstOpen({
    dataLoadedOnce: state.dataLoadedOnce,
    filterValue,
    itemsLength: items.length,
    loadingManagedInternally,
    onFilterChange,
    open,
  })

  const itemsInViewSet = useMemo(() => getItemsInViewSet(items), [items])

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

    const selectedItems = toSelectedItemArray(selected)
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

  const modeConfig = useMemo(() => {
    if (mode === 'multi') {
      return getSelectPanelNextMultiModeConfig({
        items,
        onSelectedChange,
        selected,
        selectedOnSort: state.selectedOnSort,
        shouldOrderSelectedFirst,
      })
    }

    return getSelectPanelNextSingleModeConfig({
      intermediateSelected,
      isSingleSelectModal,
      items,
      onIntermediateSelectedChange: setIntermediateSelected,
      onSelectedChange,
      onSelectionClose: () => {
        onClose('selection')
      },
      selected,
      selectedOnSort: state.selectedOnSort,
      shouldOrderSelectedFirst,
    })
  }, [
    intermediateSelected,
    isSingleSelectModal,
    items,
    mode,
    onClose,
    onSelectedChange,
    selected,
    shouldOrderSelectedFirst,
    state.selectedOnSort,
  ])

  const onSelectAllChange = useCallback(
    (checked: boolean) => {
      if (mode !== 'multi') {
        return
      }

      handleSelectAllChange({
        checked,
        items,
        itemsInViewSet,
        onSelectedChange,
        selected,
      })
    },
    [items, itemsInViewSet, mode, onSelectedChange, selected],
  )

  const prevItemsLengthRef = useRef(items.length)
  useEffect(() => {
    if (prevItemsLengthRef.current === 0 && items.length > 0) {
      resetSort()
    }

    prevItemsLengthRef.current = items.length
  }, [items.length, resetSort])

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

  const loadingType = state.dataLoadedOnce
    ? FilteredActionListLoadingTypes.input
    : initialLoadingType === 'spinner'
      ? FilteredActionListLoadingTypes.bodySpinner
      : FilteredActionListLoadingTypes.bodySkeleton

  const renderedMessage = useMemo(() => {
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
  }, [items.length, message])

  const footerLayout = getFooterLayout({
    footer,
    hasOnCancel: onCancel !== undefined,
    hasSecondaryAction: secondaryAction !== undefined,
    isMultiSelect: modeConfig.isMultiSelect,
    usingFullScreenOnNarrow,
    variant,
  })

  const showXCloseIcon = (onCancel !== undefined || !modeConfig.isMultiSelect) && usingFullScreenOnNarrow

  const shouldShowInitialControlledEmptyState =
    externalFilterValue !== undefined && !state.dataLoadedOnce && items.length === 0

  const onSave = useCallback(() => {
    if (mode === 'single') {
      handleSingleModeSave({
        intermediateSelected,
        isSingleSelectModal,
        onClose,
        onSelectedChange,
        variant,
      })
      return
    }

    onClose(variant === 'modal' ? 'selection' : 'click-outside')
  }, [intermediateSelected, isSingleSelectModal, mode, onClose, onSelectedChange, variant])

  const preventBubbling = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      overlayProps?.onKeyDown?.(event as unknown as React.KeyboardEvent<HTMLDivElement>)

      const activeElement = document.activeElement as HTMLElement
      if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        return
      }

      if (event.ctrlKey || event.altKey || event.metaKey) {
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
        ...(overlayProps?.style || {}),
        transform: variant === 'modal' ? 'translate(-50%, -50%)' : overlayProps?.style?.transform,
        ...(state.keyboardVisible
          ? {
              maxHeight: state.availablePanelHeight !== undefined ? `${state.availablePanelHeight}px` : 'auto',
            }
          : {}),
      } as React.CSSProperties,
      onKeyDown: preventBubbling,
    }
  }, [
    overlayProps,
    preventBubbling,
    state.availablePanelHeight,
    state.keyboardVisible,
    subtitle,
    subtitleId,
    titleId,
    variant,
  ])

  return (
    <SelectPanelNextFrame
      align={align}
      anchorId={id}
      anchorRef={anchorRef}
      className={className}
      closeButtonProps={closeButtonProps}
      currentResponsiveVariant={currentResponsiveVariant ?? 'anchored'}
      displayInViewport={displayInViewport}
      filterValue={filterValue}
      focusPrependedElements={focusPrependedElements}
      focusTrapSettings={focusTrapSettings}
      focusZoneSettings={focusZoneSettings}
      footer={footer}
      footerLayout={footerLayout}
      fullScreenOnNarrow={usingFullScreenOnNarrow}
      height={height}
      isNarrowScreenSize={isNarrowScreenSize}
      itemsToRender={modeConfig.itemsToRender}
      listProps={listProps}
      loading={Boolean(loading) || (state.internalLoading && !message && !shouldShowInitialControlledEmptyState)}
      loadingType={loadingType}
      mergedOverlayProps={mergedOverlayProps}
      message={message}
      notice={notice}
      noticeRef={noticeRef}
      onCancel={onCancel}
      onCancelRequested={onCancelRequested}
      onClose={onClose}
      onFilterChange={onFilterChange}
      onInputRefChanged={onInputRefChanged}
      onListContainerRefChanged={onListContainerRefChanged}
      onOpen={onOpen}
      onSave={onSave}
      onSelectAllChange={showSelectAll && modeConfig.isMultiSelect ? onSelectAllChange : undefined}
      open={open}
      placeholderText={placeholderText}
      renderAnchor={renderMenuAnchor}
      renderedMessage={renderedMessage}
      responsiveOverlayVariant={responsiveOverlayVariant}
      secondaryAction={secondaryAction}
      selectionVariant={modeConfig.selectionVariant}
      showXCloseIcon={showXCloseIcon}
      subtitle={subtitle}
      subtitleId={subtitleId}
      textInputProps={extendedTextInputProps}
      title={title}
      titleId={titleId}
      variant={variant}
      virtualized={virtualized}
      width={width}
    />
  )
}
