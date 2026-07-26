import React from 'react'
import {render, screen, within} from '@testing-library/react'
import {renderToString} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {Avatar} from '../Avatar'
import {Link} from '../Link'
import {AvatarStack} from './AvatarStack'

const avatars = () => [
  <Avatar key="primer" alt="Primer" src="/primer.png" />,
  <Avatar key="github" alt="GitHub" src="/github.png" />,
  <Avatar key="atom" alt="Atom" src="/atom.png" />,
  <Avatar key="desktop" alt="Desktop" src="/desktop.png" />,
]

describe('AvatarStack', () => {
  it('forwards root props and refs', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <AvatarStack ref={ref} className="custom-stack" data-testid="stack" style={{backgroundColor: 'red'}}>
        {avatars()}
      </AvatarStack>,
    )

    expect(screen.getByTestId('stack')).toBe(ref.current)
    expect(ref.current).toHaveClass('custom-stack')
    expect(ref.current).toHaveAttribute('data-component', 'AvatarStack')
    expect(ref.current?.getAttribute('style')).toContain('background-color: red')
  })

  it('renders on the server without browser APIs', () => {
    const markup = renderToString(
      <AvatarStack aria-label="Reviewers">
        <Avatar alt="Mona" src="/mona.png" />
      </AvatarStack>,
    )

    expect(markup).toContain('data-component="AvatarStack"')
    expect(markup).toContain('data-component="AvatarStack.Body"')
  })

  it('uses the smallest child size and exposes canonical state attributes', () => {
    const {container} = render(
      <AvatarStack alignRight shape="square" variant="stack">
        <Avatar alt="Small" className="custom-avatar" size={20} src="/small.png" />
        <Avatar alt="Large" size={48} src="/large.png" />
      </AvatarStack>,
    )
    const root = container.querySelector<HTMLElement>('[data-component="AvatarStack"]')

    expect(root).toHaveAttribute('data-avatar-count', '2')
    expect(root).toHaveAttribute('data-align-right', '')
    expect(root).toHaveAttribute('data-responsive', '')
    expect(root).toHaveAttribute('style', expect.stringContaining('--stack-size-regular: 20px'))
    expect(screen.getByRole('img', {name: 'Small'})).toHaveAttribute('data-square', '')
    expect(screen.getByRole('img', {name: 'Small'})).toHaveClass('custom-avatar')
  })

  it('uses the smallest responsive child size at each viewport', () => {
    const {container} = render(
      <AvatarStack>
        <Avatar alt="Small" size={{narrow: 16, regular: 32, wide: 48}} src="/small.png" />
        <Avatar alt="Large" size={{narrow: 32, regular: 48, wide: 64}} src="/large.png" />
      </AvatarStack>,
    )

    expect(container.firstElementChild).toHaveAttribute(
      'style',
      expect.stringContaining('--stack-size-narrow: 16px; --stack-size-regular: 32px; --stack-size-wide: 48px'),
    )
  })

  it('counts four or more children as 3+ and hides avatars after the fifth', () => {
    const {container} = render(
      <AvatarStack>
        {avatars()}
        <Avatar alt="Fifth" src="/fifth.png" />
        <Avatar alt="Sixth" src="/sixth.png" />
      </AvatarStack>,
    )

    expect(container.firstElementChild).toHaveAttribute('data-avatar-count', '3+')
    expect(screen.getByRole('img', {name: 'Sixth'})).toHaveClass('invisible')
  })

  it('makes the body focusable when it expands without interactive children', () => {
    const {container} = render(<AvatarStack>{avatars()}</AvatarStack>)
    expect(container.querySelector('[data-component="AvatarStack.Body"]')).toHaveAttribute('tabindex', '0')
  })

  it('uses interactive child focus rather than a nested focus target', async () => {
    const {container} = render(
      <AvatarStack>
        <Link aria-label="Primer profile" href="/primer">
          <Avatar alt="" src="/primer.png" />
        </Link>
      </AvatarStack>,
    )

    await Promise.resolve()
    expect(container.querySelector('[data-component="AvatarStack.Body"]')).not.toHaveAttribute('tabindex')
    expect(screen.getByRole('link', {name: 'Primer profile'})).toHaveClass('size-[var(--avatar-stack-size)]')
  })

  it('does not add a focus target when expansion is disabled', () => {
    const {container} = render(
      <AvatarStack disableExpand>
        {avatars()}
        <Avatar alt="Fifth" src="/fifth.png" />
        <Avatar alt="Sixth" src="/sixth.png" />
      </AvatarStack>,
    )
    const body = container.querySelector('[data-component="AvatarStack.Body"]')

    expect(body).toHaveAttribute('data-disable-expand', '')
    expect(body).not.toHaveAttribute('tabindex')
    expect(within(container).getByRole('img', {name: 'Sixth'})).not.toHaveClass('group-hover:visible')
  })
})
