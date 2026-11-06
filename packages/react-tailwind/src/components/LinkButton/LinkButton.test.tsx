import {fireEvent, render, screen, within} from '@testing-library/react'
import {expect, it, vi} from 'vitest'
import {LinkButton} from './LinkButton'

it('composes button styling onto an anchor and forwards anchor props', () => {
  render(
    <LinkButton data-testid="link-button" href="/settings">
      Settings
    </LinkButton>,
  )

  expect(screen.getByRole('link', {name: 'Settings'})).toHaveAttribute('href', '/settings')
  expect(screen.getByTestId('link-button')).toHaveAttribute('data-component', 'LinkButton')
})

it('uses intrinsic width unless block layout is requested', () => {
  const {container, rerender} = render(<LinkButton href="/settings">Settings</LinkButton>)

  // Like upstream's `[href]` rule, links stay inline while buttons are block-level flex containers.
  expect(container.firstElementChild).toHaveClass('[&[href]]:inline-flex')
  expect(container.firstElementChild).not.toHaveClass('w-full')

  rerender(
    <LinkButton block href="/settings">
      Settings
    </LinkButton>,
  )

  expect(container.firstElementChild).toHaveClass('w-full')
})

it('uses block flex sizing for a native anchor without an href', () => {
  const {container} = render(<LinkButton loading>Settings</LinkButton>)

  expect(container.firstElementChild).toHaveClass('w-full')
  expect(container.firstElementChild).not.toHaveAttribute('role', 'button')
})

it('marks a link without visuals so link underlines can target the whole control', () => {
  const {rerender} = render(<LinkButton href="/docs">Docs</LinkButton>)
  expect(screen.getByRole('link', {name: 'Docs'})).toHaveAttribute('data-no-visuals', 'true')

  rerender(
    <LinkButton href="/docs" leadingVisual={() => <svg aria-hidden="true" />}>
      Docs
    </LinkButton>,
  )
  expect(screen.getByRole('link', {name: 'Docs'})).not.toHaveAttribute('data-no-visuals')
})

it('reuses Button content parts and loading behavior', () => {
  const onClick = vi.fn()
  const {container, rerender} = render(
    <LinkButton href="/settings" leadingVisual={<span data-testid="leading" />} trailingAction={<span />} count={2}>
      Settings
    </LinkButton>,
  )

  const link = screen.getByRole('link', {name: /Settings.*2/})
  expect(link).toHaveAttribute('data-component', 'LinkButton')
  expect(link.querySelector('[data-component="leadingVisual"]')).toContainElement(screen.getByTestId('leading'))
  expect(link.querySelector('[data-component="trailingAction"]')).toBeInTheDocument()

  rerender(
    <LinkButton href="/settings" loading onClick={onClick}>
      Settings
    </LinkButton>,
  )
  const loadingLink = within(container).getByRole('link', {name: 'Settings'})
  fireEvent.click(loadingLink)
  expect(onClick).not.toHaveBeenCalled()
  expect(loadingLink).toHaveAttribute('aria-busy', 'true')
})

it('keeps consumer descriptions alongside the loading announcement', () => {
  render(
    <>
      <LinkButton aria-describedby="publish-hint" href="/publish" loading>
        Publish
      </LinkButton>
      <span id="publish-hint">Saves the draft</span>
    </>,
  )

  expect(screen.getByRole('link', {name: 'Publish'})).toHaveAccessibleDescription('Loading Saves the draft')
})

it('lets composed components replace its data-component marker', () => {
  render(
    <LinkButton data-component="SelectPanel.SecondaryActionLink" href="/labels">
      Edit labels
    </LinkButton>,
  )

  expect(screen.getByRole('link', {name: 'Edit labels'})).toHaveAttribute(
    'data-component',
    'SelectPanel.SecondaryActionLink',
  )
})

it('composes a custom router link through render', () => {
  render(
    <LinkButton
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      render={<a data-router-link="" href="/projects" />}
    >
      Projects
    </LinkButton>,
  )

  expect(screen.getByRole('link', {name: 'Projects'})).toHaveAttribute('data-router-link')
})
