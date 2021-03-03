import {GitMergeIcon, GitPullRequestIcon, IssueClosedIcon, IssueOpenedIcon, QuestionIcon} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {COMMON, get, SystemCommonProps} from './constants'
import StyledOcticon from './StyledOcticon'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const octiconMap = {
  issueOpened: IssueOpenedIcon,
  pullOpened: GitPullRequestIcon,
  issueClosed: IssueClosedIcon,
  pullClosed: GitPullRequestIcon,
  pullMerged: GitMergeIcon,
  draft: GitPullRequestIcon
}

const colorVariants = variant({
  prop: 'status',
  scale: 'stateLabels.status',
  variants: {
    issueClosed: {
      backgroundColor: 'prState.closed.bg',
      color: 'prState.closed.text',
      border: 'prState.closed.border'
    },
    pullClosed: {
      backgroundColor: 'prState.closed.bg',
      color: 'prState.closed.text',
      border: 'prState.closed.border'
    },
    pullMerged: {
      backgroundColor: 'prState.merged.bg',
      color: 'prState.merged.text',
      border: 'prState.merged.border'
    },
    issueOpened: {
      backgroundColor: 'prState.open.bg',
      color: 'prState.open.text',
      border: 'prState.open.border'
    },
    pullOpened: {
      backgroundColor: 'prState.open.bg',
      color: 'prState.open.text',
      border: 'prState.open.border'
    },
    draft: {
      backgroundColor: 'prState.draft.bg',
      color: 'prState.draft.text',
      border: 'prState.draft.border'
    }
  }
})

const sizeVariants = variant({
  prop: 'variant',
  scale: 'stateLabels.sizes',
  variants: {
    small: {
      padding: '4px 8px',
      fontSize: '12px'
    },
    normal: {
      padding: `8px 12px`,
      fontSize: '14px'
    }
  }
})

type StyledStateLabelBaseProps = {
  variant?: 'small' | 'normal'
  status?: keyof typeof octiconMap
} & SystemCommonProps &
  SxProp

const StateLabelBase = styled.span<StyledStateLabelBaseProps>`
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  line-height: 16px;
  color: ${get('colors.bg.primary')};
  text-align: center;
  border-radius: ${get('radii.3')};
  ${colorVariants};
  ${sizeVariants};
  ${COMMON};
  ${sx};
`

export type StateLabelProps = ComponentProps<typeof StateLabelBase>

function StateLabel({children, status, variant, ...rest}: StateLabelProps) {
  const octiconProps = variant === 'small' ? {width: '1em'} : {}
  return (
    <StateLabelBase {...rest} variant={variant} status={status}>
      {status && <StyledOcticon mr={1} {...octiconProps} icon={octiconMap[status] || QuestionIcon} />}
      {children}
    </StateLabelBase>
  )
}

StateLabel.defaultProps = {
  variant: 'normal'
}

export default StateLabel
