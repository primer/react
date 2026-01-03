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
 * - `number`: Legacy - Custom width in pixels (uses minWidth prop and viewport-based max)
 *   **Deprecated**: Use CustomWidthOptions with default property instead
 */
export type PaneWidthValue = PaneWidth | number | CustomWidthOptions

/**
 * Options passed to custom persist function.
 */
export type SaveOptions = {widthStorageKey: string}

/**
 * Custom persist function type.
 */
export type PersistFunction = (width: number, options: SaveOptions) => void | Promise<void>

/**
 * Configuration object for resizable pane.
 * - `width?: number` - Current/controlled width value in pixels (overrides width prop's default)
 * - `persist: false` - Enable resizing without any persistence
 * - `persist: 'localStorage'` - Enable resizing with localStorage persistence
 * - `persist: fn` - Enable resizing with custom persistence function
 */
export type PersistConfig = {
  /** Current controlled width value in pixels. When provided, this overrides the default from the width prop. */
  width?: number
  persist: false | 'localStorage' | PersistFunction
}

/**
 * Type guard to check if persist value is a custom function
 */
export const isCustomPersistFunction = (
  persist: false | 'localStorage' | PersistFunction,
): persist is PersistFunction => {
  return typeof persist === 'function'
}

/**
 * Resizable configuration options.
 * - `true`: Enable resizing with default localStorage persistence (may cause hydration mismatch)
 * - `false`: Disable resizing
 * - `{width?: number, persist: false}`: Enable resizing without any persistence, optionally with controlled width
 * - `{width?: number, persist: 'localStorage'}`: Enable resizing with localStorage persistence, optionally with controlled width
 * - `{width?: number, persist: fn}`: Enable resizing with custom persistence function, optionally with controlled width
 *
 * The `width` property in the config object represents the current/controlled width value.
 * When provided, it takes precedence over the default width from the `width` prop.
 */
export type ResizableConfig = boolean | PersistConfig

export type UsePaneWidthOptions = {
  width: PaneWidthValue
  minWidth: number
  resizable: ResizableConfig
  widthStorageKey: string
  paneRef: React.RefObject<HTMLDivElement | null>
  handleRef: React.RefObject<HTMLDivElement | null>
  contentWrapperRef: React.RefObject<HTMLDivElement | null>
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

export const isCustomWidthOptions = (width: PaneWidthValue): width is CustomWidthOptions => {
  return typeof width === 'object' && 'min' in width && 'default' in width && 'max' in width
}

export const isPaneWidth = (width: PaneWidthValue): width is PaneWidth => {
  return width === 'small' || width === 'medium' || width === 'large'
}

export const isNumericWidth = (width: PaneWidthValue): width is number => {
  return typeof width === 'number'
}

export const getDefaultPaneWidth = (w: PaneWidthValue): number => {
  if (isPaneWidth(w)) {
    return defaultPaneWidth[w]
  } else if (isNumericWidth(w)) {
    return w
  } else if (isCustomWidthOptions(w)) {
    return parseInt(w.default, 10)
  }
  return 0
}

/**
 * Type guard to check if resizable config is a PersistConfig object
 */
export const isPersistConfig = (config: ResizableConfig): config is PersistConfig => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- config could be null at runtime despite types
  return typeof config === 'object' && config !== null && 'persist' in config
}

/**
 * Check if resizing is enabled (boolean true or {persist: ...})
 */
export const isResizableEnabled = (config: ResizableConfig): boolean => {
  return config === true || isPersistConfig(config)
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
          return parsed
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
 * - When `resizable` is `true`: Uses localStorage with the provided `widthStorageKey`
 * - When `resizable` is `{persist: false}`: Resizable without any persistence
 * - When `resizable` is `{save: fn}`: Resizable with custom persistence
 */
export function usePaneWidth({
  width,
  minWidth,
  resizable,
  widthStorageKey,
  paneRef,
  handleRef,
  contentWrapperRef,
}: UsePaneWidthOptions): UsePaneWidthResult {
  // Derive constraints from width configuration
  const isCustomWidth = isCustomWidthOptions(width)
  const minPaneWidth = isCustomWidth ? parseInt(width.min, 10) : minWidth
  const customMaxWidth = isCustomWidth ? parseInt(width.max, 10) : null

  // Refs for stable callbacks - updated in layout effect below
  const widthStorageKeyRef = React.useRef(widthStorageKey)
  const resizableRef = React.useRef(resizable)

  // Keep refs in sync with props for stable callbacks
  useIsomorphicLayoutEffect(() => {
    resizableRef.current = resizable
    widthStorageKeyRef.current = widthStorageKey
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
  // 1. resizable.width (controlled current value)
  // 2. localStorage (resizable === true only)
  // 3. defaultWidth (from width prop)
  const [currentWidth, setCurrentWidth] = React.useState(() => {
    // Check if resizable config has a controlled width value
    if (isPersistConfig(resizable) && typeof resizable.width === 'number') {
      return resizable.width
    }
    // Only try localStorage for default persister (resizable === true)
    // Read directly here instead of via persister to satisfy react-hooks/refs lint rule
    if (resizable === true) {
      const storedWidth = localStoragePersister.get(widthStorageKey)
      if (storedWidth !== null) {
        return storedWidth
      }
    }
    return defaultWidth
  })

  // Inline state sync when width prop or resizable.width changes (avoids effect)
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevDefaultWidth, setPrevDefaultWidth] = React.useState(defaultWidth)
  const controlledWidth = isPersistConfig(resizable) ? resizable.width : undefined
  const [prevControlledWidth, setPrevControlledWidth] = React.useState(controlledWidth)

  // Handle controlled width changes
  const controlledWidthChanged = controlledWidth !== prevControlledWidth
  const defaultWidthChanged = defaultWidth !== prevDefaultWidth

  if (controlledWidthChanged) {
    setPrevControlledWidth(controlledWidth)
    if (typeof controlledWidth === 'number') {
      // New controlled width provided
      setCurrentWidth(controlledWidth)
    } else if (prevControlledWidth !== undefined) {
      // Controlled width was removed, fall back to default
      setCurrentWidth(defaultWidth)
    }
  }

  if (defaultWidthChanged) {
    setPrevDefaultWidth(defaultWidth)
    // Only sync defaultWidth to currentWidth if there's no controlled width
    if (controlledWidth === undefined && !controlledWidthChanged) {
      setCurrentWidth(defaultWidth)
    }
  }

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

  const saveWidth = React.useCallback((value: number) => {
    currentWidthRef.current = value
    // Visual update already done via inline styles - React state sync is non-urgent
    startTransition(() => {
      setCurrentWidth(value)
    })

    const config = resizableRef.current

    // Handle localStorage persistence: resizable === true or {persist: 'localStorage'}
    if (config === true || (isPersistConfig(config) && config.persist === 'localStorage')) {
      localStoragePersister.save(widthStorageKeyRef.current, value)
    } else if (isPersistConfig(config) && isCustomPersistFunction(config.persist)) {
      try {
        const result = config.persist(value, {widthStorageKey: widthStorageKeyRef.current})
        // Handle async rejections silently
        if (result instanceof Promise) {
          // eslint-disable-next-line github/no-then
          result.catch(() => {
            // Ignore - consumer should handle their own errors
          })
        }
      } catch {
        // Ignore sync errors
      }
    }
  }, [])

  // --- Effects ---
  // Stable ref to getMaxPaneWidth for use in resize handler without re-subscribing
  const getMaxPaneWidthRef = React.useRef(getMaxPaneWidth)
  useIsomorphicLayoutEffect(() => {
    getMaxPaneWidthRef.current = getMaxPaneWidth
  })

  // Update CSS variable, refs, and ARIA on mount and window resize.
  // Strategy: Only sync when resize stops (debounced) to avoid layout thrashing on large DOMs
  useIsomorphicLayoutEffect(() => {
    if (!isResizableEnabled(resizableRef.current)) return

    let lastViewportWidth = window.innerWidth

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
