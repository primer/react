import type {StoryFn, Meta} from '@storybook/react-vite'

import {Button, Heading} from '..'
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
          <p className={classes.DeleteAccountTitle}>Delete account</p>
          <p className={classes.DeleteAccountDescription}>
            Are you sure you don&apos;t want to just downgrade your account to a free account? We won&apos;t charge your
            credit card anymore.
          </p>
        </div>
        <Button variant="danger">Delete account</Button>
      </div>
    </SplitPageLayout.Content>
  </SplitPageLayout>
)

export const WithSidebarStart: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Sidebar position="start" aria-label="Inspector sidebar" style={{height: 'auto'}}>
      <div className={classes.SidebarContent}>
        <p className={classes.SidebarHeading}>Sidebar</p>
        <p className={classes.SidebarText}>
          This sidebar spans the full height of the layout, adjacent to the header, content, and footer.
        </p>
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
          <p className={classes.DeleteAccountTitle}>Delete account</p>
          <p className={classes.DeleteAccountDescription}>
            Are you sure you don&apos;t want to just downgrade your account to a free account? We won&apos;t charge your
            credit card anymore.
          </p>
        </div>
        <Button variant="danger">Delete account</Button>
      </div>
    </SplitPageLayout.Content>
    <SplitPageLayout.Footer>
      <p>Footer content</p>
    </SplitPageLayout.Footer>
  </SplitPageLayout>
)

export const WithSidebarEnd: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Sidebar position="end" aria-label="Inspector sidebar" style={{height: 'auto'}}>
      <div className={classes.SidebarContent}>
        <p className={classes.SidebarHeading}>Inspector</p>
        <p className={classes.SidebarText}>
          This sidebar is positioned at the end (right side) and spans the full height.
        </p>
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
      <p>Main content area</p>
    </SplitPageLayout.Content>
    <SplitPageLayout.Footer>
      <p>Footer content</p>
    </SplitPageLayout.Footer>
  </SplitPageLayout>
)

export const WithResizableSidebar: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Sidebar resizable position="start" aria-label="Resizable sidebar" style={{height: 'auto'}}>
      <div className={classes.SidebarContent}>
        <p className={classes.SidebarHeading}>Resizable Sidebar</p>
        <p className={classes.SidebarText}>
          Drag the edge to resize this sidebar. The width will be persisted across sessions.
        </p>
      </div>
    </SplitPageLayout.Sidebar>
    <SplitPageLayout.Header>
      <Heading as="h1">Page Title</Heading>
    </SplitPageLayout.Header>
    <SplitPageLayout.Content>
      <Heading as="h2" className={classes.SectionHeading}>
        Main Content
      </Heading>
      <p>This layout has a resizable sidebar that can be dragged to adjust its width.</p>
    </SplitPageLayout.Content>
    <SplitPageLayout.Footer>
      <p>Footer content</p>
    </SplitPageLayout.Footer>
  </SplitPageLayout>
)

export const WithSidebarAndResizablePane: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Sidebar resizable position="start" aria-label="Navigation sidebar" style={{height: 'auto'}}>
      <div className={classes.SidebarContent}>
        <p className={classes.SidebarHeading}>Sidebar</p>
        <p className={classes.SidebarText}>Full-height resizable sidebar</p>
      </div>
    </SplitPageLayout.Sidebar>
    <SplitPageLayout.Header>
      <Heading as="h1">Page Title</Heading>
    </SplitPageLayout.Header>
    <SplitPageLayout.Pane resizable position="end" aria-label="Details pane">
      <div className={classes.SidebarContent}>
        <p className={classes.SidebarHeading}>Details Pane</p>
        <p className={classes.SidebarText}>This pane is also resizable and sits beside the content.</p>
      </div>
    </SplitPageLayout.Pane>
    <SplitPageLayout.Content>
      <Heading as="h2" className={classes.SectionHeading}>
        Main Content
      </Heading>
      <p>
        This layout demonstrates using both a full-height sidebar and a resizable pane together. The sidebar spans the
        entire height while the pane sits adjacent to the content area only.
      </p>
    </SplitPageLayout.Content>
    <SplitPageLayout.Footer>
      <p>Footer content</p>
    </SplitPageLayout.Footer>
  </SplitPageLayout>
)

export const WithStickySidebar: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Sidebar sticky position="start" aria-label="Sticky sidebar">
      <div className={classes.SidebarContent}>
        <p className={classes.SidebarHeading}>Sticky Sidebar</p>
        <p className={classes.SidebarText}>This sidebar stays fixed in the viewport as you scroll the page content.</p>
      </div>
    </SplitPageLayout.Sidebar>
    <SplitPageLayout.Header>
      <Heading as="h1">Page Title</Heading>
    </SplitPageLayout.Header>
    <SplitPageLayout.Content>
      <Heading as="h2" className={classes.SectionHeading}>
        Scrollable Content
      </Heading>
      {Array.from({length: 20}).map((_, i) => (
        <p key={i}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non ipsum.
          Maecenas imperdiet ante quam, at varius lorem molestie vel.
        </p>
      ))}
    </SplitPageLayout.Content>
    <SplitPageLayout.Footer>
      <p>Footer content</p>
    </SplitPageLayout.Footer>
  </SplitPageLayout>
)

export const SidebarFullscreenResponsiveVariant: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Sidebar
      position="start"
      responsiveVariant="fullscreen"
      aria-label="Fullscreen sidebar"
      style={{height: 'auto'}}
    >
      <div className={classes.SidebarContent}>
        <p className={classes.SidebarHeading}>Fullscreen on Narrow</p>
        <p className={classes.SidebarText}>
          Resize the viewport below 768px to see this sidebar expand to fill the entire screen.
        </p>
      </div>
    </SplitPageLayout.Sidebar>
    <SplitPageLayout.Header>
      <Heading as="h1">Page Title</Heading>
    </SplitPageLayout.Header>
    <SplitPageLayout.Content>
      <Heading as="h2" className={classes.SectionHeading}>
        Main Content
      </Heading>
      <p>This content is hidden behind the sidebar at narrow viewports.</p>
    </SplitPageLayout.Content>
    <SplitPageLayout.Footer>
      <p>Footer content</p>
    </SplitPageLayout.Footer>
  </SplitPageLayout>
)
