import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Stack, StackItem} from './Stack'

describe('Stack', () => {
  it('forwards props and keeps authored children in order', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Stack ref={ref} data-testid="stack" direction={{narrow: 'vertical', regular: 'horizontal'}} gap="normal">
        <StackItem>First</StackItem>
        <StackItem>Second</StackItem>
      </Stack>,
    )
    expect(screen.getByTestId('stack')).toBe(ref.current)
    expect(screen.getByTestId('stack').textContent).toBe('FirstSecond')
    expect(screen.getByTestId('stack')).toHaveClass('md:flex-row')
  })

  it('does not grow items unless grow is requested', () => {
    render(<StackItem data-testid="item">Item</StackItem>)
    expect(screen.getByTestId('item')).toHaveClass('grow-0')
    expect(screen.getByTestId('item')).not.toHaveClass('flex-auto')
  })

  it('uses normal spacing by default', () => {
    const {container} = render(<Stack>Content</Stack>)
    expect(container.firstElementChild).toHaveClass('gap-4')
  })

  it('uses 2xl for the wide range and component defaults for omitted ranges', () => {
    const {container} = render(<Stack data-testid="stack" direction={{regular: 'horizontal'}} />)
    expect(container.querySelector('[data-testid="stack"]')).toHaveClass('flex-col', 'md:flex-row', '2xl:flex-col')
  })

  it('applies the full padding scale at every responsive range', () => {
    const {container} = render(<Stack padding={{narrow: 'tight', regular: 'normal', wide: 'spacious'}} />)
    expect(container.firstElementChild).toHaveClass('p-1', 'md:p-4', '2xl:p-6')
  })
})
