import type {Meta, StoryObj} from '@storybook/react-vite'
import {SplitPageLayout} from './SplitPageLayout'

const meta = {
  title: 'React Tailwind/Layout/SplitPageLayout',
  component: SplitPageLayout,
  render: args => (
    <SplitPageLayout {...args}>
      <SplitPageLayout.Pane>Navigation</SplitPageLayout.Pane>
      <SplitPageLayout.Content>Content</SplitPageLayout.Content>
    </SplitPageLayout>
  ),
} satisfies Meta<typeof SplitPageLayout>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {}
export const WithSidebar: Story = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Sidebar>Sidebar</SplitPageLayout.Sidebar>
      <SplitPageLayout.Content>Content</SplitPageLayout.Content>
    </SplitPageLayout>
  ),
}
