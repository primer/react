import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {BranchName} from './BranchName'

describe('BranchName', () => {
  it('renders a link by default and forwards its ref', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <BranchName ref={ref} href="#main" data-testid="branch">
        main
      </BranchName>,
    )
    expect(screen.getByRole('link', {name: 'main'})).toBe(ref.current)
    expect(screen.getByTestId('branch')).toHaveAttribute('href', '#main')
  })
})
