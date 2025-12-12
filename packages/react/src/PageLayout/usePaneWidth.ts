import React from 'react'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'

// ----------------------------------------------------------------------------
// Types

type Measurement = `${number}px`

export type CustomWidthOptions = {
  min: Measurement
  default: Measurement
  max: Measurement
}

export type PaneWidth = 'small' | 'medium' | 'large'

export type UsePaneWidthOptions = {
  width: PaneWidth | CustomWidthOptions
  minWidth: number
  resizable: boolean
  widthStorageKey: string
  paneRef: React.RefObject<HTMLDivElement | null>
  handleRef: React.RefObject<HTMLDivElement | null>
}

export type UsePaneWidthResult = {
  /** Current width for React state (used in ARIA attributes) */
  currentWidth: number
  /** Mutable ref tracking width during drag operations */
  currentWidthRef: React.MutableRefObject<number>
  /** Minimum allowed pane width */
  minPaneWidth: number
  /** Maximum allowed pane width (updates on viewport resize) */
  maxPaneWidth: number
  /** Calculate current max width constraint */
  getMaxPaneWidth: () => number
  /** Persist width to localStorage and sync React state */
  saveWidth: (value: number) => void
  /** Reset to default width */
  getDefaultWidth: () => number
}

// ----------------------------------------------------------------------------
// Constants

/**
 * Default value for --pane-max-width-diff CSS variable.
 * This is the fallback when the element isn't mounted or value can't be read.
 */
export const DEFAULT_MAX_WIDTH_DIFF = 511

/**
 * Default max pane width for SSR when viewport is unknown.
 * Updated to actual value in layout effect before paint.
 */
export const SSR_DEFAULT_MAX_WIDTH = 600

/**
 * Pixel increment for keyboard arrow key resizing.
 * @see https://github.com/github/accessibility/issues/5101#issuecomment-1822870655
 */
export const ARROW_KEY_STEP = 3

/** Default widths for preset size options */
export const defaultPaneWidth: Record<PaneWidth, number> = {small: 256, medium: 296, large: 320}

// ----------------------------------------------------------------------------
// Helper functions

export const isCustomWidthOptions = (width: PaneWidth | CustomWidthOptions): width is CustomWidthOptions => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (width as CustomWidthOptions).default !== undefined
}

export const isPaneWidth = (width: PaneWidth | CustomWidthOptions): width is PaneWidth => {
  return ['small', 'medium', 'large'].includes(width as PaneWidth)
}

export const getDefaultPaneWidth = (w: PaneWidth | CustomWidthOptions): number => {
  if (isPaneWidth(w)) {
    return defaultPaneWidth[w]
  } else if (isCustomWidthOptions(w)) {
    return parseInt(w.default, 10)
  }
  return 0
}

/**
 * Gets the --pane-max-width-diff CSS variable value from a pane element.
 * This value is set by CSS media queries and controls the max pane width constraint.
 * Note: This calls getComputedStyle which forces layout - cache the result when possible.
 */
export function getPaneMaxWidthDiff(paneElement: HTMLElement | null): number {
  if (!paneElement) return DEFAULT_MAX_WIDTH_DIFF
  const value = parseInt(getComputedStyle(paneElement).getPropertyValue('--pane-max-width-diff'), 10)
  return value > 0 ? value : DEFAULT_MAX_WIDTH_DIFF
}

// Helper to update ARIA slider attributes via direct DOM manipulation
// This avoids re-renders when values change during drag or on viewport resize
export const updateAriaValues = (
  handle: HTMLElement | null,
  values: {current?: number; min?: number; max?: number},
) => {
  if (!handle) return
  if (values.min !== undefined) handle.setAttribute('aria-valuemin', String(values.min))
  if (values.max !== undefined) handle.setAttribute('aria-valuemax', String(values.max))
  if (values.current !== undefined) {
    handle.setAttribute('aria-valuenow', String(values.current))
    handle.setAttribute('aria-valuetext', `Pane width ${values.current} pixels`)
  }
}

// ----------------------------------------------------------------------------
// Hook

/**
 * Manages pane width state with localStorage persistence and viewport constraints.
 * Handles initialization from storage, clamping on viewport resize, and provides
 * functions to save and reset width.
 *
 * Uses window resize events instead of ResizeObserver to avoid INP issues.
 * ResizeObserver on document.documentElement fires on any content change (typing, etc),
 * while window resize only fires on actual viewport changes.
 */
export function usePaneWidth({
  width,
  minWidth,
  resizable,
  widthStorageKey,
  paneRef,
  handleRef,
}: UsePaneWidthOptions): UsePaneWidthResult {
  // Derive constraints from width configuration
  const isCustomWidth = isCustomWidthOptions(width)
  const minPaneWidth = isCustomWidth ? parseInt(width.min, 10) : minWidth
  const customMaxWidth = isCustomWidth ? parseInt(width.max, 10) : null

  // Cache the CSS variable value to avoid getComputedStyle during drag (causes layout thrashing)
  // Updated on mount and resize when breakpoints might change
  const maxWidthDiffRef = React.useRef(DEFAULT_MAX_WIDTH_DIFF)

  // Calculate max width constraint - for custom widths this is fixed, otherwise viewport-dependent
  const getMaxPaneWidth = React.useCallback(() => {
    if (customMaxWidth !== null) return customMaxWidth
    const viewportWidth = window.innerWidth
    return viewportWidth > 0 ? Math.max(minPaneWidth, viewportWidth - maxWidthDiffRef.current) : minPaneWidth
  }, [customMaxWidth, minPaneWidth])

  // --- State ---
  // Current width for React renders (ARIA attributes). Updates go through saveWidth() or clamp on resize.
  const [currentWidth, setCurrentWidth] = React.useState(() => getDefaultPaneWidth(width))
  // Mutable ref for drag operations - avoids re-renders on every pixel move
  const currentWidthRef = React.useRef(currentWidth)
  // Max width for ARIA - SSR uses custom max or a sensible default, updated on mount
  const [maxPaneWidth, setMaxPaneWidth] = React.useState(() => customMaxWidth ?? SSR_DEFAULT_MAX_WIDTH)

  // --- Callbacks ---
  const getDefaultWidth = React.useCallback(() => getDefaultPaneWidth(width), [width])

  const saveWidth = React.useCallback(
    (value: number) => {
      currentWidthRef.current = value
      setCurrentWidth(value)
      try {
        localStorage.setItem(widthStorageKey, value.toString())
      } catch {
        // Ignore write errors (private browsing, quota exceeded, etc.)
      }
    },
    [widthStorageKey],
  )

  // --- Effects ---
  // Track whether we've initialized the width from localStorage
  const initializedRef = React.useRef(false)

  // Initialize from localStorage on mount (before paint to avoid CLS)
  useIsomorphicLayoutEffect(() => {
    if (initializedRef.current || !resizable) return
    initializedRef.current = true

    try {
      const stored = localStorage.getItem(widthStorageKey)
      if (stored !== null) {
        const parsed = Number(stored)
        if (!isNaN(parsed) && parsed > 0) {
          currentWidthRef.current = parsed
          paneRef.current?.style.setProperty('--pane-width', `${parsed}px`)
          setCurrentWidth(parsed)
        }
      }
    } catch {
      // localStorage unavailable - keep default
    }
  }, [widthStorageKey, paneRef, resizable])

  // Stable ref to getMaxPaneWidth for use in resize handler without re-subscribing
  const getMaxPaneWidthRef = React.useRef(getMaxPaneWidth)
  useIsomorphicLayoutEffect(() => {
    getMaxPaneWidthRef.current = getMaxPaneWidth
  })

  // Update max pane width on mount and window resize for accurate ARIA values
  useIsomorphicLayoutEffect(() => {
    if (!resizable) return

    // Track last viewport width to detect breakpoint crossings
    // --pane-max-width-diff only changes at the 1280px breakpoint
    const BREAKPOINT = 1280
    let lastViewportWidth = window.innerWidth

    const updateMax = ({forceRecalcCss = false}: {forceRecalcCss?: boolean} = {}) => {
      const currentViewportWidth = window.innerWidth
      const crossedBreakpoint =
        (lastViewportWidth < BREAKPOINT && currentViewportWidth >= BREAKPOINT) ||
        (lastViewportWidth >= BREAKPOINT && currentViewportWidth < BREAKPOINT)
      lastViewportWidth = currentViewportWidth

      // Only call getComputedStyle if we crossed the breakpoint (expensive operation)
      if (forceRecalcCss || crossedBreakpoint) {
        maxWidthDiffRef.current = getPaneMaxWidthDiff(paneRef.current)
      }

      const actualMax = getMaxPaneWidthRef.current()
      setMaxPaneWidth(actualMax)

      // Clamp current width if it exceeds new max (viewport shrunk)
      if (currentWidthRef.current > actualMax) {
        currentWidthRef.current = actualMax
        paneRef.current?.style.setProperty('--pane-width', `${actualMax}px`)
        setCurrentWidth(actualMax)
      }

      updateAriaValues(handleRef.current, {min: minPaneWidth, max: actualMax, current: currentWidthRef.current})
    }

    // Initial calculation - force CSS recalc to get correct value
    updateMax({forceRecalcCss: true})

    // For custom widths, max is fixed - no need to listen to resize
    if (customMaxWidth !== null) return

    // Throttle resize with trailing edge:
    // - Execute at most once per THROTTLE_MS during rapid resizing
    // - Guarantee final event executes when resize stops
    const THROTTLE_MS = 100
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let lastExecution = 0

    const handleResize = () => {
      const now = Date.now()
      const timeSinceLastExecution = now - lastExecution

      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }

      if (timeSinceLastExecution >= THROTTLE_MS) {
        lastExecution = now
        updateMax()
      } else {
        // Schedule trailing edge execution
        timeoutId = setTimeout(() => {
          lastExecution = Date.now()
          updateMax()
          timeoutId = null
        }, THROTTLE_MS - timeSinceLastExecution)
      }
    }

    // eslint-disable-next-line github/prefer-observers
    window.addEventListener('resize', handleResize)
    return () => {
      if (timeoutId !== null) clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [resizable, customMaxWidth, minPaneWidth, paneRef, handleRef])

  return {
    currentWidth,
    currentWidthRef,
    minPaneWidth,
    maxPaneWidth,
    getMaxPaneWidth,
    saveWidth,
    getDefaultWidth,
  }
}
