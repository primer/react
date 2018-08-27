/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import Label from '../Label'
import {render} from '../utils/testing'

describe('Label', () => {
  it('is a system component', () => {
    expect(Label.systemComponent).toEqual(true)
  })

  it('renders a <span>', () => {
    expect(render(<Label />).type).toEqual('span')
  })

  it('respects the "outline" prop', () => {
    expect(render(<Label />)).toHaveClasses(['Label', 'Label--gray'])
    expect(render(<Label outline />)).toHaveClasses(['Label', 'Label--outline'])
  })

  it('respects the "scheme" prop', () => {
    expect(render(<Label scheme={null} />)).toHaveClasses(['Label', 'Label--gray'])
    expect(render(<Label scheme="gray" />)).toHaveClasses(['Label', 'Label--gray'])
    expect(render(<Label scheme="gray-darker" />)).toHaveClasses(['Label', 'Label--gray-darker'])
    expect(render(<Label scheme="orange" />)).toHaveClasses(['Label', 'Label--orange'])
    expect(render(<Label scheme="green" />)).toHaveClasses(['Label', 'bg-green'])
  })

  it('respects scheme="green" + outline', () => {
    expect(render(<Label outline scheme="green" />)).toHaveClasses(['Label', 'Label--outline', 'Label--outline-green'])
  })

  it('implements space system props', () => {
    expect(Label).toImplementSystemProps(['space'])
  })
})
