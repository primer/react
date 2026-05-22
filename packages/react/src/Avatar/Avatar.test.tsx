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

  describe('srcTransformer', () => {
    it('transforms the src when srcTransformer is provided', () => {
      render(
        <Avatar
          src="https://avatars.githubusercontent.com/u/1234"
          size={40}
          srcTransformer={(src, size) => `${src}?size=${size * 2}`}
          data-testid="avatar"
        />,
      )
      const avatar = screen.getByTestId('avatar')
      expect(avatar).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/1234?size=80')
    })

    it('passes src unchanged when srcTransformer is not provided', () => {
      render(<Avatar src="https://avatars.githubusercontent.com/u/1234" data-testid="avatar" />)
      const avatar = screen.getByTestId('avatar')
      expect(avatar).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/1234')
    })

    it('receives the resolved size for responsive values', () => {
      const transformer = (src: string, size: number) => `${src}?size=${size * 2}`
      render(
        <Avatar
          src="https://avatars.githubusercontent.com/u/1234"
          size={{narrow: 16, regular: 20, wide: 24}}
          srcTransformer={transformer}
          data-testid="avatar"
        />,
      )
      const avatar = screen.getByTestId('avatar')
      // Should use the 'regular' size for the transformer
      expect(avatar).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/1234?size=40')
    })

    it('uses default size when responsive value has no regular key', () => {
      const transformer = (src: string, size: number) => `${src}?size=${size * 2}`
      render(
        <Avatar
          src="https://avatars.githubusercontent.com/u/1234"
          size={{narrow: 16, wide: 24}}
          srcTransformer={transformer}
          data-testid="avatar"
        />,
      )
      const avatar = screen.getByTestId('avatar')
      // Falls back to DEFAULT_AVATAR_SIZE (20)
      expect(avatar).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/1234?size=40')
    })
  })
})
