import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {DataTable, type Column} from './DataTable'

type Issue = {id: number; title: string; state: string}

const columns: Array<Column<Issue>> = [
  {field: 'title', header: 'Title', rowHeader: true},
  {field: 'state', header: 'State'},
]

const meta = {
  title: 'React Tailwind/Data/DataTable/Examples',
  component: DataTable<Issue>,
} satisfies Meta<typeof DataTable<Issue>>

export default meta
type Story = StoryObj<typeof meta>

export const MinimalIssues: Story = {
  args: {
    'aria-label': 'Issues',
    columns,
    data: [{id: 1, title: 'Improve docs', state: 'Open'}],
  },
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('rowheader', {name: 'Improve docs'})).toBeVisible()
  },
}
