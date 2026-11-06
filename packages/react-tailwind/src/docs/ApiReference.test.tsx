import React from 'react'
import {render, screen, within} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {ApiReference} from './ApiReference'

describe('ApiReference', () => {
  it('renders generated types, defaults, required props, and the passthrough link', () => {
    render(
      <ApiReference
        props={[
          {name: 'variant', type: "'small' | 'large'", defaultValue: "'small'", description: 'Visual size.'},
          {name: 'label', type: 'string', required: true},
        ]}
        passthrough={{element: 'button', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button'}}
      />,
    )

    const table = screen.getByRole('table', {name: 'Component-specific props'})
    expect(table.closest('[data-component="ScrollableRegion"]')).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', {name: 'Required'})).toBeInTheDocument()
    expect(
      within(table).getByRole('rowheader', {name: 'label'}).closest('tr')?.querySelectorAll('td')[1],
    ).toHaveTextContent('Yes')
    expect(
      within(table).getByRole('rowheader', {name: 'variant'}).closest('tr')?.querySelectorAll('td')[1],
    ).toHaveTextContent('No')
    expect(within(table).getByText("'small' | 'large'").closest('td')).toHaveStyle({overflowWrap: 'anywhere'})
    expect(within(table).getByText("'small'")).toBeInTheDocument()
    expect(within(table).getByText('Visual size.')).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'button'})).toHaveAttribute(
      'href',
      'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',
    )
  })
})
