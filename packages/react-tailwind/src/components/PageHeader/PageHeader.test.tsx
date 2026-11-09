import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {PageHeader} from './PageHeader'

describe('PageHeader', () => {
  it('preserves consumer heading semantics and forwards root props', () => {
    render(
      <PageHeader data-testid="page-header">
        <PageHeader.TitleArea>
          <PageHeader.Title as="h1">Settings</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>,
    )
    expect(screen.getByRole('heading', {level: 1, name: 'Settings'})).toBeVisible()
    expect(screen.getByTestId('page-header')).toHaveAttribute('data-component', 'PageHeader')
  })

  it('lets hidden override the narrow-only defaults and emits concrete responsive title utilities', () => {
    render(
      <PageHeader>
        <PageHeader.ContextArea hidden={false} data-testid="context">
          Context
        </PageHeader.ContextArea>
        <PageHeader.TitleArea variant={{narrow: 'subtitle', regular: 'large'}} data-testid="title-area">
          <PageHeader.Title>Settings</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>,
    )
    expect(screen.getByTestId('context')).not.toHaveClass('primer:md:hidden')
    expect(screen.getByTestId('title-area')).toHaveClass(
      'primer:text-title-medium',
      'primer:md:text-title-large',
      'primer:2xl:text-title-medium',
    )
  })

  it('preserves title inheritance and flex layout for visible compound parts', () => {
    render(
      <PageHeader>
        <PageHeader.TitleArea data-testid="title-area">
          <PageHeader.Title data-testid="title">Settings</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Actions data-testid="actions">Actions</PageHeader.Actions>
        <PageHeader.Description data-testid="description">Description</PageHeader.Description>
      </PageHeader>,
    )

    expect(screen.getByTestId('title-area')).toHaveAttribute('data-component', 'PageHeader.TitleArea')
    expect(screen.getByTestId('actions')).toHaveAttribute('data-component', 'PageHeader.Actions')
    expect(screen.getByTestId('title')).toHaveClass(
      'primer:[font-size:inherit]',
      'primer:[font-weight:inherit]',
      'primer:[line-height:inherit]',
    )
    expect(screen.getByTestId('actions')).toHaveClass('primer:flex')
    expect(screen.getByTestId('description')).toHaveClass('primer:flex')
  })

  it('forwards router props, events, and refs to the parent link', () => {
    const RouterLink = React.forwardRef<
      HTMLAnchorElement,
      {to: {pathname: string}; preload: 'intent' | 'none'} & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'>
    >(function RouterLink({children, to, preload, ...props}, ref) {
      return (
        <a {...props} href={to.pathname} data-preload={preload} ref={ref}>
          {children}
        </a>
      )
    })
    const ref = React.createRef<HTMLAnchorElement>()
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())

    render(
      <PageHeader>
        <PageHeader.ParentLink
          as={RouterLink}
          to={{pathname: '/projects'}}
          preload="intent"
          ref={ref}
          onClick={onClick}
          hidden={false}
        >
          Projects
        </PageHeader.ParentLink>
      </PageHeader>,
    )

    const link = screen.getByRole('link', {name: 'Projects'})
    expect(link).toHaveAttribute('href', '/projects')
    expect(link).toHaveAttribute('data-preload', 'intent')
    expect(link).toHaveAttribute('data-component', 'PageHeader.ParentLink')
    expect(link).not.toHaveClass('primer:md:hidden')
    expect(ref.current).toBe(link)
    fireEvent.click(link)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('forwards a native button ref and its event target', () => {
    const ref = React.createRef<HTMLButtonElement>()
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.currentTarget.focus())
    render(
      <PageHeader>
        <PageHeader.ParentLink as="button" type="button" ref={ref} onClick={onClick}>
          Back
        </PageHeader.ParentLink>
      </PageHeader>,
    )

    const button = screen.getByRole('button', {name: 'Back'})
    expect(ref.current).toBe(button)
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
    expect(button).toHaveFocus()
  })
})
