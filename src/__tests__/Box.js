import React from 'react'
import Box from '../Box'
import renderer from 'react-test-renderer'

const render = component => renderer.create(component).toJSON()

it('Box renders margin', () => {
  expect(render(<Box m={1} />))
    .toEqual(render(<div className='m-1' />))
  expect(render(<Box m={[0, 1, 2, 3, 4]} />))
    .toEqual(render(<div className='m-0 m-sm-1 m-md-2 m-lg-3 m-xl-4' />))
  expect(render(<Box m={[null, 1, null, 3]} />))
    .toEqual(render(<div className='m-sm-1 m-lg-3' />))
})

it('Box renders padding', () => {
  expect(render(<Box p={1} />))
    .toEqual(render(<div className='p-1' />))
  expect(render(<Box p={[0, 1, 2, 3, 4]} />))
    .toEqual(render(<div className='p-0 p-sm-1 p-md-2 p-lg-3 p-xl-4' />))
  expect(render(<Box p={[null, 1, null, 3]} />))
    .toEqual(render(<div className='p-sm-1 p-lg-3' />))
})
