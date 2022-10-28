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
      // variant and size are developed in the first design iteration but then they are abondened.
      // Still keeping them on the source code for future reference but they are not exposed as props.
      // exclude: ['sx', 'as', 'variant', 'align']
      exclude: ['sx', 'as']
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
} as Meta

export const Playground: Story = args => {
  return (
    // <UnderlineNav>
    <UnderlineNav.Item selected {...args}>
      {args.children}
    </UnderlineNav.Item>
    // </UnderlineNav>
  )
}
