import React from 'react'
import {Meta, Story} from '@storybook/react'
import {BaseStyles, ThemeProvider} from '..'
import {UnderlineNav} from './index'
import {UnderlineNavItem} from './UnderlineNavItem'
import {CodeIcon, GitPullRequestIcon, PeopleIcon} from '@primer/octicons-react'

const icons = {CodeIcon, GitPullRequestIcon, PeopleIcon}

export default {
  title: 'Drafts/Components/UnderlineNav/UnderlineNav.Item',
  component: UnderlineNavItem,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <UnderlineNav aria-label="Repository">
              <Story />
            </UnderlineNav>
          </BaseStyles>
        </ThemeProvider>
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
    icon: {
      options: Object.keys(icons),
      control: {
        type: 'select'
      },
      mapping: icons
    }
  }
} as Meta<typeof UnderlineNavItem>

export const Playground: Story = args => {
  return (
    <UnderlineNav.Item selected {...args}>
      {args.children}
    </UnderlineNav.Item>
  )
}
