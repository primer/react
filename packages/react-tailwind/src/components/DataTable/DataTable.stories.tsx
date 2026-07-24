import type {Meta, StoryObj} from '@storybook/react-vite'
import {DataTable, type DataTableProps} from './DataTable'

interface Repository {
  id: number
  name: string
  stars: number
}

function RepositoryTable(props: DataTableProps<Repository>) {
  return <DataTable {...props} />
}

const meta = {
  title: 'React Tailwind/Data/DataTable',
  component: RepositoryTable,
  args: {
    data: [{id: 1, name: 'Primer', stars: 42}],
    columns: [
      {field: 'name', header: 'Repository', rowHeader: true},
      {field: 'stars', header: 'Stars', sortBy: true},
    ],
  },
} satisfies Meta<typeof RepositoryTable>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <DataTable
      data={[{id: 1, name: 'Primer', stars: 42}]}
      columns={[
        {field: 'name', header: 'Repository', rowHeader: true},
        {field: 'stars', header: 'Stars', sortBy: true},
      ]}
    />
  ),
}
