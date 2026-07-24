import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {LabelGroup} from './LabelGroup'

describe('LabelGroup', () => {
  it('preserves consumer child order and root props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <LabelGroup ref={ref} data-testid="labels">
        <span>one</span>
        <span>two</span>
      </LabelGroup>,
    )
    expect(screen.getByTestId('labels')).toHaveTextContent('onetwo')
    expect(screen.getByTestId('labels')).toBe(ref.current)
  })
})
