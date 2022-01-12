import React from 'react'
import {GitMergeIcon, GitPullRequestIcon, IconProps, IssueClosedIcon, IssueOpenedIcon} from '@primer/octicons-react'
import Label from './Label2'
import {LabelColorOptions, LabelSizeKeys} from './types'

export type Statuses = 'issueClosed' | 'pullClosed' | 'pullMerged' | 'issueOpened' | 'pullOpened' | 'draft'

interface Props {
  /** Changes the visual design of the label to match the status that the label is communicating */
  status: Statuses
  /** How large the label is rendered */
  size?: LabelSizeKeys
}

const colorMap: Record<Statuses, LabelColorOptions> = {
  issueClosed: 'done',
  pullClosed: 'done',
  pullMerged: 'done',
  issueOpened: 'success',
  pullOpened: 'success',
  draft: 'primary'
}

const octiconMap: Record<Statuses, React.ComponentType<{size?: IconProps['size']}>> = {
  issueOpened: IssueOpenedIcon,
  pullOpened: GitPullRequestIcon,
  issueClosed: IssueClosedIcon,
  pullClosed: GitPullRequestIcon,
  pullMerged: GitMergeIcon,
  draft: GitPullRequestIcon
}

const StateLabel: React.FC<Props> = ({status, ...rest}) => (
  <Label filled appearance={colorMap[status]} leadingVisual={octiconMap[status]} {...rest} />
)

StateLabel.defaultProps = {
  size: 'lg'
}

export default StateLabel
