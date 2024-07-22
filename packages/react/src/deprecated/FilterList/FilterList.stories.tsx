import React, {useState} from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import FilterList from './FilterList'

export default {
  title: 'Deprecated/Components/FilterList',
  component: FilterList,
} as Meta<typeof FilterList>

export const Default = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  return (
    <FilterList>
      <FilterList.Item selected={selectedIndex === 0} onClick={() => setSelectedIndex(0)} count={32}>
        First Filter
      </FilterList.Item>
      <FilterList.Item selected={selectedIndex === 1} onClick={() => setSelectedIndex(1)} count={16}>
        Second Filter
      </FilterList.Item>
      <FilterList.Item selected={selectedIndex === 2} onClick={() => setSelectedIndex(2)}>
        Third Filter
      </FilterList.Item>
    </FilterList>
  )
}

export const Playground: StoryFn<typeof FilterList> = args => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  return (
    <FilterList {...args}>
      <FilterList.Item selected={selectedIndex === 0} onClick={() => setSelectedIndex(0)} count={32}>
        First Filter
      </FilterList.Item>
      <FilterList.Item selected={selectedIndex === 1} onClick={() => setSelectedIndex(1)} count={16}>
        Second Filter
      </FilterList.Item>
      <FilterList.Item selected={selectedIndex === 2} onClick={() => setSelectedIndex(2)}>
        Third Filter
      </FilterList.Item>
    </FilterList>
  )
}

Playground.args = {}

Playground.argTypes = {
  sx: {
    controls: false,
    table: {
      disabled: true,
    },
  },
}
