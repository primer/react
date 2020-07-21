import React from 'react'
import {Avatar} from '..'
import theme from '../theme'
import {px, render, percent, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import systemPropTypes from '@styled-system/prop-types'
expect.extend(toHaveNoViolations)

describe('Avatar', () => {
  behavesAsComponent(Avatar, [{propTypes: systemPropTypes.space}])

  checkExports('Avatar', {
    default: Avatar
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Avatar />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders small by default', () => {
    const size = 20
    const result = render(<Avatar alt="" />)
    expect(result.props.width).toEqual(size)
    expect(result.props.height).toEqual(size)
  })

  it('respects the size prop', () => {
    const result = render(<Avatar size={40} alt="github" />)
    expect(result.props.width).toEqual(40)
    expect(result.props.height).toEqual(40)
  })

  it('passes through the src prop', () => {
    expect(render(<Avatar src="primer.png" alt="" />).props.src).toEqual('primer.png')
  })

  it('respects margin props', () => {
    expect(render(<Avatar m={2} alt="" />)).toHaveStyleRule('margin', px(theme.space[2]))
  })

  it('respects shape prop', () => {
    expect(render(<Avatar shape="round" alt="" />)).toHaveStyleRule('border-radius', percent(50))
  })
})
