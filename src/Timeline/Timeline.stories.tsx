import React from 'react'
import {Meta, Story} from '@storybook/react'
import {ComponentProps} from '../utils/types'
import Timeline from './Timeline'
import StyledOcticon from '../StyledOcticon'
import {GitCommitIcon} from '@primer/octicons-react'

export default {
  title: 'Components/Timeline',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Badge': Timeline.Badge,
    'Timeline.Body': Timeline.Body,
    'Timeline.Break': Timeline.Break,
  },
} as Meta<ComponentProps<typeof Timeline>>

export const Default = () => (
  <Timeline>
    <Timeline.Item>
      <Timeline.Badge>
        <StyledOcticon icon={GitCommitIcon} />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge>
        <StyledOcticon icon={GitCommitIcon} />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge>
        <StyledOcticon icon={GitCommitIcon} />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const Playground: Story<ComponentProps<typeof Timeline>> = args => (
  <Timeline {...args}>
    <Timeline.Item>
      <Timeline.Badge>
        <StyledOcticon icon={GitCommitIcon} />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge>
        <StyledOcticon icon={GitCommitIcon} />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge>
        <StyledOcticon icon={GitCommitIcon} />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

Playground.args = {
  clipSidebar: false,
}
