import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import sx from './sx'

function IconWrapper({icon: IconComponent, className, ...rest}) {
  return <IconComponent className={className} {...rest} />
}

const StyledOcticon = styled(IconWrapper)`
  ${COMMON}
  ${sx}
`

StyledOcticon.defaultProps = {
  theme,
  size: 16
}

StyledOcticon.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  icon: PropTypes.elementType.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['small', 'medium', 'large'])]),
  theme: PropTypes.object,
  verticalAlign: PropTypes.oneOf(['middle', 'text-bottom', 'text-top', 'top'])
}

export default StyledOcticon
