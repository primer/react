import React from 'react'
import MergeStatus from '../MergeStatus'
import { render, renderClasses } from '../utils/testing'

it('MergeStatus renders state', () => {
  expect(renderClasses(<MergeStatus state='ready' />))
    .toEqual(['State', 'State--green'])
  expect(renderClasses(<MergeStatus state='invalid' />))
    .toEqual(['State', 'State--invalid'])
  expect(renderClasses(<MergeStatus state='merged' />))
    .toEqual(['State', 'State--purple'])
  expect(renderClasses(<MergeStatus state='pending' />))
    .toEqual(['State'])
})

it('MergeStatus does not pass on arbitrary attributes', () => {
  const defaultOutput = render(<MergeStatus state='ready'/>)
  expect(render(<MergeStatus state='ready' className='foo'/>)).toEqual(defaultOutput)
  expect(render(<MergeStatus state='ready' data-foo='bar'/>)).toEqual(defaultOutput)
  expect(render(<MergeStatus state='ready' hidden/>)).toEqual(defaultOutput)
})
