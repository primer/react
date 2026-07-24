import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Button} from './Button'

describe('Button', () => {
  it('uses Base UI button semantics and forwards its ref and props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Button ref={ref} data-testid="button">
        Save
      </Button>,
    )
    expect(screen.getByRole('button', {name: 'Save'})).toHaveAttribute('data-component', 'Button')
    expect(screen.getByTestId('button')).toBe(ref.current)
  })
})
