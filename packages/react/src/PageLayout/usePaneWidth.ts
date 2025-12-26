import React, {startTransition} from 'react'
import {canUseDOM} from '../utils/environment'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import cssExports from './PageLayout.module.css'
import {setContainmentOptimizations, removeContainmentOptimizations} from './paneUtils'

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
  contentRef: React.RefObject<HTMLDivElement | null>
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
 * Imported from CSS to ensure JS fallback matches the CSS default.
 */
export const DEFAULT_MAX_WIDTH_DIFF = Number(cssExports.paneMaxWidthDiffDefault)

// --pane-max-width-diff changes at this breakpoint in PageLayout.module.css.
const DEFAULT_PANE_MAX_WIDTH_DIFF_BREAKPOINT = Number(cssExports.paneMaxWidthDiffBreakpoint)
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

/**
 * Throttle interval for CSS-only updates during resize (16ms = ~60fps).
 * Provides immediate visual feedback while limiting update frequency.
 */
const RESIZE_THROTTLE_MS = 16

/**
 * Debounce delay for full state sync during resize (150ms).
 * Defers expensive operations (React state, ARIA, localStorage) until resize stops.
 */
const RESIZE_DEBOUNCE_MS = 150

/** Default widths for preset size options */
export const defaultPaneWidth: Record<PaneWidth, number> = {small: 256, medium: 296, large: 320}

// ----------------------------------------------------------------------------
// Helper functions

export const isCustomWidthOptions = (width: PaneWidth | CustomWidthOptions): width is CustomWidthOptions => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (width as CustomWidthOptions).default !== undefined
}

export const isPaneWidth = (width: PaneWidth | CustomWidthOptions): width is PaneWidth => {
  return width === 'small' || width === 'medium' || width === 'large'
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
 */
export function usePaneWidth({
  width,
  minWidth,
  resizable,
  widthStorageKey,
  paneRef,
  handleRef,
  contentRef,
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
  //
  // NOTE: We read from localStorage during initial state to avoid a visible resize flicker
  // when the stored width differs from the default. This causes a React hydration mismatch
  // (server renders default width, client renders stored width), but we handle this with
  // suppressHydrationWarning on the Pane element. The mismatch only affects the --pane-width
  // CSS variable, not DOM structure or children.
  const [currentWidth, setCurrentWidth] = React.useState(() => {
    const defaultWidth = getDefaultPaneWidth(width)

    if (!resizable || !canUseDOM) {
      return defaultWidth
    }

    try {
      const storedWidth = localStorage.getItem(widthStorageKey)
      if (storedWidth !== null) {
        const parsed = Number(storedWidth)
        if (!isNaN(parsed) && parsed > 0) {
          return parsed
        }
      }
    } catch {
      // localStorage unavailable - keep default
    }

    return defaultWidth
  })
  // Mutable ref for drag operations - avoids re-renders on every pixel move
  const currentWidthRef = React.useRef(currentWidth)
  // Max width for ARIA - SSR uses custom max or a sensible default, updated on mount
  const [maxPaneWidth, setMaxPaneWidth] = React.useState(() => customMaxWidth ?? SSR_DEFAULT_MAX_WIDTH)

  // --- Callbacks ---
  const getDefaultWidth = React.useCallback(() => getDefaultPaneWidth(width), [width])

  const saveWidth = React.useCallback(
    (value: number) => {
      currentWidthRef.current = value
      // Visual update already done via inline styles - React state sync is non-urgent
      startTransition(() => {
        setCurrentWidth(value)
      })
      try {
        localStorage.setItem(widthStorageKey, value.toString())
      } catch {
        // Ignore write errors (private browsing, quota exceeded, etc.)
      }
    },
    [widthStorageKey],
  )

  // --- Effects ---
  // Stable ref to getMaxPaneWidth for use in resize handler without re-subscribing
  const getMaxPaneWidthRef = React.useRef(getMaxPaneWidth)
  useIsomorphicLayoutEffect(() => {
    getMaxPaneWidthRef.current = getMaxPaneWidth
  })

  // Update CSS variable, refs, and ARIA on mount and window resize.
  // Strategy: Throttle CSS updates for immediate visual feedback, debounce full sync for when resize stops
  useIsomorphicLayoutEffect(() => {
    if (!resizable) return

    let lastViewportWidth = window.innerWidth

    // CSS-only update for immediate visual feedback (throttled)
    const updateCSSOnly = () => {
      const actualMax = getMaxPaneWidthRef.current()
      paneRef.current?.style.setProperty('--pane-max-width', `${actualMax}px`)
    }

    // Full sync of refs, ARIA, and state (debounced, runs when resize stops)
    const syncAll = () => {
      const currentViewportWidth = window.innerWidth

      // Only call getComputedStyle if we crossed the breakpoint (expensive)
      const crossedBreakpoint =
        (lastViewportWidth < DEFAULT_PANE_MAX_WIDTH_DIFF_BREAKPOINT &&
          currentViewportWidth >= DEFAULT_PANE_MAX_WIDTH_DIFF_BREAKPOINT) ||
        (lastViewportWidth >= DEFAULT_PANE_MAX_WIDTH_DIFF_BREAKPOINT &&
          currentViewportWidth < DEFAULT_PANE_MAX_WIDTH_DIFF_BREAKPOINT)
      lastViewportWidth = currentViewportWidth

      if (crossedBreakpoint) {
        maxWidthDiffRef.current = getPaneMaxWidthDiff(paneRef.current)
      }

      const actualMax = getMaxPaneWidthRef.current()

      // Update CSS variable for visual clamping (may already be set by throttled update)
      paneRef.current?.style.setProperty('--pane-max-width', `${actualMax}px`)

      // Track if we clamped current width
      const wasClamped = currentWidthRef.current > actualMax
      if (wasClamped) {
        currentWidthRef.current = actualMax
        paneRef.current?.style.setProperty('--pane-width', `${actualMax}px`)
      }

      // Update ARIA via DOM - cheap, no React re-render
      updateAriaValues(handleRef.current, {max: actualMax, current: currentWidthRef.current})

      // Defer state updates so parent re-renders see accurate values
      startTransition(() => {
        setMaxPaneWidth(actualMax)
        if (wasClamped) {
          setCurrentWidth(actualMax)
        }
      })
    }

    // Initial calculation on mount
    maxWidthDiffRef.current = getPaneMaxWidthDiff(paneRef.current)
    const initialMax = getMaxPaneWidthRef.current()
    setMaxPaneWidth(initialMax)
    paneRef.current?.style.setProperty('--pane-max-width', `${initialMax}px`)
    updateAriaValues(handleRef.current, {min: minPaneWidth, max: initialMax, current: currentWidthRef.current})

    // For custom widths, max is fixed - no need to listen to resize
    if (customMaxWidth !== null) return

    // Throttle for CSS updates - provides immediate visual feedback
    let lastUpdateTime = 0
    let rafId: number | null = null

    // Debounce for full state sync - defers expensive operations until resize stops
    let debounceId: ReturnType<typeof setTimeout> | null = null

    let isResizing = false

    // Apply containment during resize to reduce layout thrashing on large DOMs
    // Unlike drag, window resize doesn't need pointer-events: none
    const startResizeOptimizations = () => {
      if (isResizing) return
      isResizing = true
      setContainmentOptimizations(paneRef.current)
      setContainmentOptimizations(contentRef.current)
    }

    const endResizeOptimizations = () => {
      if (!isResizing) return
      isResizing = false
      removeContainmentOptimizations(paneRef.current)
      removeContainmentOptimizations(contentRef.current)
    }

    const handleResize = () => {
      startResizeOptimizations()

      const now = Date.now()

      // Throttled CSS-only update for immediate visual feedback
      if (now - lastUpdateTime >= RESIZE_THROTTLE_MS) {
        lastUpdateTime = now
        updateCSSOnly()
      } else if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null
          lastUpdateTime = Date.now()
          updateCSSOnly()
        })
      }

      // Debounced full sync (state, ARIA, cleanup) when resize stops
      if (debounceId !== null) {
        clearTimeout(debounceId)
      }
      debounceId = setTimeout(() => {
        debounceId = null
        syncAll()
        endResizeOptimizations()
      }, RESIZE_DEBOUNCE_MS)
    }

    // eslint-disable-next-line github/prefer-observers -- Uses window resize events instead of ResizeObserver to avoid INP issues. ResizeObserver on document.documentElement fires on any content change (typing, etc), while window resize only fires on actual viewport changes.
    window.addEventListener('resize', handleResize)
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      if (debounceId !== null) clearTimeout(debounceId)
      endResizeOptimizations()
      window.removeEventListener('resize', handleResize)
    }
  }, [resizable, customMaxWidth, minPaneWidth, paneRef, handleRef, contentRef])

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
