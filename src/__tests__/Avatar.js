import React from 'react'
import Avatar from '../Avatar'
import renderer from 'react-test-renderer'

const render = component => renderer.create(component).toJSON()

describe('Avatar', () => {
  it('renders small by default', () => {
    expect(render(<Avatar />))
      .toEqual(render(<img className='avatar avatar-small' width={20} height={20} />))
  })

  it('respects the size prop', () => {
    expect(render(<Avatar size={40} />))
      .toEqual(render(<img className='avatar' width={40} height={40} />))
  })

  it('respects isChild', () => {
    expect(render(<Avatar isChild />))
      .toEqual(render(<img className='avatar avatar-small avatar-child' width={20} height={20} />))
  })

  it('passes through the src prop', () => {
    expect(render(<Avatar src='primer.png' />))
      .toEqual(render(<img className='avatar avatar-small' src='primer.png' width={20} height={20} />))
  })
})
