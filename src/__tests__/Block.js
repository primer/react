import React from 'react'
import Block from '../Block'
import {render, renderClasses} from '../utils/testing'

describe('Block', () => {
  const defaultClasses = []
  it('renders default classes', () => {
    expect(renderClasses(<Block />)).toEqual(defaultClasses)
  })

  it('renders margin', () => {
    expect(renderClasses(<Block m={1} />))
      .toEqual(['m-1', ...defaultClasses])
    expect(renderClasses(<Block m={[0, 1, 2, 3, 4]} />))
      .toEqual(['m-0', 'm-sm-1', 'm-md-2', 'm-lg-3', 'm-xl-4', ...defaultClasses])
    expect(renderClasses(<Block m={[null, 1, null, 3]} />))
      .toEqual(['m-sm-1', 'm-lg-3', ...defaultClasses])
  })

  it('renders padding', () => {
    expect(renderClasses(<Block p={1} />))
      .toEqual(['p-1', ...defaultClasses])
    expect(renderClasses(<Block p={[0, 1, 2, 3, 4]} />))
      .toEqual(['p-0', 'p-sm-1', 'p-md-2', 'p-lg-3', 'p-xl-4', ...defaultClasses])
    expect(renderClasses(<Block p={[null, 1, null, 3]} />))
      .toEqual(['p-sm-1', 'p-lg-3', ...defaultClasses])
  })

  it('renders borders', () => {
    expect(renderClasses(<Block border />))
      .toEqual(['border'])
    expect(renderClasses(<Block border={['left', 'green']} />))
      .toEqual(['border-left', 'border-green'])
  })
})
