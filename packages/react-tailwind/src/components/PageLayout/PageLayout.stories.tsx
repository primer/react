import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageLayout} from './PageLayout'

const meta = {
  title: 'Layout/PageLayout',
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
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {containerWidth: 'large', padding: 'condensed'}}
export const ResizablePane: StoryObj<typeof meta> = {
  render: () => (
    <PageLayout>
      <PageLayout.Pane resizable>Files</PageLayout.Pane>
      <PageLayout.Content>Content</PageLayout.Content>
    </PageLayout>
  ),
}
