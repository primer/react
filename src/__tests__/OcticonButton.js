import React from 'react'
import Octicon from '@githubprimer/octicons-react'
import OcticonButton from '../OcticonButton'
import {render} from '../utils/testing'
import {COMMON} from '../system-props'

const Circle = ({r = 8}) => <circle cx={r} cy={r} r={r} />
Circle.size = [16, 16]

describe('OcticonButton', () => {
  /**
   * these are the props we always expect to see on the <button>;
   * you can test additional values by comparing the rendered
   * result with:
   *
   * ```js
   * <button {..defaultButtonProps} disabled>...
   * ```
   */
  const defaultButtonProps = {'aria-label': '', className: 'btn-link text-inherit'}

  it('implements common system props', () => {
    expect(OcticonButton).toImplementSystemProps(COMMON)
  })

  it('renders a button with an Octicon', () => {
    expect(render(<OcticonButton icon={Circle} />)).toMatchSnapshot()
  })

  it('respects the "disabled" prop', () => {
    expect(render(<OcticonButton icon={Circle} disabled />).props.disabled).toBe(true)
  })

  it('sets "aria-label" to the "label" prop', () => {
    expect(render(<OcticonButton icon={Circle} label="circle" />).props['aria-label']).toEqual('circle')
  })

  it('passes the onClick handler to the <button>', () => {
    function click() {}
    expect(render(<OcticonButton icon={Circle} onClick={click} />).props.onClick).toEqual(click)
  })

  it('passes the "size" prop to the Octicon', () => {
    expect(render(<OcticonButton icon={Circle} size={128} />)).toMatchSnapshot()
  })
})
