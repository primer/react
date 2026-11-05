import {act, render} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {DataTable, Table} from '../../DataTable'
import type {DataTableProps} from '../DataTable'

interface Row {
  id: number
  name: string
}

const rows: Row[] = [
  {id: 1, name: 'Alpha'},
  {id: 2, name: 'Beta'},
  {id: 3, name: 'Unavailable'},
]
const columns: DataTableProps<Row>['columns'] = [{header: 'Name', field: 'name', rowHeader: true}]

describe('Table.Group count descriptions', () => {
  it.each(['none', 'some', 'all'] as const)('describes the count independently of %s selection', async selection => {
    const {rerender} = render(
      <Table>
        <Table.Group
          id="public"
          label="Public"
          rowCount={1}
          colSpan={1}
          collapsible
          selection={selection}
          onToggleSelect={vi.fn()}
        />
      </Table>,
    )
    const checkbox = page.getByRole('checkbox', {name: 'Select Public', exact: true})
    const disclosure = page.getByRole('button', {name: 'Public', exact: true})
    await expect.element(checkbox).toHaveAccessibleDescription('1 row')
    await expect.element(disclosure).toHaveAccessibleDescription('1 row')
    const countId = checkbox.element().getAttribute('aria-describedby')
    expect(countId).toBeTruthy()
    expect(document.getElementById(countId!)).toHaveTextContent('1 row')
    await expect.element(disclosure).toHaveAttribute('aria-describedby', countId!)
    await expect.element(checkbox).not.toHaveAttribute('aria-expanded')
    await expect.element(disclosure).not.toHaveAttribute('aria-checked')
    if (selection === 'some') {
      await expect.element(checkbox).toBePartiallyChecked()
    } else if (selection === 'all') {
      await expect.element(checkbox).toBeChecked()
    } else {
      await expect.element(checkbox).not.toBeChecked()
    }

    rerender(
      <Table>
        <Table.Group
          id="public"
          label="Public"
          rowCount={3}
          colSpan={1}
          collapsible
          selection={selection}
          onToggleSelect={vi.fn()}
        />
      </Table>,
    )
    await expect.element(checkbox).toHaveAccessibleDescription('3 rows')
    await expect.element(disclosure).toHaveAccessibleDescription('3 rows')
    await expect.element(checkbox).toHaveAttribute('aria-describedby', countId!)
  })

  it('localizes a standalone selection description and keeps group references distinct', async () => {
    render(
      <Table>
        <Table.Group
          id="first"
          label="First"
          rowCount={1}
          colSpan={1}
          selection="none"
          onToggleSelect={vi.fn()}
          getRowCountLabel={count => `${count} ligne`}
        />
        <Table.Group
          id="second"
          label="Second"
          rowCount={2}
          colSpan={1}
          selection="none"
          onToggleSelect={vi.fn()}
          getRowCountLabel={count => `${count} lignes`}
        />
      </Table>,
    )
    const first = page.getByRole('checkbox', {name: 'Select First', exact: true})
    const second = page.getByRole('checkbox', {name: 'Select Second', exact: true})
    await expect.element(first).toHaveAccessibleDescription('1 ligne')
    await expect.element(second).toHaveAccessibleDescription('2 lignes')
    expect(first.element().getAttribute('aria-describedby')).not.toBe(second.element().getAttribute('aria-describedby'))
    await expect.element(page.getByRole('button')).not.toBeInTheDocument()
  })
})

describe('DataTable group selection and disclosure', () => {
  it('keeps keyboard selection, expansion, and focus independent for collapsed members', async () => {
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        data={[{groupId: 'public', label: 'Public', rows}]}
        columns={columns}
        rowSelection
        collapsibleGroups
        defaultExpandedGroups={new Set()}
        defaultSelectedRows={new Set([1])}
        isRowSelectable={row => row.id !== 3}
        onSelectionChange={onSelectionChange}
      />,
    )
    const group = page.getByRole('checkbox', {name: 'Select Public', exact: true})
    const disclosure = page.getByRole('button', {name: 'Public', exact: true})
    const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})
    await expect.element(group).toHaveAccessibleDescription('3 rows')
    await expect.element(group).toBePartiallyChecked()
    act(() => selectAll.element().focus())
    await userEvent.tab()
    await expect.element(group).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect.element(group).toBeChecked()
    await expect.element(group).toHaveFocus()
    await expect.element(disclosure).toHaveAttribute('aria-expanded', 'false')
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set([1, 2])})

    await userEvent.tab()
    await expect.element(disclosure).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect.element(disclosure).toHaveAttribute('aria-expanded', 'true')
    await expect.element(disclosure).toHaveFocus()
    await expect.element(group).toBeChecked()
    await expect.element(page.getByRole('checkbox', {name: 'Select Unavailable', exact: true})).toBeDisabled()
    await expect.element(page.getByRole('checkbox', {name: 'Select Unavailable', exact: true})).not.toBeChecked()
    expect(onSelectionChange).toHaveBeenCalledTimes(1)

    await userEvent.keyboard(' ')
    await expect.element(disclosure).toHaveAttribute('aria-expanded', 'false')
    await userEvent.tab({shift: true})
    await expect.element(group).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect.element(group).not.toBeChecked()
    await expect.element(disclosure).toHaveAttribute('aria-expanded', 'false')
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set()})
  })

  it('updates localized counts while collapsed without replacing the focused checkbox', async () => {
    const props = {
      columns,
      rowSelection: true,
      collapsibleGroups: true,
      defaultExpandedGroups: new Set<string>(),
      getGroupRowCountLabel: (count: number) => `${count} ${count === 1 ? 'ligne' : 'lignes'}`,
    }
    const {rerender} = render(<DataTable {...props} data={[{groupId: 'public', label: 'Public', rows}]} />)
    const group = page.getByRole('checkbox', {name: 'Select Public', exact: true})
    const disclosure = page.getByRole('button', {name: 'Public', exact: true})
    act(() => group.element().focus())
    const originalCheckbox = group.element()
    await expect.element(group).toHaveAccessibleDescription('3 lignes')
    rerender(<DataTable {...props} data={[{groupId: 'public', label: 'Public', rows: rows.slice(0, 1)}]} />)
    await expect.element(group).toHaveAccessibleDescription('1 ligne')
    await expect.element(disclosure).toHaveAccessibleDescription('1 ligne')
    await expect.element(disclosure).toHaveAttribute('aria-expanded', 'false')
    expect(group.element()).toBe(originalCheckbox)
    expect(originalCheckbox).toHaveFocus()
    rerender(<DataTable {...props} data={[{groupId: 'public', label: 'Public', rows: []}]} />)
    await expect.element(group).toHaveAccessibleDescription('0 lignes')
    await expect.element(group).toBeDisabled()
    await expect.element(disclosure).toHaveAccessibleDescription('0 lignes')
  })

  it('skips disabled group checkboxes while keeping empty and unselectable disclosures operable', async () => {
    render(
      <>
        <button type="button">Before table</button>
        <DataTable
          data={[
            {groupId: 'empty', label: 'Empty', rows: []},
            {groupId: 'unavailable', label: 'Non-selectable', rows},
          ]}
          columns={columns}
          rowSelection
          collapsibleGroups
          isRowSelectable={() => false}
        />
      </>,
    )
    act(() => page.getByRole('button', {name: 'Before table', exact: true}).element().focus())
    for (const [name, count] of [
      ['Empty', 0],
      ['Non-selectable', 3],
    ] as const) {
      const checkbox = page.getByRole('checkbox', {name: `Select ${name}`, exact: true})
      const disclosure = page.getByRole('button', {name, exact: true})
      await expect.element(checkbox).toBeDisabled()
      await expect.element(checkbox).toHaveAccessibleDescription(`${count} rows`)
      await userEvent.tab()
      await expect.element(disclosure).toHaveFocus()
      await userEvent.keyboard(' ')
      await expect.element(disclosure).toHaveAttribute('aria-expanded', 'false')
      await expect.element(checkbox).not.toBeChecked()
    }
  })
})
