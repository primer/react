import React from 'react'
import {Meta} from '@storybook/react'
import {ComponentProps} from '../utils/types'
import Timeline from './Timeline'
import StyledOcticon from '../StyledOcticon'
import {GitBranchIcon, GitCommitIcon, GitMergeIcon} from '@primer/octicons-react'
import Link from '../Link'

export default {
  title: 'Components/Timeline/Features',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Badge': Timeline.Badge,
    'Timeline.Body': Timeline.Body,
    'Timeline.Break': Timeline.Break,
  },
} as Meta<ComponentProps<typeof Timeline>>

export const ClipSidebar = () => (
  <Timeline clipSidebar>
    <Timeline.Item>
      <Timeline.Badge>
        <StyledOcticon icon={GitCommitIcon} />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const CondensedItems = () => (
  <Timeline>
    <Timeline.Item condensed>
      <Timeline.Badge>
        <StyledOcticon icon={GitCommitIcon} />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item condensed>
      <Timeline.Badge>
        <StyledOcticon icon={GitCommitIcon} />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const TimelineBreak = () => (
  <Timeline>
    <Timeline.Item>
      <Timeline.Badge sx={{bg: 'done.emphasis'}}>
        <StyledOcticon icon={GitMergeIcon} color="fg.onEmphasis" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Break />
    <Timeline.Item>
      <Timeline.Badge>
        <StyledOcticon icon={GitBranchIcon} />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const WithInlineLinks = () => (
  <Timeline>
    <Timeline.Item>
      <Timeline.Badge>
        <StyledOcticon icon={GitCommitIcon} />
      </Timeline.Badge>
      <Timeline.Body>
        <Link href="#" sx={{fontWeight: 'bold', color: 'fg.default', mr: 1}} muted>
          Monalisa
        </Link>
        enabled auto-merge (squash)
      </Timeline.Body>
    </Timeline.Item>
  </Timeline>
)
