import type {Meta, StoryObj} from '@storybook/react-vite'
import {Timeline} from './Timeline'

const meta = {
  title: 'React Tailwind/Layout/Timeline',
  component: Timeline,
  render: args => (
    <Timeline {...args}>
      <Timeline.Item>
        <Timeline.Badge variant="success">✓</Timeline.Badge>
        <Timeline.Body>Issue opened</Timeline.Body>
      </Timeline.Item>
    </Timeline>
  ),
} satisfies Meta<typeof Timeline>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {clipSidebar: 'both'}}
export const WithActions: Story = {
  render: () => (
    <Timeline>
      <Timeline.Item>
        <Timeline.Badge variant="accent">i</Timeline.Badge>
        <Timeline.Body>Comment added</Timeline.Body>
        <Timeline.Actions>
          <button type="button">More</button>
        </Timeline.Actions>
      </Timeline.Item>
    </Timeline>
  ),
}
