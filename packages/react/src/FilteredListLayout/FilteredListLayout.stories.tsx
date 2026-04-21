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
    <FilteredListLayout.Header>
      <Placeholder label="Header" height={64} />
    </FilteredListLayout.Header>
    <FilteredListLayout.Pane position="start" aria-label="Sidebar">
      <Placeholder label="Pane" height={400} />
    </FilteredListLayout.Pane>
    <FilteredListLayout.Content>
      <FilteredListLayout.ViewHeader
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
