/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react'
import Heading from '../Heading'
import {render, renderClasses} from '../utils/testing'

it('Heading renders an h1 by default', () => {
  expect(render(<Heading />).type).toEqual('h1')
})

it('Heading renders default props as utilities', () => {
  expect(renderClasses(<Heading />)).toEqual(['m-0', 'f1'])
})

it('Heading renders margin', () => {
  expect(renderClasses(<Heading m={1} />)).toEqual(['m-1', 'f1'])
  expect(renderClasses(<Heading m={[0, 1, 2, 3, 4]} />)).toEqual(['m-0', 'm-sm-1', 'm-md-2', 'm-lg-3', 'm-xl-4', 'f1'])
  expect(renderClasses(<Heading m={[null, 1, null, 3]} />)).toEqual(['m-sm-1', 'm-lg-3', 'f1'])
})

it('Heading renders padding', () => {
  expect(renderClasses(<Heading p={1} />)).toEqual(['p-1', 'm-0', 'f1'])
  expect(renderClasses(<Heading p={[0, 1, 2, 3, 4]} />)).toEqual([
    'p-0',
    'p-sm-1',
    'p-md-2',
    'p-lg-3',
    'p-xl-4',
    'm-0',
    'f1'
  ])
  expect(renderClasses(<Heading p={[null, 1, null, 3]} />)).toEqual(['p-sm-1', 'p-lg-3', 'm-0', 'f1'])
})

it('Heading renders fontSize with f* classes using inverse scale', () => {
  expect(render(<Heading fontSize={0} />)).toEqual(render(<h1 className="m-0 f6" />))
  expect(render(<Heading fontSize={1} />)).toEqual(render(<h1 className="m-0 f5" />))
  expect(render(<Heading fontSize={2} />)).toEqual(render(<h1 className="m-0 f4" />))
  expect(render(<Heading fontSize={3} />)).toEqual(render(<h1 className="m-0 f3" />))
  expect(render(<Heading fontSize={4} />)).toEqual(render(<h1 className="m-0 f2" />))
  expect(render(<Heading fontSize={5} />)).toEqual(render(<h1 className="m-0 f1" />))
  expect(render(<Heading fontSize={6} />)).toEqual(render(<h1 className="m-0 f0" />))
})
