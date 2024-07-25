import React from 'react'
import type {Meta} from '@storybook/react'
import {IconButton, Breadcrumbs, Text, Link, Button, Box, Label, UnderlineNav} from '..'
import {
  PencilIcon,
  SidebarExpandIcon,
  CommentDiscussionIcon,
  CommitIcon,
  FileDiffIcon,
  ChecklistIcon,
  WorkflowIcon,
  GraphIcon,
  TriangleDownIcon,
  GearIcon,
  GitPullRequestIcon,
  GitBranchIcon,
  KebabHorizontalIcon,
} from '@primer/octicons-react'

import {PageHeader} from './PageHeader'
import {Hidden} from '../Hidden'

const meta: Meta = {
  title: 'Components/PageHeader/Features',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
  args: {},
}

export const HasTitleOnly = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title>Title</PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  </Box>
)

export const HasLargeTitle = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea variant="large">
        <PageHeader.Title>Title</PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  </Box>
)

export const WithLeadingAndTrailingVisuals = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.LeadingVisual>
          <GitPullRequestIcon />
        </PageHeader.LeadingVisual>
        <PageHeader.Title>Title</PageHeader.Title>
        <PageHeader.TrailingVisual>
          <Label>Beta</Label>
        </PageHeader.TrailingVisual>
      </PageHeader.TitleArea>
    </PageHeader>
  </Box>
)

export const WithLeadingVisualHiddenOnRegularViewport = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.LeadingVisual hidden={{regular: true}}>
          <GitPullRequestIcon />
        </PageHeader.LeadingVisual>
        <PageHeader.Title>Title</PageHeader.Title>
        <PageHeader.TrailingVisual>
          <Label>Beta</Label>
        </PageHeader.TrailingVisual>
      </PageHeader.TitleArea>
    </PageHeader>
  </Box>
)

WithLeadingVisualHiddenOnRegularViewport.parameters = {
  viewport: {
    defaultViewport: 'regular',
  },
}

export const WithActions = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title>Title</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Actions>
        <IconButton aria-label="Workflows" icon={WorkflowIcon} />
        <IconButton aria-label="Insights" icon={GraphIcon} />
        <Button variant="primary" trailingVisual={TriangleDownIcon}>
          Add Item
        </Button>
        <IconButton aria-label="Settings" icon={GearIcon} />
      </PageHeader.Actions>
    </PageHeader>
  </Box>
)

export const WithDescriptionSlot = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title>add-pageheader-docs</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Description>
        <Text sx={{fontSize: 1, color: 'fg.muted'}}>
          <Link href="https://github.com/broccolinisoup" sx={{fontWeight: 'bold'}}>
            broccolinisoup
          </Link>{' '}
          created this branch 5 days ago · 14 commits · updated today
        </Text>
      </PageHeader.Description>
    </PageHeader>
  </Box>
)

export const WithNavigationSlot = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title>Pull request title</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Navigation>
        <UnderlineNav aria-label="Pull Request">
          <UnderlineNav.Item icon={CommentDiscussionIcon} counter="12" aria-current="page">
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
      </PageHeader.Navigation>
    </PageHeader>
  </Box>
)

export const WithCustomNavigation = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title>Pull request title</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Navigation as="nav" aria-label="Item list">
        <Box as="ul" sx={{display: 'flex', gap: '8px', listStyle: 'none', paddingY: 0, paddingX: 3}} role="list">
          <li>
            <Link href="https://github.com/primer/react" aria-current="page">
              Item 1
            </Link>
          </li>
          <li>
            <Link href="https://github.com/primer/react/pulls">Item 2</Link>
          </li>
        </Box>
      </PageHeader.Navigation>
    </PageHeader>
  </Box>
)

export const WithLeadingAndTrailingActions = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title>Title</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.LeadingAction>
        <IconButton aria-label="Expand" icon={SidebarExpandIcon} variant="invisible" />
      </PageHeader.LeadingAction>
      <PageHeader.TrailingAction>
        <IconButton aria-label="Edit" icon={PencilIcon} variant="invisible" />
      </PageHeader.TrailingAction>
    </PageHeader>
  </Box>
)

export const WithParentLinkAndActionsOfContextArea = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title>Title</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.ContextArea>
        <PageHeader.ParentLink href="http://github.com">Parent Link</PageHeader.ParentLink>

        <PageHeader.ContextAreaActions>
          <Button size="small" trailingAction={TriangleDownIcon}>
            Add File
          </Button>
          <IconButton size="small" aria-label="More Options" icon={KebabHorizontalIcon} />
        </PageHeader.ContextAreaActions>
      </PageHeader.ContextArea>
    </PageHeader>
  </Box>
)

WithParentLinkAndActionsOfContextArea.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
}

export const WithContextBarAndActionsOfContextArea = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title>Title</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.ContextArea>
        <PageHeader.ContextBar>
          <Breadcrumbs>
            <Breadcrumbs.Item href="https://github.com/primer/react/tree/main">react</Breadcrumbs.Item>
            <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src">src</Breadcrumbs.Item>
            <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src/PageHeader">
              PageHeader
            </Breadcrumbs.Item>
            <Breadcrumbs.Item href="https://github.com/primer/react/blob/main/src/PageHeader/PageHeader.tsx">
              PageHeader.tsx
            </Breadcrumbs.Item>
          </Breadcrumbs>
        </PageHeader.ContextBar>
        <PageHeader.ContextAreaActions>
          <Button size="small" leadingVisual={GitBranchIcon}>
            Main
          </Button>
          <IconButton size="small" aria-label="More Options" icon={KebabHorizontalIcon} />
        </PageHeader.ContextAreaActions>
      </PageHeader.ContextArea>
    </PageHeader>
  </Box>
)

WithContextBarAndActionsOfContextArea.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
}
export const WithActionsThatHaveResponsiveContent = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title as="h2">Webhooks</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Actions>
        <Hidden when={['narrow']}>
          <Button variant="primary">New webhook</Button>
        </Hidden>
        <Hidden when={['regular', 'wide']}>
          <Button variant="primary">New</Button>
        </Hidden>
      </PageHeader.Actions>
    </PageHeader>
  </Box>
)

export default meta
