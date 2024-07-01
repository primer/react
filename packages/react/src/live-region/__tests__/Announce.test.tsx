import {render, screen} from '@testing-library/react'
import React from 'react'
import type {LiveRegionElement} from '@primer/live-region-element'
import {Announce} from '../Announce'

function getLiveRegion(): LiveRegionElement {
  const liveRegion = document.querySelector('live-region')
  if (liveRegion) {
    return liveRegion as LiveRegionElement
  }
  throw new Error('No live-region found')
}

describe('Announce', () => {
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

  it('should have a default politeness of `polite`', () => {
    render(<Announce>test</Announce>)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  it('should support an `assertive` politeness', () => {
    render(<Announce politeness="assertive">test</Announce>)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('assertive')).toBe('test')
    expect(liveRegion.getMessage('polite')).toBe('')
  })

  it('should pass additional props to the container element', () => {
    const {container} = render(<Announce data-testid="container">test</Announce>)

    expect(container.firstChild).toHaveAttribute('data-testid', 'container')
  })

  it('should support styling via the `sx` prop', () => {
    render(
      <Announce data-testid="container" sx={{color: 'blue'}}>
        test
      </Announce>,
    )
    expect(screen.getByTestId('container')).toHaveStyle('color: blue')
  })

  it('should support customizing the container element with `as`', () => {
    render(
      <Announce as="span" data-testid="container">
        test
      </Announce>,
    )
    expect(screen.getByTestId('container').tagName).toBe('SPAN')
  })

  it('should not announce the contents of the container if `hidden={false}`', () => {
    render(<Announce hidden>test</Announce>)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).not.toBe('test')
  })

  it('should not announce the contents of the container if `display: none`', () => {
    render(
      <Announce
        style={{
          display: 'none',
        }}
      >
        test
      </Announce>,
    )

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).not.toBe('test')
  })

  it('should not announce the contents of the container if `visibility: hidden`', () => {
    render(
      <Announce
        style={{
          visibility: 'hidden',
        }}
      >
        test
      </Announce>,
    )

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).not.toBe('test')
  })
})
