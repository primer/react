import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {GitMerge, GitPullRequest, IssueClosed, IssueOpened, Question} from '@primer/octicons-react'
import {variant} from 'styled-system'
import theme, {colors} from './theme'
import {COMMON, get} from './constants'
import StyledOcticon from './StyledOcticon'
import sx from './sx'

const octiconMap = {
  issueOpened: IssueOpened,
  pullOpened: GitPullRequest,
  issueClosed: IssueClosed,
  pullClosed: GitPullRequest,
  pullMerged: GitMerge
}

const colorVariants = variant({
  prop: 'status',
  scale: 'stateLabels.status',
  // https://styled-system.com/variants/#migrating-from-legacy-api
  variants: {
    ...theme.stateLabels.status
  }
})

const sizeVariants = variant({
  prop: 'variant',
  scale: 'stateLabels.sizes',
  // https://styled-system.com/variants/#migrating-from-legacy-api
  variants: {
    ...theme.stateLabels.sizes
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
  border-radius: ${get('radii.3')};
  ${colorVariants};
  ${sizeVariants};
  ${COMMON};
  ${sx};
`

StateLabel.defaultProps = {
  theme,
  variant: 'normal'
}

StateLabel.propTypes = {
  status: PropTypes.oneOf(['issueOpened', 'pullOpened', 'issueClosed', 'pullClosed', 'pullMerged']).isRequired,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['small', 'normal']),
  ...COMMON.propTypes,
  ...sx.propTypes
}

export default StateLabel
