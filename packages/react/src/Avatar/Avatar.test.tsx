import {describe, expect, it} from 'vitest'
import {Avatar} from '..'
import {render, screen} from '@testing-library/react'

describe('Avatar', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Avatar src="primer.png" className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders small by default', () => {
    const size = 20
    const result = render(<Avatar src="primer.png" />)
    expect(result.container.firstChild).toHaveAttribute('width', size.toString())
    expect(result.container.firstChild).toHaveAttribute('height', size.toString())
  })

  it('respects the size prop', () => {
    const result = render(<Avatar size={40} src="primer.png" alt="github" />)
    expect(result.container.firstChild).toHaveAttribute('width', '40')
    expect(result.container.firstChild).toHaveAttribute('height', '40')
  })

  it('passes through the src prop', () => {
    const result = render(<Avatar src="primer.png" alt="" />)
    expect(result.container.firstChild).toHaveAttribute('src', 'primer.png')
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
