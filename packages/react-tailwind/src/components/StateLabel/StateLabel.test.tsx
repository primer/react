import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {StateLabel} from './StateLabel'

describe('StateLabel', () => {
  it('renders a status label with root props and ref', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <StateLabel ref={ref} status="issueOpened" data-testid="state">
        Open
      </StateLabel>,
    )
    expect(screen.getByTestId('state')).toHaveAttribute('data-status', 'issueOpened')
    expect(screen.getByTestId('state')).toBe(ref.current)
    expect(screen.getByRole('img', {name: 'Issue'})).toBeInTheDocument()
  })

  it('supports alert states with their corresponding accessible icon', () => {
    render(<StateLabel status="alertClosed">Closed</StateLabel>)

    expect(screen.getByRole('img', {name: 'Alert'})).toBeInTheDocument()
    expect(screen.getByText('Closed')).toHaveAttribute('data-status', 'alertClosed')
  })
})
