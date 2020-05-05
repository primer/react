import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {GitMerge, GitPullRequest, IssueClosed, IssueOpened, Question} from '@primer/octicons-react'
import {variant} from 'styled-system'
import theme, {colors} from './theme'
import {COMMON, get} from './constants'
import StyledOcticon from './StyledOcticon'

const octiconMap = {
  issueOpened: IssueOpened,
  pullOpened: GitPullRequest,
  issueClosed: IssueClosed,
  pullClosed: GitPullRequest,
  pullMerged: GitMerge
}

const buildColorVariant = state => ({
  [state]: {backgroundColor: get(`stateLabels.colors.${state}`)}
})

const colorVariant = variant({
  prop: 'status',
  variants: {
    ...buildColorVariant('issueOpened'),
    ...buildColorVariant('issueClosed'),
    ...buildColorVariant('pullOpened'),
    ...buildColorVariant('pullClosed'),
    ...buildColorVariant('pullMerged')
  }
})

const sizeVariant = variant({
  variants: {
    small: {
      py: 1,
      px: 2,
      fontSize: 0
    },
    large: {
      py: 2,
      px: '12px',
      fontSize: 1
    }
  }
})

function StateLabelBase({className, status, variant = 'large', children}) {
  const octiconProps = variant === 'small' ? {width: '1em'} : {}
  return (
    <span className={className}>
      {status && <StyledOcticon mr={1} {...octiconProps} icon={octiconMap[status] || Question} />}
      {children}
    </span>
  )
}

const StateLabel = styled(StateLabelBase)`
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  line-height: 16px;
  color: ${colors.white};
  text-align: center;
  background-color: ${get('stateLabels.colors.unknown')};
  ${colorVariant};
  border-radius: ${get('radii.3')};
  ${sizeVariant};
  ${COMMON};
`

StateLabel.defaultProps = {
  theme,
  variant: 'large'
}

StateLabel.propTypes = {
  status: PropTypes.oneOf(['issueOpened', 'pullOpened', 'issueClosed', 'pullClosed', 'pullMerged']),
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['small', 'large']),
  ...COMMON.propTypes
}

export default StateLabel
