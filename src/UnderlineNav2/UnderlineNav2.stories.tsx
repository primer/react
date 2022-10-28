import React from 'react'
import {Meta, Story} from '@storybook/react'
import {BaseStyles, ThemeProvider} from '..'
import {UnderlineNav} from './index'
import {UnderlineNavItem} from './UnderlineNavItem'

export default {
  title: 'Drafts/Components/UnderlineNav',
  component: UnderlineNav,
  subcomponents: {UnderlineNavItem},
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
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
      exclude: ['sx', 'as', 'variant', 'align']
    }
  },
  argTypes: {
    'aria-label': {
      type: {
        name: 'string'
      }
    },
    loadingCounters: {
      control: {
        type: 'boolean'
      }
    }
  },
  args: {
    'aria-label': 'Repository',
    loadingCounters: false
  }
} as Meta

export const Playground: Story = args => {
  return (
    <UnderlineNav {...args}>
      <UnderlineNav.Item selected>Code</UnderlineNav.Item>
      <UnderlineNav.Item>Issues</UnderlineNav.Item>
      <UnderlineNav.Item>Pull Requests</UnderlineNav.Item>
    </UnderlineNav>
  )
}
