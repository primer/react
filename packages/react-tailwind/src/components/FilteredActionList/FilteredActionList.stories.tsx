import React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {FilteredActionListComponent as FilteredActionList} from './FilteredActionList'

const meta = {
  title: 'React Tailwind/Components/FilteredActionList',
  component: FilteredActionList,
} satisfies Meta<typeof FilteredActionList>

export default meta

type Story = StoryObj<typeof meta>
const items = [
  {id: '1', color: '#a2eeef', text: 'enhancement'},
  {id: '2', color: '#d73a4a', text: 'bug'},
  {id: '3', color: '#0cf478', text: 'good first issue'},
  {id: '4', color: '#ffd78e', text: 'design'},
  {id: '5', color: '#ff0000', text: 'blocker'},
  {id: '6', color: '#a4f287', text: 'backend'},
  {id: '7', color: '#8dc6fc', text: 'frontend'},
]

const renderedItems = items.map(item => ({
  id: item.id,
  filterValue: item.text,
  text: (
    <>
      <span
        aria-hidden="true"
        className="block size-3.5 rounded-full border"
        style={{backgroundColor: item.color, borderColor: item.color}}
      />
      {item.text}
    </>
  ),
}))

export const Default: Story = {
  args: {items: renderedItems},
  render: () => {
    const [filter, setFilter] = React.useState('')
    const filteredItems = renderedItems.filter(item => item.filterValue.startsWith(filter.toLowerCase()))
    return (
      <>
        <h1>Filtered Action List</h1>
        <div>Please select labels that describe your issue:</div>
        <FilteredActionList
          className="mt-0"
          items={filteredItems}
          onFilterChange={setFilter}
          placeholderText="Filter Labels"
        />
      </>
    )
  },
}
export const Playground: Story = {
  args: {items: renderedItems},
  render: () => <FilteredActionList items={renderedItems} selectionVariant="multiple" defaultSelectedItemIds={['1']} />,
}
