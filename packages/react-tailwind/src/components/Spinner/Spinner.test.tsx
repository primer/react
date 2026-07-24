import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Spinner} from './Spinner'

describe('Spinner', () => {
  it('announces its loading text and forwards root props and ref', () => {
    const ref = React.createRef<HTMLElement>()
    render(<Spinner ref={ref} data-testid="spinner" />)
    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(screen.getByTestId('spinner')).toBe(ref.current)
  })
})
