import {ArrowRightIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {BranchName} from '../BranchName'
import {Button} from '../Button'
import {Link} from '../Link'
import {PageHeader} from '../PageHeader'
import {StateLabel} from '../StateLabel'
import {Text} from '../Text'
import {Hidden} from './Hidden'

const meta = {
  title: 'React Tailwind/Components/Hidden/Examples',
  component: Hidden,
  parameters: {layout: 'fullscreen', controls: {expanded: true}},
  args: {children: 'Hidden content', when: 'narrow'},
} satisfies Meta<typeof Hidden>
export default meta
type Story = StoryObj<typeof meta>

const narrowViewport = {viewport: {defaultViewport: 'small'}}

export const Webhooks: Story = {
  render: () => (
    <div className="p-3">
      <PageHeader role="banner" aria-label="Webhooks">
        <PageHeader.ContextArea>
          <PageHeader.ParentLink href="http://github.com">Repository settings</PageHeader.ParentLink>
        </PageHeader.ContextArea>
        <PageHeader.LeadingAction className="pl-2">
          <Hidden when={['narrow']}>
            <Button variant="primary">New webhook</Button>
          </Hidden>
        </PageHeader.LeadingAction>
        <PageHeader.TitleArea>
          <Hidden className="flex pl-2" when={['regular', 'wide']}>
            <Button variant="primary">New</Button>
          </Hidden>
          <PageHeader.Title as="h2">Webhooks</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>
    </div>
  ),
}

export const WebhooksOnNarrowViewport: Story = {
  ...Webhooks,
  parameters: narrowViewport,
}

export const PullRequestPage: Story = {
  render: () => (
    <div className="p-3">
      <PageHeader role="banner" aria-label="Add Hidden utility component">
        <PageHeader.ContextArea>
          <PageHeader.ParentLink href="http://github.com">Pull requests</PageHeader.ParentLink>
        </PageHeader.ContextArea>
        <PageHeader.TitleArea>
          <PageHeader.Title as="h2">Add Hidden utility component</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Description>
          <StateLabel status="pullOpened">Open</StateLabel>
          <Hidden when={['narrow']}>
            <Text className="text-[length:var(--text-body-size-small)] text-muted">
              <Link href="#" className="font-semibold" muted>
                broccolinisoup
              </Link>{' '}
              wants to merge 3 commits into
              <BranchName href="#" className="underline">
                main
              </BranchName>
              from
              <BranchName href="#" className="underline">
                broccolinisoup/add-hidden-component
              </BranchName>
            </Text>
          </Hidden>
          <Hidden when={['regular', 'wide']}>
            <Text className="text-[length:var(--text-body-size-small)] text-muted">
              <BranchName href="#">main</BranchName>
              <ArrowRightIcon />
              <BranchName href="#">page-header-initial</BranchName>
            </Text>
          </Hidden>
        </PageHeader.Description>
      </PageHeader>
    </div>
  ),
}

export const PullRequestPageOnNarrowViewport: Story = {
  ...PullRequestPage,
  parameters: narrowViewport,
}
