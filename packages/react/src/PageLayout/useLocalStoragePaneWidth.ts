import {useState, useCallback, useEffect, startTransition} from 'react'
import {defaultPaneWidth} from './usePaneWidth'

export type UseLocalStoragePaneWidthOptions = {
  /** Default width in pixels or a named size */
  defaultWidth: number | 'small' | 'medium' | 'large'
  /** Minimum width in pixels (default: 256) */
  minWidth?: number
  /** Maximum width in pixels (default: viewport-based) */
  maxWidth?: number
}

/**
 * Hook for managing pane width with localStorage persistence.
 * SSR-safe - initializes with defaultWidth on server, syncs from localStorage on client.
 *
 * @param key - localStorage key for persisting the width
 * @param options - Configuration options
 * @returns [currentWidth, setWidth] - Current width and setter function
 *
 * @example
 * ```tsx
 * const [width, setWidth] = useLocalStoragePaneWidth('my-pane-key', {
 *   defaultWidth: defaultPaneWidth.medium,
 *   minWidth: 256,
 * })
 *
 * <PageLayout.Pane
 *   resizable
 *   width={width}
 *   onWidthChange={setWidth}
 * />
 * ```
 */
export function useLocalStoragePaneWidth(
  key: string,
  options: UseLocalStoragePaneWidthOptions,
): [number, (width: number) => void] {
  const {defaultWidth: defaultWidthProp, minWidth = 256, maxWidth} = options

  // Resolve defaultWidth to a number
  const defaultWidth = typeof defaultWidthProp === 'string' ? defaultPaneWidth[defaultWidthProp] : defaultWidthProp

  // Initialize with defaultWidth (SSR-safe)
  const [width, setWidthState] = useState(defaultWidth)
  const [hasHydrated, setHasHydrated] = useState(false)

  // Sync from localStorage after mount (SSR-safe)
  useEffect(() => {
    startTransition(() => {
      try {
        const storedWidth = localStorage.getItem(key)
        if (storedWidth !== null) {
          const parsed = Number(storedWidth)
          if (!isNaN(parsed) && parsed > 0) {
            // Clamp to constraints
            const clampedWidth = Math.max(minWidth, maxWidth !== undefined ? Math.min(maxWidth, parsed) : parsed)
            setWidthState(clampedWidth)
          }
        }
      } catch {
        // localStorage unavailable - continue with defaultWidth
      }
      setHasHydrated(true)
    })
  }, [key, minWidth, maxWidth])

  // Setter that persists to localStorage
  const setWidth = useCallback(
    (newWidth: number) => {
      // Clamp to constraints
      const clampedWidth = Math.max(minWidth, maxWidth !== undefined ? Math.min(maxWidth, newWidth) : newWidth)

      setWidthState(clampedWidth)

      // Only save to localStorage after hydration to avoid issues
      if (hasHydrated) {
        try {
          localStorage.setItem(key, clampedWidth.toString())
        } catch {
          // Ignore write errors (private browsing, quota exceeded, etc.)
        }
      }
    },
    [key, minWidth, maxWidth, hasHydrated],
  )

  return [width, setWidth]
}
