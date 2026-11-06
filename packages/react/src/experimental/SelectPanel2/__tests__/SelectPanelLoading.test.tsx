import {afterEach, beforeEach, describe, expect, it, vi, type MockInstance} from 'vitest'
import {render, act} from '@testing-library/react'
import {SelectPanel} from '../'

describe('SelectPanel.Loading', () => {
  let ariaNotify: MockInstance<Element['ariaNotify']>

  beforeEach(() => {
    vi.useFakeTimers()
    ariaNotify = vi.spyOn(Element.prototype, 'ariaNotify').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should announce children as a polite message', async () => {
    render(<SelectPanel.Loading>test</SelectPanel.Loading>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('test', {
      priority: 'normal',
    })
  })

  it('should announce a default message when no children are provided', async () => {
    render(<SelectPanel.Loading />)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('Fetching items...', {
      priority: 'normal',
    })
  })
})
