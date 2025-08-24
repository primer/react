import type {Meta, StoryFn} from '@storybook/react-vite'
import React from 'react'
import {PageLayout} from '../PageLayout'
import {NavList} from './NavList'
import {
  type Icon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BookIcon,
  FileDirectoryIcon,
  CodeIcon,
  RepoIcon,
  IssueOpenedIcon,
  GitPullRequestIcon,
  CommentDiscussionIcon,
  PeopleIcon,
  GitCommitIcon,
  PackageIcon,
  MilestoneIcon,
  TelescopeIcon,
} from '@primer/octicons-react'
import Octicon from '../Octicon'
import VisuallyHidden from '../_VisuallyHidden'
import {ReactRouterLikeLink} from '../Pagination/mocks/ReactRouterLink'

const meta: Meta = {
  title: 'Components/NavList',
  component: NavList,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Default = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item href="#" aria-current="page">
          Item 1
        </NavList.Item>
        <NavList.Item href="#">Item 2</NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)
