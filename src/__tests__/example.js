import React from 'react'
import renderer from 'react-test-renderer'

const render = component => renderer.create(component).toJSON()

it('Renders components', () => {
  expect(render(<div className='foo'/>)).toEqual(render(<div className='foo'/>))
})
