import React from 'react'
import {Avatar} from '..'
import theme from '../theme'
import {px, render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Avatar', () => {
  behavesAsComponent({Component: Avatar})

  checkExports('Avatar', {
    default: Avatar
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Avatar src="primer.png" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders small by default', () => {
    const size = 20
    const result = render(<Avatar src="primer.png" />)

    expect(result).toHaveStyleRule('width', px(size))
    expect(result).toHaveStyleRule('height', px(size))
  })

  it('respects the size prop', () => {
    const result = render(<Avatar size={40} src="primer.png" alt="github" />)

    expect(result).toHaveStyleRule('width', '40px')
    expect(result).toHaveStyleRule('height', '40px')
  })

  it('passes through the src prop', () => {
    expect(render(<Avatar src="primer.png" alt="" />).props.src).toEqual('primer.png')
  })

  it('respects margin props', () => {
    expect(render(<Avatar src="primer.png" alt="" sx={{m: 2}} />)).toHaveStyleRule('margin', px(theme.space[2]))
  })
})
