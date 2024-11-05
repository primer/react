import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import Timeline from './Timeline'
import Octicon from '../Octicon'
import {GitCommitIcon} from '@primer/octicons-react'
import {FeatureFlags} from '../FeatureFlags'

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
  <FeatureFlags flags={{primer_react_timeline_as_list: true}}>
    <Timeline>
      <Timeline.Group>
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>This is a message</Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>This is a message</Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>This is a message</Timeline.Body>
        </Timeline.Item>
      </Timeline.Group>
    </Timeline>
  </FeatureFlags>
)

export const Playground: StoryFn<ComponentProps<typeof Timeline>> = args => (
  <FeatureFlags flags={{primer_react_timeline_as_list: true}}>
    <Timeline {...args}>
      <Timeline.Group>
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>This is a message</Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>This is a message</Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>This is a message</Timeline.Body>
        </Timeline.Item>
      </Timeline.Group>
    </Timeline>
  </FeatureFlags>
)

Playground.args = {
  clipSidebar: false,
}
