import React, {startTransition} from 'react'
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
 * Interface for persisting pane width to storage.
 * Allows consumers to provide custom storage implementations (e.g., sessionStorage, IndexedDB, server-side).
 *
 * For custom persisters, the initial width should be passed via the `width` prop.
 */
export interface WidthPersister {
  /** Save the width value to storage. Can be async for server-side persistence. */
  save: (value: number) => void | Promise<void>
}

/**
 * Configuration for resizable without persistence.
 * Use this to enable resizing without storing the width anywhere.
 */
export type NoPersistConfig = {persist: false}

/**
 * Resizable configuration options.
 * - `true`: Enable resizing with default localStorage persistence (may cause hydration mismatch)
 * - `false`: Disable resizing
 * - `{persist: false}`: Enable resizing without persistence (no hydration issues)
 * - `WidthPersister`: Enable resizing with custom storage implementation (no hydration issues)
 */
export type ResizableConfig = boolean | WidthPersister | NoPersistConfig

export type UsePaneWidthOptions = {
  width: PaneWidth | CustomWidthOptions
  minWidth: number
  resizable: ResizableConfig
  widthStorageKey: string
  paneRef: React.RefObject<HTMLDivElement | null>
  handleRef: React.RefObject<HTMLDivElement | null>
  /**
   * Callback fired when the pane width changes (on drag end or reset).
   * Use for controlled mode or to sync width to external state/storage.
   */
  onWidthChange?: (width: number) => void
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
 * Type guard to check if resizable config is a WidthPersister (has save method)
 */
export const isWidthPersister = (config: ResizableConfig): config is WidthPersister => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- config could be null at runtime despite types
  return typeof config === 'object' && config !== null && 'save' in config
}

/**
 * Type guard to check if resizable config is {persist: false} (resizable without persistence)
 */
export const isNoPersistConfig = (config: ResizableConfig): config is NoPersistConfig => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- config could be null at runtime despite types
  return typeof config === 'object' && config !== null && 'persist' in config && config.persist === false
}

/**
 * Check if resizing is enabled (boolean true, {persist: false}, or persister object)
 */
export const isResizableEnabled = (config: ResizableConfig): boolean => {
  return config === true || typeof config === 'object'
}

/**
 * Internal interface for localStorage persister (includes get for reading stored value)
 */
interface InternalLocalStoragePersister extends WidthPersister {
  get: () => number | null
}

/**
 * Creates a default localStorage-based persister (internal use only)
 */
const createLocalStoragePersister = (storageKey: string): InternalLocalStoragePersister => ({
  get: () => {
    try {
      const storedWidth = localStorage.getItem(storageKey)
      if (storedWidth !== null) {
        const parsed = Number(storedWidth)
        if (!isNaN(parsed) && parsed > 0) {
          return parsed
        }
      }
    } catch {
      // localStorage unavailable
    }
    return null
  },
  save: (value: number) => {
    try {
      localStorage.setItem(storageKey, value.toString())
    } catch {
      // Ignore write errors (private browsing, quota exceeded, etc.)
    }
  },
})

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
 * Manages pane width state with storage persistence and viewport constraints.
 * Handles initialization from storage, clamping on viewport resize, and provides
 * functions to save and reset width.
 *
 * Storage behavior:
 * - When `resizable` is `true`: Uses localStorage with the provided `widthStorageKey`
 * - When `resizable` is a `WidthPersister`: Uses the custom persister's save method
 *   (consumer provides initial width via `width` prop)
 */
export function usePaneWidth({
  width,
  minWidth,
  resizable,
  widthStorageKey,
  paneRef,
  handleRef,
  onWidthChange,
}: UsePaneWidthOptions): UsePaneWidthResult {
  // Derive constraints from width configuration
  const isCustomWidth = isCustomWidthOptions(width)
  const minPaneWidth = isCustomWidth ? parseInt(width.min, 10) : minWidth
  const customMaxWidth = isCustomWidth ? parseInt(width.max, 10) : null

  // Create persister - either use provided one or default to localStorage
  // For custom persisters, we only use save(). For localStorage, we also use get().
  const localStoragePersister = React.useMemo<InternalLocalStoragePersister | null>(() => {
    if (resizable !== true) return null
    return createLocalStoragePersister(widthStorageKey)
  }, [resizable, widthStorageKey])

  // The persister used for saving - either custom or localStorage
  const persister = React.useMemo<WidthPersister | null>(() => {
    if (!isResizableEnabled(resizable)) return null
    if (isWidthPersister(resizable)) return resizable
    return localStoragePersister
  }, [resizable, localStoragePersister])

  const resizableRef = React.useRef(resizable)

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
  // For resizable=true (localStorage), we read synchronously in initializer to avoid flash on CSR.
  // This causes hydration mismatch (server renders default, client reads localStorage) which is
  // suppressed via suppressHydrationWarning on the pane element.
  // For other resizable configs ({} or WidthPersister), consumer provides initial via `width` prop.
  const [currentWidth, setCurrentWidth] = React.useState(() => {
    const defaultWidth = getDefaultPaneWidth(width)
    // Only try localStorage for default persister (resizable === true)
    if (resizable === true && localStoragePersister) {
      const storedValue = localStoragePersister.get()
      if (storedValue !== null && storedValue > 0) {
        return storedValue
      }
    }
    return defaultWidth
  })
  // Mutable ref for drag operations - avoids re-renders on every pixel move
  const currentWidthRef = React.useRef(currentWidth)
  // Max width for ARIA - SSR uses custom max or a sensible default, updated on mount
  const [maxPaneWidth, setMaxPaneWidth] = React.useState(() => customMaxWidth ?? SSR_DEFAULT_MAX_WIDTH)

  // --- Callbacks ---
  const getDefaultWidth = React.useCallback(() => getDefaultPaneWidth(width), [width])

  // Stable ref for onWidthChange to avoid re-creating saveWidth on every render
  const onWidthChangeRef = React.useRef(onWidthChange)
  useIsomorphicLayoutEffect(() => {
    onWidthChangeRef.current = onWidthChange
  })

  const saveWidth = React.useCallback(
    (value: number) => {
      currentWidthRef.current = value
      setCurrentWidth(value)

      // Fire callback if provided (for controlled mode / external sync)
      if (onWidthChangeRef.current) {
        try {
          onWidthChangeRef.current(value)
        } catch {
          // Ignore consumer errors
        }
      }

      // Persist to storage (async is fine - fire and forget)
      // Wrapped in try-catch to prevent consumer errors from breaking the component
      if (persister) {
        try {
          const result = persister.save(value)
          // Handle async rejections silently
          if (result instanceof Promise) {
            // eslint-disable-next-line github/no-then
            result.catch(() => {
              // Ignore - consumer should handle their own errors
            })
          }
        } catch {
          // Ignore sync errors - consumer should handle their own errors
        }
      }
    },
    [persister],
  )

  // --- Effects ---
  // Keep ref in sync with state (ref is used during drag to avoid re-renders).
  // CSS variable is set via inline style in PageLayout.tsx, so no need to duplicate here.
  // TODO: Consider reading localStorage here instead of useState initializer.
  // This would avoid hydration mismatch (and need for suppressHydrationWarning) at the
  // cost of one extra render cycle. Since useLayoutEffect runs before paint, user won't
  // see the flash. Would also simplify the code by removing the special-case SSR logic.
  useIsomorphicLayoutEffect(() => {
    if (!isResizableEnabled(resizableRef.current)) return
    currentWidthRef.current = currentWidth
  }, [currentWidth])

  // Sync internal state from width prop changes (for controlled mode).
  // This allows consumers to change width externally and have the pane respond.
  const prevWidthPropRef = React.useRef(width)
  useIsomorphicLayoutEffect(() => {
    const newDefault = getDefaultPaneWidth(width)
    const oldDefault = getDefaultPaneWidth(prevWidthPropRef.current)

    // If width prop changed, sync internal state (but don't fire onWidthChange - this is external sync)
    if (newDefault !== oldDefault) {
      currentWidthRef.current = newDefault
      setCurrentWidth(newDefault)
      paneRef.current?.style.setProperty('--pane-width', `${newDefault}px`)
      updateAriaValues(handleRef.current, {current: newDefault})
    }
    prevWidthPropRef.current = width
  }, [width, paneRef, handleRef])

  // Stable ref to getMaxPaneWidth for use in resize handler without re-subscribing
  const getMaxPaneWidthRef = React.useRef(getMaxPaneWidth)
  useIsomorphicLayoutEffect(() => {
    getMaxPaneWidthRef.current = getMaxPaneWidth
  })

  // Update CSS variable, refs, and ARIA on mount and window resize.
  // Strategy:
  // 1. Throttled (16ms): Update --pane-max-width CSS variable for immediate visual clamp
  // 2. Debounced (150ms): Sync refs, ARIA, and React state when resize stops
  useIsomorphicLayoutEffect(() => {
    if (!isResizableEnabled(resizableRef.current)) return

    let lastViewportWidth = window.innerWidth

    // Quick CSS-only update for immediate visual feedback (throttled)
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

    // Throttle CSS updates (16ms ≈ 60fps), debounce full sync (150ms)
    const THROTTLE_MS = 16
    const DEBOUNCE_MS = 150
    let rafId: number | null = null
    let debounceId: ReturnType<typeof setTimeout> | null = null
    let lastThrottleTime = 0

    const handleResize = () => {
      const now = Date.now()

      // Throttled CSS update for immediate visual feedback
      if (now - lastThrottleTime >= THROTTLE_MS) {
        lastThrottleTime = now
        updateCSSOnly()
      } else if (rafId === null) {
        // Schedule next frame if we're within throttle window
        rafId = requestAnimationFrame(() => {
          rafId = null
          lastThrottleTime = Date.now()
          updateCSSOnly()
        })
      }

      // Debounced full sync (refs, ARIA, state) when resize stops
      if (debounceId !== null) {
        clearTimeout(debounceId)
      }
      debounceId = setTimeout(() => {
        debounceId = null
        syncAll()
      }, DEBOUNCE_MS)
    }

    // eslint-disable-next-line github/prefer-observers -- Uses window resize events instead of ResizeObserver to avoid INP issues. ResizeObserver on document.documentElement fires on any content change (typing, etc), while window resize only fires on actual viewport changes.
    window.addEventListener('resize', handleResize)
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      if (debounceId !== null) clearTimeout(debounceId)
      window.removeEventListener('resize', handleResize)
    }
  }, [customMaxWidth, minPaneWidth, paneRef, handleRef])

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
