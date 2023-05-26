import {CodeIcon, GitPullRequestIcon, PeopleIcon} from '@primer/octicons-react'
import {Meta, Story} from '@storybook/react'
import React from 'react'
import {OcticonArgType} from '../utils/story-helpers'
import {UnderlineNavItem} from './UnderlineNavItem'
import {UnderlineNav} from './index'

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
    },
  ],
  parameters: {
    controls: {
      expanded: true,
      exclude: ['as'],
    },
  },
  args: {
    children: 'Code',
    counter: '12K',
    icon: PeopleIcon,
  },
  argTypes: {
    children: {
      type: 'string',
    },
    counter: {
      type: 'string',
    },
    icon: OcticonArgType([CodeIcon, GitPullRequestIcon, PeopleIcon]),
  },
} as Meta<typeof UnderlineNavItem>

export const Playground: Story = args => {
  return (
    <UnderlineNavItem aria-current="page" {...args}>
      {args.children}
    </UnderlineNavItem>
  )
}
