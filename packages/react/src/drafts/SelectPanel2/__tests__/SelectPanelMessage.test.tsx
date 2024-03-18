import {render, screen} from '@testing-library/react'
import React from 'react'
import type {LiveRegionElement} from '@primer/live-region-element'
import {SelectPanel} from '../'

describe('SelectPanel.Message', () => {
  it('should require a title when size="full"', () => {
    render(
      <SelectPanel.Message title="Title" size="full">
        message
      </SelectPanel.Message>,
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('message')).toBeInTheDocument()
  })

  it('should not require a title when size="inline"', () => {
    render(<SelectPanel.Message size="inline">message</SelectPanel.Message>)

    expect(screen.getByText('message')).toBeInTheDocument()
  })

  it('should announce the title and message when size="full"', () => {
    render(
      <SelectPanel.Message title="Title" size="full">
        message
      </SelectPanel.Message>,
    )

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).toBe('Title message')
  })

  it('should announce the message when size="inline"', () => {
    render(<SelectPanel.Message size="inline">message</SelectPanel.Message>)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).toBe('message')
  })
})

function getLiveRegion(): LiveRegionElement {
  const liveRegion = document.querySelector('live-region')
  if (liveRegion) {
    return liveRegion
  }
  throw new Error('Expected <live-region> element to be defined')
}
