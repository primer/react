/* eslint-disable primer-react/spread-props-first */
import type {Meta, StoryFn} from '@storybook/react-vite'
import {UnderlineNav} from './index'
import {UnderlineNavItem} from './UnderlineNavItem'
import {CodeIcon, GitPullRequestIcon, PeopleIcon} from '@primer/octicons-react'
import {OcticonArgType} from '../utils/story-helpers'

export default {
  title: 'Components/UnderlineNav/UnderlineNav.Item',
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

export const Playground: StoryFn = args => {
  return (
    <UnderlineNavItem aria-current="page" {...args}>
      {args.children}
    </UnderlineNavItem>
  )
}
