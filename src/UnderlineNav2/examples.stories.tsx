import React from 'react'
import {
  EyeIcon,
  CodeIcon,
  IssueOpenedIcon,
  GitPullRequestIcon,
  CommentDiscussionIcon,
  ProjectIcon,
  ShieldIcon,
  GearIcon,
  GraphIcon,
  PlayIcon
} from '@primer/octicons-react'
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

const items: any[] = [
  {title: 'Code', icon: CodeIcon},
  {title: 'Issues', icon: IssueOpenedIcon, counter: 12},
  {title: 'Pull Requests', icon: GitPullRequestIcon, counter: 6},
  {title: 'Discussions', icon: CommentDiscussionIcon, counter: 7},
  {title: 'Actions', icon: PlayIcon, counter: 1},
  {title: 'Projects', icon: ProjectIcon, counter: 22},
  {title: 'Wiki', icon: EyeIcon, counter: 9},
  {title: 'Security', icon: ShieldIcon, counter: 7},
  {title: 'Insights', icon: GraphIcon, counter: 123},
  {title: 'Settings', icon: GearIcon, counter: 7}
]

export const InternalResponsiveNav = (args: UnderlineNavProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  return (
    <UnderlineNav {...args}>
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item.title}
          leadingIcon={item.icon}
          selected={index === selectedIndex}
          onSelect={() => setSelectedIndex(index)}
          counter={item.counter}
        >
          {item.title}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  )
}

export const HorizontalScrollNav = (args: UnderlineNavProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(2)
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
