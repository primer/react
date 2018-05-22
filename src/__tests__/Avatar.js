import React from 'react'
import Avatar, {IMAGE_BASE_URL} from '../Avatar'
import renderer from 'react-test-renderer'

const render = component => renderer.create(component).toJSON()

it('Avatar does its thing', () => {
  expect(render(<Avatar username='primer'/>))
    .toEqual(render(<img className='avatar avatar-small' src={`${IMAGE_BASE_URL}primer?v=3&s=40`} width={20} height={20} alt='primer' />))
  expect(render(<Avatar username='primer' size={40} />))
    .toEqual(render(<img className='avatar' src={`${IMAGE_BASE_URL}primer?v=3&s=80`} width={40} height={40} alt='primer' />))
  expect(render(<Avatar username='primer' baseURL='/' />))
    .toEqual(render(<img className='avatar avatar-small' src={`/primer?v=3&s=40`} width={20} height={20} alt='primer' />))
})
