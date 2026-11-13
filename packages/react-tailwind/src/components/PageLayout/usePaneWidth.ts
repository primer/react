'use client'

import React from 'react'
import {useIsomorphicLayoutEffect} from '../../internal/useIsomorphicLayoutEffect'

export type PaneWidth = 'small' | 'medium' | 'large'
export type CustomWidthOptions = {min: `${number}px`; default: `${number}px`; max: `${number}px`}
export type PaneWidthValue = PaneWidth | CustomWidthOptions

export const defaultPaneWidth: Record<PaneWidth, number> = {small: 256, medium: 296, large: 320}
const regularPaneWidth: Record<PaneWidth, number> = {small: 240, medium: 256, large: 256}
const WIDE_PANE_BREAKPOINT = 1012
const MAX_WIDTH_DIFF_BREAKPOINT = 1280
const MAX_WIDTH_DIFF = 511
const WIDE_MAX_WIDTH_DIFF = 959

const subscribeToNothing = () => () => {}
const getServerIsWideViewport = () => true
const getPaneWindow = (paneRef: React.RefObject<HTMLElement | null>) =>
  paneRef.current?.ownerDocument.defaultView ?? (typeof window === 'undefined' ? undefined : window)
const subscribeToViewportResize = (viewport: Window, notify: () => void) => {
  // eslint-disable-next-line github/prefer-observers -- Viewport width is independent of document layout changes.
  viewport.addEventListener('resize', notify)
  return () => viewport.removeEventListener('resize', notify)
}

export const ARROW_KEY_STEP = 3
export const SSR_DEFAULT_MAX_WIDTH = 600
export const defaultFormatValueText = (value: number) => `Pane width ${value} pixels`

export const isPaneWidth = (value: PaneWidthValue): value is PaneWidth => typeof value === 'string'
export const isCustomWidthOptions = (value: PaneWidthValue): value is CustomWidthOptions => typeof value === 'object'
export const getDefaultPaneWidth = (value: PaneWidthValue) =>
  isPaneWidth(value) ? defaultPaneWidth[value] : Number.parseInt(value.default, 10)

const getResponsivePaneWidth = (value: PaneWidthValue, isWide: boolean) =>
  isPaneWidth(value) ? (isWide ? defaultPaneWidth[value] : regularPaneWidth[value]) : Number.parseInt(value.default, 10)

function getStoredPaneWidth(widthStorageKey: string, defaultWidth: number) {
  try {
    const stored = Number(window.localStorage.getItem(widthStorageKey))
    if (stored > 0) return stored
  } catch {
    // Storage may be unavailable (for example in private browsing).
  }
  return defaultWidth
}

export function updateAriaValues(
  handle: HTMLElement | null,
  values: {current?: number; min?: number; max?: number},
  formatValueText = defaultFormatValueText,
) {
  if (!handle) return
  if (values.min !== undefined) handle.setAttribute('aria-valuemin', String(values.min))
  if (values.max !== undefined) handle.setAttribute('aria-valuemax', String(values.max))
  if (values.current !== undefined) {
    handle.setAttribute('aria-valuenow', String(values.current))
    handle.setAttribute('aria-valuetext', formatValueText(values.current))
  }
}

export interface UsePaneWidthOptions {
  width: PaneWidthValue
  minWidth: number
  resizable: boolean
  widthStorageKey?: string
  /** Rerender the hook's component if this target changes without rendering that component. */
  paneRef: React.RefObject<HTMLElement | null>
  /** Rerender the hook's component if this target changes without rendering that component. */
  handleRef: React.RefObject<HTMLElement | null>
  contentWrapperRef?: React.RefObject<HTMLElement | null>
  /** Caps a custom maximum to the viewport-based maximum while respecting the pane's minimum width. */
  constrainToViewport?: boolean
  onResizeEnd?: (width: number) => void
  currentWidth?: number
  formatValueText?: (width: number) => string
}
export interface UsePaneWidthResult {
  currentWidth: number
  currentWidthRef: React.MutableRefObject<number>
  minPaneWidth: number
  maxPaneWidth: number
  getMaxPaneWidth(): number
  saveWidth(value: number): void
  getDefaultWidth(): number
}

export function usePaneWidth({
  width,
  minWidth,
  resizable,
  widthStorageKey,
  paneRef,
  handleRef,
  constrainToViewport = false,
  onResizeEnd,
  currentWidth: controlledWidth,
  formatValueText,
}: UsePaneWidthOptions): UsePaneWidthResult {
  const custom = isCustomWidthOptions(width)
  const minPaneWidth = custom ? Number.parseInt(width.min, 10) : minWidth
  const [targets, setTargets] = React.useState<{
    viewport: Window | undefined
    pane: HTMLElement | null
    handle: HTMLElement | null
  }>(() => ({viewport: typeof window === 'undefined' ? undefined : window, pane: null, handle: null}))
  const {viewport, pane, handle} = targets

  useIsomorphicLayoutEffect(() => {
    const paneViewport = getPaneWindow(paneRef)
    const paneElement = resizable ? paneRef.current : null
    const handleElement = resizable ? handleRef.current : null
    if (viewport !== paneViewport || pane !== paneElement || handle !== handleElement) {
      setTargets({viewport: paneViewport, pane: paneElement, handle: handleElement})
    }
  })

  const subscribeToViewportWidth = React.useCallback(
    (notify: () => void) => {
      return viewport ? subscribeToViewportResize(viewport, notify) : () => {}
    },
    [viewport],
  )
  const getIsWideViewport = React.useCallback(() => {
    return !viewport || viewport.innerWidth >= WIDE_PANE_BREAKPOINT
  }, [viewport])
  const responsivePreset = isPaneWidth(width) && !resizable
  const isWide = React.useSyncExternalStore(
    responsivePreset ? subscribeToViewportWidth : subscribeToNothing,
    responsivePreset ? getIsWideViewport : getServerIsWideViewport,
    getServerIsWideViewport,
  )
  const defaultWidth =
    isPaneWidth(width) && !resizable ? getResponsivePaneWidth(width, isWide) : getDefaultPaneWidth(width)
  const customMax = custom ? Number.parseInt(width.max, 10) : undefined
  const getMaxPaneWidth = React.useCallback(() => {
    if (typeof window === 'undefined') return customMax ?? SSR_DEFAULT_MAX_WIDTH
    const viewportWidth = viewport?.innerWidth ?? window.innerWidth
    const widthDiff = viewportWidth >= MAX_WIDTH_DIFF_BREAKPOINT ? WIDE_MAX_WIDTH_DIFF : MAX_WIDTH_DIFF
    const viewportMax = Math.max(minPaneWidth, viewportWidth - widthDiff)
    return customMax === undefined ? viewportMax : constrainToViewport ? Math.min(customMax, viewportMax) : customMax
  }, [constrainToViewport, customMax, minPaneWidth, viewport])
  const [uncontrolledWidth, setUncontrolledWidth] = React.useState(() => {
    if (
      typeof window === 'undefined' ||
      controlledWidth !== undefined ||
      !resizable ||
      onResizeEnd ||
      !widthStorageKey
    ) {
      return defaultWidth
    }
    return getStoredPaneWidth(widthStorageKey, defaultWidth)
  })
  const currentWidth = controlledWidth ?? (isPaneWidth(width) && !resizable ? defaultWidth : uncontrolledWidth)
  const currentWidthRef = React.useRef(currentWidth)
  const [maxPaneWidth, setMaxPaneWidth] = React.useState(customMax ?? SSR_DEFAULT_MAX_WIDTH)

  useIsomorphicLayoutEffect(() => {
    currentWidthRef.current = currentWidth
  }, [currentWidth])

  const applyWidth = React.useCallback(
    (value: number, max: number) => {
      currentWidthRef.current = value
      paneRef.current?.style.setProperty('--pane-width', `${value}px`)
      paneRef.current?.style.setProperty('--pane-max-width', `${max}px`)
      updateAriaValues(handleRef.current, {current: value, min: minPaneWidth, max}, formatValueText)
    },
    [formatValueText, handleRef, minPaneWidth, paneRef],
  )
  const committedOptionsRef = React.useRef({applyWidth, controlledWidth, getMaxPaneWidth, minPaneWidth, resizable})
  useIsomorphicLayoutEffect(() => {
    committedOptionsRef.current = {applyWidth, controlledWidth, getMaxPaneWidth, minPaneWidth, resizable}
  }, [applyWidth, controlledWidth, getMaxPaneWidth, minPaneWidth, resizable])

  const restoreControlledWidth = React.useCallback(() => {
    const committed = committedOptionsRef.current
    if (committed.resizable && committed.controlledWidth !== undefined) {
      const max = committed.getMaxPaneWidth()
      committed.applyWidth(Math.min(max, Math.max(committed.minPaneWidth, committed.controlledWidth)), max)
    }
  }, [])

  const saveWidth = React.useCallback(
    (value: number) => {
      const next = Math.round(value)
      currentWidthRef.current = next
      if (controlledWidth === undefined) setUncontrolledWidth(next)
      if (onResizeEnd) {
        try {
          onResizeEnd(next)
        } catch (error) {
          restoreControlledWidth()
          throw error
        }
      } else if (resizable && widthStorageKey) {
        try {
          window.localStorage.setItem(widthStorageKey, String(next))
        } catch {
          // Storage may be unavailable (for example in private browsing).
        }
      }
      restoreControlledWidth()
    },
    [controlledWidth, onResizeEnd, resizable, restoreControlledWidth, widthStorageKey],
  )

  useIsomorphicLayoutEffect(() => {
    if (!resizable || typeof window === 'undefined') return
    const update = () => {
      const max = getMaxPaneWidth()
      // Keep a live drag value until the interaction commits.
      const requested =
        controlledWidth !== undefined && !handleRef.current?.hasAttribute('data-dragging')
          ? controlledWidth
          : currentWidthRef.current
      const next = Math.min(max, Math.max(minPaneWidth, requested))
      applyWidth(next, max)
      React.startTransition(() => {
        setMaxPaneWidth(max)
        if (controlledWidth === undefined) setUncontrolledWidth(next)
      })
    }
    update()
    if (viewport) return subscribeToViewportResize(viewport, update)
  }, [
    applyWidth,
    controlledWidth,
    getMaxPaneWidth,
    handle,
    handleRef,
    minPaneWidth,
    onResizeEnd,
    pane,
    paneRef,
    resizable,
    viewport,
    widthStorageKey,
  ])

  return {
    currentWidth,
    currentWidthRef,
    minPaneWidth,
    maxPaneWidth,
    getMaxPaneWidth,
    saveWidth,
    getDefaultWidth: () => defaultWidth,
  }
}
