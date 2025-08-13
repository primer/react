import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import Timeline from './Timeline'
import Octicon from '../Octicon'
import {GitCommitIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import classes from './Timeline.dev.stories.module.css'

export default {
  title: 'Components/Timeline/Dev',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Badge': Timeline.Badge,
    'Timeline.Body': Timeline.Body,
    'Timeline.Break': Timeline.Break,
  },
} as Meta<ComponentProps<typeof Timeline>>

export const SxProps = () => (
  <Timeline className={classes.TimelineWithMarginLeft} style={{border: '1px solid red'}}>
    <Timeline.Item className={classes.TimelineItemWithPadding} style={{border: '1px solid pink'}}>
      <Timeline.Badge className={classes.TimelineBadgeCanvas}>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body className={clsx(classes.TimelineBodySubtle, 'mt-0')} style={{border: '1px solid green'}}>
        This is a message
      </Timeline.Body>
    </Timeline.Item>
    <Timeline.Item color="gray">
      <Timeline.Badge className={classes.TimelineBadgeDanger}>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body className={classes.TimelineBodyDefault}>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Break className={classes.TimelineBreakThick} style={{border: '1px solid gray'}} />
    <Timeline.Item condensed={true}>
      <Timeline.Badge className={classes.TimelineBadgeAccent}>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)
