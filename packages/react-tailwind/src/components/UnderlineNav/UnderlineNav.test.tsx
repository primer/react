import {render, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {UnderlineNav} from './UnderlineNav'

describe('UnderlineNav', () => {
  it('retains semantic navigation, list, current-link states, and DOM props', () => {
    const ref = React.createRef<HTMLElement>()
    const {container} = render(
      <UnderlineNav ref={ref} aria-label="Repository" data-testid="navigation">
        <UnderlineNav.List>
          <UnderlineNav.Item href="/code" aria-current="page">
            Code
          </UnderlineNav.Item>
          <UnderlineNav.Item href="/issues" counter={3}>
            Issues
          </UnderlineNav.Item>
        </UnderlineNav.List>
      </UnderlineNav>,
    )
    const canvas = within(container)
    expect(canvas.getByRole('navigation', {name: 'Repository'})).toBeInTheDocument()
    expect(canvas.getByRole('link', {name: /Code/})).toHaveAttribute('aria-current', 'page')
    expect(canvas.getByRole('list')).toHaveClass('flex')
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
        <UnderlineNav.List>
          <UnderlineNav.Item href="#issues" onClick={onClick} onSelect={onSelect}>
            Issues
          </UnderlineNav.Item>
        </UnderlineNav.List>
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
        <UnderlineNav.List>
          <UnderlineNav.Item href="#issues" onClick={event => event.preventDefault()} onSelect={onSelect}>
            Issues
          </UnderlineNav.Item>
        </UnderlineNav.List>
      </UnderlineNav>,
    )

    await user.click(within(container).getByRole('link', {name: 'Issues'}))

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('uses a loading skeleton in place of counters', () => {
    const {container} = render(
      <UnderlineNav aria-label="Repository" loadingCounters>
        <UnderlineNav.List>
          <UnderlineNav.Item href="/issues" counter={3}>
            Issues
          </UnderlineNav.Item>
        </UnderlineNav.List>
      </UnderlineNav>,
    )

    const issues = within(container).getByRole('link', {name: 'Issues'})
    expect(issues).toBeInTheDocument()
    expect(issues.querySelector('[data-component="SkeletonBox"]')).toBeInTheDocument()
  })
})
