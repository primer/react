import type {Meta, StoryObj} from '@storybook/react-vite'
import {GitCommitIcon} from '@primer/octicons-react'
import {Link} from '../Link'
import {Timeline} from './Timeline'
import {InlineAvatar} from './Timeline.storyHelpers'

const meta = {
  title: 'React Tailwind/Layout/Timeline',
  component: Timeline,
  render: args => (
    <Timeline {...args}>
      <Timeline.Item>
        <Timeline.Badge>
          <GitCommitIcon aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>This is a message</Timeline.Body>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge>
          <GitCommitIcon aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>This is a message</Timeline.Body>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge>
          <GitCommitIcon aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>This is a message</Timeline.Body>
      </Timeline.Item>
    </Timeline>
  ),
} satisfies Meta<typeof Timeline>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {
  render: () => (
    <div className="max-w-[1012px] pl-[72px]">
      <Timeline>
        <Timeline.Item>
          <Timeline.Badge>
            <GitCommitIcon aria-hidden="true" />
          </Timeline.Badge>
          <Timeline.Body>
            <InlineAvatar
              className="relative -top-px"
              size={20}
              src="https://avatars.githubusercontent.com/u/92997159?v=4"
            />
            <Link className="font-semibold text-default" href="#" muted>
              monalisa
            </Link>{' '}
            performed an action{' '}
            <Link className="underline" href="#" inline muted>
              just now
            </Link>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </div>
  ),
}
