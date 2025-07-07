import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Avatar} from '..'
import theme from '../theme'
import {px} from '../utils/testing'

describe('Avatar', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Avatar src="primer.png" className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders small by default', () => {
    const size = 20
    render(<Avatar src="primer.png" data-testid="avatar" />)
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('width', size.toString())
    expect(avatar).toHaveAttribute('height', size.toString())
  })

  it('respects the size prop', () => {
    render(<Avatar size={40} src="primer.png" alt="github" data-testid="avatar" />)
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('width', '40')
    expect(avatar).toHaveAttribute('height', '40')
  })

  it('passes through the src prop', () => {
    render(<Avatar src="primer.png" alt="" data-testid="avatar" />)
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('src', 'primer.png')
  })

  it('respects margin props', () => {
    render(<Avatar src="primer.png" alt="" sx={{m: 2}} data-testid="avatar" />)
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveStyle(`margin: ${px(theme.space[2])}`)
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
