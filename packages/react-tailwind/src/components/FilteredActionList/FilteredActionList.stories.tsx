import type {Meta, StoryObj} from '@storybook/react-vite'
import {FilteredActionListComponent as FilteredActionList} from './FilteredActionList'

const meta = {
  title: 'React Tailwind/Components/FilteredActionList',
  component: FilteredActionList,
} satisfies Meta<typeof FilteredActionList>

export default meta

type Story = StoryObj<typeof meta>
const items = [
  {id: 'apple', text: 'Apple'},
  {id: 'banana', text: 'Banana'},
  {id: 'orange', text: 'Orange'},
]

export const Default: Story = {args: {items}, render: () => <FilteredActionList items={items} />}
export const Playground: Story = {
  args: {items},
  render: () => <FilteredActionList items={items} selectionVariant="multiple" defaultSelectedItemIds={['apple']} />,
}
