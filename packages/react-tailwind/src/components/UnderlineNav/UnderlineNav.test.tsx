import {cleanup, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {clip, MockIntersectionObserver, stubIntersectionObserver} from '../../internal/intersectionObserver.test-utils'
import {UnderlineNav} from './UnderlineNav'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('UnderlineNav', () => {
  it('retains semantic navigation, list, current-link states, and DOM props', () => {
    const ref = React.createRef<HTMLElement>()
    const {container} = render(
      <UnderlineNav ref={ref} aria-label="Repository" data-testid="navigation">
        <UnderlineNav.Item href="/code" aria-current="page">
          Code
        </UnderlineNav.Item>
        <UnderlineNav.Item href="/issues" counter={3}>
          Issues
        </UnderlineNav.Item>
      </UnderlineNav>,
    )
    const canvas = within(container)
    expect(canvas.getByRole('navigation', {name: 'Repository'})).toBeInTheDocument()
    expect(canvas.getByRole('link', {name: /Code/})).toHaveAttribute('aria-current', 'page')
    expect(canvas.getByRole('list')).toHaveClass('primer:flex')
    expect(canvas.getByTestId('navigation')).toHaveAttribute('data-component', 'UnderlineNav')
    expect(canvas.getByRole('link', {name: /Issues/})).toHaveAccessibleName('Issues(3)')
    expect(ref.current).toBe(canvas.getByRole('navigation'))
  })

  it('calls onSelect after an unprevented native click', async () => {
    const onSelect = vi.fn()
    const onClick = vi.fn()
    const user = userEvent.setup()

    const {container} = render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item href="#issues" onClick={onClick} onSelect={onSelect}>
          Issues
        </UnderlineNav.Item>
      </UnderlineNav>,
    )

    await user.click(within(container).getByRole('link', {name: 'Issues'}))

    expect(onClick).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('does not call onSelect after a consumer prevents the click', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()

    const {container} = render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item href="#issues" onClick={event => event.preventDefault()} onSelect={onSelect}>
          Issues
        </UnderlineNav.Item>
      </UnderlineNav>,
    )

    await user.click(within(container).getByRole('link', {name: 'Issues'}))

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('uses a loading skeleton in place of counters', () => {
    const {container} = render(
      <UnderlineNav aria-label="Repository" loadingCounters>
        <UnderlineNav.Item href="/issues" counter={3}>
          Issues
        </UnderlineNav.Item>
      </UnderlineNav>,
    )

    const issues = within(container).getByRole('link', {name: 'Issues'})
    expect(issues).toBeInTheDocument()
    expect(issues.querySelector('[data-component="SkeletonBox"]')).toBeInTheDocument()
  })

  it('hides icons below the medium container breakpoint by default', () => {
    const {container} = render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item leadingVisual={<svg aria-hidden="true" data-testid="icon" />}>Code</UnderlineNav.Item>
      </UnderlineNav>,
    )
    expect(within(container).getByRole('navigation')).toHaveAttribute('data-hide-icons-breakpoint', 'medium')
    expect(within(container).getByTestId('icon').parentElement).toHaveClass('primer:@max-[768px]/underline-nav:hidden')
  })

  it('supports always showing icons', () => {
    const {container} = render(
      <UnderlineNav aria-label="Repository" hideIconsBreakpoint={null}>
        <UnderlineNav.Item leadingVisual={<svg aria-hidden="true" data-testid="icon" />}>Code</UnderlineNav.Item>
      </UnderlineNav>,
    )
    expect(within(container).getByRole('navigation')).not.toHaveAttribute('data-hide-icons-breakpoint')
    expect(within(container).getByTestId('icon').parentElement?.className).not.toMatch(/:hidden/)
  })

  it('defaults href for native anchor items', () => {
    const {container} = render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item>Code</UnderlineNav.Item>
      </UnderlineNav>,
    )
    expect(within(container).getByRole('link', {name: 'Code'})).toHaveAttribute('href', '#')
  })

  it('does not default href for custom link components', () => {
    const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'>>(function RouterLink(
      {children, ...props},
      ref,
    ) {
      return (
        <a {...props} ref={ref} data-href-prop={props.href ?? 'none'} href="/issues">
          {children}
        </a>
      )
    })
    const {container} = render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item as={RouterLink}>Issues</UnderlineNav.Item>
      </UnderlineNav>,
    )
    const link = within(container).getByRole('link', {name: 'Issues'})
    expect(link).toHaveAttribute('href', '/issues')
    expect(link).toHaveAttribute('data-href-prop', 'none')
  })
})

describe('UnderlineNav overflow', () => {
  it('preserves custom router props and callbacks in the More menu', async () => {
    stubIntersectionObserver()
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onSelect = vi.fn((event: React.MouseEvent<HTMLElement>) => event.preventDefault())
    const ref = React.createRef<HTMLAnchorElement>()
    const RouterLink = React.forwardRef<
      HTMLAnchorElement,
      {to: string; preload: 'intent' | 'none'} & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'>
    >(function RouterLink({children, to, preload, ...props}, forwardedRef) {
      return (
        <a {...props} ref={forwardedRef} href={to} data-preload={preload}>
          {children}
        </a>
      )
    })

    render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item href="/code">Code</UnderlineNav.Item>
        <UnderlineNav.Item
          as={RouterLink}
          to="/issues"
          preload="intent"
          ref={ref}
          onClick={onClick}
          onSelect={onSelect}
        >
          Issues
        </UnderlineNav.Item>
      </UnderlineNav>,
    )

    const link = screen.getByRole('link', {name: 'Issues'})
    expect(ref.current).toBe(link)
    expect(link).toHaveAttribute('href', '/issues')
    clip(link.closest('li')!)
    await user.click(screen.getByRole('button', {name: /^More\s?items$/}))
    const item = await screen.findByRole('menuitem', {name: 'Issues'})
    expect(item).toHaveAttribute('href', '/issues')
    expect(item).toHaveAttribute('data-preload', 'intent')
    await user.click(item)
    expect(onClick).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledOnce()
  })

  function renderOverflowNav(onSelect = vi.fn()) {
    stubIntersectionObserver()
    render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item href="/code">Code</UnderlineNav.Item>
        <UnderlineNav.Item href="/issues" counter={3} onSelect={onSelect}>
          Issues
        </UnderlineNav.Item>
        <UnderlineNav.Item href="/settings" aria-current="page">
          Settings
        </UnderlineNav.Item>
      </UnderlineNav>,
    )
    const item = (name: RegExp) => screen.getByRole('link', {name}).closest('li')!
    return {nav: screen.getByRole('navigation'), issues: item(/^Issues/), settings: item(/^Settings/)}
  }

  it('observes items against the navigation root', () => {
    const {nav, issues} = renderOverflowNav()
    expect(MockIntersectionObserver.current?.options?.root).toBe(nav)
    expect(MockIntersectionObserver.current?.elements.has(issues)).toBe(true)
  })

  it('moves clipped items into the More menu in document order', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn((event: React.MouseEvent) => event.preventDefault())
    const {nav, issues, settings} = renderOverflowNav(onSelect)

    clip(settings, issues)
    expect(nav).toHaveAttribute('data-has-overflow', 'true')
    expect(issues).toHaveAttribute('aria-hidden', 'true')
    expect(within(issues).getByRole('link', {hidden: true})).toHaveAttribute('tabindex', '-1')

    const more = screen.getByRole('button', {name: 'More items, including current item'})
    expect(more).toHaveAttribute('data-current')
    await user.click(more)
    const items = await screen.findAllByRole('menuitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Issues3 (3)')
    expect(items[1]).toHaveTextContent('Settings')
    expect(items[1]).toHaveAttribute('aria-current', 'page')

    await user.click(items[0])
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('keeps keyboard order on visible items and returns focus to More after selecting an overflow item', async () => {
    const user = userEvent.setup()
    stubIntersectionObserver()
    const names = ['Code', 'Issues', 'Pull requests', 'Projects', 'Settings']
    function Navigation() {
      const [current, setCurrent] = React.useState('Issues')
      return (
        <UnderlineNav aria-label="Repository">
          {names.map(name => (
            <UnderlineNav.Item
              key={name}
              aria-current={name === current ? 'page' : undefined}
              href={`/${name}`}
              onSelect={event => {
                event.preventDefault()
                setCurrent(name)
              }}
            >
              {name}
            </UnderlineNav.Item>
          ))}
        </UnderlineNav>
      )
    }
    render(<Navigation />)
    const item = (name: string) => screen.getByRole('link', {name}).closest('li')!
    clip(item('Projects'), item('Settings'))
    const more = screen.getByRole('button', {name: /^More\s?items$/})

    screen.getByRole('link', {name: 'Code'}).focus()
    for (const name of ['Issues', 'Pull requests']) {
      await user.tab()
      expect(document.activeElement).toHaveTextContent(name)
    }
    await user.tab()
    expect(more).toHaveFocus()

    await user.keyboard('{Enter}')
    await waitFor(() => expect(document.activeElement).toHaveTextContent(/^Projects/))
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveTextContent(/^Settings/)
    await user.keyboard('{Enter}')

    await waitFor(() => expect(more).toHaveFocus())
    expect(more).toHaveAccessibleName('More items, including current item')
    expect(screen.getByRole('link', {name: 'Issues'})).not.toHaveAttribute('aria-current')
    await user.tab({shift: true})
    expect(document.activeElement).toHaveTextContent('Pull requests')
  })

  it('restores items once they fit again', () => {
    const {nav, issues} = renderOverflowNav()
    clip(issues)
    // jsdom drops the space before the visually hidden word; browsers announce "More items".
    expect(screen.getByRole('button', {name: /^More\s?items$/})).toBeInTheDocument()
    clip()
    expect(nav).not.toHaveAttribute('data-has-overflow')
    expect(issues).not.toHaveAttribute('aria-hidden')
    expect(within(issues).getByRole('link')).not.toHaveAttribute('tabindex')
  })
})
