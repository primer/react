import {act, cleanup, render, screen} from '@testing-library/react'
import {createRef} from 'react'
import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {ScrollableRegion} from './ScrollableRegion'

describe('ScrollableRegion', () => {
  const originalResizeObserver = window.ResizeObserver
  let notifyResize: (() => void) | undefined

  beforeEach(() => {
    window.ResizeObserver = class ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = () => callback([], this)
      }

      disconnect() {}

      observe() {}

      unobserve() {}
    }
  })

  afterEach(() => {
    cleanup()
    window.ResizeObserver = originalResizeObserver
    notifyResize = undefined
  })

  it('only adds region semantics when the element has overflow', () => {
    render(
      <ScrollableRegion aria-label="Notifications" data-testid="region">
        Content
      </ScrollableRegion>,
    )

    const region = screen.getByTestId('region')
    expect(region).not.toHaveAttribute('role')
    expect(region).not.toHaveAttribute('aria-label')
    expect(region).toHaveClass('relative', 'overflow-auto')
    expect(region).toHaveAttribute('data-component', 'ScrollableRegion')

    Object.defineProperties(region, {
      clientHeight: {configurable: true, value: 100},
      scrollHeight: {configurable: true, value: 200},
    })

    act(() => {
      notifyResize?.()
    })

    expect(region).toHaveAttribute('aria-label', 'Notifications')
    expect(region).toHaveAttribute('role', 'region')
    expect(region).toHaveAttribute('tabindex', '0')
  })

  it('forwards its ref and root props', () => {
    const ref = createRef<HTMLDivElement>()

    render(
      <ScrollableRegion aria-label="Notifications" data-testid="region" ref={ref}>
        Content
      </ScrollableRegion>,
    )

    expect(ref.current).toBe(screen.getByTestId('region'))
  })
})
