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

function ForwardingAvatar(props: React.ComponentProps<typeof Avatar>) {
  return <Avatar {...props} />
}

function TeamAvatar(props: React.ComponentProps<typeof Avatar>) {
  return <Avatar {...props} square />
}

function EntityAvatar({
  avatarSize,
  entity,
  ...props
}: React.ComponentProps<typeof Avatar> & {avatarSize?: number; entity: 'person' | 'team' | 'app'}) {
  return <Avatar size={avatarSize} square={entity !== 'person'} {...props} />
}

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

  it.each([
    ['direct', Avatar],
    ['forwarding wrapper', ForwardingAvatar],
  ] as const)('preserves %s square avatars in either position of a circular stack', (_name, AvatarComponent) => {
    const {rerender} = render(
      <AvatarStack size={16}>
        <AvatarComponent square alt="Team" src="/team.png" />
        <AvatarComponent alt="Person" src="/person.png" />
      </AvatarStack>,
    )

    const expectShapes = () => {
      expect(screen.getByRole('img', {name: 'Team'})).toHaveAttribute('data-square', '')
      expect(screen.getByRole('img', {name: 'Team'})).toHaveClass(
        'primer:rounded-[clamp(4px,calc(var(--avatar-size)-24px),var(--borderRadius-medium))]',
      )
      expect(screen.getByRole('img', {name: 'Team'})).not.toHaveClass('primer:rounded-[50%]')
      expect(screen.getByRole('img', {name: 'Person'})).toHaveClass('primer:rounded-[50%]')
    }

    expectShapes()
    rerender(
      <AvatarStack shape="circle" size={16}>
        <AvatarComponent alt="Person" src="/person.png" />
        <AvatarComponent square alt="Team" src="/team.png" />
      </AvatarStack>,
    )
    expectShapes()
  })

  it.each([
    ['direct', Avatar],
    ['forwarding wrapper', ForwardingAvatar],
  ] as const)('forces %s avatars square when the stack shape is square', (_name, AvatarComponent) => {
    render(
      <AvatarStack shape="square" size={16}>
        <AvatarComponent square={false} shape="circle" alt="First" src="/first.png" />
        <AvatarComponent square={false} shape="circle" alt="Second" src="/second.png" />
      </AvatarStack>,
    )

    for (const name of ['First', 'Second']) {
      expect(screen.getByRole('img', {name})).toHaveAttribute('data-square', '')
      expect(screen.getByRole('img', {name})).toHaveClass(
        'primer:rounded-[clamp(4px,calc(var(--avatar-size)-24px),var(--borderRadius-medium))]',
      )
      expect(screen.getByRole('img', {name})).not.toHaveClass('primer:rounded-[50%]')
    }
  })

  it('preserves the Avatar shape prop and custom rounding inside a stack', () => {
    render(
      <AvatarStack size={16}>
        <Avatar shape="square" alt="Team" src="/team.png" />
        <Avatar square className="rounded-none" alt="Custom" src="/custom.png" />
      </AvatarStack>,
    )

    expect(screen.getByRole('img', {name: 'Team'})).toHaveAttribute('data-shape', 'square')
    expect(screen.getByRole('img', {name: 'Team'})).toHaveClass(
      'primer:rounded-[clamp(4px,calc(var(--avatar-size)-24px),var(--borderRadius-medium))]',
    )
    expect(screen.getByRole('img', {name: 'Custom'})).toHaveClass('rounded-none')
  })

  it('preserves a square shape chosen inside a forwarding wrapper', () => {
    render(
      <AvatarStack size={16}>
        <Avatar alt="Person" src="/person.png" />
        <TeamAvatar alt="Team" src="/team.png" />
      </AvatarStack>,
    )

    expect(screen.getByRole('img', {name: 'Team'})).toHaveAttribute('data-square', '')
    expect(screen.getByRole('img', {name: 'Team'})).toHaveClass(
      'primer:rounded-[clamp(4px,calc(var(--avatar-size)-24px),var(--borderRadius-medium))]',
    )
    expect(screen.getByRole('img', {name: 'Team'})).not.toHaveClass('primer:rounded-[50%]')
  })

  it('preserves legacy prop precedence for wrappers that choose defaults before forwarding stack props', () => {
    const {rerender} = render(
      <AvatarStack>
        <EntityAvatar avatarSize={16} entity="team" alt="Team first" src="/team.png" />
        <EntityAvatar avatarSize={16} entity="person" alt="Person" src="/person.png" />
        <EntityAvatar avatarSize={16} entity="app" alt="App last" src="/app.png" />
      </AvatarStack>,
    )
    for (const name of ['Team first', 'Person', 'App last']) {
      expect(screen.getByRole('img', {name})).not.toHaveAttribute('data-square')
    }
    expect(screen.getByRole('img', {name: 'Team first'}).closest('[data-component="AvatarStack"]')).toHaveStyle(
      '--stack-size-narrow: 20px',
    )

    rerender(
      <AvatarStack shape="square" size={16}>
        <EntityAvatar avatarSize={16} entity="team" alt="Team first" src="/team.png" />
        <EntityAvatar avatarSize={16} entity="person" alt="Person" src="/person.png" />
        <EntityAvatar avatarSize={16} entity="app" alt="App last" src="/app.png" />
      </AvatarStack>,
    )
    for (const name of ['Team first', 'Person', 'App last']) {
      expect(screen.getByRole('img', {name})).toHaveAttribute('data-square', '')
    }
    expect(screen.getByRole('img', {name: 'Team first'}).closest('[data-component="AvatarStack"]')).toHaveStyle(
      '--avatar-stack-size: 16px',
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
    expect(screen.getByRole('img', {name: 'Sixth'})).toHaveClass('primer:invisible')
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
    expect(screen.getByRole('link', {name: 'Primer profile'})).toHaveClass('primer:size-[var(--avatar-stack-size)]')
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
    expect(within(container).getByRole('img', {name: 'Sixth'})).not.toHaveClass('primer:group-hover:visible')
  })
})
