import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {CheckIcon} from '@primer/octicons-react'
import {Timeline} from './Timeline'

const meta = {
  title: 'React Tailwind/Layout/Timeline/Examples',
  component: Timeline,
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

export const ActivityStream: Story = {
  render: () => (
    <Timeline>
      <Timeline.Item>
        <Timeline.Badge variant="success">
          <CheckIcon aria-label="Deployment completed" />
        </Timeline.Badge>
        <Timeline.Body>Deployment completed successfully.</Timeline.Body>
      </Timeline.Item>
    </Timeline>
  ),
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('Deployment completed successfully.')).toBeVisible()
  },
}
