import React from 'react'
import Octicon, {IssueOpened} from '@githubprimer/octicons-react'
import StateLabel from '../StateLabel'
import {render, rendersClass} from '../utils/testing'

describe('StateLabel', () => {
  it('respects the scheme prop', () => {
    expect(render(<StateLabel scheme="green" />)).toEqual(render(<span className="State State--green" />))
    expect(render(<StateLabel scheme="red" />)).toEqual(render(<span className="State State--red" />))
    expect(render(<StateLabel scheme="purple" />)).toEqual(render(<span className="State State--purple" />))
  })

  it('respects the small flag', () => {
    expect(render(<StateLabel small />)).toEqual(render(<span className="State State--small" />))
    expect(render(<StateLabel small={false} />)).toEqual(render(<span className="State" />))
  })

  it('renders states as specific colors', () => {
    expect(render(<StateLabel state="open" />)).toMatchSnapshot()
    expect(render(<StateLabel state="reopened" />)).toMatchSnapshot()
    expect(render(<StateLabel state="merged" />)).toMatchSnapshot()
    expect(render(<StateLabel state="closed" />)).toMatchSnapshot()
  })

  it('does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<StateLabel />)
    expect(render(<StateLabel data-foo="bar" />)).toEqual(defaultOutput)
    expect(render(<StateLabel hidden />)).toEqual(defaultOutput)
  })

  it('respects icon={false}', () => {
    expect(render(<StateLabel state="open" icon={false} />)).toEqual(render(<span className="State State--green" />))
  })

  it('respects margin utility prop', () => {
    expect(rendersClass(<StateLabel state="open" m={4} />, 'm-4')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<StateLabel state="open" p={4} />, 'p-4')).toEqual(true)
  })

  it('wraps the icon in .mr-1 if there are children', () => {
    expect(render(<StateLabel state="open">test</StateLabel>)).toEqual(
      render(
        <span className="State State--green">
          <span className="mr-1">
            <Octicon icon={IssueOpened} />
          </span>test
        </span>
      )
    )
  })
})
