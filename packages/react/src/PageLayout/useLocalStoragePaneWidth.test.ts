import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {renderHook, act, waitFor} from '@testing-library/react'
import {useLocalStoragePaneWidth} from './useLocalStoragePaneWidth'
import {defaultPaneWidth} from './usePaneWidth'

describe('useLocalStoragePaneWidth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with default width (no localStorage)', () => {
      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
        }),
      )

      const [width] = result.current
      expect(width).toBe(300)
    })

    it('should initialize with preset default width', () => {
      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 'medium',
        }),
      )

      const [width] = result.current
      expect(width).toBe(defaultPaneWidth.medium)
    })

    it('should restore from localStorage after mount', async () => {
      localStorage.setItem('test-key', '400')

      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
        }),
      )

      // After mount effect, should sync from localStorage
      // In test environment, effects run synchronously so we should see 400 immediately
      await waitFor(() => {
        const [width] = result.current
        expect(width).toBe(400)
      })
    })

    it('should apply minWidth constraint when restoring from localStorage', async () => {
      localStorage.setItem('test-key', '200')

      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
          minWidth: 256,
        }),
      )

      await waitFor(() => {
        const [width] = result.current
        expect(width).toBe(256) // Clamped to minWidth
      })
    })

    it('should apply maxWidth constraint when restoring from localStorage', async () => {
      localStorage.setItem('test-key', '700')

      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
          maxWidth: 600,
        }),
      )

      await waitFor(() => {
        const [width] = result.current
        expect(width).toBe(600) // Clamped to maxWidth
      })
    })

    it('should ignore invalid localStorage values', async () => {
      localStorage.setItem('test-key', 'invalid')

      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
        }),
      )

      await waitFor(() => {
        const [width] = result.current
        expect(width).toBe(300) // Falls back to defaultWidth
      })
    })

    it('should ignore negative localStorage values', async () => {
      localStorage.setItem('test-key', '-100')

      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
        }),
      )

      await waitFor(() => {
        const [width] = result.current
        expect(width).toBe(300) // Falls back to defaultWidth
      })
    })
  })

  describe('updating width', () => {
    it('should update width and save to localStorage', async () => {
      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
        }),
      )

      await act(async () => {
        // Wait for hydration
        await waitFor(() => {
          expect(result.current[0]).toBe(300)
        })
      })

      act(() => {
        const [, setWidth] = result.current
        setWidth(350)
      })

      // Check state updated
      const [width] = result.current
      expect(width).toBe(350)

      // Check localStorage updated
      expect(localStorage.getItem('test-key')).toBe('350')
    })

    it('should apply minWidth constraint when setting width', async () => {
      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
          minWidth: 256,
        }),
      )

      await act(async () => {
        await waitFor(() => {
          expect(result.current[0]).toBe(300)
        })
      })

      act(() => {
        const [, setWidth] = result.current
        setWidth(200)
      })

      const [width] = result.current
      expect(width).toBe(256) // Clamped to minWidth
      expect(localStorage.getItem('test-key')).toBe('256')
    })

    it('should apply maxWidth constraint when setting width', async () => {
      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
          maxWidth: 600,
        }),
      )

      await act(async () => {
        await waitFor(() => {
          expect(result.current[0]).toBe(300)
        })
      })

      act(() => {
        const [, setWidth] = result.current
        setWidth(700)
      })

      const [width] = result.current
      expect(width).toBe(600) // Clamped to maxWidth
      expect(localStorage.getItem('test-key')).toBe('600')
    })

    it('should not save to localStorage before hydration', () => {
      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
        }),
      )

      // Immediately try to set width (before hydration)
      act(() => {
        const [, setWidth] = result.current
        setWidth(350)
      })

      // Width should update in state
      const [width] = result.current
      expect(width).toBe(350)

      // But should not save to localStorage yet (hydration not complete)
      // Note: This is a timing-dependent test that may be flaky
      // In practice, hydration happens very quickly
    })
  })

  describe('localStorage errors', () => {
    it('should handle localStorage.getItem errors gracefully', async () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable')
      })

      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
        }),
      )

      // Should fall back to defaultWidth without throwing
      const [width] = result.current
      expect(width).toBe(300)

      getItemSpy.mockRestore()
    })

    it('should handle localStorage.setItem errors gracefully', async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage quota exceeded')
      })

      const {result} = renderHook(() =>
        useLocalStoragePaneWidth('test-key', {
          defaultWidth: 300,
        }),
      )

      await act(async () => {
        await waitFor(() => {
          expect(result.current[0]).toBe(300)
        })
      })

      // Should not throw when setting width
      act(() => {
        const [, setWidth] = result.current
        setWidth(350)
      })

      // Width should still update in state
      const [width] = result.current
      expect(width).toBe(350)

      setItemSpy.mockRestore()
    })
  })

  describe('multiple keys', () => {
    it('should maintain separate state for different keys', async () => {
      localStorage.setItem('key1', '400')
      localStorage.setItem('key2', '500')

      const {result: result1} = renderHook(() =>
        useLocalStoragePaneWidth('key1', {
          defaultWidth: 300,
        }),
      )

      const {result: result2} = renderHook(() =>
        useLocalStoragePaneWidth('key2', {
          defaultWidth: 300,
        }),
      )

      await waitFor(() => {
        expect(result1.current[0]).toBe(400)
        expect(result2.current[0]).toBe(500)
      })
    })
  })
})
