import type {Meta} from '@storybook/react-vite'
import {PageLayout} from '../PageLayout'
import {NavList} from './NavList'
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  BookIcon,
  FileDirectoryIcon,
  RepoIcon,
  IssueOpenedIcon,
  PlusIcon,
} from '@primer/octicons-react'
import {IconButton} from '../Button'

const meta: Meta = {
  title: 'Components/NavList/Dev',
  component: NavList,
  parameters: {
    layout: 'fullscreen',
  },
}

export const WithBadExampleOfSubNavAndTrailingAction = () => {
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
            <NavList.TrailingAction label="This is not supported and should not render!!!!!" icon={BookIcon} />
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

WithBadExampleOfSubNavAndTrailingAction.storyName = 'With SubNav and Trailing Action (Bad example, do not copy)'

export default meta

export const WithGroupTitleAndHeading = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Group title="Group 1">
          <NavList.GroupHeading>Hello</NavList.GroupHeading>
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

const CustomTrailingAction = () => {
  return <IconButton variant="invisible" aria-label="Custom trailing action" icon={PlusIcon} />
}

CustomTrailingAction.__SLOT__ = NavList.TrailingAction.__SLOT__

export const WithCustomTrailingActionSlot = () => (
  <NavList>
    <NavList.Item href="#" aria-current="page">
      <NavList.LeadingVisual>
        <RepoIcon />
      </NavList.LeadingVisual>
      Main Repository
      <NavList.Description>Primary project repository</NavList.Description>
      <CustomTrailingAction />
    </NavList.Item>
    <NavList.Item href="#">
      <NavList.LeadingVisual>
        <IssueOpenedIcon />
      </NavList.LeadingVisual>
      Bug Reports
      <NavList.Description variant="block">
        Submit and track bug reports for the project. Include detailed steps to reproduce, expected behavior, and system
        information.
      </NavList.Description>
    </NavList.Item>
    <NavList.Item href="#">
      <NavList.LeadingVisual>
        <BookIcon />
      </NavList.LeadingVisual>
      Documentation
      <NavList.Description>User guides and API documentation</NavList.Description>
      <NavList.TrailingAction label="Trailing Action" icon={BookIcon} />
    </NavList.Item>
  </NavList>
)
