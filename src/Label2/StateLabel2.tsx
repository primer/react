import React from 'react'
import {GitMergeIcon, GitPullRequestIcon, IconProps, IssueClosedIcon, IssueOpenedIcon} from '@primer/octicons-react'
import {LabelSizeKeys} from './_labelStyleUtils'
import Label2, {LabelColorOptions} from './Label2'

type Statuses = 'issueClosed' | 'pullClosed' | 'pullMerged' | 'issueOpened' | 'pullOpened' | 'draft'

interface Props {
  status: Statuses
  // TODO: rename to "size"
  size?: LabelSizeKeys
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leadingVisual?: React.ComponentType<any>
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

const StateLabel2: React.FC<Props> = ({status, ...rest}) => (
  <Label2 filled color={colorMap[status]} leadingVisual={octiconMap[status]} {...rest} />
)

StateLabel2.defaultProps = {
  size: 'lg'
}

export default StateLabel2
