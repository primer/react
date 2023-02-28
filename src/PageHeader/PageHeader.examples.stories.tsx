import React from 'react'
import {Meta} from '@storybook/react'
import {Button, IconButton, Breadcrumbs, Link, Text, StateLabel, BranchName, Box, PageLayout} from '..'
import {
  KebabHorizontalIcon,
  GitBranchIcon,
  CodeIcon,
  CommentDiscussionIcon,
  CommitIcon,
  ChecklistIcon,
  FileDiffIcon,
  ArrowRightIcon,
} from '@primer/octicons-react'

import {PageHeader} from './PageHeader'
import Hidden from '../Hidden'
import {UnderlineNav} from '../UnderlineNav2'

const meta: Meta = {
  title: 'Drafts/Components/PageHeader/Examples',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
  args: {},
}

const setViewportParamToNarrow = {
  viewport: {
    defaultViewport: 'small',
  },
}
export const Webhooks = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.ContextArea>
        <PageHeader.ParentLink href="http://github.com">Repository settings</PageHeader.ParentLink>
      </PageHeader.ContextArea>
      <PageHeader.TitleArea>
        <PageHeader.Title as="h2">Webhooks</PageHeader.Title>

        <PageHeader.Actions>
          <Hidden on={['narrow']}>
            <Button variant="primary">New webhook</Button>
          </Hidden>

          <Hidden on={['regular', 'wide']}>
            <Button variant="primary">New</Button>
          </Hidden>
        </PageHeader.Actions>
      </PageHeader.TitleArea>
    </PageHeader>
  </Box>
)

export const WebhooksOnNarrowViewport = () => {
  return <Webhooks />
}

WebhooksOnNarrowViewport.parameters = setViewportParamToNarrow

export const PullRequestPage = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.ContextArea>
        <PageHeader.ParentLink href="http://github.com">Pull requests</PageHeader.ParentLink>
      </PageHeader.ContextArea>
      <PageHeader.TitleArea>
        <PageHeader.Title as="h2">
          PageHeader component initial layout explorations extra long pull request title
        </PageHeader.Title>
        <PageHeader.Actions>
          <Hidden on={['regular', 'wide']}>
            <IconButton aria-label="More" icon={KebabHorizontalIcon} />
            {/* Pop up actions */}
          </Hidden>

          <Hidden on={['narrow']}>
            <Box sx={{display: 'flex', gap: 2}}>
              <Button>Edit</Button>
              <Button leadingIcon={CodeIcon}>Code</Button>
            </Box>
          </Hidden>
        </PageHeader.Actions>
      </PageHeader.TitleArea>
      <PageHeader.Description>
        <StateLabel status="pullOpened">Open</StateLabel>
        <Hidden on={['narrow']}>
          <Text sx={{fontSize: 1, color: 'fg.muted'}}>
            <Link href="#" muted sx={{fontWeight: 'bold'}}>
              broccolinisoup
            </Link>{' '}
            wants to merge 3 commits into <BranchName href="#">main</BranchName> from{' '}
            <BranchName href="#">broccolinisoup/switch-to-new-underlineNav</BranchName>
          </Text>
        </Hidden>
        <Hidden on={['regular', 'wide']}>
          <Text sx={{fontSize: 1, color: 'fg.muted'}}>
            <BranchName href="#">main</BranchName>
            <ArrowRightIcon />
            <BranchName href="#">page-header-initial</BranchName>
          </Text>
        </Hidden>
      </PageHeader.Description>
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

export const PullRequestPageOnNarrowViewport = () => {
  return <PullRequestPage />
}

PullRequestPageOnNarrowViewport.parameters = setViewportParamToNarrow

export const FilesPage = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.ContextArea>
        <PageHeader.ParentLink>Files</PageHeader.ParentLink>
        <PageHeader.ContextAreaActions>
          <Button size="small" leadingIcon={GitBranchIcon}>
            Main
          </Button>
          <IconButton size="small" aria-label="More" icon={KebabHorizontalIcon} />
        </PageHeader.ContextAreaActions>
      </PageHeader.ContextArea>
      <PageHeader.TitleArea>
        <Breadcrumbs>
          <Breadcrumbs.Item href="#">...</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">primer</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">react</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">src</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">PageHeader</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">PageHeader.tsx</Breadcrumbs.Item>
        </Breadcrumbs>
      </PageHeader.TitleArea>
    </PageHeader>
  </Box>
)

export const FilesPageOnNarrowViewport = () => {
  return <FilesPage />
}

export const WithPageLayout = () => {
  return (
    <PageLayout>
      <PageLayout.Header>
        <PageHeader>
          <PageHeader.ContextArea>
            <PageHeader.ParentLink href="http://github.com">Pull requests</PageHeader.ParentLink>
          </PageHeader.ContextArea>
          <PageHeader.TitleArea>
            <PageHeader.Title as="h2">
              PageHeader component initial layout explorations extra long pull request title &nbsp;
              <Text sx={{color: 'fg.muted', fontWeight: 'light'}}>#1831</Text>
            </PageHeader.Title>
            <PageHeader.Actions>
              <Hidden on={['regular', 'wide']}>
                <IconButton aria-label="More" icon={KebabHorizontalIcon} />
                {/* Pop up actions */}
              </Hidden>

              <Hidden on={['narrow']}>
                <Box sx={{display: 'flex'}}>
                  <Button>Edit</Button>
                  <Button leadingIcon={CodeIcon}>Code</Button>
                </Box>
              </Hidden>
            </PageHeader.Actions>
          </PageHeader.TitleArea>
          <PageHeader.Description>
            <StateLabel status="pullOpened">Open</StateLabel>
            <Hidden on={['narrow']}>
              <Text sx={{fontSize: 1, color: 'fg.muted'}}>
                <Link href="#" muted sx={{fontWeight: 'bold'}}>
                  broccolinisoup
                </Link>{' '}
                wants to merge 3 commits into <BranchName href="#">main</BranchName> from{' '}
                <BranchName href="#">broccolinisoup/switch-to-new-underlineNav</BranchName>
              </Text>
            </Hidden>
            <Hidden on={['regular', 'wide']}>
              <Text sx={{fontSize: 1, color: 'fg.muted'}}>
                <BranchName href="#">main</BranchName>
                <ArrowRightIcon />
                <BranchName href="#">page-header-initial</BranchName>
              </Text>
            </Hidden>
          </PageHeader.Description>
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
      </PageLayout.Header>
      <PageLayout.Content>
        <Box sx={{border: '1px solid', borderRadius: 2, borderColor: 'border.default', height: 200}}></Box>
        <Box
          sx={{
            maxWidth: '100%',
            overflowX: 'auto',
            border: '1px solid',
            whiteSpace: 'nowrap',
            borderColor: 'border.default',
            mt: 3,
            p: 3,
            borderRadius: 2,
          }}
        >
          This box has really long content. If it is too long, it will cause x overflow and should show a scrollbar.
          When this overflows, it should not break to overall page layout!
        </Box>
      </PageLayout.Content>
      <PageLayout.Pane>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
          <Box>
            <Text sx={{fontSize: 0, fontWeight: 'bold', display: 'block', color: 'fg.muted'}}>Assignees</Text>
            <Text sx={{fontSize: 0, color: 'fg.muted', lineHeight: 'condensed'}}>
              No one –{' '}
              <Link href="#" muted>
                assign yourself
              </Link>
            </Text>
          </Box>
          <Box role="separator" sx={{width: '100%', height: 1, backgroundColor: 'border.default'}}></Box>
          <Box>
            <Text sx={{fontSize: 0, fontWeight: 'bold', display: 'block', color: 'fg.muted'}}>Labels</Text>
            <Text sx={{fontSize: 0, color: 'fg.muted', lineHeight: 'condensed'}}>None yet</Text>
          </Box>
        </Box>
      </PageLayout.Pane>
    </PageLayout>
  )
}

FilesPageOnNarrowViewport.parameters = setViewportParamToNarrow

export default meta
