import type {Meta, StoryObj} from '@storybook/react-vite'
import {SplitPageLayout} from './SplitPageLayout'

function Placeholder({height, label}: {height?: number; label: string}) {
  return (
    <div
      className="box-border grid place-items-center rounded-md border border-muted bg-inset px-6 py-1"
      style={{height}}
    >
      {label}
    </div>
  )
}

const meta = {
  title: 'React Tailwind/Layout/SplitPageLayout',
  component: SplitPageLayout,
  parameters: {layout: 'fullscreen'},
  render: args => (
    <SplitPageLayout {...args}>
      <SplitPageLayout.Header>
        <Placeholder height={64} label="Header" />
      </SplitPageLayout.Header>
      <SplitPageLayout.Pane>
        <Placeholder height={200} label="Pane" />
      </SplitPageLayout.Pane>
      <SplitPageLayout.Content>
        <Placeholder height={400} label="Content" />
      </SplitPageLayout.Content>
      <SplitPageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </SplitPageLayout.Footer>
    </SplitPageLayout>
  ),
  argTypes: {
    containerWidth: {
      control: 'select',
      options: ['full', 'medium', 'large', 'xlarge'],
    },
    padding: {control: 'select', options: ['none', 'condensed', 'normal']},
    rowGap: {control: 'select', options: ['none', 'condensed', 'normal']},
    columnGap: {control: 'select', options: ['none', 'condensed', 'normal']},
  },
} satisfies Meta<typeof SplitPageLayout>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Header>
        <Placeholder height={100} label="Header" />
      </SplitPageLayout.Header>
      <SplitPageLayout.Pane aria-label="Pane" position="start">
        <Placeholder height={400} label="Pane" />
      </SplitPageLayout.Pane>
      <SplitPageLayout.Content>
        <Placeholder height={600} label="Content" />
      </SplitPageLayout.Content>
      <SplitPageLayout.Footer>
        <Placeholder height={100} label="Footer" />
      </SplitPageLayout.Footer>
    </SplitPageLayout>
  ),
}
export const Playground: Story = {
  args: {
    containerWidth: 'full',
    padding: 'none',
    rowGap: 'none',
    columnGap: 'none',
  },
  render: args => (
    <SplitPageLayout {...args}>
      <SplitPageLayout.Content>
        <Placeholder label="Content" />
      </SplitPageLayout.Content>
    </SplitPageLayout>
  ),
}
export const WithSidebar: Story = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Sidebar>Sidebar</SplitPageLayout.Sidebar>
      <SplitPageLayout.Content>Content</SplitPageLayout.Content>
    </SplitPageLayout>
  ),
}
