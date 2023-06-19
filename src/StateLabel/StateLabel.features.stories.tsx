import React from 'react'
import {Meta} from '@storybook/react'
import {ComponentProps} from '../utils/types'
import StateLabel from './StateLabel'

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

export const Small = () => (
  <StateLabel status="issueOpened" variant="small">
    Open
  </StateLabel>
)
