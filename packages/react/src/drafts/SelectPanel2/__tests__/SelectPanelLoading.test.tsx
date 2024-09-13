import {render} from '@testing-library/react'
import React from 'react'
import {SelectPanel} from '../'

jest.useFakeTimers()

describe('SelectPanel.Loading', () => {
  it('should announce children as a polite message', () => {
    render(<SelectPanel.Loading>test</SelectPanel.Loading>)

    const liveRegion = document.querySelector('live-region')!
    jest.runAllTimers()
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  it('should announce a default message when no children are provided', () => {
    render(<SelectPanel.Loading />)

    const liveRegion = document.querySelector('live-region')!
    jest.runAllTimers()
    expect(liveRegion.getMessage('polite')).toBe('Fetching items...')
  })
})
