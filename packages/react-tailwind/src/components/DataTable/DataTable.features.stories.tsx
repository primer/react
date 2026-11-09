import {
  BookIcon,
  DownloadIcon,
  KebabHorizontalIcon,
  PencilIcon,
  PlusIcon,
  RepoIcon,
  TrashIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {action} from 'storybook/actions'
import {expect, userEvent, within} from 'storybook/test'
import {useId, useRef, useState} from 'react'
import {ActionMenu} from '../ActionMenu'
import {Blankslate} from '../Blankslate'
import {Button} from '../Button'
import {Heading} from '../Heading'
import {IconButton} from '../IconButton'
import {Label} from '../Label'
import {LabelGroup} from '../LabelGroup'
import {RelativeTime} from '../RelativeTime'
import {createColumnHelper} from './column'
import {
  DataTable,
  type Column,
  type DataTableData,
  type DataTableProps,
  type DataTableRowGroup,
  type DataTableRowId,
} from './DataTable'
import {Table} from './index'

interface Repo {
  id: number
  name: string
  type: 'public' | 'internal'
  updatedAt: number
  securityFeatures: {dependabot: string[]; codeScanning: string[]}
}

const now = Date.now()
const minute = 60 * 1000
const hour = 60 * minute
const day = 24 * hour
const week = 7 * day
const month = 4 * week
const data: Repo[] = [
  {
    id: 1,
    name: 'codeql-dca-worker',
    type: 'internal',
    updatedAt: now,
    securityFeatures: {dependabot: ['alerts', 'security updates'], codeScanning: ['report secrets']},
  },
  {
    id: 2,
    name: 'aegir',
    type: 'public',
    updatedAt: now - 5 * minute,
    securityFeatures: {dependabot: ['alerts'], codeScanning: ['report secrets']},
  },
  {id: 3, name: 'strapi', type: 'public', updatedAt: now - hour, securityFeatures: {dependabot: [], codeScanning: []}},
  {
    id: 4,
    name: 'codeql-ci-nightlies',
    type: 'public',
    updatedAt: now - 6 * hour,
    securityFeatures: {dependabot: ['alerts'], codeScanning: []},
  },
  {
    id: 5,
    name: 'dependabot-updates',
    type: 'public',
    updatedAt: now - day,
    securityFeatures: {dependabot: [], codeScanning: []},
  },
  {
    id: 6,
    name: 'tsx-create-react-app',
    type: 'public',
    updatedAt: now - week,
    securityFeatures: {dependabot: [], codeScanning: []},
  },
  {
    id: 7,
    name: 'bootstrap',
    type: 'public',
    updatedAt: now - month,
    securityFeatures: {dependabot: ['alerts'], codeScanning: []},
  },
  {
    id: 8,
    name: 'docker-templates',
    type: 'public',
    updatedAt: 1725494400000,
    securityFeatures: {dependabot: ['alerts'], codeScanning: []},
  },
]
const paginationData: Repo[] = Array.from({length: 1000}, (_, index) => ({
  id: index,
  name: `Repository ${index + 1}`,
  type: index % 3 === 0 ? 'internal' : 'public',
  updatedAt: now - day * index,
  securityFeatures: {dependabot: [], codeScanning: []},
}))
const defaultColumns = createColumns()

const meta = {
  title: 'React Tailwind/Data/DataTable/Features',
  component: DataTable<Repo>,
} satisfies Meta<typeof DataTable<Repo>>

export default meta
type Story = StoryObj

function uppercase(input: string) {
  return input[0].toUpperCase() + input.slice(1)
}

function createColumns({
  sortable = false,
  placeholder = false,
  align,
}: {
  sortable?: boolean
  placeholder?: boolean
  align?: 'start' | 'end'
} = {}): Column<Repo>[] {
  return [
    {field: 'name', header: 'Repository', rowHeader: true, sortBy: sortable ? 'alphanumeric' : false, align},
    {field: 'type', header: 'Type', renderCell: row => <Label>{uppercase(row.type)}</Label>, align},
    {
      field: 'updatedAt',
      header: 'Updated',
      sortBy: sortable ? 'datetime' : false,
      renderCell: row => <RelativeTime date={new Date(row.updatedAt)} />,
      align,
    },
    {
      field: 'securityFeatures.dependabot',
      header: 'Dependabot',
      renderCell: row =>
        row.securityFeatures.dependabot.length ? (
          <LabelGroup>
            {row.securityFeatures.dependabot.map(feature => (
              <Label key={feature}>{uppercase(feature)}</Label>
            ))}
          </LabelGroup>
        ) : placeholder ? (
          <Table.CellPlaceholder>Not configured</Table.CellPlaceholder>
        ) : null,
      align,
    },
    {
      field: 'securityFeatures.codeScanning',
      header: 'Code scanning',
      renderCell: row =>
        row.securityFeatures.codeScanning.length ? (
          <LabelGroup>
            {row.securityFeatures.codeScanning.map(feature => (
              <Label key={feature}>{uppercase(feature)}</Label>
            ))}
          </LabelGroup>
        ) : placeholder ? (
          <Table.CellPlaceholder>Not configured</Table.CellPlaceholder>
        ) : null,
      align,
    },
  ]
}

function Repositories({
  actions,
  ariaDescribedBy,
  ariaLabelledBy,
  columns = defaultColumns,
  initialSortColumn,
  initialSortDirection,
  onToggleSort,
  rows = data,
  subtitle = true,
  title = true,
}: {
  actions?: React.ReactNode
  ariaDescribedBy?: string
  ariaLabelledBy?: string
  columns?: Column<Repo>[]
  initialSortColumn?: string
  initialSortDirection?: 'ASC' | 'DESC'
  onToggleSort?: DataTableProps<Repo>['onToggleSort']
  rows?: Repo[]
  subtitle?: boolean | string
  title?: boolean
}) {
  return (
    <Table.Container>
      {title ? <Table.Title id="repositories">Repositories</Table.Title> : null}
      {actions}
      {subtitle ? (
        <Table.Subtitle id="repositories-subtitle">
          {typeof subtitle === 'string' ? subtitle : 'A subtitle could appear here to give extra context to the data.'}
        </Table.Subtitle>
      ) : null}
      <DataTable
        aria-describedby={ariaDescribedBy ?? (subtitle ? 'repositories-subtitle' : undefined)}
        aria-labelledby={ariaLabelledBy ?? (title ? 'repositories' : undefined)}
        columns={columns}
        data={rows}
        initialSortColumn={initialSortColumn}
        initialSortDirection={initialSortDirection}
        onToggleSort={onToggleSort}
      />
    </Table.Container>
  )
}

export const WithTitle: Story = {render: () => <Repositories subtitle={false} />}
export const WithTitleAndSubtitle: Story = {render: () => <Repositories />}
export const WithSorting: Story = {
  render: () => (
    <Repositories
      columns={createColumns({sortable: true})}
      initialSortColumn="updatedAt"
      initialSortDirection="DESC"
      rows={[...data].sort((a, b) => b.updatedAt - a.updatedAt)}
    />
  ),
}
export const WithCustomSorting: Story = {
  render: () => {
    const columns = createColumns({sortable: true})
    columns[3] = {
      ...columns[3],
      sortBy: (a, b) => b.securityFeatures.dependabot.length - a.securityFeatures.dependabot.length,
    }
    return (
      <Repositories
        columns={columns}
        initialSortColumn="updatedAt"
        initialSortDirection="DESC"
        rows={[...data].sort((a, b) => b.updatedAt - a.updatedAt)}
      />
    )
  },
}
export const WithAction: Story = {
  render: () => (
    <Repositories
      actions={
        <>
          <Table.Actions>
            <Button>Action</Button>
          </Table.Actions>
          <Table.Divider />
        </>
      }
    />
  ),
}
export const WithActionOnly: Story = {
  render: () => (
    <>
      <Heading id="table-title">Repositories</Heading>
      <Repositories
        actions={
          <Table.Actions>
            <Button>Action</Button>
          </Table.Actions>
        }
        subtitle={false}
        title={false}
      />
    </>
  ),
}
export const WithActions: Story = {
  render: () => (
    <Repositories
      actions={
        <>
          <Table.Actions>
            <IconButton aria-label="Download" icon={DownloadIcon} variant="invisible" />
            <IconButton aria-label="Add row" icon={PlusIcon} variant="invisible" />
          </Table.Actions>
          <Table.Divider />
        </>
      }
    />
  ),
}
export const WithActionsOnly: Story = {
  render: () => (
    <>
      <Heading id="table-title">Repositories</Heading>
      <Repositories
        actions={
          <Table.Actions>
            <IconButton aria-label="Download" icon={DownloadIcon} variant="invisible" />
            <IconButton aria-label="Add row" icon={PlusIcon} variant="invisible" />
          </Table.Actions>
        }
        subtitle={false}
        title={false}
      />
    </>
  ),
}
export const WithRowAction: Story = {
  render: () => (
    <Repositories
      columns={[
        ...createColumns(),
        {
          id: 'actions',
          header: () => <span className="sr-only">Actions</span>,
          renderCell: row => (
            <IconButton aria-label={`Download: ${row.name}`} icon={DownloadIcon} variant="invisible" />
          ),
        },
      ]}
    />
  ),
}
export const WithRowActions: Story = {
  render: () => (
    <Repositories
      columns={[
        ...createColumns(),
        {
          id: 'actions',
          header: () => <span className="sr-only">Actions</span>,
          renderCell: row => (
            <>
              <IconButton aria-label={`Edit: ${row.name}`} icon={PencilIcon} variant="invisible" />
              <IconButton aria-label={`Delete: ${row.name}`} icon={TrashIcon} variant="invisible" />
            </>
          ),
        },
      ]}
    />
  ),
}
export const WithRowActionMenu: Story = {
  render: () => (
    <Repositories
      columns={[
        ...createColumns(),
        {
          id: 'actions',
          header: () => <span className="sr-only">Actions</span>,
          renderCell: row => (
            <ActionMenu>
              <ActionMenu.Trigger
                render={
                  <IconButton aria-label={`Actions: ${row.name}`} icon={KebabHorizontalIcon} variant="invisible" />
                }
              />
              <ActionMenu.Content>
                <ActionMenu.Item>Copy row</ActionMenu.Item>
                <ActionMenu.Item>Edit row</ActionMenu.Item>
                <ActionMenu.Item>Export row as CSV</ActionMenu.Item>
                <ActionMenu.Divider />
                <ActionMenu.Item variant="danger">Delete row</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu>
          ),
        },
      ]}
    />
  ),
}
export const MixedColumnWidths: Story = {
  render: () => (
    <Repositories
      subtitle={false}
      columns={[
        {...createColumns()[0], header: 'grow w/ 200px max', maxWidth: '200px'},
        {...createColumns()[1], header: 'growCollapse w/ 100px min', minWidth: '100px', width: 'growCollapse'},
        {...createColumns()[2], header: 'auto', width: 'auto'},
        {...createColumns()[3], header: '200px', width: '200px'},
        {...createColumns()[4], header: 'undefined (defaults to grow)'},
      ]}
    />
  ),
}
export const WithCustomHeading: Story = {
  render: () => (
    <>
      <Heading id="repositories">Security coverage</Heading>
      <p id="repositories-subtitle">
        Organization members can only see data for the most recently-updated repositories. To see all repositories, talk
        to your organization administrator about becoming a security manager.
      </p>
      <Repositories
        aria-describedby="repositories-subtitle"
        aria-labelledby="repositories"
        subtitle={false}
        title={false}
      />
    </>
  ),
}
export const WithNoContent: Story = {
  render: () => (
    <Blankslate border>
      <Blankslate.Visual>
        <BookIcon size={32} />
      </Blankslate.Visual>
      <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
      <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
      <Blankslate.PrimaryAction href="#">Primary action</Blankslate.PrimaryAction>
      <Blankslate.SecondaryAction href="#">Secondary action link</Blankslate.SecondaryAction>
    </Blankslate>
  ),
}
export const WithOverflow: Story = {
  render: () => (
    <div style={{maxWidth: 500}}>
      <Repositories />
    </div>
  ),
}
export const WithLoading: Story = {
  render: () => (
    <Table.Container>
      <Table.Title id="repositories">Repositories</Table.Title>
      <Table.Subtitle id="repositories-subtitle">
        A subtitle could appear here to give extra context to the data.
      </Table.Subtitle>
      <Table.Skeleton
        aria-describedby="repositories-subtitle"
        aria-labelledby="repositories"
        columns={createColumns()}
      />
    </Table.Container>
  ),
}
export const WithPlaceholderCells: Story = {render: () => <Repositories columns={createColumns({placeholder: true})} />}
export const WithRightAlignedColumns: Story = {
  render: () => {
    const columns = createColumns({align: 'end', sortable: true})
    columns[0] = {
      ...columns[0],
      header: () => (
        <span className="inline-flex items-center gap-1">
          <RepoIcon size={16} />
          Repository
        </span>
      ),
    }
    return (
      <Repositories
        columns={columns}
        initialSortColumn="updatedAt"
        initialSortDirection="DESC"
        rows={[...data].sort((a, b) => b.updatedAt - a.updatedAt)}
      />
    )
  },
}
export const WithSortEvents: Story = {
  render: () => (
    <Repositories
      columns={createColumns({sortable: true})}
      initialSortColumn="updatedAt"
      initialSortDirection="DESC"
      onToggleSort={(columnId, direction) => action('onToggleSort')({columnId, direction})}
      rows={[...data].sort((a, b) => b.updatedAt - a.updatedAt)}
      subtitle="Click any sortable header and watch the Actions panel."
    />
  ),
}

function PaginatedRepositories({defaultPageIndex = 0}: {defaultPageIndex?: number}) {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 10
  const rows = paginationData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  return (
    <Table.Container>
      <Table.Title id="repositories">Repositories</Table.Title>
      <Table.Subtitle id="repositories-subtitle">
        A subtitle could appear here to give extra context to the data.
      </Table.Subtitle>
      <DataTable
        aria-describedby="repositories-subtitle"
        aria-labelledby="repositories"
        columns={createColumns()}
        data={rows}
      />
      <Table.Pagination
        aria-label="Pagination for Repositories"
        defaultPageIndex={defaultPageIndex}
        pageSize={pageSize}
        totalCount={paginationData.length}
        onChange={({pageIndex: nextPageIndex}) => setPageIndex(nextPageIndex)}
      />
    </Table.Container>
  )
}

export const WithPagination: Story = {
  render: () => <PaginatedRepositories />,
}
export const WithPaginationUsingDefaultPageIndex: Story = {
  render: () => <PaginatedRepositories defaultPageIndex={49} />,
}
export const WithNetworkError: Story = {
  render: () => (
    <Table.Container>
      <Table.Title id="repositories">Repositories</Table.Title>
      <Table.Subtitle id="repositories-subtitle">
        A subtitle could appear here to give extra context to the data.
      </Table.Subtitle>
      <Table.Skeleton
        aria-describedby="repositories-subtitle"
        aria-labelledby="repositories"
        columns={createColumns()}
      />
      <Table.Pagination pageSize={10} totalCount={paginationData.length} />
    </Table.Container>
  ),
}

export const SelectableRows: Story = {
  render: () => {
    const [selected, setSelected] = useState<number[]>([])
    return (
      <>
        <p role="status">{selected.length} repositories selected</p>
        <DataTable
          aria-label="Repositories"
          columns={[
            {
              id: 'select',
              header: 'Select',
              renderCell: row => (
                <input
                  aria-label={`Select ${row.name}`}
                  checked={selected.includes(row.id)}
                  type="checkbox"
                  onChange={() =>
                    setSelected(current =>
                      current.includes(row.id) ? current.filter(id => id !== row.id) : [...current, row.id],
                    )
                  }
                />
              ),
            },
            {field: 'name', header: 'Repository', rowHeader: true},
          ]}
          data={data.slice(0, 2)}
        />
      </>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('checkbox', {name: 'Select codeql-dca-worker'}))
    await expect(canvas.getByRole('checkbox', {name: 'Select codeql-dca-worker'})).toBeChecked()
    await expect(canvas.getByRole('status')).toHaveTextContent('1 repositories selected')
  },
}

const columnHelper = createColumnHelper<Repo>()
const repoGroups: DataTableRowGroup<Repo>[] = [
  {groupId: 'internal', label: 'Internal', rows: data.filter(repo => repo.type === 'internal')},
  {groupId: 'public', label: 'Public', rows: data.filter(repo => repo.type === 'public')},
]
const groupedColumns = [
  columnHelper.column({header: 'Name', field: 'name', rowHeader: true, width: 'growCollapse'}),
  columnHelper.column({
    header: 'Updated',
    field: 'updatedAt',
    width: 'auto',
    renderCell: repo => <RelativeTime date={new Date(repo.updatedAt)} />,
  }),
]
const sortableGroupedColumns = [
  columnHelper.column({header: 'Name', field: 'name', rowHeader: true, sortBy: true, width: 'growCollapse'}),
  groupedColumns[1],
]
const repoGroupsWithDisabledRow = repoGroups.map(group => ({
  ...group,
  rows: group.rows.map(repo => (repo.id === 1 ? {...repo, name: `${repo.name} (not selectable)`} : repo)),
}))

function RowSelectionExample() {
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<DataTableRowId>>(() => new Set([2]))

  return (
    <Table.Container>
      <Table.Title id="selectable-repositories">Selectable repositories</Table.Title>
      <DataTable
        aria-labelledby="selectable-repositories"
        data={data}
        columns={groupedColumns}
        rowSelection
        selectedRows={selectedRows}
        onSelectionChange={({selectedRows: nextSelectedRows}) => setSelectedRows(nextSelectedRows)}
      />
    </Table.Container>
  )
}

export const WithRowSelection: Story = {render: () => <RowSelectionExample />}

const bulkActionRepositories = [
  {id: 1, name: 'primer/react', visibility: 'Public'},
  {id: 2, name: 'primer/css', visibility: 'Public'},
  {id: 3, name: 'github/github', visibility: 'Internal'},
]

function BulkActionsExample() {
  const titleId = useId()
  const [rows, setRows] = useState(bulkActionRepositories)
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<DataTableRowId>>(() => new Set([1]))
  const resetButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <Table.Container>
      <Table.Title id={titleId}>Repositories</Table.Title>
      <Table.Actions>
        <Button
          ref={resetButtonRef}
          onClick={() => {
            setRows(bulkActionRepositories)
            setSelectedRows(new Set())
          }}
        >
          Reset repositories
        </Button>
      </Table.Actions>
      <DataTable
        aria-labelledby={titleId}
        data={[
          ...rows.filter(row => row.visibility === 'Internal'),
          {groupId: 'public', label: 'Public', rows: rows.filter(row => row.visibility === 'Public')},
        ]}
        columns={[
          {header: 'Repository', field: 'name', rowHeader: true, sortBy: 'alphanumeric'},
          {header: 'Visibility', field: 'visibility'},
        ]}
        rowSelection
        selectedRows={selectedRows}
        onSelectionChange={({selectedRows: next}) => setSelectedRows(next)}
        bulkActionsReturnFocusRef={rows.length === 0 ? resetButtonRef : undefined}
        collapsibleGroups
        renderBulkActions={({selectedRows: effectiveIds, clearSelection}) => (
          <>
            <Button
              size="small"
              onClick={() => {
                setRows(current =>
                  current.map(row => (effectiveIds.has(row.id) ? {...row, visibility: 'Internal'} : row)),
                )
                clearSelection()
              }}
            >
              Make internal
            </Button>
            <Button
              size="small"
              variant="danger"
              onClick={() => {
                setRows(current => current.filter(row => !effectiveIds.has(row.id)))
                clearSelection()
              }}
            >
              Delete selected
            </Button>
          </>
        )}
      />
    </Table.Container>
  )
}

export const WithBulkActions: Story = {render: () => <BulkActionsExample />}

function GroupedRowSelectionExample() {
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<DataTableRowId>>(() => new Set())

  return (
    <Table.Container>
      <Table.Title id="selectable-repositories-by-visibility">Selectable repositories by visibility</Table.Title>
      <DataTable
        aria-labelledby="selectable-repositories-by-visibility"
        data={repoGroupsWithDisabledRow}
        columns={groupedColumns}
        rowSelection
        selectedRows={selectedRows}
        isRowSelectable={repo => repo.id !== 1}
        onSelectionChange={({selectedRows: nextSelectedRows}) => setSelectedRows(nextSelectedRows)}
      />
    </Table.Container>
  )
}

export const WithGroupedRowSelection: Story = {
  render: () => <GroupedRowSelectionExample />,
  parameters: {
    docs: {description: {story: '`codeql-dca-worker` is not selectable and is excluded from select-all.'}},
  },
}

function CollapsibleGroupsExample() {
  const titleId = useId()
  const [expandedGroups, setExpandedGroups] = useState<ReadonlySet<DataTableRowId>>(() => new Set(['public']))

  return (
    <Table.Container>
      <Table.Title id={titleId}>Repositories</Table.Title>
      <Table.Actions>
        <Button onClick={() => setExpandedGroups(new Set())}>Collapse all groups</Button>
        <Button onClick={() => setExpandedGroups(new Set(['public']))}>Expand all groups</Button>
      </Table.Actions>
      <DataTable
        aria-labelledby={titleId}
        data={[
          {id: 'github', name: 'github/github', visibility: 'Internal'},
          {
            groupId: 'public',
            label: 'Public',
            rows: [
              {id: 'react', name: 'primer/react', visibility: 'Public'},
              {id: 'css', name: 'primer/css', visibility: 'Public'},
            ],
          },
        ]}
        columns={[
          {header: 'Repository', field: 'name', rowHeader: true},
          {header: 'Visibility', field: 'visibility'},
        ]}
        collapsibleGroups
        expandedGroups={expandedGroups}
        onExpandedGroupsChange={({expandedGroups: nextExpandedGroups}) => setExpandedGroups(nextExpandedGroups)}
        rowSelection
        defaultSelectedRows={new Set(['react'])}
      />
    </Table.Container>
  )
}

export const WithCollapsibleGroups: Story = {
  render: () => <CollapsibleGroupsExample />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const publicGroup = canvas.getByRole('button', {name: 'Public'})
    await userEvent.click(publicGroup)
    await expect(publicGroup).toHaveAttribute('aria-expanded', 'false')
    await userEvent.keyboard('{Enter}')
    await expect(publicGroup).toHaveAttribute('aria-expanded', 'true')
  },
}

function StandaloneAndGroupedRowSelectionExample() {
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<DataTableRowId>>(() => new Set())

  return (
    <Table.Container>
      <Table.Title id="selectable-mixed-repositories">Selectable standalone and grouped repositories</Table.Title>
      <DataTable
        aria-labelledby="selectable-mixed-repositories"
        data={[...data.filter(repo => repo.type === 'internal'), repoGroups[1]]}
        columns={sortableGroupedColumns}
        rowSelection
        selectedRows={selectedRows}
        onSelectionChange={({selectedRows: nextSelectedRows}) => setSelectedRows(nextSelectedRows)}
      />
    </Table.Container>
  )
}

export const WithStandaloneAndGroupedRowSelection: Story = {
  render: () => <StandaloneAndGroupedRowSelectionExample />,
}

export const WithSortableGroups: Story = {
  render: () => (
    <Table.Container>
      <Table.Title id="sortable-repositories-by-visibility">Sortable repositories by visibility</Table.Title>
      <DataTable
        aria-labelledby="sortable-repositories-by-visibility"
        data={repoGroups}
        columns={sortableGroupedColumns}
      />
    </Table.Container>
  ),
}

interface PaginatedRepository {
  id: number
  name: string
  visibility: string
}

const groupedPaginationData: DataTableData<PaginatedRepository> = [
  {id: 100, name: 'standalone/before', visibility: 'Unassigned'},
  {
    groupId: 'public',
    label: 'Public',
    rows: Array.from({length: 12}, (_, index) => ({
      id: index,
      name: `public/repository-${index + 1}`,
      visibility: 'Public',
    })),
  },
  {
    groupId: 'internal',
    label: 'Internal',
    rows: Array.from({length: 3}, (_, index) => ({
      id: index + 12,
      name: `internal/repository-${index + 1}`,
      visibility: 'Internal',
    })),
  },
  {id: 101, name: 'standalone/after', visibility: 'Unassigned'},
]
const groupedPaginationRows = groupedPaginationData.flatMap(item => ('rows' in item ? item.rows : [item]))

function getPageData(source: DataTableData<PaginatedRepository>, pageIndex: number, pageSize: number) {
  const pageRows = new Set(
    groupedPaginationRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map(row => row.id),
  )
  // Count data rows, not headings, and preserve each item's position and group membership.
  return source.flatMap((item): DataTableData<PaginatedRepository> => {
    if ('rows' in item) {
      const rows = item.rows.filter(row => pageRows.has(row.id))
      return rows.length > 0 ? [{...item, rows}] : []
    }
    return pageRows.has(item.id) ? [item] : []
  })
}

function GroupsExample() {
  const titleId = useId()
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 10

  return (
    <Table.Container>
      <Table.Title id={titleId}>Paginated repositories by visibility</Table.Title>
      <DataTable
        aria-labelledby={titleId}
        data={getPageData(groupedPaginationData, pageIndex, pageSize)}
        columns={[
          {header: 'Name', field: 'name', rowHeader: true, sortBy: true},
          {header: 'Visibility', field: 'visibility'},
        ]}
      />
      <Table.Pagination
        aria-label="Pagination for grouped repositories"
        pageSize={pageSize}
        totalCount={groupedPaginationRows.length}
        onChange={({pageIndex: nextPageIndex}) => setPageIndex(nextPageIndex)}
      />
    </Table.Container>
  )
}

export const WithGroups: Story = {render: () => <GroupsExample />}

function PaginatedRowSelectionExample() {
  const titleId = useId()
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<DataTableRowId>>(() => new Set())
  const pageSize = 10

  return (
    <Table.Container>
      <Table.Title id={titleId}>Selectable paginated repositories</Table.Title>
      <DataTable
        aria-labelledby={titleId}
        data={getPageData(groupedPaginationData, pageIndex, pageSize)}
        columns={[
          {header: 'Name', field: 'name', rowHeader: true},
          {header: 'Visibility', field: 'visibility'},
        ]}
        rowSelection
        selectedRows={selectedRows}
        onSelectionChange={({selectedRows: nextSelectedRows}) => setSelectedRows(nextSelectedRows)}
      />
      <Table.Pagination
        aria-label="Pagination for selectable repositories"
        pageSize={pageSize}
        totalCount={groupedPaginationRows.length}
        onChange={({pageIndex: nextPageIndex}) => {
          setPageIndex(nextPageIndex)
          // Selection applies only to the current page.
          setSelectedRows(new Set())
        }}
      />
    </Table.Container>
  )
}

export const WithPaginatedRowSelection: Story = {render: () => <PaginatedRowSelectionExample />}
