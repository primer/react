import {render, screen} from '@testing-library/react'
import {describe, expect, test} from 'vitest'
import {Dialog, Table} from '../experimental'

describe('@primer/react/experimental', () => {
  test('Dialog supports `sx` prop', () => {
    render(<Dialog data-testid="component" onClose={() => {}} sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByRole('dialog')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Table.Container', () => {
    render(<Table.Container data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Table.Container supports `sx` prop', () => {
    render(
      <Table.Container data-testid="component" sx={{background: 'red'}}>
        <Table.Row>
          <Table.Cell>cell</Table.Cell>
        </Table.Row>
      </Table.Container>,
    )
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })
})
