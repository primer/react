import type {Meta} from '@storybook/react-vite'
import {IconButton, Breadcrumbs, Text, Link, Button, Label, UnderlineNav} from '..'
import {
  PencilIcon,
  SidebarExpandIcon,
  CommentDiscussionIcon,
  GitCommitIcon,
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
import classes from './PageHeader.features.stories.module.css'

const meta: Meta = {
  title: 'Components/PageHeader/Features',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
  args: {},
}

export const HasTitleOnly = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Title">
      <PageHeader.TitleArea>
        <PageHeader.Title>Title</PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  </div>
)

export const HasLargeTitle = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Title">
      <PageHeader.TitleArea variant="large">
        <PageHeader.Title>Title</PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  </div>
)

export const WithLeadingAndTrailingVisuals = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Title">
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
  </div>
)

export const WithLeadingVisualHiddenOnRegularViewport = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Title">
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
  </div>
)

WithLeadingVisualHiddenOnRegularViewport.parameters = {
  viewport: {
    defaultViewport: 'regular',
  },
}

export const WithActions = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Title">
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
  </div>
)

export const WithDescriptionSlot = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Add-pageheader-docs">
      <PageHeader.TitleArea>
        <PageHeader.Title>add-pageheader-docs</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Description>
        <Text className={classes.DescriptionText}>
          <Link href="https://github.com/broccolinisoup" className={classes.BoldLink}>
            broccolinisoup
          </Link>{' '}
          created this branch 5 days ago · 14 commits · updated today
        </Text>
      </PageHeader.Description>
    </PageHeader>
  </div>
)

export const WithNavigationSlot = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Pull request title">
      <PageHeader.TitleArea>
        <PageHeader.Title>Pull request title</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Navigation>
        <UnderlineNav aria-label="Pull Request">
          <UnderlineNav.Item icon={CommentDiscussionIcon} counter="12" aria-current="page">
            Conversation
          </UnderlineNav.Item>
          <UnderlineNav.Item counter={3} icon={GitCommitIcon}>
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
  </div>
)

export const WithCustomNavigation = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Pull request title">
      <PageHeader.TitleArea>
        <PageHeader.Title>Pull request title</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Navigation as="nav" aria-label="Item list">
        <ul className={classes.CustomNavigationList}>
          <li>
            <Link href="https://github.com/primer/react" aria-current="page">
              Item 1
            </Link>
          </li>
          <li>
            <Link href="https://github.com/primer/react/pulls">Item 2</Link>
          </li>
        </ul>
      </PageHeader.Navigation>
    </PageHeader>
  </div>
)

export const WithLeadingAndTrailingActions = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Title">
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
  </div>
)

export const WithParentLinkAndActionsOfContextArea = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Title">
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
  </div>
)

WithParentLinkAndActionsOfContextArea.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
}

export const WithContextBarAndActionsOfContextArea = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Title">
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
  </div>
)

WithContextBarAndActionsOfContextArea.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
}

export const WithActionsThatHaveResponsiveContent = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Webhooks">
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
  </div>
)

export const HasBottomBorder = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Title" hasBorder>
      <PageHeader.TitleArea>
        <PageHeader.Title>Title</PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  </div>
)

export default meta
