import React from 'react'
import StateLabel from '../StateLabel'
import {render} from '../utils/testing'

it('StateLabel renders scheme', () => {
  expect(render(<StateLabel scheme='green'/>))
    .toEqual(render(<span className='State State--green'/>))
  expect(render(<StateLabel scheme='red'/>))
    .toEqual(render(<span className='State State--red'/>))
  expect(render(<StateLabel scheme='purple'/>))
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

it('StateLabel does not pass on arbitrary attributes', () => {
  const defaultOutput = render(<StateLabel/>)
  expect(render(<StateLabel className='foo'/>)).toEqual(defaultOutput)
  expect(render(<StateLabel data-foo='bar'/>)).toEqual(defaultOutput)
  expect(render(<StateLabel hidden/>)).toEqual(defaultOutput)
})
