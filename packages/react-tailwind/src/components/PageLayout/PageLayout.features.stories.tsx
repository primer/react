import React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {BranchName} from '../BranchName'
import {Heading} from '../Heading'
import {Link} from '../Link'
import {StateLabel} from '../StateLabel'
import {PageLayout} from './PageLayout'
import {defaultPaneWidth} from './usePaneWidth'

const meta = {title: 'React Tailwind/Layout/PageLayout/Features', component: PageLayout} satisfies Meta<
  typeof PageLayout
>
export default meta
type Story = StoryObj<typeof meta>

const paragraph =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vitae orci et magna consectetur ullamcorper eget ac purus. Nam at enim id lorem tempus egestas a non ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet massa purus. Nunc sem lectus, bibendum a sapien nec, tristique tempus felis. Ut porttitor auctor tellus in imperdiet. Ut blandit tincidunt augue, quis fringilla nunc tincidunt sed. Vestibulum auctor euismod nisi. Nullam tincidunt est in mi tincidunt dictum. Sed consectetur aliquet velit ut ornare.'
const contentParagraph =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet massa purus. Nunc sem lectus, bibendum a sapien nec, tristique tempus felis. Ut porttitor auctor tellus in imperdiet. Ut blandit tincidunt augue, quis fringilla nunc tincidunt sed. Vestibulum auctor euismod nisi. Nullam tincidunt est in mi tincidunt dictum. Sed consectetur aliquet velit ut ornare.'
const paneParagraph =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non ipsum. Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus et, auctor felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet massa purus.'

const Placeholder = ({height, label}: {height: number | string; label: string}) => (
  <div
    className="box-border grid place-items-center rounded-md border border-muted bg-inset px-6 py-1"
    style={{height}}
  >
    {label}
  </div>
)

const Paragraphs = ({count, content = contentParagraph}: {count: number; content?: string}) => (
  <div className="grid gap-4">
    {Array.from({length: count}, (_, index) => (
      <p key={index} className="m-0">
        {content}
      </p>
    ))}
  </div>
)

const layout = (props: React.ComponentProps<typeof PageLayout.Pane>) => (
  <PageLayout containerWidth="full">
    <PageLayout.Header>
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Pane {...props}>
      <Placeholder height={320} label="Pane" />
    </PageLayout.Pane>
    <PageLayout.Content>
      <Placeholder height={640} label="Content" />
    </PageLayout.Content>
    <PageLayout.Footer>
      <Placeholder height={64} label="Footer" />
    </PageLayout.Footer>
  </PageLayout>
)

export const PullRequestPage: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Header>
        <div className="grid gap-4">
          <div>
            <Heading as="h1" className="m-0 font-normal">
              Input validation styles <span className="font-light text-muted">#1831</span>
            </Heading>
            <div className="flex items-center gap-2">
              <StateLabel status="pullOpened">Open</StateLabel>
              <span className="text-sm text-muted">
                <Link href="#" muted className="inline font-semibold">
                  mperrotti
                </Link>{' '}
                wants to merge 3 commits into <BranchName href="#">main</BranchName> from{' '}
                <BranchName href="#">mp/validation-styles</BranchName>
              </span>
            </div>
          </div>
          <nav
            aria-label="Pull request navigation"
            className="flex text-sm shadow-[inset_0_-1px_var(--borderColor-default)]"
          >
            <a
              href="#conversation"
              className="rounded-t-md border-x border-t border-default px-3 py-2 text-default no-underline leading-5"
            >
              Conversation
            </a>
            <a href="#commits" className="px-3 py-2 text-default no-underline leading-5">
              Commits
            </a>
            <a href="#checks" className="px-3 py-2 text-default no-underline leading-5">
              Checks
            </a>
            <a href="#files" className="px-3 py-2 text-default no-underline leading-5">
              Files changed
            </a>
          </nav>
        </div>
      </PageLayout.Header>
      <PageLayout.Content className="flex flex-col">
        <div className="h-[200px] rounded-md border border-default" />
        <div className="mt-4 overflow-x-auto whitespace-nowrap rounded-md border border-default p-4">
          This box has really long content. If it is too long, it will cause x overflow and should show a scrollbar.
          When this overflows, it should not break to overall page layout!
        </div>
      </PageLayout.Content>
      <PageLayout.Pane aria-label="Side pane">
        <div className="grid gap-4 text-muted">
          <div>
            <strong className="block text-xs">Assignees</strong>
            <span className="text-xs leading-[1.25]">
              No one –{' '}
              <Link href="#assign" muted className="inline">
                assign yourself
              </Link>
            </span>
          </div>
          <div role="separator" className="h-px bg-[var(--borderColor-default)]" />
          <div>
            <strong className="block text-xs">Labels</strong>
            <span className="text-xs leading-[1.25]">None yet</span>
          </div>
        </div>
      </PageLayout.Pane>
    </PageLayout>
  ),
}

export const StickyPane: Story = {
  render: () => (
    <PageLayout columnGap="none" containerWidth="full" padding="none" rowGap="none">
      <PageLayout.Header divider="line" padding="normal">
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Content padding="normal" width="large">
        <Paragraphs count={30} />
      </PageLayout.Content>
      <PageLayout.Pane aria-label="Side pane" divider="line" padding="normal" position="start" resizable sticky>
        <div className="grid gap-4">
          <Paragraphs content={paneParagraph} count={10} />
          <p>
            Donec sit amet massa purus. <a href="#foo">Plura de lorem Ispum.</a>
          </p>
        </div>
      </PageLayout.Pane>
      <PageLayout.Footer divider="line" padding="normal">
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  ),
}

export const NestedScrollContainer: Story = {
  render: () => (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      <Placeholder height={120} label="Above scroll container" />
      <div className="overflow-auto">
        <PageLayout columnGap="none" containerWidth="full" padding="none" rowGap="none">
          <PageLayout.Header divider="line" padding="normal">
            <Placeholder height={64} label="Header" />
          </PageLayout.Header>
          <PageLayout.Content padding="normal" width="large">
            <div aria-label="Page content" className="grid gap-4" role="region">
              <Paragraphs count={30} />
            </div>
          </PageLayout.Content>
          <PageLayout.Pane aria-label="Side pane" divider="line" padding="normal" position="start" sticky>
            <Paragraphs content={paneParagraph} count={10} />
          </PageLayout.Pane>
          <PageLayout.Footer divider="line" padding="normal">
            <Placeholder height={64} label="Footer" />
          </PageLayout.Footer>
        </PageLayout>
      </div>
      <Placeholder height={120} label="Below scroll container" />
    </div>
  ),
}

export const CustomStickyHeader: Story = {
  render: () => (
    <div data-testid="story-window">
      <header
        className="sticky top-0 grid h-32 place-items-center border-b border-default bg-muted [z-index:100]"
        data-testid="sticky-header"
      >
        Custom sticky header
      </header>
      <PageLayout columnGap="none" containerWidth="full" padding="none" rowGap="none">
        <PageLayout.Content padding="normal" width="large">
          <div className="grid gap-4" data-testid="scrollContainer">
            <Paragraphs content={paragraph} count={30} />
          </div>
        </PageLayout.Content>
        <PageLayout.Pane
          aria-label="Aside pane"
          divider="line"
          offsetHeader="8rem"
          padding="normal"
          position="start"
          sticky
        >
          <Paragraphs content={paneParagraph} count={10} />
        </PageLayout.Pane>
        <PageLayout.Footer divider="line" padding="normal">
          <Placeholder height={64} label="Footer" />
        </PageLayout.Footer>
      </PageLayout>
    </div>
  ),
}

export const ResizablePane: Story = {
  render: () => layout({resizable: true, position: 'start', 'aria-label': 'Side pane'}),
}

export const ScrollContainerWithinPageLayoutPane: Story = {
  render: () => (
    <div className="grid h-screen grid-rows-[1fr]">
      <div className="overflow-auto">
        <Placeholder height={120} label="Above inner scroll container" />
        <PageLayout columnGap="none" containerWidth="full" padding="none" rowGap="none">
          <PageLayout.Pane aria-label="Sticky pane" divider="line" padding="normal" position="start" sticky>
            <div className="overflow-auto">
              <PageLayout.Pane aria-label="Side pane" padding="normal">
                <Placeholder height={800} label="Inner scroll container" />
              </PageLayout.Pane>
            </div>
          </PageLayout.Pane>
          <PageLayout.Content padding="normal" width="large">
            <div aria-label="Page content" className="grid gap-4" role="region">
              <Placeholder height={1600} label="Page content" />
            </div>
          </PageLayout.Content>
        </PageLayout>
        <Placeholder height={120} label="Beneath inner scroll container" />
      </div>
    </div>
  ),
}

export const CustomPaneWidths: Story = {
  render: () =>
    layout({
      'aria-label': 'Side pane',
      resizable: true,
      width: {default: '300px', min: '200px', max: '400px'},
    }),
}

export const WithCustomPaneHeading: Story = {
  render: () => (
    <PageLayout containerWidth="full">
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Pane aria-label="Side pane" position="start" resizable>
        <h2 className="mt-0 text-title-medium">Pane Heading</h2>
        <Placeholder height={320} label="Pane" />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Placeholder height={640} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  ),
}

export const SidebarStart: Story = {
  render: () => (
    <PageLayout containerWidth="full">
      <PageLayout.Sidebar aria-label="Navigation sidebar" position="start">
        <Placeholder height={800} label="Sidebar (Start)" />
      </PageLayout.Sidebar>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Content>
        <Placeholder height={640} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  ),
}

export const SidebarEnd: Story = {
  render: () => (
    <PageLayout containerWidth="full">
      <PageLayout.Sidebar aria-label="Inspector sidebar" position="end">
        <Placeholder height={800} label="Sidebar (End)" />
      </PageLayout.Sidebar>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Content>
        <Placeholder height={640} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  ),
}

export const ResizableSidebar: Story = {
  render: () => (
    <PageLayout containerWidth="full">
      <PageLayout.Sidebar
        aria-label="Resizable sidebar"
        position="end"
        resizable
        style={{height: 'auto'}}
        width={{default: '300px', min: '200px', max: '2000px'}}
      >
        <Placeholder height="100%" label="Resizable Sidebar" />
      </PageLayout.Sidebar>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Pane aria-label="Side pane" position="start">
        <Placeholder height={320} label="Pane" />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Placeholder height={640} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  ),
}

export const SidebarWithPaneResizable: Story = {
  render: () => (
    <PageLayout containerWidth="full">
      <PageLayout.Sidebar
        aria-label="Navigation sidebar"
        position="end"
        resizable
        style={{height: 'auto'}}
        width={{default: '300px', min: '200px', max: '2000px'}}
      >
        <Placeholder height="100%" label="Resizable Sidebar" />
      </PageLayout.Sidebar>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Pane aria-label="Side pane" position="start" resizable>
        <Placeholder height={320} label="Resizable Pane" />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Placeholder height={640} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  ),
}

const ControlledSidebar = ({persist}: {persist: boolean}) => {
  const key = 'page-layout-features-stories-custom-persistence-sidebar-width'
  const [currentWidth, setCurrentWidth] = React.useState(defaultPaneWidth.medium)
  const onResizeEnd = (nextWidth: number) => {
    setCurrentWidth(nextWidth)
    if (persist) window.localStorage.setItem(key, String(nextWidth))
  }

  return (
    <PageLayout containerWidth="full">
      <PageLayout.Sidebar
        aria-label={persist ? 'Resizable sidebar (custom persistence)' : 'Resizable sidebar (controlled)'}
        currentWidth={currentWidth}
        onResizeEnd={onResizeEnd}
        position="start"
        resizable
        style={{height: 'auto'}}
        width={{default: `${defaultPaneWidth.medium}px`, min: '200px', max: '600px'}}
      >
        <Placeholder height="100%" label={`Sidebar (width: ${currentWidth}px)`} />
      </PageLayout.Sidebar>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Content>
        <Placeholder height={640} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  )
}

export const ResizableSidebarWithoutPersistence: Story = {render: () => <ControlledSidebar persist={false} />}
ResizableSidebarWithoutPersistence.storyName = 'Resizable sidebar without persistence'

export const ResizableSidebarWithCustomPersistence: Story = {render: () => <ControlledSidebar persist />}
ResizableSidebarWithCustomPersistence.storyName = 'Resizable sidebar with custom persistence'

export const StickySidebar: Story = {
  render: () => (
    <PageLayout containerWidth="full">
      <PageLayout.Sidebar aria-label="Sticky sidebar" position="start" sticky>
        <Placeholder height={200} label="Sticky Sidebar" />
      </PageLayout.Sidebar>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Content>
        <Placeholder height={2000} label="Tall Content (scroll to test sticky)" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  ),
}

export const SidebarFullscreenResponsiveVariant: Story = {
  render: () => (
    <PageLayout containerWidth="full">
      <PageLayout.Sidebar aria-label="Fullscreen sidebar" position="start" responsiveVariant="fullscreen">
        <Placeholder height={800} label="Sidebar (fullscreen at narrow)" />
      </PageLayout.Sidebar>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Content>
        <Placeholder height={640} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  ),
}

const ControlledPane = ({
  persist,
  width = 'medium',
}: {
  persist: boolean
  width?: React.ComponentProps<typeof PageLayout.Pane>['width']
}) => {
  const key = 'page-layout-features-stories-custom-persistence-pane-width'
  const [currentWidth, setCurrentWidth] = React.useState(defaultPaneWidth.medium)
  const onResizeEnd = (nextWidth: number) => {
    setCurrentWidth(nextWidth)
    if (persist) window.localStorage.setItem(key, String(nextWidth))
  }

  return (
    <PageLayout>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Pane
        aria-label="Side pane"
        currentWidth={currentWidth}
        onResizeEnd={onResizeEnd}
        resizable
        width={width}
      >
        <Placeholder height={320} label={`Pane (width: ${currentWidth}px)`} />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Placeholder height={640} label="Content" />
      </PageLayout.Content>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  )
}

export const ResizablePaneWithoutPersistence: Story = {render: () => <ControlledPane persist={false} />}
ResizablePaneWithoutPersistence.storyName = 'Resizable pane without persistence'

export const ResizablePaneWithCustomPersistence: Story = {
  render: () => <ControlledPane persist width={{default: '296px', min: '256px', max: '600px'}} />,
}
ResizablePaneWithCustomPersistence.storyName = 'Resizable pane with custom persistence'

export const ResizablePaneWithNumberWidth: Story = {render: () => <ControlledPane persist width="medium" />}
ResizablePaneWithNumberWidth.storyName = 'Resizable pane with number width'

export const ResizablePaneWithControlledWidth: Story = {
  render: () => <ControlledPane persist width={{default: '296px', min: '256px', max: '600px'}} />,
}
ResizablePaneWithControlledWidth.storyName = 'Resizable pane with controlled width (new API)'

export const HeaderDividerResponsive: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Header divider={{narrow: 'filled', regular: 'line'}}>Header</PageLayout.Header>
      <PageLayout.Content>Content</PageLayout.Content>
    </PageLayout>
  ),
}

export const HeaderHiddenResponsive: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Header hidden={{narrow: true, regular: false}}>Header</PageLayout.Header>
      <PageLayout.Content>Content</PageLayout.Content>
    </PageLayout>
  ),
}

export const FooterDividerResponsive: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Content>Content</PageLayout.Content>
      <PageLayout.Footer divider="filled">Footer</PageLayout.Footer>
    </PageLayout>
  ),
}

export const FooterHiddenResponsive: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Content>Content</PageLayout.Content>
      <PageLayout.Footer hidden={{narrow: true, regular: false}}>Footer</PageLayout.Footer>
    </PageLayout>
  ),
}

export const ContentHiddenResponsive: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Content hidden={{narrow: true, regular: false}}>Content</PageLayout.Content>
    </PageLayout>
  ),
}

export const PanePositionResponsive: Story = {
  render: () => layout({position: {narrow: 'end', regular: 'start', wide: 'end'}}),
}

export const PaneDividerResponsive: Story = {
  render: () => layout({divider: {narrow: 'filled', regular: 'line', wide: 'none'}, position: 'start'}),
}

export const PaneHiddenResponsive: Story = {
  render: () => layout({hidden: {narrow: true, regular: false}, position: 'start'}),
}
