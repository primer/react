import React from 'react'
import type {Meta} from '@storybook/react'
import {
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Text,
  StateLabel,
  BranchName,
  Box,
  PageLayout,
  Timeline,
  Octicon,
  Heading,
  Token,
} from '..'
import {
  KebabHorizontalIcon,
  GitBranchIcon,
  CodeIcon,
  CommentDiscussionIcon,
  CommitIcon,
  ChecklistIcon,
  FileDiffIcon,
  TriangleDownIcon,
  CheckIcon,
  CopyIcon,
  CrossReferenceIcon,
  PaperclipIcon,
} from '@primer/octicons-react'

import {PageHeader} from './PageHeader'
import {Hidden} from '../Hidden'
import {UnderlineNav} from '../UnderlineNav'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'

const meta: Meta = {
  title: 'Components/PageHeader/Examples',
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
      <PageHeader.TitleArea>
        <PageHeader.Title as="h2">Webhooks</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.ContextArea>
        <PageHeader.ParentLink href="http://github.com">Repository settings</PageHeader.ParentLink>
        <PageHeader.ContextBar>context bar</PageHeader.ContextBar>
        <PageHeader.ContextAreaActions>
          <Button>Context action</Button>
        </PageHeader.ContextAreaActions>
      </PageHeader.ContextArea>
      <PageHeader.Actions>
        <Button variant="primary">New webhook</Button>
      </PageHeader.Actions>
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
      <PageHeader.TitleArea>
        <PageHeader.Title as="h1">
          PageHeader component initial layout explorations extra long pull request title
        </PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.ContextArea>
        <PageHeader.ParentLink href="http://github.com">Pull requests</PageHeader.ParentLink>
      </PageHeader.ContextArea>
      <PageHeader.Actions>
        <Hidden when={['regular', 'wide']}>
          <ActionMenu>
            <ActionMenu.Anchor>
              <IconButton aria-label="More pull request actions" icon={KebabHorizontalIcon} />
            </ActionMenu.Anchor>
            <ActionMenu.Overlay width="small">
              <ActionList>
                <ActionList.Item onSelect={() => alert('Edit button action')}>Edit</ActionList.Item>
                <ActionList.Item onSelect={() => alert('Code button action')}>Code</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </Hidden>
        <Hidden when={['narrow']}>
          <Box sx={{display: 'flex', gap: '0.5rem'}}>
            <Button>Edit</Button>
            <Button leadingVisual={CodeIcon}>Code</Button>
          </Box>
        </Hidden>
      </PageHeader.Actions>
      <PageHeader.Description>
        <StateLabel status="pullOpened">Open</StateLabel>
        <Text sx={{color: 'fg.muted'}}>
          <Link href="https://github.com/broccolinisoup" sx={{fontWeight: 'bold'}}>
            broccolinisoup
          </Link>{' '}
          wants to merge 3 commits into <BranchName href="https://github.com/primer/react">main</BranchName> from{' '}
          <BranchName href="https://github.com/primer/react">bs/pageheader-title</BranchName>
        </Text>
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
      <PageHeader.TitleArea sx={{alignItems: 'center'}}>
        <Text sx={{color: 'rgb(101, 109, 118)', fontSize: '14px', fontWeight: 'normal'}}>/</Text>
        <PageHeader.Title as="h1" sx={{fontSize: '14px', height: '21px'}}>
          PageHeader.tsx
        </PageHeader.Title>
      </PageHeader.TitleArea>

      <PageHeader.ContextArea>
        <PageHeader.ParentLink href="/">Files</PageHeader.ParentLink>
        <PageHeader.ContextAreaActions>
          <ActionMenu>
            <ActionMenu.Anchor>
              <Button size="small" leadingVisual={GitBranchIcon} trailingVisual={TriangleDownIcon}>
                Main
              </Button>
            </ActionMenu.Anchor>
            <ActionMenu.Overlay width="medium">
              <ActionList>
                <ActionList.Item onSelect={() => alert('Main')}>
                  <ActionList.LeadingVisual>
                    <CheckIcon />
                  </ActionList.LeadingVisual>
                  main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
                </ActionList.Item>
                <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
                <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>

          <ActionMenu>
            <ActionMenu.Anchor>
              <IconButton size="small" aria-label="More file actions" icon={KebabHorizontalIcon} />
            </ActionMenu.Anchor>
            <ActionMenu.Overlay width="medium">
              <ActionList>
                <ActionList.Group>
                  <ActionList.GroupHeading>Raw file content</ActionList.GroupHeading>
                  <ActionList.Item onSelect={() => alert('Download')}>Download</ActionList.Item>
                </ActionList.Group>
                <ActionList.Divider />
                <ActionList.Item onSelect={() => alert('Jump to line')}>
                  Jump to line
                  <ActionList.TrailingVisual>L</ActionList.TrailingVisual>
                </ActionList.Item>
                <ActionList.Divider />
                <ActionList.Item onSelect={() => alert('Copy path')}>
                  Copy path
                  <ActionList.TrailingVisual>⌘⇧.</ActionList.TrailingVisual>
                </ActionList.Item>
                <ActionList.Item onSelect={() => alert('Copy permalink')}>
                  Copy permalink
                  <ActionList.TrailingVisual>⌘⇧,</ActionList.TrailingVisual>
                </ActionList.Item>
                <ActionList.Divider />
                <ActionList.Group>
                  <ActionList.GroupHeading>View Options</ActionList.GroupHeading>
                  <ActionList.Item onSelect={() => alert('Show code folding buttons')}>
                    Show code folding buttons
                  </ActionList.Item>
                  <ActionList.Item onSelect={() => alert('Wrap lines')}>Wrap lines</ActionList.Item>
                  <ActionList.Item onSelect={() => alert('Center content')}>Center content</ActionList.Item>
                </ActionList.Group>
                <ActionList.Divider />
                <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
                  Delete file
                  <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
                </ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </PageHeader.ContextAreaActions>
      </PageHeader.ContextArea>
      <PageHeader.Breadcrumbs>
        <Breadcrumbs>
          <Breadcrumbs.Item href="https://github.com/primer/react/tree/main">react</Breadcrumbs.Item>
          <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src">src</Breadcrumbs.Item>
          <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src/PageHeader">
            PageHeader
          </Breadcrumbs.Item>
          {/* The last item of the breadcrumb is usually has "selected" prop and it renders as a plain text. We are not leveraging this here because the title
          (last item of the breacdrumb component) is a heading and it is should be the first dom element in the page to avoid any interactive content before the heading (A11y feedback.) */}
        </Breadcrumbs>
      </PageHeader.Breadcrumbs>
      <PageHeader.TrailingAction>
        <IconButton size="small" variant="invisible" aria-label="Copy to clipboard" icon={CopyIcon} />
      </PageHeader.TrailingAction>

      <PageHeader.Actions>
        <Hidden when={['narrow']}>
          <ActionMenu>
            <ActionMenu.Anchor>
              <IconButton size="small" aria-label="More file actions" icon={KebabHorizontalIcon} />
            </ActionMenu.Anchor>
            <ActionMenu.Overlay width="medium">
              <ActionList>
                <ActionList.Group>
                  <ActionList.GroupHeading>Raw file content</ActionList.GroupHeading>
                  <ActionList.Item onSelect={() => alert('Download')}>Download</ActionList.Item>
                </ActionList.Group>
                <ActionList.Divider />
                <ActionList.Item onSelect={() => alert('Jump to line')}>
                  Jump to line
                  <ActionList.TrailingVisual>L</ActionList.TrailingVisual>
                </ActionList.Item>
                <ActionList.Divider />
                <ActionList.Item onSelect={() => alert('Copy path')}>
                  Copy path
                  <ActionList.TrailingVisual>⌘⇧.</ActionList.TrailingVisual>
                </ActionList.Item>
                <ActionList.Item onSelect={() => alert('Copy permalink')}>
                  Copy permalink
                  <ActionList.TrailingVisual>⌘⇧,</ActionList.TrailingVisual>
                </ActionList.Item>
                <ActionList.Divider />
                <ActionList.Group>
                  <ActionList.GroupHeading>View Options</ActionList.GroupHeading>
                  <ActionList.Item onSelect={() => alert('Show code folding buttons')}>
                    Show code folding buttons
                  </ActionList.Item>
                  <ActionList.Item onSelect={() => alert('Wrap lines')}>Wrap lines</ActionList.Item>
                  <ActionList.Item onSelect={() => alert('Center content')}>Center content</ActionList.Item>
                </ActionList.Group>
                <ActionList.Divider />
                <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
                  Delete file
                  <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
                </ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </Hidden>
      </PageHeader.Actions>
    </PageHeader>
    <Box
      sx={{
        border: '1px solid grey',
        padding: '1em',
        margin: '1em',
      }}
    >
      This is where the content of the file will be displayed.
    </Box>
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
          <PageHeader.TitleArea>
            <PageHeader.Title as="h1">
              PageHeader component initial layout explorations extra long pull request title &nbsp;
              <Text sx={{color: 'fg.muted', fontWeight: 'light'}}>#1831</Text>
            </PageHeader.Title>
          </PageHeader.TitleArea>
          <PageHeader.ContextArea>
            <PageHeader.ParentLink href="http://github.com">Pull requests</PageHeader.ParentLink>
          </PageHeader.ContextArea>
          <PageHeader.Actions>
            <Hidden when={['regular', 'wide']}>
              {/* Pop up actions */}
              <ActionMenu>
                <ActionMenu.Anchor>
                  <IconButton aria-label="More pull request actions" icon={KebabHorizontalIcon} />
                </ActionMenu.Anchor>
                <ActionMenu.Overlay width="small">
                  <ActionList>
                    <ActionList.Item onSelect={() => alert('Edit button action')}>Edit</ActionList.Item>
                    <ActionList.Item onSelect={() => alert('Code button action')}>Code</ActionList.Item>
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            </Hidden>

            <Hidden when={['narrow']}>
              <Box sx={{display: 'flex', gap: '0.5rem'}}>
                <Button>Edit</Button>
                <Button leadingVisual={CodeIcon}>Code</Button>
              </Box>
            </Hidden>
          </PageHeader.Actions>
          <PageHeader.Description>
            <StateLabel status="pullOpened">Open</StateLabel>
            <Text sx={{fontSize: 1, color: 'fg.muted'}}>
              <Link href="https://github.com/broccolinisoup" sx={{fontWeight: 'bold'}}>
                broccolinisoup
              </Link>{' '}
              wants to merge 3 commits into <BranchName href="https://github.com/primer/react">main</BranchName> from{' '}
              <BranchName href="https://github.com/primer/react">broccolinisoup/switch-to-new-underlineNav</BranchName>
            </Text>
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
      </PageLayout.Content>
      <PageLayout.Pane>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
          <Box>
            <Text sx={{fontSize: 0, fontWeight: 'bold', display: 'block', color: 'fg.muted'}}>Assignees</Text>

            <Text sx={{fontSize: 0, color: 'fg.muted', lineHeight: 'condensed', display: 'flex', alignItems: 'center'}}>
              No one —
              <Button
                variant="invisible"
                onClick={() => {
                  alert('Assign yourself')
                }}
                sx={{color: 'fg.muted'}}
              >
                assign yourself
              </Button>
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

export const IssuesPage = () => {
  return (
    <PageLayout>
      <PageLayout.Header>
        <PageHeader>
          <PageHeader.TitleArea>
            <PageHeader.Title as="h1">
              PageHeader component: A11y sign-off review - React to alpha &nbsp;
              <Link href="https://github.com/github/primer/issues/1115" sx={{color: 'fg.muted', fontWeight: 'light'}}>
                #1115
              </Link>
            </PageHeader.Title>
          </PageHeader.TitleArea>
          <PageHeader.ContextArea>
            <PageHeader.ContextBar sx={{gap: '8px'}}>
              <Button
                onClick={() => {
                  alert('The title will go into edit mode')
                }}
              >
                Edit
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  alert('New issue modal will open')
                }}
              >
                New Issue
              </Button>
            </PageHeader.ContextBar>
            <PageHeader.ContextAreaActions>
              <IconButton
                aria-label="Copy permalink"
                icon={CopyIcon}
                variant="invisible"
                onClick={() => {
                  alert('This button copies the permalink to the clipboard')
                }}
              />
            </PageHeader.ContextAreaActions>
          </PageHeader.ContextArea>
          <PageHeader.Actions>
            <Hidden when={['narrow']}>
              <Box sx={{display: 'flex', gap: '0.5rem'}}>
                <Button
                  onClick={() => {
                    alert('The title will go into edit mode')
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    alert('New issue modal will open')
                  }}
                >
                  New Issue
                </Button>
                <IconButton
                  aria-label="Copy permalink"
                  icon={CopyIcon}
                  variant="invisible"
                  onClick={() => {
                    alert('This button copies the permalink to the clipboard')
                  }}
                />
              </Box>
            </Hidden>
          </PageHeader.Actions>
          <PageHeader.Description>
            <StateLabel status="issueOpened">Open</StateLabel>
          </PageHeader.Description>
        </PageHeader>
      </PageLayout.Header>
      <PageLayout.Content>
        <Box
          sx={{
            border: '1px solid',
            borderRadius: 2,
            borderColor: 'border.default',
            height: 'auto',
            padding: 3,
            paddingTop: 0,
          }}
        >
          <h2>Context</h2>
          PageHeader will be responsible to determine the arrangement of the top-level headings, side actions, header
          metadata, parent links, and how all these elements adapt to different devices, pointer types, and smaller,
          mobile-friendly viewports.
          <h2 id="helpful-links">Helpful Links</h2>
          <ul aria-labelledby='helpful-links"'>
            <li>Primer documentation site: https://primer.style</li>
            <li>Primer React storybook: https://primer.style/react/storybook/</li>
          </ul>
        </Box>
        <Box>
          <Timeline>
            <Timeline.Item>
              <Timeline.Badge>
                <Octicon icon={CrossReferenceIcon} />
              </Timeline.Badge>
              <Timeline.Body>
                <Link
                  href="https://github.com/broccolinisoup"
                  sx={{fontWeight: 'bold', color: 'fg.default', mr: 1}}
                  muted
                >
                  broccolinisoup
                </Link>
                mentioned this on Jul 20, 2022
              </Timeline.Body>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Badge>
                <Octicon icon={PaperclipIcon} />
              </Timeline.Badge>
              <Timeline.Body>
                <Link
                  href="https://github.com/lesliecdubbs"
                  sx={{fontWeight: 'bold', color: 'fg.default', mr: 1}}
                  muted
                >
                  lesliecdubbs
                </Link>
                added react and accessibility labels on Jul 12, 2022
              </Timeline.Body>
            </Timeline.Item>
          </Timeline>
        </Box>
      </PageLayout.Content>
      <PageLayout.Pane>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
          <Box>
            <Heading as="h2" sx={{fontSize: 0, fontWeight: 'bold', display: 'block', color: 'fg.muted'}}>
              Assignees
            </Heading>
            <Text sx={{fontSize: 0, color: 'fg.muted', lineHeight: 'condensed', display: 'flex', alignItems: 'center'}}>
              No one —
              <Button
                variant="invisible"
                onClick={() => {
                  alert('This button assigns the issue to the logged-in user')
                }}
                sx={{color: 'fg.muted'}}
              >
                assign yourself
              </Button>
            </Text>
          </Box>
          <Box>
            <Heading
              as="h2"
              sx={{fontSize: 0, fontWeight: 'bold', display: 'block', color: 'fg.muted', paddingBottom: 2}}
            >
              Labels
            </Heading>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <Token as="button" onClick={() => alert('react token is selected')} text="react" />
              <Token as="button" onClick={() => alert('accessibility token is selected')} text="accessibility" />
            </Box>
          </Box>
        </Box>
      </PageLayout.Pane>
    </PageLayout>
  )
}

FilesPageOnNarrowViewport.parameters = setViewportParamToNarrow

export default meta
