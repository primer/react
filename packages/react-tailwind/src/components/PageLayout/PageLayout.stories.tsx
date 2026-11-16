import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageLayout} from './PageLayout'

function Placeholder({height, label}: {height: number; label: string}) {
  return (
    <div className="grid place-items-center rounded-md border-thin border-muted bg-inset px-6 py-1" style={{height}}>
      {label}
    </div>
  )
}

const meta = {
  title: 'React Tailwind/Layout/PageLayout',
  component: PageLayout,
  parameters: {layout: 'fullscreen'},
  render: args => (
    <PageLayout {...args}>
      <PageLayout.Header>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
      <PageLayout.Content>
        <Placeholder height={400} label="Content" />
      </PageLayout.Content>
      <PageLayout.Pane>
        <Placeholder height={200} label="Pane" />
      </PageLayout.Pane>
      <PageLayout.Footer>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    </PageLayout>
  ),
  args: {
    containerWidth: 'xlarge',
    padding: 'normal',
    rowGap: 'normal',
    columnGap: 'normal',
  },
  argTypes: {
    containerWidth: {
      control: 'select',
      options: ['full', 'medium', 'large', 'xlarge'],
    },
    padding: {control: 'select', options: ['none', 'condensed', 'normal']},
    rowGap: {control: 'select', options: ['none', 'condensed', 'normal']},
    columnGap: {control: 'select', options: ['none', 'condensed', 'normal']},
  },
} satisfies Meta<typeof PageLayout>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {
  args: {
    containerWidth: 'xlarge',
    padding: 'normal',
    rowGap: 'normal',
    columnGap: 'normal',
  },
}
export const ResizablePane: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Pane resizable>Files</PageLayout.Pane>
      <PageLayout.Content>Content</PageLayout.Content>
    </PageLayout>
  ),
}
