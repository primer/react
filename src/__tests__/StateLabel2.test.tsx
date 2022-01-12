import React from 'react'
import {render} from '@testing-library/react'
import 'babel-polyfill'
import {StateLabel} from '../Label2'

// Label2.test.tsx covers the other tests for this component
describe('StateLabel2', () => {
  it('renders text node child', () => {
    const container = render(<StateLabel status="draft">Draft</StateLabel>)
    const label = container.baseElement
    expect(label.textContent).toEqual('Draft')
  })
})
