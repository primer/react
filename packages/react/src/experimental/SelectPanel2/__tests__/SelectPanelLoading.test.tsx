import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest'
import {render} from '@testing-library/react'
import {SelectPanel} from '../'

vi.useFakeTimers()

function getLiveRegion(): MockLiveRegionElement {
  const liveRegion = document.querySelector('live-region')
  if (liveRegion) {
    return liveRegion as MockLiveRegionElement
  }
  throw new Error('No live-region found')
}

// Mock implementation of the live-region custom element for testing
class MockLiveRegionElement extends HTMLElement {
  private politeMessage = ''
  private assertiveMessage = ''

  constructor() {
    super()
    // Create a mock shadow root for testing
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = `
      <div id="polite" aria-live="polite"></div>
      <div id="assertive" aria-live="assertive"></div>
    `
  }

  getMessage(politeness = 'polite') {
    if (politeness === 'polite') return this.politeMessage
    if (politeness === 'assertive') return this.assertiveMessage
    return ''
  }

  announceFromElement(element: Element) {
    const textContent = element.textContent || ''
    this.politeMessage = textContent
    return {
      cancel: () => {},
      then: () => Promise.resolve(),
      catch: () => Promise.resolve(),
      finally: () => Promise.resolve(),
    }
  }

  announce(message: string, options: {politeness?: string} = {}) {
    const politeness = options.politeness || 'polite'
    if (politeness === 'polite') {
      this.politeMessage = message
    } else if (politeness === 'assertive') {
      this.assertiveMessage = message
    }
    return {
      cancel: () => {},
      then: () => Promise.resolve(),
      catch: () => Promise.resolve(),
      finally: () => Promise.resolve(),
    }
  }
}

describe('SelectPanel.Loading', () => {
  beforeEach(() => {
    // Register the mock custom element
    if (!customElements.get('live-region')) {
      customElements.define('live-region', MockLiveRegionElement)
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
