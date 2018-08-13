import React from 'react'
import BorderBox from '../BorderBox'
import {renderClasses} from '../utils/testing'

xdescribe('BorderBox', () => {
  it('is a system component', () => {
    expect(BorderBox.systemComponent).toEqual(true)
  })

  const defaultClasses = ['border', 'bg-white', 'rounded-1']
  it('renders default classes', () => {
    expect(renderClasses(<BorderBox />)).toEqual(defaultClasses)
  })

  it('renders margin', () => {
    expect(renderClasses(<BorderBox m={1} />)).toEqual(['m-1', ...defaultClasses])
    expect(renderClasses(<BorderBox m={[0, 1, 2, 3, 4]} />)).toEqual([
      'm-0',
      'm-sm-1',
      'm-md-2',
      'm-lg-3',
      'm-xl-4',
      ...defaultClasses
    ])
    expect(renderClasses(<BorderBox m={[null, 1, null, 3]} />)).toEqual(['m-sm-1', 'm-lg-3', ...defaultClasses])
  })

  it('renders padding', () => {
    expect(renderClasses(<BorderBox p={1} />)).toEqual(['p-1', ...defaultClasses])
    expect(renderClasses(<BorderBox p={[0, 1, 2, 3, 4]} />)).toEqual([
      'p-0',
      'p-sm-1',
      'p-md-2',
      'p-lg-3',
      'p-xl-4',
      ...defaultClasses
    ])
    expect(renderClasses(<BorderBox p={[null, 1, null, 3]} />)).toEqual(['p-sm-1', 'p-lg-3', ...defaultClasses])
  })

  it('renders borders', () => {
    expect(renderClasses(<BorderBox border />)).toEqual(['border', 'bg-white', 'rounded-1'])
    expect(renderClasses(<BorderBox border="left" borderColor="green.5" />)).toEqual([
      'border-left',
      'border-green',
      'bg-white',
      'rounded-1'
    ])
  })
})
