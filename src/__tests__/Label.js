/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import Label from '../Label'
import {render, renderClasses} from '../utils/testing'

describe('Label', () => {
  it('renders a <span>', () => {
    expect(render(<Label />).type).toEqual('span')
  })

  it('respects the "outline" prop', () => {
    expect(renderClasses(<Label />)).toEqual(['Label', 'Label--gray'])
    expect(renderClasses(<Label outline />)).toEqual(['Label', 'Label--outline'])
  })

  it('respects the "scheme" prop', () => {
    expect(renderClasses(<Label scheme={null} />)).toEqual(['Label', 'Label--gray'])
    expect(renderClasses(<Label scheme="gray" />)).toEqual(['Label', 'Label--gray'])
    expect(renderClasses(<Label scheme="gray-darker" />)).toEqual(['Label', 'Label--gray-darker'])
    expect(renderClasses(<Label scheme="orange" />)).toEqual(['Label', 'Label--orange'])
    expect(renderClasses(<Label scheme="green" />)).toEqual(['Label', 'bg-green'])
  })

  it('respects scheme="green" + outline', () => {
    expect(renderClasses(<Label outline scheme="green" />)).toEqual(['Label', 'Label--outline', 'Label--outline-green'])
  })
})
