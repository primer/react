import React from 'react'
import StateLabel from '../StateLabel'
import renderer from 'react-test-renderer'

const render = component => renderer.create(component).toJSON()

it('StateLabel renders bg', () => {
  expect(render(<StateLabel bg='green'/>))
    .toEqual(render(<span className='State State--green'/>))
  expect(render(<StateLabel bg='red'/>))
    .toEqual(render(<span className='State State--red'/>))
  expect(render(<StateLabel bg='purple'/>))
    .toEqual(render(<span className='State State--purple'/>))
})

it('StateLabel renders small', () => {
  expect(render(<StateLabel small/>))
    .toEqual(render(<span className='State State--small'/>))
  expect(render(<StateLabel small={false}/>))
    .toEqual(render(<span className='State'/>))
})

it('StateLabel renders states as specific colors', () => {
  expect(render(<StateLabel state='open'/>)).toMatchSnapshot()
  expect(render(<StateLabel state='reopened'/>)).toMatchSnapshot()
  expect(render(<StateLabel state='merged'/>)).toMatchSnapshot()
  expect(render(<StateLabel state='closed'/>)).toMatchSnapshot()
})
