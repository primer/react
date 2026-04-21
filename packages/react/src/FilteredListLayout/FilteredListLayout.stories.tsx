import type {Meta, StoryFn} from '@storybook/react-vite'
import {Button, IconButton} from '../Button'
import {KebabHorizontalIcon} from '@primer/octicons-react'
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
    <FilteredListLayout.Sidebar position="start" aria-label="Sidebar">
      <Placeholder label="Sidebar" height={400} />
    </FilteredListLayout.Sidebar>
    <FilteredListLayout.Content>
      <FilteredListLayout.Header
        title="Assigned to you"
        actions={
          <>
            <Button variant="primary">New issue</Button>
            <IconButton icon={KebabHorizontalIcon} aria-label="More options" />
          </>
        }
      />
      <FilteredListLayout.FilterBar aria-label="Filters">
        <Placeholder label="Filter bar" height={48} />
      </FilteredListLayout.FilterBar>
      <FilteredListLayout.Results aria-label="Results">
        <Placeholder label="Content" height={552} />
      </FilteredListLayout.Results>
    </FilteredListLayout.Content>
  </FilteredListLayout>
)
