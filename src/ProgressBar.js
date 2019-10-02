import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from './theme'
import {COMMON, get} from './constants'

const Bar = styled.span`
  width: ${props => (props.progress ? `${props.progress}%` : 0)};
  ${COMMON}
`

const ProgressContainer = styled.span`
  display: flex;
  height: ${get('spacing.2')};
  overflow: hidden;
  background-color: ${get('colors.gray.2')};
  border-radius: ${get('radii.1')}px;
  height: ${props => (props.large ? '10px' : '5px')};
  ${COMMON}
`

const ProgressBar = ({progress, bg, ...rest}) => {
  return (
    <ProgressContainer {...rest}>
      <Bar progress={progress} bg={bg} />
    </ProgressContainer>
  )
}

ProgressBar.defaultProps = {
  bg: 'green.5',
  theme
}

ProgressBar.propTypes = {
  ...COMMON.propTypes,
  large: PropTypes.bool,
  progress: PropTypes.oneOf(PropTypes.string, PropTypes.number)
}

export default ProgressBar
