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
  variants: {
    issueClosed: {
      backgroundColor: 'prState.closed.bg',
      color: 'prState.closed.text',
      borderColor: 'prState.closed.border'
    },
    pullClosed: {
      backgroundColor: 'prState.closed.bg',
      color: 'prState.closed.text',
      borderColor: 'prState.closed.border'
    },
    pullMerged: {
      backgroundColor: 'prState.merged.bg',
      color: 'prState.merged.text',
      borderColor: 'prState.merged.border'
    },
    issueOpened: {
      backgroundColor: 'prState.open.bg',
      color: 'prState.open.text',
      borderColor: 'prState.open.border'
    },
    pullOpened: {
      backgroundColor: 'prState.open.bg',
      color: 'prState.open.text',
      borderColor: 'prState.open.border'
    },
    draft: {
      backgroundColor: 'prState.draft.bg',
      color: 'prState.draft.text',
      borderColor: 'prState.draft.border'
    }
  }
})

const sizeVariants = variant({
  prop: 'variant',
  variants: {
    small: {
      paddingX: 2,
      paddingY: 1,
      fontSize: 0
    },
    normal: {
      paddingX: '12px',
      paddingY: 2,
      fontSize: 1
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
  font-weight: ${get('fontWeights.bold')};
  line-height: 16px;
  color: ${get('colors.bg.primary')};
  text-align: center;
  border-radius: ${get('radii.3')};
  border-width: 1px;
  border-style: solid;
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
