import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it} from 'vitest'
import {Autocomplete} from './Autocomplete'
import {Autocomplete as BaseAutocomplete} from '@base-ui/react/autocomplete'
import {Textarea} from '../Textarea'

afterEach(cleanup)

describe('Autocomplete', () => {
  it('replaces its field using render and merges the textarea ref, native props, and handlers', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLTextAreaElement>()
    render(
      <Autocomplete items={['Apple']}>
        <Autocomplete.Input aria-label="Fruit" render={<Textarea ref={ref} rows={4} />} />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(fruit: string) => (
              <Autocomplete.Item key={fruit} value={fruit}>
                {fruit}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete>,
    )
    expect(ref.current).toBe(screen.getByLabelText('Fruit'))
    expect(ref.current).toHaveAttribute('rows', '4')
    await user.type(screen.getByLabelText('Fruit'), 'app')
    expect(await screen.findByRole('option', {name: 'Apple'})).toBeVisible()
  })

  it('shares Base UI context with a raw input and exposes filtered collection hooks', async () => {
    function Count() {
      const items = Autocomplete.useFilteredItems<string>()
      return <output aria-label="Matches">{items.length}</output>
    }
    const user = userEvent.setup()
    const {contains} = Autocomplete.useFilter({sensitivity: 'base'})
    expect(contains('Móna', 'mona')).toBe(true)
    render(
      <Autocomplete items={['Apple', 'Banana']}>
        <BaseAutocomplete.Input aria-label="Fruit" />
        <Count />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(fruit: string) => (
              <BaseAutocomplete.Item key={fruit} value={fruit}>
                {fruit}
              </BaseAutocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete>,
    )
    await user.type(screen.getByRole('combobox'), 'app')
    expect(await screen.findByRole('option', {name: 'Apple'})).toBeVisible()
    expect(screen.getByLabelText('Matches')).toHaveTextContent('1')
  })

  it('filters and exposes an active descendant through Base UI', async () => {
    const user = userEvent.setup()
    render(
      <Autocomplete items={['Apple', 'Banana']}>
        <Autocomplete.Input aria-label="Fruit" />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(fruit: string) => (
              <Autocomplete.Item key={fruit} value={fruit}>
                {fruit}
              </Autocomplete.Item>
            )}
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
              {(fruit: string) => (
                <Autocomplete.Item key={fruit} value={fruit}>
                  {fruit}
                </Autocomplete.Item>
              )}
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
