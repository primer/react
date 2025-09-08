import {render} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import UnderlineNav from '../UnderlineNav'

describe('UnderlineNav', () => {
  it('renders a <nav>', () => {
    const {container} = render(<UnderlineNav />)
    expect(container.firstElementChild?.tagName).toEqual('NAV')
  })

  it('adds the UnderlineNav class', () => {
    const {container} = render(<UnderlineNav />)
    expect(container.firstElementChild).toHaveClass('PRC-UnderlineNav')
  })

  it('respects the "align" prop', () => {
    const {container} = render(<UnderlineNav align="right" />)
    expect(container.firstElementChild).toHaveClass('PRC-UnderlineNav--right')
  })

  it('respects the "full" prop', () => {
    const {container} = render(<UnderlineNav full />)
    expect(container.firstElementChild).toHaveClass('PRC-UnderlineNav--full')
  })

  it('sets aria-label to the "label" prop', () => {
    const {container} = render(<UnderlineNav label="foo" />)
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'foo')
  })

  it('wraps its children in an "PRC-UnderlineNav-body" div', () => {
    const {getByTestId} = render(
      <UnderlineNav>
        <b data-testid="content">test</b>
      </UnderlineNav>,
    )

    expect(getByTestId('content')).toBeInTheDocument()
    expect(getByTestId('content').parentElement).toHaveClass('PRC-UnderlineNav-body')
  })

  it('respects the "actions" prop', () => {
    const {getByTestId} = render(<UnderlineNav actions={<span data-testid="action">test</span>} />)

    expect(getByTestId('action')).toBeInTheDocument()
    expect(getByTestId('action').parentElement).toHaveClass('PRC-UnderlineNav-actions')
  })
})
