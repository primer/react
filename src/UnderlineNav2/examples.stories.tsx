import React from 'react'
import {EyeIcon, CodeIcon, IssueOpenedIcon, GitPullRequestIcon, CommentDiscussionIcon} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import {UnderlineNav, UnderlineNavProps} from './index'
import {BaseStyles, ThemeProvider} from '..'

export default {
  title: 'Layout/UnderlineNav/examples',
  argTypes: {
    align: {
      defaultValue: 'left',
      control: {
        type: 'radio',
        options: ['left', 'right']
      }
    },
    variant: {
      defaultValue: 'default',
      control: {
        type: 'radio',
        options: ['default', 'small']
      }
    }
  },
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
  ]
} as Meta

export const DefaultNav = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args}>
      <UnderlineNav.Item selected>Item 1</UnderlineNav.Item>
      <UnderlineNav.Item>Item 2</UnderlineNav.Item>
      <UnderlineNav.Item>Item 3</UnderlineNav.Item>
    </UnderlineNav>
  )
}

export const withIcons = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args}>
      <UnderlineNav.Item leadingIcon={CodeIcon}>Code</UnderlineNav.Item>
      <UnderlineNav.Item leadingIcon={EyeIcon} counter={6}>
        Issues
      </UnderlineNav.Item>
      <UnderlineNav.Item selected leadingIcon={GitPullRequestIcon}>
        Pull Requests
      </UnderlineNav.Item>
      <UnderlineNav.Item leadingIcon={CommentDiscussionIcon} counter={7}>
        Discussions
      </UnderlineNav.Item>
      <UnderlineNav.Item leadingIcon={EyeIcon}>Item 1</UnderlineNav.Item>
    </UnderlineNav>
  )
}

export const withCounterLabels = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args}>
      <UnderlineNav.Item selected leadingIcon={CodeIcon}>
        Code
      </UnderlineNav.Item>
      <UnderlineNav.Item leadingIcon={IssueOpenedIcon} counter={12}>
        Issues
      </UnderlineNav.Item>
    </UnderlineNav>
  )
}

export const rightAlign = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args} align="right">
      <UnderlineNav.Item selected>Item 1</UnderlineNav.Item>
      <UnderlineNav.Item>Item 2dsjsjskdjkajsdhkajsdkasj</UnderlineNav.Item>
      <UnderlineNav.Item>Item 3</UnderlineNav.Item>
    </UnderlineNav>
  )
}

const items: string[] = [
  'Item 1',
  'Looooong Item',
  'Looooooonger item',
  'Item 4',
  'Item 5',
  'Item 6',
  'Item 7',
  'Item 8',
  'Item 9',
  'Item 10'
]

export const InternalResponsiveNav = (args: UnderlineNavProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  return (
    <UnderlineNav {...args}>
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item}
          leadingIcon={EyeIcon}
          selected={index === selectedIndex}
          onSelect={() => setSelectedIndex(index)}
        >
          {item}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  )
}

export const HorizontalScrollNav = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args} overflow="scroll">
      {items.map(item => (
        <UnderlineNav.Item key={item} leadingIcon={EyeIcon}>
          {item}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  )
}
