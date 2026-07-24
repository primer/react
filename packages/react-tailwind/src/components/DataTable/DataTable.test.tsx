import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it} from 'vitest'
import {DataTable, type Column} from './DataTable'
import {Table} from './index'

type Row = {id: number; name: string; stars: number}
const columns: Column<Row>[] = [
  {field: 'name', header: 'Name', rowHeader: true},
  {field: 'stars', header: 'Stars', sortBy: true},
]

afterEach(cleanup)

describe('DataTable and Table', () => {
  it('renders native table semantics and toggles sortable headers', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={[
          {id: 1, name: 'Zebra', stars: 1},
          {id: 2, name: 'Ant', stars: 2},
        ]}
      />,
    )
    expect(screen.getByRole('button', {name: /Stars\s*sort ascending/})).toBeInTheDocument()
    await user.click(screen.getByRole('button', {name: /Stars/}))
    expect(screen.getByRole('columnheader', {name: /Stars/})).toHaveAttribute('aria-sort', 'ascending')
    expect(screen.getAllByRole('rowheader')[0]).toHaveTextContent('Zebra')
  })
  it('forwards table props and its table ref', () => {
    const ref = React.createRef<HTMLTableElement>()
    render(<DataTable ref={ref} aria-label="Repositories" cellPadding="spacious" columns={columns} data={[]} />)
    expect(ref.current).toHaveAttribute('aria-label', 'Repositories')
    expect(ref.current).toHaveAttribute('data-cell-padding', 'spacious')
    expect(ref.current?.className).toContain('group')
  })
  it('exposes composable table parts', () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Header</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Value</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )
    expect(screen.getAllByRole('table')).toHaveLength(1)
  })
})
