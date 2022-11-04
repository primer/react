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
import {UnderlineNav} from './index'
import {BaseStyles, ThemeProvider} from '..'

export default {
  title: 'Components/UnderlineNav',
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

export const DefaultNav = () => {
  return (
    <UnderlineNav aria-label="Repository">
      <UnderlineNav.Item aria-current="page">Code</UnderlineNav.Item>
      <UnderlineNav.Item>Issues</UnderlineNav.Item>
      <UnderlineNav.Item>Pull Requests</UnderlineNav.Item>
    </UnderlineNav>
  )
}

export const withIcons = () => {
  return (
    <UnderlineNav aria-label="Repository with icons">
      <UnderlineNav.Item icon={CodeIcon}>Code</UnderlineNav.Item>
      <UnderlineNav.Item icon={EyeIcon} counter={6}>
        Issues
      </UnderlineNav.Item>
      <UnderlineNav.Item aria-current="page" icon={GitPullRequestIcon}>
        Pull Requests
      </UnderlineNav.Item>
      <UnderlineNav.Item icon={CommentDiscussionIcon} counter={7}>
        Discussions
      </UnderlineNav.Item>
      <UnderlineNav.Item icon={ProjectIcon}>Projects</UnderlineNav.Item>
    </UnderlineNav>
  )
}

export const withCounterLabels = () => {
  return (
    <UnderlineNav aria-label="Repository with counters">
      <UnderlineNav.Item icon={CodeIcon}>Code</UnderlineNav.Item>
      <UnderlineNav.Item aria-current="page" icon={IssueOpenedIcon} counter={12}>
        Issues
      </UnderlineNav.Item>
    </UnderlineNav>
  )
}

const items: {navigation: string; icon: React.FC<IconProps>; counter?: number | string; href?: string}[] = [
  {navigation: 'Code', icon: CodeIcon, href: '#code'},
  {navigation: 'Issues', icon: IssueOpenedIcon, counter: '12K', href: '#issues'},
  {navigation: 'Pull Requests', icon: GitPullRequestIcon, counter: 13, href: '#pull-requests'},
  {navigation: 'Discussions', icon: CommentDiscussionIcon, counter: 5, href: '#discussions'},
  {navigation: 'Actions', icon: PlayIcon, counter: 4, href: '#actions'},
  {navigation: 'Projects', icon: ProjectIcon, counter: 9, href: '#projects'},
  {navigation: 'Insights', icon: GraphIcon, counter: '0', href: '#insights'},
  {navigation: 'Settings', icon: GearIcon, counter: 10, href: '#settings'},
  {navigation: 'Security', icon: ShieldLockIcon, href: '#security'}
]

export const InternalResponsiveNav = () => {
  const currentHref = '#code'
  return (
    <UnderlineNav aria-label="Repository">
      {items.map(item => (
        <UnderlineNav.Item
          key={item.navigation}
          icon={item.icon}
          aria-current={currentHref === item.href ? 'page' : undefined}
          counter={item.counter}
          href={item.href}
          onSelect={e => {
            e.preventDefault()
          }}
        >
          {item.navigation}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  )
}

export const CountersLoadingState = () => {
  const currentHref = '#code'
  return (
    <UnderlineNav aria-label="Repository with loading counters" loadingCounters={true}>
      {items.map(item => (
        <UnderlineNav.Item
          key={item.navigation}
          icon={item.icon}
          counter={item.counter}
          aria-current={currentHref === item.href ? 'page' : undefined}
        >
          {item.navigation}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  )
}
