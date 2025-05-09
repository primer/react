import React from 'react'
import {CircleBadge} from '..'
import {CheckIcon} from '@primer/octicons-react'
import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

const imgInput = <img alt="Example" src="primer.jpg" />

describe('CircleBadge', () => {
  it('respects the inline prop', () => {
    const {container} = render(<CircleBadge inline />)
    const style = window.getComputedStyle(container.firstChild as Element)
    expect(style.display).toContain('inline-flex')
  })

  it('renders with variant prop', () => {
    const {container} = render(<CircleBadge variant="large" />)
    expect(container.firstChild).toBeDefined()
  })

  it('renders with size prop', () => {
    const {container} = render(<CircleBadge variant="large" size={20} />)
    expect(container.firstChild).toBeDefined()
  })

  it('applies title', () => {
    const {container} = render(
      <CircleBadge as="a" title="primer logo">
        {imgInput}
      </CircleBadge>,
    )
    expect(container.firstChild).toHaveAttribute('title', 'primer logo')
  })

  it('preserves child class names', () => {
    const {getByRole} = render(
      <CircleBadge>
        <img className="primer" alt="Example" src="primer.jpg" />
      </CircleBadge>,
    )
    expect(getByRole('img')).toHaveClass('primer')
  })
})
