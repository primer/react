import {render, screen} from '@testing-library/react'
import React, {act} from 'react'
import {ScrollableRegion} from '../ScrollableRegion'

const originalResizeObserver = global.ResizeObserver

describe('ScrollableRegion', () => {
  let mockResizeCallback: (entries: Array<ResizeObserverEntry>) => void

  beforeEach(() => {
    global.ResizeObserver = class ResizeObserver {
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
    global.ResizeObserver = originalResizeObserver
  })

  test('does not render with region props by default', () => {
    render(
      <ScrollableRegion aria-label="Example label" data-testid="container">
        Example content
      </ScrollableRegion>,
    )

    expect(screen.getByTestId('container')).not.toHaveAttribute('role')
    expect(screen.getByTestId('container')).not.toHaveAttribute('tabindex')
    expect(screen.getByTestId('container')).not.toHaveAttribute('aria-labelledby')
    expect(screen.getByTestId('container')).not.toHaveAttribute('aria-label')

    expect(screen.getByTestId('container')).toHaveStyleRule('overflow', 'auto')
    expect(screen.getByTestId('container')).toHaveStyleRule('position', 'relative')
  })

  test('does render with region props when overflow is present', () => {
    render(
      <ScrollableRegion aria-label="Example label" data-testid="container">
        Example content
      </ScrollableRegion>,
    )

    act(() => {
      // Mock a resize occurring when the scroll height is greater than the
      // client height
      const target = document.createElement('div')
      mockResizeCallback([
        {
          target: {
            ...target,
            scrollHeight: 500,
            clientHeight: 100,
          },
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

    expect(screen.getByLabelText('Example label')).toBeVisible()

    expect(screen.getByLabelText('Example label')).toHaveAttribute('role', 'region')
    expect(screen.getByLabelText('Example label')).toHaveAttribute('tabindex', '0')
    expect(screen.getByLabelText('Example label')).toHaveAttribute('aria-label')
  })
})
