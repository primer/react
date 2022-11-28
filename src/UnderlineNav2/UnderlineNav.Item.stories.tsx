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

export const Playground: Story = args => {
  return (
    <UnderlineNavItem aria-current="page" {...args}>
      {args.children}
    </UnderlineNavItem>
  )
}
