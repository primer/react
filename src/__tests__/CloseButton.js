import React from 'react'
import CloseButton from '../CloseButton'
import {render} from '../utils/testing'

describe('CloseButton', () => {
  it('renders aria-label="Close" by default', () => {
    expect(render(<CloseButton />).props['aria-label']).toEqual('Close')
  })

  it('respects the "label" prop', () => {
    expect(render(<CloseButton label="Close this thing" />).props['aria-label']).toEqual('Close this thing')
  })
})
