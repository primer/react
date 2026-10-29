import {describe, expect, it, beforeEach, afterEach, vi, type MockInstance} from 'vitest'
import {render, act} from '@testing-library/react'
import {page} from 'vitest/browser'
import {AriaAlert} from '../AriaAlert'
import {implementsClassName} from '../../utils/testing'

describe('AriaAlert', () => {
  let ariaNotify: MockInstance<Element['ariaNotify']>

  implementsClassName(AriaAlert)

  beforeEach(() => {
    vi.useFakeTimers()
    ariaNotify = vi.spyOn(Element.prototype, 'ariaNotify').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should have a default politeness of `assertive`', async () => {
    render(<AriaAlert>test</AriaAlert>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('test', {
      priority: 'high',
    })
  })

  it('should pass additional props to the container element', () => {
    const {container} = render(<AriaAlert data-testid="container">test</AriaAlert>)

    expect(container.firstChild).toHaveAttribute('data-testid', 'container')
  })

  it('should support customizing the container element with `as`', () => {
    render(
      <AriaAlert as="span" data-testid="container">
        test
      </AriaAlert>,
    )
    expect(page.getByTestId('container').element().tagName).toBe('SPAN')
  })

  it('should announce when AriaAlert goes from empty to populated', async () => {
    const {rerender} = render(<AriaAlert>{null}</AriaAlert>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).not.toHaveBeenCalled()

    rerender(<AriaAlert>Failed to export data!</AriaAlert>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('Failed to export data!', {
      priority: 'high',
    })
  })
})
