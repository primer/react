import {act, cleanup, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {Button} from '../Button'
import {
  DataTable,
  Table,
  type Column,
  type DataTableBulkActionsContext,
  type DataTableData,
  type DataTableRowId,
} from './index'

interface Row {
  id: DataTableRowId
  name: string
  team?: string
}

const rows: Row[] = [
  {id: 1, name: 'Beta'},
  {id: '1', name: 'Alpha'},
  {id: 3, name: 'Gamma'},
]
const columns: Column<Row>[] = [{header: 'Name', field: 'name', rowHeader: true, sortBy: true}]
const groupedRows: DataTableData<Row> = [
  {id: 'solo', name: 'Solo'},
  {
    groupId: 'internal',
    label: 'Internal',
    rows: [
      {id: 'b', name: 'Bravo', team: 'Core'},
      {id: 'a', name: 'Alfa', team: 'Docs'},
    ],
  },
  {groupId: 2, label: 'Public', rows: [{id: 'c', name: 'Charlie', team: 'Web'}]},
]
const groupedColumns: Column<Row>[] = [
  {header: 'Name', field: 'name', rowHeader: true, sortBy: true},
  {header: 'Team', field: 'team'},
]

function isDisabled(element: HTMLElement) {
  return element.hasAttribute('data-disabled')
}

function renderActions({selectedCount, clearSelection}: DataTableBulkActionsContext) {
  return <Button onClick={clearSelection}>Apply to {selectedCount}</Button>
}

afterEach(cleanup)

describe('DataTable sortable headers', () => {
  it('names the sort button by its column and describes the action', async () => {
    const user = userEvent.setup()
    render(<DataTable data={rows} columns={columns} />)
    const button = screen.getByRole('button', {name: 'Name'})
    expect(button).toHaveAttribute('data-component', 'Table.SortHeader.Button')
    expect(button).toHaveAccessibleDescription('Sort ascending')
    expect(button.closest('th')).toHaveAttribute('data-component', 'Table.SortHeader')
    await user.click(button)
    expect(screen.getByRole('columnheader', {name: 'Name'})).toHaveAttribute('aria-sort', 'ascending')
    expect(button).toHaveAccessibleDescription('Sort descending')
    await user.click(button)
    expect(screen.getByRole('columnheader', {name: 'Name'})).toHaveAttribute('aria-sort', 'descending')
    expect(button).toHaveAccessibleDescription('Sort ascending')
  })
})

describe('DataTable row selection', () => {
  it('supports uncontrolled selection with string and numeric ids', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(<DataTable data={rows} columns={columns} rowSelection onSelectionChange={onSelectionChange} />)
    const beta = screen.getByRole('checkbox', {name: 'Select Beta'})
    const alpha = screen.getByRole('checkbox', {name: 'Select Alpha'})
    await user.click(beta)
    expect(beta).toBeChecked()
    expect(alpha).not.toBeChecked()
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set([1])})
    await user.click(alpha)
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set([1, '1'])})
    expect(screen.getByRole('checkbox', {name: 'Select rows'})).toBePartiallyChecked()
  })

  it('requests immutable updates in controlled mode', async () => {
    const user = userEvent.setup()
    const selectedRows = new Set<DataTableRowId>([3])
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowSelection
        selectedRows={selectedRows}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole('checkbox', {name: 'Select Beta'}))
    expect(screen.getByRole('checkbox', {name: 'Select Beta'})).not.toBeChecked()
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set([3, 1])})
    expect(selectedRows).toEqual(new Set([3]))
  })

  it('selects remaining rows from a mixed state and clears from an all-selected state', async () => {
    const user = userEvent.setup()
    render(<DataTable data={rows} columns={columns} rowSelection defaultSelectedRows={new Set([3])} />)
    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})
    expect(selectAll).toHaveAccessibleDescription('Select all 3 rows')
    expect(selectAll).toBePartiallyChecked()
    await user.click(selectAll)
    expect(selectAll).toBeChecked()
    expect(screen.getAllByRole('checkbox', {name: /^Select (Alpha|Beta|Gamma)$/}).every(box => box.ariaChecked)).toBe(
      true,
    )
    await user.click(selectAll)
    expect(selectAll).not.toBeChecked()
    for (const name of ['Alpha', 'Beta', 'Gamma']) {
      expect(screen.getByRole('checkbox', {name: `Select ${name}`})).not.toBeChecked()
    }
  })

  it('excludes non-selectable and missing rows while retaining their ids', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowSelection
        selectedRows={new Set<DataTableRowId>([1, 3, 'missing'])}
        isRowSelectable={row => row.id !== 3}
        onSelectionChange={onSelectionChange}
      />,
    )
    const gamma = screen.getByRole('checkbox', {name: 'Select Gamma'})
    expect(isDisabled(gamma)).toBe(true)
    expect(gamma).not.toBeChecked()
    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})
    expect(selectAll).toHaveAccessibleDescription('Select all 2 rows')
    expect(selectAll).toBePartiallyChecked()
    await user.click(selectAll)
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set<DataTableRowId>([1, 3, 'missing', '1'])})
  })

  it('keeps a disabled selection column when no rows are selectable', () => {
    render(<DataTable data={rows} columns={columns} rowSelection isRowSelectable={() => false} />)
    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})
    expect(isDisabled(selectAll)).toBe(true)
    expect(selectAll).not.toHaveAttribute('aria-description')
  })

  it('selects only the current page when pagination replaces the data', async () => {
    const user = userEvent.setup()
    const allRows = Array.from({length: 4}, (_, index) => ({id: index, name: `Row ${index}`}))
    function PaginatedTable() {
      const [pageIndex, setPageIndex] = React.useState(0)
      const [selectedRows, setSelectedRows] = React.useState<ReadonlySet<DataTableRowId>>(() => new Set())
      return (
        <>
          <DataTable
            data={allRows.slice(pageIndex * 2, pageIndex * 2 + 2)}
            columns={columns}
            rowSelection
            selectedRows={selectedRows}
            onSelectionChange={details => setSelectedRows(details.selectedRows)}
          />
          <output>{[...selectedRows].join(',')}</output>
          <button type="button" onClick={() => setPageIndex(1)}>
            Next
          </button>
        </>
      )
    }
    render(<PaginatedTable />)
    await user.click(screen.getByRole('checkbox', {name: 'Select rows'}))
    expect(screen.getByRole('status')).toHaveTextContent('0,1')
    await user.click(screen.getByRole('button', {name: 'Next'}))
    expect(screen.getByRole('checkbox', {name: 'Select rows'})).not.toBeChecked()
    await user.click(screen.getByRole('checkbox', {name: 'Select rows'}))
    expect(screen.getByRole('status')).toHaveTextContent('0,1,2,3')
  })

  it('falls back to row ids when no column is a row header', () => {
    render(<DataTable data={rows} columns={[{header: 'Name', field: 'name'}]} rowSelection />)
    expect(screen.getByRole('checkbox', {name: 'Select row 3'})).toBeInTheDocument()
  })

  it('does not render selection controls unless enabled', () => {
    render(<DataTable data={rows} columns={columns} selectedRows={new Set([1])} />)
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.getByRole('table').style.getPropertyValue('--grid-template-columns')).toBe('minmax(max-content, 1fr)')
  })

  it('adds a min-content selection track to the grid template', () => {
    render(<DataTable data={rows} columns={columns} rowSelection />)
    expect(screen.getByRole('table').style.getPropertyValue('--grid-template-columns')).toBe(
      'min-content minmax(max-content, 1fr)',
    )
  })
})

describe('DataTable row groups', () => {
  it('renders rows and groups as sibling bodies in order', () => {
    const {container} = render(<DataTable data={groupedRows} columns={groupedColumns} />)
    const bodies = [...container.querySelectorAll('tbody')]
    expect(bodies.map(body => body.getAttribute('data-component') ?? 'Table.Body')).toEqual([
      'Table.Body',
      'Table.Group',
      'Table.Group.Body',
      'Table.Group',
      'Table.Group.Body',
    ])
    const header = screen.getByRole('columnheader', {name: /^Internal\s*,\s*2\s*rows$/})
    expect(header).toHaveAttribute('scope', 'colgroup')
    expect(header).toHaveAttribute('colspan', '2')
    expect(screen.getByRole('columnheader', {name: /^Public\s*,\s*1\s*row$/})).toBeInTheDocument()
  })

  it('associates grouped cells with their group, row and column headers', () => {
    render(<DataTable data={groupedRows} columns={groupedColumns} />)
    const groupHeader = screen.getByRole('columnheader', {name: /^Internal\s*,\s*2\s*rows$/})
    const nameHeader = screen.getByRole('columnheader', {name: 'Name'})
    const teamHeader = screen.getByRole('columnheader', {name: 'Team'})
    const rowHeader = screen.getByRole('rowheader', {name: 'Bravo'})
    expect(rowHeader).toHaveAttribute('headers', `${groupHeader.id} ${nameHeader.id}`)
    expect(screen.getByRole('cell', {name: 'Core'})).toHaveAttribute(
      'headers',
      `${groupHeader.id} ${rowHeader.id} ${teamHeader.id}`,
    )
    expect(screen.getByRole('rowheader', {name: 'Solo'})).toHaveAttribute('headers', nameHeader.id)
  })

  it('does not add header associations to ungrouped tables', () => {
    const {container} = render(<DataTable data={rows} columns={columns} />)
    expect(container.querySelector('th[id], [headers]')).toBeNull()
  })

  it('sorts each row run and group independently while preserving group order', async () => {
    const user = userEvent.setup()
    render(<DataTable data={groupedRows} columns={groupedColumns} />)
    await user.click(screen.getByRole('button', {name: 'Name'}))
    expect(screen.getAllByRole('rowheader').map(cell => cell.textContent)).toEqual(['Solo', 'Alfa', 'Bravo', 'Charlie'])
    await user.click(screen.getByRole('button', {name: 'Name'}))
    expect(screen.getAllByRole('rowheader').map(cell => cell.textContent)).toEqual(['Solo', 'Bravo', 'Alfa', 'Charlie'])
  })

  it('preserves grouped row order when sorting is external', async () => {
    const user = userEvent.setup()
    render(<DataTable data={groupedRows} columns={groupedColumns} externalSorting />)
    await user.click(screen.getByRole('button', {name: 'Name'}))
    expect(screen.getAllByRole('rowheader').map(cell => cell.textContent)).toEqual(['Solo', 'Bravo', 'Alfa', 'Charlie'])
  })

  it('renders empty groups and localized group names', () => {
    render(
      <DataTable
        data={[{groupId: 'empty', label: 'Empty', 'aria-label': 'Empty repositories', rows: []}]}
        columns={columns}
        collapsibleGroups
      />,
    )
    expect(screen.getByRole('button', {name: 'Empty repositories'})).toHaveAccessibleDescription('0 rows')
  })

  it('infers the row type from mixed rows and groups', () => {
    render(
      <DataTable
        data={[
          {id: 1, title: 'One'},
          {groupId: 'g', label: 'Group', rows: [{id: 2, title: 'Two'}]},
        ]}
        columns={[{id: 'title', header: 'Title', renderCell: row => row.title.toUpperCase(), rowHeader: true}]}
      />,
    )
    expect(screen.getByRole('rowheader', {name: 'TWO'})).toBeInTheDocument()
  })
})

describe('DataTable group expansion', () => {
  it('leaves groups expanded without controls unless enabled', () => {
    render(<DataTable data={groupedRows} columns={groupedColumns} />)
    expect(screen.queryByRole('button', {name: 'Internal'})).not.toBeInTheDocument()
    expect(screen.getByRole('rowheader', {name: 'Bravo'})).toBeVisible()
  })

  it('defaults to expanded groups and toggles string and numeric ids', async () => {
    const user = userEvent.setup()
    const onExpandedGroupsChange = vi.fn()
    render(
      <DataTable
        data={groupedRows}
        columns={groupedColumns}
        collapsibleGroups
        onExpandedGroupsChange={onExpandedGroupsChange}
      />,
    )
    const internal = screen.getByRole('button', {name: 'Internal'})
    expect(internal).toHaveAttribute('aria-expanded', 'true')
    expect(internal).toHaveAccessibleDescription('2 rows')
    await user.click(internal)
    expect(internal).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById(internal.getAttribute('aria-controls')!)).toHaveAttribute('hidden')
    expect(onExpandedGroupsChange).toHaveBeenLastCalledWith({expandedGroups: new Set([2])})
    await user.click(screen.getByRole('button', {name: 'Public'}))
    expect(onExpandedGroupsChange).toHaveBeenLastCalledWith({expandedGroups: new Set()})
  })

  it('requests controlled changes without changing the displayed state', async () => {
    const user = userEvent.setup()
    const onExpandedGroupsChange = vi.fn()
    render(
      <DataTable
        data={groupedRows}
        columns={groupedColumns}
        collapsibleGroups
        expandedGroups={new Set(['internal'])}
        onExpandedGroupsChange={onExpandedGroupsChange}
      />,
    )
    expect(screen.getByRole('button', {name: 'Public'})).toHaveAttribute('aria-expanded', 'false')
    await user.click(screen.getByRole('button', {name: 'Public'}))
    expect(onExpandedGroupsChange).toHaveBeenLastCalledWith({expandedGroups: new Set<DataTableRowId>(['internal', 2])})
    expect(screen.getByRole('button', {name: 'Public'})).toHaveAttribute('aria-expanded', 'false')
  })

  it('includes collapsed members in select-all', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={groupedRows}
        columns={groupedColumns}
        rowSelection
        collapsibleGroups
        defaultExpandedGroups={new Set()}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole('checkbox', {name: 'Select rows'}))
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set(['solo', 'b', 'a', 'c'])})
    expect(screen.getByRole('button', {name: 'Internal'})).toHaveAttribute('aria-expanded', 'false')
  })

  it('restores focus to the disclosure when a controlled collapse hides the focused member', () => {
    const props = {data: groupedRows, columns: groupedColumns, rowSelection: true, collapsibleGroups: true}
    const {rerender} = render(<DataTable {...props} expandedGroups={new Set<DataTableRowId>(['internal'])} />)
    act(() => screen.getByRole('checkbox', {name: 'Select Bravo'}).focus())
    rerender(<DataTable {...props} expandedGroups={new Set()} />)
    expect(screen.getByRole('button', {name: 'Internal'})).toHaveFocus()
  })
})

describe('DataTable group selection', () => {
  it('requires both row selection and collapsible groups', () => {
    const {rerender} = render(<DataTable data={groupedRows} columns={groupedColumns} rowSelection />)
    expect(screen.queryByRole('checkbox', {name: 'Select Internal'})).not.toBeInTheDocument()
    rerender(<DataTable data={groupedRows} columns={groupedColumns} collapsibleGroups />)
    expect(screen.queryByRole('checkbox', {name: 'Select Internal'})).not.toBeInTheDocument()
    rerender(<DataTable data={groupedRows} columns={groupedColumns} rowSelection collapsibleGroups />)
    expect(screen.getByRole('checkbox', {name: 'Select Internal'})).toBeInTheDocument()
  })

  it('selects only selectable members and preserves other selections', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={groupedRows}
        columns={groupedColumns}
        rowSelection
        collapsibleGroups
        defaultSelectedRows={new Set(['solo'])}
        isRowSelectable={row => row.id !== 'a'}
        onSelectionChange={onSelectionChange}
      />,
    )
    const group = screen.getByRole('checkbox', {name: 'Select Internal'})
    await user.click(group)
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set(['solo', 'b'])})
    expect(group).toBeChecked()
    await user.click(group)
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set(['solo'])})
  })

  it('shows partial group selection and disables groups without selectable rows', () => {
    render(
      <DataTable
        data={groupedRows}
        columns={groupedColumns}
        rowSelection
        collapsibleGroups
        defaultSelectedRows={new Set(['b'])}
        isRowSelectable={row => row.id !== 'c'}
      />,
    )
    expect(screen.getByRole('checkbox', {name: 'Select Internal'})).toBePartiallyChecked()
    expect(isDisabled(screen.getByRole('checkbox', {name: 'Select Public'}))).toBe(true)
  })
})

describe('DataTable bulk actions', () => {
  it('uses effective ids and counts', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(
      <DataTable
        data={[rows[0], {groupId: 'other', label: 'Other', rows: rows.slice(1)}]}
        columns={columns}
        rowSelection
        defaultSelectedRows={new Set<DataTableRowId>([1, '1', 3, 'missing'])}
        isRowSelectable={row => row.id !== 3}
        renderBulkActions={({selectedRows, selectedCount}) => (
          <Button onClick={() => onAction({selectedRows, selectedCount})}>Archive</Button>
        )}
      />,
    )
    expect(screen.getByText('2 selected')).toBeVisible()
    expect(screen.getByRole('group', {name: 'Bulk actions'})).toHaveAttribute('data-component', 'Table.BulkActions')
    await user.click(screen.getByRole('button', {name: 'Archive'}))
    expect(onAction).toHaveBeenLastCalledWith({selectedRows: new Set<DataTableRowId>([1, '1']), selectedCount: 2})
  })

  it('preserves column names and sort state while replacing sorting controls', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowSelection
        defaultSelectedRows={new Set([1])}
        renderBulkActions={renderActions}
      />,
    )
    expect(screen.queryByRole('button', {name: 'Name'})).not.toBeInTheDocument()
    expect(screen.getByRole('columnheader', {name: 'Name'})).toBeInTheDocument()
    await user.click(screen.getByRole('button', {name: 'Apply to 1'}))
    await user.click(screen.getByRole('button', {name: 'Name'}))
    expect(screen.getByRole('columnheader', {name: 'Name'})).toHaveAttribute('aria-sort', 'ascending')
    await user.click(screen.getByRole('checkbox', {name: 'Select rows'}))
    expect(screen.getByRole('columnheader', {name: 'Name'})).toHaveAttribute('aria-sort', 'ascending')
    expect(screen.queryByRole('button', {name: 'Name'})).not.toBeInTheDocument()
  })

  it('names custom headers through hidden labels', () => {
    render(
      <DataTable
        data={rows}
        columns={[{header: () => <em>Custom</em>, field: 'name', rowHeader: true}]}
        rowSelection
        defaultSelectedRows={new Set([1])}
        renderBulkActions={renderActions}
      />,
    )
    expect(screen.getByRole('columnheader', {name: 'Custom'})).toBeInTheDocument()
  })

  it('does not render actions without selection enabled or effectively selected rows', () => {
    const renderer = vi.fn(renderActions)
    const {rerender} = render(
      <DataTable data={rows} columns={columns} selectedRows={new Set([1])} renderBulkActions={renderer} />,
    )
    expect(renderer).not.toHaveBeenCalled()
    rerender(
      <DataTable
        data={rows}
        columns={columns}
        rowSelection
        selectedRows={new Set(['missing'])}
        renderBulkActions={renderer}
      />,
    )
    expect(renderer).not.toHaveBeenCalled()
    expect(screen.queryByRole('group', {name: 'Bulk actions'})).not.toBeInTheDocument()
    expect(screen.getByText('0 selected')).toBeInTheDocument()
  })

  it('returns focus to the select-all checkbox when a focused action disappears', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowSelection
        defaultSelectedRows={new Set([1])}
        renderBulkActions={renderActions}
      />,
    )
    await user.click(screen.getByRole('button', {name: 'Apply to 1'}))
    expect(screen.getByRole('checkbox', {name: 'Select rows'})).toHaveFocus()
  })

  it('returns focus to the table when no rows remain', async () => {
    const user = userEvent.setup()
    function DeletingTable() {
      const [data, setData] = React.useState(rows)
      return (
        <DataTable
          aria-label="Rows"
          data={data}
          columns={columns}
          rowSelection
          defaultSelectedRows={new Set<DataTableRowId>([1, '1', 3])}
          renderBulkActions={() => <Button onClick={() => setData([])}>Delete</Button>}
        />
      )
    }
    render(<DeletingTable />)
    await user.click(screen.getByRole('button', {name: 'Delete'}))
    expect(screen.getByRole('table', {name: 'Rows'})).toHaveFocus()
  })

  it('allows a consumer-selected recovery target', async () => {
    const user = userEvent.setup()
    function TableWithTarget() {
      const targetRef = React.useRef<HTMLButtonElement>(null)
      return (
        <>
          <button ref={targetRef} type="button">
            Target
          </button>
          <DataTable
            data={rows}
            columns={columns}
            rowSelection
            defaultSelectedRows={new Set([1])}
            renderBulkActions={renderActions}
            bulkActionsReturnFocusRef={targetRef}
          />
        </>
      )
    }
    render(<TableWithTarget />)
    await user.click(screen.getByRole('button', {name: 'Apply to 1'}))
    expect(screen.getByRole('button', {name: 'Target'})).toHaveFocus()
  })

  it('supports localized labels', () => {
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowSelection
        defaultSelectedRows={new Set([1, 3])}
        renderBulkActions={renderActions}
        bulkActionsProps={{'aria-label': 'Acciones', getSelectedCountLabel: count => `${count} seleccionadas`}}
      />,
    )
    expect(screen.getByRole('group', {name: 'Acciones'})).toBeInTheDocument()
    expect(screen.getByText('2 seleccionadas')).toBeInTheDocument()
  })
})

describe('Table parts', () => {
  it('renders a presentational group with associations, selection and expansion', async () => {
    const user = userEvent.setup()
    const onToggleSelect = vi.fn()
    const onExpandedChange = vi.fn()
    const {container} = render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header id="name">Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Group
          id="group"
          label="Group"
          rowCount={1}
          colSpan={1}
          collapsible
          defaultExpanded={false}
          selection="some"
          onToggleSelect={onToggleSelect}
          onExpandedChange={onExpandedChange}
        >
          <Table.Row>
            <Table.Cell headers="name">Member</Table.Cell>
          </Table.Row>
        </Table.Group>
      </Table>,
    )
    const header = container.querySelector<HTMLElement>('[data-component="Table.Group.Header"]')!
    expect(screen.getByText('Member', {selector: 'td'})).toHaveAttribute('headers', `${header.id} name`)
    expect(container.querySelector('[data-component="Table.Group.Body"]')).toHaveAttribute('hidden')
    const checkbox = screen.getByRole('checkbox', {name: 'Select Group'})
    expect(checkbox).toBePartiallyChecked()
    await user.click(checkbox)
    expect(onToggleSelect).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', {name: 'Group'}))
    expect(onExpandedChange).toHaveBeenLastCalledWith({expanded: true})
    expect(screen.getByRole('button', {name: 'Group'})).toHaveAttribute('aria-expanded', 'true')
  })

  it('disables group selection without a callback', () => {
    render(
      <Table>
        <Table.Group id="group" label="Group" rowCount={0} colSpan={1} selection="none" />
      </Table>,
    )
    expect(isDisabled(screen.getByRole('checkbox', {name: 'Select Group'}))).toBe(true)
  })

  it('does not leak group associations into nested tables', () => {
    render(
      <Table>
        <Table.Group id="group" label="Group" rowCount={1} colSpan={1}>
          <Table.Row>
            <Table.Cell>
              <Table>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Nested</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Table.Cell>
          </Table.Row>
        </Table.Group>
      </Table>,
    )
    expect(screen.getByText('Nested')).not.toHaveAttribute('headers')
  })

  it('renders selection parts with labels from row headers', async () => {
    const user = userEvent.setup()
    const onToggleSelect = vi.fn()
    const checkboxRef = React.createRef<HTMLElement>()
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.SelectionHeader selection="none" checkboxRef={checkboxRef} />
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.RowSelection selected={false} aria-labelledby="row" onToggleSelect={onToggleSelect} />
            <Table.Cell id="row" scope="row">
              Repository
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )
    expect(checkboxRef.current).toBe(screen.getByRole('checkbox', {name: 'Select rows'}))
    await user.click(screen.getByRole('checkbox', {name: 'Select Repository'}))
    expect(onToggleSelect).toHaveBeenCalledTimes(1)
  })

  it('forwards bulk action root attributes and ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Table.BulkActions ref={ref} selectedCount={1} className="custom" data-testid="actions">
        <button type="button">Act</button>
      </Table.BulkActions>,
    )
    expect(ref.current).toBe(screen.getByTestId('actions'))
    expect(ref.current).toHaveClass('custom')
    expect(within(ref.current!).getByRole('button', {name: 'Act'})).toBeInTheDocument()
  })
})
