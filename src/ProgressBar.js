import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from './theme'
import {COMMON, get} from './constants'

const Bar = styled.span`
  width: ${props => (props.progress ? `${props.progress}%` : 0)};
  ${COMMON}
`

const sizeMap = {
  small: '5px',
  large: '10px',
  default: '8px'
}

const ProgressContainer = styled.span`
  display: flex;
  height: ${get('spacing.2')};
  overflow: hidden;
  background-color: ${get('colors.gray.2')};
  border-radius: ${get('radii.1')}px;
  height: ${props => sizeMap[props.size]};
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
  size: 'default',
  theme
}

ProgressBar.propTypes = {
  ...COMMON.propTypes,
  progress: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  size: PropTypes.oneOf(['small', 'default', 'large'])
}

export default ProgressBar
