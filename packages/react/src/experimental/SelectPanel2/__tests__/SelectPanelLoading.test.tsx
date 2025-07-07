import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest'
import {render} from '@testing-library/react'
import {LiveRegionElement} from '@primer/live-region-element'
import {SelectPanel} from '../'
import {getLiveRegion} from '../../../live-region/__tests__/test-helpers'

vi.useFakeTimers()

describe('SelectPanel.Loading', () => {
  beforeEach(() => {
    // Explicitly define the custom element if not already defined
    if (!customElements.get('live-region')) {
      customElements.define('live-region', LiveRegionElement)
    }
    const liveRegion = document.createElement('live-region')
    document.body.appendChild(liveRegion)
  })

  afterEach(() => {
    // Reset the live-region after each test so that we do not have overlapping
    // messages from previous tests
    const liveRegion = getLiveRegion()
    document.body.removeChild(liveRegion)
  })

  it('should announce children as a polite message', () => {
    render(<SelectPanel.Loading>test</SelectPanel.Loading>)

    const liveRegion = getLiveRegion()
    vi.runAllTimers()
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  it('should announce a default message when no children are provided', () => {
    render(<SelectPanel.Loading />)

    const liveRegion = getLiveRegion()
    vi.runAllTimers()
    expect(liveRegion.getMessage('polite')).toBe('Fetching items...')
  })
})
