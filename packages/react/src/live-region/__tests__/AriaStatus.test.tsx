import {render, screen} from '@testing-library/react'
import React from 'react'
import type {LiveRegionElement} from '@primer/live-region-element'
import {AriaStatus} from '../AriaStatus'
import {userEvent} from '@testing-library/user-event'

function getLiveRegion(): LiveRegionElement {
  const liveRegion = document.querySelector('live-region')
  if (liveRegion) {
    return liveRegion as LiveRegionElement
  }
  throw new Error('No live-region found')
}

describe('AriaStatus', () => {
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

  it('should not announce on show by default', () => {
    render(<AriaStatus>test</AriaStatus>)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).not.toBe('test')
  })

  it('should have a default politeness of `polite`', () => {
    render(<AriaStatus announceOnShow>test</AriaStatus>)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  it('should announce on content change', async () => {
    function TestComponent() {
      const [message, setMessage] = React.useState('default message')
      return (
        <>
          <AriaStatus>{message}</AriaStatus>
          <button
            type="button"
            onClick={() => {
              setMessage('updated message')
            }}
          >
            Update message
          </button>
        </>
      )
    }

    const user = userEvent.setup()

    render(<TestComponent />)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).not.toBe('test')

    await user.click(screen.getByText('Update message'))
    expect(liveRegion.getMessage('polite')).toBe('updated message')
  })

  it('should pass additional props to the container element', () => {
    const {container} = render(<AriaStatus data-testid="container">test</AriaStatus>)

    expect(container.firstChild).toHaveAttribute('data-testid', 'container')
  })

  it('should support styling via the `sx` prop', () => {
    render(
      <AriaStatus data-testid="container" sx={{color: 'blue'}}>
        test
      </AriaStatus>,
    )
    expect(screen.getByTestId('container')).toHaveStyle('color: blue')
  })

  it('should support customizing the container element with `as`', () => {
    render(
      <AriaStatus as="span" data-testid="container">
        test
      </AriaStatus>,
    )
    expect(screen.getByTestId('container').tagName).toBe('SPAN')
  })
})
