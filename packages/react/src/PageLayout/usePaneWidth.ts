import React, {startTransition, useMemo} from 'react'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import cssExports from './PageLayout.module.css'

// ----------------------------------------------------------------------------
// Types

type Measurement = `${number}px`

export type CustomWidthOptions = {
  min: Measurement
  default: Measurement
  max: Measurement
}

export type PaneWidth = 'small' | 'medium' | 'large'

/**
 * Width value for the pane - defines constraints and defaults only.
 * - `PaneWidth`: Preset size ('small' | 'medium' | 'large')
 * - `CustomWidthOptions`: Explicit min/default/max constraints
 */
export type PaneWidthValue = PaneWidth | CustomWidthOptions

export type UsePaneWidthOptions = {
  width: PaneWidthValue
  minWidth: number
  resizable: boolean
  widthStorageKey: string
  paneRef: React.RefObject<HTMLDivElement | null>
  handleRef: React.RefObject<HTMLDivElement | null>
  contentWrapperRef: React.RefObject<HTMLDivElement | null>
  /** Callback fired when a resize operation ends (drag release or keyboard key up) */
  onResizeEnd?: (width: number) => void
  /** Current/controlled width value in pixels (used instead of internal state; default from `width` is still used for reset) */
  currentWidth?: number
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

// Value for --pane-max-width-diff at/above the wide breakpoint.
const WIDE_MAX_WIDTH_DIFF = Number(cssExports.paneMaxWidthDiffWide)

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

/** Default widths for preset size options */
export const defaultPaneWidth: Record<PaneWidth, number> = {small: 256, medium: 296, large: 320}

// ----------------------------------------------------------------------------
// Helper functions

export const isCustomWidthOptions = (width: PaneWidthValue): width is CustomWidthOptions => {
  return typeof width === 'object' && 'min' in width && 'default' in width && 'max' in width
}

export const isPaneWidth = (width: PaneWidthValue): width is PaneWidth => {
  return width === 'small' || width === 'medium' || width === 'large'
}

export const getDefaultPaneWidth = (w: PaneWidthValue): number => {
  if (isPaneWidth(w)) {
    return defaultPaneWidth[w]
  } else if (isCustomWidthOptions(w)) {
    return parseInt(w.default, 10)
  }
  return 0
}

/**
 * Derives the --pane-max-width-diff value from viewport width alone.
 * Avoids the expensive getComputedStyle call that forces a synchronous layout recalc.
 * The CSS only defines two breakpoint-dependent values, so a simple width check is equivalent.
 */
export function getMaxWidthDiffFromViewport(): number {
  if (!canUseDOM) return DEFAULT_MAX_WIDTH_DIFF
  return window.innerWidth >= DEFAULT_PANE_MAX_WIDTH_DIFF_BREAKPOINT ? WIDE_MAX_WIDTH_DIFF : DEFAULT_MAX_WIDTH_DIFF
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

const localStoragePersister = {
  save: (key: string, width: number) => {
    try {
      localStorage.setItem(key, width.toString())
    } catch {
      // Ignore write errors (private browsing, quota exceeded, etc.)
    }
  },
  get: (key: string): number | null => {
    try {
      const storedWidth = localStorage.getItem(key)
      if (storedWidth !== null) {
        const parsed = Number(storedWidth)
        if (!isNaN(parsed) && parsed > 0) {
          // Round to handle legacy float values from before Math.round was added to saveWidth
          return Math.round(parsed)
        }
      }
    } catch {
      // localStorage unavailable
    }
    return null
  },
}

// ----------------------------------------------------------------------------
// Hook

/**
 * Manages pane width state with storage persistence and viewport constraints.
 * Handles initialization from storage, clamping on viewport resize, and provides
 * functions to save and reset width.
 *
 * Storage behavior:
 * - When `resizable` is `true` and `onResizeEnd` is not provided: Uses localStorage
 * - When `onResizeEnd` is provided: Calls the callback instead of localStorage
 * - When `resizable` is `false` or `undefined`: Not resizable, no persistence
 */
export function usePaneWidth({
  width,
  minWidth,
  resizable,
  widthStorageKey,
  paneRef,
  handleRef,
  contentWrapperRef,
  onResizeEnd,
  currentWidth: controlledWidth,
}: UsePaneWidthOptions): UsePaneWidthResult {
  // Derive constraints from width configuration
  const isCustomWidth = isCustomWidthOptions(width)
  const minPaneWidth = isCustomWidth ? parseInt(width.min, 10) : minWidth
  const customMaxWidth = isCustomWidth ? parseInt(width.max, 10) : null

  // Refs for stable callbacks - updated in layout effect below
  const widthStorageKeyRef = React.useRef(widthStorageKey)
  const onResizeEndRef = React.useRef(onResizeEnd)

  // Keep refs in sync with props for stable callbacks
  useIsomorphicLayoutEffect(() => {
    widthStorageKeyRef.current = widthStorageKey
    onResizeEndRef.current = onResizeEnd
  })
  // Cache the CSS variable value to avoid getComputedStyle during drag (causes layout thrashing)
  // Updated on mount and resize when breakpoints might change
  const maxWidthDiffRef = React.useRef(DEFAULT_MAX_WIDTH_DIFF)

  // Calculate max width constraint - for custom widths this is fixed, otherwise viewport-dependent
  const getMaxPaneWidth = React.useCallback(() => {
    if (customMaxWidth !== null) return customMaxWidth
    const viewportWidth = window.innerWidth
    return viewportWidth > 0 ? Math.max(minPaneWidth, viewportWidth - maxWidthDiffRef.current) : minPaneWidth
  }, [customMaxWidth, minPaneWidth])

  const defaultWidth = useMemo(() => getDefaultPaneWidth(width), [width])
  // --- State ---
  // Current width for React renders (ARIA attributes). Updates go through saveWidth() or clamp on resize.
  // Priority order for initial width:
  // 1. currentWidth prop (controlled current value)
  // 2. localStorage (if onResizeEnd is not provided and resizable is true)
  // 3. defaultWidth (from width prop)
  const [currentWidthState, setCurrentWidthState] = React.useState(() => {
    // Check if controlled width value is provided
    if (typeof controlledWidth === 'number') {
      return controlledWidth
    }
    // Try localStorage if onResizeEnd is not provided (default persistence behavior)
    // Read directly here instead of via persister to satisfy react-hooks/refs lint rule
    const shouldUseLocalStorage = onResizeEnd === undefined && resizable === true
    if (shouldUseLocalStorage) {
      const storedWidth = localStoragePersister.get(widthStorageKey)
      if (storedWidth !== null) {
        return storedWidth
      }
    }
    return defaultWidth
  })

  // Inline state sync when width prop or controlled width changes (avoids effect)
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevDefaultWidth, setPrevDefaultWidth] = React.useState(defaultWidth)
  const [prevControlledWidth, setPrevControlledWidth] = React.useState(controlledWidth)

  // Handle controlled width changes
  const controlledWidthChanged = controlledWidth !== prevControlledWidth
  const defaultWidthChanged = defaultWidth !== prevDefaultWidth

  if (controlledWidthChanged) {
    setPrevControlledWidth(controlledWidth)
    if (typeof controlledWidth === 'number') {
      // New controlled width provided
      setCurrentWidthState(controlledWidth)
    } else if (prevControlledWidth !== undefined) {
      // Controlled width was removed, fall back to default
      setCurrentWidthState(defaultWidth)
    }
  }

  if (defaultWidthChanged) {
    setPrevDefaultWidth(defaultWidth)
    // Only sync defaultWidth to currentWidthState if there's no controlled width
    if (controlledWidth === undefined && !controlledWidthChanged) {
      setCurrentWidthState(defaultWidth)
    }
  }

  // Use controlled width if provided, otherwise use internal state
  const currentWidth = controlledWidth ?? currentWidthState

  // Mutable ref for drag operations - avoids re-renders on every pixel move
  const currentWidthRef = React.useRef(currentWidth)
  // Max width for ARIA - SSR uses custom max or a sensible default, updated on mount
  const [maxPaneWidth, setMaxPaneWidth] = React.useState(() => customMaxWidth ?? SSR_DEFAULT_MAX_WIDTH)

  // Keep currentWidthRef in sync with state (ref is used during drag to avoid re-renders)
  useIsomorphicLayoutEffect(() => {
    currentWidthRef.current = currentWidth
  }, [currentWidth])

  // --- Callbacks ---
  const getDefaultWidth = React.useCallback(() => getDefaultPaneWidth(width), [width])

  const saveWidth = React.useCallback(
    (value: number) => {
      // Round to integer — sub-pixel values are meaningless for persistence and ARIA
      const rounded = Math.round(value)
      currentWidthRef.current = rounded
      // Visual update already done via inline styles - React state sync is non-urgent.
      // In controlled mode, this keeps internal state in sync as a fallback if
      // controlledWidth is later removed (component switches to uncontrolled).
      startTransition(() => {
        setCurrentWidthState(rounded)
      })

      // If onResizeEnd is provided, call it instead of any persistence
      if (onResizeEndRef.current) {
        try {
          onResizeEndRef.current(rounded)
        } catch {
          // Ignore errors from consumer callback
        }
        return
      }

      // Handle localStorage persistence when resizable === true and not controlled
      if (resizable) {
        localStoragePersister.save(widthStorageKeyRef.current, rounded)
      }
    },
    [resizable],
  )

  // --- Effects ---
  // Stable ref to getMaxPaneWidth for use in resize handler without re-subscribing
  const getMaxPaneWidthRef = React.useRef(getMaxPaneWidth)
  useIsomorphicLayoutEffect(() => {
    getMaxPaneWidthRef.current = getMaxPaneWidth
  })

  // Update CSS variable, refs, and ARIA on mount and window resize.
  // Strategy: Only sync when resize stops (debounced) to avoid layout thrashing on large DOMs
  useIsomorphicLayoutEffect(() => {
    if (!resizable) return

    let lastViewportWidth = window.innerWidth

    // Full sync of refs, ARIA, and state (debounced, runs when resize stops)
    const syncAll = () => {
      const currentViewportWidth = window.innerWidth

      // Only update the cached diff value if we crossed the breakpoint
      const crossedBreakpoint =
        (lastViewportWidth < DEFAULT_PANE_MAX_WIDTH_DIFF_BREAKPOINT &&
          currentViewportWidth >= DEFAULT_PANE_MAX_WIDTH_DIFF_BREAKPOINT) ||
        (lastViewportWidth >= DEFAULT_PANE_MAX_WIDTH_DIFF_BREAKPOINT &&
          currentViewportWidth < DEFAULT_PANE_MAX_WIDTH_DIFF_BREAKPOINT)
      lastViewportWidth = currentViewportWidth

      if (crossedBreakpoint) {
        maxWidthDiffRef.current = getMaxWidthDiffFromViewport()
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
          setCurrentWidthState(actualMax)
        }
      })
    }

    // Initial calculation on mount — use viewport-based lookup to avoid
    // getComputedStyle which forces a synchronous layout recalc on the
    // freshly-committed DOM tree (measured at ~614ms on large pages).
    maxWidthDiffRef.current = getMaxWidthDiffFromViewport()
    const initialMax = getMaxPaneWidthRef.current()
    setMaxPaneWidth(initialMax)
    paneRef.current?.style.setProperty('--pane-max-width', `${initialMax}px`)
    updateAriaValues(handleRef.current, {min: minPaneWidth, max: initialMax, current: currentWidthRef.current})

    // For custom widths, max is fixed - no need to listen to resize
    if (customMaxWidth !== null) return

    // Throttle approach for window resize - provides immediate visual feedback for small DOMs
    // while still limiting update frequency
    const THROTTLE_MS = 16 // ~60fps
    const DEBOUNCE_MS = 150 // Delay before removing containment after resize stops
    let lastUpdateTime = 0
    let pendingUpdate = false
    let rafId: number | null = null
    let debounceId: ReturnType<typeof setTimeout> | null = null
    let isResizing = false

    const startResizeOptimizations = () => {
      if (isResizing) return
      isResizing = true
      paneRef.current?.setAttribute('data-dragging', 'true')
      contentWrapperRef.current?.setAttribute('data-dragging', 'true')
    }

    const endResizeOptimizations = () => {
      if (!isResizing) return
      isResizing = false
      paneRef.current?.removeAttribute('data-dragging')
      contentWrapperRef.current?.removeAttribute('data-dragging')
    }

    const handleResize = () => {
      // Apply containment on first resize event (stays applied until resize stops)
      startResizeOptimizations()

      const now = Date.now()
      if (now - lastUpdateTime >= THROTTLE_MS) {
        lastUpdateTime = now
        syncAll()
      } else if (!pendingUpdate) {
        pendingUpdate = true
        rafId = requestAnimationFrame(() => {
          pendingUpdate = false
          rafId = null
          lastUpdateTime = Date.now()
          syncAll()
        })
      }

      // Debounce the cleanup — remove containment after resize stops
      if (debounceId !== null) clearTimeout(debounceId)
      debounceId = setTimeout(() => {
        debounceId = null
        endResizeOptimizations()
      }, DEBOUNCE_MS)
    }

    // eslint-disable-next-line github/prefer-observers -- Uses window resize events instead of ResizeObserver to avoid INP issues. ResizeObserver on document.documentElement fires on any content change (typing, etc), while window resize only fires on actual viewport changes.
    window.addEventListener('resize', handleResize)
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      if (debounceId !== null) clearTimeout(debounceId)
      endResizeOptimizations()
      window.removeEventListener('resize', handleResize)
    }
  }, [resizable, customMaxWidth, minPaneWidth, paneRef, handleRef, contentWrapperRef])

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
