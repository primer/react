import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import Avatar from '../Avatar'
import {implementsClassName} from '../utils/testing'
import classes from './Avatar.module.css'

describe('Avatar', () => {
  implementsClassName(Avatar, classes.Avatar)

  describe('Avatar data-component attribute', () => {
    it('renders Avatar with data-component attribute', async () => {
      render(<Avatar src="primer.png" alt="" data-testid="avatar" />)
      const avatar = page.getByTestId('avatar')
      await expect.element(avatar).toHaveAttribute('data-component', 'Avatar')
    })
  })

  it('renders small by default', async () => {
    const size = 20
    render(<Avatar src="primer.png" data-testid="avatar" />)
    const avatar = page.getByTestId('avatar')
    await expect.element(avatar).toHaveAttribute('width', size.toString())
    await expect.element(avatar).toHaveAttribute('height', size.toString())
  })

  it('respects the size prop', async () => {
    render(<Avatar size={40} src="primer.png" alt="github" data-testid="avatar" />)
    const avatar = page.getByTestId('avatar')
    await expect.element(avatar).toHaveAttribute('width', '40')
    await expect.element(avatar).toHaveAttribute('height', '40')
  })

  it('passes through the src prop', async () => {
    render(<Avatar src="primer.png" alt="" data-testid="avatar" />)
    const avatar = page.getByTestId('avatar')
    await expect.element(avatar).toHaveAttribute('src', 'primer.png')
  })

  it('renders a text placeholder when src is omitted', async () => {
    render(<Avatar placeholder="NS" size={40} data-testid="avatar" />)
    const avatar = page.getByTestId('avatar')
    await expect.element(avatar).toHaveTextContent('NS')
    await expect.element(avatar).toHaveAttribute('role', 'img')
    await expect.element(avatar).toHaveAttribute('aria-label', 'NS')
    await expect.element(avatar).toHaveAttribute('data-placeholder')
    await expect.element(avatar).toHaveAttribute('data-component', 'Avatar')
    await expect.element(avatar).not.toHaveAttribute('src')
  })

  it('prefers the image when both src and placeholder are provided', async () => {
    render(<Avatar src="primer.png" placeholder="NS" alt="Naveed" data-testid="avatar" />)
    const avatar = page.getByTestId('avatar')
    expect(avatar.element().tagName).toBe('IMG')
    await expect.element(avatar).toHaveAttribute('src', 'primer.png')
    await expect.element(avatar).toHaveAttribute('alt', 'Naveed')
    await expect.element(avatar).not.toHaveAttribute('data-placeholder')
  })

  it('uses alt text as the accessible name for a placeholder when provided', async () => {
    render(<Avatar placeholder="NS" alt="Naveed Sajjad" data-testid="avatar" />)
    await expect.element(page.getByTestId('avatar')).toHaveAttribute('aria-label', 'Naveed Sajjad')
  })

  it('should support the `style` prop without overriding internal styles', async () => {
    render(
      <Avatar
        data-testid="avatar"
        src="primer.png"
        style={{
          background: 'black',
        }}
      />,
    )

    const avatar = page.getByTestId('avatar')

    // Test that both the custom CSS property and the style prop are applied
    await expect.element(avatar).toHaveStyle('--avatarSize-regular: 20px')

    // Check that style attribute contains both the custom property and the background
    const styleAttr = avatar.element().getAttribute('style') || ''
    expect(styleAttr).toContain('--avatarSize-regular: 20px')
    expect(styleAttr).toContain('background: black')
  })
})
