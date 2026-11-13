import {
  CodeIcon,
  CommentDiscussionIcon,
  EyeIcon,
  GearIcon,
  GitPullRequestIcon,
  GraphIcon,
  IssueOpenedIcon,
  PlayIcon,
  ProjectIcon,
  ShieldLockIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {INITIAL_VIEWPORTS} from 'storybook/viewport'
import {UnderlineNav} from './UnderlineNav'

const meta = {title: 'React Tailwind/Navigation/UnderlineNav/Features', component: UnderlineNav} satisfies Meta<
  typeof UnderlineNav
>
export default meta
type Story = StoryObj<typeof meta>

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

export const Default: Story = {
  render: () => (
    <UnderlineNav aria-label="Repository">
      <UnderlineNav.Item aria-current="page">Code</UnderlineNav.Item>
      <UnderlineNav.Item>Issues</UnderlineNav.Item>
      <UnderlineNav.Item>Pull Requests</UnderlineNav.Item>
    </UnderlineNav>
  ),
}

export const WithIcons: Story = {
  render: () => (
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
  ),
}

export const WithCounterLabels: Story = {
  render: () => (
    <UnderlineNav aria-label="Repository with counters">
      <UnderlineNav.Item aria-current="page" leadingVisual={<CodeIcon />} counter="11K">
        Code
      </UnderlineNav.Item>
      <UnderlineNav.Item leadingVisual={<IssueOpenedIcon />} counter={12}>
        Issues
      </UnderlineNav.Item>
    </UnderlineNav>
  ),
}

function OverflowNav({initialSelectedIndex = 1}: {initialSelectedIndex?: number}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(initialSelectedIndex)
  return (
    <UnderlineNav aria-label="Repository" hideIconsBreakpoint="medium">
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item.navigation}
          aria-current={index === selectedIndex ? 'page' : undefined}
          counter={item.counter}
          href={item.href}
          leadingVisual={item.icon}
          target="_self"
          onSelect={event => {
            event.preventDefault()
            setSelectedIndex(index)
          }}
        >
          {item.navigation}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  )
}

export const OverflowTemplate: Story = {render: () => <OverflowNav />}

export const OverflowOnNarrowScreen: Story = {
  render: () => <OverflowNav initialSelectedIndex={items.length - 1} />,
  parameters: {
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        narrowScreen: {
          name: 'Narrow Screen',
          styles: {width: '800px', height: '100%'},
        },
      },
      defaultViewport: 'narrowScreen',
    },
  },
}

export const CountersLoadingState: Story = {
  render: function CountersLoadingStateStory() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(1)
    return (
      <UnderlineNav aria-label="Repository with loading counters" loadingCounters>
        {items.map((item, index) => (
          <UnderlineNav.Item
            key={item.navigation}
            aria-current={index === selectedIndex ? 'page' : undefined}
            counter={item.counter}
            leadingVisual={item.icon}
            onSelect={() => setSelectedIndex(index)}
          >
            {item.navigation}
          </UnderlineNav.Item>
        ))}
      </UnderlineNav>
    )
  },
}

export const VariantFlush: Story = {
  render: () => (
    <UnderlineNav variant="flush" aria-label="Repository">
      <UnderlineNav.Item aria-current="page">Code</UnderlineNav.Item>
      <UnderlineNav.Item>Issues</UnderlineNav.Item>
      <UnderlineNav.Item>Pull Requests</UnderlineNav.Item>
    </UnderlineNav>
  ),
}
