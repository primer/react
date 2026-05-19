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
      // Simulate a server-paginated context where the consumer has already
      // sliced — totalCount is what the component sees, so pretend we have
      // 30 rows but pass only the current page's 10.
      render(
        <DataTable
          aria-labelledby="t"
          data={makeItems(30)}
          columns={buildColumns()}
          pagination={{pageSize: 10}}
          externalPagination
          onPageChange={onPageChange}
        />,
      )
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
})
