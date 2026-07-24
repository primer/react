import type {Meta, StoryObj} from '@storybook/react-vite'
import {Timeline} from './Timeline'

const meta = {
  title: 'Layout/Timeline',
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
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {clipSidebar: 'both'}}
export const WithActions: StoryObj<typeof meta> = {
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
