import React from 'react'
import {act, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {describe, expect, it, vi} from 'vitest'
import {Button} from './Button'

describe('Button', () => {
  it('overlays a lone loading indicator without changing the label width', () => {
    const {unmount} = render(<Button loading>Submit</Button>)

    expect(screen.getByText('Submit')).toHaveClass('primer:[visibility:hidden]')
    expect(screen.getByText('Submit').previousElementSibling).toHaveClass(
      'primer:[position:absolute]',
      'primer:left-1/2',
      'primer:-translate-x-1/2',
    )
    unmount()
  })

  it('reads action alignment through a prefixed arbitrary property', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', {name: 'Save'})
    const classes = [button, ...button.querySelectorAll('*')].flatMap(element => [...element.classList])

    expect(classes).toContain('primer:[align-self:var(--primer-action-align,auto)]')
    expect(classes.filter(name => name.startsWith('self-'))).toEqual([])
  })

  it('uses Base UI button semantics and forwards its ref and props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Button ref={ref} data-testid="button">
        Save
      </Button>,
    )
    expect(screen.getByRole('button', {name: 'Save'})).toHaveAttribute('data-component', 'Button')
    expect(screen.getByTestId('button')).toBe(ref.current)
  })

  it('submits a form only when explicitly given type="submit"', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <Button>Preview</Button>
        <Button type="submit">Create account</Button>
      </form>,
    )

    const preview = screen.getByRole('button', {name: 'Preview'})
    const submit = screen.getByRole('button', {name: 'Create account'})
    expect(preview).toHaveAttribute('type', 'button')
    expect(submit).toHaveAttribute('type', 'submit')
    await user.click(preview)
    expect(onSubmit).not.toHaveBeenCalled()
    await user.click(submit)
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('keeps its action label accessible while loading with a keybinding hint', () => {
    render(
      <Button loading trailingVisual={<kbd>⌘↵</kbd>} variant="primary">
        Submit
      </Button>,
    )

    expect(screen.getByRole('button', {name: /Submit/})).not.toHaveAttribute('aria-busy')
    expect(screen.getByRole('button', {name: /Submit/})).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('button', {name: /Submit/})).not.toBeDisabled()
    expect(screen.queryByText('⌘↵')).not.toBeInTheDocument()
  })

  it('keeps consumer descriptions alongside the loading announcement', () => {
    render(
      <>
        <Button aria-describedby="publish-hint" loading>
          Publish
        </Button>
        <span id="publish-hint">Saves the draft</span>
      </>,
    )

    expect(screen.getByRole('button', {name: 'Publish'})).toHaveAccessibleDescription('Loading Saves the draft')
  })

  it('lets an external announcer own loading without a duplicate status or description', async () => {
    const user = userEvent.setup()
    const announce = vi.fn()

    function Example() {
      const [loading, setLoading] = React.useState(false)
      return (
        <>
          <span id="button-hint">Saves the draft.</span>
          <Button
            aria-describedby="button-hint"
            loading={loading}
            loadingAnnouncement=""
            onClick={() => {
              announce('Saving settings')
              setLoading(true)
            }}
          >
            Save
          </Button>
        </>
      )
    }

    render(<Example />)
    const button = screen.getByRole('button', {name: 'Save'})
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    await user.click(button)

    expect(announce).toHaveBeenCalledExactlyOnceWith('Saving settings')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).not.toHaveAttribute('aria-busy')
    expect(button).toHaveAccessibleDescription('Saves the draft.')
    expect(button).toHaveAttribute('aria-describedby', 'button-hint')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    await user.click(button)
    expect(announce).toHaveBeenCalledOnce()
  })

  it('updates loading status and rendered descriptions when the announcement is enabled or suppressed', () => {
    function Example({announcement}: {announcement: string}) {
      return (
        <>
          <span id="outer-hint">Saves the draft.</span>
          <span id="render-hint">Requires approval.</span>
          <Button
            aria-describedby="outer-hint"
            loading
            loadingAnnouncement={announcement}
            render={<button aria-describedby="render-hint" type="button" />}
          >
            Publish
          </Button>
        </>
      )
    }

    const {rerender} = render(<Example announcement="" />)
    const button = screen.getByRole('button', {name: 'Publish'})
    expect(button).toHaveAccessibleDescription('Requires approval. Saves the draft.')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    rerender(<Example announcement="Saving settings" />)
    expect(button).toHaveAccessibleDescription('Saving settings Requires approval. Saves the draft.')
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Saving settings')
    expect(button.getAttribute('aria-describedby')?.split(/\s+/)).toContain(status.id)

    rerender(<Example announcement="" />)
    expect(status).not.toBeInTheDocument()
    expect(button).toHaveAccessibleDescription('Requires approval. Saves the draft.')
    expect(button).toHaveAttribute('aria-describedby', 'render-hint outer-hint')
  })

  it('keeps the loading announcement ahead of descriptions on a rendered element', () => {
    render(
      <>
        <Button aria-describedby="outer-hint" loading render={<button aria-describedby="render-hint" type="button" />}>
          Publish
        </Button>
        <span id="outer-hint">Saves the draft.</span>
        <span id="render-hint">Requires approval.</span>
      </>,
    )
    expect(screen.getByRole('button', {name: 'Publish'})).toHaveAccessibleDescription(
      'Loading Requires approval. Saves the draft.',
    )
  })

  it('updates and deduplicates rendered callback descriptions as loading changes', () => {
    function Example({loading, outerId}: {loading: boolean; outerId: string}) {
      return (
        <>
          <span id="render-hint">Requires approval.</span>
          <span id="shared-hint">Shared context.</span>
          <span id="first-hint">Saves the draft.</span>
          <span id="second-hint">Publishes the draft.</span>
          <Button
            aria-describedby={`shared-hint ${outerId}`}
            loading={loading}
            render={props => <button {...props} aria-describedby="render-hint shared-hint" type="button" />}
          >
            Publish
          </Button>
        </>
      )
    }

    const {rerender} = render(<Example loading outerId="first-hint" />)
    const button = screen.getByRole('button', {name: 'Publish'})
    expect(button).toHaveAccessibleDescription('Loading Requires approval. Shared context. Saves the draft.')
    const loadingIds = button.getAttribute('aria-describedby')?.split(/\s+/) ?? []
    expect(new Set(loadingIds).size).toBe(loadingIds.length)
    expect(document.getElementById(loadingIds[0])).toHaveTextContent('Loading')

    rerender(<Example loading={false} outerId="second-hint" />)
    expect(button).toHaveAccessibleDescription('Requires approval. Shared context. Publishes the draft.')
    expect(button).toHaveAttribute('aria-describedby', 'render-hint shared-hint second-hint')
    expect(document.getElementById(loadingIds[0])).not.toBeInTheDocument()

    rerender(<Example loading outerId="second-hint" />)
    expect(button).toHaveAccessibleDescription('Loading Requires approval. Shared context. Publishes the draft.')
  })

  it('hydrates a loading button with descriptions on its rendered element', async () => {
    const app = (
      <>
        <span id="button-hint">Requires approval.</span>
        <Button loading render={<button aria-describedby="button-hint" type="button" />}>
          Publish
        </Button>
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(app)
    document.body.append(container)
    const button = within(container).getByRole('button', {name: 'Publish'})
    const serverIds = button.getAttribute('aria-describedby')
    expect(button).toHaveAccessibleDescription('Loading Requires approval.')

    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      expect(button).toHaveAttribute('aria-describedby', serverIds)
      expect(button).toHaveAccessibleDescription('Loading Requires approval.')
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('hydrates a loading button that delegates its announcement', async () => {
    const app = (
      <>
        <span id="button-hint">Requires approval.</span>
        <Button aria-describedby="button-hint" loading loadingAnnouncement="">
          Publish
        </Button>
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(app)
    document.body.append(container)
    const button = within(container).getByRole('button', {name: 'Publish'})
    expect(button).toHaveAttribute('aria-describedby', 'button-hint')
    expect(container.querySelector('[role="status"]')).toBeNull()

    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      expect(button).toHaveAccessibleDescription('Requires approval.')
      expect(button).toHaveAttribute('aria-disabled', 'true')
      expect(container.querySelector('[role="status"]')).toBeNull()
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('renders Primer-compatible visual, counter, and inactive parts', () => {
    render(
      <Button count={3} inactive leadingVisual={() => <span data-testid="icon" />}>
        Watch
      </Button>,
    )

    const button = screen.getByRole('button', {name: /Watch/})
    expect(button).toHaveAttribute('data-inactive', 'true')
    expect(button).not.toBeDisabled()
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('data-component', 'leadingVisual')
    expect(screen.getByText('3')).toHaveAttribute('data-component', 'ButtonCounter')
  })

  it('drops hover, pressed, and expanded feedback while inactive', () => {
    const {rerender} = render(<Button>Merge</Button>)
    expect(screen.getByRole('button', {name: 'Merge'})).toHaveClass(
      'primer:hover:bg-[var(--button-default-bgColor-hover)]',
      'primer:aria-expanded:bg-[var(--button-default-bgColor-active)]',
    )

    rerender(<Button inactive>Merge</Button>)
    const button = screen.getByRole('button', {name: 'Merge'})
    expect(button).toHaveClass('primer:bg-[var(--button-inactive-bgColor)]')
    expect(button).not.toHaveClass('primer:hover:bg-[var(--button-default-bgColor-hover)]')
    expect(button).not.toHaveClass('primer:aria-expanded:bg-[var(--button-default-bgColor-active)]')
  })

  it('does not add a native button type to a non-button render target', () => {
    const {container} = render(
      <Button nativeButton={false} render={<span />}>
        Save
      </Button>,
    )

    expect(container.querySelector('[role="button"]')).not.toHaveAttribute('type')
  })

  it('places the notification indicator on the button or leading visual', () => {
    const {rerender} = render(<Button notificationIndicator="button">Inbox</Button>)
    expect(screen.getByRole('button', {name: 'Inbox'})).toHaveAttribute('data-notification-indicator', 'button')
    expect(screen.getByRole('button', {name: 'Inbox'}).className).toContain('primer:before:size-2')

    rerender(
      <Button leadingVisual={() => <svg aria-hidden="true" data-testid="gear" />} notificationIndicator="leadingVisual">
        View
      </Button>,
    )
    const leadingVisual = screen.getByTestId('gear').closest('[data-component="leadingVisual"]')
    expect(leadingVisual?.className).toContain('primer:before:size-2')
    expect(screen.getByRole('button', {name: 'View'}).className).not.toContain('primer:before:size-2')
  })
})
