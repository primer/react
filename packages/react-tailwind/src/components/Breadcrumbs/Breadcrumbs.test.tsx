import React from 'react'
import {hydrateRoot, type Root} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {act, cleanup, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {BaseStyles} from '../../BaseStyles'
import {Breadcrumbs} from './Breadcrumbs'

describe('Breadcrumbs', () => {
  afterEach(cleanup)

  it('renders a labelled navigation list and marks the current item', () => {
    render(
      <Breadcrumbs data-testid="breadcrumbs">
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/settings" selected>
          Settings
        </Breadcrumbs.Item>
      </Breadcrumbs>,
    )
    expect(screen.getByRole('navigation', {name: 'Breadcrumbs'})).toBe(screen.getByTestId('breadcrumbs'))
    expect(screen.getByRole('link', {name: 'Settings'})).toHaveAttribute('aria-current', 'page')
  })

  it('lets consumer classes override the default item minimums', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item href="/" className="min-h-0 min-w-0">
          Home
        </Breadcrumbs.Item>
      </Breadcrumbs>,
    )
    const item = screen.getByRole('link', {name: 'Home'})
    expect(item).toHaveClass('min-h-0', 'min-w-0')
    expect(item).not.toHaveClass('primer:min-h-[max(28px,var(--control-small-size,28px))]')
    expect(item).not.toHaveClass('primer:min-w-[max(28px,var(--control-small-size,28px))]')
  })

  it('can be server-rendered before overflow measurement', () => {
    const html = renderToString(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/settings">Settings</Breadcrumbs.Item>
      </Breadcrumbs>,
    )
    expect(html).toContain('data-breadcrumb-measurement')
    expect(html).toContain('inert=""')
    expect(html).toContain('visibility:hidden')
    expect(html).not.toContain('details')
  })

  it('hydrates menu-mode breadcrumbs without replacing their server markup', () => {
    const app = (
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/current">Current page</Breadcrumbs.Item>
      </Breadcrumbs>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(app)
    document.body.append(container)
    const originalLink = within(container).getByRole('link', {name: 'Current page'})
    const onRecoverableError = vi.fn()
    let root: Root | undefined

    try {
      act(() => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      expect(within(container).getByRole('link', {name: 'Current page'})).toBe(originalLink)
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      act(() => root?.unmount())
      container.remove()
    }
  })

  it('hydrates a single item without a measurement copy', () => {
    const app = (
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/current">Current page</Breadcrumbs.Item>
      </Breadcrumbs>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(app)
    document.body.append(container)
    const originalLink = within(container).getByRole('link', {name: 'Current page'})
    const onRecoverableError = vi.fn()
    let root: Root | undefined

    try {
      act(() => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      expect(within(container).getByRole('link', {name: 'Current page'})).toBe(originalLink)
      expect(container.querySelector('[data-breadcrumb-measurement]')).toBeNull()
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      act(() => root?.unmount())
      container.remove()
    }
  })

  it('keeps the measurement copy inert and hidden without an unprefixed visibility utility', () => {
    const {container} = render(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item as="span">
          <button type="button">Choose a repository</button>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="/current">Current Page</Breadcrumbs.Item>
      </Breadcrumbs>,
    )
    const measurement = container.querySelector('[data-breadcrumb-measurement]')
    expect(measurement).toHaveAttribute('inert')
    expect(measurement).toHaveAttribute('aria-hidden', 'true')
    expect(measurement).toHaveStyle({visibility: 'hidden', pointerEvents: 'none', position: 'absolute'})
    expect(measurement).not.toHaveClass('primer:invisible')
  })

  it.each(['menu', 'menu-with-root'] as const)('mounts a single interactive item once in %s mode', overflow => {
    const mounted = vi.fn()
    function RepositoryPicker() {
      React.useEffect(() => {
        mounted()
      }, [])
      return (
        <>
          <Breadcrumbs.Item href="/repository">Repository</Breadcrumbs.Item>
          <button type="button">Choose repository</button>
        </>
      )
    }

    const {container} = render(
      <Breadcrumbs overflow={overflow}>
        <RepositoryPicker />
      </Breadcrumbs>,
    )
    expect(mounted).toHaveBeenCalledTimes(1)
    expect(container.querySelectorAll('button')).toHaveLength(1)
  })

  it('forwards focus capture callbacks to the navigation element', async () => {
    const user = userEvent.setup()
    const onFocusCapture = vi.fn()
    const onBlurCapture = vi.fn()
    render(
      <>
        <Breadcrumbs onFocusCapture={onFocusCapture} onBlurCapture={onBlurCapture}>
          <Breadcrumbs.Item href="#repository">Repository</Breadcrumbs.Item>
        </Breadcrumbs>
        <button type="button">Outside</button>
      </>,
    )
    await user.tab()
    expect(screen.getByRole('link', {name: 'Repository'})).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', {name: 'Outside'})).toHaveFocus()
    expect(onFocusCapture).toHaveBeenCalledOnce()
    expect(onBlurCapture).toHaveBeenCalledOnce()
  })

  it('does not add focus recovery when a wrapped item is removed', () => {
    const app = (showSecond: boolean) => (
      <Breadcrumbs overflow="wrap">
        <Breadcrumbs.Item href="/first">First</Breadcrumbs.Item>
        {showSecond ? <Breadcrumbs.Item href="/second">Second</Breadcrumbs.Item> : null}
      </Breadcrumbs>
    )
    const {rerender} = render(app(true))
    act(() => screen.getByRole('link', {name: 'Second'}).focus())
    rerender(app(false))
    expect(document.body).toHaveFocus()
  })

  it('portals overflow links as menu items without nesting interactive elements', async () => {
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
    Object.defineProperties(HTMLElement.prototype, {
      clientWidth: {configurable: true, get: () => 200},
      offsetWidth: {configurable: true, get: () => 100},
    })

    try {
      const user = userEvent.setup()
      render(
        <BaseStyles>
          <Breadcrumbs overflow="menu">
            <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/current" selected>
              Current Page
            </Breadcrumbs.Item>
          </Breadcrumbs>
        </BaseStyles>,
      )

      await user.click(await screen.findByRole('button', {name: '3 more breadcrumb items'}))
      const home = await screen.findByRole('menuitem', {name: 'Home'})
      expect(home).toHaveAttribute('href', '/')
      expect(home).not.toContainElement(home.querySelector('a'))
      expect(home.closest('[data-portal-root]')).not.toBeNull()
    } finally {
      if (clientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', clientWidth)
      else delete (HTMLElement.prototype as {clientWidth?: number}).clientWidth
      if (offsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', offsetWidth)
      else delete (HTMLElement.prototype as {offsetWidth?: number}).offsetWidth
    }
  })

  it('preserves custom router props and activation when a breadcrumb overflows', async () => {
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
    Object.defineProperties(HTMLElement.prototype, {
      clientWidth: {configurable: true, get: () => 200},
      offsetWidth: {configurable: true, get: () => 100},
    })
    const RouterLink = React.forwardRef<
      HTMLAnchorElement,
      {to: string; preload: 'intent' | 'none'} & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'>
    >(function RouterLink({children, to, preload, ...props}, ref) {
      return (
        <a {...props} ref={ref} href={to} data-preload={preload}>
          {children}
        </a>
      )
    })

    try {
      const user = userEvent.setup()
      const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
      render(
        <BaseStyles>
          <Breadcrumbs overflow="menu">
            <Breadcrumbs.Item as={RouterLink} to="/home" preload="intent" onClick={onClick}>
              Home
            </Breadcrumbs.Item>
            <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/current">Current Page</Breadcrumbs.Item>
          </Breadcrumbs>
        </BaseStyles>,
      )

      await user.click(await screen.findByRole('button', {name: '3 more breadcrumb items'}))
      const home = await screen.findByRole('menuitem', {name: 'Home'})
      expect(home).toHaveAttribute('href', '/home')
      expect(home).toHaveAttribute('data-preload', 'intent')
      await user.click(home)
      expect(onClick).toHaveBeenCalledOnce()
    } finally {
      if (clientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', clientWidth)
      else delete (HTMLElement.prototype as {clientWidth?: number}).clientWidth
      if (offsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', offsetWidth)
      else delete (HTMLElement.prototype as {offsetWidth?: number}).offsetWidth
    }
  })

  it('navigates overflow links with menu keyboard semantics and returns focus on Escape', async () => {
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
    Object.defineProperties(HTMLElement.prototype, {
      clientWidth: {configurable: true, get: () => 200},
      offsetWidth: {configurable: true, get: () => 100},
    })

    try {
      const user = userEvent.setup()
      const onClick = vi.fn((event: {preventDefault: () => void}) => event.preventDefault())
      render(
        <BaseStyles>
          <Breadcrumbs overflow="menu">
            <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/products" onClick={onClick}>
              Products
            </Breadcrumbs.Item>
            <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/current" selected>
              Current Page
            </Breadcrumbs.Item>
          </Breadcrumbs>
        </BaseStyles>,
      )

      const trigger = await screen.findByRole('button', {name: '3 more breadcrumb items'})
      act(() => trigger.focus())
      await user.keyboard('{Enter}')
      const home = await screen.findByRole('menuitem', {name: 'Home'})
      await waitFor(() => expect(home).toHaveFocus())
      expect(screen.queryByRole('link', {name: 'Home'})).toBeNull()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('menuitem', {name: 'Products'})).toHaveFocus()
      await user.keyboard('{Enter}')
      expect(onClick).toHaveBeenCalledTimes(1)

      act(() => trigger.focus())
      await user.keyboard('{Enter}')
      await waitFor(() => expect(screen.getByRole('menuitem', {name: 'Home'})).toHaveFocus())
      await user.keyboard('{Escape}')
      await waitFor(() => expect(screen.queryByRole('menuitem', {name: 'Home'})).toBeNull())
      expect(trigger).toHaveFocus()
    } finally {
      if (clientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', clientWidth)
      else delete (HTMLElement.prototype as {clientWidth?: number}).clientWidth
      if (offsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', offsetWidth)
      else delete (HTMLElement.prototype as {offsetWidth?: number}).offsetWidth
    }
  })

  it('keeps short trails visible on narrow containers like Primer React', async () => {
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
    Object.defineProperties(HTMLElement.prototype, {
      clientWidth: {configurable: true, get: () => 358},
      offsetWidth: {configurable: true, get: () => 60},
    })

    try {
      for (const overflow of ['menu', 'menu-with-root'] as const) {
        const {unmount} = render(
          <BaseStyles>
            <Breadcrumbs overflow={overflow}>
              <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
              <Breadcrumbs.Item href="/current" selected>
                Current Page
              </Breadcrumbs.Item>
            </Breadcrumbs>
          </BaseStyles>,
        )
        const nav = screen.getByRole('navigation', {name: 'Breadcrumbs'})
        await waitFor(() => expect(within(nav).getAllByRole('link', {name: 'Home'})).toHaveLength(1))
        expect(within(nav).queryByRole('button', {name: /more breadcrumb items/})).toBeNull()
        unmount()
      }
    } finally {
      if (clientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', clientWidth)
      else delete (HTMLElement.prototype as {clientWidth?: number}).clientWidth
      if (offsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', offsetWidth)
      else delete (HTMLElement.prototype as {offsetWidth?: number}).offsetWidth
    }
  })

  it('recalculates when a measured item changes size without a container resize', async () => {
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
    const originalResizeObserver = window.ResizeObserver
    let availableWidth = 240
    let notifyResize: (() => void) | undefined
    const observed = new Set<Element>()

    class TestResizeObserver implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = () => callback([], this)
      }
      observe(target: Element) {
        observed.add(target)
      }
      unobserve(target: Element) {
        observed.delete(target)
      }
      disconnect() {
        observed.clear()
      }
    }

    window.ResizeObserver = TestResizeObserver
    Object.defineProperties(HTMLElement.prototype, {
      clientWidth: {configurable: true, get: () => availableWidth},
      offsetWidth: {
        configurable: true,
        get(this: HTMLElement) {
          return this.textContent.includes('longer-repository-name') ? 170 : 70
        },
      },
    })

    const RepositoryNameContext = React.createContext('repo')
    let activePickers = 0
    let maximumActivePickers = 0
    let shortcutsHandled = 0
    function RepositoryPicker() {
      const name = React.useContext(RepositoryNameContext)
      const [open, setOpen] = React.useState(false)
      const buttonRef = React.useRef<HTMLButtonElement>(null)
      React.useEffect(() => {
        activePickers += 1
        maximumActivePickers = Math.max(maximumActivePickers, activePickers)
        const handleShortcut = (event: KeyboardEvent) => {
          if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'r') {
            shortcutsHandled += 1
            buttonRef.current?.focus()
          }
        }
        document.addEventListener('keydown', handleShortcut)
        return () => {
          activePickers -= 1
          document.removeEventListener('keydown', handleShortcut)
        }
      }, [])
      return (
        <>
          <Breadcrumbs.Item href="/repo">{name}</Breadcrumbs.Item>
          <button ref={buttonRef} type="button" aria-pressed={open} onClick={() => setOpen(previous => !previous)}>
            Choose repository
          </button>
        </>
      )
    }
    const items = [
      <Breadcrumbs.Item key="owner" href="/owner">
        Owner
      </Breadcrumbs.Item>,
      <RepositoryPicker key="repository" />,
    ]
    const app = (name: string) => (
      <RepositoryNameContext.Provider value={name}>
        <Breadcrumbs overflow="menu">{items}</Breadcrumbs>
      </RepositoryNameContext.Provider>
    )

    try {
      const user = userEvent.setup()
      const {container, rerender} = render(app('repo'))
      const triggerResize = () => {
        if (!notifyResize) throw new Error('Expected a breadcrumb ResizeObserver')
        act(notifyResize)
      }
      const measurementItems = container.querySelectorAll('[data-breadcrumb-measurement] > li')
      expect(measurementItems).toHaveLength(1)
      for (const item of measurementItems) expect(observed.has(item)).toBe(true)

      const originalLink = screen.getByRole('link', {name: 'repo'})
      const originalLeaf = originalLink.closest('li')
      expect(originalLeaf && observed.has(originalLeaf)).toBe(true)
      expect(activePickers).toBe(1)
      expect(maximumActivePickers).toBe(1)
      await user.keyboard('{Alt>}{Shift>}r{/Shift}{/Alt}')
      expect(screen.getByRole('button', {name: 'Choose repository'})).toHaveFocus()
      expect(shortcutsHandled).toBe(1)
      await user.click(screen.getByRole('button', {name: 'Choose repository'}))
      rerender(app('longer-repository-name'))
      triggerResize()

      expect(screen.getByRole('button', {name: '1 more breadcrumb items'})).toBeVisible()
      expect(screen.getByRole('link', {name: 'longer-repository-name'})).toBe(originalLink)
      expect(screen.getByRole('button', {name: 'Choose repository'})).toHaveAttribute('aria-pressed', 'true')
      expect(activePickers).toBe(1)
      await user.keyboard('{Alt>}{Shift>}r{/Shift}{/Alt}')
      expect(screen.getByRole('button', {name: 'Choose repository'})).toHaveFocus()
      expect(shortcutsHandled).toBe(2)

      availableWidth = 600
      triggerResize()
      expect(screen.queryByRole('button', {name: /more breadcrumb items/})).toBeNull()
      expect(screen.getByRole('link', {name: 'longer-repository-name'})).toBe(originalLink)
      expect(screen.getByRole('button', {name: 'Choose repository'})).toHaveAttribute('aria-pressed', 'true')
      expect(activePickers).toBe(1)
      await user.keyboard('{Alt>}{Shift>}r{/Shift}{/Alt}')
      expect(screen.getByRole('button', {name: 'Choose repository'})).toHaveFocus()
      expect(shortcutsHandled).toBe(3)

      rerender(
        <RepositoryNameContext.Provider value="repo">
          <Breadcrumbs overflow="menu">{[items[0], <RepositoryPicker key="replacement" />]}</Breadcrumbs>
        </RepositoryNameContext.Provider>,
      )
      const replacementLeaf = screen.getByRole('link', {name: 'repo'}).closest('li')
      expect(replacementLeaf).not.toBe(originalLeaf)
      expect(originalLeaf && observed.has(originalLeaf)).toBe(false)
      expect(replacementLeaf && observed.has(replacementLeaf)).toBe(true)
      expect(activePickers).toBe(1)
      expect(maximumActivePickers).toBe(1)
    } finally {
      window.ResizeObserver = originalResizeObserver
      if (clientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', clientWidth)
      else delete (HTMLElement.prototype as {clientWidth?: number}).clientWidth
      if (offsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', offsetWidth)
      else delete (HTMLElement.prototype as {offsetWidth?: number}).offsetWidth
    }
  })

  it('recalculates when the overflow trigger changes size without losing focus', () => {
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
    const originalResizeObserver = window.ResizeObserver
    let buttonWidth = 28
    let notifyResize: (() => void) | undefined
    const observed = new Set<Element>()

    window.ResizeObserver = class implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = () => callback([], this)
      }
      observe(target: Element) {
        observed.add(target)
      }
      unobserve(target: Element) {
        observed.delete(target)
      }
      disconnect() {
        observed.clear()
      }
    }
    Object.defineProperties(HTMLElement.prototype, {
      clientWidth: {configurable: true, get: () => 180},
      offsetWidth: {
        configurable: true,
        get(this: HTMLElement) {
          if (this.getAttribute('data-component') === 'ActionMenu.Trigger') return buttonWidth
          return this.textContent.includes('Root') ? 50 : 70
        },
      },
    })

    try {
      render(
        <Breadcrumbs overflow="menu-with-root">
          <Breadcrumbs.Item href="/root">Root</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/middle">Middle</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/section">Section</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/current">Current</Breadcrumbs.Item>
        </Breadcrumbs>,
      )
      const current = screen.getByRole('link', {name: 'Current'})
      const trigger = screen.getByRole('button', {name: '2 more breadcrumb items'})
      const triggerResize = () => {
        if (!notifyResize) throw new Error('Expected a breadcrumb ResizeObserver')
        act(notifyResize)
      }
      expect(observed.has(trigger)).toBe(true)
      act(() => trigger.focus())

      buttonWidth = 80
      triggerResize()
      expect(screen.getByRole('button', {name: '3 more breadcrumb items'})).toBe(trigger)
      expect(screen.queryByRole('link', {name: 'Root'})).toBeNull()
      expect(screen.getByRole('link', {name: 'Current'})).toBe(current)
      expect(trigger).toHaveFocus()
      expect(observed.has(trigger)).toBe(true)

      buttonWidth = 28
      triggerResize()
      expect(screen.getByRole('button', {name: '2 more breadcrumb items'})).toBe(trigger)
      expect(screen.getByRole('link', {name: 'Root'})).toBeVisible()
      expect(screen.getByRole('link', {name: 'Current'})).toBe(current)
      expect(trigger).toHaveFocus()
    } finally {
      window.ResizeObserver = originalResizeObserver
      if (clientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', clientWidth)
      else delete (HTMLElement.prototype as {clientWidth?: number}).clientWidth
      if (offsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', offsetWidth)
      else delete (HTMLElement.prototype as {offsetWidth?: number}).offsetWidth
    }
  })

  it('preserves keyed visible children when their order or siblings change', () => {
    function Item({name}: {name: string}) {
      return <Breadcrumbs.Item href={`/${name}`}>{name}</Breadcrumbs.Item>
    }
    const app = (names: string[]) => (
      <Breadcrumbs>
        {names.map(name => (
          <Item key={name} name={name} />
        ))}
      </Breadcrumbs>
    )
    const {rerender} = render(app(['first', 'second', 'third']))
    const second = screen.getByRole('link', {name: 'second'})
    const third = screen.getByRole('link', {name: 'third'})

    rerender(app(['third', 'second', 'fourth']))
    expect(screen.getByRole('link', {name: 'second'})).toBe(second)
    expect(screen.getByRole('link', {name: 'third'})).toBe(third)
    expect(screen.queryByRole('link', {name: 'first'})).toBeNull()
    expect(screen.getByRole('link', {name: 'fourth'})).toBeVisible()
  })

  it('preserves the root and last item when menu-with-root collapses and expands', () => {
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
    const originalResizeObserver = window.ResizeObserver
    let availableWidth = 600
    let notifyResize: (() => void) | undefined

    window.ResizeObserver = class implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = () => callback([], this)
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperties(HTMLElement.prototype, {
      clientWidth: {configurable: true, get: () => availableWidth},
      offsetWidth: {
        configurable: true,
        get(this: HTMLElement) {
          return this.getAttribute('data-component') === 'ActionMenu.Trigger' ? 28 : 70
        },
      },
    })

    try {
      render(
        <Breadcrumbs overflow="menu-with-root">
          <Breadcrumbs.Item key="root" href="/root">
            Root
          </Breadcrumbs.Item>
          <Breadcrumbs.Item key="middle" href="/middle">
            Middle
          </Breadcrumbs.Item>
          <Breadcrumbs.Item key="current" href="/current">
            Current
          </Breadcrumbs.Item>
        </Breadcrumbs>,
      )
      const triggerResize = () => {
        if (!notifyResize) throw new Error('Expected a breadcrumb ResizeObserver')
        act(notifyResize)
      }
      const root = screen.getByRole('link', {name: 'Root'})
      const current = screen.getByRole('link', {name: 'Current'})

      availableWidth = 200
      triggerResize()
      expect(screen.getByRole('button', {name: '1 more breadcrumb items'})).toBeVisible()
      expect(screen.getByRole('link', {name: 'Root'})).toBe(root)
      expect(screen.getByRole('link', {name: 'Current'})).toBe(current)

      availableWidth = 600
      triggerResize()
      expect(screen.queryByRole('button', {name: /more breadcrumb items/})).toBeNull()
      expect(screen.getByRole('link', {name: 'Root'})).toBe(root)
      expect(screen.getByRole('link', {name: 'Current'})).toBe(current)
    } finally {
      window.ResizeObserver = originalResizeObserver
      if (clientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', clientWidth)
      else delete (HTMLElement.prototype as {clientWidth?: number}).clientWidth
      if (offsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', offsetWidth)
      else delete (HTMLElement.prototype as {offsetWidth?: number}).offsetWidth
    }
  })
})
