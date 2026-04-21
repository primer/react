import type {Meta, StoryFn} from '@storybook/react-vite'
import {Placeholder} from '../Placeholder'
import {FilteredListLayout} from '../FilteredListLayout'

export default {
  title: 'Components/FilteredListLayout',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
} as Meta<typeof FilteredListLayout>

export const Default: StoryFn = () => (
  <FilteredListLayout>
    <FilteredListLayout.Header>
      <Placeholder label="Header (page title + primary action)" height={64} />
    </FilteredListLayout.Header>
    <FilteredListLayout.Sidebar position="start" aria-label="Sidebar">
      <Placeholder label="Sidebar" height={400} />
    </FilteredListLayout.Sidebar>
    <FilteredListLayout.Content>
      <Placeholder label="Filter bar" height={48} />
      <Placeholder label="Results" height={552} />
    </FilteredListLayout.Content>
  </FilteredListLayout>
)
