import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {colors} from './theme'
import {withSystemProps, COMMON} from './system-props'

const schemeMap = {
  red: colors.red[6],
  yellow: colors.yellow[7],
  purple: colors.purple[5],
  green: colors.green[5],
  gray: colors.gray[5]
}

function StateLabel({state, className, icon, scheme, small, children}) {
  return (
    <span className={className}>
      {icon} {children}
    </span>
  )
}

const styledLabel = styled(StateLabel)`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  font-weight: 600;
  line-height: 20px;
  color: #fff;
  text-align: center;
  background-color: ${props => (props.scheme ? schemeMap[props.scheme] : schemeMap.gray)};
  border-radius: 3px;
`

StateLabel.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  scheme: PropTypes.oneOf('red', 'yellow', 'purple', 'green', 'gray'),
  small: PropTypes.bool,
}

export default withSystemProps(styledLabel, COMMON)
