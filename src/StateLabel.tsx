import {GitMergeIcon, GitPullRequestIcon, IssueClosedIcon, IssueOpenedIcon, QuestionIcon} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {COMMON, get, SystemCommonProps} from './constants'
import StyledOcticon from './StyledOcticon'
import sx, {SxProp} from './sx'
import theme from './theme'
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
  scale: 'stateLabels.status'
})

const sizeVariants = variant({
  prop: 'variant',
  scale: 'stateLabels.sizes'
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
  color: ${get('colors.white')};
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
  theme,
  variant: 'normal'
}

export default StateLabel
