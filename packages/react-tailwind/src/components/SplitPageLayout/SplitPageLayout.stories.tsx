import type {Meta, StoryObj} from '@storybook/react-vite'
import {SplitPageLayout} from './SplitPageLayout'

const meta = {
  title: 'Layout/SplitPageLayout',
  component: SplitPageLayout,
  render: args => (
    <SplitPageLayout {...args}>
      <SplitPageLayout.Pane>Navigation</SplitPageLayout.Pane>
      <SplitPageLayout.Content>Content</SplitPageLayout.Content>
    </SplitPageLayout>
  ),
} satisfies Meta<typeof SplitPageLayout>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {}
export const WithSidebar: StoryObj<typeof meta> = {
  render: () => (
    <SplitPageLayout>
      <SplitPageLayout.Sidebar>Sidebar</SplitPageLayout.Sidebar>
      <SplitPageLayout.Content>Content</SplitPageLayout.Content>
    </SplitPageLayout>
  ),
}
