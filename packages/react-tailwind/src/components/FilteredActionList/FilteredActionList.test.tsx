import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {FilteredActionList} from './'

describe('FilteredActionList', () => {
  it('reports controlled filter and selection changes with Base UI details', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    const onSelectedChange = vi.fn()
    render(
      <FilteredActionList
        items={[
          {id: 'a', text: 'Apple'},
          {id: 'b', text: 'Banana'},
        ]}
        onFilterChange={onFilterChange}
        onSelectedChange={onSelectedChange}
      />,
    )
    await user.type(screen.getByRole('combobox', {name: 'Filter items'}), 'app')
    expect(onFilterChange).toHaveBeenCalledWith('app', expect.objectContaining({reason: expect.any(String)}))
    await user.click(screen.getByRole('option', {name: 'Apple'}))
    expect(onSelectedChange).toHaveBeenCalledWith(['a'], expect.any(Object))
  })

  it('keeps a single-select list controlled when its selected IDs are cleared', () => {
    const items = [{id: 'a', text: 'Apple'}]
    const {rerender} = render(<FilteredActionList items={items} selectedItemIds={['a']} />)
    expect(screen.getByRole('option', {name: 'Apple'})).toHaveAttribute('aria-selected', 'true')

    rerender(<FilteredActionList items={items} selectedItemIds={[]} />)
    expect(screen.getByRole('option', {name: 'Apple'})).toHaveAttribute('aria-selected', 'false')
  })

  it('forwards config rest props and preserves part class-name callbacks', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <FilteredActionList.Root items={['Apple']}>
        <FilteredActionList.Input aria-label="Fruit" className={({open}) => (open ? 'is-open' : 'is-closed')} />
      </FilteredActionList.Root>,
    )
    expect(screen.getByRole('combobox', {name: 'Fruit'})).toHaveClass('is-closed')

    render(<FilteredActionList ref={ref} data-testid="filtered-list" items={[]} />)
    expect(ref.current).toBe(screen.getByTestId('filtered-list'))
  })
})
