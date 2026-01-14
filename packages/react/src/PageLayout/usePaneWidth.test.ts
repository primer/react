import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {renderHook, act} from '@testing-library/react'
import {
  usePaneWidth,
  isCustomWidthOptions,
  isPaneWidth,
  getDefaultPaneWidth,
  getPaneMaxWidthDiff,
  updateAriaValues,
  defaultPaneWidth,
  DEFAULT_MAX_WIDTH_DIFF,
  SSR_DEFAULT_MAX_WIDTH,
  ARROW_KEY_STEP,
} from './usePaneWidth'

// Mock refs for hook testing
const createMockRefs = () => ({
  paneRef: {current: document.createElement('div')} as React.RefObject<HTMLDivElement>,
  handleRef: {current: document.createElement('div')} as React.RefObject<HTMLDivElement>,
  contentWrapperRef: {current: document.createElement('div')} as React.RefObject<HTMLDivElement>,
})

describe('usePaneWidth', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('innerWidth', 1280)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('initialization', () => {
    it('should initialize with default width for preset size', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-pane',
          ...refs,
        }),
      )

      expect(result.current.currentWidth).toBe(defaultPaneWidth.medium)
    })

    it('should initialize with custom width default', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidth({
          width: {min: '200px', default: '350px', max: '500px'},
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-pane',
          ...refs,
        }),
      )

      expect(result.current.currentWidth).toBe(350)
    })

    it('should restore width from localStorage on mount', () => {
      localStorage.setItem('test-pane', '400')
      const refs = createMockRefs()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-pane',
          ...refs,
        }),
      )

      expect(result.current.currentWidth).toBe(400)
    })

    it('should not restore from localStorage when not resizable', () => {
      localStorage.setItem('test-pane', '400')
      const refs = createMockRefs()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: false,
          widthStorageKey: 'test-pane',
          ...refs,
        }),
      )

      // Should use default, not localStorage value
      expect(result.current.currentWidth).toBe(defaultPaneWidth.medium)
    })

    it('should ignore invalid localStorage values', () => {
      localStorage.setItem('test-pane', 'invalid')
      const refs = createMockRefs()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-pane',
          ...refs,
        }),
      )

      expect(result.current.currentWidth).toBe(defaultPaneWidth.medium)
    })

    it('should ignore zero or negative localStorage values', () => {
      localStorage.setItem('test-pane', '0')
      const refs = createMockRefs()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-pane',
          ...refs,
        }),
      )

      expect(result.current.currentWidth).toBe(defaultPaneWidth.medium)
    })

    it('should not read from localStorage when onWidthChange is provided', () => {
      localStorage.setItem('test-pane', '500')
      const refs = createMockRefs()
      const onWidthChange = vi.fn()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-pane',
          onWidthChange,
          ...refs,
        }),
      )

      // Should use default, not localStorage value when onWidthChange is provided
      expect(result.current.currentWidth).toBe(defaultPaneWidth.medium)
    })

    it('should not save to localStorage when onWidthChange is provided', () => {
      const refs = createMockRefs()
      const onWidthChange = vi.fn()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-pane',
          onWidthChange,
          ...refs,
        }),
      )

      act(() => {
        result.current.saveWidth(450)
      })

      // Width state should update
      expect(result.current.currentWidth).toBe(450)
      // onWidthChange should be called
      expect(onWidthChange).toHaveBeenCalledWith(450)
      // But localStorage should not be written
      expect(localStorage.getItem('test-pane')).toBeNull()
    })

    it('should initialize with currentWidth prop when provided', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-pane',
          currentWidth: 400,
          ...refs,
        }),
      )

      // Should use currentWidth prop, not the default from width prop
      expect(result.current.currentWidth).toBe(400)
    })

    it('should prefer currentWidth prop over localStorage', () => {
      localStorage.setItem('test-pane', '350')
      const refs = createMockRefs()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-pane',
          currentWidth: 500,
          ...refs,
        }),
      )

      // Should use currentWidth prop, not localStorage
      expect(result.current.currentWidth).toBe(500)
    })

    it('should sync when currentWidth prop changes', () => {
      const refs = createMockRefs()

      const {result, rerender} = renderHook(
        ({currentWidth}: {currentWidth?: number}) =>
          usePaneWidth({
            width: 'medium',
            minWidth: 256,
            resizable: true,
            widthStorageKey: 'test-sync-resizable',
            currentWidth,
            ...refs,
          }),
        {initialProps: {currentWidth: 350}},
      )

      expect(result.current.currentWidth).toBe(350)

      // Change currentWidth prop
      rerender({currentWidth: 450})

      expect(result.current.currentWidth).toBe(450)
    })

    it('should fall back to default when currentWidth prop is removed', () => {
      const refs = createMockRefs()

      type Props = {currentWidth?: number}
      const {result, rerender} = renderHook(
        ({currentWidth}: Props) =>
          usePaneWidth({
            width: 'medium',
            minWidth: 256,
            resizable: true,
            widthStorageKey: 'test-fallback',
            currentWidth,
            ...refs,
          }),
        {initialProps: {currentWidth: 400} as Props},
      )

      expect(result.current.currentWidth).toBe(400)

      // Remove currentWidth prop by not passing it
      rerender({} as Props)

      // Should fall back to default from width prop
      expect(result.current.currentWidth).toBe(defaultPaneWidth.medium)
    })

    it('should not sync width prop default when currentWidth prop is provided', () => {
      const refs = createMockRefs()
      type WidthType = 'small' | 'medium' | 'large'

      const {result, rerender} = renderHook(
        ({width, currentWidth}: {width: WidthType; currentWidth: number}) =>
          usePaneWidth({
            width,
            minWidth: 256,
            resizable: true,
            widthStorageKey: 'test-no-sync',
            currentWidth,
            ...refs,
          }),
        {
          initialProps: {
            width: 'medium' as WidthType,
            currentWidth: 400,
          },
        },
      )

      expect(result.current.currentWidth).toBe(400)

      // Change width prop (default changes from 296 to 320)
      rerender({width: 'large', currentWidth: 400})

      // Should NOT sync to new default because currentWidth prop is controlling
      expect(result.current.currentWidth).toBe(400)
    })
  })

  describe('saveWidth', () => {
    it('should update state and localStorage', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-save',
          ...refs,
        }),
      )

      act(() => {
        result.current.saveWidth(450)
      })

      expect(result.current.currentWidth).toBe(450)
      expect(result.current.currentWidthRef.current).toBe(450)
      expect(localStorage.getItem('test-save')).toBe('450')
    })

    it('should handle localStorage write errors gracefully', () => {
      const refs = createMockRefs()

      // Mock localStorage.setItem to throw
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceeded')
      })

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-save',
          ...refs,
        }),
      )

      // Should not throw
      act(() => {
        result.current.saveWidth(450)
      })

      // State should still update
      expect(result.current.currentWidth).toBe(450)

      localStorage.setItem = originalSetItem
    })

    it('should call onWidthChange instead of localStorage when provided', () => {
      const onWidthChange = vi.fn()
      const refs = createMockRefs()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-onWidthChange',
          onWidthChange,
          ...refs,
        }),
      )

      act(() => {
        result.current.saveWidth(450)
      })

      expect(result.current.currentWidth).toBe(450)
      expect(onWidthChange).toHaveBeenCalledWith(450)
      // Should NOT write to localStorage when onWidthChange is provided
      expect(localStorage.getItem('test-onWidthChange')).toBeNull()
    })

    it('should handle errors from onWidthChange gracefully', () => {
      const onWidthChange = vi.fn(() => {
        throw new Error('Consumer callback error')
      })
      const refs = createMockRefs()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-onWidthChange-error',
          onWidthChange,
          ...refs,
        }),
      )

      // Should not throw - state should still update
      act(() => {
        result.current.saveWidth(450)
      })

      expect(result.current.currentWidth).toBe(450)
      expect(onWidthChange).toHaveBeenCalledWith(450)
    })
  })

  describe('width prop sync (controlled mode)', () => {
    it('should sync internal state when width prop changes', () => {
      const refs = createMockRefs()

      const {result, rerender} = renderHook(
        ({width}: {width: 'small' | 'medium' | 'large'}) =>
          usePaneWidth({
            width,
            minWidth: 256,
            resizable: true,
            widthStorageKey: 'test-sync',
            ...refs,
          }),
        {initialProps: {width: 'medium' as 'small' | 'medium' | 'large'}},
      )

      expect(result.current.currentWidth).toBe(defaultPaneWidth.medium)

      // Change width prop
      rerender({width: 'large'})

      expect(result.current.currentWidth).toBe(defaultPaneWidth.large)
    })

    it('should sync when width changes to custom width', () => {
      const refs = createMockRefs()
      type WidthType = 'medium' | {min: `${number}px`; default: `${number}px`; max: `${number}px`}

      const {result, rerender} = renderHook(
        ({width}: {width: WidthType}) =>
          usePaneWidth({
            width,
            minWidth: 256,
            resizable: true,
            widthStorageKey: 'test-sync-custom',
            ...refs,
          }),
        {initialProps: {width: 'medium' as WidthType}},
      )

      expect(result.current.currentWidth).toBe(defaultPaneWidth.medium)

      // Change to custom width
      rerender({width: {min: '200px', default: '400px', max: '600px'}})

      expect(result.current.currentWidth).toBe(400)
    })
  })

  describe('minPaneWidth', () => {
    it('should use minWidth prop for preset widths', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 200,
          resizable: true,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      expect(result.current.minPaneWidth).toBe(200)
    })

    it('should use width.min for custom widths', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidth({
          width: {min: '150px', default: '300px', max: '500px'},
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      expect(result.current.minPaneWidth).toBe(150)
    })
  })

  describe('maxPaneWidth', () => {
    it('should use SSR default initially for preset widths', () => {
      const refs = createMockRefs()
      // We need to test the initial state before effects run
      // Since we're in browser environment, the effect runs immediately
      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: false, // Disable to prevent effect from updating
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      expect(result.current.maxPaneWidth).toBe(SSR_DEFAULT_MAX_WIDTH)
    })

    it('should use custom max for custom widths', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidth({
          width: {min: '150px', default: '300px', max: '500px'},
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      expect(result.current.maxPaneWidth).toBe(500)
    })
  })

  describe('getMaxPaneWidth', () => {
    it('should return custom max for custom widths regardless of viewport', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidth({
          width: {min: '150px', default: '300px', max: '400px'},
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      expect(result.current.getMaxPaneWidth()).toBe(400)

      // Even if viewport changes, custom max is fixed
      vi.stubGlobal('innerWidth', 500)
      expect(result.current.getMaxPaneWidth()).toBe(400)
    })

    it('should calculate max based on viewport for preset widths', () => {
      const refs = createMockRefs()
      vi.stubGlobal('innerWidth', 1280)

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      // viewport (1280) - DEFAULT_MAX_WIDTH_DIFF (511) = 769
      expect(result.current.getMaxPaneWidth()).toBe(769)
    })

    it('should return minPaneWidth when viewport is too small', () => {
      const refs = createMockRefs()
      vi.stubGlobal('innerWidth', 300) // Very small viewport

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      // 300 - 511 = -211, so Math.max(256, -211) = 256
      expect(result.current.getMaxPaneWidth()).toBe(256)
    })
  })

  describe('getDefaultWidth', () => {
    it('should return default for preset width', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'large',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      expect(result.current.getDefaultWidth()).toBe(defaultPaneWidth.large)
    })

    it('should return custom default for custom widths', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidth({
          width: {min: '150px', default: '275px', max: '500px'},
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      expect(result.current.getDefaultWidth()).toBe(275)
    })
  })

  describe('resize listener', () => {
    it('should add debounced resize listener for preset widths', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const refs = createMockRefs()

      renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      // Adds resize listener for throttled CSS updates and debounced state sync
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      addEventListenerSpy.mockRestore()
    })

    it('should not add resize listener for custom widths (fixed max)', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const refs = createMockRefs()

      renderHook(() =>
        usePaneWidth({
          width: {min: '150px', default: '300px', max: '400px'},
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-custom',
          ...refs,
        }),
      )

      // Custom widths have fixed max - no need for resize listener
      expect(addEventListenerSpy).not.toHaveBeenCalledWith('resize', expect.any(Function), expect.anything())
      addEventListenerSpy.mockRestore()
    })

    it('should clamp ref when viewport shrinks', async () => {
      vi.useFakeTimers()
      vi.stubGlobal('innerWidth', 1280)
      const refs = createMockRefs()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-clamp',
          ...refs,
        }),
      )

      // Set current width to max
      const initialMax = result.current.getMaxPaneWidth() // 1280 - 511 = 769
      result.current.currentWidthRef.current = initialMax

      // Shrink viewport
      vi.stubGlobal('innerWidth', 800)

      // Wrap resize + throttle in act() since it triggers startTransition state update
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
        await vi.runAllTimersAsync()
      })

      // getMaxPaneWidth now returns 800 - 511 = 289
      expect(result.current.getMaxPaneWidth()).toBe(289)
      // ref should be clamped after resize handler fires
      expect(result.current.currentWidthRef.current).toBe(289)

      vi.useRealTimers()
    })

    it('should throttle CSS variable update', async () => {
      vi.useFakeTimers()
      vi.stubGlobal('innerWidth', 1280)
      const refs = createMockRefs()

      renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-css-throttle',
          ...refs,
        }),
      )

      // Initial --pane-max-width should be set on mount
      expect(refs.paneRef.current?.style.getPropertyValue('--pane-max-width')).toBe('769px')

      // Shrink viewport
      vi.stubGlobal('innerWidth', 1000)

      // Fire resize - with throttle, first update happens immediately (if THROTTLE_MS passed)
      window.dispatchEvent(new Event('resize'))

      // Since Date.now() starts at 0 and lastUpdateTime is 0, first update should happen immediately
      // but it's in rAF, so we need to advance through rAF
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // CSS variable should now be updated: 1000 - 511 = 489
      expect(refs.paneRef.current?.style.getPropertyValue('--pane-max-width')).toBe('489px')

      vi.useRealTimers()
    })

    it('should update ARIA attributes after throttle', async () => {
      vi.useFakeTimers()
      vi.stubGlobal('innerWidth', 1280)
      const refs = createMockRefs()

      renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-aria-throttle',
          ...refs,
        }),
      )

      // Initial ARIA max should be set on mount
      expect(refs.handleRef.current?.getAttribute('aria-valuemax')).toBe('769')

      // Shrink viewport
      vi.stubGlobal('innerWidth', 900)

      // Fire resize - with throttle, update happens via rAF
      window.dispatchEvent(new Event('resize'))

      // Wait for rAF to complete
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // ARIA should now be updated: 900 - 511 = 389
      expect(refs.handleRef.current?.getAttribute('aria-valuemax')).toBe('389')

      vi.useRealTimers()
    })

    it('should throttle full sync on rapid resize', async () => {
      vi.useFakeTimers()
      vi.stubGlobal('innerWidth', 1280)
      const refs = createMockRefs()

      const setPropertySpy = vi.spyOn(refs.paneRef.current!.style, 'setProperty')

      renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-throttle',
          ...refs,
        }),
      )

      // Clear mount calls
      setPropertySpy.mockClear()

      // Fire resize events rapidly
      vi.stubGlobal('innerWidth', 1100)
      window.dispatchEvent(new Event('resize'))

      // With throttle, CSS should update immediately or via rAF
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // First update should have happened: 1100 - 511 = 589
      expect(setPropertySpy).toHaveBeenCalledWith('--pane-max-width', '589px')

      // Clear for next test
      setPropertySpy.mockClear()

      // Fire more resize events rapidly (within throttle window)
      for (let i = 0; i < 3; i++) {
        vi.stubGlobal('innerWidth', 1000 - i * 50)
        window.dispatchEvent(new Event('resize'))
      }

      // Should schedule via rAF
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Now CSS and ARIA should be synced with final viewport value (900)
      expect(setPropertySpy).toHaveBeenCalledWith('--pane-max-width', '389px') // 900 - 511
      expect(refs.handleRef.current?.getAttribute('aria-valuemax')).toBe('389')

      vi.useRealTimers()
    })

    it('should update React state via startTransition after throttle', async () => {
      vi.useFakeTimers()
      vi.stubGlobal('innerWidth', 1280)
      const refs = createMockRefs()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-state-transition',
          ...refs,
        }),
      )

      // Initial maxPaneWidth state
      expect(result.current.maxPaneWidth).toBe(769)

      // Shrink viewport
      vi.stubGlobal('innerWidth', 800)
      window.dispatchEvent(new Event('resize'))

      // After throttle (via rAF), state updated via startTransition
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // State now reflects new max: 800 - 511 = 289
      expect(result.current.maxPaneWidth).toBe(289)

      vi.useRealTimers()
    })

    it('should cleanup resize listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame')
      const refs = createMockRefs()

      const {unmount} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      // cancelAnimationFrame called with null is fine (no pending RAF)
      removeEventListenerSpy.mockRestore()
      cancelAnimationFrameSpy.mockRestore()
    })

    it('should not add resize listener when not resizable', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const refs = createMockRefs()

      renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: false,
          widthStorageKey: 'test-not-resizable',
          ...refs,
        }),
      )

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('resize', expect.any(Function))
      addEventListenerSpy.mockRestore()
    })

    it('should apply and remove containment attributes during resize', async () => {
      vi.useFakeTimers()
      vi.stubGlobal('innerWidth', 1280)
      const refs = createMockRefs()

      renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-containment',
          ...refs,
        }),
      )

      // Initially no data-dragging attribute
      expect(refs.paneRef.current?.hasAttribute('data-dragging')).toBe(false)
      expect(refs.contentWrapperRef.current?.hasAttribute('data-dragging')).toBe(false)

      // Fire resize
      vi.stubGlobal('innerWidth', 1000)
      window.dispatchEvent(new Event('resize'))

      // Attribute should be applied immediately on first resize
      expect(refs.paneRef.current?.hasAttribute('data-dragging')).toBe(true)
      expect(refs.contentWrapperRef.current?.hasAttribute('data-dragging')).toBe(true)

      // Fire another resize event immediately (simulating continuous resize)
      vi.stubGlobal('innerWidth', 900)
      window.dispatchEvent(new Event('resize'))

      // Attribute should still be present (containment stays on during continuous resize)
      expect(refs.paneRef.current?.hasAttribute('data-dragging')).toBe(true)
      expect(refs.contentWrapperRef.current?.hasAttribute('data-dragging')).toBe(true)

      // Wait for the debounce timeout (150ms) to complete after resize stops
      await act(async () => {
        await vi.advanceTimersByTimeAsync(150)
      })

      // Attribute should be removed after debounce completes
      expect(refs.paneRef.current?.hasAttribute('data-dragging')).toBe(false)
      expect(refs.contentWrapperRef.current?.hasAttribute('data-dragging')).toBe(false)

      vi.useRealTimers()
    })

    it('should cleanup containment attributes on unmount during resize', async () => {
      vi.useFakeTimers()
      vi.stubGlobal('innerWidth', 1280)
      const refs = createMockRefs()

      const {unmount} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-cleanup-containment',
          ...refs,
        }),
      )

      // Fire resize
      vi.stubGlobal('innerWidth', 1000)
      window.dispatchEvent(new Event('resize'))

      // Attribute should be applied
      expect(refs.paneRef.current?.hasAttribute('data-dragging')).toBe(true)
      expect(refs.contentWrapperRef.current?.hasAttribute('data-dragging')).toBe(true)

      // Unmount immediately (before debounce timer fires)
      unmount()

      // Attribute should be cleaned up on unmount regardless of timing
      expect(refs.paneRef.current?.hasAttribute('data-dragging')).toBe(false)
      expect(refs.contentWrapperRef.current?.hasAttribute('data-dragging')).toBe(false)

      vi.useRealTimers()
    })
  })

  describe('on-demand max calculation', () => {
    it('should calculate max dynamically based on current viewport', () => {
      vi.stubGlobal('innerWidth', 1280)
      const refs = createMockRefs()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-dynamic',
          ...refs,
        }),
      )

      // Initial max at 1280px: 1280 - 511 = 769
      expect(result.current.getMaxPaneWidth()).toBe(769)

      // Viewport changes (no resize event needed)
      vi.stubGlobal('innerWidth', 800)

      // getMaxPaneWidth reads window.innerWidth dynamically
      expect(result.current.getMaxPaneWidth()).toBe(289)
    })

    it('should return custom max regardless of viewport for custom widths', () => {
      vi.stubGlobal('innerWidth', 1280)
      const refs = createMockRefs()

      const {result} = renderHook(() =>
        usePaneWidth({
          width: {min: '150px', default: '300px', max: '400px'},
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test-custom',
          ...refs,
        }),
      )

      expect(result.current.getMaxPaneWidth()).toBe(400)

      // Viewport changes don't affect custom max
      vi.stubGlobal('innerWidth', 500)
      expect(result.current.getMaxPaneWidth()).toBe(400)
    })
  })
})

describe('helper functions', () => {
  describe('isCustomWidthOptions', () => {
    it('should return true for custom width objects', () => {
      expect(isCustomWidthOptions({min: '100px', default: '200px', max: '300px'})).toBe(true)
    })

    it('should return false for preset width strings', () => {
      expect(isCustomWidthOptions('small')).toBe(false)
      expect(isCustomWidthOptions('medium')).toBe(false)
      expect(isCustomWidthOptions('large')).toBe(false)
    })
  })

  describe('isPaneWidth', () => {
    it('should return true for valid preset widths', () => {
      expect(isPaneWidth('small')).toBe(true)
      expect(isPaneWidth('medium')).toBe(true)
      expect(isPaneWidth('large')).toBe(true)
    })

    it('should return false for custom width objects', () => {
      expect(isPaneWidth({min: '100px', default: '200px', max: '300px'})).toBe(false)
    })
  })

  describe('getDefaultPaneWidth', () => {
    it('should return correct default for preset widths', () => {
      expect(getDefaultPaneWidth('small')).toBe(defaultPaneWidth.small)
      expect(getDefaultPaneWidth('medium')).toBe(defaultPaneWidth.medium)
      expect(getDefaultPaneWidth('large')).toBe(defaultPaneWidth.large)
    })

    it('should parse custom width default', () => {
      expect(getDefaultPaneWidth({min: '100px', default: '250px', max: '400px'})).toBe(250)
    })
  })

  describe('getPaneMaxWidthDiff', () => {
    it('should return default when element is null', () => {
      expect(getPaneMaxWidthDiff(null)).toBe(DEFAULT_MAX_WIDTH_DIFF)
    })

    it('should return default when CSS variable is not set', () => {
      const element = document.createElement('div')
      expect(getPaneMaxWidthDiff(element)).toBe(DEFAULT_MAX_WIDTH_DIFF)
    })
  })

  describe('updateAriaValues', () => {
    it('should set ARIA attributes on element', () => {
      const handle = document.createElement('div')

      updateAriaValues(handle, {min: 100, max: 500, current: 300})

      expect(handle.getAttribute('aria-valuemin')).toBe('100')
      expect(handle.getAttribute('aria-valuemax')).toBe('500')
      expect(handle.getAttribute('aria-valuenow')).toBe('300')
      expect(handle.getAttribute('aria-valuetext')).toBe('Pane width 300 pixels')
    })

    it('should handle null element gracefully', () => {
      // Should not throw
      expect(() => updateAriaValues(null, {min: 100, max: 500, current: 300})).not.toThrow()
    })

    it('should only update provided values', () => {
      const handle = document.createElement('div')
      handle.setAttribute('aria-valuemin', '50')
      handle.setAttribute('aria-valuemax', '600')

      updateAriaValues(handle, {current: 300})

      // Original values unchanged
      expect(handle.getAttribute('aria-valuemin')).toBe('50')
      expect(handle.getAttribute('aria-valuemax')).toBe('600')
      // Updated value
      expect(handle.getAttribute('aria-valuenow')).toBe('300')
    })
  })
})

describe('constants', () => {
  it('should export expected constants', () => {
    expect(DEFAULT_MAX_WIDTH_DIFF).toBe(511)
    expect(SSR_DEFAULT_MAX_WIDTH).toBe(600)
    expect(ARROW_KEY_STEP).toBe(3)
    expect(defaultPaneWidth).toEqual({small: 256, medium: 296, large: 320})
  })

  /**
   * This test documents the CSS/JS coupling.
   * The CSS variable --pane-max-width-diff changes at a breakpoint:
   *   - Below breakpoint: 511px (DEFAULT_MAX_WIDTH_DIFF)
   *   - At/above breakpoint: 959px
   *
   * The breakpoint value is exported from PageLayout.module.css via :export
   * and imported into usePaneWidth.ts, so they stay in sync automatically.
   */
  it('should have DEFAULT_MAX_WIDTH_DIFF matching CSS value below breakpoint', () => {
    // This constant must match --pane-max-width-diff in PageLayout.module.css
    // for viewports below the breakpoint.
    expect(DEFAULT_MAX_WIDTH_DIFF).toBe(511)
  })
})


