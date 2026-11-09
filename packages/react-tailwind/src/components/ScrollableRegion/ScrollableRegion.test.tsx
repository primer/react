import {act, cleanup, render, screen, within} from '@testing-library/react'
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
      <ScrollableRegion aria-label="Notifications" data-testid="region" tabIndex={-1}>
        Content
      </ScrollableRegion>,
    )

    const region = screen.getByTestId('region')
    expect(region).not.toHaveAttribute('role')
    expect(region).not.toHaveAttribute('aria-label')
    expect(region).toHaveClass('primer:relative', 'primer:overflow-auto')
    expect(region).toHaveAttribute('data-component', 'ScrollableRegion')
    expect(region).toHaveAttribute('tabindex', '-1')

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

    Object.defineProperty(region, 'scrollHeight', {configurable: true, value: 100})

    act(() => {
      notifyResize?.()
    })

    expect(region).not.toHaveAttribute('role')
    expect(region).not.toHaveAttribute('aria-label')
    expect(region).toHaveAttribute('tabindex', '-1')
  })

  it('forwards its ref and root props', () => {
    const ref = createRef<HTMLElement>()

    render(
      <ScrollableRegion aria-label="Notifications" data-testid="region" ref={ref} title="Notifications">
        Content
      </ScrollableRegion>,
    )

    expect(ref.current).toBe(screen.getByTestId('region'))
    expect(ref.current).toHaveAttribute('title', 'Notifications')
  })

  it('retains overflow semantics until the focused region loses focus', () => {
    render(
      <>
        <h2 id="notifications-heading">Notifications</h2>
        <ScrollableRegion aria-labelledby="notifications-heading" data-testid="region">
          Content
        </ScrollableRegion>
        <button type="button">Continue</button>
      </>,
    )
    const region = screen.getByTestId('region')
    Object.defineProperties(region, {
      clientHeight: {configurable: true, value: 100},
      scrollHeight: {configurable: true, value: 200},
    })
    act(() => notifyResize?.())
    act(() => region.focus())
    expect(region).toHaveFocus()

    Object.defineProperty(region, 'scrollHeight', {configurable: true, value: 100})
    act(() => notifyResize?.())
    expect(region).toHaveFocus()
    expect(region).toHaveAttribute('role', 'region')
    expect(region).toHaveAttribute('aria-labelledby', 'notifications-heading')
    expect(region).toHaveAttribute('tabindex', '0')

    act(() => screen.getByRole('button', {name: 'Continue'}).focus())
    expect(region).not.toHaveAttribute('role')
    expect(region).not.toHaveAttribute('aria-labelledby')
    expect(region).not.toHaveAttribute('tabindex')
  })

  it('does not add region semantics for an authored tab stop until overflow occurs', () => {
    render(
      <>
        <ScrollableRegion aria-label="Notifications" data-testid="region" tabIndex={-1}>
          Content
        </ScrollableRegion>
        <button type="button">Continue</button>
      </>,
    )
    const region = screen.getByTestId('region')
    act(() => region.focus())
    expect(region).toHaveFocus()
    expect(region).not.toHaveAttribute('role')
    expect(region).toHaveAttribute('tabindex', '-1')

    Object.defineProperties(region, {
      clientHeight: {configurable: true, value: 100},
      scrollHeight: {configurable: true, value: 200},
    })
    act(() => notifyResize?.())
    expect(region).toHaveAttribute('role', 'region')
    expect(region).toHaveAttribute('tabindex', '0')

    Object.defineProperty(region, 'scrollHeight', {configurable: true, value: 100})
    act(() => notifyResize?.())
    expect(region).toHaveFocus()
    expect(region).toHaveAttribute('role', 'region')
    expect(region).toHaveAttribute('tabindex', '0')

    act(() => screen.getByRole('button', {name: 'Continue'}).focus())
    expect(region).not.toHaveAttribute('role')
    expect(region).toHaveAttribute('tabindex', '-1')
  })

  it('removes overflow semantics when a descendant is focused', () => {
    render(
      <ScrollableRegion aria-label="Notifications" data-testid="region">
        <button type="button">Continue</button>
      </ScrollableRegion>,
    )
    const region = screen.getByTestId('region')
    const button = screen.getByRole('button', {name: 'Continue'})
    Object.defineProperties(region, {
      clientHeight: {configurable: true, value: 100},
      scrollHeight: {configurable: true, value: 200},
    })
    act(() => notifyResize?.())
    act(() => button.focus())
    expect(button).toHaveFocus()

    Object.defineProperty(region, 'scrollHeight', {configurable: true, value: 100})
    act(() => notifyResize?.())
    expect(button).toHaveFocus()
    expect(region).not.toHaveAttribute('role')
    expect(region).not.toHaveAttribute('tabindex')
  })

  it('retains a focused region inside a shadow root', () => {
    const host = document.createElement('div')
    const shadow = host.attachShadow({mode: 'open'})
    const container = document.createElement('div')
    shadow.append(container)
    document.body.append(host)
    const {unmount} = render(
      <>
        <ScrollableRegion aria-label="Notifications" data-testid="region">
          Content
        </ScrollableRegion>
        <button type="button">Continue</button>
      </>,
      {container},
    )
    try {
      const region = within(container).getByTestId('region')
      Object.defineProperties(region, {
        clientHeight: {configurable: true, value: 100},
        scrollHeight: {configurable: true, value: 200},
      })
      act(() => notifyResize?.())
      act(() => region.focus())
      expect(shadow.activeElement).toBe(region)
      expect(document.activeElement).toBe(host)

      Object.defineProperty(region, 'scrollHeight', {configurable: true, value: 100})
      act(() => notifyResize?.())
      expect(shadow.activeElement).toBe(region)
      expect(region).toHaveAttribute('role', 'region')
      expect(region).toHaveAttribute('tabindex', '0')

      act(() => within(container).getByRole('button', {name: 'Continue'}).focus())
      expect(region).not.toHaveAttribute('role')
      expect(region).not.toHaveAttribute('tabindex')
    } finally {
      unmount()
      host.remove()
    }
  })
})
