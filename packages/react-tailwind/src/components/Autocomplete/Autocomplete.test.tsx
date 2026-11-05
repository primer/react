import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it} from 'vitest'
import {Autocomplete} from './Autocomplete'

afterEach(cleanup)

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

  it('renders in place when portal is false', async () => {
    const user = userEvent.setup()
    render(
      <div data-testid="container">
        <Autocomplete items={['Apple']}>
          <Autocomplete.Input aria-label="Fruit" />
          <Autocomplete.Content portal={false}>
            <Autocomplete.List>
              {(fruit: string) => <Autocomplete.Item value={fruit}>{fruit}</Autocomplete.Item>}
            </Autocomplete.List>
          </Autocomplete.Content>
        </Autocomplete>
      </div>,
    )
    await user.type(screen.getByRole('combobox', {name: 'Fruit'}), 'a')
    expect(screen.getByTestId('container')).toContainElement(await screen.findByRole('option', {name: 'Apple'}))
  })

  it('applies state-aware class names to the field and forwards refs to its input', () => {
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
    expect(ref.current).toHaveAttribute('data-component', 'Autocomplete.Input')
    expect(ref.current?.closest('[data-component="TextInput"]')).toHaveClass('is-closed')
  })
})
