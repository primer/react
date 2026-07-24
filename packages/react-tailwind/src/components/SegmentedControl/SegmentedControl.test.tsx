import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {SegmentedControl} from './SegmentedControl'

describe('SegmentedControl', () => {
  it('uses toggle group keyboard behavior and forwards props and refs', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    const onValueChange = vi.fn()
    render(
      <SegmentedControl ref={ref} defaultValue={['list']} onValueChange={onValueChange} data-testid="control">
        <SegmentedControl.Button value="list">List</SegmentedControl.Button>
        <SegmentedControl.Button value="grid">Grid</SegmentedControl.Button>
      </SegmentedControl>,
    )
    await user.click(screen.getByRole('button', {name: 'Grid'}))
    expect(onValueChange).toHaveBeenLastCalledWith(['grid'], expect.anything())
    expect(ref.current).toBe(screen.getByTestId('control'))
    expect(screen.getByRole('button', {name: 'Grid'})).toHaveClass('font-medium')
  })
})
