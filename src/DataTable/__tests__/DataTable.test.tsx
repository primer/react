import React from 'react'
import {DataTable} from '..'
import {render, screen} from '@testing-library/react'

describe('DataTable', () => {
  it('should render a semantic <table> through `data` and `columns`', () => {
    const columns = [
      {
        header: 'Name',
        field: 'name',
      },
    ]
    const data = [
      {
        id: 1,
        name: 'one',
      },
      {
        id: 2,
        name: 'two',
      },
      {
        id: 3,
        name: 'three',
      },
    ]
    render(<DataTable data={data} columns={columns} />)

    // <table>
    expect(screen.getByRole('table')).toBeInTheDocument()

    // <th>
    expect(screen.getAllByRole('columnheader')).toHaveLength(1)
    expect(screen.getByRole('columnheader', {name: 'Name'})).toBeInTheDocument()

    // <tr>
    expect(screen.getAllByRole('row').length).toBe(4)
    // <td>
    expect(screen.getAllByRole('cell').length).toBe(3)
  })

  it('should support custom cell rendering with `renderCell`', () => {
    const data = [
      {
        id: 1,
        name: {
          value: 'one',
        },
      },
      {
        id: 2,
        name: {
          value: 'two',
        },
      },
      {
        id: 3,
        name: {
          value: 'three',
        },
      },
    ]
    render(
      <DataTable
        data={data}
        columns={[
          {
            header: 'Name',
            renderCell: row => {
              return row.name.value
            },
          },
        ]}
      />,
    )

    for (const row of data) {
      expect(screen.getByRole('cell', {name: row.name.value})).toBeInTheDocument()
    }
  })

  it('should support custom labeling through `aria-labelledby`', () => {
    const columns = [
      {
        header: 'Name',
        field: 'name',
      },
    ]
    const data = [
      {
        id: 1,
        name: 'one',
      },
      {
        id: 2,
        name: 'two',
      },
      {
        id: 3,
        name: 'three',
      },
    ]
    render(
      <>
        <h2 id="custom-title">custom-title</h2>
        <DataTable data={data} columns={columns} aria-labelledby="custom-title" />
      </>,
    )
    expect(screen.getByRole('table', {name: 'custom-title'})).toBeInTheDocument()
  })

  it('should support custom descriptions through `aria-describedby`', () => {
    const columns = [
      {
        header: 'Name',
        field: 'name',
      },
    ]
    const data = [
      {
        id: 1,
        name: 'one',
      },
      {
        id: 2,
        name: 'two',
      },
      {
        id: 3,
        name: 'three',
      },
    ]
    render(
      <>
        <p id="custom-description">custom-description</p>
        <DataTable data={data} columns={columns} aria-describedby="custom-description" />
      </>,
    )
    expect(screen.getByRole('table', {description: 'custom-description'})).toBeInTheDocument()
  })

  it('should support customizing the `cellPadding` of cells', () => {
    const columns = [
      {
        header: 'Name',
        field: 'name',
      },
    ]
    const data = [
      {
        id: 1,
        name: 'one',
      },
      {
        id: 2,
        name: 'two',
      },
      {
        id: 3,
        name: 'three',
      },
    ]
    const {rerender} = render(<DataTable data={data} columns={columns} />)

    expect(screen.getByRole('table')).toHaveAttribute('data-cell-padding', 'normal')

    rerender(<DataTable data={data} columns={columns} cellPadding="condensed" />)
    expect(screen.getByRole('table')).toHaveAttribute('data-cell-padding', 'condensed')

    rerender(<DataTable data={data} columns={columns} cellPadding="spacious" />)
    expect(screen.getByRole('table')).toHaveAttribute('data-cell-padding', 'spacious')
  })

  it('should support specifying a rowHeader through `rowHeader` in `columns`', () => {
    const columns = [
      {
        header: 'Name',
        field: 'name',
        rowHeader: true,
      },
    ]
    const data = [
      {
        id: 1,
        name: 'one',
      },
      {
        id: 2,
        name: 'two',
      },
      {
        id: 3,
        name: 'three',
      },
    ]
    render(<DataTable data={data} columns={columns} />)
    for (const row of data) {
      expect(screen.getByRole('rowheader', {name: row.name})).toBeInTheDocument()
    }
  })
})
