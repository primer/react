import {Box} from '@primer/react'
import {
  CodeIcon,
  IssueOpenedIcon,
  GitPullRequestIcon,
  CommentDiscussionIcon,
  PlayIcon,
  ProjectIcon,
  GraphIcon,
  GearIcon,
  ShieldLockIcon,
} from '@primer/octicons-react'
import React from 'react'
import {UnderlineNav} from '@primer/react/drafts'
import {useRouter} from 'next/router'
import Link from 'next/link'

export default function Layout() {
  const items = [
    {navigation: 'Code', href: '/tabs/code', icon: CodeIcon},
    {
      navigation: 'Issues',
      href: '/tabs/issues',
      icon: IssueOpenedIcon,
      counter: 120,
    },
    {
      navigation: 'Pull Requests',
      href: '/tabs/pull-requests',
      icon: GitPullRequestIcon,
      counter: 13,
    },
    {
      navigation: 'Discussions',
      href: '/tabs/discussions',
      icon: CommentDiscussionIcon,
      counter: 5,
    },
    {navigation: 'Actions', href: '/tabs/actions', icon: PlayIcon, counter: 4},
    {
      navigation: 'Projects',
      href: '/tabs/projects',
      icon: ProjectIcon,
      counter: 9,
    },
    {navigation: 'Insights', href: '/tabs/insights', icon: GraphIcon},
    {navigation: 'Settings', href: '/tabs/settings', icon: GearIcon, counter: 10},
    {navigation: 'Security', href: '/tabs/security', icon: ShieldLockIcon},
  ]
  return (
    <UnderlineNav aria-label="MyUnderlineNav">
      {items.map(item => (
        <UnderlineNavItem href={item.href} key={item.navigation} icon={item.icon} counter={item.counter}>
          {item.navigation}
        </UnderlineNavItem>
      ))}
    </UnderlineNav>
  )
}

function UnderlineNavItem({href, children, ...rest}) {
  const router = useRouter()
  const isCurrent = typeof href === 'string' ? router.asPath === href : router.pathname === href.pathname
  return (
    <UnderlineNav.Item as={Link} href={href} aria-current={isCurrent ? 'page' : undefined} {...rest}>
      {children}
    </UnderlineNav.Item>
  )
}
