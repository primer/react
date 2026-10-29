import {describe, expect, it, beforeEach, afterEach, vi, type MockInstance} from 'vitest'
import {render, act} from '@testing-library/react'
import {page} from 'vitest/browser'
import {AriaStatus} from '../AriaStatus'
import {implementsClassName} from '../../utils/testing'

describe('AriaStatus', () => {
  let ariaNotify: MockInstance<Element['ariaNotify']>

  implementsClassName(AriaStatus)

  beforeEach(() => {
    vi.useFakeTimers()
    ariaNotify = vi.spyOn(Element.prototype, 'ariaNotify').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should not announce on show by default', async () => {
    render(<AriaStatus>test</AriaStatus>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).not.toHaveBeenCalled()
  })

  it('should have a default politeness of `polite`', async () => {
    render(<AriaStatus announceOnShow>test</AriaStatus>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('test', {
      priority: 'normal',
    })
  })

  it('should announce on content change', async () => {
    const {rerender} = render(<AriaStatus>default message</AriaStatus>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).not.toHaveBeenCalled()

    rerender(<AriaStatus>updated message</AriaStatus>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('updated message', {
      priority: 'normal',
    })
  })

  it('should pass additional props to the container element', () => {
    const {container} = render(<AriaStatus data-testid="container">test</AriaStatus>)

    expect(container.firstChild).toHaveAttribute('data-testid', 'container')
  })

  it('should support customizing the container element with `as`', () => {
    render(
      <AriaStatus as="span" data-testid="container">
        test
      </AriaStatus>,
    )
    expect(page.getByTestId('container').element().tagName).toBe('SPAN')
  })

  it('should announce when AriaStatus goes from empty to populated', async () => {
    const {rerender} = render(<AriaStatus>{null}</AriaStatus>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).not.toHaveBeenCalled()

    rerender(<AriaStatus>Export completed</AriaStatus>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('Export completed', {
      priority: 'normal',
    })
  })
})
