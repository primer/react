/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import Label from '../Label'
import {render, mount} from '../utils/testing'

describe('Label', () => {
  it('renders a <span>', () => {
    expect(render(mount(<Label />).type)).toEqual('span')
  })

  it('respects the "outline" prop', () => {
    expect(render(mount(<Label outline />))).toMatchSnapshot()
  })

  it('implements space system props', () => {
    expect(Label).toImplementSystemProps(['space'])
  })
})
