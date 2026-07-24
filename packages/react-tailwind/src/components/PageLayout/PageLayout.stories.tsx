import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageLayout} from './PageLayout'

const meta = {
  title: 'React Tailwind/Layout/PageLayout',
  component: PageLayout,
  render: args => (
    <PageLayout {...args}>
      <PageLayout.Header>Header</PageLayout.Header>
      <PageLayout.Content>Content</PageLayout.Content>
      <PageLayout.Footer>Footer</PageLayout.Footer>
    </PageLayout>
  ),
} satisfies Meta<typeof PageLayout>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {containerWidth: 'large', padding: 'condensed'}}
export const ResizablePane: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Pane resizable>Files</PageLayout.Pane>
      <PageLayout.Content>Content</PageLayout.Content>
    </PageLayout>
  ),
}
