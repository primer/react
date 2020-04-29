import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {COMMON, get} from './constants'
import theme from './theme'
import sx from './sx'

const schemeMap = {
  red: 'danger',
  blue: 'default',
  yellow: 'warning',
  green: 'success'
}

const variants = variant({
  variants: {
    success: {
      borderColor: 'flash.success.border',
      bg: 'flash.success.bg'
    },
    danger: {
      borderColor: 'flash.danger.border',
      bg: 'flash.danger.bg'
    },
    warning: {
      borderColor: 'flash.warning.border',
      bg: 'flash.warning.bg'
    },
    default: {
      borderColor: 'flash.default.border',
      bg: 'flash.default.bg'
    }
  }
})

const getIconColor = (variant, theme) => get(`colors.flash.${variant}.icon`)(theme)

const StyledFlash = styled.div`
  position: relative;
  color: ${get('colors.text.grayDark')};
  padding: ${get('space.3')};
  border-style: solid;
  border-width: ${props => (props.full ? '1px 0px' : '1px')};
  border-radius: ${props => (props.full ? '0' : get('radii.2'))};
  margin-top: ${props => (props.full ? '-1px' : '0')};

  p:last-child {
    margin-bottom: 0;
  }

  svg {
    color: ${props => getIconColor(props.variant, props.theme)};
    margin-right: ${get('space.2')};
  }

  ${COMMON};
  ${variants}
  ${sx};
`

const Flash = ({variant, scheme, ...props}) => {
  if (scheme) {
    variant = schemeMap[scheme]
  } // deprecate 20.0.0
  return (
    <StyledFlash variant={variant} {...props}/>
  )
}

Flash.defaultProps = {
  theme,
  variant: 'default'
}

Flash.propTypes = {
  children: PropTypes.node,
  full: PropTypes.bool,
  scheme: PropTypes.oneOf(Object.keys(schemeMap)), // deprecate 20.0.0
  variant: PropTypes.oneOf(['default', 'warning', 'success', 'danger']),
  ...COMMON.propTypes,
  ...sx.propTypes
}

export default Flash
