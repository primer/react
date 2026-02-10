import type {StoryFn, Meta} from '@storybook/react-vite'

import {Button, Heading, Text} from '..'
import {NavList} from '../NavList'
import {SplitPageLayout} from '../SplitPageLayout'
import classes from './SplitPageLayout.features.stories.module.css'

export default {
  title: 'Components/SplitPageLayout/Features',
  component: SplitPageLayout,
} as Meta<typeof SplitPageLayout>

export const SettingsPage: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Pane position="start" aria-label="Navigation Pane">
      <NavList aria-label="Main navigation">
        <NavList.Item href="#">Profile</NavList.Item>
        <NavList.Item href="#" aria-current="page">
          Account
        </NavList.Item>
        <NavList.Item href="#">Emails</NavList.Item>
        <NavList.Item href="#">Notifications</NavList.Item>
      </NavList>
    </SplitPageLayout.Pane>
    <SplitPageLayout.Content>
      <Heading as="h2" className={classes.SectionHeading}>
        Danger zone
      </Heading>
      <div className={classes.DeleteAccountContainer}>
        <div className={classes.DeleteAccountTextContainer}>
          <Text className={classes.DeleteAccountTitle}>Delete account</Text>
          <Text className={classes.DeleteAccountDescription}>
            Are you sure you don&apos;t want to just downgrade your account to a free account? We won&apos;t charge your
            credit card anymore.
          </Text>
        </div>
        <Button variant="danger">Delete account</Button>
      </div>
    </SplitPageLayout.Content>
  </SplitPageLayout>
)

export const WithSidebarStart: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Sidebar position="start" aria-label="Inspector sidebar">
      <div className={classes.SidebarContent}>
        <Text className={classes.SidebarHeading}>Sidebar</Text>
        <Text className={classes.SidebarText}>
          This sidebar spans the full height of the layout, adjacent to the header, content, and footer.
        </Text>
      </div>
    </SplitPageLayout.Sidebar>
    <SplitPageLayout.Header>
      <Heading as="h1">Page Title</Heading>
    </SplitPageLayout.Header>
    <SplitPageLayout.Pane position="start" aria-label="Navigation Pane">
      <NavList aria-label="Main navigation">
        <NavList.Item href="#">Profile</NavList.Item>
        <NavList.Item href="#" aria-current="page">
          Account
        </NavList.Item>
        <NavList.Item href="#">Emails</NavList.Item>
        <NavList.Item href="#">Notifications</NavList.Item>
      </NavList>
    </SplitPageLayout.Pane>
    <SplitPageLayout.Content>
      <Heading as="h2" className={classes.SectionHeading}>
        Danger zone
      </Heading>
      <div className={classes.DeleteAccountContainer}>
        <div className={classes.DeleteAccountTextContainer}>
          <Text className={classes.DeleteAccountTitle}>Delete account</Text>
          <Text className={classes.DeleteAccountDescription}>
            Are you sure you don&apos;t want to just downgrade your account to a free account? We won&apos;t charge your
            credit card anymore.
          </Text>
        </div>
        <Button variant="danger">Delete account</Button>
      </div>
    </SplitPageLayout.Content>
    <SplitPageLayout.Footer>
      <Text>Footer content</Text>
    </SplitPageLayout.Footer>
  </SplitPageLayout>
)

export const WithSidebarEnd: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Sidebar position="end" aria-label="Inspector sidebar">
      <div className={classes.SidebarContent}>
        <Text className={classes.SidebarHeading}>Inspector</Text>
        <Text className={classes.SidebarText}>
          This sidebar is positioned at the end (right side) and spans the full height.
        </Text>
      </div>
    </SplitPageLayout.Sidebar>
    <SplitPageLayout.Header>
      <Heading as="h1">Page Title</Heading>
    </SplitPageLayout.Header>
    <SplitPageLayout.Pane position="start" aria-label="Navigation Pane">
      <NavList aria-label="Main navigation">
        <NavList.Item href="#">Profile</NavList.Item>
        <NavList.Item href="#" aria-current="page">
          Account
        </NavList.Item>
        <NavList.Item href="#">Emails</NavList.Item>
        <NavList.Item href="#">Notifications</NavList.Item>
      </NavList>
    </SplitPageLayout.Pane>
    <SplitPageLayout.Content>
      <Heading as="h2" className={classes.SectionHeading}>
        Account Settings
      </Heading>
      <Text>Main content area</Text>
    </SplitPageLayout.Content>
    <SplitPageLayout.Footer>
      <Text>Footer content</Text>
    </SplitPageLayout.Footer>
  </SplitPageLayout>
)

export const WithResizableSidebar: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Sidebar resizable position="start" aria-label="Resizable sidebar">
      <div className={classes.SidebarContent}>
        <Text className={classes.SidebarHeading}>Resizable Sidebar</Text>
        <Text className={classes.SidebarText}>
          Drag the edge to resize this sidebar. The width will be persisted across sessions.
        </Text>
      </div>
    </SplitPageLayout.Sidebar>
    <SplitPageLayout.Header>
      <Heading as="h1">Page Title</Heading>
    </SplitPageLayout.Header>
    <SplitPageLayout.Content>
      <Heading as="h2" className={classes.SectionHeading}>
        Main Content
      </Heading>
      <Text>This layout has a resizable sidebar that can be dragged to adjust its width.</Text>
    </SplitPageLayout.Content>
    <SplitPageLayout.Footer>
      <Text>Footer content</Text>
    </SplitPageLayout.Footer>
  </SplitPageLayout>
)

export const WithSidebarAndResizablePane: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Sidebar resizable position="start" aria-label="Navigation sidebar">
      <div className={classes.SidebarContent}>
        <Text className={classes.SidebarHeading}>Sidebar</Text>
        <Text className={classes.SidebarText}>Full-height resizable sidebar</Text>
      </div>
    </SplitPageLayout.Sidebar>
    <SplitPageLayout.Header>
      <Heading as="h1">Page Title</Heading>
    </SplitPageLayout.Header>
    <SplitPageLayout.Pane resizable position="end" aria-label="Details pane">
      <div className={classes.SidebarContent}>
        <Text className={classes.SidebarHeading}>Details Pane</Text>
        <Text className={classes.SidebarText}>This pane is also resizable and sits beside the content.</Text>
      </div>
    </SplitPageLayout.Pane>
    <SplitPageLayout.Content>
      <Heading as="h2" className={classes.SectionHeading}>
        Main Content
      </Heading>
      <Text>
        This layout demonstrates using both a full-height sidebar and a resizable pane together. The sidebar spans the
        entire height while the pane sits adjacent to the content area only.
      </Text>
    </SplitPageLayout.Content>
    <SplitPageLayout.Footer>
      <Text>Footer content</Text>
    </SplitPageLayout.Footer>
  </SplitPageLayout>
)
