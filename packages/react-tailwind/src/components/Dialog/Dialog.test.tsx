import React from 'react'
import {act, cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {Dialog} from './Dialog'
import {Button} from '../Button'
import {LinkButton} from '../LinkButton'
import {Popover} from '../Popover'

function mockOverflow() {
  const scrollHeight = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(200)
  const clientHeight = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
  return () => {
    scrollHeight.mockRestore()
    clientHeight.mockRestore()
  }
}

describe('Dialog', () => {
  afterEach(cleanup)

  it('preserves footer action markup through server rendering and hydration', async () => {
    const example = (
      <Dialog.Footer>
        <Button>Cancel</Button>
        <LinkButton href="/settings">Save changes</LinkButton>
        <Button labelWrap={false}>Keep one line</Button>
      </Dialog.Footer>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(example)
    document.body.append(container)
    const serverMarkup = container.innerHTML
    const errors: unknown[] = []
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, example, {onRecoverableError: error => errors.push(error)})
      })
      expect(errors).toEqual([])
      expect(container.innerHTML).toBe(serverMarkup)
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('supports controlled state and exposes a title and description', () => {
    const onOpenChange = vi.fn()
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <Dialog.Content>
          <Dialog.Title>Delete repository?</Dialog.Title>
          <Dialog.Description>This cannot be undone.</Dialog.Description>
        </Dialog.Content>
      </Dialog>,
    )
    expect(screen.getByRole('dialog', {name: 'Delete repository?'})).toHaveAccessibleDescription(
      'This cannot be undone.',
    )
  })

  it('supports rendering a level-one title while preserving its name and ref', () => {
    const titleRef = React.createRef<HTMLHeadingElement>()
    render(
      <Dialog open>
        <Dialog.Content>
          {/* eslint-disable-next-line jsx-a11y/heading-has-content -- Dialog.Title supplies the rendered heading content. */}
          <Dialog.Title id="settings-title" ref={titleRef} render={<h1 />}>
            Settings
          </Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    const title = screen.getByRole('heading', {level: 1, name: 'Settings'})
    const dialog = screen.getByRole('dialog', {name: 'Settings'})
    expect(titleRef.current).toBe(title)
    expect(title).toHaveAttribute('id', 'settings-title')
    expect(title).toHaveAttribute('data-component', 'Dialog.Title')
    expect(dialog).toHaveAttribute('aria-labelledby', 'settings-title')
  })

  it.each([
    {modal: undefined, isModal: true, name: 'default'},
    {modal: true, isModal: true, name: 'modal'},
    {modal: false, isModal: false, name: 'non-modal'},
    {modal: 'trap-focus' as const, isModal: false, name: 'focus-trapping'},
  ])('exposes the $name dialog modality', ({modal, isModal}) => {
    render(
      <Dialog modal={modal} open>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    const dialog = screen.getByRole('dialog', {name: 'Settings'})
    if (isModal) {
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    } else {
      expect(dialog).not.toHaveAttribute('aria-modal')
    }
  })

  it('updates the modality when the root mode changes', () => {
    const {rerender} = render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )
    expect(screen.getByRole('dialog', {name: 'Settings'})).toHaveAttribute('aria-modal', 'true')

    rerender(
      <Dialog modal={false} open>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )
    expect(screen.getByRole('dialog', {name: 'Settings'})).not.toHaveAttribute('aria-modal')
  })

  it('forwards an explicit modal state to the low-level popup', () => {
    render(
      <Dialog modal={false} open>
        <Dialog.Portal>
          <Dialog.Viewport>
            <Dialog.Popup aria-modal={false}>
              <Dialog.Title>Settings</Dialog.Title>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog>,
    )
    expect(screen.getByRole('dialog', {name: 'Settings'})).toHaveAttribute('aria-modal', 'false')
  })

  it('dismisses with escape and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )
    const trigger = screen.getByRole('button', {name: 'Open dialog'})
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it.each(['ref', 'callback'] as const)(
    'restores focus to a tabbable child of a non-tabbable finalFocus container passed by %s',
    async mode => {
      const user = userEvent.setup()
      function Example() {
        const containerRef = React.useRef<HTMLDivElement>(null)
        const finalFocus = mode === 'ref' ? containerRef : () => containerRef.current
        return (
          <>
            <div ref={containerRef} tabIndex={-1}>
              <button aria-disabled="true" type="button">
                Feedback response
              </button>
            </div>
            <Dialog>
              <Dialog.Trigger>Open dialog</Dialog.Trigger>
              <Dialog.Content finalFocus={finalFocus}>
                <Dialog.Title>Feedback</Dialog.Title>
              </Dialog.Content>
            </Dialog>
          </>
        )
      }

      render(<Example />)
      await user.click(screen.getByRole('button', {name: 'Open dialog'}))
      await user.keyboard('{Escape}')
      await waitFor(() => expect(screen.getByRole('button', {name: 'Feedback response'})).toHaveFocus())
    },
  )

  it('closes on the first Escape while the focused close button shows its tooltip', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
        </Dialog.Content>
      </Dialog>,
    )
    const trigger = screen.getByRole('button', {name: 'Open dialog'})
    trigger.focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.getByRole('button', {name: 'Close'})).toHaveFocus())
    expect(await screen.findByText('Close')).toBeVisible()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('describes the dialog with its subtitle', () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Delete repository?</Dialog.Title>
            <Dialog.Subtitle>This cannot be undone.</Dialog.Subtitle>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog>,
    )
    expect(screen.getByText('This cannot be undone.')).toHaveAttribute('data-component', 'Dialog.Subtitle')
    expect(screen.getByRole('dialog', {name: 'Delete repository?'})).toHaveAccessibleDescription(
      'This cannot be undone.',
    )
  })

  it('forwards content refs and rest props', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Dialog>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Content ref={ref} data-testid="dialog">
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', {name: 'Open dialog'}))
    expect(ref.current).toBe(screen.getByTestId('dialog'))
    expect(ref.current).toHaveAttribute('data-component', 'Dialog.Content')
    expect(ref.current).toHaveClass('primer:bg-[var(--overlay-bgColor)]')
  })

  it.each([{modal: false}, {modal: 'trap-focus' as const}])(
    'keeps the default backdrop pointer-transparent for modal=$modal',
    ({modal}) => {
      render(
        <Dialog modal={modal} open>
          <Dialog.Content>
            <Dialog.Title>Settings</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      )

      expect(document.querySelector('[data-component="Dialog.Backdrop"]')).toHaveClass('primer:pointer-events-none')
    },
  )

  it('allows the default backdrop to be omitted', () => {
    render(
      <Dialog modal="trap-focus" open>
        <Dialog.Content backdrop={false}>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    expect(document.querySelector('[data-component="Dialog.Backdrop"]')).not.toBeInTheDocument()
  })

  it('keeps Primer markers immutable and uses semantic backdrop motion styles', () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Backdrop data-component="consumer" data-testid="backdrop" />
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    const backdrop = screen.getByTestId('backdrop')
    expect(backdrop).toHaveAttribute('data-component', 'Dialog.Backdrop')
    expect(backdrop).toHaveClass(
      'primer:z-modal',
      'primer:bg-[var(--overlay-backdrop-bgColor)]',
      'primer:contrast-more:bg-neutral-emphasis',
      'primer:motion-reduce:transition-none',
    )
  })

  it('layers a nested backdrop and viewport above their floating parent and allows overrides', () => {
    const {rerender} = render(
      <Popover defaultOpen>
        <Popover.Content>
          <Dialog open>
            <Dialog.Content>
              <Dialog.Title>Nested settings</Dialog.Title>
            </Dialog.Content>
          </Dialog>
        </Popover.Content>
      </Popover>,
    )

    expect(document.querySelector('[data-component="Dialog.Backdrop"]')).toHaveClass('primer:z-popover')
    expect(document.querySelector('[data-component="Dialog.Viewport"]')).toHaveClass('primer:z-popover')

    rerender(
      <Popover defaultOpen>
        <Popover.Content>
          <Dialog open>
            <Dialog.Content backdropClassName="z-[401]" viewportClassName="z-[402]">
              <Dialog.Title>Nested settings</Dialog.Title>
            </Dialog.Content>
          </Dialog>
        </Popover.Content>
      </Popover>,
    )

    const backdrop = document.querySelector('[data-component="Dialog.Backdrop"]')
    const viewport = document.querySelector('[data-component="Dialog.Viewport"]')
    expect(backdrop).toHaveClass('z-[401]')
    expect(backdrop).not.toHaveClass('primer:z-popover')
    expect(viewport).toHaveClass('z-[402]')
    expect(viewport).not.toHaveClass('primer:z-popover')
  })

  it('exposes Primer size and position markers with upstream defaults', () => {
    render(
      <Dialog open>
        <Dialog.Content data-testid="dialog">
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-width', 'xlarge')
    expect(dialog).toHaveAttribute('data-height', 'auto')
    expect(dialog).toHaveAttribute('data-position-narrow', 'center')
    expect(dialog).toHaveAttribute('data-position-regular', 'center')
    expect(dialog).not.toHaveAttribute('data-align')
    expect(dialog).toHaveClass(
      'primer:w-[640px]',
      'primer:h-auto',
      'primer:min-w-[min(296px,100%)]',
      'primer:max-w-[calc(100dvw-64px)]',
    )
  })

  it('maps responsive positions and alignment onto the popup and viewport', () => {
    const {rerender} = render(
      <Dialog open>
        <Dialog.Content align="top" data-testid="dialog" position={{narrow: 'bottom', regular: 'center'}} width="small">
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    let dialog = screen.getByTestId('dialog')
    let viewport = document.querySelector('[data-component="Dialog.Viewport"]')
    expect(dialog).toHaveAttribute('data-position-narrow', 'bottom')
    expect(dialog).toHaveAttribute('data-align', 'top')
    expect(dialog).toHaveClass('primer:w-[296px]', 'primer:max-md:w-dvw', 'primer:max-md:rounded-b-none')
    expect(viewport).toHaveClass('primer:max-md:items-end', 'primer:md:items-start', 'primer:md:pt-16')
    expect(viewport).not.toHaveClass('primer:max-md:pt-16')

    rerender(
      <Dialog open>
        <Dialog.Content data-testid="dialog" position="right">
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    dialog = screen.getByTestId('dialog')
    viewport = document.querySelector('[data-component="Dialog.Viewport"]')
    expect(dialog).toHaveAttribute('data-position-regular', 'right')
    expect(dialog).not.toHaveAttribute('data-position-narrow')
    expect(dialog).toHaveClass('primer:h-dvh', 'primer:rounded-r-none')
    expect(viewport).toHaveClass('primer:justify-end', 'primer:p-0')
    expect(viewport).not.toHaveClass('primer:p-8')
  })

  it('sizes custom widths through a CSS variable and merges consumer styles', () => {
    render(
      <Dialog open>
        <Dialog.Content data-testid="dialog" height="small" style={{color: 'red'}} width={400}>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    const dialog = screen.getByTestId('dialog')
    expect(dialog).not.toHaveAttribute('data-width')
    expect(dialog).toHaveAttribute('data-height', 'small')
    expect(dialog).toHaveClass('primer:w-[var(--dialog-width)]', 'primer:h-[480px]')
    expect(dialog.style.getPropertyValue('--dialog-width')).toBe('400px')
    expect(dialog.style.color).toBe('red')
  })

  it('renders in place when portal is false', () => {
    render(
      <div data-testid="host">
        <Dialog open>
          <Dialog.Content data-testid="dialog" portal={false}>
            <Dialog.Title>Settings</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      </div>,
    )

    expect(screen.getByTestId('host')).toContainElement(screen.getByTestId('dialog'))
  })

  it.each([
    {name: 'portaled content', portal: true, modal: true, popup: false},
    {name: 'inline content', portal: false, modal: true, popup: false},
    {name: 'non-modal content', portal: true, modal: false, popup: false},
    {name: 'focus-trapping content', portal: true, modal: 'trap-focus' as const, popup: false},
    {name: 'portaled popup', portal: true, modal: true, popup: true},
  ])('keeps composite key commands inside $name', ({portal, modal, popup}) => {
    const outside = vi.fn()
    const inside = vi.fn()
    const onPopupKeyDown = vi.fn()
    const content = (
      <>
        <Dialog.Title>Search</Dialog.Title>
        {/* This wrapper observes bubbled events; it is not itself interactive. */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div onKeyDown={inside}>
          <input aria-label="Search terms" />
        </div>
      </>
    )
    render(
      // This wrapper observes bubbled events; it is not itself interactive.
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onKeyDown={outside}>
        <Dialog open modal={modal}>
          {popup ? (
            <Dialog.Portal>
              <Dialog.Viewport>
                <Dialog.Popup onKeyDown={onPopupKeyDown}>{content}</Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          ) : (
            <Dialog.Content onKeyDown={onPopupKeyDown} portal={portal}>
              {content}
            </Dialog.Content>
          )}
        </Dialog>
      </div>,
    )
    const input = screen.getByRole('textbox', {name: 'Search terms'})
    for (const key of ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End']) {
      expect(fireEvent.keyDown(input, {key})).toBe(true)
    }
    expect(inside).toHaveBeenCalledTimes(6)
    expect(onPopupKeyDown).toHaveBeenCalledTimes(6)
    expect(outside).not.toHaveBeenCalled()

    for (const key of ['Enter', 'PageUp', 'PageDown']) {
      expect(fireEvent.keyDown(input, {key})).toBe(true)
    }
    expect(inside).toHaveBeenCalledTimes(9)
    expect(onPopupKeyDown).toHaveBeenCalledTimes(9)
    expect(new Set(outside.mock.calls.map(([event]) => event.key))).toEqual(new Set(['Enter', 'PageUp', 'PageDown']))
  })

  it('does not forward events stopped by a nested widget to a dialog command scope', () => {
    const onKeyDown = vi.fn()
    render(
      <Dialog open>
        <Dialog.Content onKeyDown={onKeyDown}>
          <Dialog.Title>Search</Dialog.Title>
          <button type="button" onKeyDown={event => event.stopPropagation()}>
            Nested widget
          </button>
        </Dialog.Content>
      </Dialog>,
    )

    fireEvent.keyDown(screen.getByRole('button', {name: 'Nested widget'}), {key: 'ArrowDown'})
    expect(onKeyDown).not.toHaveBeenCalled()
  })

  it('waits for a portal container, accepts a ref, and ignores it when rendering in place', async () => {
    const portalContainer = document.createElement('div')
    document.body.append(portalContainer)
    const dialog = (container: HTMLDivElement | React.RefObject<HTMLDivElement | null> | null, portal = true) => (
      <div data-testid="host">
        <Dialog open>
          <Dialog.Content container={container} data-testid="dialog" portal={portal}>
            <Dialog.Title>Settings</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      </div>
    )

    try {
      const {rerender} = render(dialog(null))
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()

      rerender(dialog(portalContainer))
      expect(await screen.findByTestId('dialog')).not.toHaveAttribute('container')
      expect(portalContainer).toContainElement(screen.getByTestId('dialog'))

      rerender(dialog({current: portalContainer}))
      await waitFor(() => expect(portalContainer).toContainElement(screen.getByTestId('dialog')))

      rerender(dialog(portalContainer, false))
      await waitFor(() => {
        expect(screen.getByTestId('host')).toContainElement(screen.getByTestId('dialog'))
        expect(portalContainer).not.toContainElement(screen.getByTestId('dialog'))
      })
    } finally {
      portalContainer.remove()
    }
  })

  it('supports HTMLElement trigger refs when rendering a composed trigger', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Dialog>
        <Dialog.Trigger ref={ref} render={<a href="#settings">Open settings</a>} nativeButton={false} />
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    )

    expect(ref.current).toBe(screen.getByRole('button', {name: 'Open settings'}))
  })

  it('makes an overflowing header keyboard-scrollable and preserves consumer props and ref', () => {
    const restore = mockOverflow()
    const ref = React.createRef<HTMLDivElement>()
    try {
      const {rerender} = render(
        <Dialog.Header ref={ref} data-testid="header">
          Long title
        </Dialog.Header>,
      )
      expect(ref.current).toBe(screen.getByTestId('header'))
      expect(ref.current).toHaveAttribute('tabindex', '0')

      rerender(
        <Dialog.Header ref={ref} tabIndex={-1} data-testid="header">
          Long title
        </Dialog.Header>,
      )
      expect(ref.current).toHaveAttribute('tabindex', '-1')
    } finally {
      restore()
    }
  })

  it('does not add a tab stop to a header that fits', () => {
    render(<Dialog.Header data-testid="header">Title</Dialog.Header>)
    expect(screen.getByTestId('header')).not.toHaveAttribute('tabindex')
  })

  it('updates forwarded refs without losing the overflowing header', () => {
    const restore = mockOverflow()
    const firstRef = React.createRef<HTMLDivElement>()
    const nextRef = React.createRef<HTMLDivElement>()
    try {
      const {rerender} = render(<Dialog.Header ref={firstRef}>Long title</Dialog.Header>)
      const header = firstRef.current
      expect(header).toHaveAttribute('tabindex', '0')

      rerender(<Dialog.Header ref={nextRef}>Long title</Dialog.Header>)
      expect(firstRef.current).toBeNull()
      expect(nextRef.current).toBe(header)
      expect(nextRef.current).toHaveAttribute('tabindex', '0')
    } finally {
      restore()
    }
  })

  it('keeps an overflowing header in the tab order after focus enters a rapidly reopened dialog', async () => {
    const restore = mockOverflow()
    try {
      render(
        <>
          <button type="button">Outside</button>
          <div data-component="Dialog.Popup" data-open="" data-testid="popup">
            <Dialog.Header data-testid="header">Long title</Dialog.Header>
            <button type="button">Inside</button>
          </div>
        </>,
      )
      const header = screen.getByTestId('header')
      const popup = screen.getByTestId('popup')
      const inside = screen.getByRole('button', {name: 'Inside'})
      const outside = screen.getByRole('button', {name: 'Outside'})
      expect(header).toHaveAttribute('tabindex', '-1')
      act(() => inside.focus())
      await waitFor(() => expect(header).toHaveAttribute('tabindex', '0'))

      await act(async () => {
        popup.removeAttribute('data-open')
        outside.focus()
        popup.setAttribute('data-open', '')
        inside.focus()
        outside.focus()
        await Promise.resolve()
      })
      expect(header).toHaveAttribute('tabindex', '0')
    } finally {
      restore()
    }
  })

  it('recognizes focus already inside a shadow-root dialog when mounting an overflowing header', () => {
    const restore = mockOverflow()
    const host = document.createElement('div')
    const shadow = host.attachShadow({mode: 'open'})
    const popup = document.createElement('div')
    const inside = document.createElement('button')
    const container = document.createElement('div')
    popup.setAttribute('data-component', 'Dialog.Popup')
    popup.setAttribute('data-open', '')
    popup.append(inside, container)
    shadow.append(popup)
    document.body.append(host)
    try {
      act(() => inside.focus())
      expect(shadow.activeElement).toBe(inside)
      render(<Dialog.Header data-testid="header">Long title</Dialog.Header>, {container})
      expect(container.firstElementChild).toHaveAttribute('tabindex', '0')
    } finally {
      host.remove()
      restore()
    }
  })

  it('updates the header tab stop when its content starts or stops overflowing', async () => {
    let overflowing = false
    const scrollHeight = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(() => {
      return overflowing ? 200 : 100
    })
    const clientHeight = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
    try {
      const {rerender} = render(<Dialog.Header data-testid="header">Short title</Dialog.Header>)
      const header = screen.getByTestId('header')
      expect(header).not.toHaveAttribute('tabindex')

      overflowing = true
      rerender(<Dialog.Header data-testid="header">Long title</Dialog.Header>)
      await waitFor(() => expect(header).toHaveAttribute('tabindex', '0'))

      overflowing = false
      rerender(<Dialog.Header data-testid="header">Short title again</Dialog.Header>)
      await waitFor(() => expect(header).not.toHaveAttribute('tabindex'))
    } finally {
      scrollHeight.mockRestore()
      clientHeight.mockRestore()
    }
  })

  it.each([
    {name: 'header', Part: Dialog.Header},
    {name: 'body', Part: Dialog.Body},
  ])('keeps focus until the $name blurs when overflow stops', async ({Part}) => {
    let overflowing = true
    const scrollHeight = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(() => {
      return overflowing ? 200 : 100
    })
    const clientHeight = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
    try {
      const {rerender} = render(
        <>
          <Part data-testid="region">Long content</Part>
          <button type="button">Next</button>
        </>,
      )
      const region = screen.getByTestId('region')
      act(() => region.focus())
      expect(region).toHaveFocus()

      overflowing = false
      rerender(
        <>
          <Part data-testid="region">Short content</Part>
          <button type="button">Next</button>
        </>,
      )
      await waitFor(() => expect(region).toHaveAttribute('tabindex', '0'))
      expect(region).toHaveFocus()

      act(() => screen.getByRole('button', {name: 'Next'}).focus())
      await waitFor(() => expect(region).not.toHaveAttribute('tabindex'))
    } finally {
      scrollHeight.mockRestore()
      clientHeight.mockRestore()
    }
  })

  it.each(
    [
      {name: 'header', Part: Dialog.Header},
      {name: 'body', Part: Dialog.Body},
    ].flatMap(testCase => (['open', 'closed'] as const).map(mode => ({...testCase, mode}))),
  )('retains focus in an $mode shadow root when the $name stops overflowing', async ({Part, mode}) => {
    let overflowing = true
    const scrollHeight = vi
      .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
      .mockImplementation(() => (overflowing ? 200 : 100))
    const clientHeight = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
    const host = document.createElement('div')
    const shadow = host.attachShadow({mode})
    const container = document.createElement('div')
    shadow.append(container)
    document.body.append(host)
    const content = (text: string) => (
      <>
        <Part>{text}</Part>
        <button type="button">Next</button>
      </>
    )
    let unmount: (() => void) | undefined
    try {
      const rendered = render(content('Long content'), {container})
      const {rerender} = rendered
      unmount = rendered.unmount
      const region = container.firstElementChild
      if (!(region instanceof HTMLElement)) throw new Error('Expected a dialog region')
      act(() => region.focus())
      expect(shadow.activeElement).toBe(region)

      overflowing = false
      rerender(content('Short content'))
      await waitFor(() => expect(region).toHaveAttribute('tabindex', '0'))
      expect(shadow.activeElement).toBe(region)

      const next = container.querySelector('button')
      if (!next) throw new Error('Expected the next control')
      act(() => next.focus())
      expect(shadow.activeElement).toBe(next)
      await waitFor(() => expect(region).not.toHaveAttribute('tabindex'))
    } finally {
      unmount?.()
      host.remove()
      scrollHeight.mockRestore()
      clientHeight.mockRestore()
    }
  })

  it.each([
    {name: 'header', example: <Dialog.Header>Long title</Dialog.Header>},
    {name: 'body', example: <Dialog.Body>Long content</Dialog.Body>},
  ])('hydrates an overflowing $name without a markup mismatch', async ({example}) => {
    const container = document.createElement('div')
    container.innerHTML = renderToString(example)
    document.body.append(container)
    expect(container.firstElementChild).not.toHaveAttribute('tabindex')
    const restore = mockOverflow()
    const errors: unknown[] = []
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, example, {onRecoverableError: error => errors.push(error)})
      })
      expect(errors).toEqual([])
      expect(container.firstElementChild).toHaveAttribute('tabindex', '0')
    } finally {
      await act(async () => root?.unmount())
      restore()
      container.remove()
    }
  })

  it('preserves caller-supplied body role and tab order while overflow changes', async () => {
    let overflowing = false
    const scrollHeight = vi
      .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
      .mockImplementation(() => (overflowing ? 200 : 100))
    const clientHeight = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
    const content = (text: string) => (
      <>
        <Dialog.Body role="region" aria-label="Details" tabIndex={-1} data-testid="body">
          {text}
        </Dialog.Body>
        <button type="button">Next</button>
      </>
    )
    try {
      const {rerender} = render(content('Short content'))
      const body = screen.getByTestId('body')
      act(() => body.focus())
      expect(body).toHaveFocus()
      expect(body).toHaveAttribute('role', 'region')
      expect(body).toHaveAttribute('aria-label', 'Details')
      expect(body).toHaveAttribute('tabindex', '-1')

      overflowing = true
      await act(async () => rerender(content('Long content')))
      expect(body).toHaveFocus()
      expect(body).toHaveAttribute('role', 'region')
      expect(body).toHaveAttribute('tabindex', '-1')

      overflowing = false
      await act(async () => rerender(content('Short content again')))
      expect(body).toHaveFocus()
      expect(body).toHaveAttribute('role', 'region')
      expect(body).toHaveAttribute('aria-label', 'Details')
      expect(body).toHaveAttribute('tabindex', '-1')

      act(() => screen.getByRole('button', {name: 'Next'}).focus())
      expect(body).toHaveAttribute('role', 'region')
      expect(body).toHaveAttribute('tabindex', '-1')
    } finally {
      scrollHeight.mockRestore()
      clientHeight.mockRestore()
    }
  })

  it('retains body focus when overflow begins after caller focus and later ends', async () => {
    let overflowing = false
    const scrollHeight = vi
      .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
      .mockImplementation(() => (overflowing ? 200 : 100))
    const clientHeight = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
    const content = (text: string, tabIndex?: number) => (
      <>
        <Dialog.Body {...(tabIndex === undefined ? {} : {tabIndex})} data-testid="body">
          {text}
        </Dialog.Body>
        <button type="button">Next</button>
      </>
    )
    try {
      const {rerender} = render(content('Short content', 0))
      const body = screen.getByTestId('body')
      act(() => body.focus())
      expect(body).toHaveFocus()
      expect(body).not.toHaveAttribute('role')

      overflowing = true
      await act(async () => rerender(content('Long content')))
      expect(body).toHaveFocus()
      expect(body).toHaveAttribute('tabindex', '0')

      act(() => screen.getByRole('button', {name: 'Next'}).focus())
      expect(body).toHaveAttribute('tabindex', '0')
      act(() => body.focus())
      expect(body).toHaveFocus()

      overflowing = false
      await act(async () => rerender(content('Short content again')))
      expect(body).toHaveFocus()
      expect(body).toHaveAttribute('tabindex', '0')
      expect(body).not.toHaveAttribute('role')

      act(() => screen.getByRole('button', {name: 'Next'}).focus())
      await waitFor(() => expect(body).not.toHaveAttribute('tabindex'))
    } finally {
      scrollHeight.mockRestore()
      clientHeight.mockRestore()
    }
  })

  it('removes the body tab stop after overflow ends while a descendant is focused', async () => {
    let overflowing = true
    const scrollHeight = vi
      .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
      .mockImplementation(() => (overflowing ? 200 : 100))
    const clientHeight = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
    const content = (text: string) => (
      <Dialog.Body data-testid="body">
        {text}
        <button type="button">Inside</button>
      </Dialog.Body>
    )
    try {
      const {rerender} = render(content('Long content'))
      const body = screen.getByTestId('body')
      const inside = screen.getByRole('button', {name: 'Inside'})
      expect(body).toHaveAttribute('tabindex', '0')
      act(() => inside.focus())
      expect(inside).toHaveFocus()

      overflowing = false
      await act(async () => rerender(content('Short content')))
      await waitFor(() => expect(body).not.toHaveAttribute('tabindex'))
      expect(inside).toHaveFocus()
      expect(body).not.toHaveAttribute('role')
    } finally {
      scrollHeight.mockRestore()
      clientHeight.mockRestore()
    }
  })

  it('makes an overflowing body keyboard-scrollable', () => {
    const restore = mockOverflow()
    try {
      render(
        <Dialog open>
          <Dialog.Content>
            <Dialog.Title>Terms</Dialog.Title>
            <Dialog.Body data-testid="body">Long content</Dialog.Body>
          </Dialog.Content>
        </Dialog>,
      )
      expect(screen.getByTestId('body')).toHaveAttribute('tabindex', '0')
    } finally {
      restore()
    }
  })
})
