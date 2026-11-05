import {
  CheckIcon,
  ChecklistIcon,
  CodeIcon,
  CommentDiscussionIcon,
  CopyIcon,
  CrossReferenceIcon,
  FileDiffIcon,
  GitBranchIcon,
  GitCommitIcon,
  KebabHorizontalIcon,
  PaperclipIcon,
  TriangleDownIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {ActionMenu} from '../ActionMenu'
import {BranchName} from '../BranchName'
import {Breadcrumbs} from '../Breadcrumbs'
import {Button} from '../Button'
import {Hidden} from '../Hidden'
import {IconButton} from '../IconButton'
import {Link} from '../Link'
import {PageLayout} from '../PageLayout'
import {StateLabel} from '../StateLabel'
import {Text} from '../Text'
import {Timeline} from '../Timeline'
import {Token} from '../Token'
import {UnderlineNav} from '../UnderlineNav'
import {PageHeader} from './PageHeader'

const meta = {
  title: 'React Tailwind/Layout/PageHeader/Examples',
  component: PageHeader,
  parameters: {layout: 'fullscreen', controls: {expanded: true}},
} satisfies Meta<typeof PageHeader>
export default meta
type Story = StoryObj<typeof meta>

const narrowViewport = {viewport: {defaultViewport: 'small'}}

function PullRequestNavigation() {
  return (
    <UnderlineNav aria-label="Pull Request">
      <UnderlineNav.Item leadingVisual={<CommentDiscussionIcon />} counter="12" aria-current="page">
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
  )
}

function PullRequestActions() {
  return (
    <>
      <Hidden when={['regular', 'wide']}>
        <ActionMenu>
          <ActionMenu.Trigger
            aria-label="More pull request actions"
            render={<IconButton aria-label="More pull request actions" icon={KebabHorizontalIcon} />}
          />
          <ActionMenu.Content>
            <ActionMenu.Item>Edit</ActionMenu.Item>
            <ActionMenu.Item>Code</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      </Hidden>
      <Hidden when={['narrow']}>
        <div className="flex gap-2">
          <Button>Edit</Button>
          <Button leadingVisual={CodeIcon}>Code</Button>
        </div>
      </Hidden>
    </>
  )
}

function PullRequestDescription({branch = 'bs/pageheader-title'}: {branch?: string}) {
  return (
    <>
      <StateLabel status="pullOpened">Open</StateLabel>
      <Text className="text-sm text-muted">
        <Link href="https://github.com/broccolinisoup" className="font-semibold">
          broccolinisoup
        </Link>{' '}
        wants to merge 3 commits into <BranchName href="https://github.com/primer/react">main</BranchName> from{' '}
        <BranchName href="https://github.com/primer/react">{branch}</BranchName>
      </Text>
    </>
  )
}

function PullRequestHeader() {
  return (
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
        <PullRequestActions />
      </PageHeader.Actions>
      <PageHeader.Description>
        <PullRequestDescription />
      </PageHeader.Description>
      <PageHeader.Navigation>
        <PullRequestNavigation />
      </PageHeader.Navigation>
    </PageHeader>
  )
}

function FileActionsMenu({size}: {size?: 'small'}) {
  return (
    <ActionMenu>
      <ActionMenu.Trigger
        aria-label="More file actions"
        render={<IconButton size={size} aria-label="More file actions" icon={KebabHorizontalIcon} />}
      />
      <ActionMenu.Content>
        <ActionMenu.Item>Download</ActionMenu.Item>
        <ActionMenu.Divider />
        <ActionMenu.Item>Jump to line</ActionMenu.Item>
        <ActionMenu.Item>Copy path</ActionMenu.Item>
        <ActionMenu.Item>Copy permalink</ActionMenu.Item>
        <ActionMenu.Divider />
        <ActionMenu.Item>Show code folding buttons</ActionMenu.Item>
        <ActionMenu.Item>Wrap lines</ActionMenu.Item>
        <ActionMenu.Item>Center content</ActionMenu.Item>
        <ActionMenu.Divider />
        <ActionMenu.Item variant="danger">Delete file</ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  )
}

function BranchMenu() {
  return (
    <ActionMenu>
      <ActionMenu.Trigger
        render={
          <Button size="small" leadingVisual={GitBranchIcon} trailingVisual={TriangleDownIcon}>
            Main
          </Button>
        }
      />
      <ActionMenu.Content>
        <ActionMenu.Item>
          <CheckIcon /> main
        </ActionMenu.Item>
        <ActionMenu.Item>branch-1</ActionMenu.Item>
        <ActionMenu.Item>branch-2</ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  )
}

export const Webhooks: Story = {
  render: () => (
    <div className="p-4">
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
  ),
}

export const WebhooksOnNarrowViewport: Story = {...Webhooks, parameters: narrowViewport}

export const PullRequestPage: Story = {
  render: () => (
    <div className="p-4">
      <PullRequestHeader />
    </div>
  ),
}

export const PullRequestPageOnNarrowViewport: Story = {...PullRequestPage, parameters: narrowViewport}

export const FilesPage: Story = {
  render: () => (
    <div className="p-4">
      <PageHeader role="banner" aria-label="PageHeader.tsx">
        <PageHeader.TitleArea className="items-center">
          <Text className="font-normal text-muted [font-size:var(--text-body-size-medium)]">/</Text>
          <PageHeader.Title as="h1" className="h-[21px] [font-size:var(--text-body-size-medium)]">
            PageHeader.tsx
          </PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.ContextArea>
          <PageHeader.ParentLink href="/">Files</PageHeader.ParentLink>
          <PageHeader.ContextAreaActions>
            <BranchMenu />
            <FileActionsMenu size="small" />
          </PageHeader.ContextAreaActions>
        </PageHeader.ContextArea>
        <PageHeader.Breadcrumbs>
          <Breadcrumbs>
            <Breadcrumbs.Item href="https://github.com/primer/react/tree/main">react</Breadcrumbs.Item>
            <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src">src</Breadcrumbs.Item>
            <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src/PageHeader">
              PageHeader
            </Breadcrumbs.Item>
          </Breadcrumbs>
        </PageHeader.Breadcrumbs>
        <PageHeader.TrailingAction>
          <IconButton size="small" variant="invisible" aria-label="Copy to clipboard" icon={CopyIcon} />
        </PageHeader.TrailingAction>
        <PageHeader.Actions>
          <Hidden when={['narrow']}>
            <FileActionsMenu size="small" />
          </Hidden>
        </PageHeader.Actions>
      </PageHeader>
      <div className="m-4 border border-emphasis p-4">This is where the content of the file will be displayed.</div>
    </div>
  ),
}

export const FilesPageOnNarrowViewport: Story = {...FilesPage, parameters: narrowViewport}

export const WithPageLayout: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Header>
        <PageHeader>
          <PageHeader.TitleArea>
            <PageHeader.Title as="h1">
              PageHeader component initial layout explorations extra long pull request title &nbsp;
              <Text className="font-light text-muted">#1831</Text>
            </PageHeader.Title>
          </PageHeader.TitleArea>
          <PageHeader.ContextArea>
            <PageHeader.ParentLink href="http://github.com">Pull requests</PageHeader.ParentLink>
          </PageHeader.ContextArea>
          <PageHeader.Actions>
            <PullRequestActions />
          </PageHeader.Actions>
          <PageHeader.Description>
            <PullRequestDescription branch="broccolinisoup/switch-to-new-underlineNav" />
          </PageHeader.Description>
          <PageHeader.Navigation>
            <PullRequestNavigation />
          </PageHeader.Navigation>
        </PageHeader>
      </PageLayout.Header>
      <PageLayout.Content>
        <div className="h-[200px] rounded-md border border-default" />
      </PageLayout.Content>
      <PageLayout.Pane>
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="m-0 block [font-size:var(--text-body-size-small)] font-semibold text-muted">Assignees</h2>
            <Text className="flex items-center text-xs leading-[1.25] text-muted">
              No one —
              <Button variant="invisible" className="text-muted">
                assign yourself
              </Button>
            </Text>
          </div>
          <div className="h-px w-full bg-default" role="separator" />
          <div>
            <h2 className="m-0 block [font-size:var(--text-body-size-small)] font-semibold text-muted">Labels</h2>
            <Text className="flex h-[26px] items-center text-xs leading-[1.25] text-muted">None yet</Text>
          </div>
        </div>
      </PageLayout.Pane>
    </PageLayout>
  ),
}

export const IssuesPage: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Header>
        <PageHeader>
          <PageHeader.TitleArea>
            <PageHeader.Title as="h1">
              PageHeader component: A11y sign-off review - React to alpha &nbsp;
              <Link href="https://github.com/github/primer/issues/1115" className="font-light text-muted">
                #1115
              </Link>
            </PageHeader.Title>
          </PageHeader.TitleArea>
          <PageHeader.ContextArea>
            <PageHeader.ContextBar className="flex gap-2">
              <Button>Edit</Button>
              <Button variant="primary">New Issue</Button>
            </PageHeader.ContextBar>
            <PageHeader.ContextAreaActions>
              <IconButton aria-label="Copy permalink" icon={CopyIcon} variant="invisible" />
            </PageHeader.ContextAreaActions>
          </PageHeader.ContextArea>
          <PageHeader.Actions>
            <Hidden when={['narrow']}>
              <div className="flex gap-2">
                <Button>Edit</Button>
                <Button variant="primary">New Issue</Button>
                <IconButton aria-label="Copy permalink" icon={CopyIcon} variant="invisible" />
              </div>
            </Hidden>
          </PageHeader.Actions>
          <PageHeader.Description>
            <StateLabel status="issueOpened">Open</StateLabel>
          </PageHeader.Description>
        </PageHeader>
      </PageLayout.Header>
      <PageLayout.Content>
        <div className="rounded-md border border-default p-4 pt-0">
          <h2>Context</h2>
          PageHeader will be responsible to determine the arrangement of the top-level headings, side actions, header
          metadata, parent links, and how all these elements adapt to different devices, pointer types, and smaller,
          mobile-friendly viewports.
          <h2 id="helpful-links">Helpful Links</h2>
          <ul aria-labelledby="helpful-links">
            <li>Primer documentation site: https://primer.style</li>
            <li>Primer React storybook: https://primer.style/react/storybook/</li>
          </ul>
        </div>
        <Timeline>
          <Timeline.Item>
            <Timeline.Badge>
              <CrossReferenceIcon />
            </Timeline.Badge>
            <Timeline.Body>
              <Link href="https://github.com/broccolinisoup" className="mr-1 font-semibold text-default">
                broccolinisoup
              </Link>
              mentioned this on Jul 20, 2022
            </Timeline.Body>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Badge>
              <PaperclipIcon />
            </Timeline.Badge>
            <Timeline.Body>
              <Link href="https://github.com/lesliecdubbs" className="mr-1 font-semibold text-default">
                lesliecdubbs
              </Link>
              added react and accessibility labels on Jul 12, 2022
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </PageLayout.Content>
      <PageLayout.Pane>
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="m-0 block [font-size:var(--text-body-size-small)] font-semibold text-muted">Assignees</h2>
            <Text className="flex items-center text-xs leading-[1.25] text-muted">
              No one —
              <Button variant="invisible" className="text-muted">
                assign yourself
              </Button>
            </Text>
          </div>
          <div>
            <h2 className="m-0 block pb-2 [font-size:var(--text-body-size-small)] font-semibold text-muted">Labels</h2>
            <div className="flex items-center gap-1">
              <Token as="button" text="react" />
              <Token as="button" text="accessibility" />
            </div>
          </div>
        </div>
      </PageLayout.Pane>
    </PageLayout>
  ),
}
