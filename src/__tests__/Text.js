import React from 'react'
import Text from '../Text'
import {render, silenceConsoleError} from '../utils/testing'

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
    expect(render(<Text color="green" />)).toEqual(render(<span className="text-green" />))
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
    expect(render(<Text fontSize={0} />)).toEqual(render(<span className="f6" />))
    expect(render(<Text fontSize={1} />)).toEqual(render(<span className="f5" />))
    expect(render(<Text fontSize={2} />)).toEqual(render(<span className="f4" />))
    expect(render(<Text fontSize={3} />)).toEqual(render(<span className="f3" />))
    expect(render(<Text fontSize={4} />)).toEqual(render(<span className="f2" />))
    expect(render(<Text fontSize={5} />)).toEqual(render(<span className="f1" />))
    expect(render(<Text fontSize={6} />)).toEqual(render(<span className="f0" />))
  })

  it('respects other values for fontSize', () => {
    expect(render(<Text fontSize="00" />)).toEqual(render(<span className="f00" />))
    const mock = silenceConsoleError(jest)
    expect(render(<Text fontSize={false} />)).toEqual(render(<span className="" />))
    mock.mockRestore()
  })
})
