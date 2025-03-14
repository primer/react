import React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import {List} from './List'
import {ListItem} from './ListItem'
// make this List.Item

type Story = StoryObj<typeof List>

const meta: Meta<typeof List> = {
  title: 'Experimental/Components/List',
  component: List,
}

export default meta

export const Default: Story = {
  render: () => (
    <List>
      <ListItem>
        <ListItem.LeadingVisual>Leading Visual</ListItem.LeadingVisual>
        <ListItem.Label>Label</ListItem.Label>
        <ListItem.Description>Description</ListItem.Description>
        <ListItem.TrailingVisual>Trailing Visual</ListItem.TrailingVisual>
      </ListItem>
    </List>
  ),
}
