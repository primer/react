import {GitMergeIcon, GitPullRequestIcon, IssueClosedIcon, IssueOpenedIcon, QuestionIcon} from '@primer/styled-octicons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {COMMON, get} from './constants'
import sx from './sx'
import theme from './theme'
import {useDeprecation} from './utils/deprecate'

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

function StateLabel({children, small, status, variant, theme, ...rest}) {
  const deprecate = useDeprecation({
    name: "StateLabel 'small' prop",
    message: "Use variant='small' or variant='normal' instead.",
    version: '20.0.0'
  })

  if (small) {
    deprecate()
    variant = 'small'
  }

  const octiconProps = variant === 'small' ? {width: '1em'} : {}
  const Icon = octiconMap[status] || QuestionIcon
  return (
    <StateLabelBase {...rest} theme={theme} variant={variant} status={status}>
      {status && <Icon mr={1} theme={theme} {...octiconProps} />}
      {children}
    </StateLabelBase>
  )
}

StateLabel.defaultProps = {
  theme,
  variant: 'normal'
}

StateLabel.propTypes = {
  small: PropTypes.bool,
  status: PropTypes.oneOf(['issueOpened', 'pullOpened', 'issueClosed', 'pullClosed', 'pullMerged', 'draft']).isRequired,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['small', 'normal']),
  ...COMMON.propTypes,
  ...sx.propTypes
}

export default StateLabel
