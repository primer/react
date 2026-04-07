import {announceFromElement} from '@primer/live-region-element'
import {debounce} from '@github/mini-throttle'
import type React from 'react'
import {useEffect, useRef} from 'react'

import type {FilteredActionListProps} from '../FilteredActionList'
import {LONG_DELAY_MS, announceLoading, toSelectedItemArray, type SelectPanelProps} from './SelectPanel.shared'
import type {SelectPanelNextAction} from './SelectPanelNext.state'

const KEYBOARD_VISIBILITY_THRESHOLD = 10

export function useFullscreenBodyLock({
  isNarrowScreenSize,
  open,
  usingFullScreenOnNarrow,
}: {
  isNarrowScreenSize: boolean
  open: boolean
  usingFullScreenOnNarrow: boolean
}) {
  useEffect(() => {
    if (!open || !isNarrowScreenSize || !usingFullScreenOnNarrow) {
      return
    }

    const bodyOverflowStyle = document.body.style.overflow || ''
    if (bodyOverflowStyle === 'hidden') {
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = bodyOverflowStyle
    }
  }, [isNarrowScreenSize, open, usingFullScreenOnNarrow])
}

export function useKeyboardViewport({
  dispatch,
  isNarrowScreenSize,
  open,
}: {
  dispatch: React.Dispatch<SelectPanelNextAction>
  isNarrowScreenSize: boolean
  open: boolean
}) {
  const initialHeightRef = useRef(0)
  const initialScaleRef = useRef(1)

  useEffect(() => {
    if (!window.visualViewport || !open || !isNarrowScreenSize) {
      dispatch({type: 'set-keyboard-visibility', keyboardVisible: false})
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

      dispatch({
        type: 'set-keyboard-visibility',
        keyboardVisible,
        availablePanelHeight: keyboardVisible ? currentHeight : undefined,
      })
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
      dispatch({type: 'set-keyboard-visibility', keyboardVisible: false})
    }
  }, [dispatch, isNarrowScreenSize, open])
}

export function useNoticeAnnouncement({
  notice,
  noticeRef,
  open,
}: {
  notice: SelectPanelProps['notice']
  noticeRef: React.RefObject<HTMLDivElement | null>
  open: boolean
}) {
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
  }, [notice, noticeRef, open])
}

export function useSyncSelectPanelNextState({
  dispatch,
  open,
  selected,
}: {
  dispatch: React.Dispatch<SelectPanelNextAction>
  open: boolean
  selected: SelectPanelProps['selected']
}) {
  useEffect(() => {
    dispatch({
      type: 'sync-open-state',
      selectedItems: toSelectedItemArray(selected),
    })
  }, [dispatch, open, selected])
}

export function useMarkLoadedOnItems({
  dispatch,
  itemsLength,
  clearPendingLoadingAnnouncement,
}: {
  dispatch: React.Dispatch<SelectPanelNextAction>
  itemsLength: number
  clearPendingLoadingAnnouncement: () => void
}) {
  useEffect(() => {
    if (itemsLength > 0) {
      dispatch({type: 'mark-loaded'})
      clearPendingLoadingAnnouncement()
    }
  }, [clearPendingLoadingAnnouncement, dispatch, itemsLength])
}

export function useFocusInputOnOpen({
  inputRef,
  open,
}: {
  inputRef: React.RefObject<HTMLInputElement | null> | null
  open: boolean
}) {
  useEffect(() => {
    if (!inputRef?.current || !open) {
      return
    }

    inputRef.current.focus()
  }, [inputRef, open])
}

export function useManagedLoadingAnnouncement({
  loading,
  loadingManagedInternally,
  clearPendingLoadingAnnouncement,
  scheduleLoadingAnnouncement,
}: {
  loading: SelectPanelProps['loading']
  loadingManagedInternally: boolean
  clearPendingLoadingAnnouncement: () => void
  scheduleLoadingAnnouncement: (callback: () => void, delayMs: number) => number
}) {
  useEffect(() => {
    if (loadingManagedInternally) {
      return
    }

    if (!loading) {
      clearPendingLoadingAnnouncement()
      return
    }

    scheduleLoadingAnnouncement(() => {
      announceLoading()
    }, LONG_DELAY_MS)

    return () => {
      clearPendingLoadingAnnouncement()
    }
  }, [clearPendingLoadingAnnouncement, loading, loadingManagedInternally, scheduleLoadingAnnouncement])
}

export function usePopulateOnFirstOpen({
  dataLoadedOnce,
  filterValue,
  itemsLength,
  loadingManagedInternally,
  onFilterChange,
  open,
}: {
  dataLoadedOnce: boolean
  filterValue: string
  itemsLength: number
  loadingManagedInternally: boolean
  onFilterChange: FilteredActionListProps['onFilterChange']
  open: boolean
}) {
  useEffect(() => {
    if (!loadingManagedInternally || dataLoadedOnce || !open || itemsLength > 0) {
      return
    }

    onFilterChange(filterValue, null)
  }, [dataLoadedOnce, filterValue, itemsLength, loadingManagedInternally, onFilterChange, open])
}
