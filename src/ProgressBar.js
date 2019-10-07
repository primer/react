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
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  overflow: hidden;
  background-color: ${get('colors.gray.2')};
  border-radius: ${get('radii.1')}px;
  height: ${props => sizeMap[props.barSize]};
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
  barSize: 'default',
  theme
}

ProgressBar.propTypes = {
  ...COMMON.propTypes,
  barSize: PropTypes.oneOf(['small', 'default', 'large']),
  inline: PropTypes.bool,
  progress: PropTypes.oneOf([PropTypes.string, PropTypes.number])
}

export default ProgressBar
