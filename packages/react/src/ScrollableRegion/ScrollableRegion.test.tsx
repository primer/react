import {describe, expect, test, beforeEach, afterEach} from 'vitest'
import {render, screen} from '@testing-library/react'
import {act} from 'react'
import {ScrollableRegion} from '../ScrollableRegion'
import {implementsClassName} from '../utils/testing'
import classes from './ScrollableRegion.module.css'

const originalResizeObserver = window.ResizeObserver

interface ElementDimensions {
  scrollHeight: number
  clientHeight: number
  scrollWidth: number
  clientWidth: number
}

describe('ScrollableRegion', () => {
  implementsClassName(ScrollableRegion, classes.ScrollableRegion)

  let mockResizeCallback: (entries: Array<ResizeObserverEntry>) => void

  function triggerResize(target: HTMLElement, dimensions: Partial<ElementDimensions> = {}) {
    const {scrollHeight = 100, clientHeight = 100, scrollWidth = 100, clientWidth = 100} = dimensions

    Object.defineProperties(target, {
      scrollHeight: {configurable: true, value: scrollHeight},
      clientHeight: {configurable: true, value: clientHeight},
      scrollWidth: {configurable: true, value: scrollWidth},
      clientWidth: {configurable: true, value: clientWidth},
    })

    act(() => {
      mockResizeCallback([
        {
          target,
          borderBoxSize: [],
          contentBoxSize: [],
          contentRect: {
            width: 0,
            height: 0,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            x: 0,
            y: 0,
            toJSON() {
              return {}
            },
          },
          devicePixelContentBoxSize: [],
        },
      ])
    })
  }

  beforeEach(() => {
    window.ResizeObserver = class ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        mockResizeCallback = (entries: Array<ResizeObserverEntry>) => {
          return callback(entries, this)
        }
      }

      observe() {}
      disconnect() {}
      unobserve() {}
    }
  })

  afterEach(() => {
    window.ResizeObserver = originalResizeObserver
  })

  test('renders data-component attribute', () => {
    render(
      <ScrollableRegion aria-label="Example label" data-testid="container">
        Example content
      </ScrollableRegion>,
    )

    expect(screen.getByTestId('container')).toHaveAttribute('data-component', 'ScrollableRegion')
  })

  test('does not render with region props when overflow is absent', () => {
    render(
      <ScrollableRegion aria-label="Example label" data-testid="container">
        Example content
      </ScrollableRegion>,
    )

    const container = screen.getByTestId('container')
    triggerResize(container)

    expect(container).not.toHaveAttribute('role')
    expect(container).not.toHaveAttribute('tabindex')
    expect(container).not.toHaveAttribute('aria-labelledby')
    expect(container).not.toHaveAttribute('aria-label')

    expect(container).toHaveStyle('overflow: auto')
    expect(container).toHaveStyle('position: relative')
  })

  test.each([
    {direction: 'vertical', dimensions: {scrollHeight: 500}},
    {direction: 'horizontal', dimensions: {scrollWidth: 500}},
  ])('renders with region props when $direction overflow appears', ({dimensions}) => {
    render(
      <ScrollableRegion aria-label="Example label" data-testid="container">
        Example content
      </ScrollableRegion>,
    )

    const container = screen.getByTestId('container')
    triggerResize(container, dimensions)

    expect(container).toBeVisible()
    expect(container).toHaveAttribute('role', 'region')
    expect(container).toHaveAttribute('tabindex', '0')
    expect(container).toHaveAttribute('aria-label', 'Example label')
  })

  test('removes region props when overflow disappears', () => {
    render(
      <ScrollableRegion aria-label="Example label" data-testid="container">
        Example content
      </ScrollableRegion>,
    )

    const container = screen.getByTestId('container')
    triggerResize(container, {scrollWidth: 500})
    expect(container).toHaveAttribute('role', 'region')
    expect(container).toHaveAttribute('tabindex', '0')

    triggerResize(container)
    expect(container).not.toHaveAttribute('role')
    expect(container).not.toHaveAttribute('tabindex')
    expect(container).not.toHaveAttribute('aria-label')
  })
})
