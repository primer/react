import {describe, expect, it, beforeEach, afterEach} from 'vitest'
import {render} from '@testing-library/react'
import React from 'react'
import {page, userEvent} from 'vitest/browser'
import {AriaStatus} from '../AriaStatus'
import {getLiveRegion} from './test-helpers'
import {implementsClassName} from '../../utils/testing'

describe('AriaStatus', () => {
  implementsClassName(AriaStatus)
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

    render(<TestComponent />)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).not.toBe('test')

    await userEvent.click(page.getByText('Update message'))
    expect(liveRegion.getMessage('polite')).toBe('updated message')
  })

  it('should pass additional props to the container element', () => {
    const {container} = render(<AriaStatus data-testid="container">test</AriaStatus>)

    expect(container.firstChild).toHaveAttribute('data-testid', 'container')
  })

  it('should support customizing the container element with `as`', () => {
    render(
      <AriaStatus as="span" data-testid="container">
        test
      </AriaStatus>,
    )
    expect(page.getByTestId('container').element().tagName).toBe('SPAN')
  })

  it('should update live-region element when AriaStatus goes from empty to populated', async () => {
    function TestComponent() {
      const [show, setShow] = React.useState(false)
      return (
        <>
          <AriaStatus>{show ? 'Export completed' : null}</AriaStatus>
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
    render(<TestComponent />)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).toBe('')

    await userEvent.click(page.getByText('Export data'))
    expect(liveRegion.getMessage('polite')).toBe('Export completed')
  })
})
