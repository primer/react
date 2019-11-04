import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {layout} from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'
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
  ${layout.width}
`

const ProgressBar = ({progress, bg, theme, ...rest}) => {
  return (
    <ProgressContainer theme={theme} {...rest}>
      <Bar progress={progress} bg={bg} theme={theme} />
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
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  theme: PropTypes.object,
  width: systemPropTypes.layout.width
}

export default ProgressBar
