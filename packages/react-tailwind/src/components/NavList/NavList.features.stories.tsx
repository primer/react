import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  CodeIcon,
  CommentDiscussionIcon,
  FileDirectoryIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  MilestoneIcon,
  PackageIcon,
  PeopleIcon,
  RepoIcon,
  TelescopeIcon,
} from '@primer/octicons-react'
import React, {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {FeatureFlags} from '../FeatureFlags'
import {PageLayout} from '../PageLayout'
import {Popover} from '../Popover'
import {VisuallyHidden} from '../VisuallyHidden'
import {NavList, type NavListGroupExpandItem} from './NavList'

const meta = {
  title: 'React Tailwind/Navigation/NavList/Features',
  component: NavList,
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof NavList>
export default meta
type Story = StoryObj<typeof meta>

function PageLayoutNav({children}: {children: React.ReactNode}) {
  return (
    <PageLayout>
      <PageLayout.Pane position="start">{children}</PageLayout.Pane>
      <PageLayout.Content />
    </PageLayout>
  )
}

const childItems = (
  <NavList.SubNav.Panel>
    <NavList.Item href="#sub-item-1" aria-current="page">
      Sub item 1
    </NavList.Item>
    <NavList.Item href="#sub-item-2">Sub item 2</NavList.Item>
  </NavList.SubNav.Panel>
)

function WrappedIssueDescription(_props: {id?: string}) {
  return (
    <NavList.Description>
      #42 · feature/navigation<span aria-hidden="true">!</span>
    </NavList.Description>
  )
}

export const ItemDescriptions: Story = {
  render: () => (
    <NavList aria-label="Issues" style={{width: 320}}>
      <NavList.Item data-testid="direct-description" href="#issue" tooltipText="View issue">
        Improve navigation
        <NavList.Description>
          #42 · feature/navigation<span aria-hidden="true">!</span>
        </NavList.Description>
        <NavList.TrailingVisual>Ready</NavList.TrailingVisual>
      </NavList.Item>
      <NavList.Item
        aria-describedby="wrapped-issue-detail"
        data-testid="wrapped-description"
        description={<WrappedIssueDescription id="wrapped-issue-detail" />}
        href="#issue"
        tooltipText="View issue"
      >
        Improve navigation
        <NavList.TrailingVisual>Ready</NavList.TrailingVisual>
      </NavList.Item>
      <NavList.Item href="#settings">
        Settings
        <NavList.Description>Configure the repository</NavList.Description>
        <NavList.TrailingVisual aria-hidden="true">Decorative</NavList.TrailingVisual>
      </NavList.Item>
      <NavList.Item href="#profile">
        Profile
        <NavList.Description>Update your profile</NavList.Description>
        <NavList.TrailingVisual className="hidden">Hidden status</NavList.TrailingVisual>
      </NavList.Item>
    </NavList>
  ),
}

export const WithSubItems: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Item href="#item-1">Item 1</NavList.Item>
        <NavList.SubNav defaultOpen>
          <NavList.SubNav.Trigger>Item 2</NavList.SubNav.Trigger>
          {childItems}
        </NavList.SubNav>
        <NavList.Item href="#item-3">Item 3</NavList.Item>
      </NavList>
    </PageLayoutNav>
  ),
}

const WrappedGroupHeading = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof NavList.GroupHeading>
>(function WrappedGroupHeading(props, ref) {
  return <NavList.GroupHeading {...props} ref={ref} />
})

function SettingsGroup() {
  return (
    <NavList.Group
      hideDivider
      heading={
        <WrappedGroupHeading as="h2">
          Settings
          <NavList.GroupHeading.TrailingAction label="Manage settings" icon={BookIcon} />
        </WrappedGroupHeading>
      }
    >
      <NavList.Item href="#general">General</NavList.Item>
      <NavList.Item href="#security">Security</NavList.Item>
    </NavList.Group>
  )
}

function WrappedSettingsGroup() {
  return (
    <>
      <NavList.Divider />
      <SettingsGroup />
    </>
  )
}

function CollapsedSettingsGroup() {
  return (
    <>
      <NavList.Divider />
      <li>
        <Popover>
          <Popover.Button>Collapsed settings</Popover.Button>
          <Popover.Content aria-label="Settings links">
            <a href="#general">General</a>
          </Popover.Content>
        </Popover>
      </li>
    </>
  )
}

function GroupCompositionPair({itemGap}: {itemGap: boolean}) {
  const label = itemGap ? 'With item gap' : 'Without item gap'
  return (
    <FeatureFlags flags={{primer_react_action_list_item_gap: itemGap}}>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
        {[false, true].map(wrapped => (
          <NavList
            key={String(wrapped)}
            aria-label={`${label}, ${wrapped ? 'wrapped' : 'direct'}`}
            style={{width: 256}}
          >
            <NavList.Group title="Projects">
              <NavList.Item href="#overview">Overview</NavList.Item>
            </NavList.Group>
            {wrapped ? (
              <WrappedSettingsGroup />
            ) : (
              <>
                <NavList.Divider />
                <NavList.Group
                  hideDivider
                  heading={
                    <WrappedGroupHeading as="h2">
                      Settings
                      <NavList.GroupHeading.TrailingAction label="Manage settings" icon={BookIcon} />
                    </WrappedGroupHeading>
                  }
                >
                  <NavList.Item href="#general">General</NavList.Item>
                  <NavList.Item href="#security">Security</NavList.Item>
                </NavList.Group>
              </>
            )}
            <NavList.Item href="#help">Help</NavList.Item>
          </NavList>
        ))}
      </div>
    </FeatureFlags>
  )
}

export const WithWrappedGroups: Story = {
  render: () => (
    <>
      <GroupCompositionPair itemGap={false} />
      <GroupCompositionPair itemGap />
      <NavList aria-label="Collapsed navigation" style={{width: 256}}>
        <NavList.Group title="Projects">
          <NavList.Item href="#overview">Overview</NavList.Item>
        </NavList.Group>
        <CollapsedSettingsGroup />
        <NavList.Item href="#help">Help</NavList.Item>
      </NavList>
    </>
  ),
}

export const WithNestedSubItems: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.SubNav defaultOpen>
          <NavList.SubNav.Trigger>Item 1</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.Item href="#sub-item-1">Sub item 1</NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
        <NavList.SubNav defaultOpen>
          <NavList.SubNav.Trigger>Item 2</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.SubNav defaultOpen>
              <NavList.SubNav.Trigger>Sub item 1</NavList.SubNav.Trigger>
              <NavList.SubNav.Panel>
                <NavList.SubNav defaultOpen>
                  <NavList.SubNav.Trigger>Sub item 1.1</NavList.SubNav.Trigger>
                  <NavList.SubNav.Panel>
                    <NavList.Item href="#sub-item-1-1-1">Sub item 1.1.1</NavList.Item>
                    <NavList.SubNav defaultOpen>
                      <NavList.SubNav.Trigger>Sub item 1.1.2</NavList.SubNav.Trigger>
                      <NavList.SubNav.Panel>
                        <NavList.Item href="#sub-item-1-1-2-1">Sub item 1.1.2.1</NavList.Item>
                        <NavList.Item href="#sub-item-1-1-2-2" aria-current="page">
                          Sub item 1.1.2.2
                        </NavList.Item>
                      </NavList.SubNav.Panel>
                    </NavList.SubNav>
                  </NavList.SubNav.Panel>
                </NavList.SubNav>
                <NavList.Item href="#sub-item-1-2">Sub item 1.2</NavList.Item>
              </NavList.SubNav.Panel>
            </NavList.SubNav>
            <NavList.Item href="#sub-item-2">Sub item 2</NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
        <NavList.Item href="#item-3">Item 3</NavList.Item>
      </NavList>
    </PageLayoutNav>
  ),
}
const ReactRouterLikeLink = React.forwardRef<
  HTMLAnchorElement,
  {to: string; children?: React.ReactNode} & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'>
>(function ReactRouterLikeLink({to, children, ...props}, ref) {
  return (
    <a ref={ref} href={to} {...props}>
      {children}
    </a>
  )
})

export const WithReactRouterLink: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList>
        <NavList.Item as={ReactRouterLikeLink} to="#" aria-current="page">
          Item 1
        </NavList.Item>
        <NavList.Item as={ReactRouterLikeLink} to="#">
          Item 2
        </NavList.Item>
        <NavList.Item as={ReactRouterLikeLink} to="#">
          Item 3
        </NavList.Item>
      </NavList>
    </PageLayoutNav>
  ),
}

const NextJSLikeLink = React.forwardRef<HTMLAnchorElement, {href: string; children: React.ReactNode}>(
  function NextJSLikeLink({href, children}, ref) {
    const child = React.Children.only(children)
    return React.isValidElement<{href?: string; ref?: React.Ref<HTMLAnchorElement>}>(child)
      ? React.cloneElement(child, {href, ref})
      : null
  },
)

export const WithNextJsLink: Story = {
  name: 'With Next JS Link',
  render: () => (
    <PageLayoutNav>
      <NavList>
        <NextJSLikeLink href="#">
          <NavList.Item aria-current="page">Item 1</NavList.Item>
        </NextJSLikeLink>
        <NextJSLikeLink href="#">
          <NavList.Item>Item 2</NavList.Item>
        </NextJSLikeLink>
        <NextJSLikeLink href="#">
          <NavList.Item>Item 3</NavList.Item>
        </NextJSLikeLink>
      </NavList>
    </PageLayoutNav>
  ),
}

export const WithReloads: Story = {
  render: function WithReloadsStory() {
    const location = window.location

    const storyId = new URLSearchParams(location.search).get('id')
    const urlBase = `${location.origin + location.pathname}?id=${storyId}`
    const itemId = new URLSearchParams(location.search).get('itemId')
    const current = (id: string) => (itemId === id ? 'page' : 'false')

    return (
      <PageLayoutNav>
        <NavList>
          <NavList.Item href={`${urlBase}&itemId=1`} aria-current={current('1')}>
            Item 1
          </NavList.Item>
          <NavList.SubNav defaultOpen={itemId?.startsWith('2.')}>
            <NavList.SubNav.Trigger>Item 2</NavList.SubNav.Trigger>
            <NavList.SubNav.Panel>
              <NavList.Item href={`${urlBase}&itemId=2.1`} aria-current={current('2.1')}>
                Sub item 2.1
              </NavList.Item>
              <NavList.Item href={`${urlBase}&itemId=2.2`} aria-current={current('2.2')}>
                Sub item 2.2
              </NavList.Item>
            </NavList.SubNav.Panel>
          </NavList.SubNav>
          <NavList.SubNav defaultOpen={itemId?.startsWith('3.')}>
            <NavList.SubNav.Trigger>Item 3</NavList.SubNav.Trigger>
            <NavList.SubNav.Panel>
              <NavList.Item href={`${urlBase}&itemId=3.1`} aria-current={current('3.1')}>
                Sub item 3.1
              </NavList.Item>
              <NavList.Item href={`${urlBase}&itemId=3.2`} aria-current={current('3.2')}>
                Sub item 3.2
              </NavList.Item>
            </NavList.SubNav.Panel>
          </NavList.SubNav>
        </NavList>
      </PageLayoutNav>
    )
  },
}
export const WithInactiveItems: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Item href="#item-1" inactiveText="Unavailable due to an outage">
          Item 1
        </NavList.Item>
        <NavList.SubNav defaultOpen>
          <NavList.SubNav.Trigger>Item 2</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.Item href="#sub-item-1" aria-current="page">
              Sub item 1
            </NavList.Item>
            <NavList.Item href="#sub-item-2" inactiveText="Unavailable due to an outage">
              Sub item 2
            </NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
        <NavList.Item href="#item-3">Item 3</NavList.Item>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithGroup: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Group title="Group 1">
          <NavList.Item aria-current="true" href="#item-1-a">
            Item 1A
          </NavList.Item>
          <NavList.Item href="#item-1-b">Item 1B</NavList.Item>
          <NavList.Item href="#item-1-c">Item 1C</NavList.Item>
        </NavList.Group>
        <NavList.Group title="Group 2">
          <NavList.Item href="#item-2-a">Item 2A</NavList.Item>
          <NavList.Item href="#item-2-b">Item 2B</NavList.Item>
          <NavList.Item href="#item-2-c">Item 2C</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithGroupHeadingLinks: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Group>
          <NavList.GroupHeading>
            <a href="#group-1">Group 1</a>
          </NavList.GroupHeading>
          <NavList.Item aria-current="true" href="#item-1-a">
            Item 1A
          </NavList.Item>
          <NavList.Item href="#item-1-b">Item 1B</NavList.Item>
          <NavList.Item href="#item-1-c">Item 1C</NavList.Item>
        </NavList.Group>
        <NavList.Group>
          <NavList.GroupHeading>
            <a href="#group-2">Group 2</a>
          </NavList.GroupHeading>
          <NavList.Item href="#item-2-a">Item 2A</NavList.Item>
          <NavList.Item href="#item-2-b">Item 2B</NavList.Item>
          <NavList.Item href="#item-2-c">Item 2C</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithTrailingAction: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Item>
          <NavList.LeadingVisual>
            <FileDirectoryIcon />
          </NavList.LeadingVisual>
          Item 1
          <NavList.TrailingAction label="Expand sidebar" icon={ArrowLeftIcon} />
        </NavList.Item>
        <NavList.Item>
          Item 2
          <NavList.TrailingAction as="a" href="#" label="Some action" icon={ArrowRightIcon} />
        </NavList.Item>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithTrailingActionInSubItem: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Item>
          <NavList.LeadingVisual>
            <FileDirectoryIcon />
          </NavList.LeadingVisual>
          Item 1
          <NavList.TrailingAction label="Expand sidebar" icon={ArrowLeftIcon} />
        </NavList.Item>
        <NavList.Item>
          Item 2
          <NavList.TrailingAction as="a" href="#" label="Some action" icon={ArrowRightIcon} />
        </NavList.Item>
        <NavList.SubNav>
          <NavList.SubNav.Trigger>Item 3</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.Item href="#sub-item-1">
              Sub item 1
              <NavList.TrailingAction label="Another action" icon={BookIcon} />
            </NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
      </NavList>
    </PageLayoutNav>
  ),
}
const expandItems = [
  {href: '#', text: 'Item 4'},
  {href: '#', text: 'Item 5'},
  {href: '#', text: 'Item 6'},
  {href: '#', text: 'Item 7'},
  {href: '#', text: 'Item 8'},
  {href: '#', text: 'Item 9'},
]

const expandPlay: Story['play'] = async ({canvasElement}) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByRole('button', {name: 'Show more'}))
  await expect(canvas.getByRole('link', {name: 'Item 9'})).toBeVisible()
}

export const WithExpand: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList>
        <NavList.Item href="#" aria-current="page">
          Item 1
        </NavList.Item>
        <NavList.Item href="#">Item 2</NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
        <NavList.GroupExpand label="Show more" items={expandItems} />
      </NavList>
    </PageLayoutNav>
  ),
  play: expandPlay,
}
export const WithExpandAndIcons: Story = {
  ...WithExpand,
  play: expandPlay,
}

function renderCustomItem({
  leadingVisual: LeadingIcon,
  text,
  trailingAction: _trailingAction,
  trailingVisual: TrailingIcon,
  ...rest
}: NavListGroupExpandItem) {
  return (
    <NavList.Item key={text} onClick={() => {}} href="#" {...rest}>
      {LeadingIcon ? (
        <NavList.LeadingVisual>
          <LeadingIcon />
        </NavList.LeadingVisual>
      ) : null}
      {text}

      {TrailingIcon ? (
        <NavList.TrailingVisual>
          {typeof TrailingIcon === 'string' ? TrailingIcon : <TrailingIcon />}
          <VisuallyHidden>results</VisuallyHidden>
        </NavList.TrailingVisual>
      ) : null}
    </NavList.Item>
  )
}

export const ExpandWithCustomItems: Story = {
  render: () => {
    const items: NavListGroupExpandItem[] = [
      {href: '#', text: 'Item 4', 'aria-current': 'page'},
      {href: '#', text: 'Item 5'},
      {href: '#', text: 'Item 6'},
      {href: '#', text: 'Item 7'},
      {href: '#', text: 'Item 8'},
      {href: '#', text: 'Item 9'},
    ]

    return (
      <PageLayoutNav>
        <NavList>
          <NavList.Item href="#">Item 1</NavList.Item>
          <NavList.Item href="#">Item 2</NavList.Item>
          <NavList.Item href="#">Item 3</NavList.Item>
          <NavList.GroupExpand label="Show more" items={items} renderItem={renderCustomItem} />
        </NavList>
      </PageLayoutNav>
    )
  },
}
export const ExpandWithPages: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList>
        <NavList.Item href="#" aria-current="page">
          Item 1
        </NavList.Item>
        <NavList.Item href="#">Item 2</NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
        <NavList.GroupExpand pages={2} label="Show more" items={expandItems} />
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithGroupExpand: Story = {
  render: () => {
    const items1: NavListGroupExpandItem[] = [
      {href: '#', text: 'Item 1D'},
      {href: '#', text: 'Item 1E', trailingAction: {label: 'Some action', icon: ArrowRightIcon}},
    ]

    const items2: NavListGroupExpandItem[] = [
      {href: '#', text: 'Item 2D', trailingVisual: BookIcon},
      {href: '#', text: 'Item 2E', trailingVisual: FileDirectoryIcon},
    ]

    return (
      <PageLayoutNav>
        <NavList>
          <NavList.Group title="Group 1">
            <NavList.Item aria-current="true" href="#">
              Item 1A
            </NavList.Item>
            <NavList.Item href="#">Item 1B</NavList.Item>
            <NavList.Item href="#">Item 1C</NavList.Item>
            <NavList.GroupExpand label="More" items={items1} />
          </NavList.Group>
          <NavList.Group title="Group 2">
            <NavList.Item href="#">Item 2A</NavList.Item>
            <NavList.Item href="#">Item 2B</NavList.Item>
            <NavList.Item href="#">Item 2C</NavList.Item>
            <NavList.GroupExpand label="Show" items={items2} />
          </NavList.Group>
        </NavList>
      </PageLayoutNav>
    )
  },
}
export const GroupWithExpandAndCustomItems: Story = {
  render: () => {
    const items: NavListGroupExpandItem[] = [
      {href: '#', text: 'Commits', leadingVisual: GitCommitIcon, trailingVisual: '32k'},
      {href: '#', text: 'Packages', leadingVisual: PackageIcon, trailingVisual: '1k'},
      {href: '#', text: 'Wikis', leadingVisual: BookIcon, trailingVisual: '121'},
      {href: '#', text: 'Topics', leadingVisual: MilestoneIcon, trailingVisual: '12k'},
      {href: '#', text: 'Marketplace', leadingVisual: TelescopeIcon, trailingVisual: ArrowRightIcon},
    ]

    return (
      <NavList>
        <NavList.Group>
          <NavList.Item aria-current="page">
            <NavList.LeadingVisual>
              <CodeIcon />
            </NavList.LeadingVisual>
            Code
            <NavList.TrailingVisual>3k</NavList.TrailingVisual>
          </NavList.Item>
          <NavList.Item>
            <NavList.LeadingVisual>
              <RepoIcon />
            </NavList.LeadingVisual>
            Repositories
            <NavList.TrailingVisual>713</NavList.TrailingVisual>
          </NavList.Item>
          <NavList.Item>
            <NavList.LeadingVisual>
              <IssueOpenedIcon />
            </NavList.LeadingVisual>
            Issues
            <NavList.TrailingVisual>6k</NavList.TrailingVisual>
          </NavList.Item>
          <NavList.Item>
            <NavList.LeadingVisual>
              <GitPullRequestIcon />
            </NavList.LeadingVisual>
            Pull requests
            <NavList.TrailingVisual>4k</NavList.TrailingVisual>
          </NavList.Item>
          <NavList.Item>
            <NavList.LeadingVisual>
              <CommentDiscussionIcon />
            </NavList.LeadingVisual>
            Discussions
            <NavList.TrailingVisual>236</NavList.TrailingVisual>
          </NavList.Item>
          <NavList.Item>
            <NavList.LeadingVisual>
              <PeopleIcon />
            </NavList.LeadingVisual>
            Users
            <NavList.TrailingVisual>10k</NavList.TrailingVisual>
          </NavList.Item>
          <NavList.GroupExpand items={items} renderItem={renderCustomItem} />
        </NavList.Group>
      </NavList>
    )
  },
}
export const WithDescription: Story = {
  render: () => (
    <NavList aria-label="Settings">
      <NavList.Item href="#main" aria-current="page">
        <NavList.LeadingVisual>
          <RepoIcon />
        </NavList.LeadingVisual>
        Main Repository
        <NavList.Description>Primary project repository</NavList.Description>
      </NavList.Item>
      <NavList.Item href="#docs">
        <NavList.LeadingVisual>
          <BookIcon />
        </NavList.LeadingVisual>
        Documentation
        <NavList.Description>User guides and API documentation</NavList.Description>
      </NavList.Item>
      <NavList.Item href="#bugs">
        <NavList.LeadingVisual>
          <IssueOpenedIcon />
        </NavList.LeadingVisual>
        Bug Reports
        <NavList.Description variant="block">
          Submit and track bug reports for the project. Include detailed steps to reproduce, expected behavior, and
          system information.
        </NavList.Description>
      </NavList.Item>
      <NavList.Item href="#community">
        <NavList.LeadingVisual>
          <PeopleIcon />
        </NavList.LeadingVisual>
        Community
        <NavList.Description variant="block">
          Connect with other developers, share ideas, and collaborate on features and improvements.
        </NavList.Description>
      </NavList.Item>
      <NavList.Item href="#changes">
        <NavList.LeadingVisual>
          <GitCommitIcon />
        </NavList.LeadingVisual>
        Recent Changes
        <NavList.Description>Latest commits and releases</NavList.Description>
      </NavList.Item>
    </NavList>
  ),
}
function ItemGapExample({disableItemGap}: {disableItemGap?: boolean}) {
  return (
    <FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
      <PageLayout>
        <PageLayout.Pane position="start">
          <NavList disableItemGap={disableItemGap}>
            <NavList.Item href="#" aria-current="page">
              Home
            </NavList.Item>
            <NavList.SubNav defaultOpen>
              <NavList.SubNav.Trigger>About</NavList.SubNav.Trigger>
              <NavList.SubNav.Panel>
                <NavList.Item href="#">Team</NavList.Item>
                <NavList.Item href="#">History</NavList.Item>
              </NavList.SubNav.Panel>
            </NavList.SubNav>
            <NavList.Item href="#">Contact</NavList.Item>
          </NavList>
        </PageLayout.Pane>
      </PageLayout>
    </FeatureFlags>
  )
}

export const WithItemGap: Story = {
  name: 'With gap between items (behind feature flag)',
  render: () => <ItemGapExample />,
}
export const WithoutItemGap: Story = {
  name: 'Without gap between items (opt out)',
  render: () => <ItemGapExample disableItemGap />,
}
export const WithoutDivider: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Item href="#home" aria-current="page">
          Home
        </NavList.Item>
        <NavList.Group hideDivider>
          <NavList.SubNav defaultOpen>
            <NavList.SubNav.Trigger>About</NavList.SubNav.Trigger>
            <NavList.SubNav.Panel>
              <NavList.Item href="#team">Team</NavList.Item>
              <NavList.Item href="#history">History</NavList.Item>
            </NavList.SubNav.Panel>
          </NavList.SubNav>
          <NavList.Item href="#settings">Settings</NavList.Item>
        </NavList.Group>
        <NavList.Group>
          <NavList.Item href="#contact">Contact</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithHeading: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList>
        <NavList.Heading>Settings</NavList.Heading>
        <NavList.Group title="Account">
          <NavList.Item href="#profile" aria-current="page">
            Profile
          </NavList.Item>
          <NavList.Item href="#appearance">Appearance</NavList.Item>
        </NavList.Group>
        <NavList.Group title="Security">
          <NavList.Item href="#password">Password and authentication</NavList.Item>
          <NavList.Item href="#sessions">Sessions</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithVisuallyHiddenHeading: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList>
        <NavList.Heading visuallyHidden>Settings</NavList.Heading>
        <NavList.Group title="Account">
          <NavList.Item href="#profile" aria-current="page">
            Profile
          </NavList.Item>
          <NavList.Item href="#appearance">Appearance</NavList.Item>
        </NavList.Group>
        <NavList.Group title="Security">
          <NavList.Item href="#password">Password and authentication</NavList.Item>
          <NavList.Item href="#sessions">Sessions</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayoutNav>
  ),
}
export const CurrentItem: Story = {
  render: function CurrentItemStory() {
    const [current, setCurrent] = useState('Code')
    return (
      <NavList aria-label="Repository">
        <NavList.List>
          {['Code', 'Issues'].map(item => (
            <NavList.Item
              key={item}
              href={`#${item}`}
              aria-current={current === item ? 'page' : undefined}
              onClick={event => {
                event.preventDefault()
                setCurrent(item)
              }}
            >
              {item}
            </NavList.Item>
          ))}
        </NavList.List>
      </NavList>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('link', {name: 'Issues'}))
    await expect(canvas.getByRole('link', {name: 'Issues'})).toHaveAttribute('aria-current', 'page')
  },
}
