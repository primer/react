import {describe, expect, it, test, vi} from 'vitest'
import userEvent from '@testing-library/user-event'
import {render, screen, within} from '@testing-library/react'
import {DataTable} from '../../DataTable'
import type {Column} from '../column'
import {createColumnHelper} from '../column'
import {matches, startsWith, stringifyForFilter, substring} from '../filtering'

type Repo = {
  id: number
  name: string
  type: 'public' | 'private' | 'internal'
}

const data: Array<Repo> = [
  {id: 1, name: 'github', type: 'public'},
  {id: 2, name: 'github-config-api', type: 'internal'},
  {id: 3, name: 'enterprise-security', type: 'internal'},
  {id: 4, name: 'private-repo', type: 'private'},
]

function buildColumns(): Array<Column<Repo>> {
  const ch = createColumnHelper<Repo>()
  return [
    ch.column({header: 'Name', field: 'name', filterBy: true}),
    ch.column({header: 'Type', field: 'type', filterBy: 'startsWith'}),
  ]
}

describe('DataTable filtering', () => {
  describe('filtering strategies', () => {
    test.each([
      ['substring matches anywhere in the string', 'config', true],
      ['substring is case-insensitive', 'GITHUB', true],
      ['no match returns false', 'azure', false],
      ['empty query is handled by `matches` not by the strategy', '', true],
    ])('substring: %s', (_label, query, expected) => {
      expect(substring('github-config-api', query)).toBe(expected)
    })

    test('startsWith only matches prefix', () => {
      expect(startsWith('github-config-api', 'git')).toBe(true)
      expect(startsWith('github-config-api', 'hub')).toBe(false)
    })

    test('startsWith is case-insensitive', () => {
      expect(startsWith('GitHub', 'git')).toBe(true)
    })

    test('stringifyForFilter handles arrays and objects', () => {
      expect(stringifyForFilter(null)).toBe('')
      expect(stringifyForFilter(undefined)).toBe('')
      expect(stringifyForFilter(['a', 'b'])).toBe('a, b')
      expect(stringifyForFilter({foo: 'bar'})).toBe('{"foo":"bar"}')
      expect(stringifyForFilter(42)).toBe('42')
    })

    test('matches treats empty/whitespace-only queries as match-all', () => {
      const truthy = (_v: unknown) => false
      expect(matches(true, 'github', '', {id: 1, name: 'github', type: 'public'})).toBe(true)
      expect(matches(true, 'github', '   ', {id: 1, name: 'github', type: 'public'})).toBe(true)
      expect(matches(truthy, 'github', '', {id: 1, name: 'github', type: 'public'})).toBe(true)
    })

    test('matches dispatches to a custom function', () => {
      const custom = vi.fn((value: unknown, query: string) => String(value) === query)
      const row: Repo = {id: 1, name: 'github', type: 'public'}
      expect(matches(custom, 'github', 'github', row)).toBe(true)
      expect(matches(custom, 'github', 'other', row)).toBe(false)
      expect(custom).toHaveBeenCalledWith('github', 'github', row)
    })
  })

  describe('rendering', () => {
    it('does not render a filter row when `filterable` is false', () => {
      render(<DataTable aria-labelledby="t" data={data} columns={buildColumns()} />)
      expect(screen.queryByLabelText('Filter Name')).not.toBeInTheDocument()
    })

    it('does not render a filter row when no column has `filterBy`', () => {
      const ch = createColumnHelper<Repo>()
      const cols = [ch.column({header: 'Name', field: 'name'})]
      render(<DataTable aria-labelledby="t" data={data} columns={cols} filterable />)
      expect(screen.queryByLabelText('Filter Name')).not.toBeInTheDocument()
    })

    it('renders an input per filterable column when `filterable` is true', () => {
      render(<DataTable aria-labelledby="t" data={data} columns={buildColumns()} filterable />)
      expect(screen.getByLabelText('Filter Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Filter Type')).toBeInTheDocument()
    })

    it('renders an empty filter cell for columns that have no filterBy', () => {
      const ch = createColumnHelper<Repo>()
      const cols = [
        ch.column({header: 'Name', field: 'name', filterBy: true}),
        ch.column({header: 'Type', field: 'type'}),
      ]
      const {container} = render(<DataTable aria-labelledby="t" data={data} columns={cols} filterable />)
      // 3 columnheaders total: 2 from the header row + 1 from the filter row
      // (only "Name" gets a real <th>; "Type" gets a decorative <td>).
      expect(screen.getAllByRole('columnheader')).toHaveLength(3)
      expect(screen.getByLabelText('Filter Name')).toBeInTheDocument()
      expect(screen.queryByLabelText('Filter Type')).not.toBeInTheDocument()
      expect(container.querySelectorAll('td[data-component="Table.FilterCell"]')).toHaveLength(1)
    })

    it('uses the custom placeholder when provided', () => {
      render(
        <DataTable
          aria-labelledby="t"
          data={data}
          columns={buildColumns()}
          filterable
          filterPlaceholder="Type to filter"
        />,
      )
      expect(screen.getByLabelText('Filter Name')).toHaveAttribute('placeholder', 'Type to filter')
    })
  })

  describe('behavior', () => {
    it('uncontrolled: typing into a filter input reduces the visible rows', async () => {
      const user = userEvent.setup()
      render(<DataTable aria-labelledby="t" data={data} columns={buildColumns()} filterable />)

      expect(screen.getAllByRole('row')).toHaveLength(6) // header + filter + 4 data

      await user.type(screen.getByLabelText('Filter Name'), 'github')

      // After filtering: only `github` and `github-config-api` remain.
      expect(screen.getAllByRole('row')).toHaveLength(4) // header + filter + 2 data
      expect(screen.getByText('github')).toBeInTheDocument()
      expect(screen.getByText('github-config-api')).toBeInTheDocument()
      expect(screen.queryByText('enterprise-security')).not.toBeInTheDocument()
    })

    it('respects `defaultFilters` for the initial render', () => {
      render(
        <DataTable
          aria-labelledby="t"
          data={data}
          columns={buildColumns()}
          filterable
          defaultFilters={{name: 'enterprise'}}
        />,
      )
      expect(screen.getByText('enterprise-security')).toBeInTheDocument()
      expect(screen.queryByText('github')).not.toBeInTheDocument()
      expect(screen.getByLabelText('Filter Name')).toHaveValue('enterprise')
    })

    it('controlled: parent owns the state and the row set follows it', () => {
      const {rerender} = render(
        <DataTable
          aria-labelledby="t"
          data={data}
          columns={buildColumns()}
          filterable
          filters={{name: 'github'}}
          onFilterChange={() => {}}
        />,
      )
      expect(screen.getAllByRole('row')).toHaveLength(4) // header + filter + 2 data
      rerender(
        <DataTable
          aria-labelledby="t"
          data={data}
          columns={buildColumns()}
          filterable
          filters={{}}
          onFilterChange={() => {}}
        />,
      )
      expect(screen.getAllByRole('row')).toHaveLength(6)
    })

    it('calls `onFilterChange` with the new filter map on every change', async () => {
      const user = userEvent.setup()
      const onFilterChange = vi.fn()
      render(
        <DataTable
          aria-labelledby="t"
          data={data}
          columns={buildColumns()}
          filterable
          onFilterChange={onFilterChange}
        />,
      )
      await user.type(screen.getByLabelText('Filter Name'), 'a')
      expect(onFilterChange).toHaveBeenLastCalledWith({name: 'a'})
    })

    it('dispatches to a custom filterBy function', async () => {
      const user = userEvent.setup()
      const ch = createColumnHelper<Repo>()
      const cols = [
        ch.column({
          header: 'Name',
          field: 'name',
          // Treat the query as a regex prefix
          filterBy: (value, query) => new RegExp(`^${query}`, 'i').test(String(value)),
        }),
      ]
      render(<DataTable aria-labelledby="t" data={data} columns={cols} filterable />)
      await user.type(screen.getByLabelText('Filter Name'), 'gith')
      expect(screen.getByText('github')).toBeInTheDocument()
      expect(screen.getByText('github-config-api')).toBeInTheDocument()
      expect(screen.queryByText('private-repo')).not.toBeInTheDocument()
    })

    it('externalFiltering bypasses client-side filtering but still fires the change handler', async () => {
      const user = userEvent.setup()
      const onFilterChange = vi.fn()
      render(
        <DataTable
          aria-labelledby="t"
          data={data}
          columns={buildColumns()}
          filterable
          externalFiltering
          onFilterChange={onFilterChange}
        />,
      )
      await user.type(screen.getByLabelText('Filter Name'), 'github')
      // Row count unchanged: the consumer is expected to update `data` themselves.
      expect(screen.getAllByRole('row')).toHaveLength(6)
      expect(onFilterChange).toHaveBeenLastCalledWith({name: 'github'})
    })

    it('filtering composes with sorting (sort stays applied as filter narrows)', async () => {
      const user = userEvent.setup()
      const ch = createColumnHelper<Repo>()
      const cols = [
        ch.column({header: 'Name', field: 'name', filterBy: true, sortBy: 'alphanumeric'}),
        ch.column({header: 'Type', field: 'type'}),
      ]
      render(<DataTable aria-labelledby="t" data={data} columns={cols} filterable initialSortColumn="name" />)
      await user.type(screen.getByLabelText('Filter Name'), 'g')
      // Both `github` rows match. The default initial sort is ascending so
      // `github` comes before `github-config-api`.
      const rows = screen.getAllByRole('row')
      const dataRowText = rows.slice(2).map(row => within(row).getAllByRole('cell')[0]?.textContent)
      expect(dataRowText).toEqual(['github', 'github-config-api'])
    })
  })

  describe('accessibility', () => {
    it('every filter input has a descriptive aria-label', () => {
      render(<DataTable aria-labelledby="t" data={data} columns={buildColumns()} filterable />)
      expect(screen.getByLabelText('Filter Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Filter Type')).toBeInTheDocument()
    })

    it('non-filterable filter cells are decorative (no role, no input)', () => {
      const ch = createColumnHelper<Repo>()
      const cols = [
        ch.column({header: 'Name', field: 'name', filterBy: true}),
        ch.column({header: 'Type', field: 'type'}),
      ]
      const {container} = render(<DataTable aria-labelledby="t" data={data} columns={cols} filterable />)
      const decorative = container.querySelectorAll('td[data-component="Table.FilterCell"]')
      expect(decorative).toHaveLength(1)
      // The decorative cell has no children and no interactive content.
      expect(decorative[0]).toBeEmptyDOMElement()
    })
  })
})
