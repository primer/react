import React from 'react'
import {Story, Meta} from '@storybook/react'
import {ActionList} from '.'
import {Group, ActionListGroupProps} from './Group'

export default {
  title: 'Components/ActionList/Group',
  component: Group,
  args: {
    variant: 'subtle',
    role: 'listbox',
    title: 'Group title',
    auxiliaryText: ''
  },
  argTypes: {
    variant: {
      control: {
        type: 'radio'
      },
      options: ['subtle', 'filled']
    },
    role: {
      type: 'string'
    },
    title: {
      type: 'string'
    },
    auxiliaryText: {
      type: 'string'
    }
  }
  // parameters: {controls: {exclude: excludedControlKeys}}
} as Meta<typeof Group>

export const Playground: Story<ActionListGroupProps> = args => (
  <ActionList>
    <ActionList.Group {...args}>
      <ActionList.Item>Item 1</ActionList.Item>
      <ActionList.Item>Item 2</ActionList.Item>
    </ActionList.Group>
  </ActionList>
)
