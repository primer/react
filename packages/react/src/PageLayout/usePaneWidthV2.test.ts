import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {renderHook, act} from '@testing-library/react'
import {usePaneWidthV2, defaultPaneWidth} from './usePaneWidth'
import type React from 'react'

// Mock refs for hook testing
const createMockRefs = () => ({
  paneRef: {current: document.createElement('div')} as React.RefObject<HTMLDivElement>,
  handleRef: {current: document.createElement('div')} as React.RefObject<HTMLDivElement>,
  contentWrapperRef: {current: document.createElement('div')} as React.RefObject<HTMLDivElement>,
})

describe('usePaneWidthV2', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1280)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('initialization', () => {
    it('should initialize with default width for preset size', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 'medium',
          minWidth: 256,
          resizable: true,
          ...refs,
        }),
      )

      expect(result.current.currentWidth).toBe(defaultPaneWidth.medium)
    })

    it('should initialize with numeric default width', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 350,
          minWidth: 256,
          resizable: true,
          ...refs,
        }),
      )

      expect(result.current.currentWidth).toBe(350)
    })

    it('should use controlled width when provided', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 300,
          controlledWidth: 400,
          minWidth: 256,
          resizable: true,
          ...refs,
        }),
      )

      expect(result.current.currentWidth).toBe(400)
    })

    it('should initialize maxPaneWidth to calculated value', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 'medium',
          minWidth: 256,
          resizable: true,
          ...refs,
        }),
      )

      // maxPaneWidth is calculated from viewport width minus default diff
      expect(result.current.maxPaneWidth).toBeGreaterThan(256)
      expect(result.current.maxPaneWidth).toBeLessThan(1280)
    })

    it('should use custom maxWidth when provided', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 'medium',
          minWidth: 256,
          maxWidth: 500,
          resizable: true,
          ...refs,
        }),
      )

      expect(result.current.maxPaneWidth).toBe(500)
    })
  })

  describe('controlled vs uncontrolled', () => {
    it('should work as uncontrolled component', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 300,
          minWidth: 256,
          resizable: true,
          ...refs,
        }),
      )

      expect(result.current.currentWidth).toBe(300)

      act(() => {
        result.current.saveWidth(350)
      })

      expect(result.current.currentWidth).toBe(350)
    })

    it('should work as controlled component', () => {
      const refs = createMockRefs()
      const {result, rerender} = renderHook(
        ({controlledWidth}) =>
          usePaneWidthV2({
            defaultWidth: 300,
            controlledWidth,
            minWidth: 256,
            resizable: true,
            ...refs,
          }),
        {initialProps: {controlledWidth: 300}},
      )

      expect(result.current.currentWidth).toBe(300)

      // In controlled mode, width only changes when prop changes
      act(() => {
        result.current.saveWidth(350)
      })

      // Width hasn't changed yet because we haven't updated the prop
      expect(result.current.currentWidth).toBe(300)

      // Update the prop
      rerender({controlledWidth: 350})

      // Now it should reflect the new value
      expect(result.current.currentWidth).toBe(350)
    })

    it('should call onWidthChange when width changes', () => {
      const refs = createMockRefs()
      const onWidthChange = vi.fn()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 300,
          onWidthChange,
          minWidth: 256,
          resizable: true,
          ...refs,
        }),
      )

      act(() => {
        result.current.saveWidth(350)
      })

      expect(onWidthChange).toHaveBeenCalledWith(350)
    })

    it('should call onWidthChange even in controlled mode', () => {
      const refs = createMockRefs()
      const onWidthChange = vi.fn()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 300,
          controlledWidth: 300,
          onWidthChange,
          minWidth: 256,
          resizable: true,
          ...refs,
        }),
      )

      act(() => {
        result.current.saveWidth(350)
      })

      expect(onWidthChange).toHaveBeenCalledWith(350)
    })
  })

  describe('width constraints', () => {
    it('should respect minWidth', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 300,
          minWidth: 256,
          resizable: true,
          ...refs,
        }),
      )

      expect(result.current.minPaneWidth).toBe(256)
    })

    it('should calculate getMaxPaneWidth from viewport when no custom maxWidth', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 300,
          minWidth: 256,
          resizable: true,
          ...refs,
        }),
      )

      const calculatedMax = result.current.getMaxPaneWidth()
      // Should be based on viewport width minus some margin
      expect(calculatedMax).toBeGreaterThan(256)
      expect(calculatedMax).toBeLessThan(1280)
    })

    it('should use custom maxWidth when provided', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 300,
          minWidth: 256,
          maxWidth: 500,
          resizable: true,
          ...refs,
        }),
      )

      expect(result.current.getMaxPaneWidth()).toBe(500)
      expect(result.current.maxPaneWidth).toBe(500)
    })
  })

  describe('getDefaultWidth', () => {
    it('should return the resolved default width for preset', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 'large',
          minWidth: 256,
          resizable: true,
          ...refs,
        }),
      )

      expect(result.current.getDefaultWidth()).toBe(defaultPaneWidth.large)
    })

    it('should return the numeric default width', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 350,
          minWidth: 256,
          resizable: true,
          ...refs,
        }),
      )

      expect(result.current.getDefaultWidth()).toBe(350)
    })
  })

  describe('non-resizable mode', () => {
    it('should still return width values when not resizable', () => {
      const refs = createMockRefs()
      const {result} = renderHook(() =>
        usePaneWidthV2({
          defaultWidth: 'medium',
          minWidth: 256,
          resizable: false,
          ...refs,
        }),
      )

      expect(result.current.currentWidth).toBe(defaultPaneWidth.medium)
      expect(result.current.minPaneWidth).toBe(256)
    })
  })

  describe('defaultWidth changes', () => {
    it('should update width when defaultWidth changes in uncontrolled mode', () => {
      const refs = createMockRefs()
      const {result, rerender} = renderHook(
        ({defaultWidth}: {defaultWidth: number | 'small' | 'medium' | 'large'}) =>
          usePaneWidthV2({
            defaultWidth,
            minWidth: 256,
            resizable: true,
            ...refs,
          }),
        {initialProps: {defaultWidth: 'small'}},
      )

      expect(result.current.currentWidth).toBe(defaultPaneWidth.small)

      rerender({defaultWidth: 'large'})

      expect(result.current.currentWidth).toBe(defaultPaneWidth.large)
    })

    it('should not update width when defaultWidth changes in controlled mode', () => {
      const refs = createMockRefs()
      const {result, rerender} = renderHook(
        ({
          defaultWidth,
          controlledWidth,
        }: {
          defaultWidth: number | 'small' | 'medium' | 'large'
          controlledWidth: number
        }) =>
          usePaneWidthV2({
            defaultWidth,
            controlledWidth,
            minWidth: 256,
            resizable: true,
            ...refs,
          }),
        {initialProps: {defaultWidth: 'small', controlledWidth: 300}},
      )

      expect(result.current.currentWidth).toBe(300)

      // Changing defaultWidth shouldn't affect controlled width
      rerender({defaultWidth: 'large', controlledWidth: 300})

      expect(result.current.currentWidth).toBe(300)
    })
  })
})
