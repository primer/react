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
    it('should not add resize listener when not resizable', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const refs = createMockRefs()

      renderHook(() =>
        usePaneWidth({
          width: 'medium',
          minWidth: 256,
          resizable: false,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('resize', expect.any(Function))
      addEventListenerSpy.mockRestore()
    })

    it('should not add resize listener for custom widths (max is fixed)', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const refs = createMockRefs()

      renderHook(() =>
        usePaneWidth({
          width: {min: '150px', default: '300px', max: '500px'},
          minWidth: 256,
          resizable: true,
          widthStorageKey: 'test',
          ...refs,
        }),
      )

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('resize', expect.any(Function))
      addEventListenerSpy.mockRestore()
    })

    it('should add resize listener for preset widths when resizable', () => {
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

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      addEventListenerSpy.mockRestore()
    })

    it('should cleanup resize listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
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
      removeEventListenerSpy.mockRestore()
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
