import {render, screen} from '@testing-library/react'
import React from 'react'
import type {LiveRegionElement} from '@primer/live-region-element'
import {Alert} from '../Alert'

function getLiveRegion(): LiveRegionElement {
  const liveRegion = document.querySelector('live-region')
  if (liveRegion) {
    return liveRegion as LiveRegionElement
  }
  throw new Error('No live-region found')
}

describe('Alert', () => {
  afterEach(() => {
    // Reset the live-region after each test so that we do not have overlapping
    // messages from previous tests
    const liveRegion = getLiveRegion()
    document.body.removeChild(liveRegion)
  })

  it('should have a default politeness of `assertive`', () => {
    render(<Alert>test</Alert>)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('assertive')).toBe('test')
  })

  it('should pass additional props to the container element', () => {
    const {container} = render(<Alert data-testid="container">test</Alert>)

    expect(container.firstChild).toHaveAttribute('data-testid', 'container')
  })

  it('should support styling via the `sx` prop', () => {
    render(
      <Alert data-testid="container" sx={{color: 'blue'}}>
        test
      </Alert>,
    )
    expect(screen.getByTestId('container')).toHaveStyle('color: blue')
  })

  it('should support customizing the container element with `as`', () => {
    render(
      <Alert as="span" data-testid="container">
        test
      </Alert>,
    )
    expect(screen.getByTestId('container').tagName).toBe('SPAN')
  })
})
