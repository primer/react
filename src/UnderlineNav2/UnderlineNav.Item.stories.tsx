import React from 'react'
import {Meta, Story} from '@storybook/react'
import {UnderlineNav} from './index'
import {UnderlineNavItem} from './UnderlineNavItem'
import {CodeIcon, GitPullRequestIcon, PeopleIcon} from '@primer/octicons-react'
import {OcticonArgType} from '../utils/story-helpers'

export default {
  title: 'Drafts/Components/UnderlineNav/UnderlineNav.Item',
  component: UnderlineNavItem,
  decorators: [
    Story => {
      return (
        <UnderlineNav aria-label="Repository">
          <Story />
        </UnderlineNav>
      )
    }
  ],
  parameters: {
    controls: {
      expanded: true,
      exclude: ['as']
    }
  },
  args: {
    children: 'Code',
    counter: '12K',
    icon: PeopleIcon
  },
  argTypes: {
    children: {
      type: 'string'
    },
    counter: {
      type: 'string'
    },
    icon: OcticonArgType([CodeIcon, GitPullRequestIcon, PeopleIcon])
  }
} as Meta<typeof UnderlineNavItem>

// UnderlineNav.Item controls only work on the "Docs" tab. Because UnderlineNav children don't get re-rendered when they are changed.
// This is an intentional behaviour of UnderlineNav for keeping a selected menu item visible. I will update here once I find a better solution.
// In the meantime, you can use the "Docs" tab to see the controls.

export const Playground: Story = args => {
  return (
    <UnderlineNavItem selected {...args}>
      {args.children}
    </UnderlineNavItem>
  )
}
