import React from 'react'
import {Story, Meta} from '@storybook/react'
import {ActionList} from '.'
import {Divider, ActionListDividerProps} from './Divider'

export default {
  title: 'Components/ActionList/Divider',
  component: Divider
} as Meta<typeof Divider>

export const Playground: Story<ActionListDividerProps> = args => (
  <ActionList>
    <ActionList.Divider {...args} />
  </ActionList>
)
