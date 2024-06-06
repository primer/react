import React from 'react'
import {Avatar} from '..'
import theme from '../theme'
import {px, render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('Avatar', () => {
  behavesAsComponent({Component: Avatar})

  checkExports('Avatar', {
    default: Avatar,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Avatar src="primer.png" />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders small by default', () => {
    const size = 20
    const result = render(<Avatar src="primer.png" />)
    expect(result.props.width).toEqual(size)
    expect(result.props.height).toEqual(size)
  })

  it('respects the size prop', () => {
    const result = render(<Avatar size={40} src="primer.png" alt="github" />)
    expect(result.props.width).toEqual(40)
    expect(result.props.height).toEqual(40)
  })

  it('passes through the src prop', () => {
    expect(render(<Avatar src="primer.png" alt="" />).props.src).toEqual('primer.png')
  })

  it('respects margin props', () => {
    expect(render(<Avatar src="primer.png" alt="" sx={{m: 2}} />)).toHaveStyleRule('margin', px(theme.space[2]))
  })
})
