import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Avatar} from '..'
import theme from '../theme'
import {px, render as testRender} from '../utils/testing'

describe('Avatar', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Avatar src="primer.png" className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders small by default', () => {
    const size = 20
    const result = testRender(<Avatar src="primer.png" />)
    expect(result.props.width).toEqual(size)
    expect(result.props.height).toEqual(size)
  })

  it('respects the size prop', () => {
    const result = testRender(<Avatar size={40} src="primer.png" alt="github" />)
    expect(result.props.width).toEqual(40)
    expect(result.props.height).toEqual(40)
  })

  it('passes through the src prop', () => {
    expect(testRender(<Avatar src="primer.png" alt="" />).props.src).toEqual('primer.png')
  })

  it('respects margin props', () => {
    expect(testRender(<Avatar src="primer.png" alt="" sx={{m: 2}} />)).toHaveStyleRule('margin', px(theme.space[2]))
  })

  it('should support the `style` prop without overriding internal styles', () => {
    render(
      <Avatar
        data-testid="avatar"
        src="primer.png"
        style={{
          background: 'black',
        }}
      />,
    )

    expect(screen.getByTestId('avatar')).toHaveStyle({
      background: 'black',
      ['--avatarSize-regular']: '20px',
    })
  })
})
