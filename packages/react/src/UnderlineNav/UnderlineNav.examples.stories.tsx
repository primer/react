import React from 'react'
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
  GitCommitIcon,
  ChecklistIcon,
  FileDiffIcon,
  BookIcon,
  RepoIcon,
  PackageIcon,
  StarIcon,
  ThreeBarsIcon,
  PeopleIcon,
} from '@primer/octicons-react'
import type {Meta} from '@storybook/react-vite'
import {UnderlineNav} from './index'
import {Avatar, Button, Heading, Link, Text, StateLabel, BranchName} from '..'
import classes from './UnderlineNav.examples.stories.module.css'

export default {
  title: 'Components/UnderlineNav/Examples',
} as Meta

export const PullRequestPage = () => {
  return (
    <div className={classes.PullRequestNavContainer}>
      <div>
        <Heading as="h1" className={classes.PullRequestTitle}>
          Switch to new UnderlineNav <span className={classes.PullRequestNumber}>#1111</span>
        </Heading>
        <div className={classes.PullRequestInfoRow}>
          <StateLabel status="pullOpened">Open</StateLabel>
          <span className={classes.PullRequestInfoText}>
            <Link href="#" muted className={classes.PullRequestInfoUser}>
              broccolinisoup
            </Link>{' '}
            wants to merge 3 commits into <BranchName href="#">main</BranchName> from{' '}
            <BranchName href="#">broccolinisoup/switch-to-new-underlineNav</BranchName>
          </span>
        </div>
      </div>
      <UnderlineNav aria-label="Pull Request">
        <UnderlineNav.Item leadingVisual={<CommentDiscussionIcon />} counter="0" aria-current="page">
          Conversation
        </UnderlineNav.Item>
        <UnderlineNav.Item counter={3} leadingVisual={<GitCommitIcon />}>
          Commits
        </UnderlineNav.Item>
        <UnderlineNav.Item counter={7} leadingVisual={<ChecklistIcon />}>
          Checks
        </UnderlineNav.Item>
        <UnderlineNav.Item counter={4} leadingVisual={<FileDiffIcon />}>
          Files Changes
        </UnderlineNav.Item>
      </UnderlineNav>
    </div>
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

export const ReposPage = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  return (
    <UnderlineNav aria-label="Repository">
      {items.map((item, index) => (
        <UnderlineNav.Item
          key={item.navigation}
          leadingVisual={item.icon}
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

const profileItems: {navigation: string; icon: React.ReactElement; counter?: number | string; href?: string}[] = [
  {navigation: 'Overview', icon: <BookIcon />, href: '#overview'},
  {navigation: 'Repositories', icon: <RepoIcon />, counter: '12', href: '#repositories'},
  {navigation: 'Projects', icon: <ProjectIcon />, counter: 3, href: '#projects'},
  {navigation: 'Packages', icon: <PackageIcon />, counter: '0', href: '#packages'},
  {navigation: 'Stars', icon: <StarIcon />, counter: '0', href: '#stars'},
  {navigation: 'Activity', icon: <ThreeBarsIcon />, counter: 67, href: '#activity'},
]

export const ProfilePage = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)
  return (
    <div>
      <div className={classes.ProfileNav}>
        <UnderlineNav aria-label="Repository">
          {profileItems.map((item, index) => (
            <UnderlineNav.Item
              key={item.navigation}
              leadingVisual={item.icon}
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
      </div>
      <div className={classes.ProfileContainer}>
        <div className={classes.ProfileSidebar}>
          <Avatar size={256} src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="mona user avatar" />
          <div>
            {/* Initial bio info */}
            <div className={classes.ProfileBioInfo}>
              <Heading as="h1" className={classes.ProfileBioName}>
                Monalisa Octocat
              </Heading>
              <Heading as="h1" className={classes.ProfileBioUsername}>
                mona
              </Heading>
            </div>
            {/* Edit Profile / Profile details */}
            <div className={classes.ProfileEditSection}>
              <Button block>Edit Profile</Button>
              <div className={classes.ProfileFollowRow}>
                <PeopleIcon size={16} className={classes.ProfileFollowerIcon} />
                <Link href="https://github.com" muted className={classes.ProfileFollowerCount}>
                  47 Followers
                </Link>
                <span> · </span>
                <Link href="https://github.com" muted className={classes.ProfileFollowingCount}>
                  54 Following
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.ProfileReadme}>
          <Text> mona/README.md</Text>
        </div>
      </div>
    </div>
  )
}
