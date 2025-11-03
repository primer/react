import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import StateLabel from './StateLabel'
import VisuallyHidden from '../_VisuallyHidden'

export default {
  title: 'Components/StateLabel/Features',
  component: StateLabel,
} as Meta<ComponentProps<typeof StateLabel>>

export const IssueOpened = () => <StateLabel status="issueOpened">Open</StateLabel>
export const IssueClosed = () => <StateLabel status="issueClosed">Closed</StateLabel>
export const IssueClosedNotPlanned = () => <StateLabel status="issueClosedNotPlanned">Closed</StateLabel>
export const IssueDraft = () => <StateLabel status="issueDraft">Draft</StateLabel>

export const PullOpened = () => <StateLabel status="pullOpened">Open</StateLabel>
export const PullClosed = () => <StateLabel status="pullClosed">Closed</StateLabel>
export const PullMerged = () => <StateLabel status="pullMerged">Merged</StateLabel>
export const Queued = () => <StateLabel status="pullQueued">Queued</StateLabel>
export const Draft = () => <StateLabel status="draft">Draft</StateLabel>
export const Unavailable = () => <StateLabel status="unavailable">Unavailable</StateLabel>
export const Open = () => (
  <StateLabel status="open">
    {/* Because open is a generic status, a visually hidden text could be added to specify the type of the artifact */}
    <VisuallyHidden>Milestone</VisuallyHidden>
    Open
  </StateLabel>
)
export const Closed = () => <StateLabel status="closed">Closed</StateLabel>

export const Small = () => (
  <StateLabel status="issueOpened" variant="small">
    Open
  </StateLabel>
)
