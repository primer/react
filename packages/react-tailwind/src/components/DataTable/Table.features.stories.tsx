import type {Meta, StoryObj} from '@storybook/react-vite'
import {useId, useState} from 'react'
import {Button} from '../Button'
import {ToggleSwitch} from '../ToggleSwitch'
import {VisuallyHidden} from '../VisuallyHidden'
import type {Column, DataTableRowId} from './DataTable'
import {DataTable, Table, type TableSubtitleProps, type TableTitleProps} from './index'

const meta = {
  title: 'React Tailwind/Data/Table/Features',
  component: Table,
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

function HeadingLevelsExample({
  titleAs,
  subtitleAs,
}: {
  titleAs: TableTitleProps['as']
  subtitleAs: TableSubtitleProps['as']
}) {
  const id = useId()
  return (
    <section>
      <h2>Project data</h2>
      <Table.Container>
        <Table.Title as={titleAs} id={`${id}-title`}>
          Components
        </Table.Title>
        <Table.Subtitle as={subtitleAs} id={`${id}-subtitle`}>
          Components available in this project
        </Table.Subtitle>
        <DataTable
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-subtitle`}
          data={[{id: 1, name: 'Button'}]}
          columns={[{field: 'name', header: 'Name', rowHeader: true}]}
        />
      </Table.Container>
    </section>
  )
}

export const WithHeadingLevels: StoryObj<typeof HeadingLevelsExample> = {
  args: {titleAs: 'h3', subtitleAs: 'p'},
  argTypes: {
    titleAs: {control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']},
    subtitleAs: {control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']},
  },
  render: args => <HeadingLevelsExample {...args} />,
}

const groups = [
  {
    id: 'internal',
    label: 'Internal',
    rows: [{id: 1, name: 'github/github', visibility: 'internal'}],
  },
  {
    id: 'public',
    label: 'Public',
    rows: [
      {id: 2, name: 'primer/react', visibility: 'public'},
      {id: 3, name: 'primer/css', visibility: 'public'},
    ],
  },
]

function GroupsExample() {
  const id = useId()
  const titleId = `${id}-title`
  const nameColumnId = `${id}-name`
  const visibilityColumnId = `${id}-visibility`

  return (
    <Table.Container>
      <Table.Title id={titleId}>Repositories by visibility</Table.Title>
      <Table aria-labelledby={titleId} gridTemplateColumns="minmax(0, 1fr) auto">
        <Table.Head>
          <Table.Row>
            <Table.Header id={nameColumnId}>Name</Table.Header>
            <Table.Header id={visibilityColumnId}>Visibility</Table.Header>
          </Table.Row>
        </Table.Head>
        {groups.map(group => (
          <Table.Group key={group.id} id={group.id} label={group.label} rowCount={group.rows.length} colSpan={2}>
            {group.rows.map(repo => {
              const rowHeaderId = `${id}-row-${repo.id}`

              return (
                <Table.Row key={repo.id}>
                  <Table.Cell id={rowHeaderId} scope="row" headers={nameColumnId}>
                    {repo.name}
                  </Table.Cell>
                  <Table.Cell headers={`${rowHeaderId} ${visibilityColumnId}`}>{repo.visibility}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Group>
        ))}
      </Table>
    </Table.Container>
  )
}

export const WithGroups: Story = {render: () => <GroupsExample />}

function CollapsibleGroupsExample() {
  const id = useId()

  return (
    <Table.Container>
      <Table.Title id={`${id}-title`}>Collapsible repository groups</Table.Title>
      <Table aria-labelledby={`${id}-title`} gridTemplateColumns="minmax(0, 1fr) auto">
        <Table.Head>
          <Table.Row>
            <Table.Header id={`${id}-name`}>Name</Table.Header>
            <Table.Header id={`${id}-visibility`}>Visibility</Table.Header>
          </Table.Row>
        </Table.Head>
        {groups.map(group => (
          <Table.Group
            key={group.id}
            id={group.id}
            label={group.label}
            rowCount={group.rows.length}
            colSpan={2}
            collapsible
            defaultExpanded={group.id === 'public'}
          >
            {group.rows.map(repo => (
              <Table.Row key={repo.id}>
                <Table.Cell id={`${id}-row-${repo.id}`} scope="row" headers={`${id}-name`}>
                  {repo.name}
                </Table.Cell>
                <Table.Cell headers={`${id}-row-${repo.id} ${id}-visibility`}>{repo.visibility}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Group>
        ))}
      </Table>
    </Table.Container>
  )
}

export const WithCollapsibleGroups: Story = {render: () => <CollapsibleGroupsExample />}

function RowSelectionExample() {
  const id = useId()
  const titleId = `${id}-title`
  const selectionColumnId = `${id}-selection`
  const nameColumnId = `${id}-name`
  const visibilityColumnId = `${id}-visibility`
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<DataTableRowId>>(() => new Set([2]))
  const selectableRows = groups.flatMap(group => group.rows).filter(row => row.id !== 1)
  const selectedCount = selectableRows.filter(row => selectedRows.has(row.id)).length
  const allSelected = selectableRows.length > 0 && selectedCount === selectableRows.length

  return (
    <Table.Container>
      <Table.Title id={titleId}>Selectable repositories using Table</Table.Title>
      <Table aria-labelledby={titleId} gridTemplateColumns="min-content minmax(0, 1fr) auto">
        <Table.Head>
          <Table.Row>
            <Table.SelectionHeader
              id={selectionColumnId}
              selection={allSelected ? 'all' : selectedCount > 0 ? 'some' : 'none'}
              disabled={selectableRows.length === 0}
              description={
                selectableRows.length > 0
                  ? `Select all ${selectableRows.length} ${selectableRows.length === 1 ? 'row' : 'rows'}`
                  : undefined
              }
              onToggleSelect={() => {
                setSelectedRows(allSelected ? new Set() : new Set(selectableRows.map(row => row.id)))
              }}
            />
            <Table.Header id={nameColumnId}>Name</Table.Header>
            <Table.Header id={visibilityColumnId}>Visibility</Table.Header>
          </Table.Row>
        </Table.Head>
        {groups.map(group => (
          <Table.Group key={group.id} id={group.id} label={group.label} rowCount={group.rows.length} colSpan={3}>
            {group.rows.map(repo => {
              const rowHeaderId = `${id}-row-${repo.id}`
              const selectable = repo.id !== 1

              return (
                <Table.Row key={repo.id}>
                  <Table.RowSelection
                    selected={selectable && selectedRows.has(repo.id)}
                    disabled={!selectable}
                    headers={selectionColumnId}
                    aria-labelledby={rowHeaderId}
                    onToggleSelect={() => {
                      setSelectedRows(previous => {
                        const next = new Set(previous)
                        if (next.has(repo.id)) {
                          next.delete(repo.id)
                        } else {
                          next.add(repo.id)
                        }
                        return next
                      })
                    }}
                  />
                  <Table.Cell id={rowHeaderId} scope="row" headers={nameColumnId}>
                    {repo.name}
                  </Table.Cell>
                  <Table.Cell headers={`${rowHeaderId} ${visibilityColumnId}`}>{repo.visibility}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Group>
        ))}
      </Table>
    </Table.Container>
  )
}

export const WithRowSelection: Story = {render: () => <RowSelectionExample />}

export const OverflowWithHiddenCellLabel: Story = {
  parameters: {layout: 'fullscreen'},
  render: () => (
    <div className="relative" data-testid="table-frame" style={{width: 'calc(100vw - 2px)'}}>
      <Table.Container>
        <Table aria-label="Security features" gridTemplateColumns="150px 150px 44px">
          <Table.Head>
            <Table.Row>
              <Table.Header>Feature</Table.Header>
              <Table.Header>Availability</Table.Header>
              <Table.Header>On</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell scope="row">Alerts</Table.Cell>
              <Table.Cell>Available</Table.Cell>
              <Table.Cell align="end">
                <ToggleSwitch aria-labelledby="security-alert-label" size="small" />
                <VisuallyHidden id="security-alert-label">Enable security alerts</VisuallyHidden>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Table.Container>
    </div>
  ),
}

export const OverflowWithMultipleSwitches: Story = {
  parameters: {layout: 'fullscreen'},
  render: ({cellPadding}) => (
    <div className="relative" data-testid="table-frame" style={{width: 'calc(100vw - 2px)'}}>
      <Table.Container>
        <Table aria-label="Security features" cellPadding={cellPadding} gridTemplateColumns="150px 150px 44px">
          <Table.Head>
            <Table.Row>
              <Table.Header>Feature</Table.Header>
              <Table.Header>Availability</Table.Header>
              <Table.Header>On</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {['Alerts', 'Audit logs', 'Policy checks'].map((feature, index) => (
              <Table.Row key={feature}>
                <Table.Cell scope="row" id={`security-feature-${index}`}>
                  {feature}
                </Table.Cell>
                <Table.Cell>Available</Table.Cell>
                <Table.Cell align="end">
                  <ToggleSwitch aria-labelledby={`security-feature-${index}`} size="small" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Table.Container>
    </div>
  ),
}

const skeletonColumns: Column<{id: number; name: string; issues: number}>[] = [
  {field: 'name', header: 'Repository', align: 'start', width: 'growCollapse', minWidth: 160},
  {field: 'issues', header: () => <span>Open issues</span>, align: 'end', width: 96},
]

export const WithSkeletonColumns: Story = {
  render: function SkeletonColumnsExample() {
    const [loading, setLoading] = useState(true)
    return (
      <div className="flex flex-col gap-3">
        <Button onClick={() => setLoading(!loading)}>{loading ? 'Show data' : 'Show loading'}</Button>
        {loading ? (
          <Table.Skeleton aria-label="Repository activity" columns={skeletonColumns} rows={3} />
        ) : (
          <DataTable
            aria-label="Repository activity"
            columns={skeletonColumns}
            data={[{id: 1, name: 'primer/react', issues: 7}]}
          />
        )}
      </div>
    )
  },
}
