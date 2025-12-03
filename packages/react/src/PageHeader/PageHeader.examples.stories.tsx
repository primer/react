import type {Meta} from '@storybook/react-vite'
import {
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Text,
  StateLabel,
  BranchName,
  PageLayout,
  Timeline,
  Heading,
  Token,
} from '..'
import Octicon from '../Octicon'
import {
  KebabHorizontalIcon,
  GitBranchIcon,
  CodeIcon,
  CommentDiscussionIcon,
  GitCommitIcon,
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
import classes from './PageHeader.examples.stories.module.css'

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
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="Webhooks">
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
  </div>
)

export const WebhooksOnNarrowViewport = () => {
  return <Webhooks />
}

WebhooksOnNarrowViewport.parameters = setViewportParamToNarrow

export const PullRequestPage = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader
      role="banner"
      aria-label="PageHeader component initial layout explorations extra long pull request title"
    >
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
          <div className={classes.ControlStack}>
            <Button>Edit</Button>
            <Button leadingVisual={CodeIcon}>Code</Button>
          </div>
        </Hidden>
      </PageHeader.Actions>
      <PageHeader.Description>
        <StateLabel status="pullOpened">Open</StateLabel>
        <Text className={classes.DescriptionText}>
          <Link href="https://github.com/broccolinisoup" className={classes.BoldLink}>
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

export const PullRequestPageOnNarrowViewport = () => {
  return <PullRequestPage />
}

PullRequestPageOnNarrowViewport.parameters = setViewportParamToNarrow

export const FilesPage = () => (
  <div className={classes.PaddingContainer}>
    <PageHeader role="banner" aria-label="PageHeader.tsx">
      <PageHeader.TitleArea className={classes.FileTitleArea}>
        <Text className={classes.FilePathText}>/</Text>
        <PageHeader.Title as="h1" className={classes.FileTitle}>
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
    <div className={classes.FileContentContainer}>This is where the content of the file will be displayed.</div>
  </div>
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
              <Text className={classes.SubduedText}>#1831</Text>
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
              <div className={classes.ControlStack}>
                <Button>Edit</Button>
                <Button leadingVisual={CodeIcon}>Code</Button>
              </div>
            </Hidden>
          </PageHeader.Actions>
          <PageHeader.Description>
            <StateLabel status="pullOpened">Open</StateLabel>
            <Text className={classes.DescriptionText}>
              <Link href="https://github.com/broccolinisoup" className={classes.BoldLink}>
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
      </PageLayout.Header>
      <PageLayout.Content>
        <div className={classes.LayoutContentBox}></div>
      </PageLayout.Content>
      <PageLayout.Pane>
        <div className={classes.PaneStack}>
          <div>
            <Text className={classes.PaneSectionHeading}>Assignees</Text>
            <Text className={classes.PaneMetaTextWithButton}>
              No one —
              <Button
                variant="invisible"
                onClick={() => {
                  alert('Assign yourself')
                }}
                className={classes.PaneMetaButton}
              >
                assign yourself
              </Button>
            </Text>
          </div>
          <div className={classes.PaneSeparator} role="separator"></div>
          <div>
            <Text className={classes.PaneSectionHeading}>Labels</Text>
            <Text className={classes.PaneMetaText}>None yet</Text>
          </div>
        </div>
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
              <Link href="https://github.com/github/primer/issues/1115" className={classes.SubduedText}>
                #1115
              </Link>
            </PageHeader.Title>
          </PageHeader.TitleArea>
          <PageHeader.ContextArea>
            <PageHeader.ContextBar className={classes.LabelBar}>
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
              <div className={classes.ControlStack}>
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
              </div>
            </Hidden>
          </PageHeader.Actions>
          <PageHeader.Description>
            <StateLabel status="issueOpened">Open</StateLabel>
          </PageHeader.Description>
        </PageHeader>
      </PageLayout.Header>
      <PageLayout.Content>
        <div className={classes.IssueMetaContent}>
          <h2>Context</h2>
          PageHeader will be responsible to determine the arrangement of the top-level headings, side actions, header
          metadata, parent links, and how all these elements adapt to different devices, pointer types, and smaller,
          mobile-friendly viewports.
          <h2 id="helpful-links">Helpful Links</h2>
          <ul aria-labelledby='helpful-links"'>
            <li>Primer documentation site: https://primer.style</li>
            <li>Primer React storybook: https://primer.style/react/storybook/</li>
          </ul>
        </div>
        <div>
          <Timeline>
            <Timeline.Item>
              <Timeline.Badge>
                <Octicon icon={CrossReferenceIcon} />
              </Timeline.Badge>
              <Timeline.Body>
                <Link href="https://github.com/broccolinisoup" className={classes.IssueTimelineLink} muted>
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
                <Link href="https://github.com/lesliecdubbs" className={classes.IssueTimelineLink} muted>
                  lesliecdubbs
                </Link>
                added react and accessibility labels on Jul 12, 2022
              </Timeline.Body>
            </Timeline.Item>
          </Timeline>
        </div>
      </PageLayout.Content>
      <PageLayout.Pane>
        <div className={classes.PaneStack}>
          <div>
            <Heading as="h2" className={classes.PaneSectionHeading}>
              Assignees
            </Heading>
            <Text className={classes.PaneMetaTextWithButton}>
              No one —
              <Button
                variant="invisible"
                onClick={() => {
                  alert('This button assigns the issue to the logged-in user')
                }}
                className={classes.PaneMetaButton}
              >
                assign yourself
              </Button>
            </Text>
          </div>
          <div>
            <Heading as="h2" className={classes.PaneSectionHeadingWithPadding}>
              Labels
            </Heading>
            <div className={classes.LabelTokenStack}>
              <Token as="button" onClick={() => alert('react token is selected')} text="react" />
              <Token as="button" onClick={() => alert('accessibility token is selected')} text="accessibility" />
            </div>
          </div>
        </div>
      </PageLayout.Pane>
    </PageLayout>
  )
}

FilesPageOnNarrowViewport.parameters = setViewportParamToNarrow

export default meta
