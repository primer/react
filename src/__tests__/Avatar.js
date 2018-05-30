import React from 'react'
import Avatar, {IMAGE_BASE_URL, getImageURL} from '../Avatar'
import renderer from 'react-test-renderer'

const render = component => renderer.create(component).toJSON()

describe('Avatar', () => {
  const urlFor = (username, size) => `${IMAGE_BASE_URL}${username}?v=3&s=${size}`
  it('renders small by default', () => {
    expect(render(<Avatar username='primer'/>))
      .toEqual(render(<img className='avatar avatar-small' src={`${IMAGE_BASE_URL}primer?v=3&s=40`} width={20} height={20} alt='primer' />))
  })

  it('respects the size prop', () => {
    expect(render(<Avatar username='primer' size={40} />))
      .toEqual(render(<img className='avatar' src={urlFor('primer', 80)} width={40} height={40} alt='primer' />))
    expect(render(<Avatar username='primer' src='/primer.jpg' />))
      .toEqual(render(<img className='avatar avatar-small' src='/primer.jpg' width={20} height={20} alt='primer' />))
  })

  it('respects isChild', () => {
    expect(render(<Avatar username='primer' isChild />))
      .toEqual(render(<img className='avatar avatar-small avatar-child' src={urlFor('primer', 40)} width={20} height={20} alt='primer' />))
  })

  it('exports getImageURL() and supports src prop', () => {
    expect(render(<Avatar username='primer' src={getImageURL('primer', {v: 4, size: 100})} />))
      .toEqual(render(<img className='avatar avatar-small' src={`${IMAGE_BASE_URL}primer?v=4&size=100`} width={20} height={20} alt='primer' />))
  })
})
