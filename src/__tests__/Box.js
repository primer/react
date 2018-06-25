import React from 'react'
import Box from '../Box'
import {render, renderClasses} from '../utils/testing'

describe('Box', () => {
  const defaultClasses = ['border', 'bg-white', 'rounded-1']
  it('renders default classes', () => {
    expect(renderClasses(<Box />)).toEqual(defaultClasses)
  })

  it('renders margin', () => {
    expect(renderClasses(<Box m={1} />))
      .toEqual(['m-1', ...defaultClasses])
    expect(renderClasses(<Box m={[0, 1, 2, 3, 4]} />))
      .toEqual(['m-0', 'm-sm-1', 'm-md-2', 'm-lg-3', 'm-xl-4', ...defaultClasses])
    expect(renderClasses(<Box m={[null, 1, null, 3]} />))
      .toEqual(['m-sm-1', 'm-lg-3', ...defaultClasses])
  })

  it('renders padding', () => {
    expect(renderClasses(<Box p={1} />))
      .toEqual(['p-1', ...defaultClasses])
    expect(renderClasses(<Box p={[0, 1, 2, 3, 4]} />))
      .toEqual(['p-0', 'p-sm-1', 'p-md-2', 'p-lg-3', 'p-xl-4', ...defaultClasses])
    expect(renderClasses(<Box p={[null, 1, null, 3]} />))
      .toEqual(['p-sm-1', 'p-lg-3', ...defaultClasses])
  })

  it('renders borders', () => {
    expect(renderClasses(<Box border />))
      .toEqual(['border', 'bg-white', 'rounded-1'])
    expect(renderClasses(<Box border={['left', 'green']} />))
      .toEqual(['border-left', 'border-green', 'bg-white', 'rounded-1'])
  })
})
