import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, {act} from 'react'
import {hydrateRoot, type Root} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {describe, expect, it, vi} from 'vitest'
import {DataTable, Table} from '../../DataTable'
import type {Column} from '../column'
import type {DataTableData, DataTableRowGroup} from '../row'
import classes from '../Table.module.css'
import {implementsClassName} from '../../utils/testing'

interface Row {
  id: string | number
  name: string
}

const columns: Array<Column<Row>> = [
  {
    header: 'Name',
    field: 'name',
    rowHeader: true,
    sortBy: true,
  },
]

const data: Array<Row> = [
  {id: 1, name: 'Beta'},
  {id: 2, name: 'Alpha'},
  {id: '1', name: 'Gamma'},
]

describe('DataTable row selection', () => {
  implementsClassName(
    props => (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.SelectionHeader checked={false} {...props} />
          </Table.Row>
        </Table.Head>
      </Table>
    ),
    classes.TableSelectionHeader,
  )

  it('supports uncontrolled row selection and preserves string and numeric IDs', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={data}
        columns={columns}
        rowSelection
        defaultSelectedRows={new Set([1])}
        onSelectionChange={onSelectionChange}
      />,
    )

    expect(screen.getByRole('checkbox', {name: 'Select Beta'})).toBeChecked()
    expect(screen.getByRole('checkbox', {name: 'Select Gamma'})).not.toBeChecked()

    await user.click(screen.getByRole('checkbox', {name: 'Select Gamma'}))

    expect(screen.getByRole('checkbox', {name: 'Select Gamma'})).toBeChecked()
    const selectedRows = onSelectionChange.mock.lastCall?.[0].selectedRows
    expect(selectedRows).toEqual(new Set<string | number>([1, '1']))
    expect(selectedRows).not.toBe(data)
  })

  it('requests immutable updates in controlled mode', async () => {
    const user = userEvent.setup()
    const selectedRows = new Set<string | number>([1])
    const onSelectionChange = vi.fn()
    const {rerender} = render(
      <DataTable
        data={data}
        columns={columns}
        rowSelection
        selectedRows={selectedRows}
        onSelectionChange={onSelectionChange}
      />,
    )

    await user.click(screen.getByRole('checkbox', {name: 'Select Alpha'}))

    const nextSelectedRows = onSelectionChange.mock.lastCall?.[0].selectedRows
    expect(nextSelectedRows).toEqual(new Set<string | number>([1, 2]))
    expect(nextSelectedRows).not.toBe(selectedRows)
    expect(selectedRows).toEqual(new Set([1]))
    expect(screen.getByRole('checkbox', {name: 'Select Alpha'})).not.toBeChecked()

    rerender(
      <DataTable
        data={data}
        columns={columns}
        rowSelection
        selectedRows={nextSelectedRows}
        onSelectionChange={onSelectionChange}
      />,
    )
    expect(screen.getByRole('checkbox', {name: 'Select Alpha'})).toBeChecked()
  })

  it.each(['flat', 'grouped', 'mixed'] as const)('round-trips successive controlled selections (%s)', async mode => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    const groups: Array<DataTableRowGroup<Row>> = [
      {groupId: 'first', label: 'First', rows: data.slice(0, 1)},
      {groupId: 'second', label: 'Second', rows: data.slice(1)},
    ]
    const rows: DataTableData<Row> = mode === 'flat' ? data : mode === 'grouped' ? groups : [data[0], groups[1]]
    function ControlledTable() {
      const [selectedRows, setSelectedRows] = React.useState<ReadonlySet<string | number>>(() => new Set())
      return (
        <DataTable
          data={rows}
          columns={columns}
          rowSelection
          selectedRows={selectedRows}
          onSelectionChange={event => {
            onSelectionChange(event)
            setSelectedRows(event.selectedRows)
          }}
        />
      )
    }
    render(<ControlledTable />)
    const beta = screen.getByRole('checkbox', {name: 'Select Beta'})
    const alpha = screen.getByRole('checkbox', {name: 'Select Alpha'})
    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})

    await user.click(beta)
    expect(beta).toBeChecked()
    await user.click(beta)
    expect(beta).not.toBeChecked()
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set()})

    await user.click(beta)
    await user.click(alpha)
    expect(beta).toBeChecked()
    expect(alpha).toBeChecked()
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set([1, 2])})

    await user.click(selectAll)
    expect(selectAll).toBeChecked()
    await user.click(beta)
    expect(beta).not.toBeChecked()
    expect(alpha).toBeChecked()
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set<string | number>([2, '1'])})
    await user.click(selectAll)
    expect(selectAll).toBeChecked()
    await user.click(selectAll)
    expect(selectAll).not.toBeChecked()
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set()})
  })

  it('uses getRowId as the selection identity', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    interface KeyedRow extends Row {
      key: string
    }
    const rows: Array<KeyedRow> = [
      {id: 1, key: 'beta-key', name: 'Beta'},
      {id: 2, key: 'alpha-key', name: 'Alpha'},
    ]
    const keyedColumns: Array<Column<KeyedRow>> = [
      {
        header: 'Name',
        field: 'name',
        rowHeader: true,
      },
    ]
    render(
      <DataTable
        data={rows}
        columns={keyedColumns}
        rowSelection
        getRowId={row => row.key}
        defaultSelectedRows={new Set(['beta-key'])}
        onSelectionChange={onSelectionChange}
      />,
    )

    expect(screen.getByRole('checkbox', {name: 'Select Beta'})).toBeChecked()
    await user.click(screen.getByRole('checkbox', {name: 'Select Alpha'}))
    expect(onSelectionChange).toHaveBeenLastCalledWith({
      selectedRows: new Set(['beta-key', 'alpha-key']),
    })
  })

  it('selects remaining rows from a mixed state and clears all selected rows from an all-selected state', async () => {
    const user = userEvent.setup()
    render(<DataTable data={data} columns={columns} rowSelection defaultSelectedRows={new Set([1])} />)

    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})
    expect(selectAll).not.toBeChecked()
    expect(selectAll).toHaveProperty('indeterminate', true)
    expect(selectAll).toHaveAccessibleDescription('Select all 3 rows')

    await user.click(selectAll)

    expect(selectAll).toBeChecked()
    expect(selectAll).toHaveProperty('indeterminate', false)
    for (const row of data) {
      expect(screen.getByRole('checkbox', {name: `Select ${row.name}`})).toBeChecked()
    }

    await user.click(selectAll)

    expect(selectAll).not.toBeChecked()
    for (const row of data) {
      expect(screen.getByRole('checkbox', {name: `Select ${row.name}`})).not.toBeChecked()
    }
  })

  it('preserves selection by stable ID through sorting and replacement data references', async () => {
    const user = userEvent.setup()
    const {rerender} = render(
      <DataTable data={data} columns={columns} rowSelection defaultSelectedRows={new Set([1])} />,
    )

    await user.click(screen.getByRole('button', {name: 'Name'}))
    expect(screen.getByRole('checkbox', {name: 'Select Beta'})).toBeChecked()

    rerender(<DataTable data={data.map(row => ({...row}))} columns={columns} rowSelection />)
    expect(screen.getByRole('checkbox', {name: 'Select Beta'})).toBeChecked()
  })

  it('intersects effective selection with current rows without discarding missing IDs', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    const {rerender} = render(
      <DataTable
        data={[data[0]]}
        columns={columns}
        rowSelection
        defaultSelectedRows={new Set<string | number>([1, 99])}
        onSelectionChange={onSelectionChange}
      />,
    )

    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})
    expect(selectAll).toBeChecked()
    expect(selectAll).toHaveAccessibleDescription('Select all 1 row')
    expect(onSelectionChange).not.toHaveBeenCalled()

    await user.click(selectAll)
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set([99])})

    rerender(
      <DataTable
        data={[{id: 99, name: 'Returned'}]}
        columns={columns}
        rowSelection
        onSelectionChange={onSelectionChange}
      />,
    )
    expect(screen.getByRole('checkbox', {name: 'Select Returned'})).toBeChecked()
    expect(onSelectionChange).toHaveBeenCalledTimes(1)
  })

  it('excludes non-selectable rows from selection totals and select-all actions', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={data}
        columns={columns}
        rowSelection
        isRowSelectable={row => row.id !== 2}
        onSelectionChange={onSelectionChange}
      />,
    )

    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})
    expect(selectAll).toHaveAccessibleDescription('Select all 2 rows')
    expect(screen.getByRole('checkbox', {name: 'Select Alpha'})).toBeDisabled()

    await user.click(selectAll)

    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set<string | number>([1, '1'])})
    expect(screen.getByRole('checkbox', {name: 'Select Alpha'})).not.toBeChecked()
  })

  it('keeps a disabled selection column when no rows are selectable', () => {
    render(<DataTable data={data} columns={columns} rowSelection isRowSelectable={() => false} />)

    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})
    expect(selectAll).toBeDisabled()
    expect(selectAll).not.toBeChecked()
    expect(selectAll).toHaveProperty('indeterminate', false)
    expect(selectAll).not.toHaveAccessibleDescription()

    for (const row of data) {
      expect(screen.getByRole('checkbox', {name: `Select ${row.name}`})).toBeDisabled()
    }
  })

  it('selects rows across groups and provides complete grouped header associations', async () => {
    const user = userEvent.setup()
    const groups: Array<DataTableRowGroup<Row>> = [
      {
        groupId: 'first',
        label: 'First',
        rows: data.slice(0, 2),
      },
      {
        groupId: 'second',
        label: 'Second',
        rows: data.slice(2),
      },
    ]
    render(<DataTable data={groups} columns={columns} rowSelection />)

    const selectAllHeader = screen.getByRole('columnheader', {name: 'Select rows'})
    const groupHeader = screen.getByRole('columnheader', {name: /^First\s*, 2 rows$/})
    const betaCheckbox = screen.getByRole('checkbox', {name: 'Select Beta'})
    const selectionCell = betaCheckbox.closest('td')

    expect(selectAllHeader).toBe(screen.getAllByRole('columnheader')[0])
    expect(groupHeader).toHaveAttribute('colspan', '2')
    expect(selectionCell).toHaveAttribute('headers', `${groupHeader.id} ${selectAllHeader.id}`)

    await user.click(screen.getByRole('checkbox', {name: 'Select rows'}))

    for (const row of data) {
      expect(screen.getByRole('checkbox', {name: `Select ${row.name}`})).toBeChecked()
    }
  })

  it('preserves focus on the mounted select-all checkbox', async () => {
    const user = userEvent.setup()
    render(<DataTable data={data} columns={columns} rowSelection />)
    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})

    await user.click(selectAll)

    expect(selectAll).toHaveFocus()
    expect(screen.getByRole('checkbox', {name: 'Select rows'})).toBe(selectAll)
  })

  it('selects all mixed bodies while preserving sorting boundaries and excluding disabled rows', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    const mixed: DataTableData<Row> = [
      ...data.slice(0, 2),
      {groupId: 'group', label: 'Group', rows: [data[2], {id: 3, name: 'Delta'}]},
      {id: 4, name: 'Omega'},
    ]
    const {container} = render(
      <DataTable
        data={mixed}
        columns={columns}
        rowSelection
        isRowSelectable={row => row.id !== 1 && row.id !== 4}
        onSelectionChange={onSelectionChange}
      />,
    )
    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})
    expect(selectAll).toHaveAccessibleDescription('Select all 3 rows')
    await user.click(selectAll)
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set<string | number>([2, '1', 3])})
    expect(screen.getByRole('checkbox', {name: 'Select Beta'})).not.toBeChecked()
    expect(screen.getByRole('checkbox', {name: 'Select Omega'})).toBeDisabled()

    await user.click(screen.getByRole('button', {name: 'Name'}))
    expect(screen.getAllByRole('rowheader').map(header => header.textContent)).toEqual([
      'Alpha',
      'Beta',
      'Delta',
      'Gamma',
      'Omega',
    ])
    expect(selectAll).toBeChecked()
    expect(screen.getByRole('checkbox', {name: 'Select Gamma'})).toBeChecked()
    expectSelectionAssociationsToBeComplete(container)
    const header = screen.getByRole('columnheader', {name: 'Select rows'})
    expect(screen.getByRole('checkbox', {name: 'Select Alpha'}).closest('td')).toHaveAttribute('headers', header.id)
    const groupHeader = screen.getByRole('columnheader', {name: /^Group\s*, 2 rows$/})
    expect(screen.getByRole('checkbox', {name: 'Select Gamma'}).closest('td')).toHaveAttribute(
      'headers',
      `${groupHeader.id} ${header.id}`,
    )
    await user.click(selectAll)
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set()})
  })

  it.each(['flat', 'grouped', 'mixed'] as const)(
    'preserves %s selection associations through hydration',
    async mode => {
      const groups: Array<DataTableRowGroup<Row>> = [
        {
          groupId: 'group',
          label: 'Group',
          rows: data,
        },
      ]
      const rows: DataTableData<Row> =
        mode === 'flat' ? data : mode === 'grouped' ? groups : [data[0], {...groups[0], rows: data.slice(1)}]
      const tables = (
        <>
          <DataTable data={rows} columns={columns} rowSelection />
          <DataTable data={rows} columns={columns} rowSelection />
        </>
      )
      const container = document.createElement('div')
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      container.innerHTML = renderToString(tables)
      document.body.appendChild(container)
      const recoverableErrors: unknown[] = []
      let root: Root | undefined

      try {
        const serverAssociations = getSelectionAssociationGraph(container)
        expectSelectionAssociationsToBeComplete(container)

        await act(async () => {
          root = hydrateRoot(container, tables, {
            onRecoverableError: error => recoverableErrors.push(error),
          })
        })

        expect(recoverableErrors).toEqual([])
        expect(
          consoleErrorSpy.mock.calls.every(([message]) =>
            String(message).includes('useLayoutEffect does nothing on the server'),
          ),
        ).toBe(true)
        expect(getSelectionAssociationGraph(container)).toEqual(serverAssociations)
        expectSelectionAssociationsToBeComplete(container)
      } finally {
        consoleErrorSpy.mockRestore()
        await act(async () => root?.unmount())
        container.remove()
      }
    },
  )

  it('does not render selection controls unless row selection is enabled', () => {
    render(<DataTable data={data} columns={columns} />)

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(columns.length)
    expect(screen.getByRole('table')).toHaveStyle({
      '--grid-template-columns': 'minmax(max-content, 1fr)',
    } as Partial<CSSStyleDeclaration>)
  })
})

function getSelectionAssociationGraph(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      '[data-component="Table.SelectionHeader"], [data-component="Table.RowSelection"], [aria-labelledby]',
    ),
  ).map(element => ({
    id: element.id,
    headers: element.getAttribute('headers'),
    labelledBy: element.getAttribute('aria-labelledby'),
  }))
}

function expectSelectionAssociationsToBeComplete(container: HTMLElement) {
  const allIds = new Set(Array.from(container.querySelectorAll<HTMLElement>('[id]'), element => element.id))

  for (const table of container.querySelectorAll('table')) {
    const selectionHeader = table.querySelector<HTMLElement>('[data-component="Table.SelectionHeader"]')
    expect(selectionHeader?.id).toBeTruthy()

    for (const selectionCell of table.querySelectorAll<HTMLElement>('[data-component="Table.RowSelection"]')) {
      const headerIds = selectionCell.getAttribute('headers')?.split(' ') ?? []
      expect(headerIds).toContain(selectionHeader?.id)
      expect(headerIds.every(id => allIds.has(id))).toBe(true)

      const checkbox = selectionCell.querySelector<HTMLInputElement>('input[type="checkbox"]')
      const labelIds = checkbox?.getAttribute('aria-labelledby')?.split(' ') ?? []
      expect(labelIds.length).toBeGreaterThanOrEqual(2)
      expect(labelIds.every(id => allIds.has(id))).toBe(true)
    }
  }
}

describe('Table selection parts', () => {
  it('renders controlled, composable selection controls with stable identifiers and refs', () => {
    const headerCheckboxRef = React.createRef<HTMLInputElement>()
    const rowCheckboxRef = React.createRef<HTMLInputElement>()
    const onHeaderChange = vi.fn()
    const onRowChange = vi.fn()
    const {container} = render(
      <Table gridTemplateColumns="min-content minmax(0, 1fr)">
        <Table.Head>
          <Table.Row>
            <Table.SelectionHeader
              id="selection"
              checked={false}
              indeterminate
              checkboxRef={headerCheckboxRef}
              onChange={onHeaderChange}
            />
            <Table.Header id="name">Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.RowSelection
              checked
              headers="selection"
              aria-labelledby="row-name"
              checkboxRef={rowCheckboxRef}
              onChange={onRowChange}
            />
            <Table.Cell id="row-name" scope="row" headers="name">
              Primer
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )

    expect(container.querySelector('[data-component="Table.SelectionHeader"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Table.RowSelection"]')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', {name: 'Select rows'})).toHaveProperty('indeterminate', true)
    expect(screen.getByRole('checkbox', {name: 'Select Primer'})).toBeChecked()
    expect(headerCheckboxRef.current).toBe(screen.getByRole('checkbox', {name: 'Select rows'}))
    expect(rowCheckboxRef.current).toBe(screen.getByRole('checkbox', {name: 'Select Primer'}))
    expect(within(screen.getByRole('cell', {name: 'Select Primer'})).getByRole('checkbox')).toHaveAttribute(
      'data-component',
      'Checkbox',
    )
  })
})
