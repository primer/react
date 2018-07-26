import React from 'react'
import Block from '../Block'
import {renderClasses} from '../utils/testing'

describe('Block', () => {
  const defaultClasses = []
  it('renders default classes', () => {
    expect(renderClasses(<Block />)).toEqual(defaultClasses)
  })

  it('renders margin', () => {
    expect(renderClasses(<Block m={1} />)).toEqual(['m-1', ...defaultClasses])
    expect(renderClasses(<Block m={[0, 1, 2, 3, 4]} />)).toEqual([
      'm-0',
      'm-sm-1',
      'm-md-2',
      'm-lg-3',
      'm-xl-4',
      ...defaultClasses
    ])
    expect(renderClasses(<Block m={[null, 1, null, 3]} />)).toEqual(['m-sm-1', 'm-lg-3', ...defaultClasses])
  })

  it('renders padding', () => {
    expect(renderClasses(<Block p={1} />)).toEqual(['p-1', ...defaultClasses])
    expect(renderClasses(<Block p={[0, 1, 2, 3, 4]} />)).toEqual([
      'p-0',
      'p-sm-1',
      'p-md-2',
      'p-lg-3',
      'p-xl-4',
      ...defaultClasses
    ])
    expect(renderClasses(<Block p={[null, 1, null, 3]} />)).toEqual(['p-sm-1', 'p-lg-3', ...defaultClasses])
  })

  describe('borders', () => {
    it('handles border prop as true', () => {
      expect(renderClasses(<Block border />)).toEqual(['border'])
    })
    it('handles border prop as false', () => {
      expect(renderClasses(<Block border={false} />)).toEqual(['border-0'])
    })
    it('handles a single border edge', () => {
      expect(renderClasses(<Block border="left" borderColor="green" />)).toEqual(['border-left', 'border-green'])
    })
    it('handles multiple border edges', () => {
      expect(renderClasses(<Block border={['top', 'left']} />)).toEqual(['border-top', 'border-left'])
    })
    it('handles just a border color', () => {
      expect(renderClasses(<Block borderColor="red" />)).toEqual(['border', 'border-red'])
    })
  })

  it('respects display', () => {
    expect(renderClasses(<Block display="inline" />)).toEqual(['d-inline'])
    expect(renderClasses(<Block display="inline-block" />)).toEqual(['d-inline-block'])
    expect(renderClasses(<Block display="none" />)).toEqual(['d-none'])
  })

  it('respects position', () => {
    expect(renderClasses(<Block position="absolute" />)).toEqual(['position-absolute'])
    expect(renderClasses(<Block position="relative" />)).toEqual(['position-relative'])
  })

  it('respects bg', () => {
    expect(renderClasses(<Block bg="yellow" />)).toEqual(['bg-yellow'])
  })

  it('respects fg', () => {
    expect(renderClasses(<Block fg="red" />)).toEqual(['text-red'])
  })

  it('renders shadow', () => {
    expect(renderClasses(<Block shadow="small" />)).toEqual(['box-shadow'])
    expect(renderClasses(<Block shadow="medium" />)).toEqual(['box-shadow-medium'])
    expect(renderClasses(<Block shadow="large" />)).toEqual(['box-shadow-large'])
    expect(renderClasses(<Block shadow="extra-large" />)).toEqual(['box-shadow-extra-large'])
  })
})
