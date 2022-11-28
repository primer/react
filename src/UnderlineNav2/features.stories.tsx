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
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport'

export default {
  title: 'Drafts/Components/UnderlineNav/Features'
} as Meta

export const Default = () => {
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
      <UnderlineNav.Item aria-current="page" icon={CodeIcon} counter="11K">
        Code
      </UnderlineNav.Item>
      <UnderlineNav.Item icon={IssueOpenedIcon} counter={12}>
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

export const OverflowTemplate = ({initialSelectedIndex = 1}: {initialSelectedIndex?: number}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(initialSelectedIndex)
  return (
    <UnderlineNav aria-label="Repository">
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item.navigation}
          icon={item.icon}
          aria-current={index === selectedIndex ? 'page' : undefined}
          onSelect={event => {
            event.preventDefault()
            setSelectedIndex(index)
          }}
          counter={item.counter}
          href={item.href}
        >
          {item.navigation}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  )
}

export const OverflowOnNarrowScreen = () => {
  return <OverflowTemplate initialSelectedIndex={1} />
}

OverflowOnNarrowScreen.parameters = {
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      narrowScreen: {
        name: 'Narrow Screen',
        styles: {
          width: '800px',
          height: '100%'
        }
      }
    },
    defaultViewport: 'narrowScreen'
  }
}

export const CountersLoadingState = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  return (
    <UnderlineNav aria-label="Repository with loading counters" loadingCounters={true}>
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item.navigation}
          icon={item.icon}
          aria-current={index === selectedIndex ? 'page' : undefined}
          onSelect={() => setSelectedIndex(index)}
          counter={item.counter}
        >
          {item.navigation}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  )
}
