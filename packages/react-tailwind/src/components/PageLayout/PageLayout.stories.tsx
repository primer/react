import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageLayout} from './PageLayout'

const meta = {
  title: 'React Tailwind/Layout/PageLayout',
  component: PageLayout,
  render: args => (
    <PageLayout {...args}>
      <PageLayout.Header>
        <div className="h-16 bg-muted p-4">Header</div>
      </PageLayout.Header>
      <PageLayout.Content>
        <div className="h-[400px] bg-muted p-4">Content</div>
      </PageLayout.Content>
      <PageLayout.Pane>
        <div className="h-[200px] bg-muted p-4">Pane</div>
      </PageLayout.Pane>
      <PageLayout.Footer>
        <div className="h-16 bg-muted p-4">Footer</div>
      </PageLayout.Footer>
    </PageLayout>
  ),
  args: {containerWidth: 'xlarge', padding: 'normal', rowGap: 'normal', columnGap: 'normal'},
} satisfies Meta<typeof PageLayout>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {
  args: {containerWidth: 'xlarge', padding: 'normal', rowGap: 'normal', columnGap: 'normal'},
}
export const ResizablePane: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Pane resizable>Files</PageLayout.Pane>
      <PageLayout.Content>Content</PageLayout.Content>
    </PageLayout>
  ),
}
