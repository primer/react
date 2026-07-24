import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {AvatarStack} from './AvatarStack'

describe('AvatarStack', () => {
  it('forwards root props without rewriting children', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <AvatarStack ref={ref} data-testid="stack">
        <span>first</span>
        <span>second</span>
      </AvatarStack>,
    )
    expect(screen.getByTestId('stack')).toHaveTextContent('firstsecond')
    expect(screen.getByTestId('stack')).toBe(ref.current)
  })
})
