import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Heading} from '../Heading'
import {NavList} from '../NavList'
import {SplitPageLayout} from './SplitPageLayout'

const meta = {title: 'React Tailwind/Layout/SplitPageLayout/Features', component: SplitPageLayout} satisfies Meta<
  typeof SplitPageLayout
>
export default meta
type Story = StoryObj<typeof meta>

const sectionHeadingClassName = 'mb-2 text-[24px] font-normal text-danger'
const sidebarContentClassName = 'h-full rounded-md bg-muted p-4'
const sidebarHeadingClassName = 'mb-2 text-body-medium font-semibold'
const sidebarTextClassName = 'text-xs leading-[18px] text-muted'

function Navigation() {
  return (
    <NavList aria-label="Main navigation">
      <NavList.Item href="#">Profile</NavList.Item>
      <NavList.Item href="#" aria-current="page">
        Account
      </NavList.Item>
      <NavList.Item href="#">Emails</NavList.Item>
      <NavList.Item href="#">Notifications</NavList.Item>
    </NavList>
  )
}

function DangerZone() {
  return (
    <>
      <Heading as="h2" className={sectionHeadingClassName}>
        Danger zone
      </Heading>
      <div className="flex items-center justify-between gap-4 rounded-md border border-danger-emphasis p-4">
        <div className="grid gap-1">
          <p className="text-body-medium font-semibold text-danger">Delete account</p>
          <p className="text-body-medium text-muted">
            Are you sure you don&apos;t want to just downgrade your account to a free account? We won&apos;t charge your
            credit card anymore.
          </p>
        </div>
        <Button variant="danger">Delete account</Button>
      </div>
    </>
  )
}

export const SettingsPage: Story = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Pane position="start" aria-label="Navigation Pane">
        <Navigation />
      </SplitPageLayout.Pane>
      <SplitPageLayout.Content>
        <DangerZone />
      </SplitPageLayout.Content>
    </SplitPageLayout>
  ),
}

export const WithSidebarStart: Story = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Sidebar position="start" aria-label="Inspector sidebar" style={{height: 'auto'}}>
        <div className={sidebarContentClassName}>
          <p className={sidebarHeadingClassName}>Sidebar</p>
          <p className={sidebarTextClassName}>
            This sidebar spans the full height of the layout, adjacent to the header, content, and footer.
          </p>
        </div>
      </SplitPageLayout.Sidebar>
      <SplitPageLayout.Header>
        <Heading as="h1">Page Title</Heading>
      </SplitPageLayout.Header>
      <SplitPageLayout.Pane position="start" aria-label="Navigation Pane">
        <Navigation />
      </SplitPageLayout.Pane>
      <SplitPageLayout.Content>
        <DangerZone />
      </SplitPageLayout.Content>
      <SplitPageLayout.Footer>
        <p>Footer content</p>
      </SplitPageLayout.Footer>
    </SplitPageLayout>
  ),
}

export const WithSidebarEnd: Story = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Sidebar position="end" aria-label="Inspector sidebar" style={{height: 'auto'}}>
        <div className={sidebarContentClassName}>
          <p className={sidebarHeadingClassName}>Inspector</p>
          <p className={sidebarTextClassName}>
            This sidebar is positioned at the end (right side) and spans the full height.
          </p>
        </div>
      </SplitPageLayout.Sidebar>
      <SplitPageLayout.Header>
        <Heading as="h1">Page Title</Heading>
      </SplitPageLayout.Header>
      <SplitPageLayout.Pane position="start" aria-label="Navigation Pane">
        <Navigation />
      </SplitPageLayout.Pane>
      <SplitPageLayout.Content>
        <Heading as="h2" className={sectionHeadingClassName}>
          Account Settings
        </Heading>
        <p>Main content area</p>
      </SplitPageLayout.Content>
      <SplitPageLayout.Footer>
        <p>Footer content</p>
      </SplitPageLayout.Footer>
    </SplitPageLayout>
  ),
}

export const WithResizableSidebar: Story = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Sidebar resizable position="start" aria-label="Resizable sidebar" style={{height: 'auto'}}>
        <div className={sidebarContentClassName}>
          <p className={sidebarHeadingClassName}>Resizable Sidebar</p>
          <p className={sidebarTextClassName}>
            Drag the edge to resize this sidebar. The width will be persisted across sessions.
          </p>
        </div>
      </SplitPageLayout.Sidebar>
      <SplitPageLayout.Header>
        <Heading as="h1">Page Title</Heading>
      </SplitPageLayout.Header>
      <SplitPageLayout.Content>
        <Heading as="h2" className={sectionHeadingClassName}>
          Main Content
        </Heading>
        <p>This layout has a resizable sidebar that can be dragged to adjust its width.</p>
      </SplitPageLayout.Content>
      <SplitPageLayout.Footer>
        <p>Footer content</p>
      </SplitPageLayout.Footer>
    </SplitPageLayout>
  ),
}

export const WithSidebarAndResizablePane: Story = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Sidebar resizable position="start" aria-label="Navigation sidebar" style={{height: 'auto'}}>
        <div className={sidebarContentClassName}>
          <p className={sidebarHeadingClassName}>Sidebar</p>
          <p className={sidebarTextClassName}>Full-height resizable sidebar</p>
        </div>
      </SplitPageLayout.Sidebar>
      <SplitPageLayout.Header>
        <Heading as="h1">Page Title</Heading>
      </SplitPageLayout.Header>
      <SplitPageLayout.Pane resizable position="end" aria-label="Details pane">
        <div className={sidebarContentClassName}>
          <p className={sidebarHeadingClassName}>Details Pane</p>
          <p className={sidebarTextClassName}>This pane is also resizable and sits beside the content.</p>
        </div>
      </SplitPageLayout.Pane>
      <SplitPageLayout.Content>
        <Heading as="h2" className={sectionHeadingClassName}>
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
  ),
}

export const WithStickySidebar: Story = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Sidebar sticky position="start" aria-label="Sticky sidebar">
        <div className={sidebarContentClassName}>
          <p className={sidebarHeadingClassName}>Sticky Sidebar</p>
          <p className={sidebarTextClassName}>
            This sidebar stays fixed in the viewport as you scroll the page content.
          </p>
        </div>
      </SplitPageLayout.Sidebar>
      <SplitPageLayout.Header>
        <Heading as="h1">Page Title</Heading>
      </SplitPageLayout.Header>
      <SplitPageLayout.Content>
        <Heading as="h2" className={sectionHeadingClassName}>
          Scrollable Content
        </Heading>
        {Array.from({length: 20}).map((_, index) => (
          <p key={index}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non ipsum.
            Maecenas imperdiet ante quam, at varius lorem molestie vel.
          </p>
        ))}
      </SplitPageLayout.Content>
      <SplitPageLayout.Footer>
        <p>Footer content</p>
      </SplitPageLayout.Footer>
    </SplitPageLayout>
  ),
}

export const SidebarFullscreenResponsiveVariant: Story = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Sidebar
        position="start"
        responsiveVariant="fullscreen"
        aria-label="Fullscreen sidebar"
        style={{height: 'auto'}}
      >
        <div className={sidebarContentClassName}>
          <p className={sidebarHeadingClassName}>Fullscreen on Narrow</p>
          <p className={sidebarTextClassName}>
            Resize the viewport below 768px to see this sidebar expand to fill the entire screen.
          </p>
        </div>
      </SplitPageLayout.Sidebar>
      <SplitPageLayout.Header>
        <Heading as="h1">Page Title</Heading>
      </SplitPageLayout.Header>
      <SplitPageLayout.Content>
        <Heading as="h2" className={sectionHeadingClassName}>
          Main Content
        </Heading>
        <p>This content is hidden behind the sidebar at narrow viewports.</p>
      </SplitPageLayout.Content>
      <SplitPageLayout.Footer>
        <p>Footer content</p>
      </SplitPageLayout.Footer>
    </SplitPageLayout>
  ),
}
