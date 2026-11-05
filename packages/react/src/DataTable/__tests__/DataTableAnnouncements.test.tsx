import React from 'react'
import {act, render} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {DataTable, Table, type DataTableBulkActionsContext} from '..'
import {Button} from '../../Button'
import {getLiveRegion} from '../../live-region/__tests__/test-helpers'
import type {Column} from '../column'

const data = [
  {id: 1, name: 'Alpha'},
  {id: 2, name: 'Beta'},
]
const columns: Array<Column<(typeof data)[number]>> = [{header: 'Name', field: 'name', rowHeader: true, sortBy: true}]
const renderActions = ({clearSelection}: DataTableBulkActionsContext) => <Button onClick={clearSelection}>Apply</Button>

describe('DataTable selection announcements', () => {
  beforeEach(() => {
    document.body.appendChild(document.createElement('live-region'))
  })

  afterEach(() => {
    getLiveRegion().clear()
    getLiveRegion().remove()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe.each([false, true])('with bulk actions: %s', withBulkActions => {
    const renderBulkActions = withBulkActions ? renderActions : undefined

    it.each([{selected: []}, {selected: [1]}])(
      'does not announce initial selection $selected, including StrictMode',
      async ({selected}) => {
        vi.useFakeTimers()
        const announce = vi.spyOn(getLiveRegion(), 'announce')
        render(
          <React.StrictMode>
            <DataTable
              data={data}
              columns={columns}
              rowSelection
              defaultSelectedRows={new Set(selected)}
              renderBulkActions={renderBulkActions}
            />
          </React.StrictMode>,
        )
        await act(async () => vi.advanceTimersByTime(500))
        expect(announce).not.toHaveBeenCalled()
        expect(getLiveRegion().getMessage('polite')).toBe('')
      },
    )

    it('announces selection and clearing once per change', async () => {
      const announce = vi.spyOn(getLiveRegion(), 'announce')
      render(<DataTable data={data} columns={columns} rowSelection renderBulkActions={renderBulkActions} />)
      const alpha = page.getByRole('checkbox', {name: 'Select Alpha', exact: true})
      await userEvent.click(alpha)
      await expect.poll(() => getLiveRegion().getMessage('polite')).toBe('1 selected')
      await userEvent.click(page.getByRole('checkbox', {name: 'Select Beta', exact: true}))
      await expect.poll(() => getLiveRegion().getMessage('polite')).toBe('2 selected')
      const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})
      await userEvent.click(selectAll)
      await expect.poll(() => getLiveRegion().getMessage('polite')).toBe('0 selected')
      expect(announce.mock.calls.map(([message]) => message)).toEqual(['1 selected', '2 selected', '0 selected'])
    })

    it('debounces rapid changes and does not repeat unchanged counts', async () => {
      vi.useFakeTimers()
      const announce = vi.spyOn(getLiveRegion(), 'announce')
      const example = (ids: Array<number>) => (
        <DataTable
          data={data}
          columns={columns}
          rowSelection
          selectedRows={new Set(ids)}
          renderBulkActions={renderBulkActions}
        />
      )
      const {rerender} = render(example([]))
      await act(async () => rerender(example([1])))
      await act(async () => vi.advanceTimersByTime(100))
      expect(getLiveRegion().getMessage('polite')).toBe('')
      await act(async () => rerender(example([1, 2])))
      await act(async () => vi.advanceTimersByTime(149))
      expect(getLiveRegion().getMessage('polite')).toBe('')
      await act(async () => vi.advanceTimersByTime(1))
      expect(getLiveRegion().getMessage('polite')).toBe('2 selected')
      expect(announce).toHaveBeenCalledTimes(2)
      await act(async () => rerender(example([2, 1])))
      await act(async () => vi.advanceTimersByTime(500))
      expect(announce).toHaveBeenCalledTimes(2)
    })

    it('uses the existing localized count formatter for selection and clearing', async () => {
      render(
        <DataTable
          data={data}
          columns={columns}
          rowSelection
          renderBulkActions={renderBulkActions}
          bulkActionsProps={{getSelectedCountLabel: count => (count ? `${count} chosen` : 'Selection cleared')}}
        />,
      )
      const alpha = page.getByRole('checkbox', {name: 'Select Alpha', exact: true})
      await userEvent.click(alpha)
      await expect.poll(() => getLiveRegion().getMessage('polite')).toBe('1 chosen')
      await userEvent.click(alpha)
      await expect.poll(() => getLiveRegion().getMessage('polite')).toBe('Selection cleared')
    })
  })

  it('keeps selection silent when enabled and does not repeat it when adding a toolbar', async () => {
    vi.useFakeTimers()
    const announce = vi.spyOn(getLiveRegion(), 'announce')
    const {rerender} = render(<DataTable data={data} columns={columns} selectedRows={new Set([1])} />)
    rerender(<DataTable data={data} columns={columns} rowSelection selectedRows={new Set([1])} />)
    await act(async () => vi.advanceTimersByTime(500))
    expect(announce).not.toHaveBeenCalled()
    rerender(
      <DataTable
        data={data}
        columns={columns}
        rowSelection
        selectedRows={new Set([1])}
        renderBulkActions={renderActions}
      />,
    )
    await act(async () => vi.advanceTimersByTime(500))
    expect(announce).not.toHaveBeenCalled()
    rerender(<DataTable data={data} columns={columns} rowSelection selectedRows={new Set()} />)
    await act(async () => vi.advanceTimersByTime(150))
    expect(getLiveRegion().getMessage('polite')).toBe('0 selected')
    expect(announce).toHaveBeenCalledTimes(1)
  })

  it('cancels a pending selection announcement when unmounted', async () => {
    vi.useFakeTimers()
    const {rerender, unmount} = render(
      <DataTable data={data} columns={columns} rowSelection selectedRows={new Set()} />,
    )
    rerender(<DataTable data={data} columns={columns} rowSelection selectedRows={new Set([1])} />)
    await act(async () => vi.advanceTimersByTime(149))
    unmount()
    await act(async () => vi.advanceTimersByTime(500))
    expect(getLiveRegion().getMessage('polite')).toBe('')
  })

  it('excludes the inactive toolbar row and preserves keyboard focus when clearing the last selection', async () => {
    render(<DataTable data={data} columns={columns} rowSelection renderBulkActions={renderActions} />)
    const table = page.getByRole('table')
    const header = table.getByRole('rowgroup').first()
    expect(header.getByRole('row').elements()).toHaveLength(1)
    const selectAll = page.getByRole('checkbox', {name: 'Select rows', exact: true})
    const alpha = page.getByRole('checkbox', {name: 'Select Alpha', exact: true})
    act(() => alpha.element().focus())
    await userEvent.keyboard(' ')
    expect(header.getByRole('row').elements()).toHaveLength(2)
    await userEvent.tab({shift: true})
    await expect.element(page.getByRole('button', {name: 'Apply', exact: true})).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect.element(selectAll).toHaveFocus()
    expect(header.getByRole('row').elements()).toHaveLength(1)
    await expect.poll(() => getLiveRegion().getMessage('polite')).toBe('0 selected')
  })

  it('keeps standalone Table.BulkActions announcements without announcing its initial count', async () => {
    const announce = vi.spyOn(getLiveRegion(), 'announce')
    const {rerender} = render(<Table.BulkActions selectedCount={1} />)
    expect(announce).not.toHaveBeenCalled()
    rerender(<Table.BulkActions selectedCount={2} />)
    await expect.poll(() => getLiveRegion().getMessage('polite')).toBe('2 selected')
    rerender(<Table.BulkActions selectedCount={0} />)
    await expect.poll(() => getLiveRegion().getMessage('polite')).toBe('0 selected')
    expect(announce.mock.calls.map(([message]) => message)).toEqual(['2 selected', '0 selected'])
  })
})
