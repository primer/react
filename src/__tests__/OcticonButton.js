import React from 'react'
import OcticonButton from '../OcticonButton'
import {render, mount} from '../utils/testing'
import {COMMON} from '../system-props'

const Circle = ({r = 8}) => <circle cx={r} cy={r} r={r} />
Circle.size = [16, 16]

describe('OcticonButton', () => {
  it('implements common system props', () => {
    expect(OcticonButton).toImplementSystemProps(COMMON)
  })

  it('renders a button with an Octicon', () => {
    expect(render(mount(<OcticonButton icon={Circle} label="circle" />))).toMatchSnapshot()
  })

  it('respects the "disabled" prop', () => {
    expect(render(mount(<OcticonButton icon={Circle} disabled label="circle" />)).props.disabled).toBe(true)
  })

  it('sets "aria-label" to the "label" prop', () => {
    expect(render(mount(<OcticonButton icon={Circle} label="circle" />)).props['aria-label']).toEqual('circle')
  })

  it('passes the onClick handler to the <button>', () => {
    function click() {}
    expect(render(mount(<OcticonButton icon={Circle} onClick={click} label="circle" />)).props.onClick).toEqual(click)
  })

  it('passes the "size" prop to the Octicon', () => {
    expect(render(mount(<OcticonButton icon={Circle} size={128} label="circle" />))).toMatchSnapshot()
  })
})
