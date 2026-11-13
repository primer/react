import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {DataTable, type DataTableProps} from './DataTable'
import {Label} from '../Label'
import {LabelGroup} from '../LabelGroup'
import {RelativeTime} from '../RelativeTime'
import {Table} from './index'

interface Repository {
  id: number
  name: string
  type: 'public' | 'internal'
  updatedAt: number
  securityFeatures: {
    dependabot: string[]
    codeScanning: string[]
  }
}

function RepositoryTable(props: DataTableProps<Repository>) {
  return <DataTable {...props} />
}

const meta = {
  title: 'React Tailwind/Data/DataTable',
  component: RepositoryTable,
  argTypes: {
    columns: {control: false},
    data: {control: false},
    cellPadding: {control: 'radio', options: ['condensed', 'normal', 'spacious']},
    externalSorting: {control: 'boolean'},
    initialSortColumn: {
      control: 'select',
      options: [undefined, 'name', 'type', 'updatedAt', 'dependabot', 'codeScanning'],
    },
    initialSortDirection: {control: 'radio', options: ['ASC', 'DESC']},
  },
} satisfies Meta<typeof RepositoryTable>

export default meta

type Story = StoryObj

const now = Date.now()
const minute = 60 * 1000
const hour = 60 * minute
const day = 24 * hour
const week = 7 * day
const month = 4 * week
const data: Repository[] = [
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
    updatedAt: now - 3 * month,
    securityFeatures: {dependabot: ['alerts'], codeScanning: []},
  },
]
const columns: DataTableProps<Repository>['columns'] = [
  {field: 'name', header: 'Repository', rowHeader: true},
  {
    field: 'type',
    header: 'Type',
    renderCell: row => <Label>{uppercase(row.type)}</Label>,
  },
  {field: 'updatedAt', header: 'Updated', renderCell: row => <RelativeTime date={new Date(row.updatedAt)} />},
  {
    field: 'securityFeatures',
    id: 'dependabot',
    header: 'Dependabot',
    renderCell: row => (
      <LabelGroup>
        {row.securityFeatures.dependabot.map(feature => (
          <Label key={feature}>{uppercase(feature)}</Label>
        ))}
      </LabelGroup>
    ),
  },
  {
    field: 'securityFeatures',
    id: 'codeScanning',
    header: 'Code scanning',
    renderCell: row => (
      <LabelGroup>
        {row.securityFeatures.codeScanning.map(feature => (
          <Label key={feature}>{uppercase(feature)}</Label>
        ))}
      </LabelGroup>
    ),
  },
]

function uppercase(input: string) {
  return input[0].toUpperCase() + input.slice(1)
}

export const Default: Story = {
  args: {columns: [], data: []},
  render: () => (
    <Table.Container>
      <Table.Title id="repositories">Repositories</Table.Title>
      <Table.Subtitle id="repositories-subtitle">
        A subtitle could appear here to give extra context to the data.
      </Table.Subtitle>
      <DataTable
        aria-describedby="repositories-subtitle"
        aria-labelledby="repositories"
        data={data}
        columns={columns}
      />
    </Table.Container>
  ),
}

export const Playground: Story = {
  args: {
    cellPadding: 'normal',
    externalSorting: false,
    initialSortColumn: undefined,
    initialSortDirection: 'ASC',
  },
  render: args => <PlaygroundTable {...args} />,
}

function PlaygroundTable({
  cellPadding,
  externalSorting,
  initialSortColumn,
  initialSortDirection,
}: Pick<DataTableProps<Repository>, 'cellPadding' | 'externalSorting' | 'initialSortColumn' | 'initialSortDirection'>) {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 5
  const rows = data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  return (
    <Table.Container>
      <Table.Title id="repositories">Repositories</Table.Title>
      <Table.Subtitle id="repositories-subtitle">
        A subtitle could appear here to give extra context to the data.
      </Table.Subtitle>
      <DataTable
        aria-describedby="repositories-subtitle"
        aria-labelledby="repositories"
        cellPadding={cellPadding}
        columns={columns}
        data={rows}
        externalSorting={externalSorting}
        initialSortColumn={initialSortColumn}
        initialSortDirection={initialSortDirection}
      />
      <Table.Pagination
        pageSize={pageSize}
        totalCount={data.length}
        onChange={({pageIndex: nextPageIndex}) => setPageIndex(nextPageIndex)}
      />
    </Table.Container>
  )
}
