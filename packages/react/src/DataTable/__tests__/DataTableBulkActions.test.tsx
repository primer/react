import React, {act} from 'react'
import {render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {renderToString} from 'react-dom/server'
import {hydrateRoot, type Root} from 'react-dom/client'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {DataTable, Table, type DataTableBulkActionsContext, type DataTableData, type DataTableRowId} from '..'
import {Button} from '../../Button'
import {ActionMenu} from '../../ActionMenu'
import {ActionList} from '../../ActionList'
import {getLiveRegion} from '../../live-region/__tests__/test-helpers'
import {implementsClassName} from '../../utils/testing'
import type {Column} from '../column'
import classes from '../TableBulkActions.module.css'

interface Row {
  id: DataTableRowId
  name: string
}

const rows: Array<Row> = [
  {id: 1, name: 'Beta'},
  {id: '1', name: 'Alpha'},
  {id: 3, name: 'Gamma'},
]
const columns: Array<Column<Row>> = [{header: 'Name', field: 'name', rowHeader: true, sortBy: true}]

function renderActions({selectedCount, clearSelection}: DataTableBulkActionsContext) {
  return <Button onClick={clearSelection}>Apply to {selectedCount}</Button>
}

describe('DataTable bulk actions', () => {
  beforeEach(() => {
    document.body.appendChild(document.createElement('live-region'))
  })
  afterEach(() => {
    getLiveRegion().remove()
  })

  it.each(['flat', 'grouped', 'mixed'] as const)('uses effective IDs and counts (%s)', async mode => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const data: DataTableData<Row> =
      mode === 'flat'
        ? rows
        : mode === 'grouped'
          ? [{groupId: 'all', label: 'All', rows}]
          : [rows[0], {groupId: 'other', label: 'Other', rows: rows.slice(1)}]
    render(
      <DataTable
        data={data}
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
    expect(screen.queryByRole('button', {name: 'Clear selection'})).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', {name: 'Archive'}))
    expect(onAction).toHaveBeenLastCalledWith({selectedRows: new Set<DataTableRowId>([1, '1']), selectedCount: 2})
    expect(screen.queryByRole('button', {name: 'Name'})).not.toBeInTheDocument()
    expect(screen.getByRole('columnheader', {name: 'Name'})).toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', {name: 'Select rows'}))
    await user.click(screen.getByRole('button', {name: 'Name'}))
    expect(screen.getByRole('columnheader', {name: 'Name'})).toHaveAttribute('aria-sort', 'ascending')
    await user.click(screen.getByRole('checkbox', {name: 'Select rows'}))
    expect(screen.getByRole('columnheader', {name: 'Name'})).toHaveAttribute('aria-sort', 'ascending')
    await user.click(screen.getByRole('button', {name: 'Archive'}))
    expect(onAction).toHaveBeenLastCalledWith({selectedRows: new Set<DataTableRowId>([1, '1']), selectedCount: 2})
  })

  it('does not render actions without enabled selection or effectively selected rows', () => {
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
    expect(screen.queryByRole('button', {name: 'Clear selection'})).not.toBeInTheDocument()
  })

  it('preserves checkbox focus when actions appear and announces counts including zero', async () => {
    const user = userEvent.setup()
    render(<DataTable data={rows} columns={columns} rowSelection renderBulkActions={renderActions} />)
    expect(getLiveRegion().getMessage('polite')).toBe('')
    const checkbox = screen.getByRole('checkbox', {name: 'Select Beta'})
    checkbox.focus()
    await user.keyboard(' ')
    expect(checkbox).toHaveFocus()
    await waitFor(() => expect(getLiveRegion().getMessage('polite')).toBe('1 selected'))
    await user.click(screen.getByRole('checkbox', {name: 'Select Alpha'}))
    await waitFor(() => expect(getLiveRegion().getMessage('polite')).toBe('2 selected'))
    await user.click(screen.getByRole('button', {name: 'Apply to 2'}))
    await waitFor(() => expect(getLiveRegion().getMessage('polite')).toBe('0 selected'))
    expect(screen.getByRole('checkbox', {name: 'Select rows'})).toHaveFocus()
    expect(screen.queryByRole('group', {name: 'Bulk actions'})).not.toBeInTheDocument()
  })

  it('clears stored IDs through the controlled selection callback without mutating its input', async () => {
    const user = userEvent.setup()
    const selectedRows = new Set<DataTableRowId>([1, 'missing'])
    const onSelectionChange = vi.fn()
    const {rerender} = render(
      <DataTable
        data={rows}
        columns={columns}
        rowSelection
        selectedRows={selectedRows}
        onSelectionChange={onSelectionChange}
        renderBulkActions={renderActions}
      />,
    )
    await user.click(screen.getByRole('button', {name: 'Apply to 1'}))
    expect(onSelectionChange).toHaveBeenLastCalledWith({selectedRows: new Set()})
    expect(selectedRows).toEqual(new Set<DataTableRowId>([1, 'missing']))
    expect(screen.getByRole('button', {name: 'Apply to 1'})).toHaveFocus()
    rerender(
      <DataTable
        data={rows}
        columns={columns}
        rowSelection
        selectedRows={new Set()}
        onSelectionChange={onSelectionChange}
        renderBulkActions={renderActions}
      />,
    )
    expect(screen.getByRole('checkbox', {name: 'Select rows'})).toHaveFocus()
  })

  it('recovers focus when deleting the last selected record, including an empty table', async () => {
    const user = userEvent.setup()
    function Example() {
      const [data, setData] = React.useState([rows[0]])
      return (
        <DataTable
          data={data}
          columns={columns}
          rowSelection
          defaultSelectedRows={new Set([1])}
          renderBulkActions={({selectedRows}) => (
            <Button onClick={() => setData(current => current.filter(row => !selectedRows.has(row.id)))}>Delete</Button>
          )}
        />
      )
    }
    render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Delete'}))
    expect(screen.getByRole('table')).toHaveFocus()
    expect(screen.getByRole('checkbox', {name: 'Select rows'})).toBeDisabled()
    expect(screen.queryByRole('button', {name: 'Delete'})).not.toBeInTheDocument()
  })

  it('allows a consumer-selected recovery target', async () => {
    const user = userEvent.setup()
    function Example() {
      const ref = React.useRef<HTMLButtonElement>(null)
      return (
        <>
          <Button ref={ref}>Add repository</Button>
          <DataTable
            data={rows}
            columns={columns}
            rowSelection
            defaultSelectedRows={new Set([1])}
            renderBulkActions={renderActions}
            bulkActionsReturnFocusRef={ref}
          />
        </>
      )
    }
    render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Apply to 1'}))
    expect(screen.getByRole('button', {name: 'Add repository'})).toHaveFocus()
  })

  it('does not steal focus from a consumer-owned action destination', async () => {
    const user = userEvent.setup()
    function Example() {
      const destination = React.useRef<HTMLButtonElement>(null)
      return (
        <>
          <Button ref={destination}>Confirmation</Button>
          <DataTable
            data={rows}
            columns={columns}
            rowSelection
            defaultSelectedRows={new Set([1])}
            renderBulkActions={({clearSelection}) => (
              <Button
                onClick={() => {
                  destination.current?.focus()
                  clearSelection()
                }}
              >
                Complete
              </Button>
            )}
          />
        </>
      )
    }
    render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Complete'}))
    expect(screen.getByRole('button', {name: 'Confirmation'})).toHaveFocus()
  })

  it('does not recover focus after the user leaves the actions for non-interactive content', async () => {
    const user = userEvent.setup()
    const renderExample = (data: Array<Row>) => (
      <>
        <p>Outside the table</p>
        <DataTable
          data={data}
          columns={columns}
          rowSelection
          defaultSelectedRows={new Set([1])}
          renderBulkActions={renderActions}
        />
      </>
    )
    const {rerender} = render(renderExample(rows))
    screen.getByRole('button', {name: 'Apply to 1'}).focus()
    await user.click(screen.getByText('Outside the table'))
    expect(document.body).toHaveFocus()

    rerender(renderExample(rows.slice(1)))

    expect(document.body).toHaveFocus()
    expect(screen.queryByRole('group', {name: 'Bulk actions'})).not.toBeInTheDocument()
  })

  it('recovers focus when a Primer menu action clears selection', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowSelection
        defaultSelectedRows={new Set([1])}
        renderBulkActions={({clearSelection}) => (
          <ActionMenu>
            <ActionMenu.Button>More actions</ActionMenu.Button>
            <ActionMenu.Overlay>
              <ActionList>
                <ActionList.Item onSelect={clearSelection}>Archive selected</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        )}
      />,
    )
    screen.getByRole('button', {name: 'More actions'}).focus()
    await user.keyboard(' ')
    expect(screen.getByRole('menuitem', {name: 'Archive selected'})).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('checkbox', {name: 'Select rows'})).toHaveFocus()
  })

  it('updates effective count after removal without emitting selection changes or stealing outside focus', () => {
    const onSelectionChange = vi.fn()
    const {rerender} = render(
      <>
        <Button>Elsewhere</Button>
        <DataTable
          data={rows}
          columns={columns}
          rowSelection
          defaultSelectedRows={new Set<DataTableRowId>([1, '1'])}
          onSelectionChange={onSelectionChange}
          renderBulkActions={renderActions}
        />
      </>,
    )
    screen.getByRole('button', {name: 'Elsewhere'}).focus()
    rerender(
      <>
        <Button>Elsewhere</Button>
        <DataTable
          data={rows.slice(1)}
          columns={columns}
          rowSelection
          onSelectionChange={onSelectionChange}
          renderBulkActions={renderActions}
        />
      </>,
    )
    expect(screen.getByText('1 selected')).toBeVisible()
    expect(onSelectionChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', {name: 'Elsewhere'})).toHaveFocus()
  })

  it('supports localized labels', () => {
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowSelection
        defaultSelectedRows={new Set([1])}
        renderBulkActions={renderActions}
        bulkActionsProps={{
          'aria-label': 'Selected repositories',
          getSelectedCountLabel: count => `${count} repositories chosen`,
        }}
      />,
    )
    const group = screen.getByRole('group', {name: 'Selected repositories'})
    expect(within(group).getByText('1 repositories chosen')).toBeVisible()
    expect(within(group).getAllByRole('button')).toHaveLength(1)
  })

  it('preserves structure through server rendering and hydration', async () => {
    const element = (
      <DataTable
        data={rows}
        columns={columns}
        rowSelection
        defaultSelectedRows={new Set([1])}
        renderBulkActions={renderActions}
      />
    )
    const container = document.createElement('div')
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    container.innerHTML = renderToString(element)
    document.body.appendChild(container)
    const serverTable = within(container).getByRole('table')
    expect(within(serverTable).getByRole('group', {name: 'Bulk actions'})).toBeInTheDocument()
    const onRecoverableError = vi.fn()
    let root: Root | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, element, {onRecoverableError})
      })
      expect(onRecoverableError).not.toHaveBeenCalled()
      expect(
        consoleErrorSpy.mock.calls.every(([message]) =>
          String(message).includes('useLayoutEffect does nothing on the server'),
        ),
      ).toBe(true)
      expect(within(container).getByRole('table')).toBe(serverTable)
      expect(within(container).getByText('1 selected')).toBeVisible()
    } finally {
      consoleErrorSpy.mockRestore()
      await act(async () => root?.unmount())
      container.remove()
    }
  })
})

describe('Table.BulkActions', () => {
  implementsClassName(props => <Table.BulkActions selectedCount={1} {...props} />, classes.TableBulkActions)

  it('forwards root attributes and ref, preserves child order and native Tab order', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    const onFocusCapture = vi.fn()
    const onBlurCapture = vi.fn()
    render(
      <Table.BulkActions
        ref={ref}
        data-testid="actions"
        selectedCount={2}
        onFocusCapture={onFocusCapture}
        onBlurCapture={onBlurCapture}
      >
        <Button>First</Button>
        <Button>Second</Button>
      </Table.BulkActions>,
    )
    const group = screen.getByRole('group', {name: 'Bulk actions'})
    expect(ref.current).toBe(group)
    expect(group).toHaveAttribute('data-testid', 'actions')
    expect(group).toHaveAttribute('data-component', 'Table.BulkActions')
    await user.tab()
    expect(screen.getByRole('button', {name: 'First'})).toHaveFocus()
    expect(onFocusCapture).toHaveBeenCalledOnce()
    await user.tab()
    expect(screen.getByRole('button', {name: 'Second'})).toHaveFocus()
    expect(onBlurCapture).toHaveBeenCalledOnce()
  })
})
