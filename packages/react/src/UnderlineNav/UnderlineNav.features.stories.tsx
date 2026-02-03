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

/**
 * - At extra-narrow viewport (< 544px): Shows first 2 items inline; rest in menu
 * - At narrow viewport (544px - 768px): Shows first 3 items inline; rest in menu
 * - At regular viewport (768px - 1024px): Shows first 5 items inline; rest in menu
 * - At medium viewport (1024px - 1280px): Shows first 6 items inline; rest in menu
 * - At large viewport (1280px - 1400px): Shows first 7 items inline; rest in menu
 * - At wide viewport (> 1400px): Shows all items inline; menu is hidden
 */
export const ResponsiveOverflow = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(0)

  return (
    <UnderlineNav
      aria-label="Repository"
      responsiveOverflow={{
        xnarrow: [0, 1], // Show first 2 items at extra small (< 544px)
        narrow: [0, 1, 2], // Show first 3 items at narrow (544px - 768px)
        regular: [0, 1, 2, 3, 4], // Show first 5 items at regular (768px - 1024px)
        medium: [0, 1, 2, 3, 4, 5], // Show first 6 items at medium (1024px - 1280px)
        large: [0, 1, 2, 3, 4, 5, 6], // Show first 7 items at large (1280px - 1400px)
        wide: 'all', // Show all items at wide (> 1400px, hide menu)
      }}
    >
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item.navigation}
          leadingVisual={item.icon}
          aria-current={index === selectedIndex ? 'page' : undefined}
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

export const ResponsiveOverflowXNarrow = () => {
  return <ResponsiveOverflow />
}

ResponsiveOverflowXNarrow.parameters = {
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      xnarrowScreen: {
        name: 'Extra Narrow Screen',
        styles: {
          width: '400px',
          height: '100%',
        },
      },
    },
    defaultViewport: 'xnarrowScreen',
  },
}

export const ResponsiveOverflowNarrow = () => {
  return <ResponsiveOverflow />
}

ResponsiveOverflowNarrow.parameters = {
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      narrowScreen: {
        name: 'Narrow Screen',
        styles: {
          width: '600px',
          height: '100%',
        },
      },
    },
    defaultViewport: 'narrowScreen',
  },
}

export const ResponsiveOverflowRegular = () => {
  return <ResponsiveOverflow />
}

ResponsiveOverflowRegular.parameters = {
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      regularScreen: {
        name: 'Regular Screen',
        styles: {
          width: '900px',
          height: '100%',
        },
      },
    },
    defaultViewport: 'regularScreen',
  },
}

export const ResponsiveOverflowWide = () => {
  return <ResponsiveOverflow />
}

ResponsiveOverflowWide.parameters = {
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      wideScreen: {
        name: 'Wide Screen',
        styles: {
          width: '1500px',
          height: '100%',
        },
      },
    },
    defaultViewport: 'wideScreen',
  },
}
