import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Label} from './Label'

describe('Label', () => {
  it('forwards props and refs to its presentational root', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Label ref={ref} data-testid="label">
        Bug
      </Label>,
    )
    expect(screen.getByTestId('label')).toHaveAttribute('data-component', 'Label')
    expect(screen.getByTestId('label')).toBe(ref.current)
  })
})
