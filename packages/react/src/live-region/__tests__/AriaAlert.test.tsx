import {render, screen} from '@testing-library/react'
import React from 'react'
import type {LiveRegionElement} from '@primer/live-region-element'
import {AriaAlert} from '../AriaAlert'

function getLiveRegion(): LiveRegionElement {
  const liveRegion = document.querySelector('live-region')
  if (liveRegion) {
    return liveRegion as LiveRegionElement
  }
  throw new Error('No live-region found')
}

describe('AriaAlert', () => {
  beforeEach(() => {
    const liveRegion = document.createElement('live-region')
    document.body.appendChild(liveRegion)
  })

  afterEach(() => {
    // Reset the live-region after each test so that we do not have overlapping
    // messages from previous tests
    const liveRegion = getLiveRegion()
    document.body.removeChild(liveRegion)
  })

  it('should have a default politeness of `assertive`', () => {
    render(<AriaAlert>test</AriaAlert>)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('assertive')).toBe('test')
  })

  it('should pass additional props to the container element', () => {
    const {container} = render(<AriaAlert data-testid="container">test</AriaAlert>)

    expect(container.firstChild).toHaveAttribute('data-testid', 'container')
  })

  it('should support styling via the `sx` prop', () => {
    render(
      <AriaAlert data-testid="container" sx={{color: 'blue'}}>
        test
      </AriaAlert>,
    )
    expect(screen.getByTestId('container')).toHaveStyle('color: blue')
  })

  it('should support customizing the container element with `as`', () => {
    render(
      <AriaAlert as="span" data-testid="container">
        test
      </AriaAlert>,
    )
    expect(screen.getByTestId('container').tagName).toBe('SPAN')
  })
})
