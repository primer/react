import React from 'react'
import {Box, Text, ToggleSwitch, Heading, PageLayout, NavList, SubNav} from '@primer/react'
import {HomeIcon} from '@primer/octicons-react'
import {UnderlineNav} from '@primer/react/drafts'

import {Link, useMatch, useResolvedPath} from 'react-router-dom'
// import ColorModeSwitcher from './ColorModeSwitcher'
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
  GearIcon,
} from '@primer/octicons-react'

const Root = props => {
  const items = [
    {navigation: 'Code', icon: CodeIcon, href: ''},
    {navigation: 'Issues', icon: IssueOpenedIcon, counter: '12K', href: 'issues'},
    {navigation: 'Pull Requests', icon: GitPullRequestIcon, counter: 13, href: 'pull-requests'},
    {navigation: 'Discussions', icon: CommentDiscussionIcon, counter: 5, href: 'discussions'},
    {navigation: 'Actions', icon: PlayIcon, counter: 4, href: 'actions'},
    {navigation: 'Projects', icon: ProjectIcon, counter: 9, href: 'projects'},
    {navigation: 'Insights', icon: GraphIcon, counter: '0', href: 'insights'},
    {navigation: 'Settings', icon: GearIcon, counter: 10, href: 'settings'},
    {navigation: 'Security', icon: ShieldLockIcon, href: 'security'},
  ]
  const windowHash = window.location.hash
  const [selectedHash, setSelectedHash] = React.useState(windowHash)
  console.log('selectedHash', selectedHash, windowHash)

  const [content, setContent] = React.useState('Code')

  return (
    <Box sx={{backgroundColor: 'canvas.subtle', padding: 2}}>
      <UnderlineNav aria-label="Repository">
        {items.map((item, index) => (
          // With react router
          <UnderlineNavItem
            to={`/${item.href}`}
            counter={item.counter}
            icon={item.icon}
            onSelect={() => {
              console.log('set content')
              setContent(item.navigation)
            }}
          >
            {item.navigation}
          </UnderlineNavItem>
        ))}
      </UnderlineNav>

      <Box sx={{height: 900}} p={4}>
        {' '}
        {content}
        {props.children}
      </Box>
    </Box>
  )
}

function UnderlineNavItem({to, children, ...rest}) {
  // Needed for react router
  const resolved = useResolvedPath(to)
  console.log('resolved', resolved, children)
  //   const isCurrent = useMatch({path: resolved.pathname, end: true})
  const isCurrent =
    children === 'Code' && resolved.pathname === '/' ? true : useMatch({path: resolved.pathname, end: true})

  return (
    <UnderlineNav.Item as={Link} to={to} aria-current={isCurrent ? 'page' : undefined} {...rest}>
      {children}
    </UnderlineNav.Item>
  )
}

export default Root
