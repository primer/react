import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {SelectPanel} from '../'

vi.useFakeTimers()

describe('SelectPanel.Loading', () => {
  it('should announce children as a polite message', () => {
    render(<SelectPanel.Loading>test</SelectPanel.Loading>)

    const liveRegion = document.querySelector('live-region')!
    vi.runAllTimers()
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  it('should announce a default message when no children are provided', () => {
    render(<SelectPanel.Loading />)

    const liveRegion = document.querySelector('live-region')!
    vi.runAllTimers()
    expect(liveRegion.getMessage('polite')).toBe('Fetching items...')
  })
})
