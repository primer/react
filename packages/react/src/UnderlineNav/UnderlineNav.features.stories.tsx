import React from 'react'
import {
  EyeIcon,
  CodeIcon,
  IssueOpenedIcon,
  GitPullRequestIcon,
  CommentDiscussionIcon,
  PlayIcon,
  ProjectIcon,
  GraphIcon,
  ShieldLockIcon,
  GearIcon,
} from '@primer/octicons-react'
import type {Meta} from '@storybook/react-vite'
import {UnderlineNav} from './index'
import {INITIAL_VIEWPORTS} from 'storybook/viewport'
import Popover from '../Popover'

const meta = {
  title: 'Components/UnderlineNav/Features',
} satisfies Meta<typeof UnderlineNav>

export default meta

export const Default = () => {
  return (
    <UnderlineNav aria-label="Repository">
      <UnderlineNav.Item aria-current="page">Code</UnderlineNav.Item>
      <UnderlineNav.Item>Issues</UnderlineNav.Item>
      <UnderlineNav.Item>Pull Requests</UnderlineNav.Item>
    </UnderlineNav>
  )
}

export const WithIcons = () => {
  return (
    <UnderlineNav aria-label="Repository with icons">
      <UnderlineNav.Item leadingVisual={<CodeIcon />}>Code</UnderlineNav.Item>
      <UnderlineNav.Item leadingVisual={<EyeIcon />} counter={6}>
        Issues
      </UnderlineNav.Item>
      <UnderlineNav.Item aria-current="page" leadingVisual={<GitPullRequestIcon />}>
        Pull Requests
      </UnderlineNav.Item>
      <UnderlineNav.Item leadingVisual={<CommentDiscussionIcon />} counter={7}>
        Discussions
      </UnderlineNav.Item>
      <UnderlineNav.Item leadingVisual={<ProjectIcon />}>Projects</UnderlineNav.Item>
    </UnderlineNav>
  )
}

export const WithCounterLabels = () => {
  return (
    <UnderlineNav aria-label="Repository with counters">
      <UnderlineNav.Item aria-current="page" leadingVisual={<CodeIcon />} counter="11K">
        Code
      </UnderlineNav.Item>
      <UnderlineNav.Item leadingVisual={<IssueOpenedIcon />} counter={12}>
        Issues
      </UnderlineNav.Item>
    </UnderlineNav>
  )
}

const items: {navigation: string; icon: React.ReactElement; counter?: number | string; href?: string}[] = [
  {navigation: 'Code', icon: <CodeIcon />, href: '#code'},
  {navigation: 'Issues', icon: <IssueOpenedIcon />, counter: '12K', href: '#issues'},
  {navigation: 'Pull Requests', icon: <GitPullRequestIcon />, counter: 13, href: '#pull-requests'},
  {navigation: 'Discussions', icon: <CommentDiscussionIcon />, counter: 5, href: '#discussions'},
  {navigation: 'Actions', icon: <PlayIcon />, counter: 4, href: '#actions'},
  {navigation: 'Projects', icon: <ProjectIcon />, counter: 9, href: '#projects'},
  {navigation: 'Insights', icon: <GraphIcon />, counter: '0', href: '#insights'},
  {navigation: 'Settings', icon: <GearIcon />, counter: 10, href: '#settings'},
  {navigation: 'Security', icon: <ShieldLockIcon />, href: '#security'},
]

export const OverflowTemplate = ({initialSelectedIndex = 1}: {initialSelectedIndex?: number}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(initialSelectedIndex)
  return (
    <UnderlineNav
      aria-label="Repository"
      // @ts-ignore UnderlineNav does not take selectionVariant prop, but we need to pass it to the underlying ActionList so it doesn't show Selections.
      selectionVariant={undefined}
    >
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item.navigation}
          leadingVisual={item.icon}
          aria-current={index === selectedIndex ? 'page' : undefined}
          // Set so that navigation in interaction tests does not cause the
          // page to load the storybook iframe URL and instead keeps the test in
          // the local preview
          target="_self"
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
          height: '100%',
        },
      },
    },
    defaultViewport: 'narrowScreen',
  },
}

export const CountersLoadingState = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  return (
    <UnderlineNav aria-label="Repository with loading counters" loadingCounters={true}>
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item.navigation}
          leadingVisual={item.icon}
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

export const VariantFlush = () => {
  return (
    <UnderlineNav aria-label="Repository" variant="flush">
      <UnderlineNav.Item aria-current="page">Code</UnderlineNav.Item>
      <UnderlineNav.Item>Issues</UnderlineNav.Item>
      <UnderlineNav.Item>Pull Requests</UnderlineNav.Item>
    </UnderlineNav>
  )
}

export const WithPopover = () => {
  return (
    <UnderlineNav aria-label="Repository">
      <UnderlineNav.Item href="#code" leadingVisual={<CodeIcon />}>
        Code
      </UnderlineNav.Item>
      <UnderlineNav.Item href="#issues" leadingVisual={<IssueOpenedIcon />}>
        Issues
      </UnderlineNav.Item>
      <UnderlineNav.Item href="#security" leadingVisual={<ShieldLockIcon />} counter={12}>
        Security
        <Popover
          open={true}
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 'var(--base-size-12)',
          }}
        >
          <Popover.Content>Popover content</Popover.Content>
        </Popover>
      </UnderlineNav.Item>
      <UnderlineNav.Item href="#insights" leadingVisual={<GraphIcon />}>
        Insights
      </UnderlineNav.Item>
      <UnderlineNav.Item href="#settings" leadingVisual={<GearIcon />}>
        Settings
      </UnderlineNav.Item>
    </UnderlineNav>
  )
}
