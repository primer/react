import React from 'react'
import {GitMergeIcon, GitPullRequestIcon, IconProps, IssueClosedIcon, IssueOpenedIcon} from '@primer/octicons-react'
import styled from 'styled-components'
import {get} from '../constants'
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

const LeadingVisualContainer = styled('span')`
  flex-shrink: 0;
  line-height: 0;
  margin-right: ${get('space.1')};
`

const StateLabel: React.FC<Props> = ({children, status, size}) => {
  const LeadingVisual = octiconMap[status]

  return (
    <Label filled scheme={colorMap[status]} size={size}>
      <LeadingVisualContainer aria-hidden={true}>
        <LeadingVisual />
      </LeadingVisualContainer>
      {children}
    </Label>
  )
}

StateLabel.defaultProps = {
  size: 'large'
}

export default StateLabel
