import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Radio} from '../Radio'
import {RadioGroup} from './RadioGroup'

describe('RadioGroup', () => {
  it('uses Base UI roving focus and forwards rest props and refs', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <RadioGroup ref={ref} name="view" defaultValue="grid" data-testid="group">
        <Radio value="list" />
        <Radio value="grid" />
      </RadioGroup>,
    )
    expect(screen.getByRole('radio', {checked: true})).toBe(screen.getAllByRole('radio')[1])
    expect(ref.current).toBe(screen.getByTestId('group'))
  })
})
