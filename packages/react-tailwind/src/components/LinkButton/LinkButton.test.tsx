import {act, fireEvent, render, screen, within} from '@testing-library/react'
import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
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
  expect(container.firstElementChild).toHaveClass('primer:[&[href]]:inline-flex')
  expect(container.firstElementChild).not.toHaveClass('primer:w-full')

  rerender(
    <LinkButton block href="/settings">
      Settings
    </LinkButton>,
  )

  expect(container.firstElementChild).toHaveClass('primer:w-full')
})

it('uses block flex sizing for a native anchor without an href', () => {
  const {container} = render(<LinkButton loading>Settings</LinkButton>)

  expect(container.firstElementChild).toHaveClass('primer:w-full')
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
  expect(loadingLink).not.toHaveAttribute('aria-busy')
  expect(within(loadingLink).getByText('Settings')).toHaveClass('primer:[visibility:hidden]')
  expect(loadingLink.querySelector('[data-component="leadingVisual"]')).toHaveClass('primer:[position:absolute]')
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

it('preserves a consumer description while an external announcer owns loading', () => {
  const onClick = vi.fn()
  const {rerender} = render(
    <>
      <span id="link-hint">Opens the guide.</span>
      <LinkButton aria-describedby="link-hint" href="/guide" loading loadingAnnouncement="" onClick={onClick}>
        Guide
      </LinkButton>
    </>,
  )

  const link = screen.getByRole('link', {name: 'Guide'})
  expect(link).toHaveAttribute('href', '/guide')
  expect(link).toHaveAttribute('aria-disabled', 'true')
  expect(link).not.toHaveAttribute('aria-busy')
  expect(link).toHaveAttribute('aria-describedby', 'link-hint')
  expect(link).toHaveAccessibleDescription('Opens the guide.')
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  fireEvent.click(link)
  expect(onClick).not.toHaveBeenCalled()

  rerender(
    <>
      <span id="link-hint">Opens the guide.</span>
      <LinkButton aria-describedby="link-hint" href="/guide" loading loadingAnnouncement="Opening guide">
        Guide
      </LinkButton>
    </>,
  )
  expect(link).toHaveAccessibleDescription('Opening guide Opens the guide.')
  expect(screen.getByRole('status')).toHaveTextContent('Opening guide')
})

it('keeps the loading announcement ahead of descriptions on a rendered link', () => {
  render(
    <>
      <LinkButton
        aria-describedby="outer-hint"
        loading
        // The LinkButton supplies the anchor's children.
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        render={<a aria-describedby="render-hint" href="/publish" />}
      >
        Publish
      </LinkButton>
      <span id="outer-hint">Saves the draft.</span>
      <span id="render-hint">Requires approval.</span>
    </>,
  )
  expect(screen.getByRole('link', {name: 'Publish'})).toHaveAccessibleDescription(
    'Loading Requires approval. Saves the draft.',
  )
})

it('updates and deduplicates callback-rendered descriptions as loading changes', () => {
  function Example({loading, outerId}: {loading: boolean; outerId: string}) {
    return (
      <>
        <span id="render-hint">Requires approval.</span>
        <span id="shared-hint">Shared context.</span>
        <span id="first-hint">Saves the draft.</span>
        <span id="second-hint">Publishes the draft.</span>
        <LinkButton
          aria-describedby={`shared-hint ${outerId}`}
          loading={loading}
          render={props => (
            <a {...props} aria-describedby="render-hint shared-hint" href="/publish">
              {props.children}
            </a>
          )}
        >
          Publish
        </LinkButton>
      </>
    )
  }

  const {rerender} = render(<Example loading outerId="first-hint" />)
  const link = screen.getByRole('link', {name: 'Publish'})
  expect(link).toHaveAccessibleDescription('Loading Requires approval. Shared context. Saves the draft.')
  const loadingIds = link.getAttribute('aria-describedby')?.split(/\s+/) ?? []
  expect(new Set(loadingIds).size).toBe(loadingIds.length)
  expect(document.getElementById(loadingIds[0])).toHaveTextContent('Loading')

  rerender(<Example loading={false} outerId="second-hint" />)
  expect(link).toHaveAccessibleDescription('Requires approval. Shared context. Publishes the draft.')
  expect(link).toHaveAttribute('aria-describedby', 'render-hint shared-hint second-hint')
  expect(document.getElementById(loadingIds[0])).not.toBeInTheDocument()

  rerender(<Example loading outerId="second-hint" />)
  expect(link).toHaveAccessibleDescription('Loading Requires approval. Shared context. Publishes the draft.')
})

it('hydrates a loading link with descriptions from a render callback', async () => {
  const app = (
    <>
      <span id="link-hint">Requires approval.</span>
      <LinkButton
        loading
        render={props => (
          <a {...props} aria-describedby="link-hint" href="/publish">
            {props.children}
          </a>
        )}
      >
        Publish
      </LinkButton>
    </>
  )
  const container = document.createElement('div')
  container.innerHTML = renderToString(app)
  document.body.append(container)
  const link = within(container).getByRole('link', {name: 'Publish'})
  const serverIds = link.getAttribute('aria-describedby')
  expect(link).toHaveAccessibleDescription('Loading Requires approval.')

  const onRecoverableError = vi.fn()
  let root: ReturnType<typeof hydrateRoot> | undefined
  try {
    await act(async () => {
      root = hydrateRoot(container, app, {onRecoverableError})
    })
    expect(link).toHaveAttribute('aria-describedby', serverIds)
    expect(link).toHaveAccessibleDescription('Loading Requires approval.')
    expect(onRecoverableError).not.toHaveBeenCalled()
  } finally {
    await act(async () => root?.unmount())
    container.remove()
  }
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
