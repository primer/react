import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {VisuallyHidden} from './VisuallyHidden'

describe('VisuallyHidden', () => {
  it('keeps content in the accessibility tree and forwards its ref', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <VisuallyHidden ref={ref} data-testid="hidden">
        Description
      </VisuallyHidden>,
    )
    expect(screen.getByText('Description')).toBe(ref.current)
    expect(screen.getByTestId('hidden')).toHaveAttribute('data-component', 'VisuallyHidden')
  })
})
