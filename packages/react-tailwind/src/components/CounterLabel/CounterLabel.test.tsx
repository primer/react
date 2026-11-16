import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {CounterLabel} from './CounterLabel'

describe('CounterLabel', () => {
  it('hides duplicate visual text and provides an accessible label', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <CounterLabel ref={ref} data-testid="counter">
        12
      </CounterLabel>,
    )
    expect(screen.getByTestId('counter')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('(12)')).toBeInTheDocument()
    expect(screen.getByTestId('counter')).toBe(ref.current)
  })
})
