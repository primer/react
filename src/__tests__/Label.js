/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import Label from '../Label'
import {render} from '../utils/testing'
import {COMMON} from '../constants'

describe('Label', () => {
  it('renders a <span>', () => {
    expect(render(<Label />).type).toEqual('span')
  })

  it('respects the "outline" prop', () => {
    expect(render(<Label outline />)).toMatchSnapshot()
  })

  it('has default theme', () => {
    expect(Label).toSetDefaultTheme()
  })

  it('implements system props', () => {
    expect(Label).toImplementSystemProps(COMMON)
  })
})
