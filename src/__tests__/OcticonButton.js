import React from 'react'
import Octicon from '@githubprimer/octicons-react'
import OcticonButton from '../OcticonButton'
import {render, rendersClass} from '../utils/testing'

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

  it('renders a button with an Octicon', () => {
    expect(render(<OcticonButton icon={Circle} />)).toEqual(
      render(
        <button {...defaultButtonProps}>
          <Octicon icon={Circle} />
        </button>
      )
    )
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

  it('respects margin utility prop', () => {
    expect(rendersClass(<OcticonButton icon={Circle} m={4} />, 'm-4')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<OcticonButton icon={Circle} p={4} />, 'p-4')).toEqual(true)
  })

  it('passes the "size" prop to the Octicon', () => {
    expect(render(<OcticonButton icon={Circle} size={128} />)).toEqual(
      render(
        <button {...defaultButtonProps}>
          <Octicon icon={Circle} size={128} />
        </button>
      )
    )
  })
})
