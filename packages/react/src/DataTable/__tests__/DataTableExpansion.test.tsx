import {render, renderHook, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {act} from 'react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {describe, expect, it, vi} from 'vitest'
import {DataTable, Table} from '../../DataTable'
import type {Column} from '../column'
import type {DataTableData, DataTableRowId} from '../row'
import {useTable} from '../useTable'

interface Row {
  id: DataTableRowId
  name: string
}

const columns: Array<Column<Row>> = [{header: 'Name', field: 'name', rowHeader: true, sortBy: true}]
const data: DataTableData<Row> = [
  {id: 'standalone', name: 'Standalone'},
  {
    groupId: 1,
    label: 'First',
    rows: [
      {id: 1, name: 'Beta'},
      {id: 2, name: 'Alpha'},
    ],
  },
  {groupId: '1', label: 'Second', rows: [{id: '1', name: 'Gamma'}]},
  {groupId: 'empty group', label: 'Empty', rows: []},
]

describe('DataTable group expansion', () => {
  it('leaves groups expanded and without controls unless enabled', () => {
    render(<DataTable data={data} columns={columns} expandedGroups={new Set()} />)
    expect(screen.queryByRole('button', {name: 'First'})).not.toBeInTheDocument()
    expect(screen.getByRole('rowheader', {name: 'Beta'})).toBeVisible()
  })

  it('defaults to expanded groups and toggles distinct string and numeric IDs', async () => {
    const user = userEvent.setup()
    const onExpandedGroupsChange = vi.fn()
    const {container} = render(
      <DataTable data={data} columns={columns} collapsibleGroups onExpandedGroupsChange={onExpandedGroupsChange} />,
    )
    const first = screen.getByRole('button', {name: 'First'})
    const second = screen.getByRole('button', {name: 'Second'})
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(first).toHaveAttribute('aria-description', '2 rows')
    const body = container.querySelector(`[id="${first.getAttribute('aria-controls')}"]`)
    expect(body).toHaveAttribute('data-component', 'Table.Group.Body')
    await user.click(first)
    expect(first).toHaveFocus()
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(body).toHaveAttribute('hidden')
    expect(screen.queryByRole('rowheader', {name: 'Beta'})).not.toBeInTheDocument()
    expect(second).toHaveAttribute('aria-expanded', 'true')
    expect(onExpandedGroupsChange).toHaveBeenLastCalledWith({expandedGroups: new Set(['1', 'empty group'])})
    await user.keyboard('{Enter}')
    expect(first).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard(' ')
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('rowheader', {name: 'Standalone'})).toBeVisible()
    await user.click(screen.getByRole('button', {name: 'Empty'}))
    expect(screen.getByRole('button', {name: 'Empty'})).toHaveAttribute('aria-expanded', 'false')
  })

  it('requests immutable controlled updates without changing the displayed state', async () => {
    const user = userEvent.setup()
    const expandedGroups = new Set<DataTableRowId>([1, 'missing'])
    const onExpandedGroupsChange = vi.fn()
    const {rerender} = render(
      <DataTable
        data={data}
        columns={columns}
        collapsibleGroups
        expandedGroups={expandedGroups}
        onExpandedGroupsChange={onExpandedGroupsChange}
      />,
    )
    await user.click(screen.getByRole('button', {name: 'First'}))
    expect(expandedGroups).toEqual(new Set([1, 'missing']))
    expect(onExpandedGroupsChange).toHaveBeenLastCalledWith({expandedGroups: new Set(['missing'])})
    expect(screen.getByRole('rowheader', {name: 'Beta'})).toBeVisible()
    rerender(<DataTable data={data} columns={columns} collapsibleGroups expandedGroups={new Set()} />)
    expect(screen.queryByRole('rowheader', {name: 'Beta'})).not.toBeInTheDocument()
  })

  it('preserves selection and includes collapsed members in select-all', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={data}
        columns={columns}
        collapsibleGroups
        rowSelection
        defaultSelectedRows={new Set([1])}
        isRowSelectable={row => row.id !== 2}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole('button', {name: 'First'}))
    expect(onSelectionChange).not.toHaveBeenCalled()
    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})
    expect(selectAll).toBePartiallyChecked()
    expect(selectAll).toHaveAttribute('aria-description', 'Select all 3 rows')
    await user.click(selectAll)
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set(['standalone', 1, '1'])})
    await user.click(screen.getByRole('button', {name: 'First'}))
    expect(screen.getByRole('checkbox', {name: 'Select Beta'})).toBeChecked()
    expect(screen.getByRole('checkbox', {name: 'Select Alpha'})).not.toBeChecked()
    expect(screen.getByRole('checkbox', {name: 'Select Alpha'})).toBeDisabled()
    await user.click(screen.getByRole('button', {name: 'First'}))
    await user.click(selectAll)
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set()})
  })

  it('keeps every member and effective selection in the model while collapsed', () => {
    const {result} = renderHook(() =>
      useTable({
        data,
        columns,
        getRowId: row => row.id,
        collapsibleGroups: true,
        defaultExpandedGroups: new Set(),
        rowSelection: true,
        defaultSelectedRows: new Set([1, 2, 'missing']),
        isRowSelectable: row => row.id !== 2,
      }),
    )
    expect(result.current.bodies.flatMap(body => body.rows)).toHaveLength(4)
    expect(result.current.selection.selectedRows).toEqual(new Set([1]))
    expect(result.current.selection.selectedCount).toBe(1)
    expect(result.current.selection.selectableCount).toBe(3)
    const group = result.current.bodies.find(body => body.type === 'row-group' && body.id === 1)
    expect(group).toMatchObject({expanded: false})
    if (group?.type !== 'row-group') throw new Error('Expected row group')
    act(() => result.current.actions.toggleGroupExpansion(group))
    expect(result.current.selection.selectedRows).toEqual(new Set([1]))
  })

  it('preserves expansion across sorting, reordering, removal and reintroduction', async () => {
    const user = userEvent.setup()
    const onExpandedGroupsChange = vi.fn()
    const {rerender} = render(
      <DataTable
        data={data}
        columns={columns}
        collapsibleGroups
        defaultExpandedGroups={new Set(['1'])}
        onExpandedGroupsChange={onExpandedGroupsChange}
      />,
    )
    await user.click(screen.getByRole('button', {name: 'Name'}))
    expect(screen.getByRole('button', {name: 'First'})).toHaveAttribute('aria-expanded', 'false')
    rerender(
      <DataTable
        data={[data[2], data[0]]}
        columns={columns}
        collapsibleGroups
        onExpandedGroupsChange={onExpandedGroupsChange}
      />,
    )
    rerender(
      <DataTable
        data={[...data].reverse()}
        columns={columns}
        collapsibleGroups
        onExpandedGroupsChange={onExpandedGroupsChange}
      />,
    )
    expect(screen.getByRole('button', {name: 'Second'})).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', {name: 'First'})).toHaveAttribute('aria-expanded', 'false')
    expect(onExpandedGroupsChange).not.toHaveBeenCalled()
  })

  it('restores focus to the disclosure only when controlled collapse hides the focused member', () => {
    const {rerender} = render(
      <DataTable data={data} columns={columns} collapsibleGroups rowSelection expandedGroups={new Set([1])} />,
    )
    screen.getByRole('checkbox', {name: 'Select Beta'}).focus()
    rerender(<DataTable data={data} columns={columns} collapsibleGroups rowSelection expandedGroups={new Set()} />)
    expect(screen.getByRole('button', {name: 'First'})).toHaveFocus()
    const selectAll = screen.getByRole('checkbox', {name: 'Select rows'})
    selectAll.focus()
    rerender(<DataTable data={data} columns={columns} collapsibleGroups rowSelection expandedGroups={new Set([1])} />)
    rerender(<DataTable data={data} columns={columns} collapsibleGroups rowSelection expandedGroups={new Set()} />)
    expect(selectAll).toHaveFocus()
  })

  it('uses defaults only initially and collapses newly introduced group IDs', () => {
    const {rerender} = render(<DataTable data={data} columns={columns} collapsibleGroups />)
    const nextData: DataTableData<Row> = [
      ...data,
      {groupId: 'new', label: 'New', rows: [{id: 'new-row', name: 'New row'}]},
    ]
    rerender(<DataTable data={nextData} columns={columns} collapsibleGroups defaultExpandedGroups={new Set(['new'])} />)
    expect(screen.getByRole('button', {name: 'New'})).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', {name: 'First'})).toHaveAttribute('aria-expanded', 'true')
  })

  it('hydrates with stable disclosure references and hidden state across table instances', async () => {
    const ui = (
      <>
        <DataTable data={data} columns={columns} collapsibleGroups defaultExpandedGroups={new Set()} />
        <DataTable data={data} columns={columns} collapsibleGroups />
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(ui)
    document.body.append(container)
    const buttons = [...container.querySelectorAll<HTMLButtonElement>('[aria-controls]')]
    const controls = buttons.map(button => button.getAttribute('aria-controls'))
    expect(new Set(controls).size).toBe(buttons.length)
    for (const id of controls) expect(container.querySelector(`[id="${id}"]`)).not.toBeNull()
    expect(container.querySelectorAll('tbody[hidden]')).toHaveLength(3)
    let root: ReturnType<typeof hydrateRoot> | undefined
    await act(() => {
      root = hydrateRoot(container, ui)
    })
    expect(
      [...container.querySelectorAll('[aria-controls]')].map(button => button.getAttribute('aria-controls')),
    ).toEqual(controls)
    await act(() => root?.unmount())
    container.remove()
  })
})

describe('Table.Group expansion', () => {
  it('requests controlled changes and always shows non-collapsible members', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    function Example({collapsible = true, expanded = false}: {collapsible?: boolean; expanded?: boolean}) {
      return (
        <Table>
          <Table.Group
            id="controlled"
            label="Controlled"
            rowCount={1}
            colSpan={1}
            collapsible={collapsible}
            expanded={expanded}
            onExpandedChange={onExpandedChange}
          >
            <Table.Row>
              <Table.Cell>Member</Table.Cell>
            </Table.Row>
          </Table.Group>
        </Table>
      )
    }
    const {rerender} = render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Controlled'}))
    expect(onExpandedChange).toHaveBeenLastCalledWith({expanded: true})
    expect(screen.queryByRole('cell', {name: 'Member'})).not.toBeInTheDocument()
    rerender(<Example expanded />)
    expect(screen.getByRole('cell', {name: 'Member'})).toBeVisible()
    rerender(<Example collapsible={false} />)
    expect(screen.queryByRole('button', {name: 'Controlled'})).not.toBeInTheDocument()
    expect(screen.getByRole('cell', {name: 'Member'})).toBeVisible()
  })

  it('supports uncontrolled expansion, localized names and preserves mounted children', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(
      <Table>
        <Table.Group
          id="group id"
          label="Admins"
          aria-label="Administrators"
          rowCount={1}
          colSpan={1}
          collapsible
          defaultExpanded={false}
          onExpandedChange={onExpandedChange}
        >
          <Table.Row>
            <Table.Cell>
              <input aria-label="Draft" defaultValue="Saved draft" />
            </Table.Cell>
          </Table.Row>
        </Table.Group>
      </Table>,
    )
    const button = screen.getByRole('button', {name: 'Administrators'})
    await user.click(button)
    const input = screen.getByRole('textbox', {name: 'Draft'})
    await user.type(input, ' text')
    await user.click(button)
    expect(input).not.toBeVisible()
    expect(onExpandedChange).toHaveBeenLastCalledWith({expanded: false})
    await user.click(button)
    expect(input).toHaveValue('Saved draft text')
    expect(screen.getByRole('columnheader', {name: 'Administrators'})).toHaveAttribute('colspan', '1')
  })
})
