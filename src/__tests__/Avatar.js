import React from 'react'
import Avatar from '../Avatar'
import theme from '../theme'
import {px, render} from '../utils/testing'

describe('Avatar', () => {
  it('renders default props', () => {
    expect(render(<Avatar alt="" />)).toMatchSnapshot()
  })

  it('has default theme', () => {
    expect(Avatar).toSetDefaultTheme()
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
})
