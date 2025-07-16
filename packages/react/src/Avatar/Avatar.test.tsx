import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Avatar} from '..'
import {ThemeProvider} from '../ThemeProvider'
import theme from '../theme'

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
    render(
      <ThemeProvider theme={theme}>
        <Avatar src="primer.png" alt="" sx={{m: 2}} data-testid="avatar" />
      </ThemeProvider>,
    )
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveStyle(`margin: 8px`)
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

    const avatar = screen.getByTestId('avatar')

    // Test that both the custom CSS property and the style prop are applied
    expect(avatar).toHaveStyle('--avatarSize-regular: 20px')

    // Check that style attribute contains both the custom property and the background
    const styleAttr = avatar.getAttribute('style') || ''
    expect(styleAttr).toContain('--avatarSize-regular: 20px')
    expect(styleAttr).toContain('background: black')
  })
})
