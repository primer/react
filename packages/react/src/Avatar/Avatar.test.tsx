import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import Avatar from '../Avatar'
import {implementsClassName} from '../utils/testing'
import classes from './Avatar.module.css'

describe('Avatar', () => {
  implementsClassName(Avatar, classes.Avatar)

  describe('Avatar data-component attribute', () => {
    it('renders Avatar with data-component attribute', () => {
      render(<Avatar src="primer.png" alt="" data-testid="avatar" />)
      const avatar = screen.getByTestId('avatar')
      expect(avatar).toHaveAttribute('data-component', 'Avatar')
    })
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

  it('renders a text placeholder when src is omitted', () => {
    render(<Avatar placeholder="NS" size={40} data-testid="avatar" />)
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveTextContent('NS')
    expect(avatar).toHaveAttribute('role', 'img')
    expect(avatar).toHaveAttribute('aria-label', 'NS')
    expect(avatar).toHaveAttribute('data-placeholder')
    expect(avatar).toHaveAttribute('data-component', 'Avatar')
    expect(avatar).not.toHaveAttribute('src')
  })

  it('prefers the image when both src and placeholder are provided', () => {
    render(<Avatar src="primer.png" placeholder="NS" alt="Naveed" data-testid="avatar" />)
    const avatar = screen.getByTestId('avatar')
    expect(avatar.tagName).toBe('IMG')
    expect(avatar).toHaveAttribute('src', 'primer.png')
    expect(avatar).toHaveAttribute('alt', 'Naveed')
    expect(avatar).not.toHaveAttribute('data-placeholder')
  })

  it('uses alt text as the accessible name for a placeholder when provided', () => {
    render(<Avatar placeholder="NS" alt="Naveed Sajjad" data-testid="avatar" />)
    expect(screen.getByTestId('avatar')).toHaveAttribute('aria-label', 'Naveed Sajjad')
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
