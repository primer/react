import React from 'react'
import {Story, Meta} from '@storybook/react'
import {ActionList, ActionListItemProps, LinkItem, Group, Divider, Description} from '.'
import {Item} from './Item'

export default {
  title: 'Components/ActionList',
  component: ActionList,
  subcomponents: {Item, LinkItem, Group, Divider, Description},
  args: {
    showDividers: false,
    selectionVariant: 'unset',
    variant: 'inset',
    role: 'listbox'
  },
  argTypes: {
    showDividers: {
      control: {
        type: 'boolean'
      }
    },
    variant: {
      control: {
        type: 'radio'
      },
      options: ['inset', 'full']
    },
    selectionVariant: {
      control: {
        type: 'radio',
        labels: ['single', 'multiple', 'unset']
      },
      options: [0, 1, 2],
      mapping: ['single', 'multiple', null]
    },
    role: {
      type: 'string'
    }
  }
  // parameters: {controls: {exclude: excludedControlKeys}}
} as Meta<typeof ActionList>

export const Playground: Story<typeof ActionList> = args => (
  <ActionList {...args}>
    <ActionList.Item>Copy link</ActionList.Item>
    <ActionList.Item>Quote reply</ActionList.Item>
    <ActionList.Item>Edit comment</ActionList.Item>
  </ActionList>
)
