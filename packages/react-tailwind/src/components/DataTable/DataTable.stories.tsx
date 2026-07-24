import type {Meta, StoryObj} from '@storybook/react-vite'
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
} satisfies Meta<typeof RepositoryTable>

export default meta

type Story = StoryObj<typeof meta>

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
    securityFeatures: {dependabot: ['Alerts', 'Security updates'], codeScanning: ['Report secrets']},
  },
  {
    id: 2,
    name: 'aegir',
    type: 'public',
    updatedAt: now - 5 * minute,
    securityFeatures: {dependabot: ['Alerts'], codeScanning: ['Report secrets']},
  },
  {id: 3, name: 'strapi', type: 'public', updatedAt: now - hour, securityFeatures: {dependabot: [], codeScanning: []}},
  {
    id: 4,
    name: 'codeql-ci-nightlies',
    type: 'public',
    updatedAt: now - 6 * hour,
    securityFeatures: {dependabot: ['Alerts'], codeScanning: []},
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
    securityFeatures: {dependabot: ['Alerts'], codeScanning: []},
  },
  {
    id: 8,
    name: 'docker-templates',
    type: 'public',
    updatedAt: now - 3 * month,
    securityFeatures: {dependabot: ['Alerts'], codeScanning: []},
  },
]

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
        columns={[
          {field: 'name', header: 'Repository', rowHeader: true},
          {
            field: 'type',
            header: 'Type',
            renderCell: row => <Label>{row.type === 'internal' ? 'Internal' : 'Public'}</Label>,
          },
          {field: 'updatedAt', header: 'Updated', renderCell: row => <RelativeTime date={new Date(row.updatedAt)} />},
          {
            field: 'securityFeatures',
            id: 'dependabot',
            header: 'Dependabot',
            renderCell: row => (
              <LabelGroup>
                {row.securityFeatures.dependabot.map(feature => (
                  <Label key={feature}>{feature}</Label>
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
                  <Label key={feature}>{feature}</Label>
                ))}
              </LabelGroup>
            ),
          },
        ]}
      />
    </Table.Container>
  ),
}
