import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {Link} from './Link'

describe('Link', () => {
  it('renders an accessible anchor and forwards root props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Link ref={ref} href="#target" data-testid="link">
        Target
      </Link>,
    )
    expect(screen.getByRole('link', {name: 'Target'})).toHaveAttribute('href', '#target')
    expect(screen.getByTestId('link')).toBe(ref.current)
  })

  it('exposes inline and muted state for preference-aware styling', () => {
    render(
      <Link href="#target" inline muted data-testid="state-link">
        Target
      </Link>,
    )

    expect(screen.getByTestId('state-link')).toHaveAttribute('data-inline', 'true')
    expect(screen.getByTestId('state-link')).toHaveAttribute('data-muted', 'true')
  })

  it('forwards router props, events, and the ref to a custom link', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
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
      <Link as={RouterLink} to="/issues" preload="intent" ref={ref} onClick={onClick} inline>
        Issues
      </Link>,
    )

    const link = screen.getByRole('link', {name: 'Issues'})
    expect(link).toHaveAttribute('href', '/issues')
    expect(link).toHaveAttribute('data-preload', 'intent')
    expect(link).toHaveAttribute('data-inline', 'true')
    expect(ref.current).toBe(link)
    await user.click(link)
    expect(onClick).toHaveBeenCalledOnce()
  })
})
