import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Avatar from '../Avatar'
import theme from '../theme'

describe('Avatar', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Avatar src="primer.png" className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders small by default', () => {
    const size = 20
    const {container} = render(<Avatar src="primer.png" />)
    expect(container.firstChild).toHaveStyle({
      width: `${size}px`,
      height: `${size}px`,
    })
  })

  it('respects the size prop', () => {
    const size = 40
    const {container} = render(<Avatar size={size} src="primer.png" alt="github" />)
    expect(container.firstChild).toHaveStyle({
      width: `${size}px`,
      height: `${size}px`,
    })
  })

  it('passes through the src prop', () => {
    const {container} = render(<Avatar src="primer.png" alt="" />)
    expect(container.firstChild).toHaveAttribute('src', 'primer.png')
  })

  it('respects margin props', () => {
    render(<Avatar data-testid="avatar" src="primer.png" alt="" sx={{m: 2}} />)
    const avatar = screen.getByTestId('avatar')
    const classes = avatar.className.split(' ')
    const sxClassName = classes[1]
    const cssRule: CSSStyleRule | undefined = Array.from(document.styleSheets)
      .flatMap(sheet => {
        return Array.from(sheet.cssRules)
      })
      .find((cssRule): cssRule is CSSStyleRule => {
        return cssRule instanceof CSSStyleRule && cssRule.selectorText === `.${sxClassName}`
      })

    expect(cssRule).toBeDefined()
    expect(cssRule!.style.margin).toBe(`${theme.space[2]}`)
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

    expect(screen.getByTestId('avatar').style.background).toBe('black')
    expect(screen.getByTestId('avatar').style.getPropertyValue('--avatarSize-regular')).toBe('20px')
  })
})
