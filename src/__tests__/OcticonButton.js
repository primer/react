import React from 'react'
import Octicon from '@github/octicons-react'
import OcticonButton from '../OcticonButton'
import {render} from '../utils/testing'

const Circle = ({r = 8}) => <circle cx={r} cy={r} r={r} />
Circle.size = [16, 16]

describe('OcticonButton', () => {
  it('renders a button with an Octicon', () => {
    expect(render(<OcticonButton icon={Circle} />)).toEqual(render(<button aria-label=""><Octicon icon={Circle} /></button>))
  })

  it('respects the "disabled" prop', () => {
    expect(render(<OcticonButton icon={Circle} disabled />).props.disabled).toBe(true)
  })

  it('sets "aria-label" to the "label" prop', () => {
    expect(render(<OcticonButton icon={Circle} label="circle" />).props['aria-label']).toEqual('circle')
  })

  it('passes the onClick handler to the <button>', () => {
    function click() { }
    expect(render(<OcticonButton icon={Circle} onClick={click} />).props.onClick).toEqual(click)
  })

  it('passes the "size" prop to the Octicon', () => {
    expect(render(<OcticonButton icon={Circle} size={128} />)).toEqual(render(<button aria-label=""><Octicon icon={Circle} size={128} /></button>))
  })
})
