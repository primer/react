import React from 'react'
import {Meta, ComponentStory} from '@storybook/react'
import FilteredSearch from './FilteredSearch'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import TextInput from '../TextInput'
import {SearchIcon} from '@primer/octicons-react'

export default {
  title: 'Components/FilteredSearch',
  component: FilteredSearch,
} as Meta<typeof FilteredSearch>

export const Default = () => (
  <FilteredSearch>
    <ActionMenu>
      <ActionMenu.Button as="summary">Filter</ActionMenu.Button>
      <ActionMenu.Overlay>
        <ActionList>
          <ActionList.Item>Item 1</ActionList.Item>
          <ActionList.Item>Item 2</ActionList.Item>
          <ActionList.Item>Item 3</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
    <TextInput aria-label="Filtered search" leadingVisual={SearchIcon} />
  </FilteredSearch>
)

export const Playground: ComponentStory<typeof FilteredSearch> = args => (
  <FilteredSearch {...args}>
    <ActionMenu>
      <ActionMenu.Button as="summary">Filter</ActionMenu.Button>
      <ActionMenu.Overlay>
        <ActionList>
          <ActionList.Item>Item 1</ActionList.Item>
          <ActionList.Item>Item 2</ActionList.Item>
          <ActionList.Item>Item 3</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
    <TextInput aria-label="Filtered search" leadingVisual={SearchIcon} />
  </FilteredSearch>
)

Playground.args = {}

Playground.argTypes = {}
