import {render, waitFor} from '@testing-library/react'
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {usePaneWidth} from './usePaneWidth'
import {useRef} from 'react'

describe('usePaneWidth', () => {
  let mockPane: HTMLDivElement

  beforeEach(() => {
    // Create a mock pane element
    mockPane = document.createElement('div')
    mockPane.style.setProperty('--pane-max-width-diff', '300px')
    mockPane.style.setProperty('--pane-min-width', '256px')

    // Mock getBoundingClientRect
    vi.spyOn(mockPane, 'getBoundingClientRect').mockReturnValue({
      width: 320,
      height: 600,
      top: 0,
      left: 0,
      right: 320,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    document.body.appendChild(mockPane)
  })

  afterEach(() => {
    document.body.removeChild(mockPane)
    vi.restoreAllMocks()
  })

  it('should calculate initial pane width metrics', async () => {
    const TestComponent = () => {
      const paneRef = useRef<HTMLDivElement>(mockPane)
      const {minWidth, maxWidth, currentWidth} = usePaneWidth({paneRef})

      return (
        <div>
          <span data-testid="min">{minWidth}</span>
          <span data-testid="max">{maxWidth}</span>
          <span data-testid="current">{currentWidth}</span>
        </div>
      )
    }

    const {getByTestId} = render(<TestComponent />)

    await waitFor(() => {
      expect(getByTestId('min').textContent).toBe('256')
      expect(getByTestId('max').textContent).toBe('724') // 1024 - 300
      expect(getByTestId('current').textContent).toBe('320')
    })
  })

  it('should use requestAnimationFrame for window resize', async () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame')

    const TestComponent = () => {
      const paneRef = useRef<HTMLDivElement>(mockPane)
      usePaneWidth({paneRef})
      return <div>Test</div>
    }

    render(<TestComponent />)

    // Trigger resize event
    window.dispatchEvent(new Event('resize'))

    // Verify requestAnimationFrame was called
    await waitFor(() => {
      expect(rafSpy).toHaveBeenCalled()
    })

    rafSpy.mockRestore()
  })

  it('should throttle multiple resize events to one requestAnimationFrame', async () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame')

    const TestComponent = () => {
      const paneRef = useRef<HTMLDivElement>(mockPane)
      usePaneWidth({paneRef})
      return <div>Test</div>
    }

    render(<TestComponent />)

    // Dispatch multiple resize events in quick succession
    window.dispatchEvent(new Event('resize'))
    window.dispatchEvent(new Event('resize'))
    window.dispatchEvent(new Event('resize'))

    // Should only schedule one requestAnimationFrame
    await waitFor(() => {
      expect(rafSpy).toHaveBeenCalledTimes(1)
    })

    rafSpy.mockRestore()
  })

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const TestComponent = () => {
      const paneRef = useRef<HTMLDivElement>(mockPane)
      usePaneWidth({paneRef})
      return <div>Test</div>
    }

    const {unmount} = render(<TestComponent />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })
})
