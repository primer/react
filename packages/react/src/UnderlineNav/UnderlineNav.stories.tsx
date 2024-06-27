import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import {UnderlineNav} from './index'
import {UnderlineNavItem} from './UnderlineNavItem'

const excludedControlKeys = ['sx', 'as', 'variant', 'align', 'afterSelect']

export default {
  title: 'Components/UnderlineNav',
  component: UnderlineNav,
  subcomponents: {UnderlineNavItem},
  parameters: {
    controls: {
      expanded: true,
      // variant and size are developed in the first design iteration but then they are abondened.
      // Still keeping them on the source code for future reference but they are not exposed as props.
      exclude: excludedControlKeys,
    },
  },
  argTypes: {
    'aria-label': {
      type: {
        name: 'string',
      },
    },
    loadingCounters: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    'aria-label': 'Repository',
    loadingCounters: false,
  },
} as Meta<typeof UnderlineNav>

export const Default: StoryFn<typeof UnderlineNav> = () => {
  const children = ['Code', 'Pull requests', 'Actions', 'Projects', 'Wiki']
  return (
    <UnderlineNav aria-label="Repository">
      {children.map((child: string, index: number) => (
        <UnderlineNavItem key={index} href="#" aria-current={index === 0 ? 'page' : undefined}>
          {child}
        </UnderlineNavItem>
      ))}
    </UnderlineNav>
  )
}

export const Playground: StoryFn<typeof UnderlineNav> = args => {
  const children = ['Code', 'Pull requests', 'Actions', 'Projects', 'Wiki']
  return (
    <UnderlineNav {...args}>
      {children.map((child: string, index: number) => (
        <UnderlineNavItem key={index} href="#" aria-current={index === 0 ? 'page' : undefined}>
          {child}
        </UnderlineNavItem>
      ))}
    </UnderlineNav>
  )
}
