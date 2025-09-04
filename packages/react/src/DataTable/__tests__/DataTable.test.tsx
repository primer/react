import {describe, expect, it, vi} from 'vitest'
import userEvent from '@testing-library/user-event'
import {render, screen, getByRole, queryByRole, queryAllByRole, renderHook} from '@testing-library/react'
import {DataTable, Table} from '../../DataTable'
import type {Column} from '../column'
import {createColumnHelper} from '../column'
import {getGridTemplateFromColumns, useTable} from '../useTable'

describe('DataTable', () => {
  it('should render a semantic <table> through `data` and `columns`', () => {
    const columnHelper = createColumnHelper<{id: number; name: string}>()
    const columns = [
      columnHelper.column({
        header: 'Name',
        field: 'name',
      }),
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
            field: 'name.value',
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
    const columnHelper = createColumnHelper<{id: number; name: string}>()
    const columns = [
      columnHelper.column({
        header: 'Name',
        field: 'name',
      }),
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

  it('should support custom labeling through `aria-labelledby` and `Table.Title`', () => {
    const columnHelper = createColumnHelper<{id: number; name: string}>()
    const columns = [
      columnHelper.column({
        header: 'Name',
        field: 'name',
      }),
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
      <Table.Container>
        <Table.Title as="h2" id="custom-title">
          custom-title
        </Table.Title>
        <DataTable data={data} columns={columns} aria-labelledby="custom-title" />
      </Table.Container>,
    )
    expect(screen.getByRole('table', {name: 'custom-title'})).toBeInTheDocument()
  })

  it('should support custom descriptions through `aria-describedby`', () => {
    const columnHelper = createColumnHelper<{id: number; name: string}>()
    const columns = [
      columnHelper.column({
        header: 'Name',
        field: 'name',
      }),
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

  it('should support custom descriptions through `aria-describedby` and `Table.Subtitle`', () => {
    const columnHelper = createColumnHelper<{id: number; name: string}>()
    const columns = [
      columnHelper.column({
        header: 'Name',
        field: 'name',
      }),
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
      <Table.Container>
        <Table.Subtitle as="p" id="custom-description">
          custom-description
        </Table.Subtitle>
        <DataTable data={data} columns={columns} aria-describedby="custom-description" />
      </Table.Container>,
    )
    expect(screen.getByRole('table', {description: 'custom-description'})).toBeInTheDocument()
  })

  it('should support customizing the `cellPadding` of cells', () => {
    const columnHelper = createColumnHelper<{id: number; name: string}>()
    const columns = [
      columnHelper.column({
        header: 'Name',
        field: 'name',
      }),
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
    const columnHelper = createColumnHelper<{id: number; name: string}>()
    const columns = [
      columnHelper.column({
        header: 'Name',
        field: 'name',
        rowHeader: true,
      }),
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

  describe('sorting', () => {
    describe('initial state', () => {
      it('should set the default sort state of a sortable table', () => {
        render(
          <DataTable
            data={[
              {
                id: 1,
                value: 1,
              },
              {
                id: 2,
                value: 2,
              },
              {
                id: 3,
                value: 3,
              },
            ]}
            columns={[
              {
                header: 'Value',
                field: 'value',
                sortBy: true,
              },
            ]}
            initialSortColumn="value"
            initialSortDirection="ASC"
          />,
        )

        const header = screen.getByRole('columnheader', {
          name: 'Value',
        })
        expect(header).toHaveAttribute('aria-sort', 'ascending')

        const rows = screen
          .getAllByRole('row')
          .filter(row => {
            return queryByRole(row, 'cell')
          })
          .map(row => {
            const cell = getByRole(row, 'cell')
            return cell.textContent
          })
        expect(rows).toEqual(['1', '2', '3'])
      })

      it('should set the default sort state if `initialSortColumn` is provided', () => {
        render(
          <DataTable
            data={[
              {
                id: 1,
                fieldOne: 'a',
                fieldTwo: 'c',
              },
              {
                id: 2,
                fieldOne: 'b',
                fieldTwo: 'b',
              },
              {
                id: 3,
                fieldOne: 'c',
                fieldTwo: 'a',
              },
            ]}
            columns={[
              {
                header: 'Field One',
                field: 'fieldOne',
                sortBy: true,
              },
              {
                header: 'Field Two',
                field: 'fieldTwo',
              },
            ]}
            initialSortColumn="fieldOne"
          />,
        )

        const header = screen.getByRole('columnheader', {
          name: 'Field One',
        })
        expect(header).toHaveAttribute('aria-sort', 'ascending')
      })

      it('should not set a default sort state if `initialSortColumn` is provided but no columns are sortable', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {})

        render(
          <DataTable
            data={[
              {
                id: 1,
                fieldOne: 'a',
                fieldTwo: 'c',
              },
              {
                id: 2,
                fieldOne: 'b',
                fieldTwo: 'b',
              },
              {
                id: 3,
                fieldOne: 'c',
                fieldTwo: 'a',
              },
            ]}
            columns={[
              {
                header: 'Field One',
                field: 'fieldOne',
              },
              {
                header: 'Field Two',
                field: 'fieldTwo',
              },
            ]}
            initialSortColumn={1}
          />,
        )

        const headers = screen.getAllByRole('columnheader')
        for (const header of headers) {
          expect(header).not.toHaveAttribute('aria-sort')
        }

        expect(spy).toHaveBeenCalled()
        spy.mockRestore()
      })

      it('should not set a default sort state if `initialSortColumn` is provided but does not correspond to a column', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {})
        render(
          <DataTable
            data={[
              {
                id: 1,
                fieldOne: 'a',
                fieldTwo: 'c',
              },
              {
                id: 2,
                fieldOne: 'b',
                fieldTwo: 'b',
              },
              {
                id: 3,
                fieldOne: 'c',
                fieldTwo: 'a',
              },
            ]}
            columns={[
              {
                header: 'Field One',
                field: 'fieldOne',
              },
              {
                header: 'Field Two',
                field: 'fieldTwo',
              },
            ]}
            initialSortColumn={100}
          />,
        )

        const headers = screen.getAllByRole('columnheader')
        for (const header of headers) {
          expect(header).not.toHaveAttribute('aria-sort')
        }

        expect(spy).toHaveBeenCalled()
        spy.mockRestore()
      })

      it('should set the default sort state of the first sortable column if only `initialSortDirection` is provided', () => {
        render(
          <DataTable
            data={[
              {
                id: 1,
                fieldOne: 'a',
                fieldTwo: 'c',
              },
              {
                id: 2,
                fieldOne: 'b',
                fieldTwo: 'b',
              },
              {
                id: 3,
                fieldOne: 'c',
                fieldTwo: 'a',
              },
            ]}
            columns={[
              {
                header: 'Field One',
                field: 'fieldOne',
              },
              {
                header: 'Field Two',
                field: 'fieldTwo',
                sortBy: true,
              },
            ]}
            initialSortDirection="ASC"
          />,
        )

        const header = screen.getByRole('columnheader', {
          name: 'Field Two',
        })
        expect(header).toHaveAttribute('aria-sort', 'ascending')

        const body = screen.getByRole('table').querySelector('tbody') as HTMLTableSectionElement
        const rows = queryAllByRole(body, 'row').map(row => {
          const cells = queryAllByRole(row, 'cell').map(cell => {
            return cell.textContent
          })
          return cells
        })
        expect(rows).toEqual([
          ['a', 'c'],
          ['b', 'b'],
          ['c', 'a'],
        ])
      })

      it('should not set a default sort state if `initialSortDirection` is provided but no columns are sortable', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {})
        render(
          <DataTable
            data={[
              {
                id: 1,
                fieldOne: 'a',
                fieldTwo: 'c',
              },
              {
                id: 2,
                fieldOne: 'b',
                fieldTwo: 'b',
              },
              {
                id: 3,
                fieldOne: 'c',
                fieldTwo: 'a',
              },
            ]}
            columns={[
              {
                header: 'Field One',
                field: 'fieldOne',
              },
              {
                header: 'Field Two',
                field: 'fieldTwo',
              },
            ]}
            initialSortDirection="ASC"
          />,
        )

        const headers = screen.getAllByRole('columnheader')
        for (const header of headers) {
          expect(header).not.toHaveAttribute('aria-sort')
        }

        expect(spy).toHaveBeenCalled()
        spy.mockRestore()
      })
    })

    it('should sort sparsely populated columns with blank values at the end', async () => {
      const user = userEvent.setup()

      render(
        <DataTable
          data={[
            {
              id: 1,
              value: null,
            },
            {
              id: 2,
              value: 2,
            },
            {
              id: 3,
              value: '',
            },
            {
              id: 4,
              value: 3,
            },
            {
              id: 5,
              value: 1,
            },
          ]}
          columns={[
            {
              header: 'Value',
              field: 'value',
              sortBy: true,
            },
          ]}
          initialSortColumn="value"
          initialSortDirection="ASC"
        />,
      )

      const header = screen.getByRole('columnheader', {
        name: 'Value',
      })
      expect(header).toHaveAttribute('aria-sort', 'ascending')

      // Change to descending
      await user.click(screen.getByText('Value'))

      let rows = screen
        .getAllByRole('row')
        .filter(row => {
          return queryByRole(row, 'cell')
        })
        .map(row => {
          const cell = getByRole(row, 'cell')
          return cell.textContent
        })

      expect(rows).toEqual(['3', '2', '1', '', ''])

      // Change to ascending
      await user.click(screen.getByText('Value'))

      rows = screen
        .getAllByRole('row')
        .filter(row => {
          return queryByRole(row, 'cell')
        })
        .map(row => {
          const cell = getByRole(row, 'cell')
          return cell.textContent
        })

      expect(rows).toEqual(['1', '2', '3', '', ''])
    })

    it('should change the sort direction on mouse click', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          data={[
            {
              id: 1,
              value: 1,
            },
            {
              id: 2,
              value: 2,
            },
            {
              id: 3,
              value: 3,
            },
          ]}
          columns={[
            {
              header: 'Value',
              field: 'value',
              sortBy: true,
            },
          ]}
          initialSortColumn="value"
          initialSortDirection="ASC"
        />,
      )

      function getRowOrder() {
        return screen
          .getAllByRole('row')
          .filter(row => {
            return queryByRole(row, 'cell')
          })
          .map(row => {
            const cell = getByRole(row, 'cell')
            return cell.textContent
          })
      }

      expect(getRowOrder()).toEqual(['1', '2', '3'])

      // Transition from ASC -> DESC order
      await user.click(screen.getByText('Value'))
      expect(getRowOrder()).toEqual(['3', '2', '1'])

      // Transition from DESC -> ASC order
      await user.click(screen.getByText('Value'))
      expect(getRowOrder()).toEqual(['1', '2', '3'])
    })

    it('should change the sort direction on keyboard Enter or Space', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          data={[
            {
              id: 1,
              value: 1,
            },
            {
              id: 2,
              value: 2,
            },
            {
              id: 3,
              value: 3,
            },
          ]}
          columns={[
            {
              header: 'Value',
              field: 'value',
              sortBy: true,
            },
          ]}
          initialSortColumn="value"
          initialSortDirection="ASC"
        />,
      )

      function getRowOrder() {
        return screen
          .getAllByRole('row')
          .filter(row => {
            return queryByRole(row, 'cell')
          })
          .map(row => {
            const cell = getByRole(row, 'cell')
            return cell.textContent
          })
      }

      function getSortHeader() {
        return screen.getByRole('columnheader', {
          name: 'Value',
        })
      }

      expect(getRowOrder()).toEqual(['1', '2', '3'])
      expect(getSortHeader()).toHaveAttribute('aria-sort', 'ascending')

      // Focus columnheader, it should be the first focusable element
      await user.tab()

      // Transition from ASC -> DESC order
      await user.keyboard('{Enter}')
      expect(getRowOrder()).toEqual(['3', '2', '1'])
      expect(getSortHeader()).toHaveAttribute('aria-sort', 'descending')

      // Transition from DESC -> ASC order
      await user.keyboard('{Enter}')
      expect(getRowOrder()).toEqual(['1', '2', '3'])
      expect(getSortHeader()).toHaveAttribute('aria-sort', 'ascending')

      // Transition from ASC -> DESC order
      await user.keyboard(' ')
      expect(getRowOrder()).toEqual(['3', '2', '1'])
      expect(getSortHeader()).toHaveAttribute('aria-sort', 'descending')

      // Transition from DESC -> ASC order
      await user.keyboard(' ')
      expect(getRowOrder()).toEqual(['1', '2', '3'])
      expect(getSortHeader()).toHaveAttribute('aria-sort', 'ascending')
    })

    it('should reset the sort direction when a new column is selected', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          data={[
            {
              id: 1,
              columnA: 1,
              columnB: 3,
            },
            {
              id: 2,
              columnA: 2,
              columnB: 2,
            },
            {
              id: 3,
              columnA: 3,
              columnB: 1,
            },
          ]}
          columns={[
            {
              header: 'Column A',
              field: 'columnA',
              sortBy: true,
            },
            {
              header: 'Column B',
              field: 'columnB',
              sortBy: true,
            },
          ]}
          initialSortColumn="columnA"
        />,
      )

      function getRowOrder() {
        return screen
          .getAllByRole('row')
          .filter(row => {
            return queryAllByRole(row, 'cell').length > 0
          })
          .map(row => {
            const cells = queryAllByRole(row, 'cell')
            return [cells[0].textContent, cells[1].textContent].map(value => {
              return parseInt(value as string, 10)
            })
          })
      }

      function getSortHeader(name: string) {
        return screen.getByRole('columnheader', {
          name,
        })
      }

      // Start in an ASC sort order
      expect(getSortHeader('Column A')).toHaveAttribute('aria-sort', 'ascending')
      expect(getRowOrder()).toEqual([
        [1, 3],
        [2, 2],
        [3, 1],
      ])

      // Transition to a DESC sort order
      await user.click(screen.getByText('Column A'))
      expect(getSortHeader('Column A')).toHaveAttribute('aria-sort', 'descending')

      // When interacting with Column B, sort order should reset to ASC
      await user.click(screen.getByText('Column B'))
      expect(getSortHeader('Column A sort ascending')).not.toHaveAttribute('aria-sort')
      expect(getSortHeader('Column B')).toHaveAttribute('aria-sort', 'ascending')
      expect(getRowOrder()).toEqual([
        [3, 1],
        [2, 2],
        [1, 3],
      ])
    })

    it('should support a custom sort function', async () => {
      const user = userEvent.setup()
      const customSortFn = vi.fn().mockImplementation((a, b) => {
        return a.value - b.value
      })

      render(
        <DataTable
          data={[
            {
              id: 1,
              value: 1,
            },
            {
              id: 2,
              value: 2,
            },
            {
              id: 3,
              value: 3,
            },
          ]}
          columns={[
            {
              header: 'Value',
              field: 'value',
              sortBy: customSortFn,
            },
          ]}
          initialSortColumn="value"
          initialSortDirection="ASC"
        />,
      )

      function getRowOrder() {
        return screen
          .getAllByRole('row')
          .filter(row => {
            return queryByRole(row, 'cell')
          })
          .map(row => {
            const cell = getByRole(row, 'cell')
            return cell.textContent
          })
      }

      await user.click(screen.getByText('Value'))
      expect(customSortFn).toHaveBeenCalled()
      expect(getRowOrder()).toEqual(['3', '2', '1'])
    })

    it('invokes onToggleSort with column id and next direction', async () => {
      const user = userEvent.setup()
      const handler = vi.fn()

      render(
        <DataTable
          data={[
            {id: 1, first: 'a', second: 'c'},
            {id: 2, first: 'b', second: 'b'},
            {id: 3, first: 'c', second: 'a'},
          ]}
          columns={[
            {header: 'First', field: 'first', sortBy: true},
            {header: 'Second', field: 'second', sortBy: true},
          ]}
          initialSortColumn="first"
          initialSortDirection="ASC"
          onToggleSort={handler}
        />,
      )

      // No calls on initial render
      expect(handler).not.toHaveBeenCalled()

      // Same column, flips ASC to DESC
      await user.click(screen.getByText('First'))
      expect(handler).toHaveBeenLastCalledWith('first', 'DESC')

      // Different column, resets to ASC on that column
      await user.click(screen.getByText('Second'))
      expect(handler).toHaveBeenLastCalledWith('second', 'ASC')

      expect(handler).toHaveBeenCalledTimes(2)
    })
  })

  describe('column widths', () => {
    it('correctly sets the column width to "grow" when width is undefined', () => {
      const columnHelper = createColumnHelper<{id: number; name: string}>()
      const columns = [
        columnHelper.column({
          header: 'Name',
          field: 'name',
        }),
      ]

      expect(getGridTemplateFromColumns(columns)).toEqual(['minmax(max-content, 1fr)'])
    })

    it('correctly sets the column width when width === "grow"', () => {
      const columnHelper = createColumnHelper<{id: number; name: string}>()
      const columns = [
        columnHelper.column({
          header: 'Name',
          field: 'name',
          width: 'grow',
        }),
      ]

      expect(getGridTemplateFromColumns(columns)).toEqual(['minmax(max-content, 1fr)'])
    })

    it('correctly sets the column width when width === "growCollapse"', () => {
      const columnHelper = createColumnHelper<{id: number; name: string}>()
      const columns = [
        columnHelper.column({
          header: 'Name',
          field: 'name',
          width: 'growCollapse',
        }),
      ]

      expect(getGridTemplateFromColumns(columns)).toEqual(['minmax(0, 1fr)'])
    })

    it('correctly sets the column width when width === "auto"', () => {
      const columnHelper = createColumnHelper<{id: number; name: string}>()
      const columns = [
        columnHelper.column({
          header: 'Name',
          field: 'name',
          width: 'auto',
        }),
      ]

      expect(getGridTemplateFromColumns(columns)).toEqual(['auto'])
    })

    it('correctly sets the column width when width is a CSS width string', () => {
      const columnHelper = createColumnHelper<{id: number; name: string}>()
      const columns = [
        columnHelper.column({
          header: 'Name',
          field: 'name',
          width: '42ch',
        }),
      ]

      expect(getGridTemplateFromColumns(columns)).toEqual(['42ch'])
    })

    it('correctly sets the column width when width is a number', () => {
      const columnHelper = createColumnHelper<{id: number; name: string}>()
      const columns = [
        columnHelper.column({
          header: 'Name',
          field: 'name',
          width: 200,
        }),
      ]

      expect(getGridTemplateFromColumns(columns)).toEqual(['200px'])
    })

    it('correctly sets min-widths for the column', () => {
      const columnHelper = createColumnHelper<{id: number; name: string}>()
      const columns: Record<string, Column<{id: number; name: string}>[]> = {
        grow: [
          columnHelper.column({
            header: 'Name',
            field: 'name',
            width: 'grow',
            minWidth: '42ch',
          }),
        ],
        growCollapse: [
          columnHelper.column({
            header: 'Name',
            field: 'name',
            width: 'growCollapse',
            minWidth: '42ch',
          }),
        ],
        auto: [
          columnHelper.column({
            header: 'Name',
            field: 'name',
            width: 'auto',
            minWidth: '42ch',
          }),
        ],
      }
      const expectedWidths: Record<string, string> = {
        grow: 'minmax(42ch, 1fr)',
        growCollapse: 'minmax(42ch, 1fr)',
        auto: 'minmax(42ch, auto)',
      }

      for (const widthOpt in columns) {
        expect(getGridTemplateFromColumns(columns[widthOpt])).toEqual([expectedWidths[widthOpt]])
      }
    })

    it('correctly sets max-widths for the column', () => {
      const columnHelper = createColumnHelper<{id: number; name: string}>()
      const columns: Record<string, Column<{id: number; name: string}>[]> = {
        grow: [
          columnHelper.column({
            header: 'Name',
            field: 'name',
            width: 'grow',
            maxWidth: '42ch',
          }),
        ],
        growCollapse: [
          columnHelper.column({
            header: 'Name',
            field: 'name',
            width: 'growCollapse',
            maxWidth: '42ch',
          }),
        ],
        auto: [
          columnHelper.column({
            header: 'Name',
            field: 'name',
            width: 'auto',
            maxWidth: '42ch',
          }),
        ],
      }
      const expectedWidths: Record<string, string> = {
        grow: 'minmax(auto, 42ch)',
        growCollapse: 'minmax(0, 42ch)',
        auto: 'minmax(auto, 42ch)',
      }

      for (const widthOpt in columns) {
        expect(getGridTemplateFromColumns(columns[widthOpt])).toEqual([expectedWidths[widthOpt]])
      }
    })

    it('sets a custom property style to define the column grid template', () => {
      const columnHelper = createColumnHelper<{id: number; name: string}>()
      const columns = [
        columnHelper.column({
          header: 'Name',
          field: 'name',
        }),
      ]
      const data = [
        {
          id: 1,
          name: 'one',
        },
      ]
      render(<DataTable data={data} columns={columns} />)

      expect(screen.getByRole('table')).toHaveStyle({
        '--grid-template-columns': 'minmax(max-content, 1fr)',
      } as Partial<CSSStyleDeclaration>)
    })
  })

  it('overrides row.id with result of getRowId function', () => {
    const data = [
      {id: 1, name: 'Sabine', _uid: 'abc123'},
      {id: 2, name: 'The Matador', _uid: 'abc12334'},
    ]

    const getRowId = (row: {id: number; name: string; _uid: string}) => row._uid

    const {result} = renderHook(() =>
      useTable({
        data,
        columns: [],
        getRowId,
      }),
    )

    expect(result.current.rows[0].id).toBe('abc123')
    expect(result.current.rows[1].id).toBe('abc12334')
  })

  it('uses default row.id when getRowId is not provided', () => {
    const data = [
      {id: 1, name: 'Sabine', _uid: 'abc123'},
      {id: 2, name: 'The Matador', _uid: 'abc12334'},
    ]

    const getRowId = (row: {id: number; name: string; _uid: string}) => row.id

    const {result} = renderHook(() =>
      useTable({
        data,
        columns: [],
        getRowId,
      }),
    )

    expect(result.current.rows[0].id).toBe('1')
    expect(result.current.rows[1].id).toBe('2')
  })
})
