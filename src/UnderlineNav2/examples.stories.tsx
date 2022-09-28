import React from 'react'
import {
  IconProps,
  EyeIcon,
  CodeIcon,
  IssueOpenedIcon,
  GitPullRequestIcon,
  CommentDiscussionIcon,
  PlayIcon,
  ProjectIcon,
  GraphIcon,
  ShieldLockIcon,
  GearIcon
} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import {UnderlineNav, UnderlineNavProps} from './index'
import {BaseStyles, ThemeProvider} from '..'

export default {
  title: 'Layout/UnderlineNav/examples',
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
      <UnderlineNav.Item icon={CodeIcon}>Code</UnderlineNav.Item>
      <UnderlineNav.Item icon={EyeIcon} counter={6}>
        Issues
      </UnderlineNav.Item>
      <UnderlineNav.Item selected icon={GitPullRequestIcon}>
        Pull Requests
      </UnderlineNav.Item>
      <UnderlineNav.Item icon={CommentDiscussionIcon} counter={7}>
        Discussions
      </UnderlineNav.Item>
      <UnderlineNav.Item icon={EyeIcon}>Item 1</UnderlineNav.Item>
    </UnderlineNav>
  )
}

export const withCounterLabels = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args}>
      <UnderlineNav.Item selected icon={CodeIcon}>
        Code
      </UnderlineNav.Item>
      <UnderlineNav.Item icon={IssueOpenedIcon} counter={12}>
        Issues
      </UnderlineNav.Item>
    </UnderlineNav>
  )
}

const items: {navigation: string; icon: React.FC<IconProps>; counter?: number}[] = [
  {navigation: 'Code', icon: CodeIcon},
  {navigation: 'Issues', icon: IssueOpenedIcon, counter: 120},
  {navigation: 'Pull Requests', icon: GitPullRequestIcon, counter: 13},
  {navigation: 'Discussions', icon: CommentDiscussionIcon, counter: 5},
  {navigation: 'Actions', icon: PlayIcon, counter: 4},
  {navigation: 'Projects', icon: ProjectIcon, counter: 9},
  {navigation: 'Insights', icon: GraphIcon},
  {navigation: 'Settings', icon: GearIcon, counter: 10},
  {navigation: 'Security', icon: ShieldLockIcon}
]

export const InternalResponsiveNav = (args: UnderlineNavProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  return (
    <UnderlineNav {...args}>
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item.navigation}
          icon={item.icon}
          selected={index === selectedIndex}
          onSelect={() => setSelectedIndex(index)}
          counter={item.counter}
        >
          {item.navigation}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  )
}

export const CountersLoadingState = (args: UnderlineNavProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  return (
    <UnderlineNav {...args} loadingCounters={true}>
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item.navigation}
          icon={item.icon}
          selected={index === selectedIndex}
          onSelect={() => setSelectedIndex(index)}
          counter={item.counter}
        >
          {item.navigation}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  )
}
