import {describe, expect, it, beforeEach, afterEach} from 'vitest'
import {render, screen} from '@testing-library/react'
import React from 'react'
import {AriaAlert} from '../AriaAlert'
import {userEvent} from '@testing-library/user-event'
import {getLiveRegion} from './test-helpers'
import {implementsClassName} from '../../utils/testing'

describe('AriaAlert', () => {
  implementsClassName(AriaAlert)
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

  it('should support customizing the container element with `as`', () => {
    render(
      <AriaAlert as="span" data-testid="container">
        test
      </AriaAlert>,
    )
    expect(screen.getByTestId('container').tagName).toBe('SPAN')
  })

  it('should update live-region element when AriaAlert goes from empty to populated', async () => {
    function TestComponent() {
      const [show, setShow] = React.useState(false)
      return (
        <>
          <AriaAlert>{show ? 'Failed to export data!' : null}</AriaAlert>
          <button
            type="button"
            onClick={() => {
              setShow(true)
            }}
          >
            Export data
          </button>
        </>
      )
    }
    const user = userEvent.setup()

    render(<TestComponent />)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('assertive')).toBe('')

    await user.click(screen.getByText('Export data'))
    expect(liveRegion.getMessage('assertive')).toBe('Failed to export data!')
  })
})
