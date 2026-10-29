import {render} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {DataTable} from '../../DataTable'
import type {Column} from '../column'
import type {DataTableData, DataTableRowId} from '../row'

type Row = {id: DataTableRowId; name: string}

const columns: Array<Column<Row>> = [{header: 'Name', field: 'name', rowHeader: true}]
const data: DataTableData<Row> = [
  {id: 'standalone', name: 'Standalone'},
  {
    groupId: 'public',
    label: 'Public',
    rows: [
      {id: 1, name: 'Alpha'},
      {id: '1', name: 'Beta'},
      {id: 2, name: 'Disabled'},
    ],
  },
  {groupId: 'private', label: 'Private', rows: [{id: 3, name: 'Gamma'}]},
  {groupId: 'empty', label: 'Empty', rows: []},
]

describe('DataTable group selection', () => {
  it('selects only selectable members, including collapsed rows, and preserves other selections', async () => {
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={data}
        columns={columns}
        rowSelection
        collapsibleGroups
        defaultSelectedRows={new Set<DataTableRowId>(['standalone', 3, 'off-page'])}
        isRowSelectable={row => row.id !== 2}
        onSelectionChange={onSelectionChange}
      />,
    )
    const group = page.getByRole('checkbox', {name: 'Select Public', exact: true})
    const disclosure = page.getByRole('button', {name: 'Public', exact: true})
    const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})

    await expect.element(group).not.toBeChecked()
    await userEvent.click(page.getByRole('checkbox', {name: 'Select Alpha', exact: true}))
    await expect.element(group).toBePartiallyChecked()
    await userEvent.click(disclosure)
    await userEvent.tab({shift: true})
    await expect.element(group).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect.element(group).toBeChecked()
    await expect.element(group).toHaveFocus()
    await expect.element(selectAll).toBeChecked()
    await expect.element(disclosure).toHaveAttribute('aria-expanded', 'false')
    expect(onSelectionChange).toHaveBeenLastCalledWith({
      selectedRows: new Set<DataTableRowId>(['standalone', 3, 'off-page', 1, '1']),
    })

    await userEvent.click(disclosure)
    await expect.element(page.getByRole('checkbox', {name: 'Select Beta', exact: true})).toBeChecked()
    await expect.element(page.getByRole('checkbox', {name: 'Select Disabled', exact: true})).not.toBeChecked()
    await userEvent.click(group)
    await expect.element(group).not.toBeChecked()
    await expect.element(selectAll).toBePartiallyChecked()
    expect(onSelectionChange).toHaveBeenLastCalledWith({
      selectedRows: new Set<DataTableRowId>(['standalone', 3, 'off-page']),
    })
  })

  it('requests immutable controlled updates using custom row IDs and group names', async () => {
    const selectedRows = new Set<DataTableRowId>(['Alpha', 'off-page'])
    const onSelectionChange = vi.fn()
    const props = {
      data: [{groupId: 'public', label: 'Public', 'aria-label': 'Public repositories', rows: [{id: 1, name: 'Alpha'}]}],
      columns,
      rowSelection: true,
      collapsibleGroups: true,
      getRowId: (row: Row) => row.name,
      onSelectionChange,
    }
    const {rerender} = render(<DataTable {...props} selectedRows={selectedRows} />)
    const group = page.getByRole('checkbox', {name: 'Select Public repositories', exact: true})
    await userEvent.click(group)
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set(['off-page'])})
    expect(selectedRows).toEqual(new Set(['Alpha', 'off-page']))
    await expect.element(group).toBeChecked()
    rerender(<DataTable {...props} selectedRows={new Set(['off-page'])} />)
    await expect.element(group).not.toBeChecked()
  })

  it('disables empty and unselectable groups and requires both selection and collapse controls', async () => {
    const {rerender} = render(
      <DataTable data={data} columns={columns} rowSelection collapsibleGroups isRowSelectable={() => false} />,
    )
    for (const name of ['Public', 'Private', 'Empty']) {
      const checkbox = page.getByRole('checkbox', {name: `Select ${name}`, exact: true})
      await expect.element(checkbox).toBeDisabled()
      await expect.element(checkbox).not.toBeChecked()
    }
    rerender(<DataTable data={data} columns={columns} rowSelection />)
    await expect.element(page.getByRole('checkbox', {name: 'Select Public', exact: true})).not.toBeInTheDocument()
    rerender(<DataTable data={data} columns={columns} collapsibleGroups />)
    await expect.element(page.getByRole('checkbox')).not.toBeInTheDocument()
  })
})
