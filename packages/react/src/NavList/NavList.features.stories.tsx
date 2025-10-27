/* eslint-disable primer-react/spread-props-first */
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
  title: 'Components/NavList/Features',
  component: NavList,
  parameters: {
    layout: 'fullscreen',
  },
}

export const WithSubItems: StoryFn = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item href="#">Item 1</NavList.Item>
        <NavList.Item>
          Item 2
          <NavList.SubNav>
            <NavList.Item href="#" aria-current="page">
              Sub item 1
            </NavList.Item>
            <NavList.Item href="#">Sub item 2</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

export const WithNestedSubItems: StoryFn = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item defaultOpen={true} href="#">
          Item 1
          <NavList.SubNav>
            <NavList.Item href="#">Sub item 1</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">
          Item 2{/* NOTE: Don't nest SubNavs. For testing purposes only */}
          <NavList.SubNav>
            <NavList.Item href="#">
              Sub item 1
              <NavList.SubNav>
                <NavList.Item href="#">
                  Sub item 1.1
                  <NavList.SubNav>
                    <NavList.Item href="#">Sub item 1.1.1</NavList.Item>
                    <NavList.Item href="#">
                      Sub item 1.1.2
                      <NavList.SubNav>
                        <NavList.Item href="#">Sub item 1.1.2.1</NavList.Item>
                        <NavList.Item href="#" aria-current="page">
                          Sub item 1.1.2.2
                        </NavList.Item>
                      </NavList.SubNav>
                    </NavList.Item>
                  </NavList.SubNav>
                </NavList.Item>
                <NavList.Item href="#">Sub item 1.2</NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
            <NavList.Item href="#">Sub item 2</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

export const WithReactRouterLink = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
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
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

type NextJSLinkProps = {href: string; children: React.ReactNode}

const NextJSLikeLink = React.forwardRef<HTMLAnchorElement, NextJSLinkProps>(
  ({href, children}, ref): React.ReactElement => {
    const child = React.Children.only(children)
    const childProps = {
      ref,
      href,
    }
    return <>{React.isValidElement(child) ? React.cloneElement(child, childProps) : null}</>
  },
)

export const WithNextJsLink = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
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
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

WithNextJsLink.storyName = 'With Next JS Link'

export const WithReloads: StoryFn = () => {
  // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
  const location = window.location

  const storyId = new URLSearchParams(location.search).get('id')
  const urlBase = `${location.origin + location.pathname}?id=${storyId}`
  const itemId = new URLSearchParams(location.search).get('itemId')

  return (
    <>
      <PageLayout>
        <PageLayout.Pane position="start">
          <NavList>
            <NavList.Item href={`${urlBase}&itemId=1`} aria-current={itemId === '1' ? 'page' : 'false'}>
              Item 1
            </NavList.Item>
            <NavList.Item>
              Item 2
              <NavList.SubNav>
                <NavList.Item href={`${urlBase}&itemId=2.1`} aria-current={itemId === '2.1' ? 'page' : 'false'}>
                  Sub item 2.1
                </NavList.Item>
                <NavList.Item href={`${urlBase}&itemId=2.2`} aria-current={itemId === '2.2' ? 'page' : 'false'}>
                  Sub item 2.2
                </NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
            <NavList.Item>
              Item 3
              <NavList.SubNav>
                <NavList.Item href={`${urlBase}&itemId=3.1`} aria-current={itemId === '3.1' ? 'page' : 'false'}>
                  Sub item 3.1
                </NavList.Item>
                <NavList.Item href={`${urlBase}&itemId=3.2`} aria-current={itemId === '3.2' ? 'page' : 'false'}>
                  Sub item 3.2
                </NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
          </NavList>
        </PageLayout.Pane>
        <PageLayout.Content></PageLayout.Content>
      </PageLayout>
    </>
  )
}

export const WithInactiveItems: StoryFn = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item href="#" inactiveText="Unavailable due to an outage">
          Item 1
        </NavList.Item>
        <NavList.Item>
          Item 2
          <NavList.SubNav>
            <NavList.Item href="#" aria-current="page">
              Sub item 1
            </NavList.Item>
            <NavList.Item href="#" inactiveText="Unavailable due to an outage">
              Sub item 2
            </NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

export const WithGroup: StoryFn = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Group title="Group 1">
          <NavList.Item aria-current="true" href="#">
            Item 1A
          </NavList.Item>
          <NavList.Item href="#">Item 1B</NavList.Item>
          <NavList.Item href="#">Item 1C</NavList.Item>
        </NavList.Group>
        <NavList.Group title="Group 2">
          <NavList.Item href="#">Item 2A</NavList.Item>
          <NavList.Item href="#">Item 2B</NavList.Item>
          <NavList.Item href="#">Item 2C</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

export const WithGroupHeadingLinks: StoryFn = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Group>
          <NavList.GroupHeading>
            <a href="#group-1">Group 1</a>
          </NavList.GroupHeading>
          <NavList.Item aria-current="true" href="#">
            Item 1A
          </NavList.Item>
          <NavList.Item href="#">Item 1B</NavList.Item>
          <NavList.Item href="#">Item 1C</NavList.Item>
        </NavList.Group>
        <NavList.Group>
          <NavList.GroupHeading>
            <a href="#group-2">Group 2</a>
          </NavList.GroupHeading>
          <NavList.Item href="#">Item 2A</NavList.Item>
          <NavList.Item href="#">Item 2B</NavList.Item>
          <NavList.Item href="#">Item 2C</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

export const WithTrailingAction = () => {
  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <NavList>
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
      </PageLayout.Pane>
    </PageLayout>
  )
}

export const WithTrailingActionInSubItem = () => {
  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <NavList>
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
          <NavList.Item>
            Item 3
            <NavList.SubNav>
              <NavList.Item href="#">
                Sub item 1
                <NavList.TrailingAction label="Another action" icon={BookIcon} />
              </NavList.Item>
            </NavList.SubNav>
          </NavList.Item>
        </NavList>
      </PageLayout.Pane>
    </PageLayout>
  )
}

export const WithExpand: StoryFn = () => {
  const items = [
    {href: '#', text: 'Item 4'},
    {href: '#', text: 'Item 5'},
    {href: '#', text: 'Item 6'},
    {href: '#', text: 'Item 7'},
    {href: '#', text: 'Item 8'},
    {href: '#', text: 'Item 9'},
  ]

  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <NavList>
          <NavList.Item href="#" aria-current="page">
            Item 1
          </NavList.Item>
          <NavList.Item href="#">Item 2</NavList.Item>
          <NavList.Item href="#">Item 3</NavList.Item>
          <NavList.GroupExpand label="Show more" items={items} />
        </NavList>
      </PageLayout.Pane>
      <PageLayout.Content></PageLayout.Content>
    </PageLayout>
  )
}

export const WithExpandAndIcons: StoryFn = () => {
  const items = [
    {href: '#', text: 'Item 4'},
    {href: '#', text: 'Item 5'},
    {href: '#', text: 'Item 6'},
    {href: '#', text: 'Item 7'},
    {href: '#', text: 'Item 8'},
    {href: '#', text: 'Item 9'},
  ]

  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <NavList>
          <NavList.Item href="#" aria-current="page">
            Item 1
          </NavList.Item>
          <NavList.Item href="#">Item 2</NavList.Item>
          <NavList.Item href="#">Item 3</NavList.Item>
          <NavList.GroupExpand label="Show more" items={items} />
        </NavList>
      </PageLayout.Pane>
      <PageLayout.Content></PageLayout.Content>
    </PageLayout>
  )
}

type CustomItemProps = {
  text: string
  leadingVisual?: Icon
  trailingVisual?: Icon | string
}

export const ExpandWithCustomItems: StoryFn = () => {
  const items: {href: string; text: string; 'aria-current'?: 'page'}[] = [
    {href: '#', text: 'Item 4', 'aria-current': 'page'},
    {href: '#', text: 'Item 5'},
    {href: '#', text: 'Item 6'},
    {href: '#', text: 'Item 7'},
    {href: '#', text: 'Item 8'},
    {href: '#', text: 'Item 9'},
  ]

  const Item = ({leadingVisual, text, trailingVisual, ...rest}: CustomItemProps) => {
    return (
      <NavList.Item key={text} onClick={() => {}} href="#" {...rest}>
        {leadingVisual ? (
          <NavList.LeadingVisual>
            <Octicon icon={leadingVisual} />
          </NavList.LeadingVisual>
        ) : null}
        {text}

        {trailingVisual ? (
          <NavList.TrailingVisual>
            {typeof trailingVisual === 'string' ? (
              trailingVisual
            ) : (
              <Octicon icon={trailingVisual as React.ElementType} />
            )}
            <VisuallyHidden>results</VisuallyHidden>
          </NavList.TrailingVisual>
        ) : null}
      </NavList.Item>
    )
  }

  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <NavList>
          <NavList.Item href="#">Item 1</NavList.Item>
          <NavList.Item href="#">Item 2</NavList.Item>
          <NavList.Item href="#">Item 3</NavList.Item>
          <NavList.GroupExpand label="Show more" items={items} renderItem={Item} />
        </NavList>
      </PageLayout.Pane>
      <PageLayout.Content></PageLayout.Content>
    </PageLayout>
  )
}

export const ExpandWithPages: StoryFn = () => {
  const items = [
    {href: '#', text: 'Item 4'},
    {href: '#', text: 'Item 5'},
    {href: '#', text: 'Item 6'},
    {href: '#', text: 'Item 7'},
    {href: '#', text: 'Item 8'},
    {href: '#', text: 'Item 9'},
  ]

  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <NavList>
          <NavList.Item href="#" aria-current="page">
            Item 1
          </NavList.Item>
          <NavList.Item href="#">Item 2</NavList.Item>
          <NavList.Item href="#">Item 3</NavList.Item>
          <NavList.GroupExpand pages={2} label="Show more" items={items} />
        </NavList>
      </PageLayout.Pane>
      <PageLayout.Content></PageLayout.Content>
    </PageLayout>
  )
}

export const WithGroupExpand = () => {
  const items1 = [
    {href: '#', text: 'Item 1D'},
    {href: '#', text: 'Item 1E', trailingAction: {label: 'Some action', icon: ArrowRightIcon}},
  ]

  const items2 = [
    {href: '#', text: 'Item 2D', trailingVisual: BookIcon},
    {href: '#', text: 'Item 2E', trailingVisual: FileDirectoryIcon},
  ]

  return (
    <PageLayout>
      <PageLayout.Pane position="start">
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
      </PageLayout.Pane>
      <PageLayout.Content></PageLayout.Content>
    </PageLayout>
  )
}

export const GroupWithExpandAndCustomItems = () => {
  const Item = ({leadingVisual: LeadingVisual, text, trailingVisual: TrailingVisual, ...rest}: CustomItemProps) => {
    return (
      <NavList.Item onClick={() => {}} href="#" {...rest} key={text}>
        {LeadingVisual ? (
          <NavList.LeadingVisual>
            <LeadingVisual />
          </NavList.LeadingVisual>
        ) : null}
        {text}

        {TrailingVisual ? (
          <NavList.TrailingVisual>
            {typeof TrailingVisual === 'string' ? TrailingVisual : <TrailingVisual />}
            <VisuallyHidden>results</VisuallyHidden>
          </NavList.TrailingVisual>
        ) : null}
      </NavList.Item>
    )
  }

  const items = [
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
        <NavList.GroupExpand items={items} renderItem={Item} />
      </NavList.Group>
    </NavList>
  )
}

export default meta
