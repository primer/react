import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {describe, it, expect} from 'vitest'
import UnderlineNav from '../UnderlineNav'
import {implementsClassName} from '../../utils/testing'
import classes from './UnderlineNav.module.css'

describe('UnderlineNav', () => {
  implementsClassName(UnderlineNav, classes.UnderlineNav)

  it('renders a <nav>', () => {
    render(<UnderlineNav />)
    expect(page.getByRole('navigation').element().tagName).toEqual('NAV')
  })

  it('adds the UnderlineNav class', async () => {
    render(<UnderlineNav />)
    await expect.element(page.getByRole('navigation')).toHaveClass('PRC-UnderlineNav')
  })

  it('respects the "align" prop', async () => {
    render(<UnderlineNav align="right" />)
    await expect.element(page.getByRole('navigation')).toHaveClass('PRC-UnderlineNav--right')
  })

  it('respects the "full" prop', async () => {
    render(<UnderlineNav full />)
    await expect.element(page.getByRole('navigation')).toHaveClass('PRC-UnderlineNav--full')
  })

  it('sets aria-label to the "label" prop', async () => {
    render(<UnderlineNav label="foo" />)
    await expect.element(page.getByRole('navigation')).toHaveAttribute('aria-label', 'foo')
  })

  it('wraps its children in an "PRC-UnderlineNav-body" div', async () => {
    render(
      <UnderlineNav>
        <b data-testid="content">test</b>
      </UnderlineNav>,
    )

    await expect.element(page.getByTestId('content')).toBeInTheDocument()
    expect(page.getByTestId('content').element().parentElement).toHaveClass('PRC-UnderlineNav-body')
  })

  it('respects the "actions" prop', async () => {
    render(<UnderlineNav actions={<span data-testid="action">test</span>} />)

    await expect.element(page.getByTestId('action')).toBeInTheDocument()
    expect(page.getByTestId('action').element().parentElement).toHaveClass('PRC-UnderlineNav-actions')
  })
})
