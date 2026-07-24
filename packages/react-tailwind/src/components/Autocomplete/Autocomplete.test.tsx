import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {Autocomplete} from './Autocomplete'

describe('Autocomplete', () => {
  it('filters and exposes an active descendant through Base UI', async () => {
    const user = userEvent.setup()
    render(
      <Autocomplete items={['Apple', 'Banana']}>
        <Autocomplete.Input aria-label="Fruit" />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(fruit: string) => <Autocomplete.Item value={fruit}>{fruit}</Autocomplete.Item>}
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete>,
    )
    await user.type(screen.getByRole('combobox', {name: 'Fruit'}), 'app')
    expect(screen.getByRole('option', {name: 'Apple'})).toBeVisible()
    expect(screen.queryByRole('option', {name: 'Banana'})).not.toBeInTheDocument()
  })

  it('preserves state-aware class names and refs on its input', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(
      <Autocomplete items={['Apple']}>
        <Autocomplete.Input
          ref={ref}
          aria-label="Fruit"
          data-testid="stateful-input"
          className={({open}) => (open ? 'is-open' : 'is-closed')}
        />
      </Autocomplete>,
    )

    expect(ref.current).toBe(screen.getByTestId('stateful-input'))
    expect(ref.current).toHaveClass('is-closed')
  })
})
