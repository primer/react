import React from 'react'
import type {IconProps} from '@primer/octicons-react'
import {
  CodeIcon,
  IssueOpenedIcon,
  GitPullRequestIcon,
  CommentDiscussionIcon,
  PlayIcon,
  ProjectIcon,
  GraphIcon,
  ShieldLockIcon,
  GearIcon,
  CommitIcon,
  ChecklistIcon,
  FileDiffIcon,
  BookIcon,
  RepoIcon,
  PackageIcon,
  StarIcon,
  ThreeBarsIcon,
  PeopleIcon,
} from '@primer/octicons-react'
import type {Meta} from '@storybook/react'
import {UnderlineNav} from './index'
import {Avatar, Octicon, Button, Box, Heading, Link, Text, StateLabel, BranchName} from '..'

export default {
  title: 'Components/UnderlineNav/Examples',
} as Meta

export const PullRequestPage = () => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
      <Box>
        <Heading as="h1" sx={{fontWeight: 'normal'}}>
          Switch to new UnderlineNav <Text sx={{color: 'fg.muted', fontWeight: 'light'}}>#1111</Text>
        </Heading>
        <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
          <StateLabel status="pullOpened">Open</StateLabel>
          <Text sx={{fontSize: 1, color: 'fg.muted'}}>
            <Link href="#" muted sx={{fontWeight: 'bold'}}>
              broccolinisoup
            </Link>{' '}
            wants to merge 3 commits into <BranchName href="#">main</BranchName> from{' '}
            <BranchName href="#">broccolinisoup/switch-to-new-underlineNav</BranchName>
          </Text>
        </Box>
      </Box>
      <UnderlineNav aria-label="Pull Request">
        <UnderlineNav.Item icon={CommentDiscussionIcon} counter="0" aria-current="page">
          Conversation
        </UnderlineNav.Item>
        <UnderlineNav.Item counter={3} icon={CommitIcon}>
          Commits
        </UnderlineNav.Item>
        <UnderlineNav.Item counter={7} icon={ChecklistIcon}>
          Checks
        </UnderlineNav.Item>
        <UnderlineNav.Item counter={4} icon={FileDiffIcon}>
          Files Changes
        </UnderlineNav.Item>
      </UnderlineNav>
    </Box>
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
  {navigation: 'Security', icon: ShieldLockIcon, href: '#security'},
]

export const ReposPage = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

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

const profileItems: {navigation: string; icon: React.FC<IconProps>; counter?: number | string; href?: string}[] = [
  {navigation: 'Overview', icon: BookIcon, href: '#overview'},
  {navigation: 'Repositories', icon: RepoIcon, counter: '12', href: '#repositories'},
  {navigation: 'Projects', icon: ProjectIcon, counter: 3, href: '#projects'},
  {navigation: 'Packages', icon: PackageIcon, counter: '0', href: '#packages'},
  {navigation: 'Stars', icon: StarIcon, counter: '0', href: '#stars'},
  {navigation: 'Activity', icon: ThreeBarsIcon, counter: 67, href: '#activity'},
]

export const ProfilePage = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)
  return (
    <Box sx={{display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'flex-start'}}>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%'}}>
        <Avatar size={256} src="https://avatars.githubusercontent.com/u/92997159?v=4" alt="mona user avatar" />
        <Box>
          {/* Initial bio info */}
          <Box sx={{paddingY: 3}}>
            <Heading as="h1" sx={{fontSize: 24}}>
              Monalisa Octocat
            </Heading>
            <Heading as="h1" sx={{fontSize: 20, fontWeight: 300}}>
              mona
            </Heading>
          </Box>

          {/* Edit Profile / Profile details */}
          <Box sx={{display: 'flex', flexDirection: 'column', color: 'fg.onEmphasis'}}>
            <Button block>Edit Profile</Button>

            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3}}>
              <Octicon icon={PeopleIcon} size={16} sx={{marginRight: 1}} />
              <Link href="https://github.com" muted sx={{marginRight: 2}}>
                47 Followers
              </Link>
              <span> · </span>
              <Link href="https://github.com" muted sx={{marginLeft: 2}}>
                54 Following
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{flexGrow: 1}}>
        <UnderlineNav aria-label="Repository">
          {profileItems.map((item, index) => (
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
        <Box
          sx={{
            border: '1px solid',
            marginTop: 2,
            borderColor: 'border.default',
            borderRadius: '12px',
            height: '300px',
            width: '80%',
            padding: 4,
          }}
        >
          <Text> mona/README.md</Text>
        </Box>
      </Box>
    </Box>
  )
}
