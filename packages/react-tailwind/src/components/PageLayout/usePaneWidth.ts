import React from 'react'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect

export type PaneWidth = 'small' | 'medium' | 'large'
export type CustomWidthOptions = {min: `${number}px`; default: `${number}px`; max: `${number}px`}
export type PaneWidthValue = PaneWidth | CustomWidthOptions

export const defaultPaneWidth: Record<PaneWidth, number> = {small: 256, medium: 296, large: 320}
export const ARROW_KEY_STEP = 3
export const SSR_DEFAULT_MAX_WIDTH = 600
export const defaultFormatValueText = (value: number) => `Pane width ${value} pixels`

export const isPaneWidth = (value: PaneWidthValue): value is PaneWidth => typeof value === 'string'
export const isCustomWidthOptions = (value: PaneWidthValue): value is CustomWidthOptions => typeof value === 'object'
export const getDefaultPaneWidth = (value: PaneWidthValue) =>
  isPaneWidth(value) ? defaultPaneWidth[value] : Number.parseInt(value.default, 10)

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
  paneRef: React.RefObject<HTMLElement | null>
  handleRef: React.RefObject<HTMLElement | null>
  contentWrapperRef?: React.RefObject<HTMLElement | null>
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
  const defaultWidth = getDefaultPaneWidth(width)
  const customMax = custom ? Number.parseInt(width.max, 10) : undefined
  const getMaxPaneWidth = React.useCallback(() => {
    if (typeof window === 'undefined') return customMax ?? SSR_DEFAULT_MAX_WIDTH
    const viewportMax = Math.max(minPaneWidth, window.innerWidth - (constrainToViewport ? 256 : 511))
    return customMax === undefined ? viewportMax : constrainToViewport ? Math.min(customMax, viewportMax) : customMax
  }, [constrainToViewport, customMax, minPaneWidth])
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
    try {
      const stored = Number(window.localStorage.getItem(widthStorageKey))
      return stored > 0 ? stored : defaultWidth
    } catch {
      return defaultWidth
    }
  })
  const currentWidth = controlledWidth ?? uncontrolledWidth
  const currentWidthRef = React.useRef(currentWidth)
  const [maxPaneWidth, setMaxPaneWidth] = React.useState(customMax ?? SSR_DEFAULT_MAX_WIDTH)

  useIsomorphicLayoutEffect(() => {
    currentWidthRef.current = currentWidth
  }, [currentWidth])

  const saveWidth = React.useCallback(
    (value: number) => {
      const next = Math.round(value)
      currentWidthRef.current = next
      if (controlledWidth === undefined) setUncontrolledWidth(next)
      if (onResizeEnd) {
        onResizeEnd(next)
      } else if (resizable && widthStorageKey) {
        try {
          window.localStorage.setItem(widthStorageKey, String(next))
        } catch {
          // Storage may be unavailable (for example in private browsing).
        }
      }
    },
    [controlledWidth, onResizeEnd, resizable, widthStorageKey],
  )

  useIsomorphicLayoutEffect(() => {
    if (!resizable || typeof window === 'undefined') return
    const update = () => {
      const max = getMaxPaneWidth()
      const next = Math.min(max, Math.max(minPaneWidth, currentWidthRef.current))
      currentWidthRef.current = next
      paneRef.current?.style.setProperty('--pane-width', `${next}px`)
      paneRef.current?.style.setProperty('--pane-max-width', `${max}px`)
      updateAriaValues(handleRef.current, {current: next, min: minPaneWidth, max}, formatValueText)
      React.startTransition(() => {
        setMaxPaneWidth(max)
        if (controlledWidth === undefined) setUncontrolledWidth(next)
      })
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [
    controlledWidth,
    formatValueText,
    getMaxPaneWidth,
    handleRef,
    minPaneWidth,
    onResizeEnd,
    paneRef,
    resizable,
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
