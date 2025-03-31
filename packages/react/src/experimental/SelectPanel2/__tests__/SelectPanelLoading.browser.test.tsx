import {render} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import React from 'react'
import {SelectPanel} from '../'

describe('SelectPanel.Loading', () => {
  it('should announce children as a polite message', () => {
    vi.useFakeTimers()

    render(<SelectPanel.Loading>test</SelectPanel.Loading>)

    const liveRegion = document.querySelector('live-region')!
    vi.runAllTimers()
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  it('should announce a default message when no children are provided', () => {
    vi.useFakeTimers()

    render(<SelectPanel.Loading />)

    const liveRegion = document.querySelector('live-region')!
    vi.runAllTimers()
    expect(liveRegion.getMessage('polite')).toBe('Fetching items...')
  })
})
