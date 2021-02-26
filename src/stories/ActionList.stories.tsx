import {Meta} from '@storybook/react'
import React from 'react'
import {ActionList, ActionListItem, ActionListSection, ActionListSectionHeader} from '../ActionList'
import BaseStyles from '../BaseStyles'

const meta: Meta = {
  title: 'Composite components/ActionList',
  component: ActionList,
  decorators: [
    (Story: React.ComponentType): JSX.Element => (
      <BaseStyles>
        <Story />
      </BaseStyles>
    )
  ]
}
export default meta

export function ActionListStory(): JSX.Element {
  return (
    <>
      <h1>ActionListSectionHeader</h1>
      <h2>Filled Variant</h2>
      <ActionList>
        <ActionListSection>
          <ActionListItem text="Rename" />
          <ActionListItem text="Duplicate" />
        </ActionListSection>
        <ActionListSection>
          <ActionListSectionHeader title="Live query" variant="subtle" />
          <ActionListItem text="">
            <div>repo:github/memex,github/github</div>
            <div>labels:Flux,Q2</div>
          </ActionListItem>
        </ActionListSection>
        <ActionListSection>
          <ActionListSectionHeader title="View layout" variant="subtle" />
          <ActionListItem
            text="Table"
            description="Information-dense table optimized for operations across items"
            descriptionVariant="block"
          />
          <ActionListItem
            text="Board"
            description="Kanban-style board focused on visual states"
            descriptionVariant="block"
          />
        </ActionListSection>
        <ActionListSection>
          <ActionListItem text="Save sort and filters to current view" />
          <ActionListItem text="Save sort and filters to new view" />
        </ActionListSection>
        <ActionListSection>
          <ActionListItem text="View settings" />
        </ActionListSection>
      </ActionList>
    </>
  )
}

export function ActionListSectionHeaderStory(): JSX.Element {
  return (
    <>
      <h1>ActionListSectionHeader</h1>
      <h2>Filled Variant</h2>
      <ActionListSectionHeader title="View layout" variant="filled" />
      <h2>Subtle Variant</h2>
      <ActionListSectionHeader title="View layout" variant="subtle" />
    </>
  )
}
