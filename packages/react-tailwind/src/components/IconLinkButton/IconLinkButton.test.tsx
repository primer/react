import {PlusIcon} from '@primer/octicons-react'
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {expect, it, vi} from 'vitest'
import {Tooltip} from '../Tooltip'
import {IconLinkButton, type IconLinkButtonProps} from './IconLinkButton'

// @ts-expect-error Icon-only links require either an aria-label or an aria-labelledby.
const unnamedLink: IconLinkButtonProps = {href: '/repository', icon: PlusIcon}
void unnamedLink

it('renders a native icon link and forwards its ref and anchor props', () => {
  const ref = React.createRef<HTMLAnchorElement>()
  const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
  render(
    <IconLinkButton
      aria-label="View repository"
      data-testid="repository-link"
      href="/repository"
      icon={PlusIcon}
      onClick={onClick}
      ref={ref}
      target="_blank"
    />,
  )

  const link = screen.getByRole('link', {name: 'View repository'})
  expect(link).toBe(ref.current)
  expect(link).toHaveAttribute('href', '/repository')
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('data-component', 'IconLinkButton')
  expect(link).not.toHaveAttribute('role')
  expect(screen.queryByRole('button', {name: 'View repository'})).not.toBeInTheDocument()
  fireEvent.click(link, {ctrlKey: true})
  expect(onClick).toHaveBeenCalledOnce()
  expect(onClick.mock.calls[0][0].ctrlKey).toBe(true)
})

it('allows consumer size and dimension utilities to override its default sizing', () => {
  render(
    <>
      <IconLinkButton aria-label="Custom size" className="size-5" href="/size" icon={PlusIcon} size="small" />
      <IconLinkButton
        aria-label="Custom dimensions"
        className="h-10 w-12"
        href="/dimensions"
        icon={PlusIcon}
        size="small"
      />
    </>,
  )

  const customSize = screen.getByRole('link', {name: 'Custom size'})
  expect(customSize).toHaveClass('size-5')
  expect(customSize).not.toHaveClass('primer:size-[max(28px,calc(var(--base-size-4)*7))]')
  expect(screen.getByRole('link', {name: 'Custom dimensions'})).toHaveClass('h-10', 'w-12')
})

it('merges tooltip descriptions and keybinding hints with external references', () => {
  render(
    <>
      <span id="repository-note">Opens repository settings</span>
      <IconLinkButton
        aria-describedby="repository-note"
        aria-label="Repository"
        description="View repository"
        href="/repository"
        icon={PlusIcon}
        keybindingHint="Control+R"
      />
    </>,
  )

  expect(screen.getByRole('link', {name: 'Repository'})).toHaveAccessibleDescription(
    'Opens repository settings View repository (control r)',
  )
})

it('associates its built-in tooltip popup with the link', () => {
  render(<IconLinkButton aria-label="Repository" href="/repository" icon={PlusIcon} keybindingHint="Control+R" />)

  const link = screen.getByRole('link', {name: 'Repository'})
  const owner = link.getAttribute('data-tooltip-trigger')
  expect(owner).toBeTruthy()
  expect(document.querySelector('[data-component="Tooltip.Content"]')?.getAttribute('data-tooltip-popup')).toBe(owner)
  expect(link).not.toHaveAttribute('aria-labelledby')
  expect(link).toHaveAccessibleDescription('(control r)')
})

it('merges a rendered anchor description with its own tooltip description', () => {
  render(
    <>
      <span id="existing-description">Existing context.</span>
      <IconLinkButton
        aria-label="Account settings"
        description="Opens account settings."
        icon={PlusIcon}
        // The IconLinkButton supplies the anchor's children.
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        render={<a aria-describedby="existing-description" href="/settings" />}
      />
    </>,
  )

  expect(screen.getByRole('link', {name: 'Account settings'})).toHaveAccessibleDescription(
    'Existing context. Opens account settings.',
  )
})

it('merges router and trigger descriptions with an enclosing tooltip', () => {
  const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'> & {to: string}>(
    function RouterLink({children, to, ...props}, ref) {
      return (
        <a {...props} href={to} ref={ref}>
          {children}
        </a>
      )
    },
  )
  const ref = React.createRef<HTMLAnchorElement>()
  render(
    <>
      <span id="router-description">Existing context.</span>
      <Tooltip>
        <Tooltip.Trigger
          ref={ref}
          render={
            <IconLinkButton
              aria-label="Account settings"
              icon={PlusIcon}
              render={<RouterLink aria-describedby="router-description" to="/settings" />}
            />
          }
        />
        <Tooltip.Content>Opens account settings.</Tooltip.Content>
      </Tooltip>
    </>,
  )

  const link = screen.getByRole('link', {name: 'Account settings'})
  expect(link).toBe(ref.current)
  expect(link).toHaveAttribute('href', '/settings')
  expect(link).toHaveAccessibleDescription('Existing context. Opens account settings.')
})

it('merges descriptions from router render callbacks with own and enclosing tooltip roots', () => {
  const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'> & {to: string}>(
    function RouterLink({children, to, ...props}, ref) {
      return (
        <a {...props} href={to} ref={ref}>
          {children}
        </a>
      )
    },
  )
  const ownRef = React.createRef<HTMLAnchorElement>()
  const outerRef = React.createRef<HTMLAnchorElement>()
  render(
    <>
      <span id="callback-description">Existing context.</span>
      <IconLinkButton
        aria-label="Own tooltip settings"
        description="Opens account settings."
        icon={PlusIcon}
        ref={ownRef}
        render={props => <RouterLink {...props} aria-describedby="callback-description" to="/own-settings" />}
      />
      <Tooltip.Root>
        <Tooltip.Trigger
          ref={outerRef}
          render={
            <IconLinkButton
              aria-label="Enclosing tooltip settings"
              icon={PlusIcon}
              render={props => <RouterLink {...props} aria-describedby="callback-description" to="/outer-settings" />}
            />
          }
        />
        <Tooltip.Content>Opens account settings.</Tooltip.Content>
      </Tooltip.Root>
    </>,
  )

  const own = screen.getByRole('link', {name: 'Own tooltip settings'})
  const outer = screen.getByRole('link', {name: 'Enclosing tooltip settings'})
  expect(own).toBe(ownRef.current)
  expect(outer).toBe(outerRef.current)
  expect(own).toHaveAttribute('href', '/own-settings')
  expect(outer).toHaveAttribute('href', '/outer-settings')
  expect(own).toHaveAccessibleDescription('Existing context. Opens account settings.')
  expect(outer).toHaveAccessibleDescription('Existing context. Opens account settings.')
  expect(document.querySelectorAll('[data-component="Tooltip.Content"]')).toHaveLength(2)
})

it('uses an external label for the accessible name and its own label for the tooltip', () => {
  render(
    <>
      <span id="repository-name">Repository settings</span>
      <IconLinkButton
        aria-label="Settings"
        aria-labelledby="repository-name"
        href="/repository"
        icon={PlusIcon}
        notificationIndicator="icon"
      />
    </>,
  )

  const link = screen.getByRole('link', {name: 'Repository settings'})
  expect(link).not.toHaveAttribute('aria-label')
  expect(link).toHaveAttribute('data-notification-indicator', 'icon')
  expect(link.className).toContain('primer:before:size-2')
})

it('accepts an external accessible name without requiring aria-label', () => {
  render(
    <>
      <span id="link-name">Repository settings</span>
      <IconLinkButton
        aria-labelledby="link-name"
        description="Opens repository settings"
        href="/repository"
        icon={PlusIcon}
      />
    </>,
  )

  const link = screen.getByRole('link', {name: 'Repository settings'})
  expect(link).not.toHaveAttribute('aria-label')
  expect(link).toHaveAttribute('aria-labelledby', 'link-name')
  expect(link).toHaveAccessibleDescription('Opens repository settings')
})

it('uses the consumer tooltip instead of nesting another one', () => {
  render(
    <Tooltip>
      <Tooltip.Trigger render={<IconLinkButton aria-label="Repository" href="/repository" icon={PlusIcon} />} />
      <Tooltip.Content>Open repository</Tooltip.Content>
    </Tooltip>,
  )

  expect(screen.getByRole('link', {name: 'Repository'})).toHaveAccessibleDescription('Open repository')
  expect(document.querySelectorAll('[data-component="Tooltip.Content"]')).toHaveLength(1)
})

it('preserves router composition and its tooltip trigger id', async () => {
  const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'> & {to: string}>(
    function RouterLink({children, to, ...props}, ref) {
      return (
        <a {...props} href={to} ref={ref}>
          {children}
        </a>
      )
    },
  )
  const ref = React.createRef<HTMLAnchorElement>()
  render(
    <IconLinkButton
      aria-label="Projects"
      icon={PlusIcon}
      id="projects-link"
      ref={ref}
      render={<RouterLink data-router-link="" to="/projects" />}
    />,
  )

  const link = screen.getByRole('link', {name: 'Projects'})
  expect(link).toBe(ref.current)
  expect(link).toHaveAttribute('id', 'projects-link')
  expect(link).toHaveAttribute('href', '/projects')
  expect(link).toHaveAttribute('data-router-link')
  fireEvent.keyDown(document.body, {key: 'Tab'})
  act(() => link.focus())
  await waitFor(() => expect(link).toHaveAttribute('data-popup-open'))
})

it('hydrates icon links with and without their tooltip composition', async () => {
  const app = (
    <>
      <IconLinkButton aria-label="Repository" description="View repository" href="/repository" icon={PlusIcon} />
      {}
      <IconLinkButton aria-label="Settings" href="/settings" icon={PlusIcon} unsafeDisableTooltip />
      <span id="hydration-description">Existing context.</span>
      <Tooltip>
        <Tooltip.Trigger
          render={
            <IconLinkButton
              aria-label="Account settings"
              icon={PlusIcon}
              // The IconLinkButton supplies the anchor's children.
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              render={<a aria-describedby="hydration-description" href="/account" />}
            />
          }
        />
        <Tooltip.Content>Opens account settings.</Tooltip.Content>
      </Tooltip>
    </>
  )
  const container = document.createElement('div')
  container.innerHTML = renderToString(app)
  document.body.append(container)
  const onRecoverableError = vi.fn()
  let root: ReturnType<typeof hydrateRoot> | undefined
  try {
    await act(async () => {
      root = hydrateRoot(container, app, {onRecoverableError})
    })
    expect(screen.getByRole('link', {name: 'Repository'})).toHaveAccessibleDescription('View repository')
    expect(screen.getByRole('link', {name: 'Settings'})).toHaveAttribute('href', '/settings')
    expect(screen.getByRole('link', {name: 'Account settings'})).toHaveAccessibleDescription(
      'Existing context. Opens account settings.',
    )
    expect(onRecoverableError).not.toHaveBeenCalled()
  } finally {
    await act(async () => root?.unmount())
    container.remove()
  }
})

it('keeps an icon link named by its tooltip reference through server rendering and hydration', async () => {
  const app = (
    <Tooltip id="link-tooltip-label" type="label">
      <Tooltip.Trigger
        aria-labelledby="link-tooltip-label"
        render={<IconLinkButton aria-labelledby="link-tooltip-label" href="/repository" icon={PlusIcon} />}
      />
      <Tooltip.Content>View repository</Tooltip.Content>
    </Tooltip>
  )
  const container = document.createElement('div')
  container.innerHTML = renderToString(app)
  document.body.append(container)
  const onRecoverableError = vi.fn()
  let root: ReturnType<typeof hydrateRoot> | undefined
  try {
    const link = container.querySelector('a')
    expect(container.querySelectorAll('[id="link-tooltip-label"]')).toHaveLength(1)
    expect(link).toHaveAttribute('aria-labelledby', 'link-tooltip-label')
    expect(link).toHaveAccessibleName('View repository')
    await act(async () => {
      root = hydrateRoot(container, app, {onRecoverableError})
    })
    expect(screen.getByRole('link', {name: 'View repository'})).toHaveAttribute('aria-labelledby', 'link-tooltip-label')
    expect(document.querySelectorAll('[id="link-tooltip-label"]')).toHaveLength(1)
    expect(onRecoverableError).not.toHaveBeenCalled()
  } finally {
    await act(async () => root?.unmount())
    container.remove()
  }
})
