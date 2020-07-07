import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {GitMergeIcon, GitPullRequestIcon, IssueClosedIcon, IssueOpenedIcon, QuestionIcon} from '@primer/octicons-react'
import {variant} from 'styled-system'
import theme from './theme'
import {COMMON, get} from './constants'
import StyledOcticon from './StyledOcticon'
import sx from './sx'

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

const StateLabelBase = styled.span`
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

function StateLabel({children, status, variant, ...rest}) {
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

StateLabel.propTypes = {
  status: PropTypes.oneOf(['issueOpened', 'pullOpened', 'issueClosed', 'pullClosed', 'pullMerged', 'draft']).isRequired,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['small', 'normal']),
  ...COMMON.propTypes,
  ...sx.propTypes
}

export default StateLabel
