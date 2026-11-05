import {
  ChecklistIcon,
  CommentDiscussionIcon,
  FileDiffIcon,
  GearIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  GraphIcon,
  KebabHorizontalIcon,
  PencilIcon,
  SidebarExpandIcon,
  TriangleDownIcon,
  WorkflowIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Breadcrumbs} from '../Breadcrumbs'
import {Hidden} from '../Hidden'
import {IconButton} from '../IconButton'
import {Label} from '../Label'
import {Link} from '../Link'
import {Text} from '../Text'
import {UnderlineNav} from '../UnderlineNav'
import {PageHeader} from './PageHeader'

const meta = {
  title: 'React Tailwind/Layout/PageHeader/Features',
  component: PageHeader,
  parameters: {layout: 'fullscreen', controls: {expanded: true}},
} satisfies Meta<typeof PageHeader>
export default meta
type Story = StoryObj<typeof meta>

const padded = (children: React.ReactNode) => <div className="p-4">{children}</div>
const title = (variant: React.ComponentProps<typeof PageHeader.TitleArea>['variant'] = 'medium') =>
  padded(
    <PageHeader role="banner" aria-label="Title">
      <PageHeader.TitleArea variant={variant}>
        <PageHeader.Title>Title</PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>,
  )

export const HasTitleOnly: Story = {render: () => title()}
export const HasLargeTitle: Story = {render: () => title('large')}
export const WithLeadingAndTrailingVisuals: Story = {
  render: () =>
    padded(
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
      </PageHeader>,
    ),
}
export const WithLeadingVisualHiddenOnRegularViewport: Story = {
  render: () =>
    padded(
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
      </PageHeader>,
    ),
  parameters: {viewport: {defaultViewport: 'regular'}},
}
export const WithActions: Story = {
  render: () =>
    padded(
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
      </PageHeader>,
    ),
}
export const WithDescriptionSlot: Story = {
  render: () =>
    padded(
      <PageHeader role="banner" aria-label="Add-pageheader-docs">
        <PageHeader.TitleArea>
          <PageHeader.Title>add-pageheader-docs</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Description>
          <Text className="text-sm text-muted">
            <Link href="https://github.com/broccolinisoup" className="font-semibold">
              broccolinisoup
            </Link>{' '}
            created this branch 5 days ago · 14 commits · updated today
          </Text>
        </PageHeader.Description>
      </PageHeader>,
    ),
}
export const WithNavigationSlot: Story = {
  render: () =>
    padded(
      <PageHeader role="banner" aria-label="Pull request title">
        <PageHeader.TitleArea>
          <PageHeader.Title>Pull request title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Navigation>
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
        </PageHeader.Navigation>
      </PageHeader>,
    ),
}
export const WithCustomNavigation: Story = {
  render: () =>
    padded(
      <PageHeader role="banner" aria-label="Pull request title">
        <PageHeader.TitleArea>
          <PageHeader.Title>Pull request title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Navigation as="nav" aria-label="Item list">
          <ul className="flex list-none gap-2 px-4">
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
      </PageHeader>,
    ),
}
export const WithLeadingAndTrailingActions: Story = {
  render: () =>
    padded(
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
      </PageHeader>,
    ),
}
export const WithParentLinkAndActionsOfContextArea: Story = {
  render: () =>
    padded(
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
      </PageHeader>,
    ),
  parameters: {viewport: {defaultViewport: 'small'}},
}
export const WithContextBarAndActionsOfContextArea: Story = {
  render: () =>
    padded(
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
      </PageHeader>,
    ),
  parameters: {viewport: {defaultViewport: 'small'}},
}
export const WithActionsThatHaveResponsiveContent: Story = {
  render: () =>
    padded(
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
      </PageHeader>,
    ),
}
export const HasBottomBorder: Story = {
  render: () =>
    padded(
      <PageHeader role="banner" aria-label="Title" hasBorder>
        <PageHeader.TitleArea>
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>,
    ),
}
