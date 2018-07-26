import React from 'react'
import Text from '../Text'
import {render} from '../utils/testing'

describe('Text', () => {
  it('renders margin', () => {
    expect(render(<Text m={1} />)).toEqual(render(<span className="m-1" />))
    expect(render(<Text m={[0, 1, 2, 3, 4]} />)).toEqual(render(<span className="m-0 m-sm-1 m-md-2 m-lg-3 m-xl-4" />))
    expect(render(<Text m={[null, 1, null, 3]} />)).toEqual(render(<span className="m-sm-1 m-lg-3" />))
  })

  it('renders padding', () => {
    expect(render(<Text p={1} />)).toEqual(render(<span className="p-1" />))
    expect(render(<Text p={[0, 1, 2, 3, 4]} />)).toEqual(render(<span className="p-0 p-sm-1 p-md-2 p-lg-3 p-xl-4" />))
    expect(render(<Text p={[null, 1, null, 3]} />)).toEqual(render(<span className="p-sm-1 p-lg-3" />))
  })

  it('respects color', () => {
    expect(render(<Text color="green" />)).toEqual(render(<span className="color-green-5" />))
  })

  it('respects fontWeight', () => {
    expect(render(<Text fontWeight="bold" />)).toEqual(render(<span className="text-bold" />))
    expect(render(<Text fontWeight="normal" />)).toEqual(render(<span className="text-normal" />))
  })

  it('respects lineHeight', () => {
    expect(render(<Text lineHeight="normal" />)).toEqual(render(<span className="lh-normal" />))
    expect(render(<Text lineHeight="condensed" />)).toEqual(render(<span className="lh-condensed" />))
    expect(render(<Text lineHeight="condensed-ultra" />)).toEqual(render(<span className="lh-condensed-ultra" />))
  })

  it('respects mono', () => {
    expect(render(<Text mono />)).toEqual(render(<span className="text-mono" />))
  })

  it('respects nowrap', () => {
    expect(render(<Text nowrap />)).toEqual(render(<span className="no-wrap" />))
  })

  it('renders fontSize with f* classes using inverse scale', () => {
    expect(render(<Text fontSize={0} />)).toEqual(render(<span className="f-0" />))
    expect(render(<Text fontSize={1} />)).toEqual(render(<span className="f-1" />))
    expect(render(<Text fontSize={2} />)).toEqual(render(<span className="f-2" />))
    expect(render(<Text fontSize={3} />)).toEqual(render(<span className="f-3" />))
    expect(render(<Text fontSize={4} />)).toEqual(render(<span className="f-4" />))
    expect(render(<Text fontSize={5} />)).toEqual(render(<span className="f-5" />))
    expect(render(<Text fontSize={6} />)).toEqual(render(<span className="f-6" />))
  })

  it('does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<Text />)
    expect(render(<Text bugs="bar" />)).toEqual(defaultOutput)
    expect(render(<Text hidden />)).toEqual(defaultOutput)
  })

  xit('respects other values for fontSize', () => {
    expect(render(<Text fontSize="00" />)).toEqual(render(<span className="f00" />))
    const hush = jest.spyOn(console, 'error').mockImplementation(jest.fn())
    expect(render(<Text fontSize={false} />)).toEqual(render(<span className="" />))
    hush.mockRestore()
  })
})
