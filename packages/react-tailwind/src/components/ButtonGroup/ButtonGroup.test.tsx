import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {ButtonGroup} from './ButtonGroup'

describe('ButtonGroup', () => {
  it('forwards props and ref to its group root', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <ButtonGroup ref={ref} data-testid="group">
        Actions
      </ButtonGroup>,
    )
    expect(screen.getByTestId('group')).toHaveAttribute('role', 'group')
    expect(screen.getByTestId('group')).toBe(ref.current)
  })
})
