import React from 'react'
import {Meta, Story} from '@storybook/react'
import {BaseStyles, ThemeProvider} from '..'
import {UnderlineNav} from './index'
import {UnderlineNavItem} from './UnderlineNavItem'

const excludedControlKeys = ['sx', 'as', 'variant', 'align', 'afterSelect']

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
      exclude: excludedControlKeys
    }
  },
  argTypes: {
    'aria-label': {
      type: {
        name: 'string'
      }
    },
    children: {
      options: ['Code', 'Pull requests', 'Actions', 'Projects', 'Wiki', 'Security', 'Insights', 'Settings'],
      control: {
        type: 'multi-select'
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
    loadingCounters: false,
    children: ['Code', 'Pull requests', 'Actions', 'Projects', 'Wiki']
  }
} as Meta<typeof UnderlineNav>

export const Playground: Story = args => {
  return (
    <UnderlineNav {...args}>
      {args.children.map((child: string, index: number) => (
        <UnderlineNavItem key={index} href="#" selected={index === 0}>
          {child}
        </UnderlineNavItem>
      ))}
    </UnderlineNav>
  )
}
