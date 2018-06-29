import React from 'react'
import Text from '../Text'
import {render} from '../utils/testing'

it('Text renders margin', () => {
  expect(render(<Text m={1} />)).toEqual(render(<span className="m-1" />))
  expect(render(<Text m={[0, 1, 2, 3, 4]} />)).toEqual(render(<span className="m-0 m-sm-1 m-md-2 m-lg-3 m-xl-4" />))
  expect(render(<Text m={[null, 1, null, 3]} />)).toEqual(render(<span className="m-sm-1 m-lg-3" />))
})

it('Text renders padding', () => {
  expect(render(<Text p={1} />)).toEqual(render(<span className="p-1" />))
  expect(render(<Text p={[0, 1, 2, 3, 4]} />)).toEqual(render(<span className="p-0 p-sm-1 p-md-2 p-lg-3 p-xl-4" />))
  expect(render(<Text p={[null, 1, null, 3]} />)).toEqual(render(<span className="p-sm-1 p-lg-3" />))
})

it('Text renders fontSize with f* classes using inverse scale', () => {
  expect(render(<Text fontSize={0} />)).toEqual(render(<span className="f6" />))
  expect(render(<Text fontSize={1} />)).toEqual(render(<span className="f5" />))
  expect(render(<Text fontSize={2} />)).toEqual(render(<span className="f4" />))
  expect(render(<Text fontSize={3} />)).toEqual(render(<span className="f3" />))
  expect(render(<Text fontSize={4} />)).toEqual(render(<span className="f2" />))
  expect(render(<Text fontSize={5} />)).toEqual(render(<span className="f1" />))
  expect(render(<Text fontSize={6} />)).toEqual(render(<span className="f0" />))
})
