import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import Avatar from '../Avatar'
import {implementsClassName} from '../utils/testing'
import classes from './Avatar.module.css'

function getCSSRules(selector: string): Array<CSSStyleRule> {
  function getRules(rules: CSSRuleList): Array<CSSStyleRule> {
    return Array.from(rules).flatMap(rule => {
      if (rule instanceof CSSStyleRule) {
        return rule.selectorText === selector ? [rule] : []
      }

      if ('cssRules' in rule) {
        return getRules(rule.cssRules)
      }

      return []
    })
  }

  return Array.from(document.styleSheets).flatMap(sheet => getRules(sheet.cssRules))
}

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

  it('sets min-width from its size variable so it cannot shrink in min-content slots', () => {
    render(<Avatar src="primer.png" data-testid="avatar" />)

    const rules = getCSSRules(`:where(.${classes.Avatar})`)
    const hasMinWidthDeclaration = rules.some(rule => {
      return rule.style.minWidth === 'var(--avatarSize-regular)'
    })

    expect(hasMinWidthDeclaration).toBe(true)
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
})
