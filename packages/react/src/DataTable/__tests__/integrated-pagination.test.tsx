import {describe, expect, it, vi} from 'vitest'
import userEvent from '@testing-library/user-event'
import {render, screen} from '@testing-library/react'
import {DataTable} from '../../DataTable'
import {createColumnHelper} from '../column'

type Item = {id: number; name: string}

function makeItems(n: number): Item[] {
  return Array.from({length: n}, (_, i) => ({id: i + 1, name: `item-${i + 1}`}))
}

function buildColumns() {
  const ch = createColumnHelper<Item>()
  return [
    ch.column({header: 'ID', field: 'id', rowHeader: true, sortBy: 'basic'}),
    ch.column({header: 'Name', field: 'name'}),
  ]
}

describe('DataTable integrated pagination', () => {
  describe('opt-in', () => {
    it('does not render a pagination nav when the prop is omitted', () => {
      render(<DataTable aria-labelledby="t" data={makeItems(30)} columns={buildColumns()} />)
      expect(screen.queryByRole('navigation', {name: /pagination/i})).not.toBeInTheDocument()
    })

    it('renders a pagination nav when `pagination={true}`', () => {
      render(<DataTable aria-labelledby="t" data={makeItems(30)} columns={buildColumns()} pagination />)
      expect(screen.getByRole('navigation', {name: /pagination/i})).toBeInTheDocument()
    })

    it('renders a pagination nav when an options object is provided', () => {
      render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(30)}
          columns={buildColumns()}
          pagination={{pageSize: 10, 'aria-label': 'Repo pagination'}}
        />,
      )
      expect(screen.getByRole('navigation', {name: 'Repo pagination'})).toBeInTheDocument()
    })
  })

  describe('row slicing', () => {
    it('slices the row order to `pageSize` items per page', () => {
      render(
        <DataTable aria-labelledby="t" data={makeItems(30)} columns={buildColumns()} pagination={{pageSize: 10}} />,
      )
      // 1 header row + 10 data rows
      expect(screen.getAllByRole('row')).toHaveLength(11)
      // First page contains items 1..10.
      expect(screen.getByText('item-1')).toBeInTheDocument()
      expect(screen.getByText('item-10')).toBeInTheDocument()
      expect(screen.queryByText('item-11')).not.toBeInTheDocument()
    })

    it('navigating to the next page slices the next window', async () => {
      const user = userEvent.setup()
      render(
        <DataTable aria-labelledby="t" data={makeItems(30)} columns={buildColumns()} pagination={{pageSize: 10}} />,
      )
      await user.click(screen.getByRole('button', {name: /next/i}))
      expect(screen.queryByText('item-10')).not.toBeInTheDocument()
      expect(screen.getByText('item-11')).toBeInTheDocument()
      expect(screen.getByText('item-20')).toBeInTheDocument()
    })

    it('respects `defaultPageIndex` for the initial render', () => {
      render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(30)}
          columns={buildColumns()}
          pagination={{pageSize: 10, defaultPageIndex: 2}}
        />,
      )
      // Third page (index 2) contains items 21..30.
      expect(screen.getByText('item-21')).toBeInTheDocument()
      expect(screen.queryByText('item-1')).not.toBeInTheDocument()
    })

    it('handles an empty dataset without crashing', () => {
      render(<DataTable aria-labelledby="t" data={[]} columns={buildColumns()} pagination={{pageSize: 10}} />)
      expect(screen.getAllByRole('row')).toHaveLength(1) // header only
      // Pagination still renders (1 of 1) so consumers see consistent chrome.
      expect(screen.getByRole('navigation', {name: /pagination/i})).toBeInTheDocument()
    })

    it('resets to the first page when the data identity changes', () => {
      const first = makeItems(30)
      const second = makeItems(5)
      const {rerender} = render(
        <DataTable
          aria-labelledby="t"
          data={first}
          columns={buildColumns()}
          pagination={{pageSize: 10, defaultPageIndex: 2}}
        />,
      )
      expect(screen.getByText('item-21')).toBeInTheDocument()
      rerender(<DataTable aria-labelledby="t" data={second} columns={buildColumns()} pagination={{pageSize: 10}} />)
      // Only 5 items in the new data, all on page 0.
      expect(screen.getByText('item-1')).toBeInTheDocument()
      expect(screen.getByText('item-5')).toBeInTheDocument()
    })
  })

  describe('controlled mode', () => {
    it('respects the `pageIndex` prop and ignores user clicks unless the parent updates it', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      const {rerender} = render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(30)}
          columns={buildColumns()}
          pagination={{pageSize: 10}}
          pageIndex={0}
          onPageChange={onPageChange}
        />,
      )
      expect(screen.getByText('item-1')).toBeInTheDocument()
      await user.click(screen.getByRole('button', {name: /next/i}))
      // Internal state cannot advance because pageIndex={0} is controlled —
      // but onPageChange should still fire so the parent can react.
      expect(onPageChange).toHaveBeenLastCalledWith(1)
      // Page contents stay on page 0 because the parent hasn't bumped pageIndex.
      expect(screen.getByText('item-1')).toBeInTheDocument()
      expect(screen.queryByText('item-11')).not.toBeInTheDocument()

      rerender(
        <DataTable
          aria-labelledby="t"
          data={makeItems(30)}
          columns={buildColumns()}
          pagination={{pageSize: 10}}
          pageIndex={1}
          onPageChange={onPageChange}
        />,
      )
      expect(screen.getByText('item-11')).toBeInTheDocument()
    })
  })

  describe('externalPagination', () => {
    it('does not slice rows when externalPagination is true', () => {
      // The consumer is responsible for fetching one page of data at a time;
      // the component renders whatever `data` it receives.
      render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(5)}
          columns={buildColumns()}
          pagination={{pageSize: 10}}
          externalPagination
        />,
      )
      // All 5 rows visible despite pageSize 10.
      expect(screen.getAllByRole('row')).toHaveLength(6)
      expect(screen.getByText('item-5')).toBeInTheDocument()
    })

    it('still fires onPageChange so the consumer can fetch the next page', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      // Simulate a server-paginated context where the consumer feeds the
      // component just the current page (10 of a notional 30 total). The
      // component must not slice further — externalPagination defers that
      // to the parent — and must still fire onPageChange so the parent
      // can fetch the next slice.
      const page1 = makeItems(30).slice(0, 10)
      render(
        <DataTable
          aria-labelledby="t"
          data={page1}
          columns={buildColumns()}
          pagination={{pageSize: 10}}
          externalPagination
          onPageChange={onPageChange}
        />,
      )
      // All 10 rows the consumer supplied are visible (no further slicing).
      expect(screen.getAllByRole('row')).toHaveLength(11)
      expect(screen.getByText('item-10')).toBeInTheDocument()
      await user.click(screen.getByRole('button', {name: /next/i}))
      expect(onPageChange).toHaveBeenLastCalledWith(1)
    })
  })

  describe('composition with existing features', () => {
    it('pagination + sorting yields the sorted-and-sliced rows', async () => {
      const user = userEvent.setup()
      render(<DataTable aria-labelledby="t" data={makeItems(15)} columns={buildColumns()} pagination={{pageSize: 5}} />)
      // Click "ID" header to sort descending (default is asc on click).
      await user.click(screen.getByRole('button', {name: /id/i}))
      await user.click(screen.getByRole('button', {name: /id/i}))
      // Page 0 of DESC sort contains 15..11.
      expect(screen.getByText('item-15')).toBeInTheDocument()
      expect(screen.queryByText('item-10')).not.toBeInTheDocument()
    })
  })

  describe('page-size dropdown', () => {
    it('does not render a rows-per-page dropdown when `pageSizeOptions` is omitted', () => {
      render(
        <DataTable aria-labelledby="t" data={makeItems(30)} columns={buildColumns()} pagination={{pageSize: 10}} />,
      )
      expect(screen.queryByLabelText(/rows per page/i)).not.toBeInTheDocument()
    })

    it('renders the rows-per-page dropdown when `pageSizeOptions` is provided', () => {
      render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(30)}
          columns={buildColumns()}
          pagination={{pageSize: 10, pageSizeOptions: [10, 25, 50]}}
        />,
      )
      const select = screen.getByLabelText(/rows per page/i) as HTMLSelectElement
      expect(select).toBeInTheDocument()
      // Initial value reflects the current pageSize.
      expect(select.value).toBe('10')
      // All options are present.
      expect(Array.from(select.options).map(o => o.value)).toEqual(['10', '25', '50'])
    })

    it('uses a custom `pageSizeLabel` when supplied', () => {
      render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(30)}
          columns={buildColumns()}
          pagination={{pageSize: 10, pageSizeOptions: [10, 25], pageSizeLabel: 'Per page'}}
        />,
      )
      expect(screen.getByLabelText('Per page')).toBeInTheDocument()
    })

    it('prepends the current `pageSize` to the dropdown if not present in options', () => {
      render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(60)}
          columns={buildColumns()}
          pagination={{pageSize: 15, pageSizeOptions: [10, 25, 50]}}
        />,
      )
      const select = screen.getByLabelText(/rows per page/i) as HTMLSelectElement
      // 15 is prepended to keep the dropdown accurate.
      expect(Array.from(select.options).map(o => o.value)).toEqual(['15', '10', '25', '50'])
      expect(select.value).toBe('15')
    })

    it('changing the page size re-slices and renders the new page of rows (uncontrolled)', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(30)}
          columns={buildColumns()}
          pagination={{pageSize: 10, pageSizeOptions: [10, 25, 50]}}
        />,
      )
      // Initial render: 10 rows visible (header + 10 data).
      expect(screen.getAllByRole('row')).toHaveLength(11)
      // Change page size to 25.
      await user.selectOptions(screen.getByLabelText(/rows per page/i), '25')
      // 25 rows visible now.
      expect(screen.getAllByRole('row')).toHaveLength(26)
      expect(screen.getByText('item-25')).toBeInTheDocument()
    })

    it('resets to the first page when the page size changes (uncontrolled)', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(30)}
          columns={buildColumns()}
          pagination={{pageSize: 10, pageSizeOptions: [10, 25, 50], defaultPageIndex: 2}}
        />,
      )
      // Page 2 of pageSize 10 contains items 21..30.
      expect(screen.getByText('item-21')).toBeInTheDocument()
      // Pick a larger page size.
      await user.selectOptions(screen.getByLabelText(/rows per page/i), '25')
      // We're now back on page 0 (items 1..25), not still on page 2.
      expect(screen.getByText('item-1')).toBeInTheDocument()
      expect(screen.getByText('item-25')).toBeInTheDocument()
    })

    it('fires `onPageSizeChange` and `onPageChange(0)` when the user picks a new page size from page > 0', async () => {
      const user = userEvent.setup()
      const onPageSizeChange = vi.fn()
      const onPageChange = vi.fn()
      render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(30)}
          columns={buildColumns()}
          pagination={{pageSize: 10, pageSizeOptions: [10, 25, 50], defaultPageIndex: 1}}
          onPageSizeChange={onPageSizeChange}
          onPageChange={onPageChange}
        />,
      )
      await user.selectOptions(screen.getByLabelText(/rows per page/i), '25')
      expect(onPageSizeChange).toHaveBeenCalledWith(25)
      // We were on page 1 — picking a new page size resets to page 0, so
      // controlled consumers should hear about the reset too.
      expect(onPageChange).toHaveBeenCalledWith(0)
    })

    it('does not fire `onPageChange(0)` when already on page 0', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(30)}
          columns={buildColumns()}
          pagination={{pageSize: 10, pageSizeOptions: [10, 25]}}
          onPageChange={onPageChange}
        />,
      )
      await user.selectOptions(screen.getByLabelText(/rows per page/i), '25')
      expect(onPageChange).not.toHaveBeenCalled()
    })

    it('respects controlled `pageSize` and ignores user picks until the parent updates it', async () => {
      const user = userEvent.setup()
      const onPageSizeChange = vi.fn()
      const {rerender} = render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(60)}
          columns={buildColumns()}
          pagination={{pageSizeOptions: [10, 25, 50]}}
          pageSize={10}
          onPageSizeChange={onPageSizeChange}
        />,
      )
      // 10 visible rows.
      expect(screen.getAllByRole('row')).toHaveLength(11)
      // User picks 25, but parent hasn't bumped pageSize yet — slice stays at 10.
      await user.selectOptions(screen.getByLabelText(/rows per page/i), '25')
      expect(onPageSizeChange).toHaveBeenLastCalledWith(25)
      expect(screen.getAllByRole('row')).toHaveLength(11)
      // Parent now updates pageSize.
      rerender(
        <DataTable
          aria-labelledby="t"
          data={makeItems(60)}
          columns={buildColumns()}
          pagination={{pageSizeOptions: [10, 25, 50]}}
          pageSize={25}
          onPageSizeChange={onPageSizeChange}
        />,
      )
      // 25 visible rows now.
      expect(screen.getAllByRole('row')).toHaveLength(26)
    })
  })
})
