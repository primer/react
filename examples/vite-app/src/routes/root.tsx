import React, {useEffect} from 'react'
import {Box, Text, ToggleSwitch, Heading, PageLayout, NavList, SubNav, Button} from '@primer/react'
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

  const docItems = [
    {navigation: 'Mac', href: 'mac'},
    {navigation: 'Windows', href: 'windows'},
    {navigation: 'Linux', href: 'linux'},
    {navigation: 'Code', href: 'code'},
    {navigation: 'Issues', href: 'issues'},
    {navigation: 'Pull Requests', href: 'pull-requests'},
  ]
  const windowHash = window.location.hash
  console.log('component is reloaded with window hash:', windowHash)

  const [selectedHash, setSelectedHash] = React.useState(windowHash)
  const [content, setContent] = React.useState('Code')

  console.log({windowHash}, {selectedHash})

  // useEffect(() => {

  //   const isCurrent = useMatch({path: resolved.pathname, end: true})

  function isCurrent(children, to) {
    const resolved = useResolvedPath(to)
    return children === 'Code' && resolved.pathname === '/' ? true : useMatch({path: resolved.pathname, end: true})
  }

  return (
    <Box sx={{backgroundColor: 'canvas.subtle', padding: 2}}>
      <UnderlineNav aria-label="Repository">
        {docItems.map((item, index) => (
          // <UnderlineNav.Item
          //   key={item.navigation}
          //   as={Link}
          //   to={`/${item.href}`}
          //   aria-current={isCurrent(item.navigation, item.href) ? 'page' : undefined}
          //   counter={item.counter}
          //   icon={item.icon}
          //   onSelect={() => {
          //     console.log('set content')
          //     setContent(item.navigation)
          //   }}
          // >
          //   {item.navigation}
          // </UnderlineNav.Item>
          // With hash
          <UnderlineNav.Item
            key={item.href}
            href={`#${item.href}`}
            aria-current={`#${item.href}` === `${selectedHash}` ? 'page' : undefined}
            onSelect={event => {
              console.log('setSelectedHash')
              setContent(item.navigation)
              setSelectedHash(`#${item.href}`)
              // event.preventDefault()
            }}
          >
            {item.navigation} {`#${item.href}` === `${selectedHash}`}
          </UnderlineNav.Item>
        ))}
      </UnderlineNav>

      <Box sx={{height: 900}} p={4}>
        <ul>
          <li>
            <a
              href="#windows"
              onClick={() => {
                // setContent('windows')
                setSelectedHash('#windows')
              }}
            >
              Windows
            </a>
          </li>
          <li>
            <a
              href="#mac"
              onClick={() => {
                // setContent('mac')
                setSelectedHash('#mac')
              }}
            >
              Mac
            </a>
          </li>
          <li>
            <a
              href="#linux"
              onClick={() => {
                // setContent('linux')
                setSelectedHash('#linux')
              }}
            >
              Linux
            </a>
          </li>
        </ul>
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
