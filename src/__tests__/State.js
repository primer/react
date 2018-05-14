import React from 'react'
import State from '../State'
import renderer from 'react-test-renderer'

const render = component => renderer.create(component).toJSON()

it('State renders bg', () => {
  expect(render(<State bg='green'/>))
    .toEqual(render(<div className='State State--green'/>))
  expect(render(<State bg='red'/>))
    .toEqual(render(<div className='State State--red'/>))
  expect(render(<State bg='purple'/>))
    .toEqual(render(<div className='State State--purple'/>))
})

it('State renders small', () => {
  expect(render(<State small/>))
    .toEqual(render(<div className='State State--small'/>))
  expect(render(<State small={false}/>))
    .toEqual(render(<div className='State'/>))
})

it('State renders states as specific colors', () => {
  expect(render(<State is='open'/>))
    .toEqual(render(<div className='State State--green'/>))
  expect(render(<State is='reopened'/>))
    .toEqual(render(<div className='State State--green'/>))
  expect(render(<State is='merged'/>))
    .toEqual(render(<div className='State State--purple'/>))
  expect(render(<State is='closed'/>))
    .toEqual(render(<div className='State State--red'/>))
})
