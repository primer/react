import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import UnderlinePanels from './UnderlinePanels'
import {PeopleIcon, TerminalIcon, CodespacesIcon} from '@primer/octicons-react'
import {OcticonArgType} from '../../utils/story-helpers'

export default {
  title: 'Experimental/Components/UnderlinePanels.Tab',
  component: UnderlinePanels.Tab,
  decorators: [
    Story => {
      return (
        <UnderlinePanels aria-label="Select a tab">
          <Story />
        </UnderlinePanels>
      )
    },
  ],
  parameters: {
    controls: {
      expanded: true,
      exclude: ['as'],
    },
  },
  args: {
    'aria-selected': true,
    counter: '14K',
    icon: PeopleIcon,
  },
  argTypes: {
    'aria-selected': {
      control: {
        type: 'boolean',
      },
    },
    counter: {
      type: 'string',
    },
    icon: OcticonArgType([PeopleIcon, TerminalIcon, CodespacesIcon]),
  },
} as Meta<typeof UnderlinePanels.Tab>

export const Playground: StoryFn = args => {
  return <UnderlinePanels.Tab {...args}>Users{args.children}</UnderlinePanels.Tab>
}
