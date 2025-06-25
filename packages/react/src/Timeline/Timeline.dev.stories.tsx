import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import Timeline from './Timeline'
import Octicon from '../Octicon'
import {GitCommitIcon} from '@primer/octicons-react'

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
  <Timeline
    sx={{
      ml: 4,
    }}
    style={{border: '1px solid red'}}
  >
    <Timeline.Item
      sx={{
        pt: 2,
        pb: 1,
      }}
      style={{border: '1px solid pink'}}
    >
      <Timeline.Badge
        sx={{
          backgroundColor: 'canvas.default',
        }}
      >
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body
        sx={{
          color: 'fg.subtle',
          fontSize: '14px',
          width: '100%',
          paddingRight: 5,
          display: 'flex',
          flexDirection: 'column',
        }}
        className="mt-0"
        style={{border: '1px solid green'}}
      >
        This is a message
      </Timeline.Body>
    </Timeline.Item>
    <Timeline.Item color="gray">
      <Timeline.Badge
        sx={{
          bg: 'danger.emphasis',
        }}
      >
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body
        sx={{
          color: 'fg.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        This is a message
      </Timeline.Body>
    </Timeline.Item>
    <Timeline.Break
      sx={{
        borderWidth: '2px',
      }}
      style={{border: '1px solid gray'}}
    />
    <Timeline.Item condensed={true}>
      <Timeline.Badge
        sx={{
          mt: 2,
          bg: 'accent.emphasis',
        }}
      >
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)
