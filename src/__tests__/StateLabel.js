import React from 'react'
import StateLabel from '../StateLabel'
import renderer from 'react-test-renderer'

const render = component => renderer.create(component).toJSON()

it('StateLabel renders bg', () => {
  expect(render(<StateLabel bg='green'/>))
    .toEqual(render(<div className='State State--green'/>))
  expect(render(<StateLabel bg='red'/>))
    .toEqual(render(<div className='State State--red'/>))
  expect(render(<StateLabel bg='purple'/>))
    .toEqual(render(<div className='State State--purple'/>))
})

it('StateLabel renders small', () => {
  expect(render(<StateLabel small/>))
    .toEqual(render(<div className='State State--small'/>))
  expect(render(<StateLabel small={false}/>))
    .toEqual(render(<div className='State'/>))
})

it('StateLabel renders states as specific colors', () => {
  expect(render(<StateLabel is='open'/>))
    .toEqual(render(<div className='State State--green'/>))
  expect(render(<StateLabel is='reopened'/>))
    .toEqual(render(<div className='State State--green'/>))
  expect(render(<StateLabel is='merged'/>))
    .toEqual(render(<div className='State State--purple'/>))
  expect(render(<StateLabel is='closed'/>))
    .toEqual(render(<div className='State State--red'/>))
})
