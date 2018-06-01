import React from 'react'
import SummaryButton from '../SummaryButton'
import {render, renderClasses} from '../utils/testing'

describe('SummaryButton', () => {
  it('renders a <summary> with button props', () => {
    expect(render(<SummaryButton />).type).toEqual('summary')
    expect(renderClasses(<SummaryButton />)).toEqual(['btn'])
  })
})
